<template>
  <div>
    <x-header class="title-header" :left-options="{preventGoBack: true}"
      @on-click-back="
         $router.push({path:checkMap.USER_ID===myInfo.userId ? '/work-list-user?fresh=1':'/work-detail-done?workId='+workId})
      " 
      >{{(myInfo && checkMap.USER_ID===myInfo.userId)?'我':checkMap.USERNAME}}的作业</x-header>

    <div class="lqt-container lqt-wrapper" style="top: 1em">
      <div class="homework-container" id="headerBox">
        <ul class="homework-list clearfix header-banner" id="bannerBox" style="padding: 1em">
          <li v-for="(detail,index) in quesList" v-show="currentWork == index" class="it banner-sheet"
              data-type="checkbox">
            <first-header v-show="currentWork == 0" :headData="workObj"></first-header>

            <div v-if="(checkMap.GREATLIST && checkMap.GREATLIST.length) && (checkMap.USER_ID===myInfo.userId)" style="color:#48b319;	padding: 10px; border-bottom: solid 1px #dedede;">
              老师推荐了优秀作业：
              <span v-for="(wp , index) in checkMap.GREATLIST"
               :key="wp.USER_ID"><u :style="'text-decoration: ' + (wp.USER_ID === myInfo.userId? '':'underline')" 
                  @click="goBrowseOthers(wp.USER_ID)"
                >{{wp.NAME}}</u>{{index+1 < checkMap.GREATLIST.length? '、':'，'}}
              </span>
              点人名查看。
            </div>

            <!-- 问答题 或 自定义 -->
            <div v-if="detail.QUESTYPE == '3' || detail.QUESTYPE == '4'">
              <div class="homework-content">
                <p v-if=" detail.QUESTYPE != '4' " class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】</p>
                <p v-if="quesList.length>1 && detail.QUESTYPE == '4'">{{detail.QUESNO}}.</p>
                <div class="sub-content" v-html="detail.CONTENT"></div>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />

                <!--老师的图片-->
                <div class="teacher-img-list">
                  <thumbs-grid v-if="detail.IMGLIST && detail.IMGLIST.length" :imgList="detail.IMGLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                  <!-- <p v-for="(tDetail,tIndex) in detail.IMGLIST"
                     @click="previewImage(picRootPath+tDetail.URL,detail.IMGLIST)"
                     :style='{ backgroundImage:"url(" + picRootPath+tDetail.URL + ")" , backgroundSize:"cover"}'></p> -->
                </div>
                <divider><x-icon type="ios-arrow-down" size="30"></x-icon></divider>
                <ul class="homework-answer">
                  <li class="answer-qs qs-txt" v-if="detail.answer" v-html="detail.answer" />
                </ul>

                <div v-if="detail.sWebImgList" class="answer-qs ans-web-img">
                  <div v-for="(vDetail,vIndex) in detail.sWebImgList">
                    <img style="max-width: 100%" :src="picRootPath+vDetail.sUrl"/>
                  </div>
                </div>

                <div v-if="detail.sWebFileList" class="answer-qs ans-web-file">
                  <div v-for="(vDetail,vIndex) in detail.sWebFileList">
                    <a v-if="vDetail.sUrl.indexOf('.pdf') > 0" style="text-decoration: underline;color: yellowgreen;" :href="'/common/fileview/go_page.jsp?filePath='+vDetail.sUrl">{{vDetail.sName}}</a>
                    <a v-else-if="vDetail.sUrl.indexOf('.doc') > 0 || vDetail.sUrl.indexOf('.xls') > 0 || vDetail.sUrl.indexOf('.ppt') > 0" style="text-decoration: underline;color: yellowgreen;" :href="'https://view.officeapps.live.com/op/view.aspx?src='+picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>
                    <a v-else style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>

                    <!--<a v-if="vDetail.sUrl.indexOf('.pdf') > 0" style="text-decoration: underline;color: yellowgreen;" :href="'/common/fileview/go_page.jsp?filePath='+vDetail.sUrl">{{vDetail.sName}}</a>
                    <a v-else style="text-decoration: underline;color: yellowgreen;" :href="'https://view.officeapps.live.com/op/view.aspx?src='+picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>
