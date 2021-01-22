<template>
  <div class="" style="padding: 1rem">
    <div style="font-size: 1.2em;height: 5rem">
      本校2019年度校服购买统计，请选择是否需要购买校服。
    </div>
    <div style="text-align: right;font-size: 1.2em;">
      <p>总务处</p>
      <p>2018-12-27</p>
    </div>
    <div style="font-size: 1.2em;" >
      <van-radio-group v-model="radio">
        <van-radio style="line-height: 1rem" name="1">是</van-radio>
        <van-radio style="line-height: 1rem" name="2">否</van-radio>
      </van-radio-group>
    </div>
    <!--<div style="margin-top:1rem;font-size: 1.2em;">
      请填写手机号码
    </div>
    <div>
      <textarea>
        ssss
      </textarea>
    </div>
-->

    <div class="scope-title-box" style="margin-top: 1rem">
      <p class="scope-title">请填写手机号码</p>
      <x-textarea
        style="    border: 1px #B2B2B2 solid;"
        :max="200"
        @on-focus="onEvent('focus')"
        @on-blur="onEvent('blur')"
        class="x-textarea"
        placeholder=""
        :rows="2"
        v-model="titleValue"
      >
      </x-textarea>
      <!--<input type="hidden" name="title" v-model="titleValue">-->
    </div>


<div>
  <van-button class="right" style="margin-top: 2rem;width: 3rem;"  type="primary">提交</van-button>
</div>

<div>
  <van-button class="right" style="margin-top: 2rem;width: 5rem;background-color: #979797;border-color: #979797" disabled type="primary">本问卷已截止</van-button>
</div>





  </div>
</template>

<script>
  import {XTextarea} from 'vux'
  import { RadioGroup, Radio,Field,Button } from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../config/api.js"
  export default {
    created: function () {


    },
    components: {
      XTextarea,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,



    },
    data () {
      return {
        radio:'1',
        message:''
      }
    },

    computed: {

    },
    activated(){

    },


    mounted(){

    },

    methods: {


    }
  }
</script>
<style lang="less" scoped>
  @import '../../style/minxin.less';

  .scope-title-box {
    border-bottom: 1px solid @colorDD
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

  .x-textarea {
    font-size: @fontSize24;
  }

</style>
