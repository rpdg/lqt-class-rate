<template>
  <div style="word-break: break-word">
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="评价打分问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="$router.push('/qa_list_up?fresh=1')"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem">

      <div style="font-size: 1.2em;height: 4rem;word-break: break-word">
        {{detail.title}}
      </div>
      <div style="text-align: right;font-size: 1.2em;">
        <p>{{detail.pubName}}</p>
        <p>{{detail.pubTime}}</p>
      </div>
      <div style="font-size: 1.2em;">
        <div style="margin-bottom: 3px">
          <div style="border-left: #48B319 3px solid;padding-left: 1em;margin-bottom: 1em">打分统计</div>
        </div>
        <div style="font-size: 14px;color: #494949;padding-bottom: 1em;">
          <div class="flex-demo" style="display: inline-block">总参与人数:{{detail.scoreUserCount}}</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="flex-demo" style="display: inline-block">平均分:{{detail.acoreAvg}}</div>
        </div>
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
    <div style="border-bottom: #D8D8D8 1px solid"></div>
    <div>
      <div style="padding: 1em 1rem" v-if="undoListShow && detail.undoList.length > 0">
        <div>
          <img style="height: 1em;vertical-align: text-top;" src="@/assets/question/warring.png"/>
          未完成问卷人员：
        </div>
        <div>
          <span v-for="item in detail.undoList">{{item}}</span>
        </div>
      </div>
      <div v-if="!undoListShow">
        <div v-for="(op,index) in detail.userList">
          <div :class="index%2==0?'':'single-row'" style="padding:0.5em 1em">
            <flexbox>
            <flexbox-item :span="7/20">
              <div class="flex-demo">{{ op.hideFlag == '1'?'匿名':op.userName }}</div>
            </flexbox-item>
            <flexbox-item :span="13/20">
              <div class="flex-demo">
                 <van-rate
                   v-model="op.userValue"
                   :size="18"
                   :count="5"
                   color="#48B319"
                   void-color="#9B9B9B"
                   disabled="true"
                   disabled-color="#48B319"
                 />
              </div>
            </flexbox-item>
          </flexbox>

             <flexbox>
            <flexbox-item :span="7/20">
            </flexbox-item>
            <flexbox-item :span="13/20">
              <div class="flex-demo" style="padding-left: 3px;">
                  {{op.tipsValue}}
              </div>
            </flexbox-item>
          </flexbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {XTextarea, Toast,Flexbox,FlexboxItem} from 'vux'
  import {RadioGroup, Radio, Field, Button, Cell, CellGroup, Icon, Rate,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import axios from 'axios'
  import apiRouter from "../../../config/api.js"

  export default {
    components: {
      XTextarea,
      Toast,
      Flexbox,
      FlexboxItem,
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
    created: function () {
    },
    mounted() {
      this.loadData();
    },

    activated() {
      this.loadData();
    },

    data() {
      return {
        undoListShow: false,
        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        value1: 0,
        radio: '1',
        message: '',
        detail: {},

      }
    },

    computed: {},


    methods: {
      loadData() {
        this.detail = {};
        this.id = this.$route.query.id;
        let _this = this;
        this.$http
          .get(apiRouter.GET_QUESTION_TOTAL_INFO + "?id=" + this.id)
          .then(response => {
            if (response.data.status == -1) {
              //_this.detail = response.data.data;
            } else {
              _this.detail = response.data.data;
              let optionList = _this.detail.optionList;
              /*for(let i=0;i<optionList.length;i++){
                if(optionList[i].optionSelected === true){
                  _this.radio = optionList[i].optionIndex;
                }
              }*/
              //this.detail = response.data.data;
            }
          }, error => {

          });
      },

      submitData() {
        let detail = this.detail;
        //
        let data = {
          id: detail.id,
          thisValue: detail.thisValue,
          tipsValue: detail.tipsValue
        }

      },
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../style/minxin.less';

  .single-row{
    background-color:  #F4F9EE
  }
  .left-link {
    height: 40/@baseSize;
    vertical-align: top;
    float: left;
    margin-right: 14px;
  }

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

  .flex-demo /deep/ .weui-progress__inner-bar {
    background-color: #979797;
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
