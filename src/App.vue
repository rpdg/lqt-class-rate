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

</style>
