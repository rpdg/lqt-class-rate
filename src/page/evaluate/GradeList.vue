<template>
	<div class="box">
		<x-header class="title-header" :title="`选择班级`" :left-options="{ preventGoBack: true }" @on-click-back="goBack" />
		<div class="context clearfix">
			<h3 class="title">评价条目：{{ nameBt }}</h3>
			<ul class="maple-info">
				<li @click="remarkInfo(item.ID, item.NAME)" v-for="(item, index) in getGradeData" :key="index">
					<span>{{ item.NAME }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import BackTitleBar from '../../components/common/BackTitleBar.vue';
import apiRouter from '../../config/api.js';
import {  XHeader } from 'vux';
export default {
	components: {
		BackTitleBar,
		XHeader,
	},
	mounted() {

	},
	activated() {
		this.evalId = this.$route.query.evalId;
		this.detailCode = this.$route.query.detailCode;
		this.nameBt = this.$route.query.nameBt;
		this.getGradeWay();
		this.oldPageTitle = document.title;
		document.title = '学生综评';
	},
	deactivated() {
		document.title = this.oldPageTitle;
	},
	methods: {
		getGradeWay() {
			console.log(apiRouter.GET_CLASSBYCODE + 'evalId=' + this.evalId + '&detailCode=' + this.detailCode);
			this.$http
				.get(apiRouter.GET_CLASSBYCODE + 'evalId=' + this.evalId + '&detailCode=' + this.detailCode)
				.then((response) => {
					if (response.body.status === 200) {
						this.getGradeData = response.body.data;
						console.log(this.getGradeData);
					}
				})
				.catch(function(response) {
					console.log(response);
				});
		},
		remarkInfo(classId, className) {
			window.location.href = `/weixin/wechat/v2/index.html#/evaluate/students?classId=${classId}&evalId=${
				this.evalId
			}&detailCode=${this.detailCode}&path=gradeList&className=${encodeURI(className)}&nameBt=${encodeURI(
				this.nameBt
			)}`;

			// this.$router.push({
			// 	path: 'remarkInfo',
			// 	query: {
			// 		classId: classId,
			// 		evalId: this.evalId,
			// 		detailCode: this.detailCode,
			// 		path: 'gradeList',
			// 		className: className,
			// 		nameBt: this.nameBt,
			// 	},
			// });
		},

		goBack() {
			this.$router.push('/evaluate');
			// window.location.href = roterPath + '/weixin/wechat/dist/index.jsp#/';
		},
	},
	data() {
		return {
			evalId: '',
			detailCode: '',
			getGradeData: [],
			nameBt: '',
		};
	},
};
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';
.title {
	height: 60 / @baseSize;
	background: @green;
	padding-left: 30 / @baseSize;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	font-size: @fontSize30;
	color: @white;
	line-height: 60 / @baseSize;
	overflow: hidden;
}

.maple-list {
	width: 100%;
}
.maple-list h4 {
	padding-left: 55 / @baseSize;
	padding-right: 55 / @baseSize;
	-webkit-background-origin: border-box;
	background-origin: border-box;
	height: 100 / @baseSize;
	border-bottom: 1px solid #dddddd;
	line-height: 100 / @baseSize;
}
.maple-list h4 em {
	width: 40 / @baseSize;
	height: 40 / @baseSize;
	display: block;
	float: left;
	text-align: center;
	line-height: 40 / @baseSize;
	background: @green;
	border-radius: 4px;
	color: @white;
	margin-top: 28 / @baseSize;
}
.maple-list h4 span {
	margin-left: 20 / @baseSize;
	float: left;
	color: @color42;
	font-size: @fontSize30;
}

.maple-info {
	width: 100%;
}
.maple-info li {
	padding-left: 55 / @baseSize;
	padding-right: 55 / @baseSize;
	-webkit-background-origin: border-box;
	background-origin: border-box;
	height: 100 / @baseSize;
	border-bottom: 1px solid #dddddd;
	line-height: 100 / @baseSize;
}
.maple-info li span {
	color: @color42;
	font-size: @fontSize30;
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


.box {
	height: 100%;
}
.amenene {
	width: 10px;
}
.box .maple-nav .maple-info {
	padding: 0;
}
.box .maple-nav .weui-cells {
	margin-top: 0px;
}
.box .maple-nav .vux-no-group-title {
	margin-top: 0px;
}

.box .maple-nav .weui-cells {
	font-size: @fontSize30;
	color: @color42;
	margin-top: 0px;
}

.box .maple-nav .weui-cell:before {
	padding-top: 0;
}

// .context {
// 	margin-top: 100 / @baseSize;
// }

.context .weui-cell {
	width: 100%;
	height: 100 / @baseSize;
	border-bottom: 0;
	background: #f9f9f9;
	padding-top: 0;
	padding-bottom: 0;
	padding-right: 55 / @baseSize;
	padding-left: 55 / @baseSize;
	font-size: @fontSize30;
	color: @color42;
}
.context .weui-cell:before {
	left: 0;
}
.context .vux-no-group-title {
	padding: 0;
}

.maple-info li:last-child {
	border-bottom: 0;
}

.weui-cells {
	margin-top: 0px;
}
.vux-no-group-title {
	margin-top: 0;
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

.title-header {
	background-color: #fff;
	// position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100 / @baseSize;
	line-height: 100 / @baseSize;
	z-index: 2;
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
