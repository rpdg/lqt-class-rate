<template>
	<div class="box" ref="boxHeight">
		<!--    <div class="back-div" ref="heightBack">-->
		<!--      <p @click="goBack()" class="up-back">返回</p>-->
		<!--    </div>-->
		<x-header class="title-header" :left-options="{preventGoBack: true}" @on-click-back="goBack">已发通知</x-header>
		<back ref="heightBack" style="display: none"></back>
		<ul class="message" ref="onScoll">
			<li class="clearfix" v-for="(news,index) in messageData" :key="index">
				<div class="message-icon"></div>
				<a :href="wwwUrl + news.url" class="message-info">
					<h3>{{news.title}}</h3>
					<p>{{news.objectName}}</p>
				</a>
				<div class="message-handle">
					<a v-if="news.status === 10" class="publishBtn inform">通知中</a>
					<a v-else-if="news.status === 0" class="publishBtn publis">将发布</a>
					<a v-else class="publishBtn lose">失效</a>
					<a class="edlitBtn" @click="edlitBtn(news,index)">编辑</a>
				</div>
				<div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index && news.userId)">
					<a class="revamp" @click="revampBtn(news.id)">
						<em></em>修改
					</a>
					<a class="delete" @click="deleteBtn(news.id)">
						<em></em>删除
					</a>
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
				:title="('是否确认删除本条通知？')"
				@on-confirm="onConfirm()"
				confirmText="是，我要删除"
			></confirm>
		</div>
	</div>
</template>

<script type="es6">
import { Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader } from 'vux';
import Back from '../../components/common/Back.vue';
import apiRouter from '../../config/api.js';
import { mapMutations } from 'vuex';
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
	},
	mounted() {
		this.massageData();
		let self = this;
		let clientHeight = document.body.clientHeight - self.$refs['heightBack'].$el.clientHeight;
		window.onscroll = function(event) {
			if (self.$router.currentRoute.name !== 'message') return;
      debugger
			let innerHeight = self.$refs['onScoll'].clientHeight;
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (clientHeight + scrollTop >= innerHeight - 20 && !self.isEndReached) {
				self.isEndReached = true;
				self.page++;
				self.massageData();
				if (self.totalPage < self.page) {
					self.needShow = false;
				} else {
					self.needShow = true;
				}
			}
		};
	},
	methods: {
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

		onConfirm(id) {
			this.$http.get(apiRouter.DEL_INFO + '?id=' + this.id).then(
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
		// 获取通知列表数据
		massageData() {
			let _this = this;
			if (_this.totalPage < _this.page) {
				_this.needShow = false;
				_this.lastShow = true;
				return;
			}
			this.$http.get(apiRouter.LOOK_INFO + '?' + 'page=' + this.page).then(
				(response) => {
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
						5;
						_this.isEndReached = false;
					});
				},
				(erro) => {
					_this.needShow = false;
					//   alert("请求失败了!!!!")
				}
			);
		},

		goBack() {
			window.location.replace(roterPath + '/weixin/wechat/dist/index.jsp');
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
	data() {
		return {
			id: '',
			page: 1,
			popup: false,
			isShow: false,
			showItemNumber: -1,
			messageData: [],
			isEndReached: false,
			totalPage: 1,
			needShow: false,
			lastShow: false,
			wwwUrl: roterPath,
		};
	},
};
</script>

<style lang="less" type="text/less" scoped>
@import '../../style/minxin.less';

.message {
	margin-top: 50px;
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
	background: url('../../assets/trumpet.png') no-repeat left;
	background-size: 100% 100%;
	position: absolute;
	top: 15px;
	left: 15px;
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
	width: 50px;
	position: absolute;
	top: 15px;
	right: 15px;
	text-align: center;
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

.edlit-molde a.delete em {
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
}

.edlit-molde a.delete {
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

.title-header {
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 50px;
	line-height: 50px;
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
