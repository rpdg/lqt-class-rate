<template>
	<div class="box">
		<x-header
			class="title-header"
			:left-options="{preventGoBack: true}"
			@on-click-back="goBack"
		>{{courseTitle}}</x-header>
		<div
			style="width: 100vw; position: absolute; top: 57px; height: 38px; padding:0 20px; border-bottom: 1px #ddd dashed;"
		>
			考勤日期：{{checkonDate.getMonth()+1}}月{{checkonDate.getDate()}}日
			<van-button
				plain
				hairline
				size="mini"
				type="info"
				color="orange"
				style="float:right;"
				@click="showDatePicker=true"
			>&nbsp; 修改 &nbsp;</van-button>
			<van-calendar
				:color="'#48B319'"
				v-model="showDatePicker"
				@confirm="onDatePickerConfirm"
				:default-date="checkonDate"
				:min-date="new Date(checkonDate.getTime() - 15552000000)"
				:max-date="new Date"
			/>
		</div>
		<div class="wapper">
			<ul key="stuListUl">
				<li
					style="width: 33%;display: inline-block;margin-top: 0.72rem"
					v-for="(item,index) in messageData"
					:key="index"
				>
					<div style="width: 100%;text-align: center; ">
						<div
							@click="editCheck(item)"
							style="width: 70%;height: 110px;display: inline-block;position: relative;"
						>
							<img style="width: 100%;height: 100%" :src="item.AVATAR" />
							<img
								v-if="item.STATUS != '1'"
								style="width: 60%;position: absolute;bottom: 0;right: 0;"
								src="@/assets/curriculum/duty.png"
							/>
						</div>

						<div>{{item.SHORT_NAME}} {{item.NAME}}</div>
						<img
							v-if="!item.REMARK"
							@click="editDetail(item)"
							style="width: 20px;margin-top: 5px"
							src="@/assets/edit.png"
						/>
						<span
							v-else
							@click="editDetail(item)"
							style="color: #DDDDDD;margin-top: 8px;display: inline-block;"
						>{{item.REMARK}}</span>
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
				<confirm
					v-model="popup"
					:close-on-confirm="false"
					:title="('确定删除作业？删除后无法恢复数据？')"
					@on-confirm="onConfirm()"
					confirmText="是，我要删除"
				></confirm>
			</div>

			<toast
				v-model="showPositionValue"
				type="text"
				:time="800"
				is-show-mask
				width="140px"
				:position="position"
			>{{ toastMessage }}</toast>

			<div v-transfer-dom>
				<confirm
					v-model="showDetail"
					show-input
					ref="confirm5"
					:title="studentInfo.SHORT_NAME+'-'+studentInfo.NAME"
					@on-cancel="onCancel"
					@on-confirm="onConfirm5"
				></confirm>
			</div>

			<div v-if="showCheck" style="margin: 10px;overflow: hidden;">
				<masker fullscreen style="border-radius: 2px;" :opacity="0.8">
					<div slot="content" class="m-title">
						<span style="font-size: 1.6em">{{ studentInfo.SHORT_NAME}}{{ studentInfo.NAME }} 本次考勤</span>
						<br />
						<span class="m-time">
							<h1 class="listBtn chidao" @click="changeStauts('2')">迟到</h1>
							<h1 class="listBtn zaotui" @click="changeStauts('3')">早退</h1>
							<h1 class="listBtn kuangke" @click="changeStauts('4')">旷课</h1>
							<h1 class="listBtn bingjia" @click="changeStauts('5')">病假</h1>
							<h1 class="listBtn shijia" @click="changeStauts('6')">事假</h1>
						</span>

						<span class="m-time">
							<h1 @click="hideStatus()">
								<icon style="font-size: 2rem" type="clear"></icon>
							</h1>
						</span>
					</div>
				</masker>
			</div>

			<div v-if="showCheckDone" style="margin: 10px;overflow: hidden;">
				<masker fullscreen style="border-radius: 2px;" :opacity="0.8">
					<div slot="content" class="m-title">
						<span style="font-size: 1.6em">{{ studentInfo.SHORT_NAME}}{{ studentInfo.NAME }} 本次考勤</span>
						<br />
						<span class="m-time">
							<h1 class="listBtnRow bingjia" @click="changeStauts('1')">改为到勤</h1>
						</span>
						<br />
						<span class="m-time">
							<h1 @click="hideStatus()">
								<icon style="font-size: 2rem" type="clear"></icon>
							</h1>
						</span>
					</div>
				</masker>
			</div>
		</div>
	</div>
</template>

