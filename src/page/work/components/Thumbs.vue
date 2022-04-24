<template>
	<div class="thumbList">
		<div
			v-for="(imgItem) in imgList"
			:class="imgList.length===1 ? 'thumb1': 'thumb2'"
			:style="'background-image:url('+ picBase + imgItem.CUT_URL +')'"
			:key="imgItem.ID"
			@click="viewFunc(imgItem.URL , imgList)"
		>
			<img v-if="imgList.length===1" :src="picBase + imgItem.URL" />
		</div>
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
		// margin-top: 10px;
		background-position: center center;
		background-repeat: no-repeat;

		&.thumb1 {
			flex: 1;
			background-image: none !important;

			> img {
				width: 100%;
			}
		}

		&.thumb2 {
			width: 48%;
			background-size: cover;
			&:after {
				display: block;
				width: 100%;
				padding-top: 100%;
				content: '';
			}
		}
	}
}
</style>