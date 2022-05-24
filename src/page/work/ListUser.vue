<template>
	<div style="display: flex;flex-direction: column; height: 100vh; overflow: hidden;">
		<!-- 返回组件 -->
		<x-header
			class="title-header"
			:left-options="{preventGoBack: true}"
			@on-click-back="goBack"
			:title="`作业列表`"
		>
			<template slot="right">
				<van-icon
					name="label-o"
					color="#48B319"
					size="16"
					style="margin-right: 8px;"
					@click="showConfigure"
				/>
			</template>
		</x-header>
		<div class="lqt-wrapper" ref="listWrapper">
			<van-list
				class="lqt-list"
				id="homework"
				v-model="pageLoading"
				:finished="pageNum > 0 && (pageNum===pageCount || pageCount===0)"
				:finished-text="dataList.length ? `到底啦` : `暂无数据`"
				@load="loadNextPage"
				:immediate-check="false"
			>
				<div class="it clearfix it-m" v-show="false">不知道为啥，但是只能加这个样式才正常</div>
				<div
					class="it clearfix it-m"
					style="display: list-item;"
					v-for="item in dataList"
					:key="item.ID"
					@click="goDetail(item)"
				>
					<div class="list-title">
						<a class="link" href="javascript:void(0)">
							<span
								:class="'title-common single-line '+ ((item.CAN_CHANGE == 1 || !item.ANID )?'new':'')"
								:style="'background-color:'+item.COLOR"
							>
								<p>{{item.NAME}}</p>
							</span>
						</a>
					</div>
					<div class="list-content" style="padding-left: 6px">
						<div class="content-wapper">
							<a class="link" style="max-width: 240px;" href="javascript:void(0)">
								<p class="content-title">【{{item.TYPENAME}}】{{item.TITLE}}</p>
								<p
									class="content-info"
									style="line-height: 2.1em;font-size: 0.9em;padding-left: 7px;"
								>{{item.OUTDATE.substr(5 , 5) }}截止</p>
							</a>
						</div>
						<em v-if="!item.ANID" class="icon-next status-view" :style=" 'color:#d9534f'">未完成</em>
						<em
							v-else-if="item.CAN_CHANGE == 1"
							class="icon-next status-view"
							:style=" 'color:#ED9C28'"
						>待订正</em>
						<em
							v-else-if="item.TYPE !=1  && item.DZ_FLAG != '1'"
							class="icon-next status-view"
							:style=" 'color:#666666'"
						>待批阅</em>
						<em
							v-else-if="item.TYPE !=1  && item.DZ_FLAG == '1'"
							class="icon-next status-view"
							:style=" 'color:#0093dd'"
						>已订正</em>
						<!-- type = 1  -->
						<em v-else class="icon-next status-view" :style=" 'color:#48B319'">已批阅</em>
					</div>
				</div>
			</van-list>
		</div>
		<van-popup position="bottom" style="height: 50vh;" v-model="isShowConfigure" class="evaPicker">
			<div class="evaPickerToolbar">作业科目过滤</div>
			<div class="evaRecord">
				<van-button
					v-for="course in courseList"
					:key="course.COURSE_CODE"
					plain
					hairline
					type="primary"
					size="small"
					class="btnGreenBorder"
					@click="filteCourse(course.COURSE_CODE)"
				>{{course.COURSE_NAME}}</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
import apiRouter from '../../config/api.js'
import { XHeader } from 'vux'
import { Icon, Popup, List, Button } from 'vant'

