<template>
	<!-- <div class="timecodeDiv">
		<span
			v-for="(value, index) in timecodeArray"
			:class="{timecodeSpan: true , checked: (value=== timecodeValue)}"
			:key="index"
			@click="check(value)"
		>{{value}}</span>
	</div>-->
  <div class="timecodeDiv">
    <checker
      v-model="timecodeValue"
      default-item-class="write-back-item"
      selected-item-class="write-back-selected"
      @on-change="handleCheck"
      style="	line-height: 1.19rem;"
    >
      <checker-item v-for="(value,i) in timecodeArray" :key="i" :value="value">{{value}}</checker-item>
    </checker>
  </div>
</template>
<script>
import { Checker, CheckerItem } from "vux";
export default {
  components: {
    Checker,
    CheckerItem
  },
  data() {
    return {
      timecodeArray: [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, "自定义"],
      timecodeValue: null,
      timecodeInputer: 0
    };
  },
  activated: function() {
    // alert(this.timecodeValue);
    this.timecodeValue = ''
    // this.$emit("check", { val: this.timecodeValue, ipt: this.timecodeInputer });
  },
  methods: {
    // check(v) {
    //   this.timecodeValue = v;
    //   this.timecodeInputer = v === "自定义" ? 1 : 0;
    //   this.$emit("check", { val: v, ipt: this.timecodeInputer });
    // },
    handleCheck() {
      this.timecodeInputer = this.timecodeValue === "自定义" ? 1 : 0;
      this.$emit("check", {
        val: this.timecodeValue,
        ipt: this.timecodeInputer
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/minxin.less";

.timecodeDiv {
  padding: 0.5em 0;
  margin-left: (16 / @baseSize);
}
.timecodeSpan {
  display: inline-block;
  cursor: pointer;
  margin-right: 5px;
  padding: 0.3em 1em;
  background-color: rgb(221, 221, 221);
  font-size: @fontSize24;
}
.timecodeSpan.checked {
  background-color: #48b319;
  color: #fff;
}
</style>

<style lang="less" scoped>
@import "../../style/minxin.less";

.form-info {
  padding-bottom: 100 / @baseSize;
  padding-top: 100 / @baseSize;
  background: #ffffff !important;
}

.img-t {
  width: 80 / @baseSize;
  height: 80 / @baseSize;
  display: block;
}

.btn-uploder {
  line-height: 80 / @baseSize;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  width: 300 / @baseSize;
  background: @green;
  margin-right: 40 / @baseSize;
  margin-top: 80 / @baseSize;
}

.cancel-btn {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  color: @white;
  text-align: center;
  line-height: 100 / @baseSize;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.posted-title {
  display: block;
  font-size: @fontSize30;
  color: @color42;
  line-height: 1.5rem;
  .mixin-padding(50 / @baseSize, 50 / @baseSize);
}

.x-textarea {
  font-size: @fontSize24;
}

.weui-label {
  font-size: @fontSize30;
}

.vux-popup-picker-placeholder {
  font-size: @fontSize30;
}

.form-info .vux-cell-box:before,
.form-info .weui-cell:before {
  left: 0;
}

.span-cell {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  margin-top: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
}

.span-cell span {
  border: 1px solid @green;
  border-radius: 4px;
  .mixin-padding(20 / @baseSize, 20 / @baseSize);
  font-size: @fontSize24;
  color: @color42;
  height: 50 / @baseSize;
  line-height: 52 / @baseSize;
  display: inline-block;
  float: left;
  margin-right: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
}

.scope,
.scope-data-box {
  border-bottom: 1px solid @colorDD;
}

.scope-title {
  padding-left: 30 / @baseSize;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: @fontSize30;
  color: @color42;
  margin-top: 15 / @baseSize;
}

.scope-title-box {
  border-bottom: 1px solid @colorDD;
}

.form-info .weui-cell:before {
  border-top: none;
}

.write-back {
  line-height: 90 / @baseSize;
  height: 90 / @baseSize;
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  position: relative;
}

.write-back-left {
  display: inline-block;
  position: absolute;
  line-height: 90 / @baseSize;
  height: 90 / @baseSize;
  left: 30 / @baseSize;
  font-size: @fontSize30;
}

.write-back-right {
  margin-left: 280 / @baseSize;
}

.write-back-item {
  border: 1px solid @color97;
  margin-left: 15 / @baseSize;
  height: 50 / @baseSize;
  display: inline-block;
  line-height: 52 / @baseSize;
  font-size: @fontSize24;
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  color: @color97;
  border-radius: 4px;
}

.write-back-selected,
.write-back-selected {
  background: url("../../assets/combined.png") no-repeat right bottom;
  background-size: 25 / @baseSize 24 / @baseSize;
  border-color: @green;
  color: @color42;
}

.accessory-box {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
}

.accessory-title {
  font-size: @fontSize30;
  color: @color42;
  margin-top: 15 / @baseSize;
}

.form-info .vux-label {
  font-size: @fontSize30;
}

.accessory-img {
  margin-top: 50 / @baseSize;
}

.weui-cell__ft,
.vux-cell-value {
  font-size: @fontSize28;
}

.photo-img,
.up-photo,
.photo-img li {
  float: left;
}

.photo-img li {
  margin-bottom: 20 / @baseSize;
}
.up-photo {
  margin-left: 20 / @baseSize;
}

.photo-img li {
  margin-right: 22 / @baseSize;
  position: relative;
}
.photo-img li:last-child {
  margin-right: 0;
}

.photo-img li,
.photo-img li img.imgud,
.up-photo img {
  width: 150 / @baseSize;
  height: 150 / @baseSize;
}

.photo-img li img.imgud,
.up-photo img {
  display: block;
}

.cancel {
  width: 50 / @baseSize;
  height: 50 / @baseSize;
  font-size: 50 / @baseSize;
  position: absolute;
  top: -25 / @baseSize;
  right: -25 / @baseSize;
  display: block;
}
</style>
