<template>
<div>
  <div>
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack">{{userName}}
    </x-header>

    <div class="lqt-container lqt-wrapper" style="top: 1em">
      <!--      <div class='js-signature' style="background-image: url('demo.png')" ></div>-->
      <div class="homework-container" id="headerBox">
        <ul class="homework-list clearfix header-banner" id="bannerBox" style="padding: 1em">
          <li v-for="(detail,index) in quesList" v-show="currentWork == index" class="it banner-sheet"
              data-type="checkbox">
            <!--<first-header v-show="currentWork == 0" :headData="workObj"></first-header>-->

            <!-- 问答题 或 自定义 -->
            <div v-if="detail.QUESTYPE == '3' || detail.QUESTYPE == '4'">
              <div class="homework-content">
				<p v-if=" detail.QUESTYPE != '4' " class="homework-title">{{detail.QUESNO}}.【{{quesTypeView[detail.QUESTYPE]}}】</p>
                <p v-if="quesList.length>1 && detail.QUESTYPE == '4'">{{detail.QUESNO}}.</p>
				<div class="sub-content" v-html="detail.CONTENT"></div>
                <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length" :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                
				<!--老师的图片-->
                <div class="teacher-img-list">
                  <p v-for="(tDetail,tIndex) in detail.IMGLIST"
                     @click="previewImage(picRootPath+tDetail.URL,detail.IMGLIST)"
                     :style='{ backgroundImage:"url(" + picRootPath+tDetail.URL + ")" , backgroundSize:"cover"}'></p>
                </div>
                <divider><x-icon type="ios-arrow-down" size="30"></x-icon></divider>
                <ul class="homework-answer">
                  <li class="answer-qs qs-txt" v-html="detail.answer">
                    <img v-if="detail.STUANSWER.TYPE != ''" :src="detail.STUANSWER.ANSWER"/>
                    <div class="qs-content" contenteditable="true"></div>
                  </li>
                </ul>

                <!--图片编辑-->
                <div v-if="detail.sWebImgList" class="answer-qs ans-web-img">
                  <div v-for="(vDetail,vIndex) in detail.sWebImgList">
                    <!-- <img style="max-width: 100%" @click="goEdit(vIndex,vDetail,'1',index)" :src="picRootPath+(vDetail.sUrl).split(picRootPath)[1]"/> -->
                    <img v-if="!vDetail.isEdit" style="max-width: 100%" @click="goEdit(vIndex,vDetail,'1',index)" :src="picRootPath+vDetail.sUrl"/>
                    <img v-else style="max-width: 100%" @click="goEdit(vIndex, vDetail, '1' ,index)" :src="vDetail.sUrl"/>

                  </div>
                </div>

                <div v-if="detail.sWebFileList" class="answer-qs ans-web-file">
                  <div v-for="(vDetail,vIndex) in detail.sWebFileList">
                    <div v-if="vDetail.sUrl.indexOf('.pdf') > 0">
                      <a :href="picRootPath+vDetail.sUrl" style="text-decoration: underline;color: yellowgreen;">{{vDetail.sName}} </a>
                      &nbsp;&nbsp;
                      <a :href="'/common/fileview/go_page.jsp?filePath='+vDetail.sUrl"
                         style="color: yellowgreen;">预览</a>
                    </div>
                    <div
                      v-else-if="vDetail.sUrl.indexOf('.doc') > 0 || vDetail.sUrl.indexOf('.xls') > 0 || vDetail.sUrl.indexOf('.ppt') > 0">
                      <a style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>&nbsp;&nbsp;
                      <a style="color: yellowgreen;"
                         :href="'https://view.officeapps.live.com/op/view.aspx?src='+picRootPath+vDetail.sUrl">预览</a>

                    </div>

                    <a v-else style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+vDetail.sUrl">{{vDetail.sName}}</a>
                    <!--                    <a style="text-decoration: underline;color: yellowgreen;" :href="picRootPath+'/weixin/wechat/fileview/go_page.jsp?filePath='+vDetail.sUrl+'&fileName='+vDetail.sName">{{vDetail.sName}}</a>-->
                  </div>
                </div>

                <div v-if="detail.sImgList" class="answer-qs other-ans-img">
                  <div v-for="(vDetail,vIndex) in detail.sImgList">
                    <img @click="goEdit(vIndex,vDetail,'2',index)" :src="vDetail.URL"/>
                    <!--<div class="qs-content" contenteditable="true"></div>-->
                  </div>
                </div>

                <div v-if="detail.sVoiceList" class="answer-qs other-ans-voice">
                  <div v-for="(vDetail,vIndex) in detail.sVoiceList">
                    <p @click="playVoice(vDetail.URL)" class="voice-play">
                      <span class="voice-ready"></span>
                    </p>
                    <span style="line-height: 2em;vertical-align: top;">{{vDetail.AUDIO_TIME}}''</span>
                  </div>
                </div>
              </div>
              <div v-if="detail.QUESTYPE == '3'" class="answer-qs qs-answer">答案：{{detail.ANS_CONTENT}}</div>
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
<!--                  <checker-item :disabled="true" v-for="item in detail.OPTIONLIST" :key="item.ID" :value="item.ORDERNO">-->
<!--                    <span class="demo3-item-default"></span>-->
<!--                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">{{item.ORDERNO}}.{{item.CONTENT}}</span><br>-->
<!--                  </checker-item>-->
                  <div v-for="item in detail.OPTIONLIST" >
                    <checker-item :key="item.ID" :value="item.ORDERNO">
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
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img"
                     src="../../assets/work/correct.png"/>
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
                  <div v-for="item in detail.OPTIONLIST" >
                    <checker-item :key="item.ID" :value="item.ORDERNO">
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
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img"
                     src="../../assets/work/correct.png"/>
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
                  <checker-item :disabled="true" key="1" value="true">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">对</span><br>
                  </checker-item>
                  <checker-item :disabled="true" key="2" value="false">
                    <span class="demo3-item-default"></span>
                    <span style="font-size: 16px;margin-left: 10px;word-break: break-word">错</span><br>
                  </checker-item>
                </checker>
              </div>
              <div class="answer-qs qs-answer">
                答案：{{detail.ANS_CONTENT == "true"?'对':'错'}}
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img"
                     src="../../assets/work/correct.png"/>
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
                <div style="margin-bottom: 12px" v-for="(sItem,sIndex) in detail.sAnswerList">
                  <input readonly="readonly" class="qa-input" v-model="detail.sAnswerList[sIndex]"
                         :placeholder="     '('+(sIndex+1)+')'"><br>
                  <div style="margin-top: 8px;font-size: 14px">({{sIndex+1}})答案：{{ detail.tAnswer[sIndex] }}</div>
                </div>
              </div>
              <div class="answer-qs qs-answer" style='margin-top: 4rem'>
                <img v-if="detail.ANS_CONTENT == detail.STUANSWER[0].ANSWER" class="answer-img"
                     src="../../assets/work/correct.png"/>
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
          <li v-show="currentWork == quesList.length && (checkMap.SCORE || checkMap.COMMENT)" class="it banner-sheet"
              data-type="checkbox">
            <work-comment ref="wkment"></work-comment>
          </li>

          <li v-show="(currentWork == quesList.length && quesList.length != 0) && checkMap.TYPE !=1"
              class="it banner-sheet"
              data-type="checkbox">
            <div class="up-comment" style="margin-bottom: 1rem">
              <div style="font-size: 1.2em;margin-top: 10px">请对本次作业进行评分：</div>
              <!--star="✩"-->
              <rater style="margin-top: 0.9em;" v-model="upCheckMap.score" :max="5" active-color="#04BE02"></rater>

              <div style="font-size: 1.2em;margin-top: 1.1em">请对本次作业进行评分留言：</div>

              <textarea rows="4" v-model="upCheckMap.comment"
                        style="margin-top: 0.9em;border: 1px solid #dedede;width: 100%;padding: 10px;font-size: 1.1em;"></textarea>


              <div style="font-size: 1.2em;margin-top: 15px;margin-bottom: 10px;">作业操作：</div>

              <x-button @click.native="saveUp('0')" plain type="primary" class="rev-btn" style=" margin-top: 1rem;">
                保存并返回列表
              </x-button>

              <x-button @click.native="saveUp('1')" plain type="primary" class="rev-btn" style=" margin-top: 1rem;">
                保存，批改下一份作业
              </x-button>

              <x-button @click.native="rejectUp()" plain type="primary" class="rev-btn"
                        style="color: red;margin-top: 1rem;">发回订正
              </x-button>

            </div>
          </li>
          <!-- 评论end -->
        </ul>

      </div>
    </div>

    <div class="homework-bar clearfix" id="bar">
      <a id="pre" @click="preWork" class="homework-btn homework-pre clearfix" href="javascript:void(0)"
         style="opacity: 1; z-index: 5;">
        <em class="icon-change icon-pre" style="height: 28px;">
          <span v-show="currentWork>0" class="icon-work-pre" style="width: 1.1em;height: 1em;display: block;"></span>
        </em>
        <span v-show="currentWork>0" class="txt-change">上一
          <span v-if="currentWork == quesList.length">步</span>
          <span v-else>题</span>
        </span>

      </a>
      <a id="next" @click="nextWork" v-if="currentWork+1 < quesList.length"
         class="homework-btn homework-next clearfix" href="javascript:void(0)" style="opacity: 1; z-index: 5;">
        <span class="txt-change">下一题 &nbsp;&nbsp;({{currentWork+1}}/{{quesList.length}})</span>

        <em class="icon-change icon-next" style="height: 28px;">
          <span class="icon-work-next" style="width: 1.1em;height: 1em;display: block;margin-top: 6px;"></span>
        </em>
      </a>
      <a id="comment" @click="nextComment"
         v-else-if="(checkMap.SCORE || checkMap.COMMENT) && currentWork+1 == quesList.length"
         class="homework-btn homework-next clearfix" href="javascript:void(0)" style="opacity: 1; z-index: 5;">
        <span class="txt-change">老师评语</span>

        <em class="icon-change icon-next" style="height: 28px;">
          <span class="icon-work-next" style="width: 1.1em;height: 1em;display: block;margin-top: 6px;"></span>
        </em>
      </a>

      <a id="commentAdd" @click="nextComment" v-else-if="(checkMap.TYPE !=1) && currentWork+1 == quesList.length"
         class="homework-btn homework-next clearfix" href="javascript:void(0)" style="opacity: 1; z-index: 5;">
        <span class="txt-change">下一步</span>
        <em class="icon-change icon-next" style="height: 28px;">
          <span class="icon-work-next" style="width: 1.1em;height: 1em;display: block;margin-top: 6px;"></span>
        </em>
      </a>


      <span class="pre-loc" :style=" 'height: 100%;width:' + progress +'%'"></span>
    </div>

