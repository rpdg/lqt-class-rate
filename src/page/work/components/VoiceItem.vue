<template>
	<div class="mg-y-20 voiceWrap" @click="emitClick">
		<div
			:class="'voice-box' + (playing? ' activeWave':'')"
			:style="'width: '+ voiceBarWidth +'em;' "
		>
			<div class="wifi-symbol">
				<div class="wifi-circle first"></div>
				<div class="wifi-circle second"></div>
				<div class="wifi-circle third"></div>
			</div>
		</div>
		<div class="voiceSeconds">{{item.audio_time}}''</div>
	</div>
</template>
<script>
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
			return (this.item.audio_time / 60) * 10 + 5
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

	> .voiceSeconds {
		flex: 1;
		height: 30px;
		line-height: 30px;
		padding-left: 5px;
	}
}

.voice-box {
	background-color: #03a9f4;
	/* width: 60px; */
	height: 32px;
	box-sizing: border-box;
	padding-left: 1em;
	padding-top: 2px;
	border-radius: 5px;
	margin-bottom: 5px;

	> .wifi-symbol {
		width: 50px;
		height: 50px;
		zoom: 0.5;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);

		> .wifi-circle {
			border: 5px solid #fff;
			border-radius: 50%;
			position: absolute;
		}
		.first {
			width: 5px;
			height: 5px;
			background: #cccccc;
			top: 45px;
			left: 45px;
		}

		.second {
			width: 25px;
			height: 25px;
			top: 35px;
			left: 35px;
		}

		.third {
			width: 40px;
			height: 40px;
			top: 25px;
			left: 25px;
		}
	}

	&.activeWave {
		.second {
			animation: wifiAni 1s infinite 0.2s;
		}
		.third {
			animation: wifiAni 1s infinite 0.4s;
		}
	}
}

@keyframes wifiAni {
	0% {
		opacity: 0; /*初始状态 透明度为0*/
	}
	100% {
		opacity: 1; /*结尾状态 透明度为1*/
	}
}
</style>