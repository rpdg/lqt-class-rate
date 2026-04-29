<template>
  <div class="box">
    <x-header class="title-header" :left-options="{ preventGoBack: true }" @on-click-back="goBack">{{ courseTitle
    }}</x-header>
    <div
      style="width: 100vw; position: absolute; top: 57px; height: 38px; padding:0 20px; border-bottom: 1px #ddd dashed;">
      考勤日期：{{ checkonDate.getMonth() + 1 }}月{{ checkonDate.getDate() }}日
      <van-button plain hairline size="mini" type="info" color="orange" style="float:right;"
        @click="showDatePicker = true">&nbsp; 修改 &nbsp;</van-button>
      <van-calendar :color="'#48B319'" v-model="showDatePicker" @confirm="onDatePickerConfirm"
        :default-date="checkonDate" :min-date="new Date(checkonDate.getTime() - 15552000000)" :max-date="new Date" />
    </div>
    <div class="wapper">
      <ul key="stuListUl">
        <li style="width: 33%;display: inline-block;margin-top: 0.72rem" v-for="(item, index) in messageData"
          :key="index">
          <div style="width: 100%;text-align: center; ">
            <div @click="editCheck(item)" style="display: inline-block; position: relative;">
              <div v-if="item.status != '1'" :style="`color: ${attendanceStatusColorMap[ item.status ]}`">{{
                item.remark }}</div>
              <img style="width: auto; max-height: 110px;" :src="item.avatar" />
              <img v-if="item.status != '1'" style="width: 60px; position: absolute;bottom: 0;right: 0;"
                :src="getAttendanceImage(item.status)" />
            </div>
            <div>{{ item.className }} {{ item.studentName }}</div>
            <img @click="editDetail(item)" style="width: 20px;margin-top: 5px" src="@/assets/edit.png" />
          </div>
        </li>
      </ul>

      <p class="moreData" v-show="needShow">
        <span>加载中...</span>
      </p>
      <p class="lastShow" v-show="lastShow">
        <span>已经全部加载</span>
      </p>
      <div v-transfer-dom>
        <confirm v-model="popup" :close-on-confirm="false" :title="('确定删除作业？删除后无法恢复数据？')" @on-confirm="onConfirm()"
          confirmText="是，我要删除"></confirm>
      </div>

      <toast v-model="showPositionValue" type="text" :time="800" is-show-mask width="140px" :position="position">{{
        toastMessage }}</toast>

      <div v-transfer-dom>
        <confirm v-model="showDetail" show-input ref="confirm5" :title="studentInfo.className + '-' + studentInfo.studentName"
          @on-cancel="onCancel" @on-confirm="onConfirm5"></confirm>
      </div>

      <div v-if="showCheck" style="margin: 10px;overflow: hidden;">
        <masker fullscreen style="border-radius: 2px;" :opacity="0.8">
          <div slot="content" class="m-title">
            <div style="font-size: 1.6em">{{ studentInfo.className }}{{ studentInfo.studentName }} 本次考勤</div>
            <div v-if="studentInfo.classKqRefs.length" style="margin-top: 25px;">
              （班主任考勤：{{ studentInfo.classKqRefs[0].timeTypeName }}<span style="color: #FF8F03;">{{ studentInfo.classKqRefs[0].statusName }}</span>）
            </div>
            <div v-else-if="studentInfo.leaveInfo">
              （{{ studentInfo.leaveInfo.leaveTimeTypeName }}<span style="color: #FF8F03;">{{ studentInfo.leaveInfo.leaveTypeName }}</span>）
            </div>
            <div class="m-time">
              <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
                <div :class="'listBtn ' + (item.PARAM2 === 'mainRed' ? 'kuangke' : 'chidao')" v-for="item in row"
                  :key="item.CODE" @click="changeStauts(item.CODE)">
                  {{ item.NAME }}
                </div>
              </div>
            </div>

            <div class="m-time">
              <h1 @click="hideStatus()">
                <icon style="font-size: 2rem" type="clear"></icon>
              </h1>
            </div>
          </div>
        </masker>
      </div>

      <div v-if="showCheckDone" style="margin: 10px;overflow: hidden;">
        <masker fullscreen style="border-radius: 2px;" :opacity="0.8">
          <div slot="content" class="m-title">
            <span style="font-size: 1.6em">{{ studentInfo.className }}{{ studentInfo.studentName }}
              本次{{  studentInfo.statusName }}</span>
            <div v-if="studentInfo.classKqRefs.length" style="margin-top: 25px;">
              （班主任考勤：{{ studentInfo.classKqRefs[0].timeTypeName }}<span style="color: #FF8F03;">{{ studentInfo.classKqRefs[0].statusName }}</span>）
            </div>
            <div v-else-if="studentInfo.leaveInfo">
              （{{ studentInfo.leaveInfo.leaveTimeTypeName }}<span style="color: #FF8F03;">{{ studentInfo.leaveInfo.leaveTypeName }}</span>）
            </div>
            <div class="m-time">
              <h1 class="listBtnRow bingjia" @click="changeStauts('1')">改为到勤</h1>
            </div>
            <br />
            <div class="m-time">
              <h1 @click="hideStatus()">
                <icon style="font-size: 2rem" type="clear"></icon>
              </h1>
            </div>
          </div>
        </masker>
      </div>
    </div>
  </div>
