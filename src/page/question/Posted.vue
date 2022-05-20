<template>
	<div class="box">
		<!-- 返回组件 -->
		<back-title-bar title="发问卷" />
		<div class="wapper">
			<div class="form-info clearfix">
				<!--<p class="cancel-btn" @click="cancel()">取消发布</p>-->
				<!--<form action="/" method="post">-->
				<div class="scope clearfix">
					<div @click="goBackType()">
						<cell class="scope-box" title="问卷类型" :value="qType.objectName" is-link></cell>
					</div>
				</div>
				<div class="scope clearfix">
					<div @click="goBack()">
						<cell class="scope-box" title="问卷对象范围" :value="objType.showName" is-link></cell>
					</div>
					<!--<input type="hidden" name="type" v-model="type">-->
					<input type="hidden" name="objectId" v-model="objectId" />
					<div class="span-cell clearfix">
						<span v-for="(item,index) in scope" :key="index">{{item}}</span>
					</div>
					<!-- <input type="hidden" name="userList" v-model="userList">-->
				</div>

				<div class="scope clearfix" style="border-top: 0px" v-if="qType.type != '300'">
					<div @click="showEnd = true">
						<cell class="scope-box" title="问卷截止时间" :value="postObj.closeTime"></cell>
					</div>
				</div>

				<div class="scope clearfix" style="border-top: 0px" v-if="qType.type == '300'">
					<div @click="showBegin = true">
						<cell class="scope-box" title="报名开始时间" :value="postObj.openTime"></cell>
					</div>
					<div @click="showEnd = true" style="border-top: 1px solid #DDDDDD;">
						<cell class="scope-box" title="报名结束时间" :value="postObj.closeTime"></cell>
					</div>
				</div>

				<div :class="qType.type == '300'|| qType.type == '400' ? 'scope-title-box':'' ">
					<p class="scope-title">{{titleView[qType.type]}}</p>
					<!--qType.type == '300'?20:-->
					<x-textarea
						:max="100"
						@on-focus="onEvent('focus')"
						@on-blur="onEvent('blur')"
						class="x-textarea"
						:placeholder="titlePlaceholder[qType.type]"
						:rows="3"
						v-model="postObj.title"
					></x-textarea>
				</div>

				<div class="scope-title-box" style="border-bottom-width: 0;" v-if="qType.type == '300'">
					<p class="scope-title">活动详细内容</p>
					<x-textarea
						:max="500"
						@on-focus="onEvent('focus')"
						@on-blur="onEvent('blur')"
						class="x-textarea"
						placeholder="请输入活动的详细说明内容，比如活动地点、活动形式、报名要求等。"
						:rows="3"
						v-model="postObj.content"
					></x-textarea>
				</div>

				<div
					class="accessory-box"
					style="border-bottom-width:0px"
					v-if="qType.type == '100' || qType.type == '200'"
				>
					<p class="accessory-title">选项设置</p>
					<div style="text-align: right" v-for="(item1,index1) in optionList" v-bind:key="index1">
						<div
							class="accessory-img clearfix img-content"
							style="width: 90%;display: inline-block;vertical-align: bottom;"
						>
							<ul class="photo-img">
								<li style="margin-top: 17px;" v-for="(item,index) in item1.imgs" :key="index">
									<img :src="item" alt class="imgud" />
									<img src="../../assets/cancel.png" alt class="cancel" @click="clodesd(item1)" />
								</li>
							</ul>
							<a
								class="up-photo"
								href="javascript:;"
								@click="onClickUp(item1)"
								style="margin-top: 17px;"
								v-show="item1.imgs && item1.imgs.length == 0"
							>
								<img src="../../assets/camera.png" alt />
							</a>
							<x-textarea
								:max="100"
								@on-focus="onEvent('focus')"
								@on-blur="onEvent('blur')"
								class="x-textarea"
								:placeholder="'请输入选项的内容'+(index1+1)"
								:rows="3"
								v-model="item1.content"
							></x-textarea>
						</div>
						<div
							style="width: 8%;display: inline-block;vertical-align: super;"
							:style="index1 != optionList.length-1?'lineHeight:3.5rem':'height: 3.2rem;'"
						>
							<img style="width: 1rem" @click="subRow(index1)" src="../../assets/question/sub.png" />
							<img
								style="width: 1rem"
								v-show="index1 == optionList.length-1"
								@click="addRow()"
								src="../../assets/question/plus.jpg"
							/>
						</div>
					</div>
				</div>

				<div class="scope clearfix" style="border-width: 0;" v-if="qType.type == '200'">
					<x-number :min="2" class="type-input" title="最多可选几项" v-model="maxSelected"></x-number>
				</div>

				<div class="accessory-box" v-if="qType.type == '300'">
					<p class="accessory-title">活动配图</p>
					<div
						class="accessory-img clearfix"
						style="width: 90%;display: inline-block;vertical-align: bottom;padding: 15px 10px 7px 17px;"
					>
						<ul class="photo-img" style="margin-bottom: 0">
							<li v-for="(item,index) in actLocalIdImgs" :key="index">
								<img :src="item" alt class="imgud" />
								<img src="../../assets/cancel.png" alt class="cancel" @click="clodesdActivity(index)" />
							</li>
							<li>
								<a
									class="up-photo"
									style="margin-left: 0"
									href="javascript:;"
									@click="onClickUpActivity()"
									v-show="actLocalIdImgs.length == 0"
								>
									<img src="../../assets/camera.png" alt />
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div class="scope clearfix" style="border-top: 0px" v-if="qType.type == '300'">
					<x-number
						:min="1"
						:max="999"
						:fillable="true"
						class="type-input"
						title="最大报名人数"
						v-model="maxPeople"
					></x-number>
				</div>

				<div class="scope-title-box" style="border-bottom-width: 0;" v-if="qType.type == '300'">
					<p class="scope-title">
						报名信息输入框
						<img class="right-link" @click="changeDescFlag" :src="onOffImg[this.postObj.descFlag]" />
					</p>

					<x-textarea
						@on-focus="onEvent('focus')"
						@on-blur="onEvent('blur')"
						class="x-textarea"
						:readonly="postObj.descFlag == '1' ? false:'readonly'"
						placeholder="请输入所需获取信息的提示语（例如：请填写手机号码）"
						:rows="3"
						v-model="postObj.descInfo"
					></x-textarea>
				</div>

				<div v-if="qType.type == '300' && postObj.descFlag == '1'">
					<p class="scope-title">
						报名信息必填
						<img class="right-link" @click="changeBmbtFlag" :src="onOffImg[this.bmbt]" />
					</p>
				</div>

				<div class="scope-title-box" style="border-bottom-width: 0;" v-if="qType.type != '300'">
					<p class="scope-title">
						文字输入框
						<img class="right-link" @click="changeDescFlag" :src="onOffImg[this.postObj.descFlag]" />
					</p>
					<x-textarea
						:max="20"
						@on-focus="onEvent('focus')"
						@on-blur="onEvent('blur')"
						class="x-textarea"
						:readonly="postObj.descFlag == '1' ? false:'readonly'"
						:placeholder="descPlaceholder[qType.type]"
						:rows="3"
						v-model="postObj.descInfo"
					></x-textarea>
				</div>

				<div class="scope-title-box" style="border-bottom-width: 0;" v-if="qType.type != '300'">
					<p class="scope-title">
						匿名问卷
						<img class="right-link" @click="changeHideFlag" :src="onOffImg[this.hideFlag]" />
					</p>

					<x-textarea
						@on-focus="onEvent('focus')"
						@on-blur="onEvent('blur')"
						class="x-textarea"
						:readonly="'readonly'"
						placeholder="启动匿名模式，将保护填报人的个人信息私隐。"
						:rows="3"
					></x-textarea>
					<!--<input type="hidden" name="title" v-model="titleValue">-->
				</div>

				<!--<button
      @click="goUploder()"
      class="btn-uploder right"
      type="submit"
    >提交
				</button>-->

				<x-button
					v-on:click.native="goUploder"
					:show-loading="showLoading"
					:disabled="showLoading"
					class="btn-uploder right"
					type="submit"
				>提交</x-button>

				<toast
					v-model="showPositionValue"
					type="text"
					:time="800"
					is-show-mask
					:position="position"
				>{{toastMessage}}</toast>

				<!-- </form>-->

				<van-popup class="schedule-datetime-picker" v-model="showEnd" position="bottom">
					<van-datetime-picker
						v-model="currentDateAfter"
						type="datetime"
						@cancel="showEnd = false"
						@confirm="endConfirm"
						:title="currentDateAfter.format('yyyy-MM-dd hh:mm')"
					/>
				</van-popup>

				<van-popup class="schedule-datetime-picker" v-model="showBegin" position="bottom">
					<van-datetime-picker
						v-model="currentDate"
						type="datetime"
						@cancel="showBegin = false"
						@confirm="beginConfirm"
						:title="currentDate.format('yyyy-MM-dd hh:mm')"
					/>
				</van-popup>

				<div v-transfer-dom>
					<confirm v-model="showDel" :title="'确认删除吗？'" @on-cancel="onCancel" @on-confirm="onConfirm">
						<!--<p style="text-align:center;">{{ 'Are you sure?'}}</p>-->
					</confirm>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import BackTitleBar from "../../components/common/BackTitleBar.vue";
