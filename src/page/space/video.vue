<template>
  <div class="box">
    <back-title-bar :title="TOPIC_ID.length > 0 ? '取消编辑' : '发布'" />
    <div class="wapper">

      <!-- <div class="back-div" ref="heightBackPub" v-if="TOPIC_ID.length > 0">
			<p @click="backHome()" class="up-back">取消编辑</p>
		</div>
		<div class="back-div" ref="heightBackPub" v-else>
			<p @click="backHome()" class="up-back">取消发布</p>
		</div> -->
      <div class="scope-title-box">
        <x-textarea :max="1000" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" :placeholder="placeholderText"
          :rows="7" v-model="contentValue" style="font-size: 12px;margin-bottom: 8px; padding-bottom: 0;"></x-textarea>
      </div>
      <div class="timecodeDiv" style="margin-top:10px; margin-left: 15px; margin-right: 15px;">
        <span v-for="(value, index) in tagList" :key="index" @click="checkTag(value.ID)"
          :class="TAG_ID == value.ID ? 'checkedTag' : 'uncheckedTag'">{{ value.TITLE }}</span>
      </div>
      <div class="send-type" style="margin-top:10px;">
        <div class="type-video">
          <div class="accessory-box" style="display: flex; gap: 10px;">
            <div class="video-tnl" v-for="(item, index) in videoFiles" :key="index">
              <img class="up-videos" :src="videoImgSrc" />
              <!-- <img class="up-videos" src="http://gz.lqtedu.com/weixin/wechat/public/images/icon/videopng.png" alt=""> -->
              <!-- <video :src="getimgUrl(videoFiles.videoUrl)" width="200" height="264" controls autobuffer v-if="videoFiles.videoUrl"></video> -->
              <!-- <img src="../../assets/cancel.png" alt="" class="cancel" @click="clodesVideo(videoFiles)"> -->
            </div>
            <div class="accessory-img clearfix">
              <a class="up-photo" href="javascript:;" @click="uploaderInputVideo()" style="margin-left:0;">
                <img src="../../assets/addup.jpg" alt />
                <div id="image-list" class="mui_uploader">
                  <input ref="videoFileInputer" id="uploaderInputVideo" class="mui_uploader_input" type="file"
                    accept="video/*" />
                </div>
              </a>
            </div>
          </div>

          <p class="ps-info-p">注：视频最大支持100M，发布后需要后台处理，可能需等待几分钟后显示。</p>

          <div style="display: flex; align-items: center; position: fixed; bottom: 15px; left: 15px; right: 15px;">
            <!-- <button @click="downloadVideo()" class="btn-calie" type="submit">下载视频</button> -->
            <button @click="delSubmit()" class="btn-calie" type="submit" v-if="this.isDle === true">删除本条</button>
            <!-- <button @click="submitVideo()" class="btn-uploder" :show- :disabled="showLoading || true"
              type="submit">提交</button> -->
            <van-button block :color="THEME_COLOR_MAP[ 'mainGreen' ]" style="flex: 1;" :loading="showLoading"
              :disabled="showLoading || (checkedTag && ~~checkedTag.PIC_NUM === 1 && videoFiles.length < 1)" @click="submitVideo">提交</van-button>
          </div>
        </div>
      </div>

      <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :position="position">{{ toastMessage }}
      </toast>

      <div v-transfer-dom>
        <confirm v-model="popup" :close-on-confirm="false" :title="('是否确认删除？')" @on-confirm="onConfirm()"
          confirmText="是，我要删除"></confirm>
      </div>
    </div>
  </div>
</template>

<script>
import { THEME_COLOR_MAP } from '../../config/colorMap';
import {
  Confirm,
  XTextarea,
  Group,
  XSwitch,
  XButton,
  XHeader,
  Toast,
  TransferDomDirective as TransferDom
} from "vux";
import Back from "../../components/common/Back.vue";
import BackTitleBar from "../../components/common/BackTitleBar.vue";
//import Photo from "./photo.vue"
import apiRouter from "../../config/api.js";
import { Button } from "vant";
import img_pubVideo from "../../assets/pubVideo.png";

function download(href, filename = "") {
  const a = document.createElement("a");
  a.download = filename;
  a.href = href;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadFile(url, filename = "") {
  fetch(url, {
    headers: new Headers({
      Origin: location.origin
    }),
    mode: "cors"
  })
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      download(blobUrl, filename);
      window.URL.revokeObjectURL(blobUrl);
    });
}