// @ts-ignore
export default {
	components: {
		XHeader,
		[Icon.name]: Icon,
		[Popup.name]: Popup,
		[List.name]: List,
		[Button.name]: Button,
	},
	activated() {
		this.courseCode = ''
		this.pageCount = 1
		this.pageNum = 0
		this.dataList.length = 0
		this.courseList.length = 1
		this.$refs['listWrapper'].scrollTo(0, 0)
		this.pageLoading = true
		this.loadNextPage()

		this.oldPageTitle = document.title
		document.title = '作业'
	},
	deactivated() {
		document.title = this.oldPageTitle
	},

	methods: {
		goBack() {
			//debugger;
			this.$router.push({ path: '/' })
		},
		showConfigure() {
			this.isShowConfigure = true
		},
		filteCourse(curCode) {
			if (curCode !== this.courseCode) {
				this.isShowConfigure = false
				this.courseCode = curCode
				this.pageCount = 1
				this.pageNum = 0
				this.dataList.length = 0
				this.$refs['listWrapper'].scrollTo(0, 0)
				this.loadNextPage()
			}
		},
		loadNextPage() {
			let self = this
			self.pageLoading = true
			self.pageNum = self.pageNum + 1
			this.$http
				.get(
					apiRouter.GET_HOMEWORK_LIST +
						'?curPage=' +
						self.pageNum +
						'&pageSize=' +
						self.pageSize +
						'&courseCode=' +
						self.courseCode
				)
				.then(
					(response) => {
						if (response.body.status === 1) {
							if (self.pageNum === 1) {
								self.pageCount = Math.ceil(
									response.body.data.pageCount / this.pageSize
								)
								if (self.courseCode === '' && response.body.data.course_list) {
									self.courseList.push(...response.body.data.course_list)
								}
							}
							self.dataList.push(...response.body.data.infoList)
							self.pageLoading = false
						} else {
							alert(response.body.message)
						}
					},
					(response) => {
						alert('请求失败了!!!!')
					}
				)
		},
		//跳转详情页
		goDetail(e) {
			/**
        // 根据是否完成跳转页面
        // ANID:空为未完成，有id则已完成
        // CAN_CHANGE:默认值为0 如果被老师驳回则为1算未完成，需要和ANID一起判断
       */
			this.scrollTop = document.documentElement.scrollTop
			if (e.CAN_CHANGE == 1) {
				this.$router.push({
					path: 'work-user-rev',
					query: { workId: e.WORKID, anId: e.ANID },
				})
				return
			}
			let flag = e.CAN_CHANGE == 0 && e.ANID
			let path = 'work-detail'
			if (flag) {
				path = 'work-detail-done'
			}

			this.$router.push({
				path: path,
				query: { workId: e.WORKID, anId: e.ANID },
			})
		},
	},
	data() {
		return {
			oldPageTitle: '',
			dataList: [],
			courseList: [{ COURSE_CODE: '', COURSE_NAME: '全部科目' }],
			pageSize: 20,
			pageNum: 0,
			pageCount: 1,
			pageLoading: false,
			scrollTop: 0,
			isShowConfigure: false,
			courseCode: '',
		}
	},
}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';

.evaPicker {
	padding: 0 15px;
	height: 100%;
	display: flex;
	flex-direction: column;

	> .evaPickerToolbar {
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		text-align: center;
	}

	> .evaPickerRow {
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		text-align: left;
		border-bottom: 1px dashed #c7c7c7;
	}

	> .evaRecord {
		margin: 0;
	}
}

.evaRecord {
	margin: 15px 0;
	display: flex;
	flex-wrap: wrap;
	flex-grow: initial;
	gap: 10px;
	align-items: stretch;
}

.btnGreenBorder {
	border-color: #48b319;
	color: #48b319;
	padding: 0 1em;
}

* {
	padding: 0;
	margin: 0;
	word-break: break-all;
}

html {
	font-size: 50px;
}

body {
	color: #333;
	//font-size: 62.5%;
	font-family: 'Microsoft Yahei, Arial, sans-serif';
}

img {
	max-width: 100%;
}

ul,
li {
	list-style: none;
}

em,
i,
s,
u {
	font-weight: normal;
	font-style: normal;
	text-decoration: none;
}

a {
	color: #333;
	text-decoration: none;
}

a:hover {
	text-decoration: none;
}

.clearfix:after {
	content: '';
	clear: both;
}

.hidden {
	visibility: hidden;
}

.fl {
	float: left;
}

.fr {
	float: right;
}

.shake-in-out {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: 1;
	animation-iteration-count: 1;
	-webkit-animation-delay: 0;
	animation-delay: 0;
	-webkit-animation-fill-mode: none;
	animation-fill-mode: none;
}

.shakeOut {
	-webkit-animation-name: shakeOut;
	animation-name: shakeOut;
}

.shakeIn {
	-webkit-animation-name: shakeIn;
	animation-name: shakeIn;
}

