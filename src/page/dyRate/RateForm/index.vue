<template>
	<div class="box">
		<title-bar :title="$route.query.title" @willBack="handleWillBack" />

		<van-tabs class="dy-rate-tab" v-model="viewMode" @change="toggleViewStyle">
			<van-tab title="评分项视角"></van-tab>
			<van-tab title="班级视角"></van-tab>
		</van-tabs>

		<div v-if="inited">
			<van-row v-if="viewMode === 0">
				<van-col span="12">
					<van-cell :title="optionChecked.NAME" is-link @click="showPicker(0)" />
				</van-col>
				<van-col span="12">
					<van-cell :title="tabLabel" is-link @click="showPicker(1)" />
				</van-col>
			</van-row>
			<van-row v-else>
				<van-col span="12">
					<van-cell :title="tabLabel" is-link @click="showPicker(1)" />
				</van-col>
				<van-col span="12">
					<van-cell :title="optionChecked.NAME" is-link @click="showPicker(0)" />
				</van-col>
			</van-row>
		</div>

		<div class="wapper">
			<div class="content" ref="container">
				<center v-if="loading" style="margin-top:1em;">
					<van-loading size="24px">加载中...</van-loading>
				</center>
				<FormPanel v-else v-for="(item, index) in taskList" :key="`${item.__hash}`" :task="item" :index="index"
					:step="step" :setPreviewState="setPreviewState" @modify="handleModify" />
			</div>
			<div class="footer">
				<van-button class="error" @click="doAbanden">弃填</van-button>
				<van-button class="submit" @click="doSubmit(false)">提交</van-button>
			</div>
		</div>

		<!-- 选项列表 -->
		<van-popup position="bottom" v-model="pickerShow0" :lazy-render="false">
			<div class="popContainer">
				<section class="popSection" v-if="viewMode === 1">
					<van-button block plain hairline size="small" class="btnGrayBorder" @click="onOptionConfirm(-1)">{{
						optionFullCheck.NAME }}</van-button>
				</section>

				<div v-for="(fold) in optionGroup" :key="fold.ID">
					<div style="font-weight: bold; color: #666; margin-bottom: 10px;">{{ fold.NAME }}</div>
					<section class="popSection">
						<van-button v-for="(opt) in fold.DETAILS" :key="opt.CODE" :class="getOptionButtonColor(opt)"
							block plain hairline size="small" @click="onOptionConfirm(opt[ '_FULL_INDEX_' ])">{{
								opt.NAME
							}}</van-button>

					</section>
				</div>

				<color-sign v-if="viewMode === 1" />
			</div>
		</van-popup>

		<!-- 班级列表 -->
		<van-popup position="bottom" v-model="pickerShow1" :lazy-render="false">
			<!-- <van-picker
				ref="picker1"
				value-key="CLASS_NAME"
				cancel-button-text="　"
				show-toolbar
				:columns="classList"
				@confirm="onClassConfirm"
			/>-->
			<div class="popContainer">
				<section class="popSection" v-if="viewMode === 0">
					<van-button v-for="(grade, i) in gradeList" :key="grade.GRADE_CODE" block plain hairline
						size="small" class="btnGrayBorder" @click="onGradeConfirm(grade)">{{ grade.GRADE_NAME }}{{ i > 0
							? '年级' : '' }}</van-button>
				</section>

				<section class="popSection" v-for="(classes, index) in classList" :key="index">
					<van-button v-for="cls in classes" :key="cls.CLASS_ID" :class="getClassButtonColor(cls)" block plain
						hairline size="small" @click="onClassConfirm(cls)">{{ cls.CLASS_NAME }}</van-button>
				</section>

				<color-sign v-if="viewMode === 0" />
			</div>
		</van-popup>
	</div>
</template>

<script>
import { ViewBox, XButton } from 'vux';
import TitleBar from './components/TitleBar.vue';
import FormPanel from './components/FormPanel.vue';
import ColorSign from './components/ColorSign.vue';
import apiRouter from '../../../config/api.js';
import wx from 'weixin-js-sdk';
import { Col, Row, Cell, Button, Dialog, Tab, Tabs, Popup, Loading, Toast, Picker } from 'vant';

