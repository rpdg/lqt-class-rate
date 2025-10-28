<template>
  <div style="word-break: break-word">
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="活动报名问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="goNewList"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem 1rem 1em 1rem">
      <h2 style="font-size: 1.3em;text-align: center">{{detail.title}}</h2>
      <div style="font-size: 1.1em;min-height: 5rem;margin-top: 1em;word-break: break-word;">
        {{detail.content}}
      </div>
      <div style="text-align: right;font-size: 1.2em;">
        <p>{{detail.pubName}}</p>
        <p>{{detail.pubTime}}</p>
      </div>

      <van-icon name="https://b.yzcdn.cn/vant/icon-demo-1126.png"/>


      <div style="font-size: 1.2em;">

        <div style="margin-bottom: 3px">
          <div style="border-left: #48B319 3px solid;padding-left: 1em;margin-bottom: 1em">报名统计</div>
        </div>
        <div style="font-size: 14px;color: #494949;padding-bottom: 1em;">

          <flexbox :gutter="0">
            <flexbox-item :span="1/5">
              <div class="flex-demo">总数:{{detail.signupCount}}</div>
            </flexbox-item>
            <flexbox-item :span="4/5">
              <div>
                <box gap="10px" style="width:70%;display: inline-block;vertical-align: middle;">
                  <x-progress :percent="Number(detail.signupPoint)" :show-cancel="false"></x-progress>
                </box>
                <!--<box gap="10px">
                  <x-progress :percent="60" :show-cancel="false"></x-progress>
                </box>-->
                <span style="width: 29%; padding-left: 1em;">{{ detail.signupPoint }}%</span>
              </div>
            </flexbox-item>

            <!--<flexbox-item :span="1/5">
              <div class="flex-demo"></div>
            </flexbox-item>-->
          </flexbox>
        </div>
      </div>


      <toast
        v-model="showPositionValue"
        type="text"
        :time="800"
        is-show-mask
        :position="position"
      >
        {{toastMessage}}
      </toast>

    </div>

    <div style="border-bottom: #D8D8D8 1px solid"></div>
    <div style="padding: 1em 0">
      <div v-if="undoListShow && detail.undoList.length > 0">
        <div>
          <img style="height: 1em;vertical-align: text-top;" src="@/assets/question/warring.png"/>
          未完成问卷人员：
        </div>
        <div>
          <span v-for="item in detail.undoList">{{item}}</span>
        </div>
      </div>
      <!--<div v-if="!undoListShow">
        <div>
          <div v-for="op in detail.userList">
            {{op.hideFlag == '1'?'匿名':op.userName }}&nbsp;&nbsp;&nbsp;{{op.userValue}}&nbsp;&nbsp;{{op.tipsValue}}
          </div>
        </div>
      </div>-->



      <div v-if="!undoListShow">
        <div v-for="(op,index) in detail.userList">
          <div :class="index%2==0?'':'single-row'" style="padding:0.5em 1em">
            <flexbox>
              <flexbox-item :span="3/10">
                <div class="flex-demo">{{ op.hideFlag == '1'?'匿名':op.userName }}</div>
              </flexbox-item>
              <flexbox-item :span="7/10">
                <div class="flex-demo">
                  {{op.userValue}}&nbsp;&nbsp;{{op.tipsValue}}
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {XTextarea, Toast, Flexbox, FlexboxItem,XProgress,Box} from 'vux'
  import {Field, Button, Slider, Icon,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../../config/api.js"

  export default {
    components: {
      XTextarea,
      Toast,
      Flexbox,
      FlexboxItem,
      XProgress,
      Box,
      [Field.name]: Field,
      [Button.name]: Button,
      [Slider.name]: Slider,
      [Icon.name]: Icon,
      [NavBar.name]: NavBar,

    },
    created: function () {

    },
    mounted() {
      this.loadData();
    },


    data() {
      return {

        undoListShow: false,
        currentOption: [],
        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        ddd: "",
        message: '',
        detail: {
          signupPoint:0
        },

      }
    },

    computed: {},

    activated() {
      this.loadData();
    },

    methods: {
      goNewList(){
			  window.location.href = '/weixin/wechat/v2/index.html#/questionnaireManage'
		  } ,
      showDetail(item) {
        this.undoListShow = false;
        this.currentOption = item.userList;
      },
      loadData() {
        this.detail = {};
        this.id = this.$route.query.id;
        let _this = this;
        this.$http
          .get(apiRouter.GET_QUESTION_TOTAL_INFO + "?id=" + this.id)
          .then(response => {
            if (response.data.status == -1) {
              //_this.detail = response.data.data;
            } else {
              _this.detail = response.data.data;
              //this.detail = response.data.data;
            }
          }, error => {

          });
      },

    }
  }
</script>
<style lang="less" scoped>
  @import '../../../style/minxin.less';

  .single-row{
    background-color:  #F4F9EE
  }

  .scope-title-box {
    border-bottom: 1px solid @colorDD
  }

  .scope-title {
    padding-left: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: @fontSize30;
    color: @color42;
    margin-top: 8px;
  }

  .x-textarea {
    font-size: @fontSize24;
  }

  .flex-demo /deep/ .weui-progress__inner-bar{
    background-color: #979797;
  }

  .title-return-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
