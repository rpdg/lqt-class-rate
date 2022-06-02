<template>
	<div class="wrapper">
		<div class="up-comment">
			<div class="mg-y-20 text-16">留言板</div>
			<div class="text-12 commentWrap">
				<div class="commentItem" :key="comment.ID" v-for="(comment , index) in commentList">
					{{comment.ADDUSER_NAME}} {{comment.ADD_TIME.substr(0,16)}}
					<!-- 操作类型 -->
					<span :style=" 'margin-left:1em; color:'+ typeColor[comment.TYPE]">{{typeWord[comment.TYPE]}}</span>

					<!-- 文字留言 -->
					<div
						v-if="comment.COMMENT_TYPE==='1'"
						class="nomoreWidth richTextWrap"
						v-html="comment.COMMENT"
					/>
					<!-- 录音留言 -->
					<voice-item
						v-else-if="comment.COMMENT_TYPE==='2'"
						:seconds="comment.COMMENT[0].audio_time"
						:playing="index===currentMp3Index"
						@click="playMP3(comment.COMMENT[0] , index)"
					/>
					<!-- 图片留言 -->
					<div v-else-if="comment.COMMENT_TYPE==='3'" class="commentImgContainer">
						<img
							v-for="(pic , x) in comment.COMMENT"
							:key="pic.value"
							:src="ossPath + '/' + pic.value"
							:data-index="x"
						/>
					</div>

					<!-- 附件列表 -->
					<div v-if="comment.ATT_LIST">
						<office-item
							v-for="file in comment.ATT_LIST"
							:key="file.URL"
							:ext="file.FILEEXT.toLowerCase()"
                    		:display-name="file.FILENAME"
							:url="ossPath + '/upload' + file.URL"
						/>
					</div>
				</div>
			</div>
		</div>
		<div style="padding: 15px 0;">
			<van-button type="info" style="font-size:16px;" block @click.native="goDetail">立马去订正</van-button>
		</div>
	</div>
</template>
<script>
import apiRouter from '../../config/api'
import { Icon, Button, Popup } from 'vant'
import VoiceItem from './components/VoiceItem.vue'
import OfficeItem from './components/OfficeItem.vue'

// @ts-ignore
export default {
	name: 'BBSAssignments',
	components: {
		[Icon.name]: Icon,
		[Popup.name]: Popup,
		[Button.name]: Button,
		[VoiceItem.name]: VoiceItem,
		[OfficeItem.name]: OfficeItem,
	},
	data() {
		return {
			oldPageTitle: '',
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
				// debugger
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
			// let mainId = this.$route.query.anId
			let vm = this
			this.$http
				.get(apiRouter.GET_HOMEWORK_BACK_COMMENT + '?workId=' + workId)
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
.commentImgContainer {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding-top: 20px;

	> img {
		width: 100%;
	}
}
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
	> .commentItem {
		user-select: none;
		color: #999;
		line-height: 2.2em;
		border-bottom: 1px dashed #dedede;
		padding: 20px 0;

		&:nth-of-type(1){
			padding-top: 0;
		}

		&:nth-last-of-type(1) {
			border-bottom: none;
			padding-bottom: 0;
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