-->
                    <!--<a style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+'/weixin/wechat/fileview/go_page.jsp?filePath='+vDetail.sUrl+'&fileName='+vDetail.sName">{{vDetail.sName}}</a>-->
                  </div>
                </div>

                <div v-if="detail.sImgList" class="answer-qs other-ans-img">
                  <div v-for="(vDetail,vIndex) in detail.sImgList">
                    <img :src="vDetail.URL"/>
                    <!--<div class="qs-content" contenteditable="true"></div>-->
                  </div>
                </div>

                <div v-if="detail.sVoiceList"  class="answer-qs other-ans-voice">
                  <div v-for="(vDetail,vIndex) in detail.sVoiceList">
                    <p  @click="playVoice(vDetail.URL)" class="voice-play" >
                      <span class="voice-ready"></span>
                    </p>
                    <span style="line-height: 2em;vertical-align: top;">{{vDetail.AUDIO_TIME}}''</span>
                  </div>
                </div>
              </div>
              <div v-if="detail.QUESTYPE == '3'" class="answer-qs qs-answer">答案：{{detail.ANS_CONTENT}} </div>
            </div>
            <!-- 问答题end -->

            <!-- 单选 -->
            <div v-if="detail.QUESTYPE == '1' ">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                <!-- <div>
                  <img @click="previewImage(picRootPath+dItem.URL,detail.PICLIST)" v-for="dItem in detail.PICLIST" width="49%" :src="picRootPath+dItem.URL">
                </div> -->
                <checker style="margin-top: 10px;margin-left: -5px;" v-model="detail.STUANSWER[0].ANSWER"
                         default-item-class="demo3-item" selected-item-class="demo3-item-selected">

<!--                  <checker-item  :disabled="true" v-for="item in detail.OPTIONLIST" :key="item.ID" :value="item.ORDERNO">-->
<!--                    <span class="demo3-item-default"></span>-->
<!--                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>-->
<!--                  </checker-item>-->
                  <div v-for="item in detail.OPTIONLIST" :key="item.ID" >
                    <checker-item :key="item.ID" :value="item.ORDERNO" disabled>
                      <span class="demo3-item-default"></span>
                      <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>
                    </checker-item>
                    <thumbs-grid v-if="item.PICLIST && item.PICLIST.length" :imgList="item.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                    <!-- <div>
                      <img @click="previewImage(picRootPath+subDItem.URL,item.PICLIST)" v-for="subDItem in item.PICLIST" style="max-height: 200px" :src="picRootPath+subDItem.URL">
                    </div> -->
                  </div>
                </checker>
              </div>
              <div class="answer-qs qs-answer">
                答案：{{detail.ANS_CONTENT}}
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img" src="../../assets/work/correct.png"/>
                <img v-else class="answer-img" src="../../assets/work/error.png">
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 单选end -->

            <!-- 多选 -->
            <div v-if="detail.QUESTYPE == '2' ">
              <!-- id：题目id -->
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                <!-- <div>
                  <img @click="previewImage(picRootPath+dItem.URL,detail.PICLIST)" v-for="dItem in detail.PICLIST" width="49%" :src="picRootPath+dItem.URL">
                </div> -->
                <checker style="margin-top: 10px;margin-left: -5px;" v-model="detail.answer" :min="2" type="checkbox"
                         default-item-class="demo3-item" selected-item-class="checkbox-item-selected">
<!--                  <checker-item :disabled="true" v-for="item in detail.OPTIONLIST" :key="item.ID" :value="item.ORDERNO">-->
<!--                    <span class="checkbox-item-default"></span>-->
<!--                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>-->
<!--                  </checker-item>-->
                  <div v-for="item in detail.OPTIONLIST" :key="item.ID" >
                    <checker-item :key="item.ID" :value="item.ORDERNO" disabled>
                      <span class="checkbox-item-default"></span>
                      <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>
                    </checker-item>
                    <thumbs-grid v-if="item.PICLIST && item.PICLIST.length" :imgList="item.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                    <!-- <div>
                      <img @click="previewImage(picRootPath+subDItem.URL,item.PICLIST)" v-for="subDItem in item.PICLIST" style="max-height: 200px" :src="picRootPath+subDItem.URL">
                    </div> -->
                  </div>
                </checker>
              </div>
              <div class="answer-qs qs-answer">
                答案：{{detail.ANS_CONTENT}}
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img" src="../../assets/work/correct.png"/>
                <img v-else class="answer-img" src="../../assets/work/error.png">
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 多选end -->

            <!-- 判断 -->
            <div v-if="detail.QUESTYPE == '5'">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                
                <checker style="margin-top: 16px;margin-left: -5px;" v-model="detail.STUANSWER[0].ANSWER"
                         default-item-class="demo3-item" selected-item-class="demo3-item-selected">
                  <checker-item :disabled="true"  key="1" value="true">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">对</span><br>
                  </checker-item>
                  <checker-item :disabled="true"  key="2" value="false">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">错</span><br>
                  </checker-item>
                </checker>
              </div>
              <div class="answer-qs qs-answer">
                答案：{{detail.ANS_CONTENT == "true"?'对':'错'}}
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img" src="../../assets/work/correct.png"/>
                <img v-else class="answer-img" src="../../assets/work/error.png">
              </div>
              <input class="answer-data" type="hidden" value="">
            </div>
            <!-- 判断end -->

            <!-- 填空   -->
            <div v-if="detail.QUESTYPE == '6'">
              <div class="homework-content">
                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />                
                <div style="margin-bottom: 12px" v-for="(sItem,sIndex) in detail.sAnswerList" :key="sIndex">
                  <input  readonly="readonly" class="qa-input" v-model="detail.sAnswerList[sIndex]" :placeholder="     '('+(sIndex+1)+')'"><br>
                  <div style="margin-top: 8px;font-size: 14px">({{sIndex+1}})答案：{{ detail.tAnswer[sIndex] }}</div>
                </div>
              </div>
              <div class="answer-qs qs-answer" style='margin-top: 4rem'>
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img" src="../../assets/work/correct.png"/>
                <img v-else class="answer-img" src="../../assets/work/error.png">
              </div>
              <input class="answer-data" type="hidden" value="">