.scale-point {
	-webkit-animation-duration: 0.8s;
	animation-duration: 0.8s;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: infinite;
	animation-iteration-count: infinite;
	-webkit-animation-delay: 0;
	animation-delay: 0;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.scalePoint {
	-webkit-animation-name: scalePoint;
	animation-name: scalePoint;
}

.shake-rotate {
	-webkit-animation-duration: 0.5s;
	animation-duration: 0.5s;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: 1;
	animation-iteration-count: 1;
	-webkit-animation-delay: 0;
	animation-delay: 0;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.shakeRotate {
	-webkit-animation-name: shakeRotate;
	animation-name: shakeRotate;
}

.animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.animated.infinite {
	-webkit-animation-iteration-count: infinite;
	animation-iteration-count: infinite;
}

.animated.hinge {
	-webkit-animation-duration: 2s;
	animation-duration: 2s;
}

.bounceInDown {
	-webkit-animation-name: bounceInDown;
	animation-name: bounceInDown;
}

.bounceOutUp {
	-webkit-animation-name: bounceOutUp;
	animation-name: bounceOutUp;
}

.fadeOut {
	-webkit-animation-name: fadeOut;
	animation-name: fadeOut;
}

.bounceIn {
	-webkit-animation-name: bounceIn;
	animation-name: bounceIn;
}

.bounceOut {
	-webkit-animation-name: bounceOut;
	animation-name: bounceOut;
}

.bounceInUp {
	-webkit-animation-name: bounceInUp;
	animation-name: bounceInUp;
}

.bounceOutDown {
	-webkit-animation-name: bounceOutDown;
	animation-name: bounceOutDown;
}

.icon {
	display: inline-block;
	background-repeat: no-repeat;
	background-size: 100%;
}

.icon-op::before,
.icon-op::after,
.icon-op em {
	float: left;
	display: block;
	content: '';
	width: 5px;
	height: 5px;
	margin: 0 2px 0 3px;
	background: #888;
	border-radius: 50%;
}

.icon-like {
	width: 12.5px;
	height: 11.5px;
	//background-image: url("../../images/icon/love.png")
}

.icon-like.active {
	//background-image: url("../../images/icon/loved.png")
}

.icon-like-w {
	width: 16px;
	height: 14.5px;
	//background-image: url("../../images/icon/momentHeart.png")
}

.icon-comment {
	width: 15px;
	height: 14.5px;
	//background-image: url("../../images/icon/momentComment.png")
}

.icon-publish {
	width: 29px;
	height: 28.5px;
	//background-image: url("../../images/icon/edit.png")
}

.icon-pre {
	font-family: 'icon';
}

.icon-pre {
	display: inline-block;
	-webkit-transform: rotate(180deg);
	transform: rotate(180deg);
}

.icon-rise,
.icon-set {
	position: relative;
	top: -0.01rem;
	display: inline-block;
	width: 0.15rem;
	height: 0.2rem;
	margin-right: 0.03rem;
	background-repeat: no-repeat;
	background-size: 100%;
}

.icon-set {
	//background-image: url("../../images/icon/set.png")
}

.icon-rise {
	font-family: 'icon';
	//background-image: url("../../images/icon/rise.png")
}

.icon-radio {
	position: relative;
	width: 18px;
	height: 18px;
	border: solid 1px #48b319;
	border-radius: 50%;
	background: #fff;
	overflow: hidden;
}

.icon-radio input {
	opacity: 0;
	position: absolute;
	top: 0;
	right: auto;
	bottom: auto;
	left: 0;
}

.icon-radio .icon-radio-point.active,
.icon-radio input:checked + .icon-radio-point {
	display: block;
	width: 12px;
	height: 12px;
	margin: 3px auto 0;
	background: #48b319;
	border-radius: 50%;
}

.icon-checkbox {
	position: relative;
	width: 18px;
	height: 18px;
	border: solid 1px #48b319;
	border-radius: 3px;
	background: #fff;
	overflow: hidden;
}

.icon-checkbox input {
	opacity: 0;
	outline: none;
	position: absolute;
	top: 0;
	right: auto;
	bottom: auto;
	left: 0;
}

.icon-checkbox input:checked + .icon-checkbox-point {
	display: block;
}

.icon-checkbox .icon-checkbox-point {
	display: none;
	font-family: 'icon';
	font-size: 40px;
	line-height: 14px;
	text-align: center;
	color: #48b319;
}

.icon-checkbox .icon-checkbox-point.active {
	display: block;
}

.icon-next {
	font-family: icon;
	position: absolute;
	width: 0.4rem;
	height: 0.4rem;
}

.status-view {
	width: auto;
	height: 2em;
	line-height: 2em;
	font-size: 0.9em;
}

.icon-next:after {
	-webkit-transform: rotate(-45deg);
	transform: rotate(-45deg);
}

.icon-star_e,
.icon-star_f {
	width: 0.49rem;
	height: 0.46rem;
	background-repeat: no-repeat;
	background-size: auto 100%;
}

.icon-star_f,
.icon-star_e.active {
	//background-image: url("../../images/icon/star_fill.png")
}

.icon-star_e {
	//background-image: url("../../images/icon/star_w.png")
}

body {
	background: #f2f2f2;
}

.lqt-list {
	// display: none;
	padding-left: 10px;
	// overflow: hidden;
	background: #fff;
	// box-shadow: 0 2px 0 rgba(9, 9, 9, 0.2);
}

.lqt-list .it {
	padding: 10px 10px 10px 1.4rem;
	border-top: solid 1px #dedede;
	margin-top: -1px;
}

.lqt-list .list-title {
	float: left;
	position: relative;
}

.lqt-list .list-title .title-common {
	display: block;
	width: 1.9rem;
	height: 1.9rem;
	text-align: center;
	color: #fff;
}

.lqt-list .list-title .title-results {
	line-height: 1rem;
	text-align: center;
	font-family: 'icon';
	color: #48b319;
	font-size: 36px;
}

.lqt-list .list-title .title-results {
	color: #1ba0e1;
}

.lqt-list .list-title .single-line {
	line-height: 1.9rem;
	font-size: 15px;
}

.lqt-list .list-title .double-line {
	line-height: 0.36rem;
	//font-size: 14px
}

.lqt-list .list-title .double-line p:first-child {
	padding-top: 6px;
}

.lqt-list .list-title .new::before {
	content: '';
	width: 0.26rem;
	height: 0.26rem;
	background-color: #ff4d33;
	border-radius: 100%;
	position: absolute;
	top: -3px;
	right: -3px;
	bottom: auto;
	left: auto;
}

.lqt-list .list-title .anonym:after,
.lqt-list .list-title .no-anonym:after {
	content: '';
	width: 0.3rem;
	height: 0.27rem;
	background-repeat: no-repeat;
	background-size: 100%;
	border-radius: 100%;
	position: absolute;
	top: auto;
	right: 1px;
	bottom: 1px;
	left: auto;
}

.lqt-list .it-m {
	padding-left: 1.3rem;
}

.lqt-list .it-m .list-title {
	margin-left: -1.2rem;
}

.lqt-list .it-s {
	padding-left: 1rem;
}

.lqt-list .it-s .list-title {
	margin-left: -1rem;
}

.lqt-list .list-content {
	position: relative;
	float: left;
	width: 92%;
	padding-left: 1em;
}

.lqt-list .list-content .content-wapper {
	padding-right: 0.48rem;
}

.lqt-list .list-content .content-wapper a {
	/*font-size: .5rem;*/
	font-size: 1.1em;
}

.lqt-list .list-content .content-title {
	//font-size: .3rem;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.lqt-list .list-content .content-info {
	//padding-top: 7px;
	//font-size: .28rem;
	color: #666;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.lqt-list .icon-next {
	color: #9b9b9b;
	position: absolute;
	top: 1em;
	right: 0;
	bottom: auto;
	left: auto;
}

.lqt-list .icon-noticeTime {
	font-family: 'Microsoft Yahei';
	/*font-size: 11px;*/
	color: #999;
	position: absolute;
	top: 20px;
	right: -5px;
	bottom: auto;
	left: auto;
}

.lqt-resultsList .content-title {
	line-height: 1rem;
}

.lqt-resultsList .icon-next {
	top: 10px;
}

#zone .title-common {
	background-position: center;
	background-size: cover;
}

#homework .title-common,
#zone .title-common {
	text-align: center;
	border-radius: 3px;
	color: #fff;
}

