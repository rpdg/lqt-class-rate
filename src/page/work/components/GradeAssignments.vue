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
			<div v-if="fromTeacher" class="text-14 divShareGoodwork">
				<span style="flex: 1;">作为优秀作业展示</span>
				<van-switch v-model="isShared" @change="setHomeworkShared" active-color="#48b319" size="22px" />
			</div>
			<div v-else-if="isGreat" class="text-12" style="color:#48b319;">已被老师推优，向其他同学展示</div>

			<hr class="mg-y-20" />

			<div class="mg-y-20 text-16">留言板</div>
			<div class="mg-y-20 text-12 commentWrap">
				<div
					class="commentItem"
					v-for="( comment, index ) in commentList"
					:key="comment.ID"
					v-long-press="1500"
					@touchstart="(evt)=>{if(comment.ADDUSER_ID === myUserId){startWillRemove(evt, comment)}}"
					@touchmove="()=>{if(comment.ADDUSER_ID === myUserId){cancelWillRemove()}}"
					@long-press-stop="()=>{if(comment.ADDUSER_ID === myUserId){cancelWillRemove()}}"
					@long-press-start="()=>{if(comment.ADDUSER_ID === myUserId){removeItem()}}"
				>
					{{ comment.ADDUSER_NAME }} {{ comment.ADD_TIME.substr(0, 16) }}
					<!-- 操作类型 -->
					<span
						:style="'margin-left:1em; color:' + typeColor[ comment.TYPE ]"
					>{{ typeWord[ comment.TYPE ] }}</span>

					<!-- 文字留言 -->
					<div
						v-if="comment.COMMENT_TYPE === '1'"
						class="nomoreWidth richTextWrap"
						v-html="comment.COMMENT.replace(/\n/gi , '<p />')"
					/>

					<!-- 录音留言 -->
					<voice-item
						v-else-if="comment.COMMENT_TYPE === '2'"
						:item="comment.COMMENT[ 0 ]"
						:playing="index === currentMp3Index"
						@click="playMP3(comment.COMMENT[ 0 ], index)"
					/>

					<!-- 图片留言 -->
					<div v-else-if="comment.COMMENT_TYPE === '3'" class="commentImgContainer">
						<div class="divImg" v-for="( pic, x ) in comment.COMMENT" :key="pic.value" :data-index="x">
							<img
								:src="ossPath + '/' + pic.value"
								:class="comment.ADDUSER_ID === myUserId ? `deletable`: ''"
							/>
						</div>
					</div>

					<!-- 附件列表 -->
					<div v-if="comment.ATT_LIST">
						<office-item
							v-for="file in comment.ATT_LIST"
							:id="file.ID"
							:key="file.URL"
							:ext="file.FILEEXT.toLowerCase()"
							:display-name="file.FILENAME"
							:url="ossPath + '/upload' + file.URL"
						/>
					</div>
				</div>
			</div>

			<hr class="mg-y-20" style="	margin-top: -5px; " />

			<!-- 留言输入框 -->
			<div class="inputerWrap" v-show="!voiceRecord && !isBrowseOnly && !imgTempList.length">
				<van-icon
					name="orders-o"
					color="#48b319"
					size="30"
					style="	margin-left: -4px;"
					@click="popupPicker"
					v-if="fromTeacher"
				/>
				<div class="areaWrap">
					<van-field
						type="textarea"
						v-model="comment"
						rows="1"
						maxlength="200"
						:border="true"
						:show-word-limit="true"
						:autosize="{ maxHeight: 240, minHeight: 24 }"
					/>
				</div>

				<!-- 录音、传图 两个按钮 -->
				<div class="commentBtnWrap" v-show="comment.length === 0">
					<span
						class="bar-btn btn-voice"
						@touchstart.prevent="startRecord"
						@touchend.prevent="endRecord"
					/>
					<span class="bar-btn btn-picture" @click="choosePicture" />
				</div>
			</div>

			<!-- 录音记录条 -->
			<div class="mg-y-20 voiceWrap" v-show="voiceRecord">
				<div
					@click="playTempVoice"
					:class="'voice' + (isPlaying ? ' playing' : '')"
					:style="'width: ' + voiceBarWidth + 'em;'"
				/>
				<div class="voiceSeconds">{{ 60 - recordSecondsLeft }}''</div>
				<div class="removeVoice">
					<van-icon name="revoke" size="26" color="#999" @click="removeVoiceRecord" />
				</div>
			</div>

			<!-- 临时图片展示区 -->
			<div class="mg-y-20 picWrap" v-show="imgTempList.length">
				<van-uploader
					style="width: 100%;"
					v-model="imgTempList"
					:max-count="imgTempMax"
					@click-upload="choosePicture"
				/>
			</div>

			<!-- 三个操作按钮 : 教师端 -->
			<div class="actionBar" ref="bar1" v-if="fromTeacher">
				<van-button plain color="#0093DD" @click="saveComment" :disabled="posting">仅留言</van-button>
				<van-button plain color="#54B331" @click="savePass" :disabled="posting">批改通过</van-button>
				<van-button plain color="#EE0A24" @click="saveReject" :disabled="posting">发回订正</van-button>
			</div>
			<!-- 操作按钮 ： 学生端 -->
			<div class="actionBar" ref="bar2" v-else-if="!isBrowseOnly">
				<van-button plain color="#0093DD" @click="saveComment" :disabled="posting">留言</van-button>
			</div>
			<!-- 快捷评语 -->
			<van-popup v-model="showPicker" :style="{ height: '80vh' }" position="bottom">
				<div class="evaPicker">
					<div class="evaPickerToolbar">快捷评语</div>
					<div
						class="evaPickerRow"
						v-for="( str, i ) in evaRowText"
						:key="i"
						@click="putIn(str)"
					>{{ str }}</div>
				</div>
			</van-popup>
		</div>
	</div>
