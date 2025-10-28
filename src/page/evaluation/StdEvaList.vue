<template>
  <div class="box">
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack">{{ userInfo.studentName }}的课堂评价
    </x-header>

    <ul class="message" ref="onScoll" style="margin-top: 2rem">
      <li class="clearfix" v-for="(news,index) in messageData" :key="index">
        <div class="message-icon"></div>
        <a href="javascript:void(0);" @click="goCheck(news)" class="message-info">
          <h3 style="color: #424242">{{ news.PJ_ITEM_NAME }}</h3>
          <p style="color: #777777">{{className}} {{courseName}}</p>

        </a>
        <div class="message-handle">
          <a class="inform greyBtn">{{ news.PJ_TIME }}</a>
<!--          <a v-if="news.STATUS == 0" class="delete btn-red " @click="cancelBtn(news)">-->
<!--            撤销-->
<!--          </a>-->
<!--          <a v-else class="delete lose">-->
<!--            已撤销-->
<!--          </a>-->
        </div>
      </li>
    </ul>

    <div v-if="pageCount != page" class="more-title" @click="nextPage"><a href="javascript:void(0)">点击查看更多</a></div>
    <div v-else class="more-title">
      <a v-if="!pageLoading" href="javascript:void(0)">到底啦</a>
      <a v-else href="javascript:void(0)">加载中...</a>
    </div>

    <p class="moreData" v-show="needShow"><span>加载中...</span></p>
    <p class="lastShow" v-show="lastShow"><span>已经全部加载</span></p>
    <div v-transfer-dom>
      <confirm
        v-model="popup"
        :close-on-confirm="false"
        :title="('确定删除作业？删除后无法恢复数据？')"
        @on-confirm="onConfirm()"
        confirmText="是，我要删除"
      >
      </confirm>
    </div>

    <toast
      v-model="showPositionValue"
      type="text"
      :time="800"
      is-show-mask
      width="140px"
      :position="position"
    >
      {{ toastMessage }}
    </toast>
  </div>
</template>