#notice .title-common {
	line-height: 1rem;
	text-align: center;
	font-family: 'icon';
	color: #48b319;
	font-size: 36px;
}

html,
body {
	height: 100%;
}

/*@font-face {*/
/*  font-family: 'icon';*/
/*  url("../../style/fonts/icon-webfont.woff") format("woff"),*/
/*  font-weight: normal;*/
/*  font-style: normal*/
/*}*/

img {
	max-width: 100%;
}

.lqt-arrow {
	position: absolute;
	top: 12px;
	right: auto;
	bottom: auto;
	left: -8px;
	z-index: 2;
	width: 8.5px;
	height: 14px;
	overflow: hidden;
}

.lqt-arrow .arrow-up,
.lqt-arrow .arrow-down {
	position: absolute;
	top: 2px;
	right: auto;
	bottom: auto;
	left: 2px;
	width: 10px;
	height: 10px;
	background: #dedede;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
}

.lqt-arrow .arrow-down {
	left: 3.5px;
	background: -webkit-gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));
	box-shadow: 1px -1px 1px -1px #fff inset;
}

.lqt-container {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}

.pullDownLabel,
.pullUpLabel {
	line-height: 30px;
	color: #8e8e8e;
	text-align: center;
}

.pullDownLabel .scalePoint,
.pullUpLabel .scalePoint {
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #999;
	border-radius: 50%;
	margin: 0 1px 2px;
}

