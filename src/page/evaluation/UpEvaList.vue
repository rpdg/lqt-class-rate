<template>
  <div class="box">
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack">{{ className }}-{{courseName}}
    </x-header>

    <ul class="message" ref="onScoll" style="margin-top: 2rem">
      <li class="clearfix" v-for="(news,index) in messageData" :key="index">
        <div class="message-icon"></div>
        <a href="javascript:void(0);" @click="goCheck(news)" class="message-info">
          <h3 style="color: #424242">{{ news.PJ_ITEM_NAME }}</h3>
          <p style="color: #777777">{{ news.STU_NAMES }}</p>

        </a>
        <div class="message-handle">
          <a class="inform greyBtn">{{ news.PJ_TIME }}</a>
          <a v-if="news.STATUS == 0" class="delete btn-red " @click="cancelBtn(news)">
            撤销
          </a>
          <a v-else class="delete lose">
            已撤销
          </a>
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
        :close-on-confirm="true"
        :title="('确定要撤销吗')"
        @on-confirm="onConfirm()"
        confirmText="是，我要撤销"
      >
      </confirm>
    </div>

    <div class="releaseBtn">
      <h1 class="typeBtn" @click="addToday()">新增</h1>
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

      this.className = this.$route.query.className;
      this.courseName = this.$route.query.courseName;

        let usertype = window.localStorage.getItem('USER_TYPE');
        this.usertype = usertype;

      this.loadData();
    },
    data() {
      return {
          usertype:"",
        item:{},
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
        checkObj: {
          finalList: [],
          noDoList: [],
        },

        selectTab: 0,
        id: '',
        page: 1,
        pageCount: 1,
        pageLoading: false,
          pageSize:15,
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

        this.$router.push({
          path: '/eval-detail',
          query: {
            pjId: e.E_ID,
            className: vm.className,
            courseName: vm.courseName,
          }

        })

      },

      goBack() {
        let backHome = this.$route.query.backHome;
        if(backHome || this.usertype !='T_TEACHER'){
            this.$router.push({path: '/'});
        }else{
            this.$router.push({
                path: '/eval-cList-up',
            })
        }


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
          this.$http.get(apiRouter.GET_COURSE_PJ_LIST + "?" +
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
        let courseCode = vm.$route.query.courseCode;
        let classId = vm.$route.query.classId;
          let pageSize = this.pageSize;

        this.$http.get(apiRouter.GET_COURSE_PJ_LIST + "?" +
          "courseCode=" + courseCode
          + '&classId=' + classId
          + '&pageIndex=' + vm.page
          + '&pageSize='+pageSize).then(response => {
          if (response.body.code === 200) {
            let messageData = response.body.data.DATA_LIST;
            let pageCount = Math.ceil(response.body.data.PAGE_COUNT / pageSize);
            vm.pageCount = (pageCount==0?1:pageCount);
            vm.messageData = vm.messageData.concat(messageData);
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
      onConfirm(){
          let item = this.item;
          let vm = this;
          this.$http.get(apiRouter.GET_CANCEL_COURSE_PJ
              + "?pjId=" + item.E_ID
          ).then(response => {
              if (response.body.code === 200) {
                  // let messageData = response.body.data.DATA_LIST;
                  // vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
                  // vm.messageData = vm.messageData.concat(messageData);

                  vm.toastMessage = '操作成功';
                  //response.body.message
                  vm.showPositionValue = true;
                  vm.loadData();

              } else {
                  alert(response.body.message);
              }
          }, error => {
              debugger;
          });
      },
      cancelBtn(item) {
          this.item = item;
          this.popup = true;
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
    .mixin-padding(30/@baseSize, 30/@baseSize);
    border-bottom: 1px solid @colorDD;
    height: 160/@baseSize;
    position: relative;
  }

  .message-icon {
    width: 100/@baseSize;
    height: 100/@baseSize;
    background: url("../../assets/eval/pj.png") no-repeat left;
    background-size: 100% 100%;
    position: absolute;
    top: 30/@baseSize;
    left: 30/@baseSize;
    border-radius: 3px;
  }

  .message-info {
    margin-left: 125/@baseSize;
    margin-right: 100/@baseSize;
    padding-top: 40/@baseSize;
    display: block;
  }

  .message-info h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 40/@baseSize;
    font-size: @fontSize30;
    color: @color42;
  }

  .message-info p {
    font-size: @fontSize24;
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 10/@baseSize;;
  }

  .message-handle {
    position: absolute;
    top: 24/@baseSize;
    right: 30/@baseSize;
    text-align: right;
  }

  .message-handle a {
    padding-top: 8/@baseSize;
    padding-bottom: 8/@baseSize;
    display: block;
  }

  .edlit-molde {
    width: 172/@baseSize;
    height: 142/@baseSize;
    position: absolute;
    right: 130/@baseSize;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 60/@baseSize;
    z-index: 9;
  }

  .edlit-molde a {
    padding-bottom: 16/@baseSize;
    padding-top: 20/@baseSize;
    display: block;
    font-size: @fontSize24;
  }

  .edlit-molde a.revamp {
    color: #2196F3;

  }

  .edlit-molde a.revamp em {
    width: 22/@baseSize;
    height: 23/@baseSize;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 5/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 10/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a.delete em {
    width: 18/@baseSize;
    height: 22/@baseSize;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 5/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 10/@baseSize;
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
    height: 80/@baseSize;
    line-height: 80/@baseSize;
    text-align: center;

  }

  .moreData span {
    height: 50/@baseSize;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 45/@baseSize;
  }


  .back-div {
    padding-bottom: 100/@baseSize;
  }

  .up-back {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    line-height: 100/@baseSize;
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

  .tab-check {
    margin-top: 100/@baseSize;
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
    width: 125 / @baseSize;
    height: 125 / @baseSize;
    line-height: 125 / @baseSize;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize36;
    color: @white;
    position: fixed;
    bottom: 45 / @baseSize;
    right: 40 / @baseSize;
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
