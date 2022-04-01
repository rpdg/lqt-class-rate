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
</style>