.pullDownLabel .pullTxt,
.pullUpLabel .pullTxt {
	padding-left: 5px;
}

.pullDownLabel .active-1,
.pullUpLabel .active-1 {
	-webkit-animation-delay: -0.32s;
	animation-delay: -0.32s;
}

.pullDownLabel .active-2,
.pullUpLabel .active-2 {
	-webkit-animation-delay: -0.16s;
	animation-delay: -0.16s;
}

.txt-mark {
	color: #48b319;
}

.detail-container {
	padding: 0 10px;
}

.avatar {
	width: 40px;
	height: 40px;
	background-position: center;
	background-size: cover;
}

.avatar-m {
	width: 50px;
	height: 50px;
}

.lqt-backtop {
	width: 40px;
	height: 40px;
	line-height: 33px;
	text-align: center;
	color: #fff;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	position: absolute;
	top: auto;
	right: 10px;
	bottom: 60px;
	left: auto;
	z-index: 20;
}

.lqt-backtop .icon-rise {
	position: absolute;
	top: 0.3rem;
	left: 0.08rem;
	font-size: 30px;
	color: #fff;
	-webkit-transform: rotate(-90deg);
	transform: rotate(-90deg);
	background: transparent;
}

.qs-delete {
	-webkit-touch-callout: none;
	touch-callout: none;
	-webkit-user-select: none;
	user-select: none;
}

.link {
	/*padding-left: 2px;*/
	display: block;
	color: #1474a3;
}

#loading {
	min-width: 2rem;
	margin: 0 auto;
	//font-size: .3rem;
	color: #999;
	text-align: center;
}

#loading .scalePoint {
	display: inline-block;
	width: 8px;
	height: 8px;
	background: #999;
	border-radius: 50%;
	margin: 0 1px 2px;
}

#loading .scalePoint.active-1 {
	-webkit-animation-delay: -0.32s;
	animation-delay: -0.32s;
}

#loading .scalePoint.active-2 {
	-webkit-animation-delay: -0.16s;
	animation-delay: -0.16s;
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

.a-back {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 20;
	width: 100%;
	line-height: 1rem;
	//font-size: .36rem;
	text-align: center;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
}

#comment-container {
	display: none;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 100%;
	width: 100%;
	z-index: 30;
	background: #f2f2f2;
	-webkit-transition: left 0.3s ease-in-out;
	transition: left 0.3s ease-in-out;
}

#comment-container .comment-main {
	padding-bottom: 15px;
	margin: 10px;
}

#comment-container .comment-main p:last-child {
	border: none;
	line-height: 45px;
	padding-right: 0;
	margin-top: 10px;
	background: transparent;
	text-align: right;
}

#comment-container .comment-main span {
	float: left;
	width: 70%;
	//font-size: 18px;
	text-align: center;
}

#comment-container .comment-main .tips {
	float: none;
	line-height: 30px;
	//font-size: 14px;
	text-align: left;
	color: #666;
}

#comment-container.active {
	left: 0;
}

.textarea {
	padding: 10px;
	border: solid 1px #dedede;
	background: #fff;
	border-radius: 3px;
}

.textarea textarea {
	display: block;
	width: 100%;
	min-height: 120px;
	line-height: 23px;
	border: none;
	resize: none;
	outline: none;
}

a.btn {
	display: inline-block;
	width: 100px;
	line-height: 45px;
	margin-left: 10px;
	//font-size: 16px;
	text-align: center;
	color: #fff;
	border-radius: 3px;
}

