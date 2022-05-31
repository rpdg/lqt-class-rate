<template>
	<div class="voiceWrap" @click="emitClick">
		<div
			:class="'voice' + (playing? ' playing':'')"
			:style="'width: '+ voiceBarWidth +'em;' "
		/>
		<div class="voiceSeconds">{{item.audio_time}}''</div>
	</div>
</template>
<script>
// @ts-ignore

export default {
	name: 'VoiceItem',
	props: {
		item: {
			type: Object,
			required: true,
		},
		playing: {
			type: Boolean,
			required: false,
			default: () => false,
		},
	},
	data() {
		return {}
	},
	computed: {
		voiceBarWidth() {
			return (this.item.audio_time / 60) * 10 + 4
		},
	},
    methods:{
        emitClick(){
            this.$emit("click")
        }
    }
}
</script>
<style lang="less" scoped>
.voiceWrap {
	display: flex;
	margin-top: 0.5em;
	font-size: 14px;

	> .voiceSeconds {
		flex: 1;
		height: 30px;
		line-height: 30px;
		padding-left: 5px;
		text-align: left;
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
// 		opacity: 0; /*初始状态 透明度为0*/
// 	}
// 	100% {
// 		opacity: 1; /*结尾状态 透明度为1*/
// 	}
// }
</style>