import {
  Datetime,
  Toast,
  Checker,
  CheckerItem,
  Group,
  XAddress,
  XTextarea,
  ChinaAddressV3Data,
  XButton,
  Cell,
  Radio,
  Value2nameFilter as value2name,
  XNumber,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import { Popup } from "vant";
import DatetimePicker from "../../components/datetime-picker";
//import 'vant/lib/vant-css/index.css';
import "vant/lib/index.css";

import wx from "weixin-js-sdk";
import { getSelectDates, nDayLaterDate } from "../../utils/DateUtils";
import apiRouter from "../../config/api.js";

export default {
  directives: {
    TransferDom
  },
  components: {
    BackTitleBar,
    Datetime,
    Toast,
    Group,
    XAddress,
    Cell,
    XButton,
    XTextarea,
    Checker,
    CheckerItem,
    Radio,
    XNumber,
    Confirm,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker
  },
  created: function() {
    //getSelectDates();
    //timeData()
    this.showTop();
    this.localIdImgs = [];
  },
  data() {
    return {
      deleteIndex: 0,
      showDel: false,

      //提交按钮状态
      showLoading: false,
      //标题的placeholder
      titleView: {
        100: "单选问卷标题",
        200: "多选问卷标题",
        300: "活动标题",
        400: "评价打分标题"
      },
      //标题的placeholder
      titlePlaceholder: {
        100: "请输入问卷问题的文字内容",
        200: "请输入问卷问题的文字内容",
        300: "请输入活动的名称（例如：2019年元宵晚会）",
        400: "请输入对于评价打分的文字说明"
      },
      //
      descPlaceholder: {
        100: "可开启文字输入框，提示用户输入文字以获取其他所需要的内容，例如手机号码、服装尺寸等。",
        200: "可开启文字输入框，提示用户输入文字以获取其他所需要的内容，例如手机号码、服装尺寸等。",
        300: "请输入活动的详细说明内容，比如活动地点、活动形式、报名要求等。",
        400: "可开启文字输入框，提示用户输入文字以获取其他所需要的内容，例如手机号码等。"
      },
      //时间
      showBegin: false,
      showEnd: false,
      currentDate: new Date(),
      currentDateAfter: new Date(),
      //时间

      qType: {
        type: "",
        objectName: ""
      },
      //roterImgPath+
      onOffImg: {
        1: roterImgPath + "/static/question/switch-on.png",
        0: roterImgPath + "/static/question/switch-off.png"
      },
      postObj: {
        objectId: "",
        objectName: "",
        title: "",
        descFlag: "1",
        descInfo: "",
        openTime: new Date().format("yyyy-MM-dd hh:mm"),
        closeTime: new Date().format("yyyy-MM-dd hh:mm"),
        optionList: "",
        examenObj: "",
        hideFlag: "0",
        descRequired: "0" //补充内容必填标志
      },
      //descFlag:'1',
      hideFlag: "0",
      optionList: [
        {
          content: "",
          serverid: [],
          imgs: []
        },
        {
          content: "",
          serverid: [],
          imgs: []
        }
      ],

      //上传图片 start
      imgLenght: true,
      imgaesMaxLenght: 9,
      localIdImgs: [],
      serverId: [],
      localData: [],
      //上传图片 end

      //活动配图上传
      actLocalIdImgs: [],
      actImgLenght: true,
      actImgaesMaxLenght: 9,
      actServerId: [],
      actLocalData: [],
      //活动配图上传

      maxSelected: 2,
      maxPeople: 10,

      images: {
        localId: [],
        serverId: []
      },
      radio: ["允许", "不允许"],
      radioValue: "允许",

      itemId: "",

      objType: {
        type: "",
        objectId: "",
        objectName: ""
      },
      userList: [],

      type: "",
      objectId: "",
      noticeTime: "",
      urlPath: "",
      commentFlag: true,
      objectName: "",
      allow: 0,
      scope: [],
      titleValue: "",
      contentValue: "",
      showPositionValue: false,
      showToast: true,
      position: "default",
      toastMessage: "",
      title: "时间选择",
      title2: "通知发送时间",
      timeData: ["今天", "立刻发送"],
      isBack: ["允许", "不允许"],
      addressData: getSelectDates(),
      showAddress: false,

      bmbt: "0"
    };
  },

  computed: {
    ...mapGetters([
      "spaceStore",
      "optionalStore",
      "curriculumStore",
      "gradeStore",
      "schoolStore",
      "messageStore"
    ])
  },
  activated() {
    this.showTop();
    this.localIdImgs = [];
    this.titleValue = "";
    this.contentValue = "";
    let path = this.$route.query.path;
    let stringStore = JSON.stringify(this.spaceStore);
    let stringArray = this.spaceStore;
    if (stringStore === "[]" && stringStore.length === 2) {
      this.userList = JSON.parse(window.localStorage.getItem(path));
      //JSON.parse(window.localStorage.SPACE);
      this.qType = JSON.parse(window.localStorage.getItem("q-type"));
      this.objType = JSON.parse(window.localStorage.getItem("q-scope"));
      this.objType.objectId = this.objType.objectId;
      this.objType.objectName = this.objType.objectName;
      this.objType.showName = this.objType.showName;
      this.scope = [];
      this.userList.forEach((item, index) => {
        this.scope.push(item.toName);
      });
    } else {
      this.userList = JSON.parse(window.localStorage.getItem(path));
      //this.userList = JSON.parse(window.localStorage.SPACE);
      this.qType = JSON.parse(window.localStorage.getItem("q-type"));
      this.objType = JSON.parse(window.localStorage.getItem("q-scope"));
      this.objType.objectId = this.objType.objectId;
      this.objType.showName = this.objType.showName;
      this.objType.objectName = this.objType.objectName;
      this.scope = [];
      stringArray.forEach((item, index) => {
        this.scope.push(item.toName);
      });
    }

    if (this.localIdImgs.length >= this.imgaesMaxLenght) {
      this.imgLenght = false;
    } else {
      this.imgLenght = true;
    }

    ////
    this.currentDate = new Date();
    this.currentDate.setMinutes(0);
    this.currentDate = new Date(this.currentDate.getTime() + 3600 * 1000);
    this.postObj.openTime = this.currentDate.format("yyyy-MM-dd hh:mm");
    this.currentDateAfter = nDayLaterDate(new Date(), 3);
    this.currentDateAfter.setHours(23);
    this.postObj.closeTime = this.currentDateAfter.format("yyyy-MM-dd hh:mm");
  },

  mounted() {
    this.localIdImgs = [];
    this.urlPath = window.location.href.split("#")[0];
    this.getUrlConfig();
  },
  methods: {
    //文字输入框的改变
    changeDescFlag() {
      if (this.postObj.descFlag == "1") {
        this.postObj.descFlag = "0";
      } else {
        this.postObj.descFlag = "1";
      }
    },
    changeHideFlag() {
      if (this.hideFlag == "1") {
        this.hideFlag = "0";
        this.postObj.hideFlag = "0";
      } else {
        this.hideFlag = "1";
        this.postObj.hideFlag = "1";
      }
    },

    changeBmbtFlag() {
      if (this.bmbt == "1") {
        this.bmbt = "0";
        this.postObj.descRequired = "0";
      } else {
        this.bmbt = "1";
        this.postObj.descRequired = "1";
      }
    },

    addRow() {
      this.optionList.push({
        content: "",
        serverid: [],
        imgs: []
      });
    },

    onCancel() {
      this.showDel = false;
    },

    onConfirm() {
      let index = this.deleteIndex;
      if (this.optionList.length == 1) {
        this.toastMessage = "当前选项无法删除";
        this.showPositionValue = true;
      } else {
        this.optionList.splice(index, 1);
      }
    },

    subRow(index) {
      this.showDel = true;
      this.deleteIndex = index;
    },

    showTop() {
      window.scrollTo(0, 0);
    },

    goBack() {
      if (this.$route.query.path === "Message") {
        return;
      } else {
        this.$router.go(-1);
      }
    },

    goBackType() {
      this.$router.push({ path: "q-type-m" });
    },

    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      var time = new Date(parseInt(shijianchuo));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + "-" + this.add0(m) + "-" + this.add0(d);
    },

    change(value, label) {
      //  console.log('change:', value, label)
    },
    goUploder(position, msg) {
      this.showLoading = true;
      if (this.allow === 0) {
        this.commentFlag = true;
      } else {
        this.commentFlag = false;
      }

      let data = this.format(this.timeData[0]);
      let time = this.timeData[1];
      let dataDatime = data + " " + time;

      /*if (this.titleValue === "") {
          this.position = position
          this.toastMessage = "请填写标题"
          this.showPositionValue = true
        } else if (this.contentValue === "") {
          this.position = position
          this.toastMessage = "请填写内容"
          this.showPositionValue = true
        } else {
        //    console.log(this.userList);return
          let sendObj = {
            id:this.itemId,
            type: this.objType.type,
            objectId: this.objType.objectId,
            title: this.titleValue,
            content: this.contentValue,
            commentFlag: this.commentFlag,
            noticeTime: dataDatime,
            userList: JSON.stringify(this.userList),
            imgList: JSON.stringify(this.serverId)

          }*/
      //  console.log(JSON.stringify(sendObj))
      let qType = this.qType;
      let _this = this;
      let sendObj = this.postObj;
      sendObj.objectId = this.objType.objectId;
      sendObj.objectName = this.objType.objectName;
      sendObj.examenObj = JSON.stringify(this.userList);

      let url;
      if (qType.type == "100") {
        if (!this.checkOptionList()) {
          return;
        }
        url = apiRouter.POST_QUESTION_PUBLISH100;
      } else if (qType.type == "200") {
        if (!this.checkOptionList()) {
          return;
        }
        sendObj.maxSelected = this.maxSelected;
        url = apiRouter.POST_QUESTION_PUBLISH200;
      } else if (qType.type == "300") {
        url = apiRouter.POST_QUESTION_PUBLISH300;
        sendObj.maxPeople = this.maxPeople;
        if (this.actServerId.length > 0) {
          sendObj.imgServerId = this.actServerId[0].serverid;
        }
        if (sendObj.content == undefined || sendObj.content.trim() == "") {
          alert("请填写活动详细内容");
          this.showLoading = false;
          return;
        }
        delete sendObj.optionList;
      } else if (qType.type == "400") {
        url = apiRouter.POST_QUESTION_PUBLISH400;
        delete sendObj.optionList;
      } else {
        alert("类型错误");
        this.showLoading = false;
      }

      sendObj.optionList = JSON.stringify(this.optionList);

      _this.$http.post(url, sendObj).then(
        response => {
          if (response.body.status === 200) {
            //_this.position = position
            _this.toastMessage = "提交成功";
            //response.body.message
            _this.showPositionValue = true; //schedule
            /*setTimeout(_this.backHome, 1200)*/ setTimeout(function() {
              _this.showLoading = false;
              _this.$router.push({ path: "qa_list_up" });
            }, 1200);
          } else {
            //_this.position = position
            _this.toastMessage = response.body.message.replace("。", "");
            _this.showPositionValue = true;
            this.showLoading = false;
          }
        },
        error => {
          //_this.position = position
          _this.toastMessage = response.body.message;
          _this.showPositionValue = true;
          this.showLoading = false;
        }
      );
    },

    checkOptionList() {
      let optionList = this.optionList;
      for (let i = 0; i < optionList.length; i++) {
        if (!optionList[i].content && optionList[i].serverid.length == 0) {
          this.toastMessage = "选项不可为空(图片或文字)";
          this.showPositionValue = true;
          this.showLoading = false;
          return false;
        }
        if (!optionList[i].content) {
          optionList[i].content = "选项" + (i + 1);
        }
      }
      return true;
    },
    backHome() {
      //  this.$router.replace("/")
      window.location.replace(roterPath + "/weixin/wechat/dist/index.jsp");
      //  this.deleteLocalStorage()
    },
    cancel() {
      //  this.$router.push({path: "/"})
      this.$router.go(-1);
      //window.location.href = roterPath + "/weixin/wechat/dist/index.jsp#/"
    },
    /* deleteLocalStorage(){
         localStorage.removeItem('type');
         localStorage.removeItem('SPACE');
         localStorage.removeItem('OPTIONAL');
         localStorage.removeItem('CURRICULUM');
         localStorage.removeItem('GRADE');
         localStorage.removeItem('MESSAGE');
       },*/
    onEvent(event) {
      //   console.log('on', event)
    },

    // 获取 微信接口 config 的配置参数
    getUrlConfig() {
      let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath);
      this.$http.get(wiexin).then(
        response => {
          let data = response.body;
          wx.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              "chooseImage",
              "uploadImage",
              "downloadImage",
              "getLocalImgData",
              "previewImage",
              "chooseWXPay"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function(res) {
            //   alert(res)
          });
        },
        response => {
          // console.log("请求失败了!!!!")
        }
      );
    },
    // 上传图片
    onClickUp(item1) {
      let _this = this;

      setTimeout(function(){
        wx.chooseImage({
          //count: _this.imgaesMaxLenght - _this.localIdImgs.length, // 默认9
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            if (window.__wxjs_is_wkwebview) {
              _this.wxgetLocalImgData(item1, localIds);
            } else {
              localIds.forEach((item, index) => {
                item1.imgs.push(item);
                //_this.localIdImgs.push(item);
              });
            }
            _this.wxuploadImage(item1, localIds);
          },
          fail: function(res) {
            console.log("失败");
          }
        });
      } , 3e2)

    },
    wxuploadImage(subItem, localIds) {
      let _this = this;
      let i = 0;
      let length = localIds.length;
      let upload = function() {
        let loacId = localIds[i];
        if (window.__wxjs_is_wkwebview) {
          if (loacId.indexOf("wxlocalresource") != -1) {
            loacId = loacId.replace("wxlocalresource", "wxLocalResource");
          }
        }
        wx.uploadImage({
          localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            //    alert(res.serverId);
            let serverId = {
              id: "",
              serverid: res.serverId
            };
            subItem.serverid.push(res.serverId);
          },
          fail: function(error) {
            alert("失败11");
          }
        });
      };
      upload();
    },
    wxgetLocalImgData(subItem, localIds) {
      let _this = this;
      var i = 0;
      var length = localIds.length;
      var upload = function() {
        wx.getLocalImgData({
          localId: localIds[i], // 图片的localID
          success: function(res) {
            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            localData = localData.replace("jgp", "jpeg");
            subItem.imgs.push(localData);
            //_this.localIdImgs.push(localData);
            /*if (_this.localIdImgs.length >= _this.imgaesMaxLenght) {
                _this.imgLenght = false
              }*/
          }
        });
      };
      upload();
    },
    removeByValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (i == val) {
          arr.splice(i, 1);
          break;
        }
      }
    },
    clodesd(item1) {
      let _this = this;
      item1.serverid = [];
      item1.imgs = [];

      // _this.removeByValue(_this.localIdImgs, index);
      // _this.removeByValue(_this.serverId, index);
      // if (_this.localIdImgs.length < _this.imgaesMaxLenght) {
      //   _this.imgLenght = true
      // }
    },
    beginConfirm(value) {
      this.postObj.openTime = value.format("yyyy-MM-dd hh:mm");
      //let time = value.getTime();
      //let timeHourAfter = time + 3600000 * 24 * 3;
      //let endTime = new Date(timeHourAfter);
      //this.postObj.closeTime = endTime.format('yyyy-MM-dd hh:mm');
      //this.currentDateAfter = endTime;
      this.showBegin = false;
    },
    endConfirm(value) {
      this.postObj.closeTime = value.format("yyyy-MM-dd hh:mm");
      this.showEnd = false;
    },

    //活动配图上传图片
    onClickUpActivity() {
      let _this = this;

      setTimeout(function(){
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            if (window.__wxjs_is_wkwebview) {
              console.log(">>>>>>>>>>window.__wxjs_is_wkwebview!!!");
              _this.wxGetLocalImgDataActivity(localIds); //todo
            } else {
              console.log(">>>>>>>>>>not----window.__wxjs_is_wkwebview!!!");
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
            console.log("活动上传失败");
          }
        });
      } , 3e2)

    },
    //
    wxUploadImageActivity(localIds) {
      let _this = this;
      let i = 0;
      let length = localIds.length;
      let upload = function() {
        let loacId = localIds[i];
        if (window.__wxjs_is_wkwebview) {
          if (loacId.indexOf("wxlocalresource") != -1) {
            loacId = loacId.replace("wxlocalresource", "wxLocalResource");
          }
        }
        wx.uploadImage({
          localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            let serverId = {
              id: "",
              serverid: res.serverId
            };
            _this.actServerId.push(serverId);
            i++;
          },
          fail: function(error) {
            alert("上传活动图片失败");
          }
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
            localData = localData.replace("jgp", "jpeg");
            _this.actLocalIdImgs.push(localData);
            if (_this.actLocalIdImgs.length >= _this.actImgaesMaxLenght) {
              _this.actImgLenght = false;
            }
            i++;
          }
        });
      };
      upload();
    },
    clodesdActivity(index) {
      let _this = this;
      _this.removeByValue(_this.actLocalIdImgs, index);
      _this.removeByValue(_this.actServerId, index);
      if (_this.actLocalIdImgs.length < _this.actImgaesMaxLenght) {
        _this.actImgLenght = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/minxin.less";
.wapper {
  position: absolute;
  top: 47px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
}

.scope /deep/ .vux-number-selector-plus {
  margin-right: 0;
}
.right-link {
  height: 40 / @baseSize;
  vertical-align: top;
  float: right;
  margin-right: 14px;
}

.form-info {
  /*padding-bottom: 100/@baseSize;
    padding-top: 100/@baseSize;*/
  background: #ffffff !important;
}

.img-t {
  width: 80 / @baseSize;
  height: 80 / @baseSize;
  display: block;
}

.btn-uploder {
  line-height: 80 / @baseSize;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  width: 200 / @baseSize;
  background: @green;
  margin-right: 40 / @baseSize;
  margin-top: 80 / @baseSize;
}

.cancel-btn {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  color: @white;
  text-align: center;
  line-height: 100 / @baseSize;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.posted-title {
  display: block;
  font-size: @fontSize30;
  color: @color42;
  line-height: 1.5rem;
  .mixin-padding(50 / @baseSize, 50 / @baseSize);
}

.x-textarea {
  font-size: @fontSize24;
}

.weui-label {
  font-size: @fontSize30;
}

.vux-popup-picker-placeholder {
  font-size: @fontSize30;
}

.form-info .vux-cell-box:before,
.form-info .weui-cell:before {
  left: 0;
}

.span-cell {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  margin-top: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
}

.span-cell span {
  border: 1px solid @green;
  border-radius: 4px;
  .mixin-padding(20 / @baseSize, 20 / @baseSize);
  font-size: @fontSize24;
  color: @color42;
  height: 50 / @baseSize;
  line-height: 52 / @baseSize;
  display: inline-block;
  float: left;
  margin-right: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
}

.scope,
.scope-data-box {
  border-bottom: 1px solid @colorDD;
}

.scope-title {
  padding-left: 30 / @baseSize;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: @fontSize30;
  color: @color42;
  /*color: #9B9B9B;;*/
  margin-top: 15 / @baseSize;
}

.scope-title-box {
  //border-bottom: 1px solid #D9D9D9;
  border-bottom: 1px solid #dddddd;
  //@colorDD
}

.form-info .weui-cell:before {
  border-top: none;
}

.write-back {
  line-height: 90 / @baseSize;
  height: 90 / @baseSize;
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  position: relative;
}

.write-back-left {
  display: inline-block;
  position: absolute;
  line-height: 90 / @baseSize;
  height: 90 / @baseSize;
  left: 30 / @baseSize;
  font-size: @fontSize30;
}

.write-back-right {
  margin-left: 280 / @baseSize;
}

.write-back-item {
  border: 1px solid @color97;
  margin-left: 15 / @baseSize;
  height: 50 / @baseSize;
  display: inline-block;
  line-height: 52 / @baseSize;
  font-size: @fontSize24;
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  color: @color97;
  border-radius: 4px;
}

.write-back-selected,
.write-back-selected {
  background: url("../../assets/combined.png") no-repeat right bottom;
  background-size: 25 / @baseSize 24 / @baseSize;
  border-color: @green;
  color: @color42;
}

.accessory-box {
  /*30/@baseSize*/
  .mixin-padding(30 / @baseSize, 15px);
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dddddd;
}

.accessory-title {
  font-size: @fontSize30;
  color: @color42;
  /*color: #9B9B9B;*/
  margin-top: 15 / @baseSize;
}

.form-info .vux-label {
  font-size: @fontSize30;
}

.accessory-img {
  margin-top: 50 / @baseSize;
  border: 1px solid #dddddd;
  //padding: 10px;
  padding: 5px 5px 5px 12px;
}

.weui-cell__ft,
.vux-cell-value {
  font-size: @fontSize28;
}

.photo-img,
.up-photo,
.photo-img li {
  float: left;
}

.photo-img li {
  margin-bottom: 20 / @baseSize;
}

.up-photo {
  margin-left: 20 / @baseSize;
}

.photo-img li {
  margin-right: 22 / @baseSize;
  position: relative;
}

.photo-img li:last-child {
  margin-right: 0;
}

.photo-img li,
.photo-img li img.imgud,
.up-photo img {
  width: 120 / @baseSize;
  height: 120 / @baseSize;
}

.photo-img li img.imgud,
.up-photo img {
  display: block;
}

.cancel {
  width: 50 / @baseSize;
  height: 50 / @baseSize;
  font-size: 50 / @baseSize;
  position: absolute;
  top: -25 / @baseSize;
  right: -25 / @baseSize;
  display: block;
}

.type-input /deep/ input {
  height: 28px;
}

.type-input /deep/ p {
  font-size: @fontSize30;
}

.scope /deep/ .weui-cells {
  margin-top: 0px;
  border-top-width: 0;
}

.scope /deep/ .vux-label {
  font-size: @fontSize30;
}

.closeTime /deep/ .weui-cells:before {
  border-top-width: 0;
}

/*.scope-title-box /deep/  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: red;
  }
  .scope-title-box /deep/  input:-moz-placeholder, textarea:-moz-placeholder {
    color: red;
  }*/

/*.scope-title-box /deep/ .weui-textarea[placeholder]{
    color:red !important;
  }*/

.dialog-btn /deep/ .van-button__text {
  color: #333;
}
.hl /deep/ .van-picker__confirm {
  color: #48b319;
}
.hl /deep/ .van-picker__cancel {
  color: #999;
}
.schedule-datetime-picker /deep/ .van-picker-column:first-child {
  display: none;
}
.schedule-datetime-picker /deep/ .van-picker-column:first-child + div {
  display: none;
}
.schedule-datetime-picker /deep/ .van-picker-column:first-child + div + div {
  display: none;
}

.schedule-datetime-picker /deep/ .van-picker-column:first-child + div + div {
  display: none;
}

.schedule-datetime-picker
  /deep/
  .van-picker-column:first-child
  + div
  + div
  + div
  > ul {
  width: 155px;
  //display: none;
}

.schedule-datetime-picker /deep/ .van-picker__columns {
  overflow: hidden;
}

.schedule-datetime-picker /deep/ .van-picker-column {
  overflow: visible;
}

.schedule-datetime-picker /deep/ .van-picker-column__item--selected {
  color: #017afb;
  font-size: 1.2em;
  /*height: 60px !important;*/
}

.weui-cell /deep/ .vux-number-input {
  height: 28px !important;
  line-height: 20px;
}

.img-content /deep/ .weui-cell {
  padding: 10px 5px 10px 15px;
}

.accessory-img /deep/ .weui-textarea-counter {
  padding-right: 2px;
}
//padding: 5px 5px 5px 10px;
/*.img-content{*/
/*padding: 0;*/
/*}*/
</style>
