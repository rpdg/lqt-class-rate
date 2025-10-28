<template>
	<div class="box">
		<van-nav-bar
			class="title-return-top"
			title="课程列表"
			left-text="返回"
			right-text
			left-arrow
			@click-left="goBack"
		>
    <!-- <template #right>
      <van-button v-if="hasClass" plain type="primary" size="mini" class="btnBlueBorder" @click="viewClassDetail">查看考勤</van-button>
    </template> -->
  		</van-nav-bar>
		<div class="wapper">
			<ul class="message" key="kListUl">
				<li class="clearfix" v-for="(item,index) in messageData" :key="index">
					<div class="message-icon"></div>
					<a href="javascript:void(0);" @click="goCheck(item)" class="message-info">
						<h3>{{ item.NAME }}</h3>
						<p style="color: #777777">{{ item.PLACE }} {{ item.TIMES }}</p>
					</a>
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
	Cell
} from 'vux'
import { Button, Tab, Tabs, NavBar } from 'vant'
import Back from '../../components/common/Back.vue'
import apiRouter from '../../config/api.js'

export default {
	directives: {
		TransferDom,
	},
	components: {
		Back,
		Confirm,
		Group,
		XSwitch,
		XButton,
		Cell,
		[Button.name]: Button,
		[Tab.name]: Tab,
		[Tabs.name]: Tabs,
		[NavBar.name]: NavBar,
	},
	mounted() {},
	activated() {
		this.page = 1
		if (this.$route.query.fresh && this.$route.query.fresh == '1') {
			this.messageData = []
			this.loadData()
		} else {
			this.loadData()
		}
		//this.loadData();
		document.title = '选修考勤'
	},
	deactivated() {
		document.title = "绿蜻蜓"
	},
	data() {
		return {
			messageData: [],
			otherCategoryList: [],
			topListCategory: [],
			//课程状态
			statusView: {
				100: {
					text: '待开始',
					color: 'red',
				},
				200: {
					text: '可报名',
					color: '#0bb20c',
				},
				201: {
					text: '已报名',
					color: '#38f',
				},
				0: {
					text: '已报满',
					color: 'rgb(119, 119, 119)',
				},
				300: {
					text: '已结束',
					color: 'rgb(119, 119, 119)',
				},
			},
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
			popup: false,
			isShow: false,
			showItemNumber: -1,
			isEndReached: false,
			totalPage: 1,
			needShow: false,
			lastShow: false,
			hasClass: false,
			wwwUrl:
				roterPath +
				'/weixin/wechat/views/homework/homework-view.jsp?homeworkId=',
		}
	},
	methods: {
		goBack() {
			this.$router.push({ path: '/' })
		},
		viewClassDetail(){
			window.location.href = `/weixin/wechat/v2/index.html#/class_attendance/elective_course`;
		},
		loadData() {
			let vm = this
			vm.messageData = []
			this.$http
				.get(
					apiRouter.GET_TEACHER_COURSE +
						'?' +
						'curPage=' +
						vm.page +
						'&pageSize=10'
				)
				.then(
					(response) => {
						if (response.body.code === 200) {
							if (response.body.data.infoList.length === 1) {
								let e = response.body.data.infoList[0];
								this.$router.push({
									path: '/ele-sublist',
									query: { courseTitle: e.NAME, courseId: e.ID },
								});
							}
							let messageData = response.body.data.infoList
							vm.pageLoading = false
							vm.pageCount = Math.ceil(response.body.data.pageCount / 10)
							vm.messageData = vm.messageData.concat(messageData)
							vm.hasClass = (response.body.data.classCount>0 || response.body.data.hasViewPower >0)
						} else {
							alert(response.body.message)
						}
					},
					(error) => {
						debugger
					}
				)
		},
		loadDataNext() {
			let vm = this
			this.$http
				.get(
					apiRouter.GET_TEACHER_COURSE +
						'?' +
						'curPage=' +
						vm.page +
						'&pageSize=10'
				)
				.then(
					(response) => {
						if (response.body.code === 200) {
							let messageData = response.body.data.infoList
							vm.pageLoading = false
							vm.pageCount = Math.ceil(response.body.data.pageCount / 10)
							vm.messageData = vm.messageData.concat(messageData)
						} else {
							alert(response.body.message)
						}
					},
					(error) => {
						debugger
					}
				)
		},
		nextPage() {
			let _this = this
			_this.page = _this.page + 1
			_this.loadDataNext()
		},
		goCheck(e) {
			this.$router.push({
				path: '/ele-sublist',
				query: { courseTitle: e.NAME, courseId: e.ID },
			})
		},
	},
}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';
.wapper {
	position: absolute;
	top: 47px;
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

.message-icon {
	width: 50px;
	height: 50px;
	background: url('../../assets/curriculum/group.png') no-repeat left;
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
	margin-top: 5px;
}

.message-handle {
	position: absolute;
	top: 15px;
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
	background: url('../../assets/xbg.png') no-repeat;
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
	background: url('../../assets/new.png') no-repeat 0;
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
	background: url('../../assets/trash.png') no-repeat 0;
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
	color: #4caf50;
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
	background: url('../../assets/loading.gif') no-repeat;
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
	color: #f09709;
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


.btnBlueBorder {
  border-color: #0093dd;
  color: #0093dd;
}
</style>
