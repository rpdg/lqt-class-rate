<template>
	<div class="up-comment" style="margin-bottom: 1rem">
		<div class="rateBar">
			<span class="text-14" style="flex: 1;">作业评价</span>
			<van-rate style="width: 120px;" color="#04BE02" v-model="score" :readonly="!fromTeacher" />
		</div>

		<hr class="mg-y-15" />

		<div class="mg-y-15 text-16">留言板</div>
		<div class="mg-y-15 text-12 commentWrap">
			<div :key="comment.ID" v-for="(comment) in commentList">
				{{comment.ADDUSER_NAME}} {{comment.ADD_TIME}}
				<span
					:style=" 'margin-left:1em; color:'+ typeColor[comment.TYPE]"
				>{{typeWord[comment.TYPE]}}</span>
				<div class="richTextWrap" v-html="comment.COMMENT" />
			</div>
		</div>

		<hr class="mg-y-15" />

		<div class="inputerWrap">
			<van-icon
				name="orders-o"
				color="#48b319"
				size="30"
				style="	margin-left: -4px;"
				@click="popupPicker"
				v-if="fromTeacher"
			/>
			<input class="iptText" type="text" maxlength="100" v-model="comment" />
			<span
				class="bar-btn btn-voice"
				v-show="comment.length===0"
				@touchstart.prevent="startRecord"
				@touchend.prevent="endRecord"
			/>
		</div>

		<div class="actionBar" v-if="fromTeacher">
			<van-button plain color="#54B331" @click="savePass">批改通过</van-button>
			<van-button plain color="#EE0A24" @click="savePass">发回订正</van-button>
			<van-button plain color="#0093DD" @click="saveComment">仅留言</van-button>
		</div>
		<div class="actionBar" v-else>
			<van-button plain color="#0093DD" @click="saveComment">留言</van-button>
		</div>

		<van-popup v-model="showPicker" :style="{ height: '80vh' }" position="bottom">
			<div class="evaPicker">
				<div class="evaPickerToolbar">快捷评语</div>
				<div class="evaPickerRow" v-for="(str,i) in evaRowText" :key="i" @click="putIn(str)">{{str}}</div>
			</div>
		</van-popup>

		<div class="voice-box" :style="'width: '+ voiceBarWidth +'em;' ">
			<div class="wifi-symbol">
				<div class="wifi-circle first"></div>
				<div class="wifi-circle second"></div>
				<div class="wifi-circle third"></div>
			</div>
		</div>
	</div>
</template>

<script>
import apiRouter from '../../../config/api'
import { Rate, Button, Icon, Toast, Popup } from 'vant'
import ICON_RECORDING from '../../../assets/work/icon_record.png'

export default {
	components: {
		[Button.name]: Button,
		[Rate.name]: Rate,
		[Icon.name]: Icon,
		[Popup.name]: Popup,
	},
	props: {
		fromTeacher: {
			type: Boolean,
			required: false,
			default: true,
		},
		wx: {
			type: Object,
			required: true,
		},
		saveFunc: {
			type: Function,
			required: true,
		},
		saveCommentOnly: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			typeColor: {
				1: '#48b319',
				2: '#ee0a24',
			},
			typeWord: {
				1: '批改通过',
				2: '发回订正',
			},
			evaRowText: [
				'书写认真',
				'太棒了',
				'还不错',
				'加把劲',
				'要努力',
				'做题要细心',
				'照片要清晰',
				'请耐心订正',
			],
			showPicker: false,
			score: 0,
			comment: '',
			commentList: [],
			recordingTimer: 0,
			maxSeconds: 60,
			voiceBarWidth: 15,
			voiceRecord: null,
		}
	},
	methods: {
		showRecordingToast() {
			this.maxSeconds = 60
			const toast = Toast.loading({
				className: 'recordToast',
				duration: 0, // 持续展示 toast
				forbidClick: true,
				message: `还可录: ${this.maxSeconds} ''`,
				icon: ICON_RECORDING,
			})
			this.recordingTimer = setInterval(() => {
				this.maxSeconds--
				if (this.maxSeconds) {
					toast.message = `还可录: ${this.maxSeconds} ''`
				} else {
					this.hideRecordingToast()
				}
			}, 1e3)
		},
		hideRecordingToast() {
			clearInterval(this.recordingTimer)
			Toast.clear()
		},
		startRecord() {
			this.showRecordingToast()
			this.wx.startRecord()
		},
		endRecord() {
			this.hideRecordingToast()
			const vm = this
			this.wx.stopRecord({
				success: function (res) {
					if (res.localId) {
						// self.uploadVoice(res.localId, voiceList);
						vm.wx.uploadVoice({
							localId: res.localId,
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function (resp) {
								vm.voiceRecord = {
									value: resp.serverId,
									audio_time: 60 - vm.maxSeconds,
								}
								vm.voiceBarWidth = (vm.voiceRecord.audio_time / 60) * 10 + 5
								console.log(vm.voiceRecord)
							},
						})
					}
				},
				fail: function (res) {
					console.log(res)
					Toast('说话时间太短')
				},
			})
		},
		saveComment() {
			this.saveCommentOnly({ score: this.score, comment: this.comment })
		},
		savePass() {
			console.log({ score: this.score, comment: this.comment })
			this.saveFunc({ score: this.score, comment: this.comment })
		},
		popupPicker() {
			this.showPicker = true
		},
		putIn(str) {
			this.comment = str
			this.showPicker = false
		},
		loadData(param) {
			this.commentList = []
			this.score = 0
			let vm = this
			this.$http
				.get(
					apiRouter.GET_HOMEWORK_COMMENT_LIST +
						'?workId=' +
						param.WORKID +
						'&mainId=' +
						param.ANID
				)
				.then(
					(response) => {
						if (response.status === 200) {
							let data = response.data.data
							vm.commentList = data.commentList
							vm.score = Number(data.score)
						}
					},
					(response) => {
						alert('请求失败了!!!!')
					}
				)
		},
	},
}
</script>

