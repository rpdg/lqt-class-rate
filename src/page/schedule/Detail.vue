<template>
  <div style="color: #414141;">
    <x-header class="title-header" :left-options="{preventGoBack: true}"
            @on-click-back="onClickLeft">日程
    </x-header>

    <div style="
    margin-top: 2rem;
    text-align: center;
    margin-bottom: 2em;
    border-bottom: 1px solid #ECF1F8;
    padding-bottom: 4em;">
      <div>
        <img style="width: 60px; " :src="calendarImg[detail.typeCode]"/>
      </div>
      <div style="margin-bottom: 1rem">{{detail.content}}</div>

      <h3 v-if="detail.startTime && detail.allDay==0" style="font-size: 1rem;">
        {{ new Date(detail.startTime.replace(/-/g, '/')).format('hh:mm')}}
        -
        {{new Date(detail.endTime.replace(/-/g, '/')).format('hh:mm')}}
      </h3>
      <h3 v-if="detail.allDay==1" style="font-size: 1rem;">
        全天
      </h3>
      <h3 v-if="detail.allDay==2" style="font-size: 1rem;">
        多天
      </h3>


      <div v-if="detail.startTime && detail.allDay != 2">
        {{new Date(detail.endTime.replace(/-/g, '/')).format('yyyy年MM月dd日')}}&nbsp;&nbsp;&nbsp;
        {{ dayWeek[new Date(detail.endTime.replace(/-/g, '/')).getDay()]}}
      </div>
      <div v-if="detail.allDay == 2">
        {{new Date(detail.startTime.replace(/-/g, '/')).format('MM月dd日')}}
        &nbsp;{{dayWeek[new Date(detail.startTime.replace(/-/g, '/')).getDay()]}}
        &nbsp;{{new Date(detail.startTime.replace(/-/g, '/')).format('hh:mm')}}
        -
        {{new Date(detail.endTime.replace(/-/g, '/')).format('MM月dd日')}}
        &nbsp;{{ dayWeek[new Date(detail.endTime.replace(/-/g, '/')).getDay()]}}
        &nbsp;{{new Date(detail.endTime.replace(/-/g, '/')).format('hh:mm')}}
      </div>
    </div>

    <div >
      <!--<div>
        <img width="30px" style="margin-right: 10px" src="../../assets/schedule/local2.png"/>
        <span class="right-text">第三教学大堂</span>
      </div>-->
      <div class="empty" v-if="detail.location == '' && detail.desc == ''">
        <span>没有内容</span>
        <img  style="width:30px;margin-top: 10px;" src="../../assets/schedule/coffee-cup-hot-drink-dessert-drink.png" alt="">
      </div>
      <div >
        <van-row style="margin-bottom: 15px" v-if="!(detail.location == '' && detail.desc == '')">
          <van-col span="4">
            <img width="30px" style="margin-left: 10px;margin-right: 20px" :src="locationImg[detail.typeCode]"/>
          </van-col>
          <van-col span="20" style="height: 40px;line-height: 40px;padding-right: 10px">
          <span ref="location" class="desc-content" :style="'display:'+locationLine">  <!-- -webkit-box locationLine :'inline-block'-->
          {{detail.location}}
        </span></van-col>
        </van-row>
        <van-row v-if="!(detail.location == '' && detail.desc == '')">
          <van-col span="4">
            <img width="30px" style="margin-left: 10px;margin-right: 20px" :src="descImg[detail.typeCode]"/>
          </van-col>
          <van-col span="20" style="line-height: 40px;padding-right: 10px">
        <span ref="desc" class="desc-content"  :style="'display:'+descLine">
          {{detail.desc}}
        </span></van-col>
        </van-row>
        <van-row style = 'text-align: right;
    padding-right: 1rem;
    margin-top: 2rem;'>
          <span v-show="!(typeCode == 'T_TASK' || typeCode ==  'T_SCHOOL')" class="edit-btn" @click="goEdit">
                <img width="30px" src="../../assets/schedule/add-new-button-plus-edit.png"/><br>
                <span style="color: #48B319">编辑日程</span>
          </span>


        </van-row>
      </div>



      <!--<div>
        <img src="../../assets/schedule/content2.png"/>
        <label>第三教学大堂第三教学大堂第三教学大堂第三教学大堂第三教学大堂第三教学大堂第三教学大堂第三教学大堂</label>
      </div>-->
    </div>
  </div>

</template>

