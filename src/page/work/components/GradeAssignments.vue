<template>
	<div>
		<center v-if="loading" style="margin-top:1em;">
			<van-loading size="24px">加载中...</van-loading>
		</center>
		<div v-else class="up-comment" style="margin-bottom: 1rem">
			<div class="rateBar">
				<span class="text-14" style="flex: 1;">作业评价</span>
				<van-rate
					style="width: 120px;"
					color="#04BE02"
					v-model="score"
					:readonly="!fromTeacher"
					@change="updateRate"
				/>
			</div>
			<div v-if="fromTeacher" class="text-12 divShareGoodwork">
				<span style="flex: 1;">推优分享给已批阅同学</span>
				<van-switch v-model="isShared" @change="setHomeworkShared" active-color="#48b319" size="22px" />
			</div>
			<div v-else-if="isGreat" class="text-12" style="color:#48b319;">
				已被老师推优，分享给其他同学
			</div>

			<hr class="mg-y-20" />

			<div class="mg-y-20 text-16">留言板</div>
			<div class="mg-y-20 text-12 commentWrap">
				<div
					:key="comment.ID"
					v-for="(comment , index) in commentList"
					v-long-press="600"
					@touchstart="startWillRemove"
					@touchmove="cancelWillRemove"
					@long-press-start="removeItem(comment)"
				>
					{{comment.ADDUSER_NAME}} {{comment.ADD_TIME.substr(0,16)}}
					<span
						:style=" 'margin-left:1em; color:'+ typeColor[comment.TYPE]"
					>{{typeWord[comment.TYPE]}}</span>
					<div
						v-if="comment.COMMENT_TYPE==='1'"
						class="nomoreWidth richTextWrap"
						v-html="comment.COMMENT"
					/>
					<voice-item
						v-else-if="comment.COMMENT_TYPE==='2'"
						:item="comment.COMMENT[0]"
						:playing="index===currentMp3Index"
						@click="playMP3(comment.COMMENT[0] , index)"
					/>
				</div>
			</div>

			<hr class="mg-y-20" style="	margin-top: -5px; " />
			<!-- 留言输入 -->
			<div class="inputerWrap" v-if="!voiceRecord && !isBrowseOnly">
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
			<!-- 录音记录条 -->
			<div class="mg-y-20 voiceWrap" v-if="voiceRecord">
				<div
					@click="playTempVoice"
					:class="'voice' + (isPlaying? ' playing':'')"
					:style="'width: '+ voiceBarWidth +'em;' "
				/>
				<div class="voiceSeconds">{{60 - recordSecondsLeft}}''</div>
				<div class="removeVoice">
					<van-icon name="revoke" size="26" color="#999" @click="removeVoiceRecord" />
				</div>
			</div>
			<!-- 三个操作按钮 : 教师端 -->
			<div class="actionBar" ref="bar1" v-if="fromTeacher">
				<van-button plain color="#54B331" @click="savePass" :disabled="posting">批改通过</van-button>
				<van-button plain color="#EE0A24" @click="saveReject" :disabled="posting">发回订正</van-button>
				<van-button plain color="#0093DD" @click="saveComment" :disabled="posting">仅留言</van-button>
			</div>
			<!-- 操作按钮 ： 学生端 -->
			<div class="actionBar" ref="bar2" v-else-if="!isBrowseOnly">
				<van-button plain color="#0093DD" @click="saveComment" :disabled="posting">留言</van-button>
			</div>
			<!-- 快捷评语 -->
			<van-popup v-model="showPicker" :style="{ height: '80vh' }" position="bottom">
				<div class="evaPicker">
					<div class="evaPickerToolbar">快捷评语</div>
					<div class="evaPickerRow" v-for="(str,i) in evaRowText" :key="i" @click="putIn(str)">{{str}}</div>
				</div>
			</van-popup>
		</div>
	</div>
</template>

<script>
// @ts-nocheck

