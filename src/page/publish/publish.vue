<template>
  <div class="form-info clearfix">
    <x-header class="title-header" :left-options="{ preventGoBack: true }" @on-click-back="goBack()">发布作业</x-header>
    <!--    <p class="cancel-btn" @click="cancel()">取消发布</p>-->
    <!--<form action="/" method="post">-->
    <div class="scope clearfix">
      <!--      <div @click="goBack()">-->
      <!--        <cell class="scope-box" :title="this.getTitle" :value="this.objType.objectName" is-link></cell>-->
      <!--      </div>-->
      <!--<input type="hidden" name="type" v-model="type">-->
      <!-- <input type="hidden" name="objectId" v-model="objectId"> -->
      <div class="span-cell clearfix">
        <span v-for="(item, index) in classList" :key="index">{{ item.CLASS_NAME }}</span>
      </div>
      <!-- <input type="hidden" name="userList" v-model="userList">-->
    </div>
    <div class="scope-title-box">
      <p class="scope-title">作业标题</p>
      <x-textarea :max="20" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" class="x-textarea"
        placeholder="请输入作业标题" :rows="2" v-model="newTitle"></x-textarea>
      <!--<input type="hidden" name="title" v-model="titleValue">-->
    </div>

    <div class="scope-data-box">
      <x-address key="keyPublishData" title="作业日期" v-model="timePublishData" hide-district value-text-align="right"
        :list="addressPublishData" class="x-address" @on-hide="changePicker2"></x-address>
    </div>

    <div class="scope-data-box">
      <x-address key="keyData" title="截止日期" v-model="timeData" hide-district value-text-align="right" :list="addressData"
        class="x-address"></x-address>
    </div>

    <div class="scope-title-box">
      <p class="scope-title">作业内容</p>
      <x-textarea :max="1000" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" class="x-textarea"
        placeholder="请输入作业内容" :rows="7" v-model="newContent"></x-textarea>
    </div>
    <div class="scope-title-box">
      <p class="scope-title">
        {{ $route.query.homeworkName }}时长 &nbsp;
        <input type="text" :value="timeCode" placeholder="请输入时长" :readonly="timeInputer === 0" @input="inputTime"
          @blur="addSurfix" @focus="removeSurfix" ref="iptr" />
      </p>
      <time-setter @check="setTimecode" />
    </div>
    <div class="accessory-box">
      <p class="accessory-title" style="margin-bottom: 20px;">作业附件</p>
      <!-- <div class="accessory-img clearfix">
				<ul class="photo-img">
					<li v-for="(item,index) in localIdImgs" :key="index">
						<img :src="item" alt class="imgud" />
						<img src="../../assets/cancel.png" alt class="cancel" @click="clodesd(index)" />
					</li>
				</ul>
				<a class="up-photo" href="javascript:;" @click="onClickUp()" v-show="imgLenght">
					<img src="../../assets/addup.jpg" alt />
				</a>
			</div> -->
      <div class="mg-b-20 imgContainer" v-show="imgTempList.length + fileTempList.length > 0">
        <div class="" v-for="( pic, pIndex ) in imgTempList" :key="pic.newfileName" :data-id='pic.newfileName'
          v-long-press="1000" @long-press-start="removeTmpPic(pic, pIndex)"
          @touchstart="startWillRemovePic(pic.newfileName)" @touchmove="cancelWillRemovePic">
          <img :src="pic.viewPath" class="deletable">
        </div>
        <div class="" v-for="( file, fIndex) in fileTempList" :key="file.newfileName">
          <span class="spRow">
            <a :href="file.viewPath" target='_blank' :data-id='file.newfileName'>
              {{ file.originalName }}
            </a>
            <van-button plain size='mini' :color="THEME_COLOR_MAP[ 'warningRed' ]" text='删除' @click="removeTmpFile(file, fIndex)" />
          </span>
        </div>
      </div>

      <van-uploader v-show="false" ref="uploader" :accept='fileAccepts' :after-read='uploadHandler'
        :max-size="50 * 1024 * 1024" @oversize="onOversize" result-type="file">
      </van-uploader>
      <van-button @click="chooseFile" plain size='small' color="#54B331" text='上传' />
    </div>

    <div style="padding: 20px 15px;">
      <van-button block color="#54B331" @click="goUploder" :loading="loading" :disabled="loading">
        发布作业
      </van-button>
    </div>
    <!-- <button @click="goUploder()" class="btn-uploder right" type="submit" :disabled="loading">发布作业</button> -->

    <!-- <toast
			v-model="showPositionValue"
			type="text"
			:time="800"
			is-show-mask
			:position="position"
		>{{toastMessage}}</toast> -->

    <!-- </form>-->
  </div>