<style lang="less" scoped>
.rateBar {
	display: flex;
	align-items: center;
	margin: 15px 0;
	font-size: 1.2em;
}

.commentWrap {
	> div {
		color: #999;
		line-height: 2.5em;
		border-bottom: 1px dashed #dedede;
		margin: 15px 0;

		&:nth-last-of-type(1) {
			border-bottom: none;
		}
	}
}

.richTextWrap {
	font-size: 14px;
	color: #666;
}

.inputerWrap {
	display: flex;
	margin: 20px 0;
}
.iptText {
	flex: 1;
	border: 1px solid #dedede;
	border-radius: 2px;
	padding: 0 0.5em;
}

.bar-btn {
	width: 30px;
	height: 30px;
	line-height: 30px;
	font-family: 'icon';
	font-size: 24px;
	color: #fff;
	text-align: center;
	border-radius: 50%;
	-webkit-touch-callout: none;

	&.btn-voice {
		// background-color: #2782d7;
		background-image: url('../../../assets/work/voice.png');
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
		margin-left: 8px;
	}
}

.actionBar {
	display: flex;
	gap: 15px;

	> button {
		flex: 1;
	}
}

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
		border-bottom: 1px dashed #dedede;
	}

	> .evaRecord {
		margin: 0;
		flex: 1;
	}
}

.voice-box {
	background-color: #03a9f4;
	/* width: 60px; */
	height: 32px;
	box-sizing: border-box;
	padding-left: 1em;
	padding-top: 2px;
	border-radius: 5px;
	margin-bottom: 5px;

	> .wifi-symbol {
		width: 50px;
		height: 50px;
		zoom: 0.5;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);

		> .wifi-circle {
			border: 5px solid #fff;
			border-radius: 50%;
			position: absolute;
		}
		.first {
			width: 5px;
			height: 5px;
			background: #cccccc;
			top: 45px;
			left: 45px;
		}

		.second {
			width: 25px;
			height: 25px;
			top: 35px;
			left: 35px;
		}

		.third {
			width: 40px;
			height: 40px;
			top: 25px;
			left: 25px;
		}
	}

	&.active {
		.second {
			animation: wifiAni 1s infinite 0.2s;
		}
		.third {
			animation: wifiAni 1s infinite 0.4s;
		}
	}
}

@keyframes wifiAni {
	0% {
		opacity: 0; /*初始状态 透明度为0*/
	}
	100% {
		opacity: 1; /*结尾状态 透明度为1*/
	}
}
</style>
<style lang="less">
.recordToast {
	> .van-toast__icon {
		margin-top: 8px !important;
	}
	> .van-toast__text {
		margin-top: 16px !important;
	}
}
</style>