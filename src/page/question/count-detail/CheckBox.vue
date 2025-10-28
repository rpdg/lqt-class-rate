<template>
  <div style="word-break: break-word">
    <!-- 返回组件 -->
    <van-nav-bar
      class="title-return-top"
      title="多选及投票问卷"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="goNewList"
    />
    <div class="" style="margin-top: 1rem;padding: 1rem;padding-bottom: 0">
      <div style="font-size: 1.2em;height: 5rem;word-break: break-word">
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

        <div v-for="item in detail.optionList" style="line-height: 1rem;margin-bottom: 1em">
          <div style="margin-bottom: 3px">
            <div>
              <span style="word-break: break-word;border-left: #48B319 3px solid;padding-left: 8px">{{item.optionContent}}</span>
            </div>
          </div>
          <div style="font-size: 14px;color: #494949">
            <flexbox :gutter="0">
              <flexbox-item :span="1/5">
                <div class="flex-demo">总数:{{item.selNumber}}</div>
              </flexbox-item>
              <flexbox-item :span="3/5">
                <div class="flex-demo">
                  <box gap="10px" style="width:63%;display: inline-block;vertical-align: middle;">
                    <x-progress :percent="Number(item.selPoint)" :show-cancel="false"></x-progress>
                  </box>
                  <span style="width: 34%; padding-left: 5px;">{{ item.selPoint }}%</span>
                </div>
              </flexbox-item>
              <flexbox-item :span="1/5">
                <div class="flex-demo" style="font-size: 12px;text-align: right" @click="showDetail(item)">{{item.frontShow?item.frontShow:'查看详情'}}</div>
              </flexbox-item>
            </flexbox>
            <!--
            <div>

              >
            </div-->

          </div>
          <div v-if="!undoListShow && item.showRow">
            <div v-for="(op,index) in currentOption" style="font-size: 12px">
              <div :class="index%2==0?'':'single-row'" style="padding:0.5em 1em">
                <flexbox>
                  <flexbox-item :span="3/10">
                    <div class="flex-demo">{{ op.hideFlag == '1'?'匿名':op.userName }}</div>
                  </flexbox-item>
                  <flexbox-item :span="7/10">
                    <div class="flex-demo">
                      {{op.userValue}}&nbsp;&nbsp;{{op.tipsValue}}
                    </div>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </div>
        </div>

        <div v-if="undoListShow && detail.undoList && detail.undoList.length > 0">
          <div>
            <img style="height: 1em;vertical-align: text-top;" src="@/assets/question/warring.png"/>
            未完成问卷人员：
          </div>
          <div>
            {{detail.undoList}}
            <!--<span v-for="item in detail.undoList">{{item}}</span>-->
          </div>
        </div>

        <!--<div v-if="!undoListShow">-->
        <!--<div>-->
        <!--<span v-for="op in currentOption">-->
        <!--{{op.hideFlag == '1'?'匿名':op.userName }}&nbsp;&nbsp;&nbsp;{{op.userValue}}&nbsp;&nbsp;{{op.tipsValue}}-->
        <!--</span>-->
        <!--</div>-->
        <!--</div>-->



        <div>

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

  </div>

</template>

<script>
  import {XTextarea, Toast, Flexbox, FlexboxItem,XProgress,Box} from 'vux'
  import {Field, Button, Slider, Icon,NavBar} from 'vant';
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
      XProgress,
      Box,
      [Field.name]: Field,
      [Button.name]: Button,
      [Slider.name]: Slider,
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
        undoListShow: true,
        currentOption: [],
        showPositionValue: false,
        showToast: true,
        position: 'default',
        toastMessage: '',

        ddd: "",
        radio: '',
        message: '',
        detail: {},
        aaa: {
          "code": 1,
          "status": 200,
          "message": "问卷详情加载成功。",
          "data":
            {
              "id": "nD_CP_AuNeJ4rcRdrDZ9Pg",
              "title": "Jerry新建的多选问卷",
              "content": "",
              "limitParam": 1,
              "imgShowURL": "",
              "imgURL": "",
              "pubTime": "2019-01-16",
              "pubName": "羊羊",
              "openTime": "2019-01-16",
              "hideFlag": 0,
              "closeFlag": 0,
              "tipsFlag": true,
              "tipsRequire": false,
              "tipsInfo": "电话号码多少？",
              "tipsValue": "",
              "optionList": [
                {
                  "optionId": "A10010",
                  "optionContent": "1+1=？",
                  "optionIndex": 1,
                  "optionImgShowURL": "",
                  "optionImgURL": "",
                  "optionSelected": false
                },
                {
                  "optionId": "A10011",
                  "optionContent": "1-1=？",
                  "optionIndex": 2,
                  "optionImgShowURL": "",
                  "optionImgURL": "",
                  "optionSelected": false
                }]
            }
        }

      }
    },

    computed: {},



    methods: {
      goNewList(){
			  window.location.href = '/weixin/wechat/v2/index.html#/questionnaireManage'
		  } ,
      // showDetail(item) {
      //   this.undoListShow = false;
      //   this.currentOption = item.userList;
      // },
      showDetail(item) {
        let optionList = this.detail.optionList;
        for(let i = 0;i<optionList.length;i++){
          if(optionList[i].optionId == item.optionId){
            if(item.showRow == true){
              this.undoListShow  = true;
              //this.currentOption = item.userList;
              item.showRow = false;
              item.frontShow = '查看详情';
            }else{
              this.undoListShow  = false;
              this.currentOption = item.userList;
              item.showRow = true;
              item.frontShow = '收起详情';
            }

          }else{
            //this.undoListShow  = true;
            optionList[i].showRow = false;
            optionList[i].frontShow = '查看详情';
          }
        }
        // debugger;
        // if(this.undoListShow){
        //   this.undoListShow  = false;
        //   this.currentOption = item.userList;
        //   item.showRow = true;
        //   item.frontShow = '收起详情';
        // }else{
        //   this.undoListShow  = true;
        //   item.showRow = false;
        //   item.frontShow = '查看详情';
        // }
      },
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
              for (let i = 0; i < optionList.length; i++) {
                if (optionList[i].optionSelected === true) {
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
        let data = {
          id: detail.id,
          thisValue: this.radio,
          tipsValue: detail.tipsValue
        }
        let _this = this;

        this.$http
          .post(apiRouter.POST_QUESTION_SUBMIT, data)
          .then(response => {
            if (response.data.status == 200) {
              _this.toastMessage = response.data.message
              _this.showPositionValue = true
              setTimeout(function () {
                _this.$router.push({path: 'qa_list_user'})
              }, 1000)
            } else {
              debugger;
            }
          }, error => {

          });
      },

    }
  }
</script>
<style lang="less" scoped>
  @import '../../../style/minxin.less';

  .single-row{
    background-color:  #F4F9EE
  }
  .scope-title-box {
    border-bottom: 1px solid @colorDD
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

  .x-textarea {
    font-size: @fontSize24;
  }

  .flex-demo /deep/ .weui-progress__inner-bar{
    background-color: #979797;
  }

  .title-return-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }

</style>