const defaultOptionChecked = {
	CODE: '',
	NAME: '所有评分项',
};

const defaultClassChecked = {
	CLASS_ID: '',
	CLASS_NAME: '所有班级',
};

const defaultGradeChecked = {
	GRADE_CODE: '',
	GRADE_NAME: '所有班级',
};

export default {
	components: {
		[ Dialog.Component.name ]: Dialog.Component,
		[ Button.name ]: Button,
		[ Row.name ]: Row,
		[ Col.name ]: Col,
		[ Cell.name ]: Cell,
		[ Tab.name ]: Tab,
		[ Tabs.name ]: Tabs,
		[ Popup.name ]: Popup,
		[ Loading.name ]: Loading,
		[ Picker.name ]: Picker,
		ViewBox,
		TitleBar,
		XButton,
		FormPanel,
		ColorSign,
	},
	data() {
		/**
		 * 任务ID
		 */
		this.seq_id = this.$route.query.id;

		/**
		 * 第一个选项ID
		 */
		this.first_optionId = this.$route.query.foId;

		/**
		 * 第一个班级ID
		 */
		this.first_classId = this.$route.query.fcId;

		this.previewOn = false;
		this.setPreviewState = (s) => {
			this.previewOn = s;
		};

		let that = this;

		return {
			ossPath: roterOssPath,
			inited: false,
			loading: false,
			urlPath: '',

			// io: new IntersectionObserver((entries, observer) => {
			//   // console.log(entries);
			//   entries.forEach(entry => {
			//     // debugger;
			//     if (entry.intersectionRatio > 0) {
			//       // console.log('change', entry.target.getAttribute('data-index'));
			//       let taskIndex = entry.target.getAttribute("data-index");
			//       let task = that.taskList[taskIndex];
			//       task.__shown = true;
			//       observer.unobserve(entry.target);
			//     }
			//   });
			// }),

			/**
			 * 选择0显示状态
			 */
			pickerShow0: false,
			/**
			 * 选择器1显示状态
			 */
			pickerShow1: false,

			/**
			 * 0: 选项视角， 1：班级视角
			 */
			viewMode: 0,

			/**
			 * 数据是否改变
			 */
			dataModified: false,

			/**
			 * 数字评分的步进长
			 */
			step: 1,

			/**
			 * 评分表单数组
			 */
			taskList: [],

			/**
			 * 评分选项数组
			 */
			optionList: [],
			optionGroup: [],
			optionIndex: -1,
			optionFullCheck: defaultOptionChecked,

			/**
			 * 班级数组
			 */
			classList: [],
			// classIndex: -1,
			classChecked: defaultGradeChecked,
			classFullCheck: defaultClassChecked,

			/**
			 * 年级数组
			 */
			gradeList: [],
			gradeChecked: defaultGradeChecked,
			gradeFullCheck: defaultGradeChecked,

			//
			lastClickFromGrade: false,
			tabLabel: defaultGradeChecked.GRADE_NAME,
		};
	},
	mounted() {
		//this.loadData();
		this.urlPath = window.location.href.split('#')[ 0 ];
		if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
			this.configWechat();
		} else {

		}

	},
	activated() {
		document.title = '班级综评';
		// console.log("form", this.$route.query);
		// debugger;
		this.seq_id = this.$route.query.id;
		this.first_optionId = this.$route.query.foId;
		this.first_classId = this.$route.query.fcId;

		this.viewMode = 0;
		this.previewOn = false;
		this.inited = false;

		this.dataModified = false;

		this.init();
	},
	deactivated() {
		document.title = "绿蜻蜓";
	},
	beforeRouteLeave(to, from, next) {
		if (this.previewOn) {
			next(false);
		}
		// else if (this.dataModified) {
		//   const answer = window.confirm("已有录入数据，确定放弃数据并离开页面？");
		//   if (answer) {
		//     next();
		//   } else {
		//     next(false);
		//   }
		// }
		else {
			window.onbeforeunload = null;
			next();
		}
	},
	computed: {
		optionChecked() {
			if (this.optionIndex === -1) {
				return this.optionFullCheck;
			}
			return this.optionList[ this.optionIndex ];
		},
		// classChecked() {
		//   if (this.classCheckedId === -1) {
		//     return this.classFullCheck;
		//   }
		//   return this.classList[this.classIndex];
		// }
		// gradeChecked() {
		//   if (this.gradeCheckedCode === '') {
		//     return this.gradeFullCheck;
		//   }
		//   return this.gradeList[this.gradeIndex];
		// },

		// classesShouldRender(){
		//   return this.classList.map((classes)=> (!this.gradeChecked.GRADE_CODE || ))
		// }
	},
	methods: {
		configWechat() {
			let wiexin =
				(process.env.NODE_ENV === 'development'
					? 'http://opg.vaiwan.com/api/wechat?url='
					: apiRouter.GET_CONFIG) + encodeURIComponent(this.urlPath);

			this.$http.get(wiexin).then(
				(response) => {
					let data = response.body;
					// debugger;
					wx.config({
						debug: process.env.NODE_ENV === 'development', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.nonceStr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						jsApiList: [
							'chooseImage',
							'uploadImage',
							'downloadImage',
							'getLocalImgData',
							'previewImage',
							'getFileSystemManager',
							'chooseWXPay',
						], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.error(function (res) {
						console.log(res);
						// alert(res.errMsg);
					});
				},
				(response) => {
					// console.log("请求失败了!!!!")
				}
			);
		},
		async handleWillBack() {
			if (this.dataModified) {
				let answer = await Dialog.confirm({
					className: 'dy-rate-dialog',
					title: '关闭页面提醒',
					message: '页面已录入部分数据，关闭页面后数据将被清空。',
					confirmButtonText: '确定',
					messageAlign: 'left',
				});
				if (answer === 'confirm') {
					this.viewMode = 0;
					this.$router.back();
				}
			} else {
				this.viewMode = 0;
				this.$router.back();
			}
		},
		handleModify(b) {
			this.dataModified = b;

			if (b) {
				window.onbeforeunload = function (e) {
					e.preventDefault();
					e.returnValue = '已有录入数据，确定放弃数据并离开页面？';
				};
			} else {
				window.onbeforeunload = null;
			}
		},
		async init() {
			this.inited = false;
			this.loading = true;
			// reset
			this.taskList = [];

			this.optionIndex = -1;
			this.optionList = [];
			this.optionGroup = [];

			// this.classIndex = -1;
			this.classChecked = defaultClassChecked;
			this.classList = [];

			this.gradeChecked = defaultGradeChecked;
			this.gradeList = [];

			const seq_id = this.seq_id;
			// fetch and auto select the first option
			const see_mode = this.viewMode === 0 ? 'DETAIL' : 'CLASS';
			const detail_id = this.viewMode === 0 ? this.first_optionId : '';
			const class_id = this.viewMode === 0 ? '' : this.first_classId;
			const obj_name = 'T_CLASS';

			// alert(JSON.stringify({ seq_id, detail_id, class_id, see_mode }));
			try {
				let result = await this.$http.get(
					`${apiRouter.CLASS_RATE_TASK_LIST2
					}?seq_id=${seq_id}&obj_name=${obj_name}&obj_id=${class_id}&detail_id=${detail_id}&see_mode=${see_mode}`
				);

				if (result.status === 200) {
					let respBody = result.body;
					if (respBody.code === 200) {
						let { grade_list, class_list, detail_list, step_value, data_list } = respBody.data;

						let opt_arr = [];
						let fullIndex = 0;
						detail_list.forEach((foldNode) => {
							foldNode.DETAILS.forEach(item => {
								item._FULL_INDEX_ = fullIndex;
								opt_arr.push({
									folderName: foldNode.NAME,
									folderId: foldNode.ID,
									...item
								});
								fullIndex++;
							});
						});
						// if (this.viewMode === 1) {
						// 	detail_list.unshift(defaultOptionChecked)
						// }
						this.optionList = opt_arr;
						this.optionGroup = detail_list;

						this.classList = class_list;

						if (this.viewMode === 0) {
							grade_list.unshift(defaultGradeChecked);
						}
						this.gradeList = grade_list;

						this.step = Number(step_value);

						data_list.forEach((task) => {
							task.__shown = true;
							// task.__shown = false;
							task.__hash = task.ID + '-' + Date.now() + '-' + Math.random();

							if (task.IMG_LIST.length > 0) {
								if (task.IMG_LIST.length > 4) {
									task.IMG_LIST.length = 4;
								}
								task.IMG_LIST.forEach((img) => {
									img.url = this.ossPath + '/upload' + img.url;
								});
							}
						});
						this.taskList = data_list;

						this.$nextTick(() => {
							// debugger;
							if (this.viewMode === 1) {
								if (this.classList && this.classList.length && this.classList[ 0 ].length) {
									this.classChecked = this.classList[ 0 ][ 0 ];
									this.tabLabel = this.classChecked.CLASS_NAME;
								}
								// this.classIndex = 0;
								this.optionIndex = -1;
								// if (this.$refs.picker1) {
								// 	// let a = this.$refs.picker1.getColumnIndex(0);
								// 	this.$refs.picker1.setColumnIndex(0, 1)
								// 	this.classIndex = 1
								// }
							} else {
								this.tabLabel = this.gradeList[ 0 ].GRADE_NAME;
								this.optionIndex = 0;
								// this.classIndex = -1;
								// if (this.$refs.picker0) {
								// 	// let a = this.$refs.picker0.getColumnIndex(0);
								// 	this.$refs.picker0.setColumnIndex(0, 1)
								// 	this.optionIndex = 1
								// }
							}

							this.inited = true;

							// this.fetchList();
						});
					} else {
						alert(respBody.message);
					}
				} else {
					alert(result.body.message);
				}
			} catch (e) {
				alert(e.message);
			} finally {
				this.inited = true;
				this.loading = false;
			}

			//
		},
		// async fetchListNew() {},
		async fetchList() {
			this.loading = true;
			let see_mode = this.viewMode === 0 ? 'DETAIL' : 'CLASS';
			let detail_id = this.optionChecked.CODE;
			let class_id =
				this.viewMode === 0
					? this.lastClickFromGrade
						? this.gradeChecked.GRADE_CODE
						: this.classChecked.CLASS_ID
					: this.classChecked.CLASS_ID;
			let obj_name = this.lastClickFromGrade ? 'T_SCHOOL_GRADE' : 'T_CLASS';

			if ((!class_id && obj_name === 'T_SCHOOL_GRADE') || see_mode === 'CLASS') {
				obj_name = 'T_CLASS';
			}

			try {
				// debugger;
				let resp = await this.$http.get(
					`${apiRouter.CLASS_RATE_TASK_LIST2}?seq_id=${this.seq_id
					}&obj_name=${obj_name}&obj_id=${class_id}&detail_id=${detail_id}&see_mode=${see_mode}`
				);
				if (resp.status === 200) {
					let respBody = resp.body;
					if (respBody.code === 200) {
						let container = this.$refs.container;
						// console.log('container' ,container.offsetTop  ,container.scrollTop);
						container.scrollTop = 0;
						// debugger;
						let { grade_list, class_list, data_list, detail_list, step_value } = respBody.data;

						data_list.forEach((task) => {
							task.__shown = true;
							// task.__shown = false;
							task.__hash = task.ID + '-' + Date.now() + '-' + Math.random();

							if (task.IMG_LIST.length > 0) {
								if (task.IMG_LIST.length > 4) {
									task.IMG_LIST.length = 4;
								}
								task.IMG_LIST.forEach((img) => {
									img.url = this.ossPath + '/upload' + img.url;
								});
							}
						});
						this.taskList = data_list;

						if (this.viewMode === 1) {
							// detail_list.unshift(defaultOptionChecked);
							let opt_arr = [];
							let fullIndex = 0;
							detail_list.forEach((foldNode) => {
								foldNode.DETAILS.forEach(item => {
									item._FULL_INDEX_ = fullIndex;
									opt_arr.push({
										folderName: foldNode.NAME,
										folderId: foldNode.ID,
										...item
									});
									fullIndex++;
								});
							});
							this.optionList = opt_arr;
							this.optionGroup = detail_list;
						} else {
							grade_list.unshift(defaultGradeChecked);
							this.gradeList = grade_list;
							// class_list.unshift(defaultClassChecked)
							this.classList = class_list;
						}
					} else {
						alert(respBody.message);
					}
				} else {
					alert('请求失败!');
				}
			} catch (e) {
				alert(e.message);
			} finally {
				this.loading = false;
			}
		},
		async doAbanden() {
			Dialog.confirm({
				className: 'dy-rate-dialog',
				title: '弃填',
				message: '确定将本页项目数据清空并标记为弃填？',
				confirmButtonText: '确定',
			}).then(async () => {
				let taskArr = JSON.parse(JSON.stringify(this.taskList));
				let needTip = false;
				taskArr.forEach((task) => {
					if (task.SCORE != 0 || task.COMMENT) {
						needTip = true;
					}
				});
				if (needTip) {
					let answer = await Dialog.confirm({
						className: "dy-rate-dialog",
						title: "",
						message: "部分条目已有内容，弃填将不保留，确定弃填吗？",
						confirmButtonText: "确定",
					});
					if (answer !== 'confirm') {
						return;
					}
				}
				this.doSubmit(true);
			});
		},

		async doSubmit(is_give_up) {
			let detail_arr = [];
			let taskArr = JSON.parse(JSON.stringify(this.taskList));

			let needTip = false;
			taskArr.forEach((task) => {
				if (is_give_up) {
					detail_arr.push({
						SCORE: '0',
						ID: task.ID,
						COMMENT: '',
					});
				}
				else {
					detail_arr.push({
						SCORE: '' + task.SCORE,
						ID: task.ID,
						COMMENT: task.COMMENT,
					});
					if (task.SCORE == 0 && task.COMMENT) {
						needTip = true;
					}
				}

			});

			if (!is_give_up) {
				// console.log(is_give_up, detail_arr);
				if (needTip) {
					let answer = await Dialog.confirm({
						className: "dy-rate-dialog",
						title: "",
						message: "部分条目有备注而未评分，确定这样吗？",
						confirmButtonText: "确定",
					});
					if (answer !== 'confirm') {
						return;
					}
				}
			}

			try {
				// debugger;
				const sendData = {
					seq_id: this.seq_id,
					is_give_up: is_give_up ? 1 : 0,
					detail_arr: JSON.stringify(detail_arr),
				};

				let resp = await this.$http.post(apiRouter.CLASS_RATE_SUBMIT, sendData);

				if (resp.status === 200) {
					let respBody = resp.body;
					if (respBody.code === 200) {
						// alert();

						this.taskList.forEach((task) => {
							task.WRITE_STATUS = is_give_up ? '-1' : '1';
						});

						try {
							let answer = await Dialog.confirm({
								className: 'dy-rate-dialog',
								title: is_give_up ? '弃填成功' : '本页所有项目评分成功',
								message: '',
								confirmButtonText: '继续评分',
								confirmButtonColor: '#54B331',
								cancelButtonText: '回到列表页面',
							});

							if (answer === 'confirm') {
								let popId = 0;
								if (this.viewMode === 0) {
									if (this.classChecked.CLASS_ID === '' && this.gradeChecked.GRADE_CODE === '') {
										popId = 0;
									} else {
										popId = 1;
									}
								} else {
									if (this.optionChecked.CODE === '') {
										popId = 1;
									} else {
										popId = 0;
									}
								}
								if (this.viewMode === 0) {
									this.gradeChecked = defaultGradeChecked;
									this.classChecked = defaultClassChecked;
								}
								this[ `pickerShow${popId}` ] = true;
								this.fetchList();
							}
						} catch (e) {
							// Toast("已完成本页所有项目的评分操作。");
							this.$nextTick(() => {
								this.$router.back();
							});
						} finally {
							this.handleModify(false);
						}
					} else {
						alert('server.error: ' + resp.body.message);
					}
				} else {
					alert('请求失败!');
				}
			} catch (e) {
				alert('server.error: ' + e.message);
			}
		},
		toggleViewStyle() {
			this.init();
		},
		showPicker(i) {
			// console.log(i, this.viewMode);
			this[ 'pickerShow' + i ] = true;
		},
		onGradeConfirm(grade) {
			if (!this.lastClickFromGrade || grade.GRADE_CODE !== this.gradeChecked.GRADE_CODE) {
				this.gradeChecked = grade;
				this.tabLabel = grade.GRADE_NAME + (grade.GRADE_CODE ? '年级' : '');

				if (this.viewMode === 1) {
					this.optionIndex = 0;
					this[ 'pickerShow0' ] = true;
				}
				this.lastClickFromGrade = true;
				this.fetchList();
			}
			this[ 'pickerShow1' ] = false;
		},
		onClassConfirm(cls) {
			let class_id = cls.CLASS_ID;
			if (this.lastClickFromGrade || class_id !== this.classChecked.CLASS_ID) {
				this.tabLabel = cls.CLASS_NAME;
				this.classChecked = cls;
				this.gradeChecked = this.gradeList.find((obj) => obj.GRADE_CODE === cls.GRADE_CODE);

				if (this.viewMode === 1) {
					this.optionIndex = 0;
					this[ 'pickerShow0' ] = true;
				}
				this.lastClickFromGrade = false;
				this.fetchList();
			}
			this[ 'pickerShow1' ] = false;
		},
		onOptionConfirm(index) {
			if (index != this.optionIndex) {
				// console.log(this.optionIndex, index);
				this.optionIndex = index;

				if (this.viewMode === 0) {
					this.gradeChecked = defaultGradeChecked;
					this.classChecked = defaultClassChecked;
					this[ 'pickerShow1' ] = true;
				}

				this.fetchList();
			} else {
			}

			this[ 'pickerShow0' ] = false;
		},
		getOptionButtonColor(found) {
			if (this.viewMode === 0) {
				return 'btnGrayBorder';
			}
			// let curClass = this.classChecked;
			// let found = this.optionList.find((v, i) => v.DETAIL_CODE === code);
			// let found = this.taskList.find(val => val.DETAIL_CODE === code);
			if (found) {
				if (found.WRITE_STATUS === '0') {
					return 'btnBlueBorder';
				} else if (found.WRITE_STATUS === '-1') {
					return 'btnRedBorder';
				} else {
					return 'btnGreenBorder';
				}
			}
			return 'btnBlueBorder';
		},
		getClassButtonColor(found) {
			if (this.viewMode === 1) {
				return 'btnGrayBorder';
			}
			// debugger
			// let found = this.taskList.find((v, i) => v.CLASS_ID === class_id)
			if (found) {
				if (found.WRITE_STATUS === '0') {
					return 'btnBlueBorder';
				} else if (found.WRITE_STATUS === '-1') {
					return 'btnRedBorder';
				} else {
					return 'btnGreenBorder';
				}
			}
			return 'btnBlueBorder';
		},
	},
};
</script>
<style lang="less">
.dy-rate-tab {
	.van-tab--active {
		.van-tab__text {
			font-size: 14px;
			color: #48b319;
		}
	}

	.van-tabs__line {
		width: 50%;
		background-color: #48b319;
	}
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
</style>
<style lang="less" scoped>
@import '../../../style/minxin.less';
@footerHeight: 60px;

.box {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.wapper {
	position: relative;
	height: 100%;
	background-color: #fafafa;
}

.content {
	position: absolute;
	top: 0;
	bottom: @footerHeight;
	overflow: scroll;
	width: 100%;
}

.footer {
	position: fixed;
	bottom: 0;
	height: @footerHeight;
	width: 100%;
	display: flex;
	gap: 15px;
	align-items: center;
	padding: 15px;

	>button {
		flex: 1;
		display: block;
		color: #fff;

		&.error {
			background-color: #ed561b;
		}

		&.submit {
			background-color: #48b319;
			float: right;
		}
	}

	.van-button--default {
		border: 1px solid transparent;
		border-radius: 3px;
	}
}

.popContainer {
	height: 80vh;
	padding: 20px;
	overflow-y: auto;
	// text-align: center;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-gap: 20px;
	align-content: start;
}

.popSection {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	// grid-template-rows: repeat(100, 1fr);
	grid-gap: 10px 10px;
	align-items: stretch;
	justify-items: stretch;
	align-content: start;
}

.btnRedBorder {
	border-color: #ed561b;
	color: #ed561b;
}

.btnGreenBorder {
	border-color: #48b319;
	color: #48b319;
}

.btnBlueBorder {
	border-color: #0093dd;
	color: #0093dd;
}

.btnGrayBorder {
	border-color: #6d6d6d;
	color: #6d6d6d;
}
</style>