<script>
  import {Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader, Cell, Toast} from 'vux'
  import {Field, Tab, Tabs} from 'vant';
  import Back from "../../components/common/Back.vue"
  import apiRouter from "../../config/api.js"
  import {mapMutations} from 'vuex'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Back,
      Confirm,
      Group,
      XSwitch,
      XButton,
      XHeader,
      Cell,
      Toast,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
    },
    mounted() {

    },
    activated() {
      this.page = 1;
      // this.courseId = this.$route.query.courseId;
      // this.courseTitle = this.$route.query.courseTitle;
      let userStr = window.localStorage.getItem("USER");
      let user = JSON.parse(userStr);
      if(user.userType == 'T_STUDENT'){
          user.studentName = user.userName;
      }
      this.userInfo = user;

      this.classId = this.$route.query.classId;
      this.courseCode = this.$route.query.courseCode;

      this.className = this.$route.query.className;
      this.courseName = this.$route.query.courseName;


      this.loadData();
    },
    data() {
      return {
        userInfo:{},
        classId:'',
        courseCode:'',
        className: '',
        courseName: '',
        courseId: '',
        courseTitle: '',
        showPositionValue: false,
        position: 'default',
        toastMessage: '',
        messageData: [],
        otherCategoryList: [],
        topListCategory: [],
        //课程状态
        active: 0,
        allCategoryList: [],
        totalCourselist: [],
        selectTab: 0,
        id: '',
        page: 1,
        pageCount: 1,
        pageSize:15,
        pageLoading: false,
        popup: false,
        isShow: false,
        showItemNumber: -1,
        isEndReached: false,
        totalPage: 1,
        needShow: false,
        lastShow: false,
        wwwUrl: roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId='
      }
    },
    methods: {
      addToday() {
        // this.classId = this.$route.query.classId;
        // this.courseCode = this.$route.query.courseCode;、
        let query = this.$route.query;
        this.$router.push({
          path: '/eval-group',
          query: query
        })
      },

      goCheck(e) {
        let vm = this;
        // courseCode: L2/课程code
        //  classId: A11237 //班级id
        //  pageIndex:1//当前页
        // pageSize:10//每页显示条数

        // this.$router.push({
        //   path: '/eval-detail-std',
        //   query: {
        //       classId: e.CLASS_ID,
        //       courseCode: e.COURSE_CODE,
        //   }
        //
        // })

      },

      goBack() {
        this.$router.go(-1);
      },

      goDetail(e) {
        let vm = this;
        this.$router.push({
            path: '/cur-enroll',
            query: {
              courseId: e.courseId,
              className: vm.className,
              courseName: vm.courseName
            }
          }
        )
      },

    loadDataNext() {
        let vm = this;
        vm.pageLoading = false;
        let courseCode = vm.$route.query.courseCode;
        let classId = vm.$route.query.classId;
        let pageSize = this.pageSize;
        this.$http.get(apiRouter.GET_STU_COURSE_PJ_LIST + "?" +
            "courseCode=" + courseCode
            + '&classId=' + classId
            + '&pageIndex=' + vm.page
            + '&pageSize='+pageSize).then(response => {
            if (response.body.code === 200) {
                let messageData = response.body.data.DATA_LIST;
                vm.pageLoading = false;
                vm.pageCount = Math.ceil(response.body.data.PAGE_COUNT / pageSize);
                if(messageData.length > 0){
                    vm.messageData = vm.messageData.concat(messageData);
                }
            } else {
                alert(response.body.message);
            }
        }, error => {
            debugger;
        });
    },


      loadData() {
        let vm = this;
        vm.messageData = [];
        let classId = this.classId;
        let courseCode = this.courseCode;
        let pageIndex = 1;
          let pageSize = this.pageSize;
          this.$http.get(apiRouter.GET_STU_COURSE_PJ_LIST+"?classId="+classId+'&courseCode='+courseCode+'&pageIndex='+pageIndex+'&pageSize='+pageSize ).then(response => {
          if (response.body.code === 200) {
            let messageData = response.body.data.DATA_LIST;
            let pageCount = Math.ceil(response.body.data.PAGE_COUNT / pageSize) == 0;
            vm.pageCount = (pageCount == 0 ? 1:pageCount);
            vm.messageData = messageData;
          } else {
            alert(response.body.message);
          }
        }, error => {
          debugger;
        });
      },
      nextPage() {
        let _this = this;
        _this.page = _this.page + 1;
        _this.loadDataNext();
      },
      cancelBtn(item) {
        let vm = this;
        this.$http.get(apiRouter.GET_CANCEL_COURSE_PJ
          + "?pjId=" + item.E_ID
        ).then(response => {
          if (response.body.code === 200) {
            // let messageData = response.body.data.DATA_LIST;
            // vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
            // vm.messageData = vm.messageData.concat(messageData);

            vm.toastMessage = response.body.message;
            vm.showPositionValue = true;
            vm.loadData();

          } else {
            alert(response.body.message);
          }
        }, error => {
          debugger;
        });
      }
    },

  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';

  .message {
    width: 100%;
  }

  .message li {
    .mixin-padding(15px, 15px);
    border-bottom: 1px solid @colorDD;
    height: 80px;
    position: relative;
  }

  .message-icon {
    width: 50px;
    height: 50px;
    background: url("../../assets/eval/pj.png") no-repeat left;
    background-size: 100% 100%;
    position: absolute;
    top: 15px;
    left: 15px;
    border-radius: 3px;
  }

  .message-info {
    margin-left: 63px;
    margin-right: 50px;
    padding-top: 20px;
    display: block;
  }

  .message-info h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    font-size: @fontSize30;
    color: @color42;
  }

  .message-info p {
    font-size: @fontSize24;
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;;
  }

  .message-handle {
    position: absolute;
    top: 12px;
    right: 15px;
    text-align: right;
  }

  .message-handle a {
    padding-top: 4px;
    padding-bottom: 4px;
    display: block;
  }

  .edlit-molde {
    width: 86px;
    height: 71px;
    position: absolute;
    right: 65px;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 30px;
    z-index: 9;
  }

  .edlit-molde a {
    padding-bottom: 8px;
    padding-top: 10px;
    display: block;
    font-size: @fontSize24;
  }

  .edlit-molde a.revamp {
    color: #2196F3;

  }

  .edlit-molde a.revamp em {
    width: 11px;
    height: 12px;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a.delete em {
    width: 9px;
    height: 11px;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #FF5E5E;
  }

  a.delete {
    text-align: center;
  }

  .btn-red {
    color: #FF5E5E;
  }

  .publis {
    color: #F09709;
  }

  .inform {
    color: #48B319;
  }

  .lose {
    color: #9B9B9B;
  }

  .weui-dialog__title {
    font-size: @fontSize34;
    color: #333333;
  }

  .moreData, .lastShow {
    height: 40px;
    line-height: 40px;
    text-align: center;

  }

  .moreData span {
    height: 25px;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 23px;
  }


  .back-div {
    padding-bottom: 50px;
  }

  .up-back {
    width: 100%;
    height: 50px;
    font-size: @fontSize36;
    line-height: 50px;
    color: @white;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }


  .pubisnBtn {
    color: #E12727
  }

  .greyBtn {
    color: rgb(119, 119, 119);
  }

  .title-header {
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

  .tab-check {
    margin-top: 50px;
  }

  .box /deep/ .van-tab--active {
    color: #48b319;

  }

  .box /deep/ .van-tabs__line {
    background-color: #48b319;

  }

  .box /deep/ .van-tab {
    border-bottom: 1px solid #DDDDDD;
  }

  .typeBtn {
    width: 63px;
    height: 63px;
    line-height: 63px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize36;
    color: @white;
    position: fixed;
    bottom: 23px;
    right: 20px;
    background: @green;
    z-index: 10;
  }


  .more-title {
    line-height: 45px;
    padding-bottom: 20px;
    text-align: center;
    color: #999;
    //font-size: .26rem
  }

  .more-title a {
    display: block;
    line-height: 40px;
    color: #999
  }

</style>
