<template>
	<div class="box" ref="msgBox">
		<x-header
			class="title-header"
			:left-options="{preventGoBack: true}"
			@on-click-back="goBack"
		>{{courseTitle}}</x-header>
		<div class="wapper">
			<ul class="message" key="subjectListUl">
				<li class="clearfix" v-for="(news,index) in messageData" :key="index">
					<div class="message-icon"></div>
					<a href="javascript:void(0);" @click="goCheck(news)" class="message-info">
						<h3 style="color: #424242">{{news.TITLE_DATE}}</h3>
						<p v-if="news.NOCHECK == 0" style="color: #777777">全勤</p>
						<p v-else style="color: #777777">缺勤{{news.NOCHECK}}人</p>
					</a>
					<div class="message-handle" style="text-align:center;">
						<a v-if="news.NOCHECK == 0" class="publishBtn inform">全勤</a>
						<a v-else class="publishBtn pubisnBtn">有缺勤</a>
						<div class="publishBtn pubisnBtn" style="margin-top:2px;" @click="confirmDelete">
							<van-icon name="delete-o" style="vertical-align: middle;margin-top: -2px;margin-right:3px;" />撤销
						</div>
					</div>
				</li>
			</ul>

			<div v-if="pageCount != page" class="more-title" @click="nextPage">
				<a href="javascript:void(0)">点击查看更多</a>
			</div>
			<div v-else class="more-title">
				<a v-if="!pageLoading" href="javascript:void(0)">到底啦</a>
				<a v-else href="javascript:void(0)">加载中...</a>
			</div>

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
			>{{ toastMessage }}</toast>
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
  Toast
} from "vux";
import { Dialog, Tab, Tabs, Icon } from "vant";
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
    Icon,
    Dialog,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs
  },
  mounted() {},
  activated() {
    this.page = 1;
    // if (this.$route.query.fresh && this.$route.query.fresh == "1") {
    //   this.messageData = [];
    //   this.loadData();
    // } else {
    //   this.loadData();
    // }
    this.courseId = this.$route.query.courseId;
    this.courseTitle = this.$route.query.courseTitle;

    this.loadData();
    document.title = "选修考勤记录";
  },
  deactivated() {
    document.title = "个人中心";
  },
  data() {
    return {
      courseId: "",
      courseTitle: "",
      showPositionValue: false,
      position: "default",
      toastMessage: "",
      messageData: [],
      otherCategoryList: [],
      topListCategory: [],
      //课程状态
      statusView: {
        100: {
          text: "待开始",
          color: "red"
        },
        200: {
          text: "可报名",
          color: "#0bb20c"
        },
        201: {
          text: "已报名",
          color: "#38f"
        },
        0: {
          text: "已报满",
          color: "rgb(119, 119, 119)"
        },
        300: {
          text: "已结束",
          color: "rgb(119, 119, 119)"
        }
      },
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
      pageCount: 1,
      pageLoading: false,
      popup: false,
      isShow: false,
      showItemNumber: -1,
      isEndReached: false,
      totalPage: 1,
      needShow: false,
      lastShow: false,
      wwwUrl:
        roterPath +
        "/weixin/wechat/views/homework/homework-view.jsp?homeworkId="
    };
  },
  methods: {
    async confirmDelete() {
      let answer = await Dialog.confirm({
        className: "dy-rate-dialog",
        title: "撤销",
        message: "确定要撤销本次考勤吗？",
        confirmButtonText: "确定",
      });
      if (answer === "confirm") {
        // this.viewMode = 0;
        // this.$router.back();
      }
    },
    goCheck(e) {
      let vm = this;
      this.$router.push({
        path: "/ele-std",
        query: {
          courseTitle: vm.courseTitle,
          courseId: vm.courseId,
          checkMainId: e.ID
        }
      });
    },
    addToday() {
      let vm = this;
      let courseId = this.$route.query.courseId;
      let checkDateStr = new Date().format("yyyy-MM-dd hh:mm:ss");
      this.$http
        .get(
          apiRouter.GET_ADD_TCHECKON_MAIN +
            "?courseId=" +
            courseId +
            "&check_date=" +
            checkDateStr
        )
        .then(
          response => {
            if (response.body.code === 200) {
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
      this.$router.push({ path: "/ele-list" });
    },
    goDetail(e) {
      this.$router.push({
        path: "/cur-enroll",
        query: { courseId: e.courseId }
      });
    },

    loadDataNext() {
      let vm = this;
      let courseId = vm.$route.query.courseId;
      this.$http
        .get(
          apiRouter.GET_ALL_CHECK_COURSE +
            "?courseId=" +
            courseId +
            "&curPage=" +
            vm.page +
            "&pageSize=10"
        )
        .then(
          response => {
            if (response.body.code === 200) {
              let messageData = response.body.data.infoList;
              //vm.messageData = messageData;

              vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
              vm.messageData = vm.messageData.concat(messageData);
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    },
    loadData() {
      let vm = this;
      vm.messageData = [];
      let courseId = vm.$route.query.courseId;
      this.$http
        .get(
          apiRouter.GET_ALL_CHECK_COURSE +
            "?courseId=" +
            courseId +
            "&curPage=" +
            vm.page +
            "&pageSize=10"
        )
        .then(
          response => {
            if (response.body.code === 200) {
              let messageData = response.body.data.infoList;
              //vm.messageData = messageData;

              vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
              vm.messageData = vm.messageData.concat(messageData);
            } else {
              alert(response.body.message);
            }
          },
          error => {
            debugger;
          }
        );
    },
    nextPage() {
      let _this = this;
      _this.page = _this.page + 1;
      _this.loadDataNext();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/minxin.less";
.wapper {
  position: absolute;
  top: 47px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
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
.message {
  width: 100%;
}

.message li {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  border-bottom: 1px solid @colorDD;
  height: 160 / @baseSize;
  position: relative;
}

.message-icon {
  width: 100 / @baseSize;
  height: 100 / @baseSize;
  background: url("../../assets/curriculum/ele.png") no-repeat left;
  background-size: 100% 100%;
  position: absolute;
  top: 30 / @baseSize;
  left: 30 / @baseSize;
  border-radius: 3px;
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
  top: 30 / @baseSize;
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
  color: #999;
}
</style>
