<template>
    <div class="box">
      <title-bar :title="this.$route.query.title" />

      <van-tabs class="dy-rate-tab" v-model="viewMode" @click="toggleViewStyle">
        <van-tab title="评分项目视角"></van-tab>
        <van-tab title="班级视角"></van-tab>
      </van-tabs>

      <van-row>
        <van-col span="12">
          <van-cell title="全部评分项目" is-link @click="showPicker(0)" />
        </van-col>
        <van-col span="12">
          <van-cell title="全部班级" is-link @click="showPicker(1)" />
        </van-col>
      </van-row>

      <div class="wapper">
        <div class="content">
          <FormPanel v-for="item in taskList" :task="item" :key="item.ID" />
        </div>
        <div class="footer">
            <van-button class="error" @click="doAbanden">放弃</van-button>
            <van-button class="submit">提交</van-button>
        </div>
      </div>

      <van-popup  position="bottom" get-container="body" :style="{ height: '30%' }" v-model="pickerShow">
        
      </van-popup>
    </div>
</template>
<script>
import { ViewBox, XButton } from "vux";
import TitleBar from "./TitleBar";
import FormPanel from "./FormPanel";
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
  Loading
} from "vant";

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
    ViewBox,
    TitleBar,
    XButton,
    FormPanel
  },
  data() {
    return {
      /**
       * 0: 选项视角， 1：班级视角
       */
      viewMode: 0,
      /**
       * 选择器
       */
      pickerShow: false,

      taskList: [],
      optionList: [],
      classList: []
    };
  },
  activated() {
    console.log("form", this.$route.query);
    this.fetchList(this.viewMode);
  },
  computed: {},
  methods: {
    async fetchList(viewMode) {
      let seq_id = this.$route.query.id;
      let see_mode = viewMode === 0 ? "DETAIL" : "CLASS";
      let detail_id = "";
      let class_id = "";

      try {
        let resp = await this.$http.get(
          `${
            apiRouter.TASK_LIST
          }?seq_id=${seq_id}&class_id=${class_id}&detail_id=${detail_id}&see_mode=${see_mode}`
        );
        if (resp.status === 200) {
          let respBody = resp.body;
          if (respBody.code === 200) {
            let { class_list, data_list, detail_list } = respBody.data;

            this.taskList = data_list;
            this.optionList = detail_list;
            this.classList = class_list;
            
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
        message: "<h3>确定将这些项目标记为弃填？</h3>"
      }).then(() => {
        // on close
      });
    },
    toggleViewStyle(e) {
      console.log(e, this.viewMode);
    },
    showPicker(i) {
      console.log(i, this.viewMode);
      this.pickerShow = true;
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

  h3 {
    font-size: 18px;
    font-weight: 900;
  }

  .van-dialog__footer {
    background-color: #f5a99e;
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
