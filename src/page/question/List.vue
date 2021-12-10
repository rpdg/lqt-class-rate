<template>
	<div class="box">
		<!-- 返回组件 -->
		<back-title-bar title="发问卷" />
		<div class="wapper">
			<h2 class="type-h2">请选择问卷发起人角色</h2>
			<ul class="get-type">
				<li class="type-list" v-for="(item,index) in typeData" @click="typeLink(item.objectName,item)">
					<span class="left type-name">{{ item.showName }}</span>
					<em class="right type-icon"></em>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import BackTitleBar from '../../components/common/BackTitleBar.vue'
import apiRouter from '../../config/api.js'
import { mapMutations } from 'vuex'
export default {
	components: {
		BackTitleBar,
	},
	mounted() {
		this.showData()
	},
	methods: {
		//  获取数据
		showData() {
			let _this = this
			this.$http.get(apiRouter.GET_QUESTION_SCOPE).then(
				(response) => {
					if (response.status === 200) {
						return (_this.typeData = response.body.data)
					}
				},
				(response) => {
					alert('请求失败了!!!!')
				}
			)
		},

		typeLink(path, item) {
			this.choolesType(item)
			let string = JSON.stringify(item)
			window.localStorage.setItem('q-scope', string)
			if (path === 'T_DEPT') {
				this.$router.push({ path: 'question-notice' })
			}
			if (path === 'T_CLASS') {
				this.$router.push({ path: 'question-grade' })
			}
			if (path === 'T_COURSE') {
				this.$router.push({ path: 'question-curriculum' })
			}
			if (path === 'T_SEL_COURSE') {
				this.$router.push({ path: 'question-optional' })
			}
			if (path === 'T_SPECIAL_SPACE') {
				this.$router.push({ path: 'question-space' })
			}
		},

		...mapMutations({
			choolesType: 'SET_TYPE',
		}),
	},
	data() {
		return {
			typeData: [],
		}
	},
}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';
.wapper {
	position: absolute;
	top: 47px;
	bottom: 0;
	left: 0;
	right: 0;
	overflow: scroll;
}
.type-h2 {
	width: 100%;
	height: 60 / @baseSize;
	background: @green;
	line-height: 60 / @baseSize;
	.mixin-padding(50/@baseSize,0);
	color: @white;
	font-size: @fontSize30;
}
.get-type {
	width: 100%;
}
.type-list {
	.mixin-padding(50/@baseSize,50/@baseSize);
	height: 100 / @baseSize;
	border-bottom: 1px solid @colorDD;
	line-height: 99 / @baseSize;
}
.type-name {
	font-size: @fontSize30;
	color: @color42;
}
.type-icon {
	width: 14 / @baseSize;
	height: 24 / @baseSize;
	background: url('../../assets/chevron right.png');
	background-size: 100% 100%;
	margin-top: 38 / @baseSize;
}
</style>
