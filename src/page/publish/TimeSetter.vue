<template>
	<div class="timecodeDiv">
		<span
			v-for="(value, index) in timecodeArray"
			:class="{timecodeSpan: true , checked: (value=== timecodeValue)}"
			:key="index"
			@click="check(value)"
		>{{value}}</span>
	</div>
</template>
<script>
export default {
  data() {
    return {
      timecodeArray: [10, 20, 30, 40, 50, 60, '自定义'],
      timecodeValue: 30,
      timecodeInputer: 0
    };
  },
  mounted: function() {
    // alert(this.timecodeValue);
    this.$emit("check", { val: this.timecodeValue, ipt: this.timecodeInputer });
  },
  methods: {
    check(v) {
      this.timecodeInputer = v === '自定义' ? 1 : 0;
      this.timecodeValue = v;
      this.$emit("check", { val: v, ipt: this.timecodeInputer });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/minxin.less";

.timecodeDiv {
  padding: 0.5em 0;
  margin-left: (30 / @baseSize);
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
