<template>
  <div class="box">
    <title-bar :title="this.$route.query.title" @willBack="handleWillBack" />

    <van-tabs class="dy-rate-tab" v-model="viewMode" @change="toggleViewStyle">
      <van-tab title="评分项目视角"></van-tab>
      <van-tab title="班级视角"></van-tab>
    </van-tabs>

    <van-row v-if="viewMode===0">
      <van-col span="12">
        <van-cell :title="optionChecked.NAME" is-link @click="showPicker(0)" />
      </van-col>
      <van-col span="12">
        <van-cell :title="classChecked.CLASS_NAME" is-link @click="showPicker(1)" />
      </van-col>
    </van-row>
    <van-row v-else>
      <van-col span="12">
        <van-cell :title="classChecked.CLASS_NAME" is-link @click="showPicker(1)" />
      </van-col>
      <van-col span="12">
        <van-cell :title="optionChecked.NAME" is-link @click="showPicker(0)" />
      </van-col>
    </van-row>

    <div class="wapper">
      <div class="content" ref="container">
        <FormPanel
          v-for="(item, index) in taskList"
          :key="`${item.__hash}`"
          :task="item"
          :index="index"
          :step="step"
          :io="io"
          :setPreviewState="setPreviewState"
          @modify="handleModify"
        />
      </div>
      <div class="footer">
        <van-button class="error" @click="doAbanden">弃填</van-button>
        <van-button class="submit" @click="doSubmit(0)">提交</van-button>
      </div>
    </div>

    <van-popup position="bottom" :style1="{ height: '36%' }" v-model="pickerShow0">
      <van-picker
        ref="picker0"
        value-key="NAME"
        cancel-button-text="　"
        show-toolbar
        :columns="optionList"
        @confirm="onOptionConfirm"
      />
    </van-popup>

    <van-popup position="bottom" :style1="{ height: '36%' }" v-model="pickerShow1">
      <van-picker
        ref="picker1"
        value-key="CLASS_NAME"
        cancel-button-text="　"
        show-toolbar
        :columns="classList"
        @confirm="onClassConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import { ViewBox, XButton } from "vux";
import TitleBar from "./components/TitleBar";
import FormPanel from "./components/FormPanel";
import apiRouter from "../../../config/api.js";

import {
  Col,
  Row,
  Cell,
  Button,
  Dialog,
  Tab,
  Tabs,
  Popup,
  Loading,
  Picker
} from "vant";

const defaultOptionChecked = {
  CODE: "",
  NAME: "全部评分项目"
};