</template>

<script>
import TimeSetter from "./TimeSetter.vue";
import {
  // Toast,
  Checker,
  CheckerItem,
  Group,
  XAddress,
  XTextarea,
  ChinaAddressV3Data,
  XButton,
  Cell,
  Radio,
  Datetime,
  Value2nameFilter as value2name,
  XHeader
} from "vux";

import { Button, Uploader, Dialog, Toast } from 'vant';
import wx from "weixin-js-sdk";
import { getSelectTimes } from "../../utils/TimeUtils";
import apiRouter, { apiPath } from "../../config/api.js";
import { THEME_COLOR_MAP } from '../../config/colorMap';


const getFileExt = function (fullName) {
  if (fullName.lastIndexOf('.') === -1) {
    return '';
  }
  return fullName.substr(fullName.lastIndexOf('.') + 1).toUpperCase();
};

const FileTypes_Image = [ 'PNG', 'JPG', 'JPEG', 'GIF', 'WEBP' ];

const getMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return 'Android';
  } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'iOS';
  }
  return 'Other';
};

export default {
  components: {
    Toast,
    Group,
    XAddress,
    Cell,
    XButton,
    XTextarea,
    Checker,
    CheckerItem,
    Radio,
    Datetime,
    XHeader,
    TimeSetter,
    [ Button.name ]: Button,
    [ Uploader.name ]: Uploader
  },

  data() {
    const curDate = new Date();
    return {
      timeMinus: 0,
      timeInputer: 0,
      timeCode: "",
      imgLenght: true,
      imgaesMaxLenght: 9,
      value7: "",


      loading: false,

      itemId: "",

      objType: {
        type: "",
        objectId: "",
        objectName: ""
      },
      userList: [],
      localIdImgs: [],
      serverId: [],
      localData: [],
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
      timePublishData: [ curDate.getTime().toString() ], //[(new Date).getTime()],
      timeData: [ curDate.getTime().toString() ],
      isBack: [ "允许", "不允许" ],
      addressPublishData: getSelectTimes(curDate),
      addressData: getSelectTimes(curDate),
      showAddress: false,

      // 发布作业新增字段

      getTitle: "",
      classList: [],
      newSpaceId: "", // 空间id
      newClassId: [], // 班级id（空即全年级）
      newOutDate: "", // （作业截止日期）
      newTitle: "", //  （作业标题）
      newContent: "", //  内容
      newImgList: "", // 附件

      newClassIds: "",

      ossPath: roterOssPath,
      fileAccepts: getMobileOS() === 'iOS' ? '.png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.rar,.zip,.7z,.tar,.mp4' : '*/*',

      willRemove: false,
      imgTempList: [],
      fileTempList: [],
      imgDelList: [],
      fileDelList: [],
    };
  },
  // computed: {
  //   timecode: {
  //     get: function() {
  //       if (this.timeInputer === 0) {
  //         return this.timeMinus ? this.timeMinus + "分钟" : "";
  //       }
  //     },
  //     set: function(v) {
  //       this.timeMinus = v;
  //     }
  //   }
  // },
  // activated() {
  //   this.getStorage();
  // },
  created() {
    //getSelectDates();
    //timeData()
    this.showTop();
    this.localIdImgs = [];
    this.localData = [];
    this.newClassId = [];
    this.serverId = [];

  },
  activated() {
    this.titleDate();
    // console.log(apiRouter.POST_SEND)
    this.localIdImgs = [];
    this.localData = [];
    this.newClassId = [];
    this.serverId = [];

    this.urlPath = window.location.href.split("#")[ 0 ];
    this.getUrlConfig();
    // this.getNowFormatDate();
    // this.titleDate();
    this.getStorage();
    this.newContent = '';
    this.timeCode = '';

    this.imgTempList.length =
      this.fileTempList.length =
      this.imgDelList.length =
      this.fileDelList.length = 0;
  },
  methods: {
    changePicker2(confirm) {
      if (confirm) {
        let t1 = ~~this.timePublishData[ 0 ];
        let t2 = ~~this.timeData[ 0 ];
        if (t1 > t2) {
          this.timeData = [ this.timePublishData[ 0 ] ];
        }
      }
    },
    onOversize(file) {
      Toast('文件不可超过50M');
    },
    startWillRemovePic(key) {
      this.willRemove = true;
    },
    cancelWillRemovePic() {
      if (this.willRemove) {
        this.willRemove = false;
      }
    },
    async removeTmpFile(file, i) {
      let answer = await Dialog.confirm({
        className: 'dy-rate-dialog',
        title: '',
        message: '确定要删除吗？',
        confirmButtonText: '确定',
        messageAlign: 'center',
      });
      if (answer === 'confirm') {
        let del = this.fileTempList.splice(i, 1);

        if (file.newfileName.startsWith('xxx-')) {
          this.fileDelList.push(file.newfileName.split('xxx-')[ 1 ]);
        } else {
          this.fileDelList.push(...del);
        }
      }
    },
    async removeTmpPic(pic, i) {
      if (this.willRemove) {
        let answer = await Dialog.confirm({
          className: 'dy-rate-dialog',
          title: '',
          message: '确定要删除吗？',
          confirmButtonText: '确定',
          messageAlign: 'center',
        });
        if (answer === 'confirm') {
          let del = this.imgTempList.splice(i, 1);
          if (pic.newfileName.startsWith('xxx-')) {
            this.imgDelList.push(pic.newfileName.split('xxx-')[ 1 ]);
          } else {
            this.imgDelList.push(...del);
          }
        }
      }
    },
    chooseFile() {
      let self = this;
      setTimeout(async function () {
        self.$refs.uploader.chooseFile();
      }, 3e2);
    },
    async uploadHandler(fileItem) {

      let t = Toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0, // 持续展示 toast
      });

      let ext = getFileExt(fileItem.file.name);
      if (FileTypes_Image.includes(ext)) {
        await this.uploadPic(fileItem.file);
      } else {
        await this.uploadFile(fileItem.file);
      }
      t.clear();
    },
    async uploadPic(pic) {
      let bodyFormData = new FormData();
      bodyFormData.append('files', pic);

      let self = this;
      let resp = await this.$http.post(apiPath + '/file/h5/upload_pic', bodyFormData);
      let result = resp.body;
      let { image_list } = result.data;
      console.log(image_list);
      image_list.forEach(function (item) {
        self.imgTempList.push(item);
        console.log('self.imgTempList', self.imgTempList);
      });
    },
    async uploadFile(file) {
      let bodyFormData = new FormData();
      bodyFormData.append('files', file);

      let self = this;
      let resp = await this.$http.post(apiPath + '/file/h5/upload_file', bodyFormData);
      let result = resp.body;
      let { file_list } = result.data;
      console.log(file_list);
      file_list.forEach(function (item) {
        self.fileTempList.push(item);
        console.log('self.imgTempList', self.fileTempList);
      });
    },
    showTop() {
      window.scrollTo(0, 0);
    },
    setTimecode(obj) {
      // alert(this.timeMinus)
      // debugger;

      this.timeMinus = ~~obj.val;
      this.timeInputer = obj.ipt;

      let iptr = this.$refs.iptr;
      if (obj.ipt === 1 && obj.val === "自定义") {
        this.timeMinus = "";
        this.timeCode = "";
        setTimeout(() => {
          iptr.setAttribute("autofocus", "autofocus");
          iptr.focus();
        }, 3e2);
      } else {
        iptr.removeAttribute("autofocus");
        this.addSurfix();
      }
    },
    inputTime(e) {
      // console.log(e);
      this.timeMinus = ~~e.target.value;
      // this.addSurfix()
    },
    addSurfix(e) {
      // console.log(
      //   this.timeMinus,
      //   this.timeMinus > 0 ? this.timeMinus + "分钟" : ""
      // );
      if (this.timeMinus < 0 || this.timeMinus > 200) {
        alert("请输入0 - 200之间的整数");
        this.timeMinus = 0;
      }

      if (this.timeMinus === "") {
        this.timeCode = "";
      } else {
        this.timeCode = this.timeMinus + "分钟";
      }

      // console.log(e , this.timeCode);
      // if (e && !this.timeCode) {
      //   // console.log(e.target);
      //   e.target.value = "";
      // }
      // this.timeInputer = 0;
      // // setTimeout(()=>{
      // //   this.timeInputer = 1;
      // // }, 1e2)
    },
    removeSurfix() {
      if (this.timeInputer === 1) {
        this.timeCode = this.timeMinus;
      }
    },
    titleDate() {
      var myDate = new Date();
      var currtMonth = myDate.getMonth() + 1;
      var currtDate = myDate.getDate();
      this.newTitle =
        (currtMonth < 10 ? "0" + currtMonth : currtMonth) +
        "月" +
        (currtDate < 10 ? "0" + currtDate : currtDate) +
        "日作业";
    },

    getStorage() {
      // debugger;
      this.classList = JSON.parse(window.localStorage.CLAEEINFO);
      this.getTitle = this.classList[ 0 ].COURSE_NAME;
      this.newSpaceId = this.classList[ 0 ].SPACE_ID;
      this.getTitle = this.classList[ 0 ].COURSE_NAME;
      this.classList.forEach((item, index) => {
        this.newClassId.push(item.CLASS_ID);
      });
      this.newClassIds = this.newClassId.join(",");
      console.log("ook");
      console.log(this.classList);
      console.log(this.newClassIds);
    },

    getNowFormatDate(curDate, AddDayCount) {
      var date = new Date(curDate);
      date.setDate(date.getDate() + AddDayCount);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    showTop() {
      window.scrollTo(0, 0);
    },

    goBack() {
      if (this.$route.query.path === "joblist") {
        return;
      } else {
        this.$router.go(-1);
      }
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
      // let data = this.format(this.timeData[0]);
      // let time = this.timeData[1]
      // let dataDatime = data + " " + time

      // debugger;
      let dataDatime = this.format(this.timeData[ 0 ]);

      let t1 = parseInt(this.timePublishData[ 0 ]);
      let t2 = parseInt(this.timeData[ 0 ]);
      if (t1 > t2) {
        Toast('截止日期不可早于作业日期');
        return;
      }

      if (this.newTitle === "") {
        Toast('请填写标题');
        // this.position = position;
        // this.toastMessage = "请填写标题";
        // this.showPositionValue = true;
        return;
      }

      if (this.newContent === "" && this.imgTempList.length === 0) {
        Toast('请填写内容或上传图片');
        // this.position = position;
        // this.toastMessage = "请填写内容或上传图片";
        // this.showPositionValue = true;
        return;
      }


      let imgTempList = JSON.parse(JSON.stringify(this.imgTempList));
      let c = imgTempList.length;
      while (c--) {
        let pic = imgTempList[ c ];
        if (pic.newfileName.startsWith('xxx-')) {
          imgTempList.splice(c, 1);
        }
      }
      let fileTempList = JSON.parse(JSON.stringify(this.fileTempList));
      c = fileTempList.length;
      while (c--) {
        let file = fileTempList[ c ];
        if (file.newfileName.startsWith('xxx-')) {
          fileTempList.splice(c, 1);
        }
      }

      let sendObj = {
        WORK_DATE: this.format(this.timePublishData[ 0 ]),
        SPACE_ID: this.newSpaceId,
        CLASS_IDS: this.newClassIds,
        OUTDATE: dataDatime,
        TITLE: this.newTitle,
        CONTENT: this.newContent
          .replace(/</g, "&lt")
          .replace(/>/g, "&gt")
          .replace(/\n/g, "<br>"),
        IMG_LIST: JSON.stringify(this.serverId),
        FIN_OF_TIME: this.timeMinus,
        IMG_ADD: JSON.stringify(imgTempList),
        img_del: JSON.stringify(this.imgDelList),
        FILE_ADD: JSON.stringify(fileTempList),
        file_del: JSON.stringify(this.fileDelList),
      };
      console.log(JSON.stringify(sendObj));
      console.log(sendObj);
      //  return;
      let _this = this;

      this.loading = true;

      _this.$http
        .post(apiRouter.POST_HOMEWORKPUBLISH, sendObj)
        .then(
          response => {
            Toast(response.body.message);
            if (response.status === 200) {
              setTimeout(_this.backHome, 600);
            }
            // if (response.status === 200) {
            //   _this.position = position;
            //   _this.toastMessage = "发布成功";
            //   _this.showPositionValue = true;
            //   window.localStorage.removeItem('CLAEEINFO');
            //   setTimeout(_this.backHome, 1e3);
            // } else {
            //   _this.position = position;
            //   _this.toastMessage = "发布失败";
            //   _this.showPositionValue = true;
            // }
          },
          error => {
            Toast(error);
            // _this.position = position;
            // _this.toastMessage = "发布失败";
            // _this.showPositionValue = true;
          }
        )
        .then(() => {
          setTimeout(function () {
            _this.loading = false;
          }, 2000);
        });

    },
    backHome() {
      // window.location.replace(roterPath + "/weixin/wechat/dist/index.jsp");
      this.$router.push('/');
    },
    cancel() {
      this.$router.go(-1);
      //window.location.href = roterPath + "/weixin/wechat/dist/index.jsp#/"
    },

    onEvent(event) { },

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
          wx.error(function (res) {
            //   alert(res)
          });
        },
        response => {
          // console.log("请求失败了!!!!")
        }
      );
    },

    // 上传图片
    onClickUp() {
      let _this = this;
      setTimeout(function () {
        wx.chooseImage({
          count: _this.imgaesMaxLenght - _this.localIdImgs.length, // 默认9
          sizeType: [ "original", "compressed" ], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: [ "album", "camera" ], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            if (window.__wxjs_is_wkwebview) {
              //  _this.wxgetLocalImgData(localIds);
              //  setTimeout(function (){
              _this.wxgetLocalImgData(localIds);
              //  }, 10);
            } else {
              localIds.forEach((item, index) => {
                _this.localIdImgs.push(item);
                if (_this.localIdImgs.length >= _this.imgaesMaxLenght) {
                  _this.imgLenght = false;
                }
              });
            }
            //  _this.wxuploadImage(localIds);
            //  setTimeout(function (){
            _this.wxuploadImage(localIds);
            //  }, 10);
          },
          fail: function (res) {
            console.log("失败");
          }
        });
      }, 3e2);

    },

    wxuploadImage(localIds) {
      let _this = this;
      var i = 0;
      var length = localIds.length;
      var upload = function () {
        let loacId = localIds[ i ];
        if (window.__wxjs_is_wkwebview) {
          if (loacId.indexOf("wxlocalresource") != -1) {
            loacId = loacId.replace("wxlocalresource", "wxLocalResource");
          }
        }
        wx.uploadImage({
          localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            //    alert(res.serverId);
            var serverId = {
              id: "",
              serverid: res.serverId
            };
            _this.serverId.push(serverId);
            i++;
            //  i < length && upload();
            if (i < length) {
              setTimeout(function () {
                upload();
              }, 10);
            }
          },
          fail: function (error) { }
        });
      };
      upload();
    },
    wxgetLocalImgData(localIds) {
      let _this = this;
      var i = 0;
      var length = localIds.length;
      var upload = function () {
        wx.getLocalImgData({
          localId: localIds[ i ], // 图片的localID
          success: function (res) {
            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            localData = localData.replace("jgp", "jpeg");
            _this.localIdImgs.push(localData);
            if (_this.localIdImgs.length >= _this.imgaesMaxLenght) {
              _this.imgLenght = false;
            }
            i++;
            //  i < length && upload();
            if (i < length) {
              setTimeout(function () {
                upload();
              }, 10);
            }
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
    clodesd(index) {
      let _this = this;
      _this.removeByValue(_this.localIdImgs, index);
      _this.removeByValue(_this.serverId, index);
      if (_this.localIdImgs.length < _this.imgaesMaxLenght) {
        _this.imgLenght = true;
      }
    }
  }
};
</script>
<style>
.vux-cell-box:before {
  border-top: none !important;
}
</style>
<style lang="less" scoped>
@import "../../style/minxin.less";

img.deletable {
  width: 100%;
  pointer-events: none;
  -webkit-touch-callout: none;
}

.form-info {
  padding-bottom: 100 / @baseSize;
  padding-top: 100 / @baseSize;
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

// .form-info .vux-cell-box:before,
// .form-info .weui-cell:before {
//   left: 0 !important;
// }
// .scope-data-box .weui-cell:before{
//   left:0 !important;
// }

.span-cell {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  margin-top: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
  padding-top: 20 / @baseSize;
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
  margin-top: 15 / @baseSize;
}

.scope-title-box {
  border-bottom: 1px solid @colorDD;
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
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
}

.accessory-title {
  font-size: @fontSize30;
  color: @color42;
  margin-top: 15 / @baseSize;
}

.form-info .vux-label {
  font-size: @fontSize30;
}

.accessory-img {
  margin-top: 12px;
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
  // margin-left: 20 / @baseSize;
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
  width: 150 / @baseSize;
  height: 150 / @baseSize;
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
</style>