<!--              <div class="homework-content">-->
<!--                <p class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】{{detail.CONTENT}}</p>-->
<!--                <div>-->
<!--                  <input class="qa-input" placeholder="  (1)"><br>-->
<!--                  <input class="qa-input" placeholder="  (2)"><br>-->
<!--                  <input class="qa-input" placeholder="  (3)"><br>-->

<!--                </div>-->
<!--              </div>-->
<!--              <input class="answer-data" type="hidden" value="">-->
            </div>
            <!-- 填空end -->
          </li>

          <!-- 评论   -->
          <li v-show="currentWork === quesList.length " class="it banner-sheet"
              data-type="checkbox">
            <!-- <work-comment ref="wkment" :headData="workObj"></work-comment> -->
            <grade-assignments ref="grament" :workId="workObj.WORKID" :mainId="workObj.ANID" :isGreat="isGreat" :fromTeacher="false" :isBrowseOnly="checkMap.USER_ID!==myInfo.userId" :postCommentFunc="saveCommentOnly" :checkType="checkMap.TYPE" :wx="wx" :passFunc="()=>{}" :rejectFunc="()=>{}" />
          </li>
          <!-- 评论 end -->
        </ul>

      </div>
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
      <!-- 留言板 -->
      <a id="comment" @click="nextComment" 
          v-else-if="currentWork+1 === quesList.length"
         class="homework-btn homework-next clearfix" href="javascript:void(0)" style="opacity: 1; z-index: 5;">
        <span class="txt-change">留言板</span>

        <em class="icon-change icon-next" style="height: 28px;">
          <span class="icon-work-next" style="width: 1.1em;height: 1em;display: block;margin-top: 6px;"></span>
        </em>
      </a>


      <span class="pre-loc" :style=" 'height: 100%;width:' + progress +'%'"></span>
    </div>

    <span v-show="showRecording" id="recording"></span>
  </div>
</template>

<script type="es6">

  import {XTextarea, Toast, Checker, CheckerItem, Group, XInput,Divider, XHeader} from 'vux';
  import apiRouter, {apiPath} from "../../config/api.js";
  import wx from "weixin-js-sdk";
  import FirstHeader from './FirstHeader.vue';

  import GradeAssignments from './components/GradeAssignments.vue'
  import Thumbs from './components/Thumbs.vue';

  import {formatDate} from "../../utils/TimeUtils";
  import authonStore from "../../utils/AuthonStore";