const defaultClassChecked = {
  CLASS_ID: "",
  CLASS_NAME: "全部班级"
};

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Row.name]: Row,
    [Col.name]: Col,
    [Cell.name]: Cell,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Popup.name]: Popup,
    [Loading.name]: Loading,
    [Picker.name]: Picker,
    ViewBox,
    TitleBar,
    XButton,
    FormPanel
  },
  data() {
    /**
     * 任务ID
     */
    this.seq_id = this.$route.query.id;

    this.previewOn = false;
    this.setPreviewState = s => {
      this.previewOn = s;
    };

    let that = this;

    return {
      io: new IntersectionObserver((entries, observer) => {
        // console.log(entries);
        entries.forEach(entry => {
          // debugger;
          if (entry.intersectionRatio > 0) {
            // console.log('change', entry.target.getAttribute('data-index'));
            let taskIndex = entry.target.getAttribute("data-index");
            let task = that.taskList[taskIndex];
            task.__shown = true;
            observer.unobserve(entry.target);
          }
        });
      }),
      /**
       * 选择0显示状态
       */
      pickerShow0: false,
      /**
       * 选择器1显示状态
       */
      pickerShow1: false,

      /**
       * 0: 选项视角， 1：班级视角
       */
      viewMode: 0,

      /**
       * 数据是否改变
       */
      dataModified: false,

      /**
       * 数字评分的步进长
       */
      step: 1,

      /**
       * 评分表单数组
       */
      taskList: [],

      /**
       * 评分选项数组
       */
      optionList: [defaultOptionChecked],
      optionIndex: 0,

      /**
       * 班级数组
       */
      classList: [defaultClassChecked],
      classIndex: 0
    };
  },
  activated() {
    // console.log("form", this.$route.query);
    // debugger;
    this.viewMode = 0;
    this.dataModified = false;
    this.taskList = [];
    this.optionIndex = 0;
    this.optionList = [defaultOptionChecked];
    this.classIndex = 0;
    this.classList = [defaultClassChecked];

    this.fetchList();
  },
  beforeRouteLeave(to, from, next) {
    if (this.previewOn) {
      next(false);
    }
    // else if (this.dataModified) {
    //   const answer = window.confirm("已有录入数据，确定放弃数据并离开页面？");
    //   if (answer) {
    //     next();
    //   } else {
    //     next(false);
    //   }
    // }
    else {
      window.onbeforeunload = null;
      next();
    }
  },
  computed: {
    optionChecked() {
      return this.optionList[this.optionIndex];
    },
    classChecked() {
      return this.classList[this.classIndex];
    }
  },
  methods: {
    async handleWillBack() {
      if (this.dataModified) {
        let answer = await Dialog.confirm({
          className: "dy-rate-dialog",
          title: "关闭页面提醒",
          message: "页面已录入部分数据，关闭页面后数据将被清空。",
          confirmButtonText: "确定",
          messageAlign: "left"
        });
        if (answer === "confirm") {
          this.$router.back();
        }
      } else {
        this.$router.back();
      }
    },
    handleModify(b) {
      this.dataModified = b;

      if (b) {
        window.onbeforeunload = function(e) {
          e.preventDefault();
          e.returnValue = "已有录入数据，确定放弃数据并离开页面？";
        };
      }
      else{
        window.onbeforeunload = null;
      }
    },
    async fetchList() {
      let see_mode = this.viewMode === 0 ? "DETAIL" : "CLASS";
      let detail_id = this.optionChecked.CODE;
      let class_id = this.classChecked.CLASS_ID;

      try {
        // debugger;
        let resp = await this.$http.get(
          `${apiRouter.CLASS_RATE_TASK_LIST}?seq_id=${
            this.seq_id
          }&class_id=${class_id}&detail_id=${detail_id}&see_mode=${see_mode}`
        );
        if (resp.status === 200) {
          let respBody = resp.body;
          if (respBody.code === 200) {
            let container = this.$refs.container;
            // console.log('container' ,container.offsetTop  ,container.scrollTop);
            container.scrollTop = 0;
            // debugger;
            let {
              class_list,
              data_list,
              detail_list,
              step_value
            } = respBody.data;

            data_list.forEach(task => {
              task.__shown = false;
              task.__hash = task.ID + "-" + Date.now() + "-" + Math.random();
            });
            this.taskList = data_list;

            detail_list.unshift(defaultOptionChecked);
            this.optionList = detail_list;

            class_list.unshift(defaultClassChecked);
            this.classList = class_list;

            this.step = Number(step_value);
          } else {
            alert(respBody.message);
          }
        } else {
          alert("请求失败!");
        }
      } catch (e) {
        alert(e.message);
      }
    },
    async doAbanden() {
      Dialog.confirm({
        className: "dy-rate-dialog",
        title: "弃填",
        message: "确定将这些项目标记为弃填？",
        confirmButtonText: "确定"
      }).then(() => {
        this.doSubmit(1);
      });
    },
    async doSubmit(is_give_up) {
      let detail_arr = [];
      let taskArr = JSON.parse(JSON.stringify(this.taskList));
      taskArr.forEach(task => {
        detail_arr.push({
          SCORE: "" + task.SCORE,
          ID: task.ID,
          COMMENT: task.COMMENT
        });
      });
      // console.log(is_give_up, detail_arr);

      try {
        // debugger;
        const sendData = {
          seq_id: this.seq_id,
          is_give_up,
          detail_arr: JSON.stringify(detail_arr)
        };

        let resp = await this.$http.post(apiRouter.CLASS_RATE_SUBMIT, sendData);

        if (resp.status === 200) {
          let respBody = resp.body;
          if (respBody.code === 200) {
            alert("操作成功");
            this.$router.back();
          } else {
            alert(respBody.message);
          }
        } else {
          alert("请求失败!");
        }
      } catch (e) {
        alert(e.message);
      }
    },
    toggleViewStyle() {
      // console.log(this.viewMode);
      this.classIndex = 0;
      this.optionIndex = 0;
      this.classList = [defaultClassChecked];
      this.optionList = [defaultOptionChecked];
      this.fetchList();
    },
    showPicker(i) {
      // console.log(i, this.viewMode);
      this["pickerShow" + i] = true;
    },
    onClassConfirm(checkedItem, index) {
      if (index !== this.classIndex) {
        // console.log(this.classIndex, index);
        this.classIndex = index;

        if (this.viewMode === 1) {
          this.optionIndex = 0;
          this.$refs.picker0 && this.$refs.picker0.setColumnIndex(0);
        }

        this.fetchList();
      }

      this["pickerShow1"] = false;
    },
    onOptionConfirm(checkedItem, index) {
      if (index !== this.optionIndex) {
        // console.log(this.optionIndex, index);
        this.optionIndex = index;

        if (this.viewMode === 0) {
          this.classIndex = 0;
          this.$refs.picker1 && this.$refs.picker1.setColumnIndex(0);
        }

        this.fetchList();
      }

      this["pickerShow0"] = false;

      // console.log(
      //   "onOptionConfirm",
      //   JSON.parse(JSON.stringify(checkedItem)),
      //   index
      // );
    }
  }
};
</script>
<style lang="less">
.dy-rate-tab {
  .van-tab--active {
    .van-tab__text {
      font-size: 14px;
      color: #48b319;
    }
  }

  .van-tabs__line {
    width: 50%;
    background-color: #48b319;
  }
}

.dy-rate-dialog {
  border-radius: 6px;

  .van-dialog__header {
    font-weight: bold;
  }
  .van-dialog__message {
    font-size: 16px;
    font-weight: normal;
    color: #333;
  }

  .van-button__text {
    font-weight: bold;
  }
  .van-dialog__confirm {
    // color: #ED561B;
  }
}
</style>
<style lang="less" scoped>
@import "../../../style/minxin.less";
@footerHeight: 60px;

.box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.wapper {
  position: relative;
  height: 100%;
  background-color: #fafafa;
}
.content {
  position: absolute;
  top: 0;
  bottom: @footerHeight;
  overflow: scroll;
  width: 100%;
}
.footer {
  position: fixed;
  bottom: 0;
  height: @footerHeight;
  width: 100%;

  > button {
    display: inline-block;
    line-height: 0;
    height: 10.7vw;
    width: 26.7vw;
    color: #fff;
    margin: 5px 4vw 3vw;
    border-radius: 0;
    font-size: 18px;

    &.error {
      background-color: #e12727;
    }

    &.submit {
      background-color: #48b319;
      float: right;
    }
  }
}
</style>
