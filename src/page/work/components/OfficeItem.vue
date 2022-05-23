<template>
	<div class="itemRow">
		<a class="spFileName" :href="url" target="_blank" :data-id="id">{{displayName}}</a>
		<a v-if="previewUrl" class="spPreview" :href="previewUrl" target="_blank">预览</a>
	</div>
</template>
<script>
// @ts-ignore

export default {
	name: 'OfficeItem',
	props: {
		id:{
			type: String,
			required: false,
			default: ''
		},
		ext: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		displayName:{
			type: String,
			required: true,
		}
	},
    computed:{
        previewUrl(){
            const filePath = window.location.protocol + this.url
			if (
				this.ext.indexOf('doc') === 0 ||
				this.ext.indexOf('xls') === 0 ||
				this.ext.indexOf('ppt') === 0
			) {
				return 'https://view.officeapps.live.com/op/view.aspx?src=' + filePath
			} else if (this.ext === 'pdf') {
                return '/weixin/wechat/fileview/go_page.jsp?filePath=' + filePath
			} else{
                return ''
            }
        }
    }
}
</script>
<style lang="less" scoped>
.itemRow {
	font-size: 14px;

	> .spFileName {
		font-size: 14px;
		color: #005ba2;
		text-decoration: none;
		margin-right: 1em;
	}

	> .spPreview {
		font-size: 14px;
		color: #48b319;
		text-decoration: underline;
	}
}
</style>