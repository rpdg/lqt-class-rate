<template>
	<div class="box">
		<!--    <div class="back-div" ref="heightBackPub">-->
		<!--      <p @click="goBack()" class="up-back">返回</p>-->
		<!--    </div>-->
		<x-header
			class="title-header"
			:left-options="{preventGoBack: true}"
			@on-click-back="goBack"
			:title="`作业列表`"
		>
			<template slot="right">
				<van-icon
					name="setting-o"
					color="#FF8F03"
					size="16"
					@click="showConfigure"
					style="margin-right: 8px;"
				/>
			</template>
		</x-header>

		<back ref="heightBackPub" style="display: none"></back>
		<ul class="message" ref="onScoll">
			<li class="clearfix" v-for="(news,index) in messageData" :key="index">
				<!-- <div class="message-icon"></div> -->
				<div class="message-icon-2" :style="'background-color:' + news.COLOR">{{news.COURSE_NAME}}</div>
				<a href="javascript:void(0);" @click="goCheck(news)" class="message-info">
					<h3>{{news.TITLE}}</h3>
					<p>发布对象：{{news.NAMES}}</p>
				</a>
				<div class="message-handle">
					<a class="publishBtn inform pubisnBtn">已发布</a>
					<a class="delete" @click="deleteBtn(news.ID)">
						<em></em>删除
					</a>
				</div>
				<!-- <div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index)">
          <a class="revamp" @click="revampBtn(news.id)"><em></em>修改</a>
          <a class="delete" @click="deleteBtn(news.id)"><em></em>删除</a>
				</div>-->
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

		<van-popup position="bottom" style="height: 50vh;" v-model="isShowConfigure" class="evaPicker">
			<div class="evaPickerToolbar">批改设置</div>
			<div class="evaRecord">
				<div class="evaRecordRow">
					<span>批改后跳转到下一个学生</span>
					<van-switch v-model="checkedJump" active-color="#48b319" size="22px" />
				</div>
				<div class="evaRecordRow">
					<span>批改通过后提醒学生</span>
					<van-switch v-model="checkedWarn" active-color="#48b319" size="22px" />
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import { Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader } from 'vux';
import Back from '../../components/common/Back.vue';
import apiRouter from '../../config/api.js';
import { mapMutations } from 'vuex';
import { Icon, Popup, Switch } from 'vant';

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
		XHeader,
		[Icon.name]: Icon,
		[Popup.name]: Popup,
		[Switch.name]: Switch,
	},

	data() {
		return {
			id: '',
			page: 1,
			popup: false,
			isShow: false,
			isShowConfigure: false,

			checkedJump: true,
			checkedWarn: true,

			showItemNumber: -1,
			messageData: [],
			isEndReached: false,
			totalPage: 0,
			needShow: false,
			lastShow: false,
			wwwUrl: roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId=',
		};
	},
	computed: {
		jumpConfig() {
			const { checkedJump, checkedWarn } = this;
			return { checkedJump, checkedWarn };
		},
	},
	watch: {
		jumpConfig(val) {
			console.log(val);
			localStorage.setItem('lqt-homework-teacherCfg', JSON.stringify(val));
		},
	},
	activated() {
		this.loadConfig();
		$(document).scrollTop(0);

		this.oldPageTitle = document.title;
		document.title = '作业批改';
	},
	deactivated() {
		document.title = this.oldPageTitle;
	},
	async mounted() {
		await this.massageData();
		let self = this;
		$(document).scrollTop(0);
		let clientHeight = document.body.clientHeight - self.$refs['heightBackPub'].$el.clientHeight;

		window.onscroll = async function(event) {
			if (self.$router.currentRoute.name !== 'workListUp') return;
			let innerHeight = self.$refs['onScoll'].clientHeight;
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (clientHeight + scrollTop >= innerHeight - 20 && !self.isEndReached) {
				self.isEndReached = true;
				self.page++;
				await self.massageData();
				if (self.page <= self.totalPage) {
					self.needShow = true;
				} else {
					self.needShow = false;
				}
			}
		};
	},
	methods: {
		async massageData() {
			// debugger;
			if (this.page!==1 && this.page > this.totalPage) {
				this.needShow = false;
				this.lastShow = true;
				return;
			}
			let _this = this;
			await this.$http.get(apiRouter.GET_HOMEWORKLIST + '?' + 'page=' + this.page).then(
				(response) => {
          // debugger;
					_this.needShow = false;
					let list = [];
					if (_this.page === 1) {
						let totalPage = response.body.data.totalpage;
						console.log(totalPage);
						_this.totalPage = totalPage;
						list = response.body.data.list;
						console.log(response.body.data.list);
					} else {
						list = _this.messageData.concat(response.body.data.list);
					}
					_this.messageData = list;
					_this.$nextTick(() => {
						_this.isEndReached = false;
					});
				},
				(erro) => {
					_this.needShow = false;
					//   alert("请求失败了!!!!")
				}
			);
		},

		loadConfig() {
			let cfgStr = localStorage.getItem('lqt-homework-teacherCfg');
			if (cfgStr) {
				try {
					let cfg = JSON.parse(cfgStr);
					this.checkedJump = cfg.checkedJump;
					this.checkedWarn = cfg.checkedWarn;
				} catch (e) {}
			}
		},
		showConfigure() {
			this.isShowConfigure = true;
		},
		goCheck(obj) {
			window.localStorage.setItem('lqt-homework-title', obj.TITLE);
			this.$router.push({ path: '/check-work-list', query: { id: obj.ID } });
		},

		goBack() {
			this.$router.push({ path: '/' });
		},

		edlitBtn(news, index) {
			if (this.isShow && this.showItemNumber === index) {
				this.isShow = false;
				return;
			}
			this.isShow = true;
			this.showItemNumber = index;
		},

		deleteBtn(id) {
			this.id = id;
			this.isShow = false;
			this.popup = true;
		},

		onConfirm() {
			this.$http.get(apiRouter.DEL_HOMEWORK + '?id=' + this.id).then(
				(response) => {
					if (response.body.status === 200) {
						window.location.reload();
					} else {
						alert('删除失败');
					}
				},
				(erro) => {}
			);

			this.popup = false;
			return;
			this.$vux.loading.show({
				transition: '',
				text: 'processing',
			});
			setTimeout(() => {
				this.$vux.loading.hide();
				this.popup = false;
			}, 1000);
		},

		revampBtn(id) {
			this.$http.get(apiRouter.EDLIT_INFO + '?id=' + id).then(
				(response) => {
					if (response.body.status === 200) {
						this.messageWay(response.body.data);
						console.log(response.body.data);
						let messageString = JSON.stringify(response.body.data);
						window.localStorage.setItem('MESSAGE', messageString);
						//    let userList = JSON.stringify(response.body.data.userList)
						this.$router.push({
							path: 'posted',
							query: { path: 'Message', itemId: id },
						});
						this.isShow = false;
					}
				},
				(erro) => {
					alert('失败');
				}
			);
		},

		...mapMutations({
			messageWay: 'SET_MESSAGE',
		}),
	},
};
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
		flex: 1;
	}
}

