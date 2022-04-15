<template>
  <div>
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack()">作业详情
    </x-header>

    <div id="homework-container"  class="lqt-container lqt-wrapper" style="top: 1em">
      <div class="homework-container" id="headerBox">
        <ul  class="homework-list clearfix header-banner" id="bannerBox" style="padding: 1em">
          <li v-for="(detail,index) in quesList" v-show="currentWork == index" class="it banner-sheet"
              data-type="checkbox">
            <first-header v-show="currentWork == 0" :headData="workObj"></first-header>

            <!-- 问答题 或 自定义 -->
            <div v-if="detail.QUESTYPE == '3' || detail.QUESTYPE == '4'">
              <div class="homework-content">
                <p v-if=" detail.QUESTYPE != '4' " class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】</p>
                <p v-if="quesList.length>1 && detail.QUESTYPE == '4'">{{detail.QUESNO}}.</p>
                <div class="sub-content" v-html="detail.CONTENT"></div>
                <!--老师的图片-->
                <div class="teacher-img-list">
                  <p v-for="(tDetail,tIndex) in detail.IMGLIST"
                     @click="previewImage(picRootPath+tDetail.URL,detail.IMGLIST)"
                     :style='{ backgroundImage:"url(" + picRootPath+tDetail.URL + ")" , backgroundSize:"cover"}'></p>

                </div>

                <divider><x-icon type="ios-arrow-down" size="30"></x-icon></divider>
                <div style="font-size: 14px;text-align: center;color: #FAC030;" >提示：已上传图片和已录制语音，可长按删除</div>


                <div v-if="detail.sWebImgList" class="answer-qs other-ans-img">
                  <div v-for="(vDetail,vIndex) in detail.sWebImgList">
                    <img style="max-width: 100%" :src="picRootPath+vDetail.sUrl"/>
                  </div>
                </div>


<!--                <div class="answer-qs other-ans-img">-->
<!--                  <div >-->
<!--                    <a style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+'/weixin/wechat/fileview/go_page.jsp?filePath='">测试文件111.txt</a>-->
<!--                    <span style="color: red;font-size: 14px">&nbsp;&nbsp;<icon style="color: red" type="clear"></icon></span>-->
<!--                  </div>-->
<!--                </div>-->

                <div v-if="detail.sWebFileList" class="answer-qs other-ans-img">
                  <div v-for="(vDetail,vIndex) in detail.sWebFileList">
                    <a v-if="vDetail.sUrl.indexOf('.pdf') > 0" style="text-decoration: underline;color: yellowgreen;" :href="'/common/fileview/go_page.jsp?filePath='+vDetail.sUrl">{{vDetail.sName}}</a>
                    <a v-else-if="vDetail.sUrl.indexOf('.doc') > 0 || vDetail.sUrl.indexOf('.xls') > 0 || vDetail.sUrl.indexOf('.ppt') > 0" style="text-decoration: underline;color: yellowgreen;" :href="'https://view.officeapps.live.com/op/view.aspx?src='+picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>
                    <a v-else style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>

                    <!--<a style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+'/weixin/wechat/fileview/go_page.jsp?filePath='+vDetail.sUrl+'&fileName='+vDetail.sName">{{vDetail.sName}}</a>-->
                  </div>
                </div>

                <div class="answer-qs other-ans-img">
                  <div v-for="(vDetail,vIndex) in detail.imgList">
                    <div style="position: relative"  v-if="vDetail.ANSWER">
                      <img :src="vDetail.localData || vDetail.URL"/>
                      <div @touchstart="gotouchstart('img',detail.imgList,vIndex)"
                        @touchmove="gotouchmove()"
                        @touchend="gotouchend('img',detail.imgList,vIndex)"
                        style="background-color: red;position: absolute;
                      top: 0;width: 100%;height: 100%;opacity: 0;"></div>
                    </div>


                    <div style="position: relative" v-else>
                      <img :src=" vDetail.SHOW_URL "/>
                      <div @touchstart="gotouchstart('img',detail.imgList,vIndex)"
                        @touchmove="gotouchmove()"
                        @touchend="gotouchend('img',detail.imgList,vIndex)"
                        style="background-color: red;position: absolute;
                      top: 0;width: 100%;height: 100%;opacity: 0;"></div>
                    </div>


<!--                    <p v-else class="img-local" :style='{backgroundImage:"url("+vDetail.localData+")"}'-->
<!--                       @touchstart="gotouchstart('img',detail.imgList,vIndex)"-->
<!--                       @touchmove="gotouchmove()"-->
<!--                       @touchend="gotouchend('img',detail.imgList,vIndex)" ></p>-->

                    <!--<img v-else />-->
                  </div>
                </div>

                <div class="answer-qs other-ans-voice">
                  <div :tabindex="vIndex" :class="detail.ID" v-for="(vDetail,vIndex) in detail.voiceList">
                    <div v-if="vDetail.ANSWER" style="position: relative;margin-top: 2px">
                      <p class="voice-play"
                         @touchstart="gotouchstart('voice1',detail.voiceList,vIndex)"
                         @touchmove="gotouchmove()"
                         @touchend="gotouchend('voice1',detail.voiceList,vIndex)"
                         :style="'height: 2em;border-radius: 5px;width: '+ (Number(vDetail.AUDIO_TIME)/20 <1 ?1:Number(vDetail.AUDIO_TIME)/20) *5 +'em;' "
                      >
                        <span class="voice-ready"></span>
                      </p>
                      <span style="line-height: 2em;vertical-align: top;">{{vDetail.AUDIO_TIME}}''</span>

<!--                      <img-->
<!--                           @touchstart="gotouchstart('voice1',detail.voiceList,vIndex)" @touchmove="gotouchmove()"-->
<!--                           @touchend="gotouchend('voice1',detail.voiceList,vIndex)"-->
<!--                           :style="'height: 2em;border-radius: 5px;width: '+ (Number(vDetail.AUDIO_TIME)/20 <1 ?1:Number(vDetail.AUDIO_TIME)/20) *5 +'em;' "-->
<!--                           src="@/assets/work/rectangle.png"/>-->
<!--                      <img style="height: 1em;line-height: 2em;left: 6px;position: absolute;top: 0.5em;"-->
<!--                           src="@/assets/work/airplay.png"/><span-->
<!--                      style="vertical-align: top; line-height: 2em;">{{vDetail.AUDIO_TIME}}''</span>-->
                    </div>
                    <div v-else>
                        <p class="voice-play"
                           @touchstart="gotouchstart('voice',detail.voiceList,vIndex)"
                           @touchmove="gotouchmove()"
                           @touchend="gotouchend('voice',detail.voiceList,vIndex)"
                           :style="'height: 2em;border-radius: 5px;width: '+ (Number(vDetail.second)/20 <1 ?1:Number(vDetail.second)/20) *5 +'em;' "
                        >
                          <span class="voice-ready"></span>
                        </p>
                        <span>{{vDetail.second}}''</span>