</template>

<script>
import apiRouter, { apiPath } from '../../../config/api'
import {
	Dialog,
	Rate,
	Button,
	Icon,
	Toast,
	Popup,
	Loading,
	Switch,
	Field,
	Uploader,
} from 'vant'
// @ts-ignore
import ICON_RECORDING from '../../../assets/work/icon_record.png'
import OfficeItem from './OfficeItem.vue'
import VoiceItem from './VoiceItem.vue'
import authonStore from '../../../utils/authonStore'
import { readWxImages } from '../../../utils/imgUtil'

// @ts-ignore
export default {
	name: 'GradeAssignments',
	components: {
		[Button.name]: Button,
		[Rate.name]: Rate,
		[Icon.name]: Icon,
		[Loading.name]: Loading,
		[Popup.name]: Popup,
		[Field.name]: Field,
		[Switch.name]: Switch,
		[Uploader.name]: Uploader,
		[VoiceItem.name]: VoiceItem,
		[OfficeItem.name]: OfficeItem,
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
			// @ts-ignore
			ossPath: roterOssPath,
			typeColor: {
				1: '#48b319',
				2: '#ee0a24',
				4: '#666',
				5: '#0093DD',
			},
			typeWord: {
				1: '批改通过',
				2: '发回订正',
				4: '提交作业',
				5: '提交订正',
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
			debounceTimer: 0,
			imgTempMax: 4,
			imgTempList: [],
			willRemoveItem: null,
			willRemoveTargetDom: null,
		}
	},
	// mounted() {
	// 	console.log('mounted');
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
		async init() {
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
			this.imgTempList.length = 0
			// alert('s')
			// const vm = this
			// this.wx.onVoicePlayEnd({
			// 	success: function (res) {
			// 		vm.isPlaying = false
			// 	},
			// })
			let user = await authonStore.getUserInfo()
			this.myUserId = user ? user.userId : -1

			if (authonStore.shallAskRecorderPermission()) {
				const self = this
				this.wx.startRecord({
					success: function () {
						self.wx.stopRecord()
						authonStore.setRecorderPermission(true)
					},
					cancel: function () {
						authonStore.setRecorderPermission(false)
						alert('用户拒绝授权录音')
					},
				})
			}
		},
		choosePicture(evt) {
			evt.preventDefault()
			evt.stopPropagation()
			let self = this
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer)
			}
			this.debounceTimer = setTimeout(function () {
				self.wx.chooseImage({
					count: self.imgTempMax - self.imgTempList.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						let toast
						try {
							toast = Toast.loading({
								message: '上传中...',
								overlay: true,
								forbidClick: true,
								duration: 0,
							})
							let files = await readWxImages(res.localIds)
							// console.log(files)
							let bodyFormData = new FormData()
							files.forEach((file) => {
								bodyFormData.append('files', file)
							})
							let resp = await self.$http.post(
								apiPath + '/wechat/homeworkH5/upload_pic',
								bodyFormData
							)
							let result = resp.data
							console.log(result)
							if (result.status === 200) {
								result.data.image_list.forEach(function (item) {
									self.imgTempList.push({
										...item,
										url: item.SHOW_URL,
									})
									console.log('self.imgTempList', self.imgTempList)
								})
							}
						} catch (err) {
							throw err
						} finally {
							// @ts-ignore
							toast.clear()
						}
					},
				})
			}, 3e2)
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
		startWillRemove(evt, item) {
			console.log('[startWillRemove], evt:', evt, item)

			this.willRemoveItem = item
			this.willRemoveTargetDom = evt.target

			this.willRemove = true

			// @ts-ignore
			document.getElementById('app').classList.add('unselectable')
			document.body.onselectstart = function () {
				return false
			}
		},
		cancelWillRemove() {
			if (this.willRemove) {
				console.log('[cancelWillRemove]')
				this.willRemove = false
			}

			// this.willRemoveItem = null
			// this.willRemoveTargetDom = null
			// @ts-ignore
			// document.getElementById('app').classList.remove('unselectable')
			// document.body.onselectstart = null
		},
		async removeItem() {
			// debugger
			let item = this.willRemoveItem
			console.log('[removeItem]:', item, this.willRemoveTargetDom)
			if (
				this.willRemove &&
				item.ADDUSER_ID === this.myUserId &&
				(item.COMMENT ||
					(this.willRemoveTargetDom.tagName === 'A' &&
						this.willRemoveTargetDom.classList.contains('spFileName')))
			) {
				try {
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
							value: null,
						}

						if (item.COMMENT_TYPE === '1') {
							// 附件删除
							if (
								this.willRemoveTargetDom.tagName === 'A' &&
								this.willRemoveTargetDom.classList.contains('spFileName')
							) {
								param.comment_type = '4'
								param.value = this.willRemoveTargetDom.dataset['id']
							}
							// 留言删除
							else {
								param.value = item.COMMENT
							}
						}
						// 录音删除
						else if (item.COMMENT_TYPE === '2') {
							param.value = item.COMMENT[0].value
						}
						// 图片删除
						else if (item.COMMENT_TYPE === '3') {
							param.value =
								item.COMMENT[this.willRemoveTargetDom.dataset['index']].value
						}

						this.$http.post(apiRouter.DEL_HOMEWORK_COMMENT, param).then(
							(response) => {
								if (response.status === 200) {
									self.loadComments(
										{ WORKID: self.workId, ANID: self.mainId },
										false
									)
								}

								self.willRemoveItem = null
								self.willRemoveTargetDom = null

								// @ts-ignore
								document.getElementById('app').classList.remove('unselectable')
								document.body.onselectstart = null
							},
							(response) => {
								alert('请求失败了!!!!')
							}
						)
					}
				} catch (e) {
				} finally {
					this.cancelWillRemove()
				}
			} else {
				this.cancelWillRemove()
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
			const self = this
			this.recordingTimer = setInterval(() => {
				self.recordSecondsLeft--
				if (self.recordSecondsLeft) {
					toast.message = `还可录: ${self.recordSecondsLeft} ''`
				} else {
					self.endRecord()
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
			setTimeout(function () {
				vm.wx.uploadVoice({
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
			}, 1e2)
		},
		startRecord(evt) {
			// if (!authonStore.shallAskRecorderPermission()) {
			// 	return
			// }
			evt.stopImmediatePropagation()
			evt.target.dispatchEvent(new Event('focus'))
			document.body.onselectstart = function () {
				return false
			}
			// @ts-ignore
			document.getElementById('app').classList.add('unselectable')

			const self = this
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer)
			}
			this.debounceTimer = setTimeout(function () {
				self.wx.stopRecord()

				self.wx.startRecord({
					success(res) {
						self.recordSecondsLeft = 60
						self.showRecordingToast()
					},
					fail() {
						self.hideRecordingToast()
						Toast('录音失败')
					},
				})
				self.wx.onVoiceRecordEnd({
					// 录音时间超过一分钟没有停止的时候会执行 complete 回调
					complete: function (res) {
						self.hideRecordingToast()
						if (res.localId) {
							self.uploadVoice(res.localId)
						}
					},
				})
			}, 3e2)
		},
		endRecord() {
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer)
			}

			document.body.onselectstart = null
			// @ts-ignore
			document.getElementById('app').classList.remove('unselectable')

			this.hideRecordingToast()

			const vm = this
			this.wx.stopRecord({
				success: function (res) {
					if (vm.recordSecondsLeft > 59) {
						Toast('说话时间太短')
					} else if (res.localId) {
						vm.uploadVoice(res.localId)
					}
				},
				fail: function (res) {
					console.log(res)
					Toast('录音失败')
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

			if (this.imgTempList.length) {
				param.comment_type = 3
				param.comment = []
				this.imgTempList.forEach(function (picItem) {
					param.comment.push({
						value: picItem.DB_PATH,
					})
				})
			}

			return param
		},
		async saveComment() {
			if (!this.comment && !this.voiceRecord && !this.imgTempList.length) {
				Toast('请先输入文字或录音')
				return
			}

			this.posting = true
			let param = this.makeParam()

			if (param.comment_type === 2 || param.comment_type === 3) {
				param.comment = JSON.stringify(param.comment)
			}

			try {
				await this.postCommentFunc(param)
				Toast('操作成功')
				this.comment = ''
				this.voiceRecord = null
				this.imgTempList.length = 0
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
.commentImgContainer {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding-top: 20px;

	> .divImg {
		display: inline-flex;
	}

	img {
		width: 100%;
	}
}

.voiceWrap {
	display: flex;

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
	> .commentItem {
		user-select: none;
		-webkit-touch-callout: none;

		color: #999;
		line-height: 2.2em;
		border-bottom: 1px dashed #dedede;
		padding: 20px 0;

		&:nth-of-type(1) {
			padding-top: 0;
		}

		&:nth-last-of-type(1) {
			border-bottom: none;
			padding-bottom: 0;
		}

		img.deletable {
			pointer-events: none;
			-webkit-touch-callout: none;
		}
	}
}

.richTextWrap {
	font-size: 14px;
	color: #666;

	* {
		max-width: 100%;
	}
}

.inputerWrap {
	display: flex;
	margin: 25px 0;
	align-items: center;
}

.areaWrap {
	flex: 1;
	// padding: 0.5em;
	border: 1px solid #c7c7c7;
	border-radius: 2px;

	> .van-cell {
		padding: 0.5em;
	}

	.van-field__word-limit {
		color: #c7c7c7;
	}
}

.iptText {
	flex: 1;
	border: 1px solid #c7c7c7;
	border-radius: 2px;
	padding: 0.5em;
	min-height: 30px;
	overflow: hidden;
	outline: none;
	resize: none;
	// transition: all 0.2s linear;
}

.commentBtnWrap {
	width: 30px;
	height: 100%;
	display: flex;
	flex-direction: column;
	margin-left: 8px;
	gap: 5px;
	user-select: none;
	-webkit-touch-callout: none;
}

.bar-btn {
	width: 26px;
	height: 26px;
	line-height: 26px;
	font-family: 'icon';
	font-size: 24px;
	color: #fff;
	text-align: center;
	border-radius: 50%;
	-webkit-touch-callout: none;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;

	&.btn-picture {
		background-image: url('../../../assets/work/camera.png');
	}

	&.btn-voice {
		background-image: url('../../../assets/work/voice.png');
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
.picWrap {
	.van-uploader__preview-image,
	.van-uploader__upload {
		height: 21vw;
		width: 21vw;
	}

	.van-uploader__upload {
		border: 1px solid #c7c7c7;
	}

	.van-uploader__preview,
	.van-uploader__upload {
		margin: 0 9px 0 0;

		&:nth-last-of-type(1) {
			margin-right: 0;
		}
	}

	.van-uploader__preview-delete {
		width: 18px;
		height: 18px;
		border-radius: 0 0 0 14px;

		> .van-uploader__preview-delete-icon {
			font-size: 20px;
		}
	}
}

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
