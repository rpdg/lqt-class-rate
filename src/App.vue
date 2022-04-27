<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>


<script>
export default {
  name: "app"
};
</script>

<style lang="less">
@import "style/common.less";
@import "~vux/src/styles/reset.less";


#app {
  height: 100%;
}

hr {
	height: 0;
	border: none;
	border-bottom: 1px solid #dedede;
	margin: 0;

	&.gap {
		border-bottom: 15px solid #ededed;
	}
}

.mg-y-15 {
  margin-top: 15px;
  margin-bottom: 15px;
}

.mg-y-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.text-12{
  font-size: 12px;
}
.text-14{
  font-size: 14px;
}
.text-16{
  font-size: 16px;
}

.vux-cell-box:before {
  border-top: none;
}

.vux-header .vux-header-left .left-arrow:before {
  width: 8px !important;
  height: 8px !important;
  top: 11px !important;
}
.vux-header .vux-header-back{
  font-size: 15px !important;
}

.vux-tab-ink-bar{
    height: 5px !important;
    border-radius: 2px !important;
  }


.dy-rate-tab {
  .van-tab--active {
    .van-tab__text {
      font-size: 14px;
      color: #48b319;
    }
  }

  .van-tabs__line {
    width: 50%;
    background-color: #48b319;
  }
}

.dy-rate-dialog {
  border-radius: 6px;

  .van-dialog__header {
    font-weight: bold;
  }
  .van-dialog__message {
    font-size: 16px;
    font-weight: normal;
    color: #333;
    user-select: none;
  }

  .van-button__text {
    font-weight: bold;
  }
  .van-dialog__confirm {
    // color: #ED561B;
  }
}
.van-picker__confirm {
  font-size: 16px;
  color: #333;
}

.noMarginGroup {
  > div {
    margin-top: 0;
  }
}
</style>