<!--                      <img @touchstart="gotouchstart('voice',detail.voiceList,vIndex)" @touchmove="gotouchmove()"-->
<!--                           @touchend="gotouchend('voice',detail.voiceList,vIndex)"-->
<!--                           :style="'height: 2em;border-radius: 5px;width: '+ (Number(vDetail.second)/20 <1 ?1:Number(vDetail.second)/20) *5 +'em;' "-->
<!--                           src="@/assets/work/rectangle.png"/>-->
<!--                      <img style="height: 1em;line-height: 2em;left: 6px;position: absolute;top: 0.5em;"-->
<!--                           src="@/assets/work/airplay.png"/><span-->
<!--                      style="vertical-align: top; line-height: 2em;">{{vDetail.second}}''</span>-->
                    </div>
                  </div>
                  <!--<div class="qs-content" contenteditable="true"></div>-->
                </div>

                <ul class="homework-answer">
                  <li class="answer-qs qs-txt" style="padding: 0;">
                    <!--                        <textarea class="qs-data" rows="6" cols="20" name="content"></textarea>-->
                    <!--                        class="x-textarea"-->
                    <x-textarea class="answer-textarea" @on-blur="textareaFocusout()"  :max="200" placeholder="" :rows="3" v-model="detail.answer"></x-textarea>
                  </li>
                </ul>
              </div>
              <!-- 传图，录音，两个按钮 -->
              <div class="qs-bar clearfix">
                <p><span class="bar-btn btn-img" v-on:click="handleChooseImage(detail)"></span></p>
                <p><span class="bar-btn btn-voice" @touchstart.prevent="startVoice(detail)" @touchend.prevent="endVoice(detail)"></span></p>
              </div>
            </div>
            <!-- 问答题end -->

            <!-- 单选 -->
            <div v-if="detail.QUESTYPE == '1' ">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <div>
                  <img @click="previewImage(picRootPath+dItem.URL,detail.PICLIST)" v-for="dItem in detail.PICLIST" width="49%" :src="picRootPath+dItem.URL">
                </div>

                <checker style="margin-top: 10px;margin-left: -5px;" radio-required v-model="detail.answer"
                         default-item-class="demo3-item" selected-item-class="demo3-item-selected">
                  <div v-for="item in detail.OPTIONLIST" >
                    <checker-item :key="item.ID" :value="item.ORDERNO">
                      <span class="demo3-item-default"></span>
                      <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>
                    </checker-item>
                    <div>
                      <img @click="previewImage(picRootPath+subDItem.URL,item.PICLIST)" v-for="subDItem in item.PICLIST" style="max-height: 200px" :src="picRootPath+subDItem.URL">
                    </div>
                  </div>

                </checker>
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 单选end -->

            <!-- 多选 -->
            <div v-if="detail.QUESTYPE == '2' ">
              <!-- id：题目id -->
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <div>
                  <img @click="previewImage(picRootPath+dItem.URL,detail.PICLIST)" v-for="dItem in detail.PICLIST" width="49%" :src="picRootPath+dItem.URL">
                </div>
                <checker style="margin-top: 10px;margin-left: -5px;" v-model="detail.answer" type="checkbox"
                         default-item-class="demo3-item" selected-item-class="checkbox-item-selected">
                  <div v-for="item in detail.OPTIONLIST" >
                    <checker-item :key="item.ID" :value="item.ORDERNO">
                      <span class="checkbox-item-default"></span>
                      <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>
                    </checker-item>
                    <div>
                      <img @click="previewImage(picRootPath+subDItem.URL,item.PICLIST)" v-for="subDItem in item.PICLIST" style="max-height: 200px" :src="picRootPath+subDItem.URL">
                    </div>
                  </div>



                </checker>
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 多选end -->

            <!-- 判断 -->
            <div v-if="detail.QUESTYPE == '5'">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <checker style="margin-top: 16px;margin-left: -5px;" v-model="detail.answer"
                         default-item-class="demo3-item" selected-item-class="demo3-item-selected">
                  <checker-item key="1" value="true">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">对</span><br>
                  </checker-item>
                  <checker-item key="2" value="false">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">错</span><br>
                  </checker-item>
                </checker>
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 判断end -->

            <!-- 填空   -->
            <div v-if="detail.QUESTYPE == '6'">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <div v-for="(sItem,sIndex) in detail.sAnswerList">
                  <input  @blur="textareaFocusout()"  class="qa-input" v-model.trim="detail.sAnswerList[sIndex]" :placeholder="  '('+(sIndex+1)+')'"/><br>
                </div>
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 填空end -->
          </li>
        </ul>
      </div>

      <div class="homework-bar clearfix" id="bar">
        <a id="pre" @click="preWork" class="homework-btn homework-pre clearfix" href="javascript:void(0)"
           style="opacity: 1; z-index: 5;">
          <em class="icon-change icon-pre" style="height: 28px;">
            <span v-show="currentWork>0" class="icon-work-pre" style="width: 1.1em;height: 1em;display: block;"></span>
          </em>
          <span v-show="currentWork>0" class="txt-change">上一题</span>
        </a>
        <a id="next" @click="nextWork" v-if="currentWork+1 < quesList.length"
           class="homework-btn homework-next clearfix" href="javascript:void(0)" style="opacity: 1; z-index: 5;">
          <span class="txt-change">下一题 &nbsp;&nbsp;({{currentWork+1}}/{{quesList.length}})</span>
          <em class="icon-change icon-next" style="height: 28px;">
            <span class="icon-work-next" style="width: 1.1em;height: 1em;display: block;margin-top: 6px;"></span>
          </em>
        </a>
        <span v-else class="homework-btn homework-submit clearfix"
              style="opacity: 1; z-index: 10;">
          <span @click="submitWork" class="txt-submit">提交作业</span>
        </span>
        <span class="pre-loc" :style=" 'height: 100%;width:' + progress +'%'"></span>
      </div>
    </div>

    <div v-show="showRecording" id="recording">
      <!--      <span></span>-->
      <div style="color: white">还可录:{{voiceSecond}}''</div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showSubmit"
               :title="'确认是否提交？'"
               @on-cancel="onWorkCancel"
               @on-confirm="onWorkSubmit"
      >
        <!--<p style="text-align:center;">{{ 'Are you sure?'}}</p>-->
      </confirm>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showDelVoice"
               :title="'确认删除该录音？'"
               @on-cancel="onVoiceCancel"
               @on-confirm="onVoiceDelete"
      >
      </confirm>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showDelImg"
               :title="'确认删除该图片？'"
               @on-cancel="onImgCancel"
               @on-confirm="onImgDelete"
      >
      </confirm>
    </div>

  </div>