export default {
  directives: {
    TransferDom
  },
  components: {
    Back,
    BackTitleBar,
    [ Button.name ]: Button,
    Confirm,
    Group,
    XSwitch,
    XButton,
    XHeader,
    Toast,
    XTextarea
  },
  created: function () {
    this.SPACE_ID = this.$route.query.SPACE_ID;
    this.TOPIC_ID = this.$route.query.TOPIC_ID;

    this.showLoading = false;
    console.log("videoFiles", this.videoFiles);
    let _this = this;

    _this.TOPIC_ID = this.$route.query.TOPIC_ID;
    if (_this.TOPIC_ID) {
      _this.getDetailData();
      _this.isDle = true;
    } else {
      _this.videoImg = false;
    }

    this.TAG_ID = this.$route.query.tagId;
    this.getSchoolTopicTags();
  },
  mounted() {
    // console.log("ref", this.$refs["videoFileInputer"]);
  },
  updated() { },

  data() {
    return {
      THEME_COLOR_MAP: THEME_COLOR_MAP,
      showLoading: false,
      addFalse: false,
      videoImg: false,
      text1: "Processing",
      loadShow: false,
      isDle: false,
      videoImgSrc: '',
      codeArr: [],
      contentValue: "",
      uploadImg: [],
      imgLenght: true,
      showPositionValue: false,
      showToast: true,
      position: "default",
      toastMessage: "",
      imgfileData: [],
      pathImgs: [],
      videoFiles: [],
      newVideoFiles: [],
      SPACE_ID: "CLASS-A10480",
      CONTENT: "",
      IMG_LIST: "",
      TOPIC_ID: "",
      DEL_LIST: "",
      showPositionValue: false,
      showToast: true,
      position: "default",
      toastMessage: "",
      popup: false,
      key: 1,

      tagList: [],
      checkedTag: null,
      TAG_ID: '',
      localIdImgs: [],
      placeholderText: '说点什么…',

      videoUrl: "https://gz.lqtedu.com/weixin/VIDEO/5ae9fa28-6313-473b-9817-372680ec9562.mp4"
    };
  },
  methods: {
    getSchoolTopicTags() {
      let _this = this;
      _this.$http.get(apiRouter.SPACE_TAG + "?SPACE_ID=" + _this.SPACE_ID + "&TOPIC_ID=" + this.TOPIC_ID).then(response => {
        if (response.status === 200) {
          console.log(response.data.data);
          _this.tagList = response.data.data.filter(t => ~~t.PIC_NUM < 2);
          for (let i = 0; i < _this.tagList.length; i++) {
            if (_this.tagList[ i ].ID === _this.TAG_ID) {
              _this.checkedTag = _this.tagList[ i ];
              break;
            }
          }
          if (_this.tagList.length > 0) {
            _this.placeholderText = '说点什么…\n如发主题帖，请选择下方对应主题。';
          }
        }
      });
    },
    checkTag(id) {
      if (this.TAG_ID === id) {
        this.TAG_ID = '';
        this.checkedTag = null;
        this.placeholderText = '说点什么…\n如发主题帖，请选择下方对应主题。';
      } else {
        this.TAG_ID = id;
        for (let i = 0; i < this.tagList.length; i++) {
          if (this.tagList[ i ].ID === this.TAG_ID) {
            this.checkedTag = this.tagList[ i ];
            if (this.checkedTag.COMMENT) {
              this.placeholderText = '说点什么…\n' + this.checkedTag.COMMENT;
            } else {
              this.placeholderText = '说点什么…\n如发主题帖，请选择下方对应主题。';
            }
            break;
          }
        }
      }
    },
    downloadVideo() {
      // prompt形式调用
      let that = this;
      this.$vux.confirm.show({
        title: "下载",
        content: "确定下载视频",
        onCancel() { },
        onConfirm() {
          // downloadFile(that.videoUrl);
          const a = document.createElement("a");
          (a.download = "video.mp4"),
            (a.href =
              "https://pub3.lqtedu.com/upload/weixin/VIDEO/ddd1b579-fa25-4a8c-ba00-370e6c6d47b6.mp4");
          document.body.appendChild(a);
          a.click();
          a.remove();
          // $("<a/>", {
          //   href: 'https://pub3.lqtedu.com/upload/weixin/VIDEO/ddd1b579-fa25-4a8c-ba00-370e6c6d47b6.mp4',//that.videoUrl,
          //   download: "video.mp4",
          //   id: "videoDownloadLink"
          // }).appendTo(document.body);
          // $("#videoDownloadLink")
          //   .get(0)
          //   .click()
          //   .remove();
        }
      });
    },
    onEvent(event) {
      //   console.log('on', event)
    },

    // 删除本条记录
    delSubmit() {
      let _this = this;
      _this.popup = true;
    },
    onConfirm(position, msg) {
      let _this = this;
      let url =
        apiRouter.SPACE_DEL +
        "?SPACE_ID=" +
        _this.SPACE_ID +
        "&TOPIC_ID=" +
        _this.TOPIC_ID;
      _this.$http.post(url).then(
        response => {
          // debugger;
          console.log(response.body);
          if (response.body.status === 200) {
            setTimeout(_this.backHome, 1200);
          } else {
            _this.position = position;
            _this.toastMessage = response.body.message;
            _this.showPositionValue = true;
          }
        },
        erro => { }
      );
      this.popup = false;
      return;
      this.$vux.loading.show({
        transition: "",
        text: "processing"
      });
      setTimeout(() => {
        this.$vux.loading.hide();
        this.popup = false;
      }, 1000);
    },

    // 图片帖子 编辑
    getDetailData() {
      let _this = this;
      this.$http
        .get(
          apiRouter.SPACE_DETAIL +
          "?" +
          "SPACE_ID=" +
          _this.SPACE_ID +
          "&TOPIC_ID=" +
          _this.TOPIC_ID +
          "&IS_VIDEO=" +
          1
        )
        .then(
          response => {
            if (response.body.status === 200) {
              _this.contentValue = response.body.data.CONTENT;
              _this.videoFiles = response.body.data.IMG_LIST;
              console.log("ok", _this.videoFiles);
              if (_this.videoFiles.length > 0) {
                _this.imgLenght = false;
                _this.videoImg = true;
                _this.videoImgSrc = roterPath + _this.videoFiles[ 0 ].showUrl;
                _this.videoUrl = roterPath + _this.videoFiles[ 0 ].videoPath;
              }
            }
          },
          erro => { }
        );
    },

    backHome() {
      window.location.replace(apiRouter.BACK_SPACE + this.SPACE_ID);
      //this.showLoading = false;
    },
    // 上传视频
    uploaderInputVideo() {
      let _this = this;
      // let formData = new FormData();
      var f2 = document.querySelector("#uploaderInputVideo");
      f2.onchange = function (e) {
        var files = f2.files;
        var len = files.length;
        var data = [];
        //  console.log('files::',files);
        if (len > 1) {
          alert("一次最多只能上传1个");
          e.target.value = "";
          return false;
        } else if (files[ 0 ].size > 104857600) {
          alert("视频最大为100M");
          e.target.value = "";
          return false;
        } else {
          var a = {
            val: files[ 0 ]
          };
          data.push(a);
        }

        // console.log(files[0].size , 100*1024*1024);

        _this.goUploderVideo(data, function (re_file) {
          e.target.value = "";
          _this.videoFiles.push(re_file);
          console.log("_this.videoFiles::", _this.videoFiles);
          if (_this.videoFiles.length > 0) {
            _this.imgLenght = false;
            _this.videoImg = true;
          }
        });
      };
    },

    goUploderVideo(data, callback) {
      let _this = this;
      let len = data.length;
      let formData = new FormData();
      _this.$vux.loading.show({
        transition: "",
        text: "加载中..."
      });
      if (len < 1) {
        alert("请选择文件");
      } else {
        for (var i = 0; i < len; i++) {
          formData.append("file", data[ i ].val);
        }
        _this.$http.post(apiRouter.GET_VIDEO, formData).then(
          response => {
            if (response.status === 200) {
              let _file = response.body.file;
              callback && callback(_file);
              _this.videoImgSrc = img_pubVideo;
              _this.$vux.loading.hide();
            }
          },
          error => {
            alert("视频上传失败");
          }
        );
      }
    },

    clodesVideo(obj) {
      console.log("obj::", obj);
      let _this = this;
      if (_this.TOPIC_ID) {
        console.log(obj[ 0 ].mediaId);
        console.log(obj[ 0 ].videoPath);
        console.log(_this.videoFiles[ 0 ].videoPath);
        if (obj[ 0 ].videoPath === this.videoFiles[ 0 ].videoPath) {
          _this.videoFiles = [];
          _this.videoImg = false;
          _this.imgLenght = true;
          _this.codeArr.push(obj[ 0 ].mediaId);
        }
      } else {
        _this.videoImg = false;
        _this.imgLenght = true;
      }
    },

    submitVideo() {
      let _this = this;
      _this.showLoading = true;

      if (_this.TAG_ID) {
        let picMinMun = ~~_this.checkedTag.PIC_NUM;
        if (_this.videoFiles.length < picMinMun) {
          _this.showLoading = false;
          _this.toastMessage = "本主题至少上传" + _this.checkedTag.PIC_NUM + "个视频";
          _this.showPositionValue = true;
          return;
        }
      }

      console.log(_this.videoFiles);
      var arrLen = [];
      let sendObj = {
        SPACE_ID: _this.SPACE_ID,
        CONTENT: _this.contentValue,
        IMG_LIST: JSON.stringify(_this.videoFiles),
        TOPIC_ID: _this.TOPIC_ID,
        tagId: _this.TAG_ID,
        DEL_LIST: JSON.stringify(_this.codeArr),
        IS_VIDEO: 1
      };
      console.log(sendObj);

      if (this.contentValue === "") {
        // this.position = position;
        this.toastMessage = "请填写标题";
        this.showLoading = false;
        this.showPositionValue = true;
      } else {
        _this.$http.post(apiRouter.SPACE_PHOTO, sendObj).then(
          response => {
            console.log(response);
            if (response.body.status === 200) {
              // _this.position = position;
              _this.toastMessage = "发布成功";
              _this.showPositionValue = true;
              _this.videoImgSrc = img_pubVideo;
              setTimeout(_this.backHome, 1200);
            }
            if (response.body.status === 201) {
              // _this.position = position;
              _this.toastMessage = response.body.message;
              _this.showPositionValue = true;
              _this.showLoading = false;
              //  setTimeout(_this.backHome, 1200);
            }
          },
          error => {
            _this.showLoading = false;
            alert("请求失败了!!!!");
          }
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/minxin.less";


.checkedTag {
  display: inline-block;
  font-size: 12px;
  color: #fff;
  background-color: #48B319;
  border-radius: 1px;
  margin-right: 5px;
  padding: 5px 10px;
}

.uncheckedTag {
  display: inline-block;
  font-size: 12px;
  color: #222;
  background-color: #ddd;
  border-radius: 1px;
  margin-right: 5px;
  padding: 5px 10px;
}

.back-div {
  padding-bottom: 50px;
}

.up-back {
  width: 100%;
  height: 50px;
  font-size: @fontSize36;
  line-height: 50px;
  color: @white;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.accessory-box {
  .mixin-padding(15px, 15px);
}

.accessory-title {
  font-size: @fontSize30;
  color: @color42;
  margin-top: 8px;
}

.form-info .vux-label {
  font-size: @fontSize30;
}

// .accessory-img {
//   margin-top: 25px;
// }

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
  margin-bottom: 10px;
}

.up-photo {
  margin-left: 10px;
  width: 75px;
  height: 75px;
  display: block;
  position: relative;
}

.photo-img li {
  margin-right: 11px;
  position: relative;
}

// .photo-img li:last-child{
//   margin-right: 0;
// }

.photo-img li,
.photo-img li img.imgud,
.up-photo img {
  width: 75px;
  height: 75px;
}

.photo-img li img.imgud,
.up-photo img {
  display: block;
}

.cancel {
  width: 25px;
  height: 25px;
  font-size: 25px;
  position: absolute;
  top: -13px;
  right: -13px;
  display: block;
}

// .btn-uploder {
//   line-height: 40px;
//   text-align: center;
//   font-size: @fontSize30;
//   color: @white;
//   background: @green;
//   border-radius: 2px;
//   flex: 1;
// }

.cancel-btn {
  width: 100%;
  height: 50px;
  font-size: @fontSize36;
  color: @white;
  text-align: center;
  line-height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.ps-info-p {
  color: #4caf50;
  font-size: 12px;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  margin-top: 15px;
}

.mui_uploader {
  width: 75px;
  height: 75px;
  position: absolute;
  top: 0px;
  left: 0px;
}

.mui_uploader .mui_uploader_input {
  width: 75px;
  height: 75px;
  display: block;
  opacity: 0;
}

.container {
  background-color: #efefef;
  min-height: 100%;
}

.btn-calie {
  line-height: 40px;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  background: #999999;
  border-radius: 2px;
  flex: 1
}

.video-tnl {
  width: 75px;
  height: 75px;
  position: relative;
}

.up-videos {
  width: 75px;
  height: 75px;
  display: block;
}

.scope-title-box {
  border-bottom: 1px solid @colorDD;
}
</style>

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
</style>