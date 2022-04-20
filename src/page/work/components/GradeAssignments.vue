<template>
	<div class="up-comment" style="margin-bottom: 1rem">
		<div class="rateBar">
			<span class="text-14" style="flex: 1;">作业评价</span>
			<van-rate style="width: 120px;" color="#04BE02" v-model="score" />
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
            <van-icon name="orders-o" color="#48b319"  size="20" />
        </div>
		<div class="actionBar">
			<van-button plain color="#54B331" @click="savePass">批改通过</van-button>
			<van-button plain color="#EE0A24" @click="savePass">发回订正</van-button>
			<van-button plain color="#0093DD" @click="savePass">仅留言</van-button>
		</div>
	</div>
</template>

<script>
import apiRouter from '../../../config/api'
import { Rate, Button , Icon} from 'vant'

export default {
	components: {
		[Button.name]: Button,
		[Rate.name]: Rate,
		[Icon.name]: Icon,
	},
	props: {
		saveFunc: {
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
			score: 0,
			commentList: [],
		}
	},
	methods: {
		savePass() {
			console.log(this.score)
			this.saveFunc({ score: this.score })
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
							data.commentList[0] = {
								ADDUSER_ID: '24434',
								ADD_TIME: '2022-04-20 16:14:46',
								MAIN_ID: '1881964',
								ID: '1195044',
								WORK_ID: '20297314',
								TYPE: '1',
								COMMENT:
									'<p>要努力</p><p>加把劲</p><p><img src="http://img.baidu.com/hi/jx2/j_0028.gif?v=1.1"/></p>',
								ADDUSER_NAME: '赵大龙老师',
							}
							data.commentList[1] = {
								ADDUSER_ID: '24434',
								ADD_TIME: '2022-04-20 16:14:46',
								MAIN_ID: '1881964',
								ID: '1195044',
								WORK_ID: '20297314',
								TYPE: '2',
								COMMENT:
									'<p>要努力</p>',
								ADDUSER_NAME: '赵大龙老师',
							}

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

.inputerWrap{
    display: flex;
}
.actionBar {
	display: flex;
	gap: 15px;

	> button {
		flex: 1;
	}
}
</style>
