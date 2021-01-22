<template>
  <div>
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="评价打分问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="$router.push('/qa_list_user?fresh=1')"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem">

      <div style="font-size: 1.2em;min-height: 2rem;word-break: break-word">
        {{detail.title}}
      </div>
      <div style="text-align: right;font-size: 1.2em;">
        <p>{{detail.pubName}}</p>
        <p>{{detail.pubTime}}</p>
      </div>

      <div style="font-size: 1.2em;" ></div>

      <div style="margin-top: 1rem">
        <img v-show="detail.hideFlag == 1" class="left-link" src="../../../assets/question/eye-hide.png"/>
        <p v-show="detail.hideFlag == 1" style="color: #48B319">本问卷为匿名问卷</p>
        <div style="text-align: center;padding: 1rem">
          <van-rate
            :size="25"
            :count="detail.limitParam"
            :disabled="detail.completeFlag == '1'"
            color="#48B319"
            void-color="#9B9B9B"
            disabled-color="#48B319"
            v-model="detail.thisValue"
          />
        </div>
        <!---->

        <!--<input type="hidden" name="title" v-model="titleValue">-->
      </div>

      <div class="tt-area" v-if="detail.tipsFlag" style="margin-top: 1rem">
        <p class="scope-title">{{detail.tipsInfo}}</p>
        <x-textarea
          style="border: 0.5px #D9D9D9 solid !important;"
          :max="200"
          class="x-textarea"
          placeholder=""
          :rows="2"
          v-model="detail.tipsValue"
          :readonly="detail.closeFlag == '1' || detail.completeFlag == '1' ? 'readonly':false"
        >
        </x-textarea>
        <!--<input type="hidden" name="title" v-model="titleValue">-->
      </div>




      <div v-if="detail.closeFlag==0 && detail.completeFlag != '1'">
        <van-button @click="submitData" class="right" style="margin-top: 2rem;width: 3rem;"  type="primary">提交</van-button>
      </div>

      <div style="text-align: center;" v-if="detail.closeFlag==1">
        <van-button style="margin-top: 2rem;width: 80%;background-color: #979797;border-color: #979797" disabled
                    type="primary">本问卷已截止
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
  import {XTextarea,Toast} from 'vux'
  import { RadioGroup, Radio,Field,Button,Cell, CellGroup,Icon,Rate,NavBar } from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../../config/api.js"
  export default {
    components: {
      XTextarea,
      Toast,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Rate.name]: Rate,
      [Icon.name]: Icon,
      [NavBar.name]: NavBar,

    },
    created: function () {},
    mounted(){
      this.loadData();
    },
    watch: {
      "$route": function (e) {
        if (e.path == '/ans-scoring') {
          this.loadData();
        }

      }
    },

    data () {
      return {
        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        value1:0,
        radio:'1',
        message:'',
        detail:{
          thisValue:0
        },

      }
    },

    computed: {},
    activated(){},

    methods: {
      loadData() {
        this.detail = {};
        this.id = this.$route.query.id;
        let _this = this;
        this.$http
          .get(apiRouter.GET_QUESTION_DETAIL + "?id=" + this.id)
          .then(response => {
            if (response.data.status == -1) {
              //_this.detail = response.data.data;
            } else {
              _this.detail = response.data.data;
              //_this.detail.thisValue = Number(_this.detail.thisValue);
              let optionList = _this.detail.optionList;
              for(let i=0;i<optionList.length;i++){
                if(optionList[i].optionSelected === true){
                  _this.radio = optionList[i].optionIndex;
                }
              }
              //this.detail = response.data.data;
            }
          }, error => {

          });
      },

      submitData() {
        let detail = this.detail;
        //
        let data = {
          id:detail.id,
          thisValue:detail.thisValue,
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
    margin-right: 14px;
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

  .tt-area .weui-cell:before{
    border-top-width: 0;
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
