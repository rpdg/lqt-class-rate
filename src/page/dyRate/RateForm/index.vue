<template>
  <div class="box">
    <title-bar :title="this.$route.query.title" @willBack="handleWillBack" />

    <van-tabs class="dy-rate-tab" v-model="viewMode" @change="toggleViewStyle">
      <van-tab title="评分项目视角"></van-tab>
      <van-tab title="班级视角"></van-tab>
    </van-tabs>

    <div v-if="inited">
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
    </div>

    <div class="wapper">
      <div class="content" ref="container">
        <center v-if="loading" style="margin-top:1em;">
          <van-loading size="24px">加载中...</van-loading>
        </center>
        <FormPanel
          v-else
          v-for="(item, index) in taskList"
          :key="`${item.__hash}`"
          :task="item"
          :index="index"
          :step="step"
          :setPreviewState="setPreviewState"
          @modify="handleModify"
        />
      </div>
      <div class="footer">
        <van-button class="error" @click="doAbanden">弃填</van-button>
        <van-button class="submit" @click="doSubmit(0)">提交</van-button>
      </div>
    </div>

    <van-popup position="bottom" v-model="pickerShow0" :lazy-render="false">
      <van-picker
        ref="picker0"
        value-key="NAME"
        cancel-button-text="　"
        show-toolbar
        :columns="optionList"
        @confirm="onOptionConfirm"
      />
    </van-popup>

    <van-popup position="bottom" v-model="pickerShow1" :lazy-render="false">
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
import wx from "weixin-js-sdk";
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

    /**
     * 第一个选项ID
     */
    this.first_optionId = this.$route.query.foId;

    /**
     * 第一个班级ID
     */
    this.first_classId = this.$route.query.fcId;

    this.previewOn = false;
    this.setPreviewState = s => {
      this.previewOn = s;
    };

    let that = this;

    return {
      inited: false,
      loading: false,
      urlPath: "",

      // io: new IntersectionObserver((entries, observer) => {
      //   // console.log(entries);
      //   entries.forEach(entry => {
      //     // debugger;
      //     if (entry.intersectionRatio > 0) {
      //       // console.log('change', entry.target.getAttribute('data-index'));
      //       let taskIndex = entry.target.getAttribute("data-index");
      //       let task = that.taskList[taskIndex];
      //       task.__shown = true;
      //       observer.unobserve(entry.target);
      //     }
      //   });
      // }),

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
  mounted() {
    //this.loadData();
    this.urlPath = window.location.href.split("#")[0];
    this.configWechat();
  },
  activated() {
    // console.log("form", this.$route.query);
    // debugger;
    this.seq_id = this.$route.query.id;
    this.first_optionId = this.$route.query.foId;
    this.first_classId = this.$route.query.fcId;

    this.viewMode = 0;
    this.previewOn = false;
    this.inited = false;

    this.dataModified = false;

    this.init();
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
    configWechat() {
      let wiexin =
        (process.env.NODE_ENV === "development"
          ? "http://opg.vaiwan.com/api/wechat?url="
          : apiRouter.GET_CONFIG) + encodeURIComponent(this.urlPath);

      this.$http.get(wiexin).then(
        response => {
          let data = response.body;
          // debugger;
          wx.config({
            debug: process.env.NODE_ENV === "development", // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              "chooseImage",
              "uploadImage",
              "downloadImage",
              "getLocalImgData",
              "previewImage",
              "getFileSystemManager",
              "chooseWXPay"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function(res) {
            console.log(res);
            // alert(res.errMsg);
          });
        },
        response => {
          // console.log("请求失败了!!!!")
        }
      );
    },
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
          this.viewMode = 0;
          this.$router.back();
        }
      } else {
        this.viewMode = 0;
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
      } else {
        window.onbeforeunload = null;
      }
    },
    async init() {
      this.inited = false;
      this.loading = true;
      // reset
      this.taskList = [];

      this.optionIndex = 0;
      this.optionList = [defaultOptionChecked];

      this.classIndex = 0;
      this.classList = [defaultClassChecked];

      const seq_id = this.seq_id;
      // fetch and auto select the first option
      const see_mode = this.viewMode === 0 ? "DETAIL" : "CLASS";
      const detail_id = this.viewMode === 0 ? this.first_optionId : "";
      const class_id = this.viewMode === 0 ? "" : this.first_classId;

      // alert(JSON.stringify({ seq_id, detail_id, class_id, see_mode }));
      try {
        let result = await this.$http.get(
          `${
            apiRouter.CLASS_RATE_TASK_LIST
          }?seq_id=${seq_id}&class_id=${class_id}&detail_id=${detail_id}&see_mode=${see_mode}`
        );

        if (result.status === 200) {
          let respBody = result.body;
          if (respBody.code === 200) {
            let {
              class_list,
              detail_list,
              step_value,
              data_list
            } = respBody.data;

            detail_list.unshift(defaultOptionChecked);
            this.optionList = detail_list;

            class_list.unshift(defaultClassChecked);
            this.classList = class_list;

            this.step = Number(step_value);

            data_list.forEach(task => {
              task.__shown = true;
              // task.__shown = false;
              task.__hash = task.ID + "-" + Date.now() + "-" + Math.random();

              if (task.IMG_LIST.length > 4) {
                task.IMG_LIST.length = 4;
              }
            });
            this.taskList = data_list;

            this.$nextTick(() => {
              // debugger;
              if (this.viewMode === 1) {
                if (this.$refs.picker1) {
                  // let a = this.$refs.picker1.getColumnIndex(0);
                  this.$refs.picker1.setColumnIndex(0, 1);
                  this.classIndex = 1;
                }
              } else {
                if (this.$refs.picker0) {
                  // let a = this.$refs.picker0.getColumnIndex(0);
                  this.$refs.picker0.setColumnIndex(0, 1);
                  this.optionIndex = 1;
                }
              }

              this.inited = true;

              // this.fetchList();
            });
          } else {
            alert(respBody.message);
          }
        } else {
          alert(respBody.message);
        }
      } catch (e) {
        alert(e.message);
      } finally {
        this.inited = true;
        this.loading = false;
      }

      //
    },
    async fetchList() {
      this.loading = true;
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
              task.__shown = true;
              // task.__shown = false;
              task.__hash = task.ID + "-" + Date.now() + "-" + Math.random();

              if (task.IMG_LIST.length > 4) {
                task.IMG_LIST.length = 4;
              }
            });
            this.taskList = data_list;

            if (this.viewMode === 1) {
              detail_list.unshift(defaultOptionChecked);
              this.optionList = detail_list;
            } else {
              class_list.unshift(defaultClassChecked);
              this.classList = class_list;
            }
          } else {
            alert(respBody.message);
          }
        } else {
          alert("请求失败!");
        }
      } catch (e) {
        alert(e.message);
      } finally {
        this.loading = false;
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
            // alert();

            this.taskList.forEach(task => {
              task.WRITE_STATUS = is_give_up ? "-1" : "1";
            });

            try {
              let answer = await Dialog.confirm({
                className: "dy-rate-dialog",
                title: is_give_up ? "弃填成功" : "提交成功",
                message: "返回列表页吗？",
                confirmButtonText: "确定",
                confirmButtonColor: "#54B331",
                cancelButtonText: "不返回"
              });

              if (answer === "confirm") {
                this.$router.back();
              }
            } catch (e) {
            } finally {
              this.handleModify(false);
            }
          } else {
            alert("server.error ", respBody.message);
          }
        } else {
          alert("请求失败!");
        }
      } catch (e) {
        alert("server.error ", e.message);
      }
    },
    toggleViewStyle() {
      // console.log(this.viewMode);
      // this.classIndex = 0;
      // this.optionIndex = 0;
      // this.classList = [defaultClassChecked];
      // this.optionList = [defaultOptionChecked];
      this.init();
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
          this.$refs.picker0 && this.$refs.picker0.setColumnIndex(0, 0);
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
          this.$refs.picker1 && this.$refs.picker1.setColumnIndex(0, 0);
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
.van-picker__confirm {
  font-size: 16px;
  color: #333;
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
    margin: 5px 15px 3vw;
    padding-top: 2px;
    border-radius: 0;
    font-size: 18px;

    &.error {
      background-color: #ee0a24;
    }

    &.submit {
      background-color: #48b319;
      float: right;
    }
  }

  .van-button--default {
    border: 1px solid transparent;
    border-radius: 3px;
  }
}
</style>