</template>

<script type="es6">
  import {
    XTextarea, Toast, Checker, CheckerItem, Group,
    XInput, Confirm,Divider, XHeader,Loading,
    Icon,
    TransferDomDirective as TransferDom
  } from 'vux';
  import apiRouter from "../../config/api.js";

  import wx from "weixin-js-sdk";
  import FirstHeader from './FirstHeader.vue';
  import axios from 'axios';

  import {formatDate} from "../../utils/TimeUtils";

async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/jpeg" });
}

  export default {
    directives: {
      TransferDom
    },
    components: {
      XTextarea,
      Toast,
      Checker,
      CheckerItem,
      Group,
      XInput,
      Confirm,
      Divider,
      XHeader,
      Loading,
      Icon,
      [FirstHeader.name]: FirstHeader,

    },
    created() {
      //debugger;
    },
    mounted() {
      //this.pushHistory();
      // if(window.history.length==1){//判断是第一次从微信菜单进入页面
      //   //写入空白历史记录
      //
      //
      //
      // }
      let _this = this;
      //延时监听
      // setTimeout(function () {
      //   //监听物理返回按钮
      //   window.addEventListener("popstate", function(e) {
      //     console.log("111")
      //     _this.pushHistory();
      //     //pushHistory();
      //     // layer.open({
      //     //   content: '您确定要返回微信吗？',
      //     //
      //     //   btn: ['确认', '再逛逛'],
      //     //   shadeClose: false,
      //     //
      //     //   yes: function(){
      //     //     //调用微信浏览器私有API关闭浏览器
      //     //     WeixinJSBridge.call('closeWindow');
      //     //   }, no: function(){
      //     //     //点击【再逛逛】，再次写入空白历史记录
      //     //     pushHistory();
      //     //   }
      //     // });
      //   }, false);
      //
      // }, 300);

          //this.loadData();
      this.urlPath = window.location.href.split("#")[0];
      this.getUrlConfigTrue()
      //this.getUrlConfig();
    },

    computed: {},
    watch: {
      currentWork(val) {
        this.progress = ((val + 1) / this.quesList.length) * 100;
      },
      quesList: {
        handler(newVal,val) {
          let flag = Object.keys(val).length == 0
          if(flag){
            this.editFlag = false;
          }else{
            this.editFlag = true;
          }
        },
        deep: true
      },
      "$route": function (e) {
        // if (e.path == '/schedule-detail') {
        //   this.loadData();
        // }
      }
    },
    activated() {
      this.currentWork = 0;
      this.quesList = {};
      this.loadData();
    },
    updated() {
      if (this.$refs.location && this.$refs.location.offsetHeight) {
        this.locationLine = this.$refs.location.offsetHeight > 20 ? '-webkit-box' : '';
      }
      if (this.$refs.desc && this.$refs.desc.offsetHeight) {
        this.descLine = this.$refs.desc.offsetHeight > 20 ? '-webkit-box' : '';
      }

    },
    data() {
      return {
        locationLine: '',
        descLine: '',
        wwwUrl: roterPath,
        picRootPath:'',
        roterOssPath: window.roterOssPath,
        rootDomain: window.location.protocol + "//" + window.location.host,
        id: '',
        typeId: '',
        typeCode: '',


        //
        workObj: {},
        detail: {},
        imgObj: {
          content: "",
          serverid: [],
          imgs: []
        },
        //1.单选 2.多选 3.问答 4.自定义 5.判断 6.填空
        quesTypeView: {
          1: '单选',
          2: '多选',
          3: '问答',
          4: '自定义',
          5: '判断题',
          6: '填空'
        },
        quesTypeShow: {
          1: '单选题',
          2: '多选题',
          3: '问答题',
          4: '作业',
          5: '判断题',
          6: '填空题'
        },
        trueList: [],
        currentWork: 0,
        workId: '',
        quesList: [],
        checkList: [],
        showRecording: false,
        progress: 20,
        voiceSecond: 60,
        voiceTimer: {},
        showSubmit: false,
        showDelVoice: false,
        showDelImg: false,
        timeOutEvent: 0,
        delList: [],
        delIndex: 0,
        editFlag:false,
      }
    },

    methods: {
      textareaFocusout(e){
        document.body.scrollIntoView(false)
      },
      goBack(){
        if(this.editFlag){
          const _this = this // 需要注意 onCancel 和 onConfirm 的 this 指向
          this.$vux.confirm.show({
            content:'已有作业数据，确定放弃数据离开页面吗？',
            // 组件除show外的属性
            onCancel () {
              console.log(this) // 非当前 vm
              console.log(_this) // 当前 vm
            },
            onConfirm () {
              _this.editFlag = false;
              _this.$router.push({path:'/work-list-user?fresh=1'})
            }
          })
        }else{
          this.$router.push({path:'/work-list-user?fresh=1'})
        }
      },
      /**
       * [pushHistory 写入空白历史记录]
       * @author 邱先生
       * @copyright 烟火里的尘埃
       * @version [V1.0版本]
       * @date 2016-07-30
       * @return {[type]} [description]
       */
      pushHistory() {
        debugger;
        let state = {
          title: "title",
          url: "#"
        };
        window.history.pushState(state, "title", "#");
      },
      // 上传图片 - New
      handleChooseImage(detail){
        if (!detail.imgList) {
          detail.imgList = [];
        }
        let _this = this;
        console.log(detail.imgList) ;

        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success : async (res)=> {
              // 
              try {
                  _this.$vux.loading.show({ text: '上传中...' });

                  // 返回选定照片的本地ID列表
                  let files = await _this.readWxImages(res.localIds);
                  // console.log(files);
                  let bodyFormData = new FormData();
                  files.forEach((file) => {
                    bodyFormData.append('files', file);
                  });

                  const service = axios.create({
                    headers : {
                      'Content-Type': 'multipart/form-data',
                    },
                    timeout: 0, // `0` (no timeout)
                  });

                  let resp = await service.post('/wechat/homeworkH5/upload_pic' , bodyFormData);
                  console.log(resp);
                  if(resp.data.status === 200) {
                    let imgResults = resp.data.data.image_list;
                    console.log('detail', detail , 'imgResults', imgResults);
                    detail.imgList.push( ...imgResults.map(val => { return {localId: val.DB_PATH , SHOW_URL: val.SHOW_URL}}));
                  }
              } catch(err){
                throw err;
              } finally{
                _this.$vux.loading.hide();
              }
              
              // .then(response => {
              //     _this.$vux.loading.hide(); 
              //     if (response.status == '200') {
              //         if (response.body.code == '-1') {
              //             _this.$vux.toast.text(response.body.message);
              //         } else {
              //             // _this.$vux.toast.text("作业提交成功！")
              //         }
              //     } else{
              //          _this.$vux.toast.text(response.body.message);
              //     }
              // } , err_response => {
              //   alert("请求失败了!!!!")
              // });
          },
          fail(){
            console.log("图片选择失败！")
          }
        });
      },
      async readWxImages(localIds) {
        let files = [];

        for (let i = 0; i < localIds.length; i++) {
          let base64 = await this.transWxImage2Uri(localIds[i]);
          let file = await dataUrlToFile(base64 , (Date.now() + (Math.random().toString()).split('.')[1]||'')+ '.jpg');
          files.push(file);
        }
        // console.log(files);
        return files ;
      },
      transWxImage2Uri(item) {
        return new Promise(resolve => {
          wx.getLocalImgData({
            localId: item,
            success: function(res) {
              let { localData } = res;

              if (localData.indexOf("data:image") != 0) {
                //判断是否有这样的头部
                localData = "data:image/jpeg;base64," + localData;
              }

              localData = localData
                .replace(/\r|\n/g, "")
                .replace("data:image/jgp", "data:image/jpeg");

              resolve(localData);
            },
            fail: function(err) {
              console.error(err);
            }
          });
        });
      },
      //~~~~~~~~~~~~~~~~~~上传图片 - Old start~~~~~~~~~~~~~~~~~~
      onClickUpActivity(detail) {
        console.log("onClickUpActivity");
        debugger;

        if (!detail.imgList) {
          detail.imgList = [];
        }
        let _this = this;
        console.log(JSON.stringify(detail.imgList) );
        console.log("startImg");

        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            setTimeout(function(){
              let localIds = res.localIds;
              console.info(">>>>>>>>>>选择完成-localIds.length:" + localIds.length)
              //是否IOS
              if (window.__wxjs_is_wkwebview) {
                console.log(">>>>>>>>>>window.__wxjs_is_wkwebview!!!")
                _this.wxGetLocalImgDataActivity(detail.imgList, localIds).then(result => {
                  _this.wxUploadImageActivity(detail.imgList); //todo
                })
              } else {
                console.log(">>>>>>>>>>not----window.__wxjs_is_wkwebview!!!")
                for (let i = 0; i < localIds.length; i++) {
                  let imgObj = {};
                  imgObj.localId = localIds[i];
                  imgObj.localData = localIds[i];
                  detail.imgList.push(imgObj);
                }
                _this.wxUploadImageActivity(detail.imgList); //todo
              }
            } , 5e2);
            

          },
          fail: function (res) {
            console.log("图片选择失败！")
          }
        });

      },
      //
      async wxUploadImageActivity(imgList) {
        let _this = this;
        console.info("upload-length:" + imgList.length);
        for (let i = 0; i < imgList.length; i++) {
          let localId = imgList[i].localId;

          //已经上传的不再上传
          if (imgList[i].serverId || imgList[i].URL) {
            continue;
          }
          //
          if (window.__wxjs_is_wkwebview) {
            if (localId.indexOf("wxlocalresource") != -1) {
              localId = localId.replace("wxlocalresource", "wxLocalResource");
              imgList[i].localId = localId;
            }
          }

          await _this.uploadImage(imgList[i]);

        }
      },
      //上传
      uploadImage(imgObj) {
        return new Promise((resolve, reject) => {
          wx.uploadImage({
            localId: imgObj.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              setTimeout(()=>{

                alert(JSON.stringify(res));

                imgObj.serverId = res.serverId;

                let ele = document.getElementById("headerBox");
                // console.log(ele.clientHeight);
                if(ele){
                  window.scrollTo(0, ele.clientHeight);
                }
                resolve("done!");
                   
              } , 1e3);
              
            },
            fail: function (error) {
              alert("上传图片失败")
            }
          });
        })
      },
      //
      async wxGetLocalImgDataActivity(imgList, localIds) {
        let _this = this;
        for (let i = 0; i < localIds.length; i++) {
          await _this.doreadImage(imgList, localIds[i]);
        }
      },

      doreadImage(imgList, localId) {
        return new Promise((resolve, reject) => {
          wx.getLocalImgData({
            localId: localId, // 图片的localID
            success: function (res) {
              let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
              localData = localData.replace('jgp', 'jpeg');

              let imageBase64 = '';
              if (localData.indexOf('data:image') == 0) {
                //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                imageBase64 = localData;
              } else {
                //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换
                //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                imageBase64 = 'data:image/jpeg;base64,' + localData.replace(/\n/g, '');
              }

              let imgObj = {};
              imgObj.localId = localId;
              imgObj.localData = imageBase64;
              imgList.push(imgObj);
              resolve("done!");
            },
            fail: function () {
              // 这个是ui组件的弹出框，不用管
              console.info("r选择多张失败");
            }
          });
        })
      },

      // previewImage(url) {
      //   console.info(url);
      //   wx.previewImage({
      //     current: url, // 当前显示图片的http链接
      //     urls: [url] // 需要预览的图片http链接列表
      //   });
      // },

      previewImage(url,imgList){
        //console.info(url);
        let urls = [];
        for(let i=0;i<imgList.length;i++){
          urls.push(this.picRootPath+imgList[i].URL)
        }

        wx.previewImage({
          current: url , // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
        });
      },

      clodesdActivity(index) {
        let _this = this;
        _this.removeByValue(_this.actLocalIdImgs, index);
        _this.removeByValue(_this.actServerId, index);
        if (_this.actLocalIdImgs.length < _this.actImgaesMaxLenght) {
          _this.actImgLenght = true
        }
      },
      //~~~~~~~~~~~~~~~~~~上传图片 end~~~~~~~~~~~~~~~~~~

      //js
      gotouchstart(type, list, index) {
        let that = this;
        that.delList = list;
        that.delIndex = index;

        clearTimeout(that.timeOutEvent);//清除定时器
        that.timeOutEvent = 0;
        that.timeOutEvent = setTimeout(function () {
          //执行长按要执行的内容，
          if (type == 'img') {
            that.showDelImg = true;
          } else {
            that.showDelVoice = true;
          }
          console.log("长按删除!")
        }, 600);//这里设置定时
      },
      //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gotouchend(type, list, index) {
        let that = this;
        clearTimeout(that.timeOutEvent);
        if (that.timeOutEvent != 0) {
          //这里写要执行的内容（尤如onclick事件）
          if (type == 'img') {

          } else if(type == 'voice'){
            that.playVoice(list[index])
          } else {
            that.playVoiceMp3(list[index].URL)
          }
          console.log("点击预览")
        }
      },
      //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      gotouchmove() {
        let that = this;
        clearTimeout(that.timeOutEvent);//清除定时器
        that.timeOutEvent = 0;
      },
      onVoiceCancel() {
        this.showDelVoice = false;
      },
      onVoiceDelete() {
        let delIndex = this.delIndex;
        this.delList = this.delList.splice(delIndex, 1)
      },
      onImgCancel() {
        this.showDelImg = false;

      },
      onImgDelete() {
        let delIndex = this.delIndex;
        this.delList = this.delList.splice(delIndex, 1)

      },


      getUrlConfigTrue() {
        let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
        this.$http.get(wiexin).then(response => {
          let data = response.body
          wx.config({
             //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
              "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
              'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function (res) {
            //   alert(res)
          });

        }, response => {
          // console.log("请求失败了!!!!")
        });
      },
      getUrlConfig() {
        let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
        this.$http.get('/ua-service/wx/token?url=' + "http://web.pxy.com/#/work-detail")
          .then(response => {
            let info = response.body.data;
            wx.config({
              //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: info.appId, // 必填，公众号的唯一标识
              timestamp: info.timestamp, // 必填，生成签名的时间戳
              nonceStr: info.nonceStr,
              signature: info.signature,// 必填，签名
              jsApiList: [
                "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
              ] // 必填，需要使用的JS接口列表
            });

          }, response => {
            alert("请求失败了!!!!")
          });
      },
      submitWork() {
        this.showSubmit = true;
      },
      onWorkCancel() {
        this.showSubmit = false;
      },
      onWorkSubmit() {
        // type：答案类型 value：答案内容
        // 文本内容："type":""
        // 图片内容："type":"1"
        // 音频文件："type":"2"


        let vm = this;
        let dataList = [];
        console.log(JSON.stringify(this.quesList));

        for (let i = 0; i < this.quesList.length; i++) {
          let detail = this.quesList[i];
          let item = {}
          if (detail.QUESTYPE == '2') {
            if(detail.answer.length < 2){
              vm.$vux.toast.show({text: '请先完成多选题', type: 'warn', width: '9em'})
              return;
            }
            item = {id: detail.ID, type: '', value: detail.answer.sort().join(",")}
            dataList.push(item)

          } else if (detail.QUESTYPE == '3' || detail.QUESTYPE == '4') {
            //type == 3
            if (detail.sWebImgList && detail.sWebImgList.length > 0) {
              for (let j = 0; j < detail.sWebImgList.length; j++) {
                let itemV = {
                    id: detail.ID,
                    type: '3',
                    value: detail.sWebImgList[j].ANSWER,
                }
                dataList.push(itemV)
              }
            }
            //type == 4
            if (detail.sWebFileList && detail.sWebFileList.length > 0) {
              for (let j = 0; j < detail.sWebFileList.length; j++) {
                let itemV = {
                  id: detail.ID,
                  type: '4',
                  value: detail.sWebFileList[j].ANSWER,
                }
                dataList.push(itemV)
              }
            }

            //录音
            if (detail.voiceList && detail.voiceList.length > 0) {
              for (let j = 0; j < detail.voiceList.length; j++) {
                let second  = detail.voiceList[j].second ? Number(detail.voiceList[j].second)  : Number(detail.voiceList[j].AUDIO_TIME)
                let itemV = {
                  id: detail.ID,
                  type: '2',
                  firstUpload:detail.voiceList[j].serverId ? 1 : 0,
                  value: detail.voiceList[j].serverId ? detail.voiceList[j].serverId : detail.voiceList[j].ANSWER,
                  AUDIO_TIME: second,
                }
                dataList.push(itemV)
              }
            }
            //图片
            debugger;
            if (detail.imgList && detail.imgList.length > 0) {
              for (let j = 0; j < detail.imgList.length; j++) {
                //let itemI = {id: detail.ID, type: '1', value: detail.imgList[j].serverId}

                let itemI = {
                  id: detail.ID,
                  type: '1',
                  firstUpload:detail.imgList[j].serverId ? 1 : 0,
                  value: detail.imgList[j].SHOW_URL ? detail.imgList[j].localId : detail.imgList[j].ANSWER,
                }


                dataList.push(itemI)
              }
            }
            //文本
            if (detail.answer) {
              item = {id: detail.ID, type: '', value: detail.answer}
              dataList.push(item)
            } else if (detail.voiceList.length == 0 && detail.imgList.length == 0) {
              vm.$vux.toast.show({
                text: '请先完成'+this.quesTypeShow[detail.QUESTYPE],
                type: 'warn',
                width: '9em'
              })
              //<toast v-model="show4" type="warn">{{$t('type:warn')}}</toast>
              return;
            }
            //填空
          } else if (detail.QUESTYPE == '6') {
            for(let j = 0 ;j<detail.sAnswerList.length;j++ ){
              debugger;

              
              if(!detail.sAnswerList[j]  || detail.sAnswerList[j] == ""){
                vm.$vux.toast.show({
                  text: '请先完成填空题',
                  type: 'warn',
                  width: '9em'
                })
                return;
              }
              
              // if(!this.checkAngle(detail.sAnswerList[i])){
              //   vm.$vux.toast.show({
              //     text: '不能输入英文符号',
              //     type: 'warn',
              //     width: '9em'
              //   })
              //   return;
              // }

              detail.sAnswerList[j] = detail.sAnswerList[j].replace(/('|‘)/g, '’').replace(/,/g, '，').trim();

            }

            let answer = detail.sAnswerList.join(",")
            item = {id: detail.ID, type: '', value: answer}
            dataList.push(item)
          } else {
            if(!detail.answer || detail.answer  == ''){
              vm.$vux.toast.show({
                text: '请先完成'+this.quesTypeShow[detail.QUESTYPE],
                type: 'warn',
                width: '9em'
              })

              return;
            }
            item = {id: detail.ID, type: '', value: detail.answer}
            dataList.push(item)

          }
        }

        vm.$vux.loading.show({
          text: '提交中...'
        })
        console.log("作业上传中，请稍后");
        console.log(dataList);
        console.log(JSON.stringify(dataList));

        let data = {
          'homeworkId': this.workObj.WORKID,
          'answer': JSON.stringify({'dataList': dataList})
        };

        this.$http.post(apiRouter.GET_HOMEWORK_SAVE_ANSWER, data).then(response => {
          vm.$vux.loading.hide();
          if (response.status == '200') {
            if (response.body.code == '-1') {

              vm.$vux.toast.text(response.body.message)

            } else {
              vm.$vux.toast.text("作业提交成功！")

              setTimeout(function () {
                vm.$router.push({path: 'work-list-user'})
              }, 500)
            }

          } else {
            vm.$vux.toast.text(response.body.message);
            vm.$vux.loading.hide();

          }
        }, response => {
          alert("请求失败了!!!!")
        });
      },

      checkAngle(_str){
        let reg = new RegExp(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/);
        return !reg.test(_str) ? true : false;
      },

      preWork() {
        let currentWork = this.currentWork;
        if (currentWork > 0) {
          this.currentWork = currentWork - 1;
        }
        window.scrollTo(0,0);
      },
      nextWork() {
        let currentWork = this.currentWork;
        if (currentWork < this.quesList.length - 1) {
          this.currentWork = currentWork + 1;
        }
        window.scrollTo(0,0);

      },
      goVoiceTimer() {
        let self = this;
        self.voiceSecond = 60;
        this.voiceTimer = setInterval(function () {
          if (self.voiceSecond > 0) {
            self.voiceSecond = self.voiceSecond - 1;
          }
        }, 1000)
      },


      onClickLeft() {
        this.$router.go(-1);
      },

      loadData() {
        this.workId = this.$route.query.workId;
        let anId = this.$route.query.anId;
        let _this = this;
        if (anId) {
          this.$http.get(apiRouter.GET_HOMEWORK_STU_ANSWER + '?workId=' + _this.workId).then(response => {
            if (response.body.status === 1) {
              _this.picRootPath = response.body.data.PIC_ROOTPATH;
              _this.workObj = response.body.data.hkMap;
              if(_this.workObj.CAN_CHANGE == '0'){
                _this.$router.push({path:'/work-list-user'})
              }

              let quesList = response.body.data.quesList;
              if (quesList.length == 1) {
                _this.progress = 100;
              } else {
                _this.progress = 20;

              }
              //根据类型set答案字段
              for (let i = 0; i < quesList.length; i++) {
                let item = quesList[i];
                //debugger;
                switch (item.QUESTYPE) {
                  //单选
                  case "1":
                    if(item.STUANSWER[0]){
                      item.answer = item.STUANSWER[0].ANSWER;
                    }
                    break;
                  //多选
                  case "2":
                    if(item.STUANSWER[0]){
                      item.answer = item.STUANSWER[0].ANSWER.split(",");
                    }
                    break;
                  //判断题
                  case "5":
                    if(item.STUANSWER[0]){
                      item.answer = item.STUANSWER[0].ANSWER;
                    }
                    break;
                  //填空 todo
                  case "6":
                    if(item.STUANSWER[0]){
                      // let tAnswer = item.ANS_CONTENT.split(",");
                      let sAnswerList = item.STUANSWER[0].ANSWER.split(",");
                      //let sAnswerList = new Array(tAnswer.length);
                      item.sAnswerList = sAnswerList;
                      item.answer = [];
                    }
                    break;
                  // 问答 & 自定义  ("3" || "4"):
                  default:
                    item.imgList = [];
                    item.voiceList = [];
                    item.sWebImgList = [];
                    item.sWebFileList = [];
                    for (let i = 0; i < item.STUANSWER.length; i++) {
                      let ansObj = item.STUANSWER[i];
                      if (ansObj.TYPE == "") {
                        item.answer = ansObj.ANSWER;
                      } else if (ansObj.TYPE == "1") {
                        item.imgList.push(ansObj)
                      } else if (ansObj.TYPE == "2") {
                        item.voiceList.push(ansObj)
                      } else if (ansObj.TYPE == "3"){
                        let urlList = ansObj.ANSWER.split(";");
                        ansObj.sName = urlList[0];
                        ansObj.sUrl = urlList[1];
                        item.sWebImgList.push(ansObj)
                      }else if (ansObj.TYPE == "4"){
                        let urlList = ansObj.ANSWER.split(";");
                        ansObj.sName = urlList[0];
                        ansObj.sUrl = urlList[1];
                        item.sWebFileList.push(ansObj)
                      }
                    }
                }
              }
              _this.quesList = quesList;
            }else{
              alert(response.data.message);
            }
          }, response => {
            this.$vux.toast.show({
              text: '"请求失败了!!!!"',
            })
          });
        } else {
          this.$http.get(apiRouter.GET_HOMEWORK_STU_VIEW + '?workId=' + _this.workId).then(response => {
            if (response.body.status === 1) {
              _this.picRootPath = response.body.data.PIC_ROOTPATH;
              _this.workObj = response.body.data.hkMap;
              let quesList = response.body.data.quesList;
              if (quesList.length == 1) {
                _this.progress = 100;
              } else {
                _this.progress = 20;

              }
              //debugger;
              //根据类型set答案字段
              for (let i = 0; i < quesList.length; i++) {
                let item = quesList[i];
                //debugger;
                switch (item.QUESTYPE) {
                  //单选
                  case "1":
                    break;
                  //多选
                  case "2":
                    item.answer = [];
                    break;
                  //问答
                  case "3":
                    item.answer = "";
                    item.imgList = [];
                    item.voiceList = [];
                    break;
                  //自定义
                  case "4":
                    item.answer = "";
                    item.imgList = [];
                    item.voiceList = [];

                    break;
                  //判断题
                  case "5":
                    break;
                  //填空 todo
                  case "6":
                    let tAnswer = item.ANS_CONTENT.split(",");
                    let sAnswerList = new Array(tAnswer.length);
                    item.sAnswerList = sAnswerList;
                    item.answer = [];
                    break;
                }
              }
              _this.quesList = quesList;
            }else{
              alert(response.data.message);
            }
          }, response => {
            this.$vux.toast.show({
              text: '"请求失败了!!!!"',
            })
          });
        }

      },
      //@@@@@@@@@@@@@@@@@@@@@@@@   录音    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      startVoice(detail) {
        this.showRecording = true;
        console.log("startVoice");
        console.log(detail);
        if (!detail.voiceList) {
          detail.voiceList = [];
        }
        console.log(detail);
        window.clearInterval(this.voiceTimer);
        this.goVoiceTimer();
        wx.startRecord();
        let self = this;
        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            let localId = res.localId;
            self.showRecording = false;
            window.clearInterval(this.voiceTimer);
            // alert("时间超过60秒,已自动保存！");
            self.$vux.toast.text('时间超过60秒,已自动保存！')
            self.uploadVoice(localId, detail.voiceList)
          }
        });
        //$('body').append('<span id="recording" class="recording-show"></span>');
      },
      endVoice(detail) {
        let self = this;
        this.showRecording = false;
        console.log("endVoice");
        window.clearInterval(this.voiceTimer);
        //说话太短
        if(this.voiceSecond == 60){
          self.$vux.toast.text('说话时间太短');
          wx.stopRecord({
            success: function (res) {},
            fail: function (res) {}
          });
          return;
        }
        let voiceList = detail.voiceList;
        wx.stopRecord({
          success: function (res) {
            if(res.localId){
              self.uploadVoice(res.localId, voiceList)
            }else{
              console.log("无localId");
            }

            //isrecording = false;
            //self.recordComplete(res.localId, id, recordtime);
            //
          },
          fail: function (res) {
            console.log("无localId");
            console.log(res);
            self.$vux.toast.text('说话时间太短');

          }
        });
      },
      //
      uploadVoice(localId, voiceList) {
        let self = this;
        //self.g_param.isuploadcomplete = false;
        console.log("voice-upload：")
        console.log(JSON.stringify(voiceList))
        let second = 60 - self.voiceSecond;
        if (second == 0) second = 1;
        let voiceObj = {localId: localId, second: second};
        voiceList.push(voiceObj);
        wx.uploadVoice({
          localId: localId,
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            console.log("voice-upload：@@@@@@@@@@@");
            console.log(res)
            voiceObj.serverId = res.serverId;
            //返回音频的服务器端ID
            //$container.find('.qs-voice').eq($container.find('.qs-voice').length - 1).find('input').val(res.serverId);
            //self.g_param.isuploadcomplete = true;
            console.log(res);

            //document.getElementsByClassName('feedbackListSubtitle')[0].scrollIntoView()
            let ele = document.getElementById("headerBox");
            console.log(ele.clientHeight);
            window.scrollTo(0,ele.clientHeight);
            //判断元素是否出现了滚动条
            // if(ele.scrollHeight > ele.clientHeight) {
            //   //设置滚动条到最底部
            //   ele.scrollTop = ele.scrollHeight;
            // }

          }
        });
      },
      //
      playVoiceMp3(url) {
        let mp3 = new Audio(url);
        mp3.play();
      },
      playVoice(voiceItem) {
        if (voiceItem.localId) {
          console.log("has-localId");
          wx.playVoice({
            localId: voiceItem.localId // 需要播放的音频的本地ID，由stopRecord接口获得
          });
        } else {
          wx.downloadVoice({
            serverId: voiceItem.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              let localId = res.localId; // 返回音频的本地ID
              voiceItem.localId = localId;
              wx.playVoice({
                localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
              });
            }
          });
        }
      },
      stopVoice(localId) {
        wx.stopVoice({
          localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
        });
      },
      translateVoice(localId) {
        wx.translateVoice({
          localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            alert(res.translateResult); // 语音识别的结果
          }
        });//设备信息
      },
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';
  @import '../../style/detail.less';

  .other-ans-img {
    -webkit-touch-callout:none;/*系统默认菜单被禁用*/

    -webkit-user-select:none;/*webkit浏览器*/

    -khtml-user-select:none;/*早起浏览器*/

    -moz-user-select:none;/*火狐浏览器*/

    -ms-user-select:none;/*IE浏览器*/

    user-select:none;/*用户是否能够选中文本*/
  }
  .other-ans-voice{
    -webkit-touch-callout:none;/*系统默认菜单被禁用*/

    -webkit-user-select:none;/*webkit浏览器*/

    -khtml-user-select:none;/*早起浏览器*/

    -moz-user-select:none;/*火狐浏览器*/

    -ms-user-select:none;/*IE浏览器*/

    user-select:none;/*用户是否能够选中文本*/
  }
  html, body {
    background: #f2f2f2;
    overflow: hidden
  }

  .lqt-container {
    top: 0;
    bottom: 45px
  }

  .homework-container {
    /*height: 100%;*/
    /*overflow: hidden*/
  }

  .homework-container .homework-list {
    /*width: 1000000000px;*/
    width: 100%;
    height: 100%;
    border-radius: 3px;
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .homework-container .homework-list.active {
    -webkit-transition: all .3s ease;
    transition: all .3s ease
  }

  .homework-container .homework-list .it {
    display: block;
    position: relative;
    float: left;
    width: 100%;
    /*width: 750rem;*/
    height: 100%;
    min-height: 10px;
    overflow: hidden
  }

  .homework-container .homework-list .scroll-wrapper {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
  }

  .homework-container .homework-list .scroll-dom {
    margin-bottom: 120px;
    background: #fff
  }

  .homework-container .homework-tips {
    padding-bottom: 5px;
    border-bottom: solid 1px #dedede
  }

  .homework-container .homework-tips .tips-content {
    float: left;
    width: 70%;
    text-indent: 10px
  }

  .homework-container .homework-tips .tips-content p:first-child {
    line-height: 30px;
    font-size: 16px
  }

  .homework-container .homework-tips .tips-content p:last-child {
    line-height: 20px;
    font-size: 14px
  }

  .homework-container .homework-tips .homework-deadline {
    float: left;
    width: 30%;
    line-height: 30px;
    font-size: 11px;
    color: #999
  }

  .homework-container .homework-content {
    padding: 10px;
    font-size: 16px;
    padding-bottom: 90px;
  }

  .homework-container .homework-content .homework-title {
    line-height: 23px
  }

  .homework-container .homework-content .homework-answer {
    padding-bottom: 20px
  }

  .homework-container .homework-content .homework-answer .answer {
    padding: 10px 0 10px 25px
  }

  .homework-container .homework-content .homework-answer .answer label {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
    tap-highlight-color: rgba(0, 0, 0, 0.05)
  }

  .homework-container .homework-content .homework-answer .answer .icon-common {
    float: left;
    margin-left: -25px
  }

  .homework-container .homework-content .homework-answer .answer .answer-content {
    float: left;
    width: 100%;
    line-height: 23px
  }

  .homework-container .homework-content .homework-answer .correct-answer {
    padding-top: 10px
  }

  .homework-container .homework-content .homework-msg {
    padding-top: 5px;
    padding-bottom: 15px;
    font-size: 14px;
    color: #999
  }

  .homework-container .homework-content .answer-right {
    color: #48b319
  }

  .homework-container .homework-content .answer-wrong {
    color: #bb002b
  }

  .homework-container .homework-answer {
    padding-bottom: 0
  }

  .homework-container .answer-qs {
    margin-top: 10px
  }

  .homework-container .qs-txt {
    position: relative;
    border: solid 1px #dedede;
    padding: 10px
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
    overflow: hidden
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
    opacity: 0
  }

  .homework-container .qs-img img {
    display: block;
    max-width: 100%
  }

  .homework-container .qs-bar {
    border-top: solid 1px #dedede;
    position: fixed;
    top: auto;
    right: 0;
    bottom: 45px;
    left: 0;
    z-index: 15;
    background: #fff
  }

  .homework-container .qs-bar p {
    float: left;
    width: 50%;
    padding: 10px 0;
    -webkit-user-select: none;
    -webkit-touch-callout: none
  }

  .homework-container .qs-bar .bar-btn {
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-family: 'icon';
    font-size: 26px;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    -webkit-user-select: none;
    -webkit-touch-callout: none
  }

  .homework-container .qs-bar .btn-img {
    float: right;
    margin-right: 23px;
    background: #ff8a65;
    background-image: url('../../assets/work/camera.png');
    background-size: cover;
  }

  .homework-container .qs-bar .btn-voice {
    float: left;
    margin-left: 22px;
    background: #2782d7;
    background-image: url('../../assets/work/voice.png');
    background-size: cover
  }

  .homework-container .qs-answer {
    padding-top: 10px
  }

  .homework-container .qs-voice-icon {
    font-family: 'icon';
    font-size: 28px;
    padding-left: 13px
  }

  .homework-container .recordtime {
    float: left;
    margin: 6px 0 0 10px;
    line-height: 44px;
    color: #999
  }

  .homework-container .btn-play {
    float: left;
    position: relative;
    margin-top: 6px;
    line-height: 23px;
    padding: 8px 5px;
    font-size: 14px;
    color: #666;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#ededf2),
    to(#e2e2e6));
    /*background: gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));*/
    box-shadow: 0 0 1px 0 #fff inset;
    border: solid 1px #dedede;
    border-radius: 3px;
    max-width: 75%;
    min-width: 15%;
    width: 20%;
    -webkit-transition: width .3s ease-in-out;
    transition: width .3s ease-in-out
  }

  .homework-container .btn-play.active {
    border: solid 1px #48b319
  }

  .homework-container .btn-play.active .arrow-up {
    background: #48b319
  }

  .homework-bar {
    padding: 4px 0;
    background: #48b319;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 25;
    overflow: hidden
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
    -webkit-transition: all .3s ease;
    transition: all .3s ease
  }

  .homework-bar .homework-pre, .homework-bar .homework-submit {
    opacity: 0
  }

  .homework-bar .homework-next, .homework-bar .homework-submit {
    margin-left: -2px;
    border-left: solid 2px #fff;
    position: absolute;
    top: auto;
    right: 0;
    bottom: auto;
    left: auto
  }

  .homework-bar .homework-next {
    z-index: 5
  }

  .homework-bar .homework-submit {
    z-index: 2
  }

  .homework-bar .icon-change, .homework-bar .txt-change {
    float: left;
    text-align: center
  }

  .homework-bar .icon-change {
    width: 30%
  }

  .homework-bar .txt-change {
    width: 70%
  }

  .homework-bar .txt-submit {
    display: block;
    width: 100%;
    text-align: center
  }

  .homework-bar .icon-next {
    position: relative;
    top: 5px
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
    opacity: .3;
    background: #fff;
    -webkit-transition: all .3s ease;
    transition: all .3s ease
  }

  #complete .scroll-dom {
    margin-bottom: 66px
  }

  #vote.lqt-container {
    top: 1rem
  }


  .pic .i {
    float: left;
    width: 100%;
    margin-top: 5px;
    height: 95px
  }

  .pic .i a {
    display: block
  }

  .pic .i p {
    margin-right: 3px;
    background-position: center;
    background-size: cover
  }

  .pic img {
    display: block
  }

  .pic.two {
    margin-left: -2px
  }

  .pic.two .i {
    width: 50%
  }

  .pic.two a {
    height: 100%
  }

  .pic.two p {
    height: 100%;
    margin: 0 3px 0 2px
  }

  .pic.ninecell {
    margin-left: -2px
  }

  .pic.ninecell .i {
    width: 33.333%;
    height: 95px
  }

  .pic.ninecell a {
    height: 100%
  }

  .pic.ninecell p {
    height: 100%;
    margin: 0 3px 0 2px
  }

  /////////
  .demo3-item {
    padding: 8px 5px;
    font-size: 0;
    display: block;
  }

  .demo3-item-default {
    background: url('../../assets/question/radio-on-new.png') no-repeat;
    background-size: contain;
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    vertical-align: bottom;
  }

  .demo3-item-selected .demo3-item-default {
    background-image: url('../../assets/question/radio-on.png')
  }


  .checkbox-item-default {
    background: url('../../assets/question/check-box-off.png') no-repeat;
    background-size: contain;
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    vertical-align: bottom;
  }

  .checkbox-item-selected .checkbox-item-default {
    background-image: url('../../assets/question/check-box-on.png');
  }

  .title-header {
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    z-index: 1;
    border-bottom: solid 1px #dedede;
  }

  .title-header /deep/ .vux-header-title {
    color: #333;
    line-height: 46px;

  }

  .title-header /deep/ .vux-header-back {
    color: #38f;
  }

  .title-header /deep/ .left-arrow:before {
    border-color: #38f !important;
  }

  .qa-input {
    border: 1px solid #979797;
    height: 2.2em;
    font-size: 14px;
    margin-top: 1em;
    padding-left: 6px;
  }

  .icon-work-pre {
    background-image: url('../../assets/work/arrow-left-circle.png');
    background-size: cover;
  }

  .icon-work-next {
    background-image: url('../../assets/work/arrow-left-circle.png');
    background-size: cover;
  }

  .sub-content /deep/ img {
    max-width: 100%;
    /* max-height: 200px;*/
  }

  .sub-content {
    overflow-x: auto;
  }

  .sub-content /deep/ td {
    border: 1px solid #dedede;
  }

  .homework-answer /deep/ img {
    max-width: 100%;
  }

  .other-ans-img /deep/ img {
    max-width: 100%;
  }

  .teacher-img-list img {
    /* border: 1px blue solid;*/
    max-width: 49%;
  }

  .teacher-img-list p{
    height: 110px;
    width: 31%;
    display: inline-block;
    margin-right: 3px;
  }

  .vux-x-icon {
    fill: #dedede;
  }

  .wer-textarea /deep/ .weui-textarea-counter {
    margin-bottom: -1rem;
  }

  .answer-textarea /deep/ .weui-textarea-counter{
    color: #dedede;
  }


  input::-webkit-input-placeholder {
    /* 修改字体颜色 */
    color: #dedede !important;;
    /* 修改字号，默认继承input */
    /*font-size: 12px;*/
    /* 设置背景色 */
    /*background: #8ac6d1;*/
  }

  .voice-play{
    display: inline-block;
    background-color: #03a9f4;
    height: 2em;
    border-radius: 5px;
    width: 5em;
    margin-bottom: 5px;
    -webkit-touch-callout:none;
    -moz-touch-callout:none;
    -ms-touch-callout:none;
    touch-callout:none;
  }
  .voice-ready{
    display: inline-block;
    height: 1em;
    width: 15px;
    margin-left: 5px;
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: middle;
    background-image: url('../../assets/work/airplay.png');
  }

  .img-local{
    max-width:100%
  }
</style>
