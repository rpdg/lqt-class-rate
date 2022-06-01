<template>
	<div class="container">
		<div style="	margin-top: 15px;">
			<divider style="color: #1aad19">订正要求</divider>
		</div>
		<div class="comment-back" style>
			<span v-if="hkMap.COMMENT_TYPE == '1'" v-html="hkMap.BACK_COMMENT"></span>
			<voice-item
				v-else-if="hkMap.COMMENT_TYPE === '2'"
				:seconds="hkMap.BACK_COMMENT[ 0 ].audio_time"
				:playing="voicePlaying"
				@click="playMP3(hkMap.BACK_COMMENT[ 0 ])"
			/>
		</div>

		<div style="padding: 15px;">
			<van-button plain type="info" block @click.native="goDetailB">查看留言板</van-button>
			<van-button type="info" block @click.native="goDetail" style="margin-top:15px;">立马去订正</van-button>
		</div>
	</div>
</template>

<script type="es6">
import { Divider, TransferDomDirective as TransferDom } from 'vux'
import { Button } from 'vant'
import apiRouter from '../../config/api.js'
import VoiceItem from './components/VoiceItem.vue'

export default {
	directives: {
		TransferDom,
	},
	components: {
		[Button.name]: Button,
		Divider,
		[VoiceItem.name]: VoiceItem,
	},
	activated() {
		this.currentWork = 0
		this.loadData()
		this.oldPageTitle = document.title
		document.title = '作业订正提醒'
	},
	deactivated() {
		document.title = this.oldPageTitle;
		this.hkMap = {};
	},
	data() {
		return {
			oldPageTitle: '',
			ossPath: roterOssPath,
			audio: null,
			voicePlaying: false,
			locationLine: '',
			rootDomain: window.location.protocol + '//' + window.location.host,
			id: '',
			typeId: '',
			typeCode: '',
			hkMap: {},

			//
			workObj: {},
			detail: {},
			imgObj: {
				content: '',
				serverid: [],
				imgs: [],
			},

			trueList: [],
			currentWork: 0,
			workId: '',
			quesList: [],
			checkList: [],
			showRecording: false,
			progress: 20,
			voiceSecond: 60,
			voiceTimer: {},
			showSubmit: false,
			showDelVoice: false,
			showDelImg: false,
			timeOutEvent: 0,
			delList: [],
			delIndex: 0,
		}
	},

	methods: {
		async playMP3(item) {
			if (this.audio) {
				this.audio.pause()
				this.audio = null
			}

			this.voicePlaying = true

			try {
				const self = this
				const mp3Url = this.ossPath + '/' + decodeURIComponent(item.url)
				this.audio = new Audio(mp3Url)
				this.audio.play()
				console.log('Playing audio')
				setTimeout(function () {
					self.voicePlaying = false
				}, item.audio_time * 1e3 + 5e2)
			} catch (err) {
				console.log('Failed to play, error: ' + err)
				this.voicePlaying = false
			}
		},
		loadData() {
			let workId = this.$route.query.workId
			let anId = this.$route.query.anId
			let _this = this
			this.$http
				.get(apiRouter.GET_HOMEWORK_BACK_COMMENT + '?workId=' + workId)
				.then(
					(response) => {
						if (response.status === 200) {
							_this.hkMap = response.body.data.hkMap
						}
					},
					(response) => {
						this.$vux.toast.show({
							text: '"请求失败了!!!!"',
						})
					}
				)
		},
		goDetail(evt , toBBS = false) {
			let workId = this.$route.query.workId
			let anId = this.$route.query.anId
			this.$router.push({
				path: 'work-detail',
				query: { workId: workId, anId: anId, d2: toBBS ? 1 : 0 },
			})
		},
		goDetailB(evt) {
			this.goDetail(evt , true)
		},
	},
}
</script>


<style lang="less" scoped>
@import '../../style/minxin.less';

.container {
	text-align: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.teacher-img {
	margin-top: 2rem;
	width: 50%;
}

.comment-back {
	// width: 92%;
	// margin-top: 1.5rem;
	// display: inline-block;
	// margin-bottom: 2.5rem;
	color: #414141;
	flex: 1;
	overflow: auto;
	margin: 20px 15px 0;
}

.comment-back /deep/ img {
	max-width: 100%;
}

.rev-btn {
	background-color: white;
	border-radius: 99px;
	width: 70%;
	// position: fixed;
	// bottom: 10px;
	// left: 15%;
}
</style>
