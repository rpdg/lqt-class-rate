<template>
  <div class="box">
    <!-- 返回组件 -->
<!--    <van-nav-bar-->
<!--      class="title-return-top"-->
<!--      title="课程详情"-->
<!--      left-text="返回"-->
<!--      right-text=""-->
<!--      left-arrow-->
<!--      @click-left="$router.push('/cur-list?fresh=1')"-->
<!--    />-->

    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack" >课程详情</x-header>

    <div class="" :style="'overflow: auto;margin-top: 1rem;padding: 1rem 1.5em 2rem 1.5em;height:'+winHeight">
      <h2 style="font-size: 1.3em;text-align: center;word-break: break-word;margin-top: 1em;margin-bottom: 1em">{{ courseDetail.NAME }}</h2>

      <div style="font-size: 1.2em;">
        <!--<van-cell-group>-->
        <!--<van-cell :title="'已报名人数：'+detail.userCount" icon="https://b.yzcdn.cn/vant/icon-demo-1126.png"/>-->
        <!--<van-cell :title="'距报名结束还剩：'+detail.systemTimeStr" icon="close"/>-->
        <!--</van-cell-group>-->

        <group class="scope-title-box">
          <cell style="padding: 1px 0px;align-items: start;">
            <span slot="title" v-html="'课程介绍：'+courseDetail.INTRO.replace(/\n/g,'<br>')"></span>
            <img slot="icon" width="20" style="display:block;margin-right:15px;margin-top: 3px;" src="@/assets/curriculum/title-1.png">
          </cell>
          <cell :title="'费用说明：'+courseDetail.FEE_CONTENT" style="padding: 1px 15px;padding-left: 36px;">
          </cell>
          <cell :title="'课程要求：'+courseDetail.STU_DEMAND" style="padding: 1px 15px;padding-left: 36px;">
          </cell>
          <cell :title="'任教老师：'+teacherDetail.M_NAME" style="padding-left: 0;padding-bottom: 0;    padding-top: 5px;">
            <img slot="icon" width="20" style="display:block;margin-right:15px;"
                 src="@/assets/curriculum/title-2.png">
          </cell>
          <cell :title="'老师介绍：'+courseDetail.TEACHER_INTRO"
                style="padding: 1px 15px;padding-left: 36px;"></cell>
          <cell :title=" '学分：'+courseDetail.CREDIT+'分'" style="padding-left: 0;    padding-top: 5px;padding-bottom: 5px;">
            <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-3.png">
          </cell>

          <cell :title="'上课时间：'+curData.teacherTime.NAMES" style="padding-left: 0;padding-top: 5px;padding-bottom: 5px;align-items: start;">
            <img slot="icon" width="20" style="display:block;margin-right:15px;margin-top: 3px;"
                 src="@/assets/curriculum/title-4.png">
          </cell>
          <cell :title="'上课地点：'+courseDetail.PLACE" style="padding-left: 0;padding-top: 5px;padding-bottom: 5px;">
            <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-5.png">
          </cell>


          <cell v-if="courseDetail.IS_CLOSED == '1'" :title="'已选报该课程'" style="color:#48B31A;padding-left: 0;padding-top: 5px;padding-bottom: 5px;">
              <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-6.png">
            </cell>
          <div v-else>
            <cell class="time-show" v-if="courseDetail.MY_STATUS == '100'" :title="'距报名开始还剩：'" style="padding-left: 0;padding-top: 5px;padding-bottom: 5px;">
              <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-6.png">
              <van-count-down style="font-size: 1em" @finish="finishStartTime" @change="changeStartTime" :time="startTime" :format="startFtm" />
            </cell>
            <cell v-else-if="courseDetail.MY_STATUS == '300'" :title="'报名已结束：'+curData.lastTime.countDown" style="padding-left: 0;padding-top: 5px;padding-bottom: 5px;">
              <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-6.png">
            </cell>
            <cell class="time-show" v-else :title="'距报名结束还剩：'" style="padding-left: 0;padding-top: 5px;padding-bottom: 5px;">
              <img slot="icon" width="20" style="display:block;margin-right:15px;" src="@/assets/curriculum/title-6.png">
              <van-count-down style="font-size: 1em" @finish="finishCloseTime" @change="changeCloseTime"  :time="closeTime" :format="closeFtm" />
            </cell>
          </div>


        </group>

        <group class="scope-title-box">
          <div style="text-align: center;">
            <img  v-if="courseDetail.IMG_FILE && courseDetail.IMG_FILE.URL" style="max-width: 90%;margin: 1em auto" :src="roterPath+'/upload'+courseDetail.IMG_FILE.URL">
          </div>
          <!--          <cell :title="'已报名人数：'+detail.userCount" style="padding-left: 0;">-->
          <!--            <img slot="icon" width="20" style="display:block;margin-right:5px;" src="@/assets/question/people-group.png">-->
          <!--          </cell>-->

        </group>

      </div>



    </div>


      <div v-if="!loading && courseDetail.IS_CLOSED != '1'" style="text-align: center;position: fixed;width: 90%;left:5%;bottom: 1em;">
        <van-button v-if="courseDetail.MY_STATUS == '200'" @click="submitData" style="width:100%;background-color: #48b41a" type="primary" >立即报名</van-button>
        <div v-else-if="courseDetail.MY_STATUS == '201' && curData.selTime.CAN_CHANGE== '1' " style="position: relative;bottom: 3em;">
          <van-button style="position:absolute;left:0;width: 30%;background-color: red;border-color: #979797;color: white" type="warn" @click="submitDataCancel"  >取消报名</van-button>
          <van-button style="position:absolute;right:0;width: 30%;background-color: #979797;border-color: #979797" disabled type="primary">已报名</van-button>
        </div>
        <van-button v-else style=";width: 100%;background-color: #979797;border-color: #979797" disabled type="primary">{{statusView[courseDetail.MY_STATUS]}}</van-button>
      </div>

      <img v-if="!loading && courseDetail.IS_CLOSED != '1'" @click="setTop" class="top-btn" src="../../assets/curriculum/top.png"/>

      <toast
        v-model="showPositionValue"
        type="text"
        :time="3000"
        is-show-mask
        width="140px"
        :position="position"
      >
        {{ toastMessage }}
      </toast>



  </div>