a#button-close {
	background-color: #7d7d7d;
}

a#button-confirm {
	background-color: #529b44;
}

.mask {
	position: absolute;
	z-index: 100;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0.6);
	text-align: center;
}

.mask #loading {
	position: absolute;
	width: 100%;
	color: #fff;
	top: 50%;
	//font-size: .4rem
}

.mask #loading .scalePoint {
	background: #fff;
}

#recording {
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 10;
	width: 100px;
	height: 100px;
	margin-top: -50px;
	margin-left: -50px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 8px;
	text-align: center;
}

#recording::before {
	content: '';
	display: inline-block;
	width: 36px;
	height: 62px;
	margin-top: 19px;
	background-repeat: no-repeat;
	background-size: 100%;
	//background-image: url("../../images/icon/icon_record.png")
}

#floatWindow {
	position: fixed;
	right: 6px;
	bottom: 12px;
	z-index: 50;
	width: 1.28rem;
	height: 1.28rem;
	//font-size: .32rem;
	color: #fff;
	background: rgba(82, 155, 68, 0.8);
	text-align: center;
	border-radius: 100%;
}

#preview-list {
	padding: 0.2rem 0 0.1rem;
	margin-left: -0.1rem;
}

#preview-list .it {
	float: left;
	width: 25%;
	height: 1.5rem;
}

#preview-list .it p {
	position: relative;
	height: 1.4rem;
	margin: 0 0.1rem;
}

#preview-list .avatar {
	display: block;
	width: 100%;
	height: 100%;
}

#preview-list #addpic {
	position: relative;
	display: block;
	height: 100%;
	box-shadow: 0 0 1px 1px #dcdddf;
}

#preview-list #addpic::before,
#preview-list #addpic::after {
	position: absolute;
	left: 50%;
	margin-left: -27.5%;
	top: 50%;
	margin-top: -0.02rem;
	content: '';
	display: block;
	width: 55%;
	height: 0.04rem;
	background: #ddd;
	border-radius: 3px;
}

#preview-list #addpic::after {
	-webkit-transform: rotate(90deg);
	transform: rotate(90deg);
}

#preview-list .deletepic {
	position: absolute;
	top: -0.14rem;
	right: -0.14rem;
	width: 0.36rem;
	height: 0.36rem;
	z-index: 4;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.6);
}

#preview-list .deletepic::before,
#preview-list .deletepic::after {
	position: absolute;
	left: 50%;
	top: 50%;
	content: '';
	display: block;
	width: 0.24rem;
	height: 0.04rem;
	margin-top: -0.02rem;
	margin-left: -0.12rem;
	background-color: #fff;
	border-radius: 3px;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
}

#preview-list .deletepic::after {
	-webkit-transform: rotate(-45deg);
	transform: rotate(-45deg);
}

.pop-layer {
	width: 100%;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 100%;
	z-index: 100;
	background: #f2f2f2;
	-webkit-transition: 0.3s all ease-in-out;
	transition: 0.3s all ease-in-out;
}

.pop-layer #layer-scroll {
	width: 100%;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}

.pop-layer .scroll-bar {
	height: 100%;
}

.pop-layer.active {
	left: 0;
}

.pop-alert {
	position: fixed;
	left: 0;
	bottom: -20%;
	max-width: 60%;
	padding: 6px 16px;
	//font-size: .26rem;
	text-align: center;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 50px;
	z-index: 200;
	-webkit-transition: bottom 0.1s ease-in-out;
	transition: bottom 0.1s ease-in-out;
}

.pop-comfirm {
	position: absolute;
	top: 100%;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.7);
	z-index: 100;
	opacity: 0;
	-webkit-transition: all 0.2s ease-in-out;
	transition: all 0.2s ease-in-out;
}

.pop-comfirm.active {
	top: 0;
	opacity: 1;
}

.comfirm-main {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 240px;
	margin-left: -120px;
	background: #fff;
	border-radius: 3px;
	//font-size: 15px;
	color: #333;
}

.comfirm-main .comfirm-bottom {
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	overflow: hidden;
}

.comfirm-main .comfirm-btn {
	float: left;
	width: 50%;
	line-height: 40px;
	text-align: center;
}

.comfirm-main .comfirm-cancel {
	color: #fff;
	background: #48b319;
	border-top: solid 1px transparent;
}