<!--    <div v-transfer-dom>-->
<!--      <popup v-model="show8" position="left" width="100%">-->
<!--        <ImgApp @finishEdit="finishEdit" @cancelEdit="cancelEdit" ref="imgApp"></ImgApp>-->
<!--      </popup>-->
<!--    </div>-->

<!--    <div v-show="show8" style="height:100%;width: 100%">-->
<!--      -->
<!--    </div>-->
        <!-- <div v-transfer-dom>
          <x-dialog :dialog-style="{width:'100%', height:'100%', maxWidth:'100%' }" v-model="show8">
            <ImgApp @finishEdit="finishEdit" @cancelEdit="cancelEdit" ref="imgApp"></ImgApp>
          </x-dialog>
        </div> -->

  </div>

<iframe ref="ifr" name="editorWin" v-show="showIframe" :src="showIframeSrc" style="position:fixed;z-index:100;height: 100vh; width: 100vw; border:0;" />

  </div>
</template>

<script type="es6">
import {
	TransferDom,
	Popup,
	XTextarea,
	Toast,
	Checker,
	CheckerItem,
	Group,
	XInput,
	Divider,
	XHeader,
	Rater,
	XButton,
	XDialog } from 'vux';
import { Dialog } from 'vant';
import apiRouter from '../../config/api.js';
import wx from 'weixin-js-sdk';
import FirstHeader from './FirstHeader.vue';
import WorkComment from './WorkComment.vue';
  import Thumbs from './components/Thumbs.vue';