<script type="es6">
  import apiRouter from "../../config/api.js"
  import dateUtils from "../../utils/DateUtils"

  import { XHeader} from 'vux'


  import {Row, Col, Field, Cell, Toast, Button, Popup, Picker, Dialog,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';

  export default {
    components: {
        XHeader,
      [Row.name]: Row,
      [Col.name]: Col,
      [NavBar.name]: NavBar,

    },
    created() {
      //debugger;
    },
    mounted() {
     this.loadData();

    },
    watch: {
      "$route": function (e) {
        if (e.path == '/schedule-detail') {
          this.loadData();
        }

      }
    },
    updated() {
      if(this.$refs.location && this.$refs.location.offsetHeight){
        this.locationLine = this.$refs.location.offsetHeight>20?'-webkit-box':'';
      }
      if(this.$refs.desc && this.$refs.desc.offsetHeight){
        this.descLine = this.$refs.desc.offsetHeight>20?'-webkit-box':'';
      }

    },
    data() {
      return {
        locationLine:'',
        descLine:'',
        wwwUrl: roterPath,
        id: '',
        typeId: '',
        typeCode: '',
        //
        detail: {},
        dayWeek: {
          0: '周日',
          1: '周一',
          2: '周二',
          3: '周三',
          4: '周四',
          5: '周五',
          6: '周六',
        },
        calendarImg: {
          'T_TASK': roterImgPath+'/static/schedule/2Folder-Icon-1.png',
          'T_SCHOOL': roterImgPath+'/static/schedule/2Folder-Icon-2.png',
          'T_OUT_SCHOOL': roterImgPath+'/static/schedule/2Folder-Icon-3.png',
          'T_USER': roterImgPath+'/static/schedule/2Folder-Icon-4.png',
          'T_BIRTHDAY': roterImgPath+'/static/schedule/2Folder-Icon-5.png',
          'T_NOTE': roterImgPath+'/static/schedule/2Folder-Icon-6.png',
        },
        locationImg: {
          'T_TASK': roterImgPath+'/static/schedule/local1.png',
          'T_SCHOOL': roterImgPath+'/static/schedule/local2.png',
          'T_OUT_SCHOOL': roterImgPath+'/static/schedule/local3.png',
          'T_USER': roterImgPath+'/static/schedule/local4.png',
          'T_BIRTHDAY': roterImgPath+'/static/schedule/local5.png',
          'T_NOTE': roterImgPath+'/static/schedule/local6.png',
        },
        descImg: {
          'T_TASK': roterImgPath+'/static/schedule/content1.png',
          'T_SCHOOL': roterImgPath+'/static/schedule/content2.png',
          'T_OUT_SCHOOL': roterImgPath+'/static/schedule/content3.png',
          'T_USER': roterImgPath+'/static/schedule/content4.png',
          'T_BIRTHDAY': roterImgPath+'/static/schedule/content5.png',
          'T_NOTE': roterImgPath+'/static/schedule/content6.png',
        },

        show3: false,
        show2: false,
        show: false,
        columns: ['个人日程', '校外课程', '生日提醒', '便签'],
        repeatColumns: ['不重复', '每天重复', '每周重复', '每月重复', '每年重复'],
        info: {
          type: "个人日程",
          repeat: '不重复'
        }
      }
    },

    methods: {
      onClickLeft(){
        this.$router.go(-1);
      },
      loadData() {
        this.id = this.$route.query.id;
        this.typeCode = this.$route.query.typeCode;
        this.typeId = this.$route.query.typeId;
        this.detail = JSON.parse(window.localStorage.getItem('scheduleDetail'));
        /*this.$http
                .get(apiRouter.GET_CALENDAR_DETAIL + "?eventId=" + this.id
                  + '&typeCode=' + this.typeCode
                  + '&typeId=' + this.typeId)
                .then(response => {
                  if (response.data.status == -1) {
                    Dialog.alert({
                      message: response.data.message
                    }).then(() => {
                    });
                  } else {
                    this.detail = response.data.data;
                  }
                }, error => {

                });*/
      },
      goEdit() {
        let para = this.$route.query;
        this.$router.push({
          path:
          "schedule-add?id=" + para.id
          + '&typeCode=' + para.typeCode
          + '&typeId=' + para.typeId
        });

      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';

  .right-text {
    display: inline-block;
    line-height: 34px;
    height: 35px;
    vertical-align: text-bottom;
  }

  .edit-btn {
    text-align: center;
    display: inline-block;
   /* position: absolute;
    bottom: 1rem;
    right: 1rem;*/
  }
  .desc-content{
    -webkit-box-orient: vertical;
    /*-webkit-line-clamp: 2;*/
    overflow: hidden;
    line-height: 20px;
    word-break: break-all;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    align-items: center;
    height: 50px;
  }

  .empty span {
    padding-top: 74/@baseSize;
    color: #BBBBBB;
  }

  .title-header {
      background-color: #fff;;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100/@baseSize;
      line-height: 100/@baseSize;
      z-index: 1;
      border-bottom: solid 1px #dedede;
  }

  .title-header /deep/ .vux-header-title {
      color: #333;
      line-height: 46px;

  }

  .title-header /deep/ .vux-header-back {
      color: #38f;
  }

  .title-header /deep/ .left-arrow:before {
      border-color: #38f !important;
  }

</style>