</template>

<script lang="js">


import {
  Confirm,
  Group,
  XSwitch,
  XButton,
  TransferDomDirective as TransferDom,
  XHeader,
  Cell,
  Toast,
  Masker,
  Icon
} from "vux";
import { Button, Tab, Tabs, Calendar } from "vant";
import Back from "@/components/common/Back.vue";
import apiRouter from "@/config/api.js";
import { THEME_COLOR_MAP } from '@/config/colorMap';
import img0 from "@/assets/attandence/0.png";
import img2 from "@/assets/attandence/2.png";
import img3 from "@/assets/attandence/3.png";
import img4 from "@/assets/attandence/4.png";
import img5 from "@/assets/attandence/5.png";
import img6 from "@/assets/attandence/6.png";

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
    Masker,
    Icon,
    [ Calendar.name ]: Calendar,
    [ Tab.name ]: Tab,
    [ Button.name ]: Button,
    [ Tabs.name ]: Tabs
  },
  mounted() { },
  activated() {
    // if (this.$route.query.fresh && this.$route.query.fresh == "1") {
    //   this.loadData();
    // } else {

    // }
    this.loadData();
    this.courseTitle = this.$route.query.courseTitle;
    this.courseId = this.$route.query.courseId;
    this.mainId = this.$route.query.checkMainId;
    this.checkonDate = new Date(
      this.$route.query.checkonDate.replace(/-/g, "/")
    );

    //this.loadData();
    document.title = "选修考勤详情";
  },
  deactivated() {
    document.title = "个人中心";
  },
  data() {
    return {
      statusArr: [],
      attendanceStatusColorMap: {
        '1': THEME_COLOR_MAP[ 'mainGreen' ],
        '2': THEME_COLOR_MAP[ 'warningRed' ],
        '3': THEME_COLOR_MAP[ 'warningRed' ],
        '4': THEME_COLOR_MAP[ 'mainOrange' ],
        '5': THEME_COLOR_MAP[ 'mainOrange' ],
        '6': THEME_COLOR_MAP[ 'warningRed' ],
      },
      studentInfo: {},
      showDatePicker: false,
      showDetail: false,
      showCheck: false,
      showCheckDone: false,
      baseImgUrl: roterPath,
      courseTitle: "",
      showPositionValue: false,
      position: "default",

      toastMessage: "",
      messageData: [],

      otherCategoryList: [],
      topListCategory: [],

      active: 0,


      selectTab: 0,
      id: "",
      page: 1,
      popup: false,
      isShow: false,
      showItemNumber: -1,
      isEndReached: false,
      totalPage: 1,
      needShow: false,
      lastShow: false,

      mainId: "",
      courseId: "",
      checkonDate: new Date(),

      wwwUrl:
        roterPath +
        "/weixin/wechat/views/homework/homework-view.jsp?homeworkId="
    };
  },
  computed: {
    list() {
      return this.statusArr;
    },
    rows() {
      const total = this.list.length;

      // ≤ 5：一行
      if (total <= 5) {
        return [ this.list ];
      }

      // > 5：两行
      const upperCount = Math.floor(total / 2);
      const upper = this.list.slice(0, upperCount);
      const lower = this.list.slice(upperCount);

      return [ upper, lower ];
    }
  },
  methods: {
    getAttendanceImage(status) {
      switch (status) {
        case '2':
          return img2;
        case '3':
          return img3;
        case '4':
          return img4;
        case '5':
          return img5;
        case '6':
          return img6;
        default:
          return img0;
      }
    },
    editDetail(item) {
      // debugger;
      this.studentInfo = item;
      this.showDetail = true;
    },
    editCheck(item) {
      if (item.status == "1") {
        this.showCheck = true;
      } else {
        this.showCheckDone = true;
      }

      this.studentInfo = item;
    },
    onCancel() {
      // debugger;
    },
    onDatePickerConfirm(date) {
      console.log(date);
      let vm = this;
      let date_str = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()}`;
      this.$http
        .post(apiRouter.UPDATE_CHECKON_DATE, {
          main_id: this.mainId,
          course_id: this.courseId,
          date_str
        })
        .then(
          response => {
            this.showDatePicker = false;
            if (response.body.code === 200) {
              this.checkonDate = date;
              //vm.loadData();
              this.$router.replace({
                path: "/ele-std",
                query: {
                  courseTitle: vm.courseTitle,
                  courseId: vm.courseId,
                  checkMainId: vm.mainId,
                  checkonDate: date_str
                }
              });
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    },
    onConfirm5(value) {
      if (!value.trim()) {
        this.$vux.toast.text('请输入备注');
        return;
      }

      let vm = this;
      this.$refs.confirm5.setInputValue("");
      let student = vm.studentInfo;
      let courseId = vm.$route.query.courseId;
      let checkMainId = vm.$route.query.checkMainId;


      this.$http
        .get(
          apiRouter.GET_CHANGE_TCHECKON_MAIN +
          "?mainId=" +
          checkMainId +
          "&status=remark" +
          // student.STATUS +
          "&studentId=" +
          student.studentId +
          "&remark=" +
          value
        )
        .then(
          response => {
            if (response.body.code === 200) {
              vm.showCheck = false;
              vm.showCheckDone = false;

              vm.toastMessage = "修改学生备注成功";
              vm.showPositionValue = true;
              vm.loadData();
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    },
    hideStatus() {
      this.showCheck = false;
      this.showCheckDone = false;
    },
    changeStauts(status) {
      let vm = this;
      let student = vm.studentInfo;
      let courseId = vm.$route.query.courseId;
      let checkMainId = vm.$route.query.checkMainId;

      this.$http
        .get(
          apiRouter.GET_CHANGE_TCHECKON_MAIN +
          "?mainId=" +
          checkMainId +
          "&status=" +
          status +
          "&studentId=" +
          student.studentId +
          "&remark="
        )
        .then(
          response => {
            if (response.body.code === 200) {
              vm.showCheck = false;
              vm.showCheckDone = false;

              vm.toastMessage = response.body.message;
              vm.showPositionValue = true;
              vm.loadData();
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    },
    goBack() {
      this.$router.go(-1);
    },
    goDetail(e) {
      this.$router.push({
        path: "/cur-enroll",
        query: { courseId: e.courseId }
      });
    },

    loadData() {
      let vm = this;
      let courseId = vm.$route.query.courseId;
      let checkMainId = vm.$route.query.checkMainId;
      this.$http
        .get(
          apiRouter.GET_STUDENT_CHECKON_LIST2 +
          "?courseId=" +
          courseId +
          "&checkMainId=" +
          checkMainId
        )
        .then(
          response => {
            if (response.body.code === 200) {
              vm.statusArr =  response.body.data.sel_kq_status_arr.filter(val => {
                return val.IS_ENABLE === '1' && val.PARAM2 !== 'mainGreen';
              });
              vm.messageData = response.body.data.dataList;
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/minxin.less";

.wapper {
  position: absolute;
  top: 95px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
}

.message {
  width: 100%;
}

.message li {
  .mixin-padding(15px, 15px);
  border-bottom: 1px solid @colorDD;
  height: 80px;
  position: relative;
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
  margin-top: 5px;
}

.message-handle {
  position: absolute;
  top: 25px;
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
  color: #2196f3;
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
  color: #ff5e5e;
}

a.delete {
  color: #ff5e5e;
}

.publis {
  color: #f09709;
}

.inform {
  color: #48b319;
}

.lose {
  color: #9b9b9b;
}

.weui-dialog__title {
  font-size: @fontSize34;
  color: #333333;
}

.moreData,
.lastShow {
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
  color: #e12727;
}

.title-header {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  //   height: 50px;
  height: 46px;
  //   line-height: 50px;
  z-index: 1;
  border-bottom: solid 1px #dedede;
}

.title-header /deep/ .vux-header-title {
  color: #333;
  //   line-height: 46px;
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
  border-bottom: 1px solid #dddddd;
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

.m-img {
  padding-bottom: 33%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-size: 16px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  top: 40%;
  transform: translateY(-50%);
}

.m-time {
  font-size: 12px;
  padding-top: 20px;
  margin-top: 5px;
}

.listBtn {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 50%;
  bottom: 23px;
  right: 20px;
  color: @white;
  z-index: 10;
  display: inline-block;
  margin: 1em 5px;
  // padding: 5px 10px;
  font-size: 12px;
}

.listBtnRow {
  width: 60px;
  height: 60px;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize30;
  bottom: 23px;
  right: 20px;
  color: @white;
  z-index: 10;
  display: inline-block;
  margin: 1em 5px;
  padding: 5px 10px;
}

.chidao {
  background: #FF8F03;
}

.zaotui {
  background: #1ba0e1;
}

.kuangke {
  background: #ff5e5e;
}

.bingjia {
  background: #48b31a;
}

.shijia {
  background: #9c26b0;
}

.chenlBtn {
  width: 60px;
  height: 60px;
  line-height: 63px;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize36;
  bottom: 23px;
  right: 20px;
  background: @green;
  z-index: 10;
}
</style>