export default {
	directives: {
		TransferDom,
	},
	components: {
		[Dialog.Component.name]: Dialog.Component,
		WorkComment,
		Popup,
		XTextarea,
		Toast,
		Checker,
		CheckerItem,
		Group,
		XInput,
		XHeader,
		Divider,
		Rater,
		XButton,
		XDialog,
		[FirstHeader.name]: FirstHeader,
		[WorkComment.name]: WorkComment,
		[Thumbs.name]: Thumbs,
		//'tui-image-editor': ImageEditor
	},
	created() {
		//debugger;
	},
	mounted() {
		//this.loadData();
		this.getUrlConfigTrue();
		//this.getUrlConfig();
	},
	computed: {},
	watch: {
		currentWork(val) {
			this.progress = ((val + 1) / this.quesList.length) * 100;
		},
		$route: function(e) {
			//debugger
			// if (e.path == '/schedule-detail') {
			//   this.loadData();
			// }
		},
		upCheckMap(val) {
			// debugger
			this.handleModify(!!val.score || !!val.comment);
		},
	},
	activated() {
		this.currentWork = 0;
		this.workId = this.$route.query.workId;
		this.userId = this.$route.query.userId;
		// this.userName = this.$route.query.stuName;
		this.loadData();

		this.oldPageTitle = document.title;
		document.title = '作业批改';
	},
	deactivated() {
		document.title = this.oldPageTitle;
	},
	beforeRouteLeave(to, from, next) {
		// if(this.upCheckMap.score  || this.upCheckMap.comment){
		//   next(false);
		// }
		// else {
		window.onbeforeunload = null;
		next();
		// }
	},
	beforeRouteUpdate(to, from, next) {
		this.loadData();
		next();
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
			showIframe: false,
			showIframeSrc: false,
			dataModified: false,
			oldPageTitle: '',
			upCheckMap: {
				score: 0,
				comment: '',
			},
			useDefaultUI: true,
			options: {
				/*  cssMaxWidth: document.documentElement.clientWidth,
            cssMaxHeight: document.documentElement.clientHeight,
            selectionStyle: {
              cornerSize: 50,
              rotatingPointOffset: 100
            }*/
				includeUI: {
					loadImage: {
						path: 'https://nhn.github.io/tui.image-editor/latest/examples/img/sampleImage2.png',
						name: 'sampleImage2',
					},
				},
				cssMaxWidth: 700,
				cssMaxHeight: 500,
			},

			currentImg: {},
			currentIndex: 0,
			currentVIndex: 0,
			currentType: '',
			show8: false,
			show1: false,
			dataUrl: '',

			locationLine: '',
			descLine: '',
			wwwUrl: roterPath,
			wwwImgUrl: roterImgPath,
			picRootPath: '',
			rootDomain: window.location.protocol + '//' + window.location.host,
			id: '',
			typeId: '',
			typeCode: '',

			userName: '',
			userId: 0,

			//
			workObj: {},
			detail: {},
			imgObj: {
				content: '',
				serverid: [],
				imgs: [],
			},
			//1.单选 2.多选 3.问答 4.自定义 5.判断 6.填空
			quesTypeView: {
				1: '单选',
				2: '多选',
				3: '问答',
				4: '自定义',
				5: '判断题',
				6: '填空',
			},
			trueList: [],
			currentWork: 0,
			workId: '',
			checkMap: {},
			quesList: [],
			checkList: [],
			showRecording: false,
			progress: 20,
		};
	},

	methods: {
		handleModify(b) {
			this.dataModified = b;

			if (b) {
				window.onbeforeunload = function(e) {
					e.preventDefault();
					e.returnValue = '已有录入数据，确定放弃数据并离开页面？';
				};
			} else {
				window.onbeforeunload = null;
			}
		},
		saveUp(e) {
			let vm = this;
			let quesList = this.quesList;
			let dataList = [];
			for (let i = 0; i < quesList.length; i++) {
				let sWebImgList = quesList[i].sWebImgList || [];

				let sImgList = quesList[i].sImgList || [];

				for (let j = 0; j < sWebImgList.length; j++) {
					if (sWebImgList[j].isEdit) {
						let item = sWebImgList[j];
						let urlList = item.sUrl.split('/');
						let submitUrl = urlList[urlList.length - 1];
						dataList.push({
							id: item.ID,
							type: item.TYPE,
							value: submitUrl,
						});
					}
				}

				for (let j = 0; j < sImgList.length; j++) {
					if (sImgList[j].isEdit) {
						let item = sImgList[j];
						let urlList = item.URL.split('/');
						let submitUrl = urlList[urlList.length - 1];
						dataList.push({
							id: item.ID,
							type: item.TYPE,
							value: submitUrl,
						});
					}
				}
			}

			let details = {
				score: vm.upCheckMap.score,
				comment: vm.upCheckMap.comment,
				dataList: dataList,
			};

			let data = {
				mainId: vm.checkMap.ID,
				imgType: e,
				details: JSON.stringify(details),
			};

			this.$http.post(apiRouter.POST_HOMEWORK_UP_SAVE, data).then(
				(response) => {
					//vm.$vux.loading.hide();
					if (response.body.code == '200') {
						this.upCheckMap = {
							score: 0,
							comment: '',
						};
						if (!response.body.data.studentMap) {
							vm.$vux.toast.text(response.body.message);
							setTimeout(function() {
								vm.goBack();
							}, 500);
						} else {
							let studentMap = response.body.data.studentMap;
							let workId = vm.$route.query.workId;
							vm.currentWork = 0;
							//this.userId = vm.$route.query.userId;
							vm.userId = studentMap.STUDENT_ID;
							vm.$router.push({
								path: '/detail-up',
								query: { userId: studentMap.STUDENT_ID, workId: workId },
							});
						}
					} else {
						vm.$vux.toast.text(response.body.message);
						vm.$vux.loading.hide();
					}
				},
				(response) => {
					alert('请求失败了!!!!');
				}
			);
		},
		rejectUp() {
			let vm = this;
			//dataList:[],
			let quesList = this.quesList;
			let dataList = [];
			for (let i = 0; i < quesList.length; i++) {
				let sWebImgList = quesList[i].sWebImgList || [];

				let sImgList = quesList[i].sImgList || [];

				for (let j = 0; j < sWebImgList.length; j++) {
					if (sWebImgList[j].isEdit) {
						let item = sWebImgList[j];
						let urlList = item.sUrl.split('/');
						let submitUrl = urlList[urlList.length - 1];
						dataList.push({
							id: item.ID,
							type: item.TYPE,
							value: submitUrl,
						});
					}
				}

				for (let j = 0; j < sImgList.length; j++) {
					if (sImgList[j].isEdit) {
						let item = sImgList[j];
						let urlList = item.URL.split('/');
						let submitUrl = urlList[urlList.length - 1];
						dataList.push({
							id: item.ID,
							type: item.TYPE,
							value: submitUrl,
						});
					}
				}
			}

			let details = {
				score: vm.upCheckMap.score,
				comment: vm.upCheckMap.comment,
				dataList: dataList,
			};

			// let data = {
			//   mainId: vm.checkMap.ID,
			//   details: JSON.stringify(details)
			// };
			// debugger;

			let formData = new FormData();
			formData.append('mainId', vm.checkMap.ID);
			formData.append('details', JSON.stringify(details));

			this.$http.post(apiRouter.POST_HOMEWORK_BACK, formData).then(
				(response) => {
					vm.$vux.loading.hide();
					if (response.body.code == '200') {
						vm.$vux.toast.text('发回订正成功！');

						setTimeout(function() {
							// debugger
							vm.upCheckMap.score = 0;
							vm.upCheckMap.comment = '';
							vm.goBack();
						}, 500);
					} else {
						vm.$vux.toast.text(response.body.message);
						vm.$vux.loading.hide();
					}
				},
				(response) => {
					alert('请求失败了!!!!');
				}
			);
		},

		goEdit(i, e, type, parentIndex) {
			// this.show8 = true;
			this.currentImg = e;
			let url = '';

			//let preFix = '/api';
			let preFix = '';
			this.currentType = type;
			this.currentVIndex = i;
			this.currentIndex = parentIndex;
			// debugger;
			if (type == '1') {
				// debugger;
				url = e.sUrl.includes(this.picRootPath)
					? e.sUrl
					: this.picRootPath + e.sUrl;
				//let url = e.sUrl;
			} else {
				url = e.URL.includes(this.picRootPath)
					? e.URL
					: this.picRootPath + e.URL;
			}

			// init editor
			// this.$refs.imgApp.initImg(url);

			let vm = this;
			function openIframe() {
				// window.ifrHandler = vm.$refs.ifr;
				window.ifrLoading = function() {
					vm.$vux.loading.show({
						text: '上传中...',
					});
				};
				window.ifrCommit = function(formData){
					$.ajax({
						url: apiRouter.POST_HOMEWORK_FILE,
						data: formData,
						processData: false,
						contentType: false,
						type: 'POST',
						success: function(resp) {
							window.top.ifrSuccess(resp.data);
						},
					});
				};
				window.ifrSuccess = function(data) {
					vm.$vux.toast.text('图片上传成功!');
					// vm.$emit('finishEdit', data);
					vm.finishEdit(data);
					setTimeout(function() {
						vm.$vux.loading.hide();
						vm.showIframe = false;
					}, 300);
				};
				window.ifrCancel = function(data) {
					vm.showIframe = false;
				};
				window.ifrFail = function(msg) {
					vm.$vux.toast.text(msg);
					vm.$vux.loading.hide();
				};
				vm.showIframeSrc = './static/img_editor_iframe/index.html?img=' + url + '&s=' + Math.random();;
				setTimeout(function() {
					vm.showIframe = true;
				}, 100);
			}

			// debugger
			openIframe();

			//
			// this.$refs.imgApp.initImg('https://picsum.photos/600/900?grayscale');
		},

		finishEdit(e) {
			debugger;
			let detail = this.quesList[this.currentIndex];
			this.currentImg.sUrl = e.url;
			this.currentImg.isEdit = true;
			if (this.currentType == '1') {
				detail.sWebImgList[this.currentVIndex].sUrl = e.url;
			} else {
				detail.sImgList[this.currentVIndex].URL = e.url;
			}
			// this.show8 = false;
		},

		cancelEdit() {
			this.show8 = false;
		},

		onAddText(res) {
			/* eslint-disable no-console */
			console.group('addText');
			console.log('Client Position : ', res.clientPosition);
			console.log('Origin Position : ', res.originPosition);
			console.groupEnd();
			/* eslint-enable no-console */
		},
		onObjectMoved(res) {
			/* eslint-disable no-console */
			console.group('objectMoved');
			console.log('Left : ', res.left);
			console.log('Top : ', res.top);
			console.groupEnd();
			/* eslint-enable no-console */
		},
		showImg(sampleImage) {
			this.$router.push({ path: '/img-pxy', query: { imgUrl: sampleImage } });
			//this.$router.push({path:'/img-pxy',query: {imgUrl:sampleImage}})
		},
		// initImg(sampleImage){
		//   let imageEditor = this.$refs.tuiImageEditor.editorInstance;
		//   imageEditor.loadImageFromURL(sampleImage, 'SampleImage').then(function() {
		//     imageEditor.clearUndoStack();
		//   });
		// },
		saveUrlData() {
			let imageEditor = this.$refs.tuiImageEditor.editorInstance;
			let dataURL = imageEditor.toDataURL();
			this.dataUrl = dataURL;
			this.show1 = false;
		},
		showImgNext() {
			// debugger;
			this.show8 = true;
		},
		//------------------------------------
		async goBack() {
			// debugger
			if (this.upCheckMap.score || this.upCheckMap.comment) {
				let answer = await Dialog.confirm({
					className: 'dy-rate-dialog',
					title: '关闭页面提醒',
					message: '页面已录入部分数据，关闭页面后数据将被清空。',
					confirmButtonText: '确定',
					messageAlign: 'left',
				});
				if (answer === 'confirm') {
					this.$router.push({ path: '/check-work-list?id=' + this.workId });
				}
			} else {
				this.$router.push({ path: '/check-work-list?id=' + this.workId });
			}
		},
		preWork() {
			let currentWork = this.currentWork;
			if (currentWork > 0) {
				this.currentWork = currentWork - 1;
			}
			window.scrollTo(0, 0);
		},
		nextWork() {
			let currentWork = this.currentWork;
			if (currentWork < this.quesList.length - 1) {
				this.currentWork = currentWork + 1;
			}
			window.scrollTo(0, 0);
		},
		nextComment() {
			let currentWork = this.currentWork;
			if (currentWork < this.quesList.length) {
				this.currentWork = currentWork + 1;
				let _this = this;
				this.$refs.wkment.loadData({
					WORKID: _this.checkMap.WORK_ID,
					ANID: _this.checkMap.ID,
				});
			}
		},

		//上传图片
		onClickUpActivity() {
			console.log('onClickUpActivity');
			let _this = this;
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					if (window.__wxjs_is_wkwebview) {
						console.log('>>>>>>>>>>window.__wxjs_is_wkwebview!!!');
						_this.wxGetLocalImgDataActivity(localIds); //todo
					} else {
						console.log('>>>>>>>>>>not----window.__wxjs_is_wkwebview!!!');
						localIds.forEach((item, index) => {
							_this.actLocalIdImgs.push(item);
							if (_this.actLocalIdImgs.length >= _this.actImgaesMaxLenght) {
								_this.actImgLenght = false;
							}
						});
					}
					_this.wxUploadImageActivity(localIds); //todo
				},
				fail: function(res) {
					console.log('活动上传失败');
				},
			});
		},
		//
		wxUploadImageActivity(localIds) {
			let _this = this;
			let i = 0;
			let length = localIds.length;
			let upload = function() {
				let loacId = localIds[i];
				if (window.__wxjs_is_wkwebview) {
					if (loacId.indexOf('wxlocalresource') != -1) {
						loacId = loacId.replace('wxlocalresource', 'wxLocalResource');
					}
				}
				wx.uploadImage({
					localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function(res) {
						let serverId = {
							id: '',
							serverid: res.serverId,
						};
						_this.actServerId.push(serverId);
						i++;
					},
					fail: function(error) {
						alert('上传活动图片失败');
					},
				});
			};
			upload();
		},
		//
		wxGetLocalImgDataActivity(localIds) {
			let _this = this;
			let i = 0;
			let length = localIds.length;
			let upload = function() {
				wx.getLocalImgData({
					localId: localIds[i], // 图片的localID
					success: function(res) {
						let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
						localData = localData.replace('jgp', 'jpeg');
						_this.actLocalIdImgs.push(localData);
						if (_this.actLocalIdImgs.length >= _this.actImgaesMaxLenght) {
							_this.actImgLenght = false;
						}
						i++;
					},
				});
			};
			upload();
		},

		previewImage(url, imgList) {
			//console.info(url);
			let urls = [];
			for (let i = 0; i < imgList.length; i++) {
				urls.push(this.picRootPath + imgList[i].URL);
			}

			wx.previewImage({
				current: url, // 当前显示图片的http链接
				urls: urls, // 需要预览的图片http链接列表
			});
		},

		clodesdActivity(index) {
			let _this = this;
			_this.removeByValue(_this.actLocalIdImgs, index);
			_this.removeByValue(_this.actServerId, index);
			if (_this.actLocalIdImgs.length < _this.actImgaesMaxLenght) {
				_this.actImgLenght = true;
			}
		},
		onClickLeft() {
			this.$router.go(-1);
		},
		loadData() {
			this.upCheckMap = {
				score: 0,
				comment: '',
			};

			let _this = this;
			this.$http
				.get(apiRouter.GET_HOMEWORK_UP_ANSWER + '?workId=' + _this.workId + '&userId=' + _this.userId)
				.then(
					(response) => {
						if (response.status === 200) {
							//debugger;
							_this.userName = response.body.data.STUDENT_SHOW_NAME + '的作业';
							_this.picRootPath = response.body.data.PIC_ROOTPATH;
							_this.workObj = response.body.data.hkMap;
							_this.checkMap = response.body.data.checkMap || {};
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
									case '1':
										break;
									//多选
									case '2':
										item.answer = item.STUANSWER[0].ANSWER.split(',');
										break;
									//判断题
									case '5':
										break;
									//填空 todo
									case '6':
										let tAnswer = item.ANS_CONTENT.split(',');
										let sAnswerList = item.STUANSWER[0].ANSWER.split(',');
										item.sAnswerList = sAnswerList;
										item.tAnswer = tAnswer;
										break;
									// //问答 //自定义  ("3" || "4"):
									default:
										item.sImgList = [];
										item.sVoiceList = [];
										item.sWebImgList = [];
										item.sWebFileList = [];
										for (let i = 0; i < item.STUANSWER.length; i++) {
											let ansObj = item.STUANSWER[i];
											if (ansObj.TYPE == '') {
												item.answer = ansObj.ANSWER;
											} else if (ansObj.TYPE == '1') {
												item.sImgList.push(ansObj);
											} else if (ansObj.TYPE == '2') {
												item.sVoiceList.push(ansObj);
											} else if (ansObj.TYPE == '3') {
												let urlList = ansObj.ANSWER.split(';');
												ansObj.sName = urlList[0];
												ansObj.sUrl = urlList[1];
												item.sWebImgList.push(ansObj);
											} else if (ansObj.TYPE == '4') {
												let urlList = ansObj.ANSWER.split(';');
												ansObj.sName = urlList[0];
												ansObj.sUrl = urlList[1];
												item.sWebFileList.push(ansObj);
											}
										}
								}
							}
							_this.quesList = quesList;
						}
					},
					(response) => {
						alert('请求失败了!!!!');
					}
				);
		},
		loadDataNext(data) {
			this.workId = this.$route.query.workId;
			this.userId = this.$route.query.userId;

			let _this = this;

			//debugger; // _this.picRootPath = response.body.data.PIC_ROOTPATH;
			// _this.workObj = response.body.data.hkMap;
			// _this.checkMap = response.body.data.checkMap || {};
			// let quesList = response.body.data.quesList;
			// if(quesList.length == 1){
			//   _this.progress = 100;
			// }else {
			//   _this.progress = 20;
			//
			// }
			// //debugger;
			// //根据类型set答案字段
			// for (let i = 0; i < quesList.length; i++) {
			//   let item = quesList[i];
			//   //debugger;
			//   switch (item.QUESTYPE) {
			//     //单选
			//     case "1":
			//       break;
			//     //多选
			//     case "2":
			//       item.answer = item.STUANSWER[0].ANSWER.split(',');
			//       break;
			//     //判断题
			//     case "5":
			//       break;
			//     //填空 todo
			//     case "6":
			//       let tAnswer = item.ANS_CONTENT.split(",");
			//       let sAnswerList = item.STUANSWER[0].ANSWER.split(",");
			//       item.sAnswerList = sAnswerList;
			//       item.tAnswer = tAnswer;
			//       break;
			//     // //问答 //自定义  ("3" || "4"):
			//     default:
			//       item.sImgList = [];
			//       item.sVoiceList = [];
			//       item.sWebImgList = [];
			//       item.sWebFileList = [];
			//       for(let i = 0;i<item.STUANSWER.length;i++){
			//         let ansObj = item.STUANSWER[i];
			//         if(ansObj.TYPE == ""){
			//           item.answer = ansObj.ANSWER;
			//         }else if(ansObj.TYPE == "1"){
			//           item.sImgList.push(ansObj)
			//         }else if (ansObj.TYPE == "2"){
			//           item.sVoiceList.push(ansObj)
			//         }else if (ansObj.TYPE == "3"){
			//           let urlList = ansObj.ANSWER.split(";");
			//           ansObj.sName = urlList[0];
			//           ansObj.sUrl = urlList[1];
			//           item.sWebImgList.push(ansObj)
			//         }else if (ansObj.TYPE == "4"){
			//           let urlList = ansObj.ANSWER.split(";");
			//           ansObj.sName = urlList[0];
			//           ansObj.sUrl = urlList[1];
			//           item.sWebFileList.push(ansObj)
			//         }
			//       }
			//   }
			// }
			// _this.quesList = quesList;
		},
		//@@@@@@@@@@@@@@@@@@@@@@@@   录音 start   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		startVoice(detail) {
			console.log('startVoice');
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
				complete: function(res) {
					let localId = res.localId;
					alert('时间超过60秒,已自动保存！');
					self.uploadVoice(localId, detail.voiceList);
				},
			});
			//$('body').append('<span id="recording" class="recording-show"></span>');
		},
		endVoice(detail) {
			console.log('endVoice');
			let voiceList = detail.voiceList;
			window.clearInterval(this.voiceTimer);
			let self = this;
			//$('#recording').remove();
			this.showRecording = false;
			wx.stopRecord({
				success: function(res) {
					//isrecording = false;
					//self.recordComplete(res.localId, id, recordtime);
					self.uploadVoice(res.localId, voiceList);
				},
			});
		},
		uploadVoice(localId, voiceList) {
			let self = this;
			//self.g_param.isuploadcomplete = false;
			console.log('voice-upload：');
			console.log(JSON.stringify(voiceList));
			let second = 60 - self.voiceSecond;
			if (second == 0) second = 1;
			let voiceObj = { localId: localId, second: second };
			voiceList.push(voiceObj);
			wx.uploadVoice({
				localId: localId,
				isShowProgressTips: 1, // 默认为1，显示进度提示
				success: function(res) {
					console.log('voice-upload：@@@@@@@@@@@');
					console.log(res);
					voiceObj.serverId = res.serverId;
					//返回音频的服务器端ID
					//$container.find('.qs-voice').eq($container.find('.qs-voice').length - 1).find('input').val(res.serverId);
					//self.g_param.isuploadcomplete = true;
					console.log(res);
				},
			});
		},
		playVoice(url) {
			let mp3 = new Audio(url);
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
				localId: localId, // 需要停止的音频的本地ID，由stopRecord接口获得
			});
		},
		translateVoice(localId) {
			wx.translateVoice({
				localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
				isShowProgressTips: 1, // 默认为1，显示进度提示
				success: function(res) {
					alert(res.translateResult); // 语音识别的结果
				},
			}); //设备信息
		},
		//@@@@@@@@@@@@@@@@@@@@@@@@   录音 end   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		getUrlConfigTrue() {
			let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath);
			this.$http.get(wiexin).then(
				(response) => {
					let data = response.body;
					wx.config({
						// debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
						timestamp: data.timestamp, // 必填，生成签名的时间戳
						nonceStr: data.nonceStr, // 必填，生成签名的随机串
						signature: data.signature, // 必填，签名，见附录1
						jsApiList: [
							'chooseImage',
							'uploadImage',
							'downloadImage',
							'getLocalImgData',
							'previewImage',
							'chooseWXPay',
							'startRecord',
							'stopRecord',
							'onVoiceRecordEnd',
							'uploadVoice',
							'downloadVoice',
							'playVoice',
							'stopVoice',
							'translateVoice',
						], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.error(function(res) {
						//   alert(res)
					});
				},
				(response) => {
					// console.log("请求失败了!!!!")
				}
			);
		},
		getUrlConfig() {
			let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath);
			this.$http.get('/ua-service/wx/token?url=' + 'http://web.pxy.com/#/work-detail').then(
				(response) => {
					let info = response.body.data;
					wx.config({
						debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: info.appId, // 必填，公众号的唯一标识
						timestamp: info.timestamp, // 必填，生成签名的时间戳
						nonceStr: info.nonceStr,
						signature: info.signature, // 必填，签名
						jsApiList: [
							'chooseImage',
							'uploadImage',
							'downloadImage',
							'getLocalImgData',
							'previewImage',
							'chooseWXPay',
							'startRecord',
							'stopRecord',
							'onVoiceRecordEnd',
							'uploadVoice',
							'downloadVoice',
							'playVoice',
							'stopVoice',
							'translateVoice',
						], // 必填，需要使用的JS接口列表
					});
				},
				(response) => {
					alert('请求失败了!!!!');
				}
			);
		},
	},
};
</script>



