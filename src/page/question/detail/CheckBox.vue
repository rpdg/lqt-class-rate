<template>
  <div>
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="多选及投票问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="$router.push('/qa_list_user?fresh=1')"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem">
      <div style="font-size: 1.2em;height: 5rem;;word-break: break-word">
        {{detail.title}}
      </div>
      <div style="text-align: right;font-size: 1.2em;">
        <p>{{detail.pubName}}</p>
        <p>{{detail.pubTime}}</p>
      </div>
      <div style="font-size: 1.2em;">
        <!-- <van-radio-group v-model="radio">
           <van-radio v-for="item in detail.optionList" style="line-height: 1rem" :name="item.optionIndex">{{item.optionContent}}</van-radio>
         </van-radio-group>-->
        <div class="box">
          <div style="padding-left: 5px;padding-bottom: 10px">
            <img v-show="detail.hideFlag == 1" class="left-link" style="margin-top: 2px;" src="../../../assets/question/eye-hide.png"/>
            <p v-show="detail.hideFlag == 1" style="color: #48B319;display: inline-block;">本问卷为匿名问卷</p>
            <p style="color: #ed9c28;display: inline-block;">（最多选{{detail.limitParam}}项）</p>

          </div>
          <checker v-model="demo3" :max="detail.limitParam" type="checkbox" default-item-class="demo3-item" selected-item-class="demo3-item-selected">
            <checker-item :disabled="detail.completeFlag == '1'" v-for="item in detail.optionList" :value="item.optionIndex">
              <span class="demo3-item-default"></span>
              <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.optionContent}}</span><br>
              <img   v-if="item.optionImgShowURL" style="max-width: 90%;margin-top: 5px" :src="roterPath+item.optionImgShowURL">
            </checker-item>
          </checker>
          <br>
        </div>


      </div>

      <div v-show="detail.tipsFlag" class="scope-title-box" style="margin-top: 1rem">
        <p class="scope-title">{{detail.tipsInfo}}</p>
        <x-textarea
          style="    border: 1px #B2B2B2 solid;"
          :max="200"
          :readonly="detail.closeFlag == '1' || detail.completeFlag == '1' ? 'readonly':false"
          class="x-textarea"
          placeholder=""
          :rows="2"
          v-model="detail.tipsValue"
        >
        </x-textarea>
      </div>

      <div v-if="detail.closeFlag==0 && detail.completeFlag != '1'">
        <van-button @click="submitData" :disabled="detail.completeFlag=='1'"  class="right" style="margin-top: 2rem;width: 3rem;" type="primary">提交</van-button>
      </div>
      <!--<van-button @click="submitData" class="right" style="margin-top: 2rem;width: 3rem;" type="primary">提交</van-button>-->

      <div v-if="detail.closeFlag==1">
        <van-button class="right" style="margin-top: 2rem;width: 5rem;background-color: #979797;border-color: #979797"
                    disabled type="primary">本问卷已截止
        </van-button>
      </div>
      <div v-else-if="detail.completeFlag == '1'">
        <van-button class="right" style="margin-top: 2rem;width: 5rem;background-color: #979797;border-color: #979797"
                    disabled type="primary">本问卷已提交
        </van-button>
      </div>


      <toast
        v-model="showPositionValue"
        type="text"
        :time="800"
        is-show-mask
        :position="position"
      >
        {{toastMessage}}
      </toast>

    </div>
  </div>
</template>

<script>
  import {XTextarea,Toast, Checker, CheckerItem} from 'vux';
  import {RadioGroup, Radio, Field, Button,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../../config/api.js"

  export default {
    components: {
      XTextarea,
      Toast,
      Checker,
      CheckerItem,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [NavBar.name]: NavBar,
    },
    created: function () {

    },
    mounted(){
      this.loadData();
    },


    watch: {
      // "$route": function (e) {
      //   if (e.path == '/ans-radio') {
      //     this.loadData();
      //   }
      //
      // }
    },

    data() {
      return {
        roterPath:'',
        demo3: [],

        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        ddd:"",
        radio: '',
        message: '',
        detail:{},
      }
    },

    computed: {},

    activated() {
      this.loadData();
    },

    methods: {
      loadData() {
        this.detail = {};
        this.demo3 = [];

        this.id = this.$route.query.id;
        //'A10049';
        //
        let _this = this;
        this.$http
          .get(apiRouter.GET_QUESTION_DETAIL + "?id=" + this.id)
          .then(response => {
            if (response.data.status == -1) {
              //_this.detail = response.data.data;
            } else {
              _this.detail = response.data.data;
              let optionList = _this.detail.optionList;
              _this.roterPath  = _this.detail.PIC_PATH;



              let valList = _this.detail.thisValue.split(",");
              for(let i =0;i<valList.length;i++){
                if(valList[i] && valList[i] != ''){
                  valList[i] = Number(valList[i]);
                }
              }
              if(valList && valList != ''){
                _this.demo3 = valList;
              }

              // for(let i=0;i<optionList.length;i++){
              //   if(optionList[i].optionSelected === true){
              //     _this.demo3 = optionList[i].optionIndex;
              //   }
              // }
              //this.detail = response.data.data;
            }
          }, error => {

          });
      },
      submitData() {
        let detail = this.detail;
        let data = {
          id:detail.id,
          thisValue:JSON.stringify(this.demo3),
          tipsValue:detail.tipsValue
        }
        let _this = this;

        this.$http
          .post(apiRouter.POST_QUESTION_SUBMIT,data)
          .then(response => {
            if (response.data.status == 200) {
              _this.toastMessage = response.data.message
              _this.showPositionValue = true
              setTimeout(function () {
                _this.$router.push({path: 'qa_list_user'})
              },1000)
            } else {
              _this.toastMessage = response.data.message
              _this.showPositionValue = true
            }
          }, error => {

          });
      },

    }
  }
</script>
<style lang="less" scoped>
  @import '../../../style/minxin.less';

  .left-link{
    height: 40/@baseSize;
    vertical-align: top;
    float: left;
    margin-right: 8px;
  }

  .scope-title-box {
    //border-bottom: 1px solid @colorDD
  }

  .scope-title-box /deep/ .weui-cell:before{
    border-width: 0;
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



  .box {
    padding: 0 15px;
  }

  .demo1-item {
    border: 1px solid #ececec;
    padding: 5px 15px;

  }
  .demo1-item-selected {
    border: 1px solid green;
  }
  .demo2-item {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
    display: inline-block;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
  }
  .demo2-item-selected {
    border-color: green;
  }

  .demo3-item {
    padding: 8px 5px;
    font-size: 0;
    display: block;
  }

  .demo3-item-default{
    background: url('../../../assets/question/check-box-off.png') no-repeat;
    background-size: contain;
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    vertical-align: bottom;
  }

  .demo3-item-selected .demo3-item-default{
    background-image: url('../../../assets/question/check-box-on.png');
  }





  .demo4-item {
    background-color: #ddd;
    color: #222;
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 18px;
    border-radius: 15px;
  }
  .demo4-item-selected {
    background-color: #FF3B3B;
    color: #fff;
  }
  .demo4-item-disabled {
    color: #999;
  }
  .demo5-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
  }
  .demo5-item-selected {
    background: #ffffff url(../../../assets/question/switch-on.png) no-repeat right bottom;
    border-color: #ff4a00;
  }

  .title-return-top {
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