var mp3;

  export default {
    components: {
      XTextarea,
      Toast,
      Checker,
      CheckerItem,
      Group,
      XInput,
      XHeader,
      Divider,
      [FirstHeader.name]: FirstHeader,
      [Thumbs.name]: Thumbs,
      GradeAssignments: GradeAssignments,
    },
    created() {
      //debugger;
    },
    mounted() {
      //this.loadData();
      this.getUrlConfigTrue()
      //this.getUrlConfig();
      this.urlPath = window.location.href.split("#")[0];
    },
    computed: {},
    watch: {
      currentWork(val) {
        this.progress = ((val + 1) / this.quesList.length) * 100;
      },
      "$route": function (e) {
        // if (e.path == '/schedule-detail') {
        //   this.loadData();
        // }

      }
    },
    async activated() {
      this.myInfo = await authonStore.getUserInfo();
      this.currentWork = 0;
      this.loadData();
      this.urlPath = window.location.href.split("#")[0];
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
        myInfo: null,
        wx,
        urlPath: window.location.href.split("#")[0],
        locationLine: '',
        descLine: '',
        wwwUrl: roterPath,
        wwwImgUrl:roterImgPath,
        picRootPath:'',
        rootDomain:window.location.protocol+"//"+window.location.host,
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
        trueList: [],
        currentWork: 0,
        workId: '',
        checkMap:{},
        isGreat: false,
        quesList: [],
        checkList: [],
        showRecording: false,
        progress: 20,
      }
    },

    methods: {
      goBrowseOthers(targetUserId){
        if(targetUserId !== this.myInfo.userId){
          this.$router.push(`/work-detail-done?browse=1&workId=${this.workId}&termId=${this.workObj.TERM_ID}&schoolId=${this.workObj.SCHOOL_ID}&userId=${targetUserId}`)
        }
      },
      async saveCommentOnly(param){
        param.mainId = this.workObj.ANID;
        param.homeworkId = this.workObj.WORKID;
        console.log(param);

        const self = this;

        await this.$http.post(apiPath + '/wechat/homeworkH5/addCommentHis', param).then(response =>{
          if (response.body.code == '200') {
              self.$refs.grament.loadComments({
                WORKID: self.workObj.WORKID,
                ANID: self.workObj.ANID,
              });
          } else{
            throw new Error(response.body.message)
          }
        });

        
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
      nextComment(){
        let currentWork = this.currentWork;
        if (currentWork < this.quesList.length) {
          this.currentWork = currentWork + 1;
          let _this = this;
          // this.workObj
          // debugger;
          this.$refs.grament.loadComments( {
            WORKID: _this.workObj.WORKID,
            ANID: _this.workObj.ANID,
          });
        }
      },


      previewImage(url,imgList){
        //console.info(url);
        let urls = [];
        for(let i=0;i<imgList.length;i++){
          urls.push(this.picRootPath+imgList[i].URL)
        }

        wx.previewImage({
          current: this.picRootPath + url , // 当前显示图片的http链接
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
      onClickLeft() {
        this.$router.go(-1);
      },
      loadData() {
        this.workId = this.$route.query.workId;
        let _this = this;
        let invokeApi = (this.$route.query.browse=='1') ? apiRouter.GET_OTHER_STUDENTS_GOODWORK: apiRouter.GET_HOMEWORK_STU_ANSWER;
        this.$http.get(`${invokeApi}?workId=${this.workId}&termId=${this.$route.query.termId}&schoolId=${this.$route.query.schoolId}&userId=${this.$route.query.userId}`)
        .then(response => {
          if (response.status === 200) {
            _this.picRootPath = response.body.data.PIC_ROOTPATH;
            _this.workObj = response.body.data.hkMap;
            _this.checkMap = response.body.data.checkMap || {};
						_this.isGreat = _this.checkMap.IS_GREAT == '1';
            let quesList = response.body.data.quesList;
            if(quesList.length == 1){
              _this.progress = 100;
            }else {
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
                  if(item.STUANSWER[0]){
                    item.answer = item.STUANSWER[0].ANSWER.split(',');
                  }
                  break;
                //判断题
                case "5":
                  break;
                //填空 todo
                case "6":
                  if(item.STUANSWER[0]){
                    let tAnswer = item.ANS_CONTENT.split(",");
                    let sAnswerList = item.STUANSWER[0].ANSWER.split(",");
                    item.sAnswerList = sAnswerList;
                    item.tAnswer = tAnswer;
                  }
                  break;
                // //问答 //自定义  ("3" || "4"):
                default:
                  item.sImgList = [];
                  item.sVoiceList = [];
                  item.sWebImgList = [];
                  item.sWebFileList = [];
                  for(let i = 0;i<item.STUANSWER.length;i++){
                    let ansObj = item.STUANSWER[i];
                    if(ansObj.TYPE == ""){
                      item.answer = ansObj.ANSWER;
                    } else if(ansObj.TYPE == "1"){
                      item.sImgList.push(ansObj)
                    } else if (ansObj.TYPE == "2"){
                      item.sVoiceList.push(ansObj)
                    } else if (ansObj.TYPE == "3"){
                      let urlList = ansObj.ANSWER.split(";");
                      ansObj.sName = urlList[0];
                      if(urlList[1].indexOf('upload')===0){
                        urlList[1] = urlList[1].substr(6)
                      }
                      ansObj.sUrl = urlList[1];
                      item.sWebImgList.push(ansObj)
                    } else if (ansObj.TYPE == "4"){
                      let urlList = ansObj.ANSWER.split(";");
                      ansObj.sName = urlList[0];
                      if(urlList[1].indexOf('upload')===0){
                        urlList[1] = urlList[1].substr(6)
                      }
                      ansObj.sUrl = urlList[1];
                      item.sWebFileList.push(ansObj)
                    }
                  }
              }
            }
            _this.quesList = quesList;
          }
        }, response => {
          alert("请求失败了!!!!")
        });
      },
      //@@@@@@@@@@@@@@@@@@@@@@@@   录音 start   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      startVoice(detail) {
        console.log("startVoice");
        console.log(detail);
        if (!detail.voiceList) {
          detail.voiceList = [];
        }
        console.log(detail);
        this.goVoiceTimer();
        wx.startRecord();
        this.showRecording = true;
        let self = this;
        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            let localId = res.localId;
            alert("时间超过60秒,已自动保存！");
            self.uploadVoice(localId, detail.voiceList)
          }
        });
        //$('body').append('<span id="recording" class="recording-show"></span>');
      },
      endVoice(detail) {
        console.log("endVoice");
        let voiceList = detail.voiceList;
        window.clearInterval(this.voiceTimer);
        let self = this;
        //$('#recording').remove();
        this.showRecording = false;
        wx.stopRecord({
          success: function (res) {
            //isrecording = false;
            //self.recordComplete(res.localId, id, recordtime);
            self.uploadVoice(res.localId, voiceList)
          }
        });
      },
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
          }
        });
      },
      playVoice(url) {
        mp3 = new Audio(url);
        mp3.play();
        // wx.downloadVoice({
        //   serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        //   isShowProgressTips: 1, // 默认为1，显示进度提示
        //   success: function (res) {
        //     let localId = res.localId; // 返回音频的本地ID
        //     wx.playVoice({
        //       localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
        //     });
        //   }
        // });
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
      //@@@@@@@@@@@@@@@@@@@@@@@@   录音 end   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      getUrlConfigTrue() {
        let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
        this.$http.get(wiexin).then(response => {
          let data = response.body
          wx.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
              "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
              'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice','downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
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
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: info.appId, // 必填，公众号的唯一标识
              timestamp: info.timestamp, // 必填，生成签名的时间戳
              nonceStr: info.nonceStr,
              signature: info.signature,// 必填，签名
              jsApiList: [
                "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice','downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
              ] // 必填，需要使用的JS接口列表
            });

          }, response => {
            alert("请求失败了!!!!")
          });
      },
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';
  @import '../../style/detail.less';

  html, body {
    background: #f2f2f2;
    overflow: hidden
  }

  .lqt-container {
    top: 0;
    bottom: 45px
  }

  .homework-container {

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
    font-size: 16px
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
    max-width: 50%
  }

  .homework-container .qs-bar {
    border-top: solid 1px #dedede;
    position: absolute;
    top: auto;
    right: 0;
    bottom: 0;
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
    background-image: url('/static/work/camera.png');
    background-size: cover;
  }

  .homework-container .qs-bar .btn-voice {
    float: left;
    margin-left: 22px;
    background: #2782d7;
    background-image: url('/static/work/voice.png');
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

  .title-header{
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    z-index: 1;
    border-bottom: solid 1px #dedede;
    padding-bottom: 100/@baseSize;
  }

  .title-header /deep/ .vux-header-title{
    color: #333;
    line-height: 46px;


  }

  .title-header /deep/ .vux-header-back{
    color: #38f;
  }

  .title-header /deep/ .left-arrow:before{
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

  .answer-img{
    width: 6em;
    right: 1em;
    position: absolute;
    bottom: 1em;
  }

  .sub-content /deep/ img{
    max-width: 100%;
    /*max-height: 200px;*/
  }

  .homework-answer /deep/ img{
    max-width: 100%;
  }

  .other-ans-img /deep/ img{
    max-width: 100%;
  }
  .teacher-img-list img{
   /* border: 1px blue solid;*/
    width: 49%;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
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

  .voice-play{
    display: inline-block;
    background-color: #03a9f4;
    height: 2em;
    border-radius: 5px;
    width: 5em;
    margin-bottom: 5px;
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

  .sub-content {
    overflow-x: auto;
  }

  .sub-content /deep/ td {
    border: 1px solid #dedede;
  }
</style>
