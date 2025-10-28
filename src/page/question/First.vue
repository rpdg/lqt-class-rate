<template>
	<div class="box">
		<!-- 返回组件 -->
		<back-title-bar title="发问卷" />
		<div class="wapper">
			<h2 class="type-h2">请选择问卷类型</h2>
			<ul class="get-type">
				<li class="type-list" v-for="(item,index) in typeData" @click="typeLink(item.type,item)">
					<span class="left type-name">{{ item.objectName }}</span>
					<em class="right type-icon"></em>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
// import Back from '../../components/common/Back.vue'
import BackTitleBar from '../../components/common/BackTitleBar.vue'

import apiRouter from '../../config/api.js'
import { mapMutations } from 'vuex'
export default {
	components: {
		BackTitleBar,
	},

	methods: {
		typeLink(path, item) {
			/*this.choolesType(item)*/
			let string = JSON.stringify(item)
			window.localStorage.setItem('q-type', string)
			this.$router.push({ path: 'q-scope' })

			/*if( path === "DEPT" ){
          this.$router.push({path:'question-notice'})
        }
        if( path === "CLASS" ){
          this.$router.push({path:'question-grade'})
        }
        if( path === "COURSE" ){
          this.$router.push({path:'question-curriculum'})
        }
        if( path === "SELCOURSE" ){
          this.$router.push({path:'question-optional'})
        }
        if( path === "SPECIAL" ){
          this.$router.push({path:'question-space'})
        }*/
		},
		/*...mapMutations({
        choolesType:"SET_TYPE"
      })*/
	},
	data() {
		return {
			typeData: [
				{
					type: '100',
					objectName: '单选（确认单、告知单）',
				},
				{
					type: '200',
					objectName: '多选及投票',
				},
				{
					type: '300',
					objectName: '活动报名',
				},
				{
					type: '400',
					objectName: '评价打分',
				},
			],
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
	height: 30px;
	background: @green;
	line-height: 30px;
	.mixin-padding(25px,0);
	color: @white;
	font-size: @fontSize30;
}
.get-type {
	width: 100%;
}
.type-list {
	.mixin-padding(25px,25px);
	height: 50px;
	border-bottom: 1px solid @colorDD;
	line-height: 50px;
}
.type-name {
	font-size: @fontSize30;
	color: @color42;
}
.type-icon {
	width: 7px;
	height: 12px;
	background: url('../../assets/chevron right.png');
	background-size: 100% 100%;
	margin-top: 19px;
}
</style>
