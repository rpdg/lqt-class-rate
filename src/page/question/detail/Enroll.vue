<template>
  <div>
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="活动报名问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="$router.push('/qa_list_user?fresh=1')"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem">
      <h2 style="font-size: 1.3em;text-align: center;word-break: break-word">{{detail.title}}</h2>
      <div style="font-size: 1.1em;min-height: 5rem;margin-top: 1em;word-break: break-word;">
        {{detail.content}}
        <div style="text-align: center;">
          <img   v-if="detail.imgShowURL" style="max-width: 90%;margin: 1em auto" :src="roterPath+detail.imgShowURL">
        </div>
      </div>
      <div style="text-align: right;font-size: 1.2em;">
        <p>{{detail.pubName}}</p>
        <p>{{detail.pubTime}}</p>
      </div>
      <div style="font-size: 1.2em;">
        <!--<van-cell-group>-->
        <!--<van-cell :title="'已报名人数：'+detail.userCount" icon="https://b.yzcdn.cn/vant/icon-demo-1126.png"/>-->
        <!--<van-cell :title="'距报名结束还剩：'+detail.systemTimeStr" icon="close"/>-->
        <!--</van-cell-group>-->
        <group class="scope-title-box">
          <cell :title="'已报名人数：'+detail.userCount" style="padding-left: 0;">
            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/question/people-group.png">
          </cell>
          <cell v-if="openFlag" :title="'距报名结束还剩：'+remainingTime" style="padding-left: 0;">
            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/question/alarm-time.png">
          </cell>
          <cell v-else :title="'距报名开始还剩：'+openDuringTime" style="padding-left: 0;">
            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/question/alarm-time.png">
          </cell>
        </group>

      </div>

      <div v-show="detail.tipsFlag"  class="scope-title-box" style="margin-top: 1rem">
        <p class="scope-title"><label v-if="detail.tipsRequire" style="color: red">*</label> {{detail.tipsInfo}}</p>
        <x-textarea
          style="    border: 1px #B2B2B2 solid;"
          :max="200"
          class="x-textarea"
          placeholder=""
          :rows="2"
          :readonly="detail.closeFlag == '1' || detail.completeFlag == '1' || !openFlag ? 'readonly':false"
          v-model="detail.tipsValue"
        >
        </x-textarea>
        <!--<input type="hidden" name="title" v-model="titleValue">-->
      </div>



      <div style="text-align: center;" v-if="detail.closeFlag==0 && detail.completeFlag != '1'">
        <van-button v-if="openFlag" @click="submitData" style="margin-top: 2rem;width:  100%" type="primary">立即报名</van-button>
        <van-button v-else style="margin-top: 2rem;width: 100%;background-color: #979797;border-color: #979797" disabled type="primary">未开始</van-button>
      </div>
      <div style="text-align: center;" v-if="detail.closeFlag==1">
        <van-button style="margin-top: 2rem;width: 100%;background-color: #979797;border-color: #979797" disabled
                    type="primary">本问卷已截止
        </van-button>
      </div>
      <div v-else-if="detail.completeFlag == '1'">
        <van-button class="right" style="margin-top: 2rem;width:  100%;background-color: #979797;border-color: #979797"
                    disabled type="primary">本问卷已提交
        </van-button>
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
  </div>

</template>