import apiRouter from '../../../config/api'
import { Dialog, Rate, Button, Icon, Toast, Popup, Loading, Switch } from 'vant'
import ICON_RECORDING from '../../../assets/work/icon_record.png'
import VoiceItem from './VoiceItem.vue'
export default {
	name: 'GradeAssignments',
	components: {
		[Button.name]: Button,
		[Rate.name]: Rate,
		[Icon.name]: Icon,
		[Loading.name]: Loading,
		[Popup.name]: Popup,
		[Switch.name]: Switch,
		[VoiceItem.name]: VoiceItem,
	},
	props: {
		workId: {
			type: String,
			required: false,
		},
		mainId: {
			type: String,
			required: false,
		},
		fromTeacher: {
			type: Boolean,
			required: false,
			default: true,
		},
		isBrowseOnly: {
			type: Boolean,
			required: false,
			default: false,
		},
		isGreat: {
			type: Boolean,
			required: false,
			default: false,
		},
		wx: {
			type: Object,
			required: true,
		},
		passFunc: {
			type: Function,
			required: true,
		},
		rejectFunc: {
			type: Function,
			required: true,
		},
		postCommentFunc: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			ossPath: roterOssPath,
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
			recordSecondsLeft: 60,
			voiceBarWidth: 15,
			voiceRecord: null,
			isPlaying: false,
			posting: false,
			loading: true,
			currentMp3Index: -1,
			audio: null,
			myUserId: -1,
			willRemove: false,
			isShared: false,
		}
	},
	// mounted() {
	// 	console.log('mounted')
	// 	this.init()
	// },
	// activated() {
	// 	console.log('activated')
	// 	this.init()
	// },
	// beforeUpdate() {
	// 	console.log('beforeUpdate')
	// 	this.init()
	// },
	methods: {
		init() {
			this.isPlaying = false
			this.loading = true
			this.posting = false
			this.isShared = !!this.isGreat
			this.showPicker = false
			this.comment = ''
			this.commentList = []
			this.score = 0
			this.voiceRecord = null
			this.recordSecondsLeft = 60
			// alert('s')
			// const vm = this
			// this.wx.onVoicePlayEnd({
			// 	success: function (res) {
			// 		vm.isPlaying = false
			// 	},
			// })
			let userStr = window.localStorage.getItem('USER')
			let user = JSON.parse(userStr)
			this.myUserId = user.userId
		},
		setHomeworkShared() {
			// console.log(this.isShared);
			this.$http
				.post(apiRouter.SET_HOMEWORK_SHARE, {
					mainId: this.mainId,
					isOpen: this.isShared ? 1 : 0,
				})
				.then(
					(response) => {
						if (response.status === 200) {
						}
					},
					(response) => {
						alert('请求失败了!!!!')
					}
				)
		},
		updateRate(newScore) {
			// alert(newScore);
			this.$http
				.post(apiRouter.PUT_HOMEWORK_RATE, {
					mainId: this.mainId,
					score: newScore,
				})
				.then(
					(response) => {
						if (response.status === 200) {
						}
					},
					(response) => {
						alert('请求失败了!!!!')
					}
				)
		},
		startWillRemove() {
			document.body.onselectstart = function () {
				return false
			}
			document.getElementById('app').classList.add('unselectable')
			this.willRemove = true
		},
		cancelWillRemove() {
			document.body.onselectstart = null
			document.getElementById('app').classList.remove('unselectable')
			this.willRemove = false
		},
		async removeItem(item) {
			// debugger
			if (
				this.willRemove &&
				item.ADDUSER_ID === this.myUserId &&
				item.COMMENT
			) {
				let answer = await Dialog.confirm({
					className: 'dy-rate-dialog',
					title: '',
					message: '确认撤销',
					confirmButtonText: '撤销',
					messageAlign: 'center',
				})
				if (answer === 'confirm') {
					const self = this
					let param = {
						commentId: item.ID,
						type: item.TYPE,
						comment_type: item.COMMENT_TYPE,
						value:
							item.COMMENT_TYPE === '2' ? item.COMMENT[0].value : item.COMMENT,
					}
					this.$http.post(apiRouter.DEL_HOMEWORK_COMMENT, param).then(
						(response) => {
							if (response.status === 200) {
								self.loadComments(
									{ WORKID: self.workId, ANID: self.mainId },
									false
								)
							}
						},
						(response) => {
							alert('请求失败了!!!!')
						}
					)
				}
			}
		},
		async playMP3(item, trackIndex) {
			if (this.audio) {
				this.audio.pause()
				this.audio = null
			}

			this.currentMp3Index = trackIndex

			try {
				const self = this
				const mp3Url = this.ossPath + '/' + decodeURIComponent(item.url)
				this.audio = new Audio(mp3Url)
				this.audio.play()
				console.log('Playing audio')
				setTimeout(function () {
					self.currentMp3Index = -1
				}, item.audio_time * 1e3 + 5e2)
			} catch (err) {
				console.log('Failed to play, error: ' + err)
				this.currentMp3Index = -1
			}
		},
		showRecordingToast() {
			const toast = Toast.loading({
				className: 'recordToast',
				duration: 0, // 持续展示 toast
				forbidClick: true,
				message: `还可录: ${this.recordSecondsLeft} ''`,
				icon: ICON_RECORDING,
			})
			this.recordingTimer = setInterval(() => {
				this.recordSecondsLeft--
				if (this.recordSecondsLeft) {
					toast.message = `还可录: ${this.recordSecondsLeft} ''`
				} else {
					this.hideRecordingToast()
				}
			}, 1e3)
		},
		hideRecordingToast() {
			clearInterval(this.recordingTimer)
			Toast.clear()
		},
		playVoice(recordItem) {
			const vm = this
			if (recordItem.localId) {
				vm.wx.playVoice({
					localId: recordItem.localId,
				})
				vm.isPlaying = true
			} else if (recordItem.value) {
				this.wx.downloadVoice({
					serverId: recordItem.value, // 需要下载的音频的服务器端ID
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function (res) {
						let localId = res.localId // 返回音频的本地ID
						vm.wx.playVoice({
							localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
						})
						vm.isPlaying = true
					},
				})
			}
		},
		playTempVoice() {
			if (this.voiceRecord) {
				const vm = this

				// this.wx.onVoicePlayEnd({
				// 	success: function (res) {
				// 		vm.isPlaying = false
				// 	},
				// })

				// debugger
				this.playVoice(this.voiceRecord)

				setTimeout(function () {
					vm.stopVoice(vm.voiceRecord.localId)
				}, (60 - vm.recordSecondsLeft) * 1e3 + 5e2)
			}
		},
		stopVoice(localId) {
			this.wx.stopVoice({
				localId: localId, // 需要停止的音频的本地ID，由stopRecord接口获得
			})
			this.isPlaying = false
		},
		uploadVoice(localId) {
			const vm = this
			this.wx.uploadVoice({
				localId: localId,
				isShowProgressTips: 1, // 默认为1，显示进度提示
				success: function (resp) {
					vm.voiceRecord = {
						localId: localId,
						value: resp.serverId,
						audio_time: 60 - vm.recordSecondsLeft,
					}
					vm.voiceBarWidth = vm.makeBarWidth(vm.voiceRecord.audio_time)
					console.log(vm.voiceRecord)
				},
			})
		},
		startRecord() {
			const vm = this
			this.wx.stopRecord()

			this.recordSecondsLeft = 60
			this.showRecordingToast()
			this.wx.startRecord()
			this.wx.onVoiceRecordEnd({
				// 录音时间超过一分钟没有停止的时候会执行 complete 回调
				complete: function (res) {
					vm.hideRecordingToast()
					vm.uploadVoice(res.localId)
				},
			})
		},
		endRecord() {
			this.hideRecordingToast()
			if (this.recordSecondsLeft > 59) {
				this.wx.stopRecord({
					success: function (res) {
						console.log(res)
					},
				})
				Toast('说话时间太短')
				return
			}
			const vm = this
			this.wx.stopRecord({
				success: function (res) {
					if (res.localId) {
						vm.uploadVoice(res.localId)
					}
				},
				fail: function (res) {
					console.log(res)
					Toast('说话时间太短')
				},
			})
		},
		async removeVoiceRecord() {
			const vm = this
			let answer = await Dialog.confirm({
				className: 'dy-rate-dialog',
				title: '',
				message: '确定要撤回录音吗？',
				confirmButtonText: '确定',
				messageAlign: 'center',
			})
			if (answer === 'confirm') {
				vm.voiceRecord = null
			}
		},
		makeBarWidth(timeLength) {
			return (timeLength / 60) * 10 + 5
		},
		makeParam() {
			// default use text comment
			let param = {
				score: this.score,
				comment_type: 1,
				comment: this.comment,
			}

			if (this.voiceRecord) {
				param.comment_type = 2
				param.comment = [
					{
						value: this.voiceRecord.value,
						audio_time: this.voiceRecord.audio_time,
					},
				]
			}

			return param
		},
		async saveComment() {
			if (!this.comment && !this.voiceRecord) {
				Toast('请先输入文字或录音')
				return
			}

			this.posting = true
			let param = this.makeParam()
			if (param.comment_type === 2) {
				param.comment = JSON.stringify(param.comment)
			}
			try {
				await this.postCommentFunc(param)
				Toast('操作成功')
				this.comment = ''
				this.voiceRecord = null
			} catch (err) {
				Toast(err.message)
			} finally {
				this.posting = false
			}
		},
		async savePass() {
			this.posting = true
			try {
				await this.passFunc(this.makeParam())
				this.comment = ''
				this.voiceRecord = null
			} catch (err) {
				Toast(err.message)
			} finally {
				this.posting = false
			}
		},
		async saveReject() {
			this.posting = true
			try {
				await this.rejectFunc(this.makeParam())
				this.comment = ''
				this.voiceRecord = null
			} catch (err) {
				Toast(err.message)
			} finally {
				this.posting = false
			}
		},
		popupPicker() {
			this.showPicker = true
		},
		putIn(str) {
			this.comment = (this.comment ? this.comment + ' ' : '') + str
			this.showPicker = false
		},
		loadComments(param, reset = true) {
			// debugger;
			if (reset) {
				this.init()
			}

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
						this.loading = false
						if (response.status === 200) {
							let data = response.data.data
							vm.commentList = data.commentList
							vm.score = Number(data.score)

							// console.log(vm.$refs.bar1 , vm.$refs.bar2);
							if (reset) {
								vm.$nextTick(function () {
									if (vm.fromTeacher) {
										vm.$refs.bar1.scrollIntoView()
									} else {
										vm.$refs.bar2.scrollIntoView()
									}
								})
							}
						}
					},
					(response) => {
						this.loading = false
						alert('请求失败了!!!!')
					}
				)
		},
	},
}
</script>

