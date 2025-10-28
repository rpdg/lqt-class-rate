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
  margin-left: (8px);
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
  padding-bottom: 50px;
  padding-top: 50px;
  background: #ffffff !important;
}

.img-t {
  width: 40px;
  height: 40px;
  display: block;
}

.btn-uploder {
  line-height: 40px;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  width: 150px;
  background: @green;
  margin-right: 20px;
  margin-top: 40px;
}

.cancel-btn {
  width: 100%;
  height: 50px;
  font-size: @fontSize36;
  color: @white;
  text-align: center;
  line-height: 50px;
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
  .mixin-padding(25px, 25px);
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
  .mixin-padding(15px, 15px);
  margin-top: 10px;
  margin-bottom: 10px;
}

.span-cell span {
  border: 1px solid @green;
  border-radius: 4px;
  .mixin-padding(10px, 10px);
  font-size: @fontSize24;
  color: @color42;
  height: 25px;
  line-height: 26px;
  display: inline-block;
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
}

.scope,
.scope-data-box {
  border-bottom: 1px solid @colorDD;
}

.scope-title {
  padding-left: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: @fontSize30;
  color: @color42;
  margin-top: 8px;
}

.scope-title-box {
  border-bottom: 1px solid @colorDD;
}

.form-info .weui-cell:before {
  border-top: none;
}

.write-back {
  line-height: 45px;
  height: 45px;
  .mixin-padding(15px, 15px);
  position: relative;
}

.write-back-left {
  display: inline-block;
  position: absolute;
  line-height: 45px;
  height: 45px;
  left: 15px;
  font-size: @fontSize30;
}

.write-back-right {
  margin-left: 140px;
}

.write-back-item {
  border: 1px solid @color97;
  margin-left: 8px;
  height: 25px;
  display: inline-block;
  line-height: 26px;
  font-size: @fontSize24;
  .mixin-padding(15px, 15px);
  color: @color97;
  border-radius: 4px;
}

.write-back-selected,
.write-back-selected {
  background: url("../../assets/combined.png") no-repeat right bottom;
  background-size: 13px 12px;
  border-color: @green;
  color: @color42;
}

.accessory-box {
  .mixin-padding(15px, 15px);
}

.accessory-title {
  font-size: @fontSize30;
  color: @color42;
  margin-top: 8px;
}

.form-info .vux-label {
  font-size: @fontSize30;
}

.accessory-img {
  margin-top: 25px;
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
  margin-bottom: 10px;
}
.up-photo {
  margin-left: 10px;
}

.photo-img li {
  margin-right: 11px;
  position: relative;
}
.photo-img li:last-child {
  margin-right: 0;
}

.photo-img li,
.photo-img li img.imgud,
.up-photo img {
  width: 75px;
  height: 75px;
}

.photo-img li img.imgud,
.up-photo img {
  display: block;
}

.cancel {
  width: 25px;
  height: 25px;
  font-size: 25px;
  position: absolute;
  top: -13px;
  right: -13px;
  display: block;
}
</style>