.comfirm-main .comfirm-comfirm {
	color: #333;
	border-top: solid 1px #dedede;
}

.comfirm-main .comfirm-txt {
	line-height: 21px;
	padding: 30px;
	text-align: center;
}

.comfirm-main .comfirm-close {
	position: absolute;
	top: -15px;
	right: -15px;
	width: 30px;
	height: 30px;
	background: #48b319;
	border-radius: 50%;
	box-shadow: 1px 0px 2px 2px rgba(0, 0, 0, 0.1);
}

.comfirm-main .comfirm-close span {
	display: block;
	width: 16px;
	height: 2px;
	margin: 0 auto;
	background: #fff;
}

.comfirm-main .comfirm-close span:first-child {
	margin-top: 13px;
	-webkit-transform: rotate(-45deg);
	transform: rotate(-45deg);
}

.comfirm-main .comfirm-close span:last-child {
	margin-top: -2px;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
}

.list-title .link {
	//border: solid 2px #82d4fa;
	border-radius: 2px;
	//background: url("../../images/icon/fix_tools.png") center no-repeat;
	background-size: auto 100%;
}

.lqt-list .it {
	position: relative;
	/*padding-right: 1.25rem*/
}

.list-tips {
	position: absolute;
	right: 0.2rem;
	top: 0.4rem;
	width: 2.5rem;
	font-size: 0.4rem;
	color: #9b9b9b;
	text-align: center;
}

.status {
	padding-top: 0.05rem;
}

.status[status='waitting'],
.status[status='fixing'] {
	color: #ffcc80;
}

.status[status='comfirming'] {
	color: #e12727;
}

/*.icon {
    width: 17px;
    height: 16px;
    background: url("../../images/icon/star_fill.png");
    background-size: auto 100%;
    margin: 0 1px
  }*/

#floatWindow {
	color: #fff;
}

#floatWindow span {
	display: block;
	margin-top: 10px;
}

#vote_list .list-title .link {
	//background-image: url("../../images/icon/vote_align-left.png");
	border-color: #ffcc80;
}

#qa_list .list-title .link {
	//background-image: url("../../images/icon/q_square.png");
	background-image: url('../../assets/question/group-copy.png');
	border-color: #80cbc4;
}

#nav {
	position: fixed;
	top: 1rem;
	left: 0;
	z-index: 55;
	width: 100%;
	background: #fff;
	border-bottom: solid 0.02rem #dedede;
}

#nav ul {
	position: relative;
}

#nav li {
	position: relative;
	z-index: 2;
	float: left;
	width: 20%;
	line-height: 0.7rem;
	//font-size: .3rem;
	text-align: center;
}

#nav li.bg {
	position: absolute;
	top: 0.1rem;
	left: 0;
	z-index: 1;
	height: 0.5rem;
	border-radius: 0.5rem;
	background: #82d4fa;
	-webkit-transition: left 0.3s ease-in-out;
	transition: left 0.3s ease-in-out;
}

#nav li.active a {
	color: #fff;
	-webkit-transition: color 0.2s ease-in-out;
	transition: color 0.2s ease-in-out;
}

.cancel-btn {
	width: 100%;
	height: 100 / @baseSize;
	font-size: @fontSize36;
	color: @white;
	text-align: center;
	line-height: 100 / @baseSize;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 999;
}

.title-header {
	background-color: #fff;
	// position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100 / @baseSize;
	line-height: 100 / @baseSize;
	z-index: 1;
	border-bottom: solid 1px #dedede;
}

.title-header /deep/ .vux-header-title {
	color: #333;
	// line-height: 46px;
}

.title-header /deep/ .vux-header-back {
	color: #38f;
}

.title-header /deep/ .left-arrow:before {
	border-color: #38f !important;
}

.lqt-wrapper {
	// margin-top: 100 / @baseSize !important;
	flex: 1;
	overflow: scroll;
}

/*#vote_list .anonym:after {
    background-image: url("../../images/icon/vote_hide.png")
  }

  #vote_list .no-anonym:after {
    background-image: url("../../images/icon/vote_show.png")
  }

  #qa_list .anonym:after {
    background-image: url("../../images/icon/q_hide.png")
  }

  #qa_list .no-anonym:after {
    background-image: url("../../images/icon/q_show.png")
  }*/
</style>