<style lang="less" scoped>
.voiceWrap {
	display: flex;
	margin-top: 25px;

	> .voiceSeconds {
		flex: 1;
		height: 30px;
		line-height: 30px;
		padding-left: 5px;
	}

	> .removeVoice {
		width: 30px;
		height: 30px;
		text-align: center;
	}
}

.rateBar {
	display: flex;
	align-items: center;
	margin: 15px 0;
	font-size: 1.2em;
}
.divShareGoodwork {
	display: flex;
	align-items: center;
}

.commentWrap {
	> div {
		user-select: none;
		color: #999;
		line-height: 2.2em;
		border-bottom: 1px dashed #dedede;
		margin: 20px 0;

		&:nth-last-of-type(1) {
			border-bottom: none;
		}
	}
}

.richTextWrap {
	font-size: 14px;
	color: #666;
	margin-bottom: 20px;

	* {
		max-width: 100%;
	}
}

.inputerWrap {
	display: flex;
	margin: 25px 0;
}
.iptText {
	flex: 1;
	border: 1px solid #c7c7c7;
	border-radius: 2px;
	padding: 0 0.5em;
	height: 30px;
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

.voice {
	background-color: #03a9f4;
	height: 32px;
	box-sizing: border-box;
	padding-left: 1em;
	padding-top: 2px;
	border-radius: 5px;
	margin-bottom: 5px;

	&::after {
		content: ' ';
		display: block;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAYCAYAAAAF6fiUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzlFRDZDRDNENzlFMTFFNkJDN0NFMjA2QTFFRTRDQkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzlFRDZDRDJENzlFMTFFNkJDN0NFMjA2QTFFRTRDQkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTAxQkEzQ0RENzM2MTFFNjgyMEI5MTNDRkQ0OTM5QUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTAxQkEzQ0VENzM2MTFFNjgyMEI5MTNDRkQ0OTM5QUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4K4iKVAAACUUlEQVR42uSazytEURTHvTHjR4kaU8xsSDZSdmbjx4oSK8XGQrJlpSwYTSmxEWWhUIpsZK3kD7DRNBuSBZFCNjZ+JPKcV6ecXu/d3sy7595bc+vbfXPue5/749z77o83lm3bZYYFC8RZqAbQAigP2tXNj5aZF7gdkAZNk9+7WvnOCCgxRUCb9n/o1sk3pUH6QDHF/GNsoM+QeYfiy6qkFeLZDBb0GlTB4AAR/xXT9nXxZVa0WCekQd9Y0HOJjg3CHySviiZmfjO3AyIhnu0gBc0wjAIR/wLtW8z87aAOWAI9gqaYRoAff4ZUoi7EKCiUP462j4CdSCrfK4N1Ahpi6I0i/hPa50M4oFB+Dbm/SzXfL5MD4rUogxP8+Itozynm59E+q5ovyuQdHxphWh568XvR5kxq1SEn40L4e0XMA1L4EcEe7RTjLqYdqRf/gezQUwr5LxjXq+aLHPCFcTmTA7z4tutIQhXfLiJPKXyRA/oxzgW8v9DgxU+S62eF/ATGr6r5fg26Corj9RHD4Z0fvwfjS9CbQn4bxrfK+R6TyzxZNk260solTL4i/g3al10TsMXIryA72T7VfK8MnJO8X9CKy14lafXjxx8jFUsSeyUzfxhtPwHPoqTy/TJJMJzJiPgNpJdsuNJizPwztB/q4JtwHN2KW3sn3HuMOouR30l6bbsOvgkOyGIBnaPbRldalJl/h2knuvgmOKAWNAFKMUz4Iv4O6Z1xXXxTPxtazHy6khnVyS/Fb8IDpHGyuvmWgX9L4Q4toDnQFWhNN/9PgAEAR4w1ULjdCbEAAAAASUVORK5CYII=)
			right 0 no-repeat;
		width: 20px;
		height: 20px;
		margin-top: 3px;
		background-size: cover;
	}
	&.playing&::after {
		animation-name: voicePlay;
		animation-duration: 1s;
		animation-direction: normal;
		animation-iteration-count: infinite;
		animation-timing-function: steps(3);
	}
}

