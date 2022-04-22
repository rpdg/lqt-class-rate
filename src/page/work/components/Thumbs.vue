<template>
	<div class="thumbList">
		<div
			v-for="(imgItem) in imgList"
			:class="imgList.length===1 ? 'thumb1': 'thumb2'"
			:style="'background-image:url('+ picBase + imgItem.URL +')'"
			:key="imgItem.ID"
			@click="viewFunc(imgItem.URL , imgList)"
		/>
	</div>
</template>
<script>
export default {
	name: 'ThumbsGrid',
	props: {
		imgList: {
			type: Array,
			required: true,
		},
		picBase: {
			type: String,
			required: true,
		},
		viewFunc: {
			type: Function,
			required: true,
		},
	},
}
</script>
<style lang="less" scoped>
.thumbList {
	gap: 10px;
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
	margin-bottom: 10px;

	div {
		// aspect-ratio: 16 / 9;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		// margin-top: 10px;
	}
	div:after {
		display: block;
		width: 100%;
		padding-top: 56.25%;
		content: '';
	}
	> .thumb1 {
		flex: 1;
	}
	> .thumb2 {
		// flex: 48%;
		width: 48%;
	}
}
</style>