<script>
  import {XTextarea, Toast,Group,Cell} from 'vux'
  import {RadioGroup, Radio, Field, Button,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../../config/api.js"
  import dateUtils from "../../../utils/DateUtils"


  export default {
    components: {
      XTextarea,
      Toast,
      Cell,
      Group,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [NavBar.name]: NavBar,

    },
    created: function () {
    },
    mounted() {
      this.loadData();
    },

    watch: {
      "$route": function (e) {
        if (e.path == '/ans-enroll') {
          this.loadData();
        }

      }
    },

    computed: {
      // 计算属性的 getter
      remainingTime: function () {
        let clostTimeStr =  this.detail.clostTimeStr;
        let showStr = '0天'+'0小时'+'0分钟';
        if(clostTimeStr && this.detail.closeFlag != 1){
          let iphoneCloseTimeStr = clostTimeStr.replace(/\-/g, "/");
          let valTimes = (new Date(iphoneCloseTimeStr) - new Date().getTime())/1000;
          showStr = this.parseTime(valTimes);
        }
        return showStr;
      },
      // 计算属性的 getter
      openDuringTime: function () {
        let openTimeStr =  this.detail.openTimeStr;
        let showStr = '0天'+'0小时'+'0分钟';
        if(openTimeStr && this.detail.closeFlag != 1){
          let iphoneOpenTimeStr = openTimeStr.replace(/\-/g, "/");
          let valTimes = (new Date(iphoneOpenTimeStr) - new Date().getTime())/1000;
          showStr = this.parseTime(valTimes);
        }
        return showStr;
      },
      openFlag: function () {
        let openTimeStr =  this.detail.openTimeStr;
        let show = true;
        if(openTimeStr && this.detail.closeFlag != 1){
          let iphoneOpenTimeStr = openTimeStr.replace(/\-/g, "/");
          if((new Date(iphoneOpenTimeStr).getTime()-new Date().getTime()>0)){
            show = false;
          }
        }
        return show;
      }

    },

    data() {
      return {
        roterPath:'',
        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        radio: '1',
        message: '',
        detail: {
          title:'',
          userCount: 0,
          systemTimeStr: '0天0小时0分钟'
        },
      }
    },
    activated() {
    },

    methods: {
      parseTime(num){
        //var num = 11243700;
        var s = num%60;
        num=parseInt(num/60);
        var m = num%60;
        num = parseInt(num/60);
        var h = num%24;
        num = parseInt(num/24);
        var d = num;
        // console.log(d+'天'+h+'时'+m+'分'+s+'秒')
        return d+'天'+h+'小时'+m+'分钟';
      },

      loadData() {
        this.detail = {
          title:'',
          userCount: 0,
          systemTimeStr: '0天0小时0分钟'
        };
        this.id = this.$route.query.id;
        let _this = this;
        this.$http
          .get(apiRouter.GET_QUESTION_DETAIL + "?id=" + this.id)
          .then(response => {
            if (response.data.status == -1) {
              //_this.detail = response.data.data;
            } else {
              _this.detail = response.data.data;
              _this.roterPath  = _this.detail.PIC_PATH;

              let optionList = _this.detail.optionList;
            }
          }, error => {

          });
      },
      submitData() {
        let detail = this.detail;
        //thisValue: this.radio,
        let data = {
          id: detail.id,
          thisValue: new Date().format("yyyy-MM-dd hh:mm:ss"),
          tipsValue: detail.tipsValue
        };
        let _this = this;
        if(detail.tipsRequire && !detail.tipsValue){
          _this.toastMessage = '请填写报名信息！';
          _this.showPositionValue = true
          return;
        }
        this.$http
          .post(apiRouter.POST_QUESTION_SUBMIT, data)
          .then(response => {
            if (response.data.status == 200) {
              _this.toastMessage = response.data.message
              _this.showPositionValue = true
              setTimeout(function () {
                _this.$router.push({path: 'qa_list_user'})
              }, 1000)
            } else {
              _this.toastMessage = response.data.message
              _this.showPositionValue = true
            }
          }, error => {

          });
      },

    }
  }
</script>
<style lang="less" scoped>
  @import '../../../style/minxin.less';

  .scope-title-box {
    //border-bottom: 1px solid @colorDD
  }


  .scope-title-box /deep/ .weui-cell:before{
    border-width: 0;
  }

  .scope-title-box /deep/ .weui-cells:before{
    border-width: 0;
  }

  .scope-title-box /deep/ .weui-cell:after{
    border-width: 0;
  }

  .scope-title-box /deep/ .weui-cells:after{
    border-width: 0;
  }

  .scope-title {
    padding-left: 30 / @baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: @fontSize30;
    color: @color42;
    margin-top: 15 / @baseSize;
  }

  .x-textarea {
    font-size: @fontSize24;
  }

  .title-return-top {
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