@keyframes voicePlay {
	0% {
		background-position: 0;
	}
	100% {
		background-position: 100%;
	}
}

// .voice-box {
// 	background-color: #03a9f4;
// 	/* width: 60px; */
// 	height: 32px;
// 	box-sizing: border-box;
// 	padding-left: 1em;
// 	padding-top: 2px;
// 	border-radius: 5px;
// 	margin-bottom: 5px;

// 	> .wifi-symbol {
// 		width: 50px;
// 		height: 50px;
// 		zoom: 0.5;
// 		box-sizing: border-box;
// 		overflow: hidden;
// 		transform: rotate(135deg);

// 		> .wifi-circle {
// 			border: 5px solid #fff;
// 			border-radius: 50%;
// 			position: absolute;
// 		}
// 		.first {
// 			width: 5px;
// 			height: 5px;
// 			background: #cccccc;
// 			top: 45px;
// 			left: 45px;
// 		}

// 		.second {
// 			width: 25px;
// 			height: 25px;
// 			top: 35px;
// 			left: 35px;
// 		}

// 		.third {
// 			width: 40px;
// 			height: 40px;
// 			top: 25px;
// 			left: 25px;
// 		}
// 	}

// 	&.activeWave {
// 		.second {
// 			animation: wifiAni 1s infinite 0.2s;
// 		}
// 		.third {
// 			animation: wifiAni 1s infinite 0.4s;
// 		}
// 	}
// }

// @keyframes wifiAni {
// 	0% {
// 		opacity: 0;
// 	}
// 	100% {
// 		opacity: 1;
// 	}
// }
</style>
<style lang="less">
.nomoreWidth {
	max-width: 100%;
	* {
		max-width: 100%;
	}
}

.recordToast {
	> .van-toast__icon {
		margin-top: 8px !important;
	}
	> .van-toast__text {
		margin-top: 16px !important;
	}
}
</style>