</template>

<script>
import {XTextarea, Toast, Group, XHeader, Cell} from 'vux'

import {RadioGroup, Radio, Field, Button, NavBar,CountDown} from 'vant';
// //import 'vant/lib/vant-css/index.css';
import 'vant/lib/index.css';
import axios from 'axios'
import apiRouter from "../../config/api.js"
import dateUtils from "../../utils/DateUtils"
import wx from "weixin-js-sdk";


export default {
  components: {
    XTextarea,
    Toast,
    Group,
    XHeader,
    Cell,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [CountDown .name]: CountDown ,

  },
  created: function () {
  },
  mounted() {
    //this.loadData();
    this.urlPath = window.location.href.split("#")[0];
    this.getUrlConfigTrue()
  },
  watch: {
    "$route": function (e) {
      if (e.path == '/ans-enroll') {
        //this.loadData();
      }

    }
  },
  activated() {
    this.winHeight = document.documentElement.clientHeight -100 +"px";
    this.loading = true;
    this.courseId = this.$route.query.courseId
    let courseId = this.courseId;
    this.courseDetail={
      INTRO:'',
        FEE_CONTENT:'',
        STU_DEMAND:'',
        TEACHER_INTRO:'',
        CREDIT:'',
        PLACE:'',
        MY_STATUS:'300'
    };
    this.teacherDetail={
      M_NAME:''
    };
    this.curData = {
      courseDetail: {},
      teacherDetail:{},
      teacherTime:{
        NAMES:''
      },
      lastTime:{
        countDown:''
      }
    };
    this.loadData(courseId);
  },
  computed: {
    // 计算属性的 getter
    remainingTime: function () {
      let clostTimeStr = this.detail.clostTimeStr;
      let showStr = '0天' + '0小时' + '0分钟';
      if (clostTimeStr && this.detail.closeFlag != 1) {
        let iphoneCloseTimeStr = clostTimeStr.replace(/\-/g, "/");
        let valTimes = (new Date(iphoneCloseTimeStr) - new Date().getTime()) / 1000;
        showStr = this.parseTime(valTimes);
      }
      return showStr;
    },
    // 计算属性的 getter
    openDuringTime: function () {
      let openTimeStr = this.detail.openTimeStr;
      let showStr = '0天' + '0小时' + '0分钟';
      if (openTimeStr && this.detail.closeFlag != 1) {
        let iphoneOpenTimeStr = openTimeStr.replace(/\-/g, "/");
        let valTimes = (new Date(iphoneOpenTimeStr) - new Date().getTime()) / 1000;
        showStr = this.parseTime(valTimes);
      }
      return showStr;
    },
    openFlag: function () {
      let openTimeStr = this.detail.openTimeStr;
      let show = true;
      if (openTimeStr && this.detail.closeFlag != 1) {
        let iphoneOpenTimeStr = openTimeStr.replace(/\-/g, "/");
        if ((new Date(iphoneOpenTimeStr).getTime() - new Date().getTime() > 0)) {
          show = false;
        }
      }
      return show;
    }

  },
  data() {
    return {
      winHeight:'100px',
      loading:false,
      urlPath:'',
      startFtm:"HH 时 mm 分 ss 秒",
      closeFtm:"HH 时 mm 分",
      startTime:0,
      closeTime:0,
      courseDetail:{
        INTRO:'',
        FEE_CONTENT:'',
        STU_DEMAND:'',
        TEACHER_INTRO:'',
        CREDIT:'',
        PLACE:'',
      },
      teacherDetail:{
        M_NAME:''
      },
      curData: {
        courseDetail: {},
        teacherDetail:{},
        teacherTime:{
          NAMES:''
        },
        lastTime:{
          countDown:''
        }
      },
      statusView: {
        201: '已报名',
        100: '未开始',
        200: '报名中 ',
        0: '已报满',
        300: '报名已结束'
      },
      //"MY_STATUS": 200, //课程状态 201已选 100未开始 200报名中 0 已报满 300已结束
      roterPath: roterOssPath,
      showPositionValue: false,
      showToast: true,
      position: 'default',
      toastMessage: '',

      radio: '1',
      message: '',
      detail: {
        title: '',
        userCount: 0,
        systemTimeStr: '0天0小时0分钟'
      },

      //MY_STATUS
    }
  },


  methods: {
    changeCloseTime(a,b,c){
      if(a.days == 0){
          this.closeFtm = "HH 时 mm 分";
      }
      if(a.days > 0){
        this.closeFtm = "DD 天 HH 时 mm 分";
      }
    },
    changeStartTime(a,b,c){
      if(a.days == 0 && a.hours == 0){
        this.startFtm = "mm 分 ss 秒";
      }else if(a.days == 0 ){
        this.startFtm = "HH 时 mm 分 ss 秒";
      }else{
        this.startFtm = "DD 天 HH 时 mm 分 ss 秒";
      }
    },
    finishCloseTime(){
      // if(this.courseDetail.MY_STATUS == 201){
      //
      // }
      this.courseDetail.MY_STATUS='300';

      //window.location.reload();
    },
    finishStartTime(){
      this.courseDetail.MY_STATUS='200';

    },
    setTop(){
      let _this = this;
      let courseId = _this.courseDetail.ID;
      let topListStr = sessionStorage.getItem("topList");

      if(!topListStr){
          let topList = [];
          topList.push(courseId);
          _this.toastMessage = "置顶成功";
          _this.showPositionValue = true
          sessionStorage.setItem("topList",topList)
      }else{
        let topList = topListStr.split(',');
        if(topList.includes(courseId)){
          _this.toastMessage = "本课程已置顶";
          _this.showPositionValue = true
          return ;
        }
        if(topList.length > 4){
          _this.toastMessage = "临时置顶最多5条";
          _this.showPositionValue = true
          return ;
        }
        _this.toastMessage = "置顶成功";
        _this.showPositionValue = true
        topList.push(courseId)
        sessionStorage.setItem("topList",topList)

      }

      // for(var i=arr.length-1;i>=0;i--){
      //
      //   console.log(arr[i]);      //通过数组i的倒序调用，实现结果的倒序输出。
      //
      // }
      // this.$http
      //   .post(apiRouter.GET_SELCOURSE_H5_TOP,{courseId:courseId })
      //   .then(response => {
      //     if (response.data.code == 200) {
      //       _this.toastMessage = response.data.message
      //       _this.showPositionValue = true
      //       setTimeout(function () {
      //         _this.$router.push({path: 'cur-list'})
      //       }, 1000)
      //     } else {
      //       _this.toastMessage = response.data.message
      //       _this.showPositionValue = true
      //     }
      //   }, error => {
      //
      //   });
    },
    loadData(e) {
      let _this = this;
      this.$http.get(apiRouter.GET_SELCOURSE_H5_DETAIL + '?courseId=' + e).then(response => {
        if (response.status === 200 && response.body.code === 200) {
          _this.loading = false;
          _this.curData = response.data.data;
          _this.courseDetail = _this.curData.courseDetail;
          _this.teacherDetail =  _this.curData.teacherDetail || {M_NAME:''};
          _this.curData.teacherTime =  _this.curData.teacherTime || {NAMES:''};
          if(_this.curData.selTime && _this.curData.selTime.CLOSE_TIME){
             let sCloseDate = _this.curData.selTime.CLOSE_TIME.replace(/\-/g, "/");
              //sCloseDate = 1598463326435;
              _this.closeTime = new Date(sCloseDate).getTime()- new Date().getTime();
              if(_this.closeTime > 1000*60*60*24){
                _this.closeFtm = "DD 天 HH 时 mm 分";
              }else{
                _this.closeFtm = "HH 时 mm 分";
              }

          }

          if(_this.curData.selTime && _this.curData.selTime.OPEN_TIME){
            let sStartDate = _this.curData.selTime.OPEN_TIME.replace(/\-/g, "/");
            _this.startTime = new Date(sStartDate).getTime()- new Date().getTime();
          }
        }else{
          alert(response.body.message);
        }
      }, response => {
        alert("请求失败了!!!!")
      });
    },
    parseTime(num) {
      //var num = 11243700;
      var s = num % 60;
      num = parseInt(num / 60);
      var m = num % 60;
      num = parseInt(num / 60);
      var h = num % 24;
      num = parseInt(num / 24);
      var d = num;
      // console.log(d+'天'+h+'时'+m+'分'+s+'秒')
      return d + '天' + h + '小时' + m + '分钟';
    },

    submitDataCancel(){
      let _this = this;
      let courseId = _this.courseDetail.ID;
      this.$http
        .post(apiRouter.GET_SELCOURSE_H5_CANCEL,{courseId:courseId })
        .then(response => {
          if (response.data.code == 200) {
            _this.toastMessage = response.data.message;
            _this.showPositionValue = true;
            setTimeout(()=>{
              _this.loadData(_this.courseId);
            },800);

          } else {
            _this.toastMessage = response.data.message
            _this.showPositionValue = true
          }
        }, error => {

        });
    },
    submitData() {
      let _this = this;
      let courseId = _this.courseDetail.ID;

      //        .get(apiRouter.GET_SELCOURSE_H5_CHOOSE+"?courseId="+courseId )

      this.$http
        .post(apiRouter.GET_SELCOURSE_H5_CHOOSE,{courseId:courseId })
        .then(response => {
          if (response.data.code == 200) {
            _this.toastMessage = response.data.message
            _this.showPositionValue = true;
            setTimeout(()=>{
              _this.loadData(_this.courseId);
            },800);
          } else {
            _this.toastMessage = response.data.message
            _this.showPositionValue = true
          }
        }, error => {

        });
    },

    previewImage(url){
      //console.info(url);
      let urls = [url];
      // for(let i=0;i<imgList.length;i++){
      //   urls.push(this.picRootPath+imgList[i].URL)
      // }

      wx.previewImage({
        current: url , // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      });
    },
    getUrlConfigTrue() {
      let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
      this.$http.get(wiexin).then(response => {
        let data = response.body
        wx.config({
          // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature,// 必填，签名，见附录1
          jsApiList: [
            "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice','downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.error(function (res) {
          //   alert(res)
        });

      }, response => {
        // console.log("请求失败了!!!!")
      });
    },
    goBack(){
      this.$router.push({path:'/cur-list?fresh=1'})
    },

  }
}
</script>
<style lang="less" scoped>
@import '../../style/minxin.less';

.scope-title-box {
  //border-bottom: 1px solid @colorDD
}


.scope-title-box /deep/ .weui-cell:before {
  border-width: 0;
}

.scope-title-box /deep/ .weui-cells:before {
  border-width: 0;
}

.scope-title-box /deep/ .weui-cell:after {
  border-width: 0;
}

.scope-title-box /deep/ .weui-cells:after {
  border-width: 0;
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

.title-return-top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.title-header{
  background-color: #fff;;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  z-index: 1;
  border-bottom: solid 1px #dedede;
}

.title-header /deep/ .vux-header-title{
  color: #333;
  line-height: 46px;

}

.title-header /deep/ .vux-header-back{
  color: #38f;
}

.title-header /deep/ .left-arrow:before{
  border-color: #38f !important;
}

.time-show /deep/ .vux-cell-primary{
  flex: initial !important;
}

.top-btn{
  width: 2rem;
  height: 2rem;
  border-radius: 2rem;
  position: fixed;
  right: 1.5em;
  bottom: 4.5em;
  opacity: .8;
}
</style>
