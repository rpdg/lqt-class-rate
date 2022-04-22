<template>
  <div class="homework-tips clearfix">
    <div class="tips-content" style="text-indent: 0;">
      <p >【{{headData.NAME}} {{headData.TYPENAME}}】</p>
      <p style="margin-left: 8px;">{{headData.ADDDATE.substr(5,5).replace(/-/g,'/')}} {{timeCode}} {{headData.TITLE}} </p>
    </div>
    <span class="homework-deadline" style="text-align: right">{{headData.OUTDATE?new Date(headData.OUTDATE.replace(/-/g, '/')).format("yyyy-MM-dd"):''}}截止&nbsp;&nbsp;&nbsp;</span>
  </div>
</template>

<script type="es6">
import { formatDate } from "../../utils/TimeUtils";

export default {
  name: "first-header",

  props: {
    headData: {
      type: Object,
      default: {
        NAME: "",
        TYPENAME: "",
        TITLE: "",
        OUTDATE: "",
        FIN_OF_TIME: 0,
        name: 1
      }
    }
  },
  created() {
    // let OUTDATE = this.headData.OUTDATE;
    // new Date(OUTDATE).format("MM-dd")
  },
  mounted() {},
  watch: {},
  computed: {
    timeCode: function() {
      if (~~this.headData.FIN_OF_TIME) {
        return "(" + this.headData.FIN_OF_TIME + "')";
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      name: "test"
    };
  },

  methods: {}
};
</script>

<style lang="less" type="text/less" scoped>
@import "../../style/detail.less";

.lqt-container {
  top: 0;
  bottom: 45px;
}

.homework-container {
  /* height: 100%;*/
  overflow: hidden;
}

.homework-container .homework-list {
  /*width: 1000000000px;*/
  width: 100%;
  height: 100%;
  border-radius: 3px;
  margin-left: 0;
}

.homework-container .homework-list.active {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.homework-container .homework-list .it {
  display: block;
  position: relative;
  float: left;
  width: 100%;
  /*width: 750rem;*/
  height: 100%;
  min-height: 10px;
  overflow: hidden;
}

.homework-container .homework-list .scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.homework-container .homework-list .scroll-dom {
  margin-bottom: 120px;
  background: #fff;
}

.homework-container .homework-tips {
  padding-bottom: 5px;
  border-bottom: solid 1px #dedede;
}

.homework-container .homework-tips .tips-content {
  float: left;
  width: 70%;
  text-indent: 10px;
}

.homework-container .homework-tips .tips-content p:first-child {
  line-height: 30px;
  font-size: 16px;
}

.homework-container .homework-tips .tips-content p:last-child {
  line-height: 20px;
  font-size: 14px;
}

.homework-container .homework-tips .homework-deadline {
  float: left;
  width: 30%;
  line-height: 30px;
  font-size: 11px;
  color: #999;
}

.homework-container .homework-content {
  padding: 10px;
  font-size: 16px;
}

.homework-container .homework-content .homework-title {
  line-height: 23px;
}

.homework-container .homework-content .homework-answer {
  padding-bottom: 20px;
}

.homework-container .homework-content .homework-answer .answer {
  padding: 10px 0 10px 25px;
}

.homework-container .homework-content .homework-answer .answer label {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  tap-highlight-color: rgba(0, 0, 0, 0.05);
}

.homework-container .homework-content .homework-answer .answer .icon-common {
  float: left;
  margin-left: -25px;
}

.homework-container .homework-content .homework-answer .answer .answer-content {
  float: left;
  width: 100%;
  line-height: 23px;
}

.homework-container .homework-content .homework-answer .correct-answer {
  padding-top: 10px;
}

.homework-container .homework-content .homework-msg {
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 14px;
  color: #999;
}

.homework-container .homework-content .answer-right {
  color: #48b319;
}

.homework-container .homework-content .answer-wrong {
  color: #bb002b;
}

.homework-container .homework-answer {
  padding-bottom: 0;
}

.homework-container .answer-qs {
  margin-top: 10px;
}

.homework-container .qs-txt {
  position: relative;
  border: solid 1px #dedede;
  padding: 10px;
}

.homework-container .qs-txt textarea {
  position: absolute;
  top: 10px;
  right: auto;
  bottom: 10px;
  left: 10px;
  width: 93%;
  z-index: 2;
  font-size: 14px;
  color: #666;
  border: none;
  resize: none;
  outline: none;
  overflow: hidden;
}

.homework-container .qs-txt .qs-content {
  position: relative;
  z-index: 1;
  width: 100%;
  font-size: 14px;
  color: #666;
  min-height: 20px;
  max-height: 300px;
  margin-left: auto;
  margin-right: auto;
  line-height: 19px;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto;
  opacity: 0;
}

.homework-container .qs-img img {
  display: block;
  max-width: 100%;
}

.homework-container .qs-bar {
  border-top: solid 1px #dedede;
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  background: #fff;
}

.homework-container .qs-bar p {
  float: left;
  width: 50%;
  padding: 10px 0;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.homework-container .qs-bar .bar-btn {
  width: 34px;
  height: 34px;
  line-height: 34px;
  font-family: "icon";
  font-size: 26px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.homework-container .qs-bar .btn-img {
  float: right;
  margin-right: 23px;
  background: #ff8a65;
  background-image: url("/static/work/camera.png");
  background-size: cover;
}

.homework-container .qs-bar .btn-voice {
  float: left;
  margin-left: 22px;
  background: #2782d7;
  background-image: url("/static/work/voice.png");
  background-size: cover;
}

.homework-container .qs-answer {
  padding-top: 10px;
}

.homework-container .qs-voice-icon {
  font-family: "icon";
  font-size: 28px;
  padding-left: 13px;
}

.homework-container .recordtime {
  float: left;
  margin: 6px 0 0 10px;
  line-height: 44px;
  color: #999;
}

.homework-container .btn-play {
  float: left;
  position: relative;
  margin-top: 6px;
  line-height: 23px;
  padding: 8px 5px;
  font-size: 14px;
  color: #666;
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));
  /*background: gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));*/
  box-shadow: 0 0 1px 0 #fff inset;
  border: solid 1px #dedede;
  border-radius: 3px;
  max-width: 75%;
  min-width: 15%;
  width: 20%;
  -webkit-transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;
}

.homework-container .btn-play.active {
  border: solid 1px #48b319;
}

.homework-container .btn-play.active .arrow-up {
  background: #48b319;
}

.homework-bar {
  padding: 4px 0;
  background: #48b319;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  overflow: hidden;
}

.homework-bar .homework-btn {
  position: relative;
  z-index: 2;
  display: block;
  float: left;
  width: 50%;
  height: 37px;
  line-height: 37px;
  font-size: 16px;
  color: #fff;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.homework-bar .homework-pre,
.homework-bar .homework-submit {
  opacity: 0;
}

.homework-bar .homework-next,
.homework-bar .homework-submit {
  margin-left: -2px;
  border-left: solid 2px #fff;
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: auto;
}

.homework-bar .homework-next {
  z-index: 5;
}

.homework-bar .homework-submit {
  z-index: 2;
}

.homework-bar .icon-change,
.homework-bar .txt-change {
  float: left;
  text-align: center;
}

.homework-bar .icon-change {
  width: 30%;
}

.homework-bar .txt-change {
  width: 70%;
}

.homework-bar .txt-submit {
  display: block;
  width: 100%;
  text-align: center;
}

.homework-bar .icon-next {
  position: relative;
  top: 5px;
}

.homework-bar .pre-loc {
  width: 0;
  height: 1rem;
  position: absolute;
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  z-index: 1;
  opacity: 0.3;
  background: #fff;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

#complete .scroll-dom {
  margin-bottom: 66px;
}

#vote.lqt-container {
  top: 1rem;
}

.pic .i {
  float: left;
  width: 100%;
  margin-top: 5px;
  height: 95px;
}

.pic .i a {
  display: block;
}

.pic .i p {
  margin-right: 3px;
  background-position: center;
  background-size: cover;
}

.pic img {
  display: block;
}

.pic.two {
  margin-left: -2px;
}

.pic.two .i {
  width: 50%;
}

.pic.two a {
  height: 100%;
}

.pic.two p {
  height: 100%;
  margin: 0 3px 0 2px;
}

.pic.ninecell {
  margin-left: -2px;
}

.pic.ninecell .i {
  width: 33.333%;
  height: 95px;
}

.pic.ninecell a {
  height: 100%;
}

.pic.ninecell p {
  height: 100%;
  margin: 0 3px 0 2px;
}

/////////
.demo3-item {
  padding: 8px 5px;
  font-size: 0;
  display: block;
}

.demo3-item-default {
  background: url("../../assets/question/radio-on-new.png") no-repeat;
  background-size: contain;
  width: 0.9rem;
  height: 0.9rem;
  display: inline-block;
  vertical-align: bottom;
}

.demo3-item-selected .demo3-item-default {
  background-image: url("../../assets/question/radio-on.png");
}

.checkbox-item-default {
  background: url("../../assets/question/check-box-off.png") no-repeat;
  background-size: contain;
  width: 0.9rem;
  height: 0.9rem;
  display: inline-block;
  vertical-align: bottom;
}

.checkbox-item-selected .checkbox-item-default {
  background-image: url("../../assets/question/check-box-on.png");
}

.qa-input {
  border: 1px solid #979797;
  height: 2.2em;
  font-size: 14px;
  margin-top: 1em;
}

.icon-work-pre {
  background-image: url("/static/work/arrow-left-circle.png");
  background-size: cover;
}
.icon-work-next {
  background-image: url("/static/work/arrow-left-circle.png");
  background-size: cover;
}
</style>
