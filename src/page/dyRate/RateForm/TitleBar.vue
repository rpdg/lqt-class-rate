<template>
  <x-header class="bList"><b>{{title}}</b></x-header>
</template>
<script>
import { XHeader } from "vux";

export default {
  components: {
    XHeader
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../style/minxin.less";

.vux-header {
  background-color: #fff;
  //   position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  border-bottom: solid 1px #dedede;
}

.vux-header.bList /deep/ .vux-header-title {
  color: #333;
  text-align: left;
  margin: 0 1.5em 0 88px;

  white-space: unset;
  line-height: unset;
  height: unset;
  min-height: 40px;
  padding: 4px 0;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;

  > b {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-inline-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
    -webkit-user-select: none;
    user-select: none;
  }
}

.vux-header /deep/ .vux-header-left {
  top: 14px !important;
}

.vux-header /deep/ .vux-header-back {
  color: #38f;
  font-size: 14px;
  padding-left: 14px !important;
}

.vux-header /deep/ .left-arrow:before {
  border-color: #38f !important;
  width: 8px !important;
  height: 8px !important;
  top: 12px !important;
}
</style>