.evaRecord {
	margin: 15px 0;

	> .evaRecordRow {
		font-size: 14px;
		line-height: 24px;
		// padding: 15px 0;
		// border-bottom: 1px dashed #c7c7c7;
		display: flex;
		align-items: center;

		> span {
			display: block;
			margin: 0.5em 0;
			flex: 1;
		}

		> .evaRecordRemark {
			font-size: 12px;
			color: #666;
		}
	}
}

.message {
	width: 100%;
	margin-top: 50px;
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
	background: url('../../assets/homework.png') no-repeat left;
	background-size: 100% 100%;
	position: absolute;
	top: 15px;
	left: 15px;
	border-radius: 3px;
}
.message-icon-2 {
	width: 50px;
	height: 50px;
	background-size: 100% 100%;
	position: absolute;
	top: 15px;
	left: 15px;
	border-radius: 3px;
	font-size: 15px;
	color: #fff;
	font-weight: 400;
	text-align: center;
	line-height: 1.78571429rem;
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
	margin-top: -3px;
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
	margin-top: -1px;
	margin-left: 15px;
	margin-right: 3px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	color: #ff5e5e;
}

a.delete {
	color: #ff5e5e;
	display: flex;
	align-items: center;
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
	// height: 50px;
	// line-height: 50px;
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
</style>