<script>
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
import Back from "../../components/common/Back.vue";
import apiRouter from "../../config/api.js";
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
    [Calendar.name]: Calendar,
    [Tab.name]: Tab,
    [Button.name]: Button,
    [Tabs.name]: Tabs
  },
  mounted() {},
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
      statusView: {
        1: "到勤",
        2: "迟到",
        3: "早退",
        4: "旷课",
        5: "病假",
        6: "事假"
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
      allCategoryList: [],
      totalCourselist: [],
      checkObj: {
        finalList: [],
        noDoList: []
      },

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
  methods: {
    editDetail(item) {
      this.showDetail = true;
      this.studentInfo = item;
    },
    editCheck(item) {
      if (item.STATUS == "1") {
        this.showCheck = true;
      } else {
        this.showCheckDone = true;
      }

      this.studentInfo = item;
    },
    onCancel() {
      debugger;
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
      let vm = this;
      this.$refs.confirm5.setInputValue("");
      let student = vm.studentInfo;
      let courseId = vm.$route.query.courseId;
      let checkMainId = vm.$route.query.checkMainId;
      //this.$vux.toast.text('input value: ' + value)

      this.$http
        .get(
          apiRouter.GET_CHANGE_TCHECKON_MAIN +
            "?mainId=" +
            checkMainId +
            "&status=" +
            student.STATUS +
            "&studentId=" +
            student.ID +
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
            student.ID +
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
          apiRouter.GET_STUDENT_CHECKON_LIST +
            "?courseId=" +
            courseId +
            "&checkMainId=" +
            checkMainId
        )
        .then(
          response => {
            if (response.body.code === 200) {
              // let messageData = [
              //     {
              //         "STATUS": "1", //考勤状态（1：到勤 2：迟到 3：早退 4：旷课 5：病假 6：事假）
              //         "ID": "A10328", //学生id
              //         "AVATAR": "/ID-PHOTO/2020-09-28/925dc983-e8a2-4d27-929c-e6849c360d37.jpg", //学生照片路径
              //         "REMARK": "",
              //         "SHORT_NAME": "六1班", //班级名称
              //         "NAME": "段延庆" //学生姓名
              //     },
              //     {
              //         "STATUS": "1",
              //         "ID": "A11387",
              //         "AVATAR": "/ID-PHOTO/2020-08-12/97f7cfa5-0389-4231-8d68-1661c0bda58b.jpg",
              //         "REMARK": "",
              //         "SHORT_NAME": "六3班",
              //         "NAME": "杨扬"
              //     },
              //     {
              //         "STATUS": "1",
              //         "ID": "A10331",
              //         "AVATAR": "/ID-PHOTO/2020-08-12/dc12a5b9-bac9-4683-b363-2d5d1101e68c.jpg",
              //         "REMARK": "",
              //         "SHORT_NAME": "六3班",
              //         "NAME": "阮星竹"
              //     },
              //     {
              //         "STATUS": "1",
              //         "ID": "A11398",
              //         "AVATAR": "/ID-PHOTO/2020-08-12/0cc10819-e0ff-4bb7-bcff-4463d7ec3dd3.JPG",
              //         "REMARK": "",
              //         "SHORT_NAME": "六3班",
              //         "NAME": "李杰"
              //     }
              // ]
              //response.body.data.infoList;
              let messageData = response.body.data.infoList;
              vm.messageData = messageData;
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
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  border-bottom: 1px solid @colorDD;
  height: 160 / @baseSize;
  position: relative;
}

.message-info {
  margin-left: 125 / @baseSize;
  margin-right: 100 / @baseSize;
  padding-top: 40 / @baseSize;
  display: block;
}

.message-info h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 40 / @baseSize;
  font-size: @fontSize30;
  color: @color42;
}

.message-info p {
  font-size: @fontSize24;
  color: @color42;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 10 / @baseSize;
}

.message-handle {
  position: absolute;
  top: 50 / @baseSize;
  right: 30 / @baseSize;
  text-align: right;
}

.message-handle a {
  padding-top: 8 / @baseSize;
  padding-bottom: 8 / @baseSize;
  display: block;
}

.edlit-molde {
  width: 172 / @baseSize;
  height: 142 / @baseSize;
  position: absolute;
  right: 130 / @baseSize;
  background: url("../../assets/xbg.png") no-repeat;
  background-size: 100% 100%;
  top: 60 / @baseSize;
  z-index: 9;
}

.edlit-molde a {
  padding-bottom: 16 / @baseSize;
  padding-top: 20 / @baseSize;
  display: block;
  font-size: @fontSize24;
}

.edlit-molde a.revamp {
  color: #2196f3;
}

.edlit-molde a.revamp em {
  width: 22 / @baseSize;
  height: 23 / @baseSize;
  background: url("../../assets/new.png") no-repeat 0;
  background-size: 100% 100%;
  display: inline-block;
  float: left;
  margin-top: 5 / @baseSize;
  margin-left: 30 / @baseSize;
  margin-right: 10 / @baseSize;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

a.delete em {
  width: 18 / @baseSize;
  height: 22 / @baseSize;
  background: url("../../assets/trash.png") no-repeat 0;
  background-size: 100% 100%;
  display: inline-block;
  float: left;
  margin-top: 5 / @baseSize;
  margin-left: 30 / @baseSize;
  margin-right: 10 / @baseSize;
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
  height: 80 / @baseSize;
  line-height: 80 / @baseSize;
  text-align: center;
}

.moreData span {
  height: 50 / @baseSize;
  background: url("../../assets/loading.gif") no-repeat;
  background-size: contain;
  padding-left: 45 / @baseSize;
}

.back-div {
  padding-bottom: 100 / @baseSize;
}
.up-back {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  line-height: 100 / @baseSize;
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
  //   height: 100 / @baseSize;
  height: 46px;
  //   line-height: 100 / @baseSize;
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
  margin-top: 100 / @baseSize;
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
  padding-top: 1rem;
  display: inline-block;
  margin-top: 5px;
}

.listBtn {
  width: 120 / @baseSize;
  height: 120 / @baseSize;
  line-height: 120 / @baseSize;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize34;
  bottom: 45 / @baseSize;
  right: 40 / @baseSize;
  color: @white;
  z-index: 10;
  display: inline-block;
  margin: 1em 5px;
}

.listBtnRow {
  width: 120 / @baseSize;
  height: 120 / @baseSize;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize30;
  bottom: 45 / @baseSize;
  right: 40 / @baseSize;
  color: @white;
  z-index: 10;
  display: inline-block;
  margin: 1em 5px;
  padding: 5px 10px;
}

.chidao {
  background: #fbc02d;
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
  width: 120 / @baseSize;
  height: 120 / @baseSize;
  line-height: 125 / @baseSize;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize36;
  bottom: 45 / @baseSize;
  right: 40 / @baseSize;
  background: @green;
  z-index: 10;
}
</style>