<style lang="less" type="text/less" scoped>
@import '../../style/minxin.less';
@import '../../style/detail.less';

html,
body {
	background: #f2f2f2;
	overflow: hidden;
}

.lqt-container {
	top: 0;
	bottom: 45px;
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
	max-width: 50%;
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
	font-family: 'icon';
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
	background-image: url('/static/work/camera.png');
	background-size: cover;
}

.homework-container .qs-bar .btn-voice {
	float: left;
	margin-left: 22px;
	background: #2782d7;
	background-image: url('/static/work/voice.png');
	background-size: cover;
}

.homework-container .qs-answer {
	padding-top: 10px;
}

.homework-container .qs-voice-icon {
	font-family: 'icon';
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
	background: url('../../assets/question/radio-on-new.png') no-repeat;
	background-size: contain;
	width: 0.9rem;
	height: 0.9rem;
	display: inline-block;
	vertical-align: bottom;
}

.demo3-item-selected .demo3-item-default {
	background-image: url('../../assets/question/radio-on.png');
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
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100 / @baseSize;
	line-height: 100 / @baseSize;
	z-index: 1;
	border-bottom: solid 1px #dedede;
	padding-bottom: 100 / @baseSize;
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

.answer-img {
	width: 6em;
	right: 1em;
	position: absolute;
	bottom: 1em;
}

.sub-content /deep/ img {
	max-width: 100%;
	/*max-height: 200px;*/
}

.homework-answer /deep/ img {
	max-width: 100%;
}

.other-ans-img /deep/ img {
	max-width: 100%;
}

.teacher-img-list img {
	/* border: 1px blue solid;*/
	width: 49%;
	-webkit-user-select: none;
	user-select: none;
	-webkit-touch-callout: none;
}

.teacher-img-list p {
	height: 110px;
	width: 31%;
	display: inline-block;
	margin-right: 3px;
}

.vux-x-icon {
	fill: #dedede;
}

.voice-play {
	display: inline-block;
	background-color: #03a9f4;
	height: 2em;
	border-radius: 5px;
	width: 5em;
	margin-bottom: 5px;
}

.voice-ready {
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

.imageEditorApp {
	width: 100%;
	height: 800px;
}

.rev-btn {
	background-color: white;
	border-radius: 99px;
	color: #414141;
}
</style>

<style lang="less">
.dy-rate-tab {
	.van-tab--active {
		.van-tab__text {
			font-size: 14px;
			color: #48b319;
		}
	}

	.van-tabs__line {
		width: 50%;
		background-color: #48b319;
	}
}

.dy-rate-dialog {
	border-radius: 6px;

	.van-dialog__header {
		font-weight: bold;
	}
	.van-dialog__message {
		font-size: 16px;
		font-weight: normal;
		color: #333;
	}

	.van-button__text {
		font-weight: bold;
	}
	.van-dialog__confirm {
		// color: #ED561B;
	}
}
.van-picker__confirm {
	font-size: 16px;
	color: #333;
}
</style>
