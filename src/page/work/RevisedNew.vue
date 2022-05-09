<template>
	<div class="wrapper">
		<div class="up-comment">
			<div class="mg-t-20 text-16">留言板</div>
			<div class="text-12 commentWrap">
				<div :key="comment.ID" v-for="(comment , index) in commentList">
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
		</div>
		<div style="padding: 15px 0;">
			<van-button type="info" block @click.native="goDetail">立马去订正</van-button>
		</div>
	</div>
</template>
<script>
import apiRouter from '../../config/api'
import { Icon, Button, Popup } from 'vant'
import VoiceItem from './components/VoiceItem.vue'

export default {
	name: 'BBSAssignments',
	components: {
		[Icon.name]: Icon,
		[Popup.name]: Popup,
		[Button.name]: Button,
		[VoiceItem.name]: VoiceItem,
	},
	data() {
		return {
			oldPageTitle: '',
			// @ts-ignore
			ossPath: window.roterOssPath,
			typeColor: {
				1: '#48b319',
				2: '#ee0a24',
			},
			typeWord: {
				1: '批改通过',
				2: '发回订正',
			},
			comment: '',
			commentList: [],
			currentMp3Index: -1,
			audio: null,
		}
	},
	activated() {
		this.oldPageTitle = document.title
		document.title = '作业订正提醒'
		console.log('activated')
		this.init()
		this.loadComments()
	},
	deactivated() {
		document.title = this.oldPageTitle
	},
	methods: {
		init() {
			this.comment = ''
			this.commentList = []
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
		goDetail(evt) {
			let workId = this.$route.query.workId
			let anId = this.$route.query.anId
			this.$router.push({
				path: 'work-detail',
				query: { workId: workId, anId: anId },
			})
		},
		loadComments() {
			let workId = this.$route.query.workId
			let mainId = this.$route.query.anId
			let vm = this
			this.$http
				.get(
					apiRouter.GET_HOMEWORK_COMMENT_LIST +
						'?workId=' +
						workId +
						'&mainId=' +
						mainId
				)
				.then(
					(response) => {
						if (response.status === 200) {
							let data = response.data.data
							vm.commentList = data.commentList
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
.wrapper {
	margin: 0 15px;
	height: 100vmax;
	display: flex;
	flex-direction: column;
}
.up-comment {
	flex: 1 1 0%;
	overflow: auto;
}
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