<template>
  <div class="form-info clearfix">
    <back-title-bar :title="`${TOPIC_ID.length ? '取消编辑' : '发布'}`" />

    <!-- <p class="cancel-btn" @click="backHome()" v-if="TOPIC_ID.length > 0">取消编辑</p>
    <p class="cancel-btn" @click="backHome()" v-else>取消发布</p> -->

    <div class="scope-title-box">
      <x-textarea :max="1000" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" class="x-textarea"
        :placeholder="(checkedTag && checkedTag.COMMENT)?checkedTag.COMMENT:'说点什么...'" :rows="7" v-model="contentValue" style="font-size: 16px">
      </x-textarea>
    </div>
    <div class="timecodeDiv" style="margin-top: 8px; margin-left: 15px; margin-right: 15px;">
      <span v-for="(value, index) in tagList" :key="index" @click="checkTag(value.ID)"
        :class="TAG_ID == value.ID ? 'checkedTag' : 'uncheckedTag'">{{ value.TITLE }}</span>
    </div>
    <div class="accessory-box">
      <div class="accessory-img clearfix" style="margin-top:15px;">
        <ul class="photo-img">
          <li v-for="(item, index) in localIdImgs" :key="index">
            <img :src="item" alt="" class="imgud">
            <img src="../../assets/cancel.png" alt="" class="cancel" @click="clodesd(index)">
          </li>
          <li>
            <a class="up-photo" href="javascript:;" @click="onClickUp()" v-show="imgLenght">
              <img src="../../assets/addup.jpg" alt="">
            </a>
          </li>
        </ul>

      </div>
    </div>

    <div style="text-align: right;">
      <button @click="delSubmit()" class="btn-calie" type="submit" v-if="this.isDle === true">删除本条
      </button>
      <x-button v-on:click.native="goUploder" :show-loading="showLoading" :disabled="showLoading"
        class="btn-uploder right" type="submit">发布
      </x-button>
    </div>


    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :position="position">
      {{ toastMessage }}
    </toast>

    <div v-transfer-dom>
      <confirm v-model="popup" :close-on-confirm="false" :title="('是否确认删除？')" @on-confirm="onConfirm()"
        confirmText="是，我要删除">
      </confirm>
    </div>

    <!-- </form>-->

  </div>
</template>

<script>
import BackTitleBar from "../../components/common/BackTitleBar.vue";
import {
  Toast,
  Checker,
  CheckerItem,
  Group,
  XAddress,
  XTextarea,
  ChinaAddressV3Data,
  XButton,
  Confirm,
  Cell,
  Radio,
  Datetime,
  TransferDomDirective as TransferDom
} from "vux";
import axios from "axios";
import wx from "weixin-js-sdk";
import apiRouter from "../../config/api.js";
export default {
  created: function () {
    //getSelectDates();
    //timeData()
    this.showTop();
    this.localIdImgs = [];
  },
  directives: {
    TransferDom
  },
  components: {
    BackTitleBar,
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
    Confirm
  },
  data() {
    return {
      showLoading: false,
      popup: false,
      isDle: false,
      imgLenght: true,
      imgaesMaxLenght: 9,
      value7: "",
      images: {
        localId: [],
        serverId: []
      },

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
      tagList: [],
      checkedTag: null,
      TAG_ID: '',
      TOPIC_ID: '',
      SPACE_ID: ''
    };
  },
  created() {
    this.SPACE_ID = this.$route.query.SPACE_ID;
    this.TOPIC_ID = this.$route.query.TOPIC_ID;
    this.TAG_ID = this.$route.query.tagId;
    this.getSchoolTopicTags();
    if (this.TOPIC_ID) {
      this.ediltTopic();
      this.isDle = true;
    }
  },
  mounted() {
    this.localIdImgs = [];
    this.urlPath = window.location.href.split("#")[ 0 ];
    this.showLoading = false;
    this.getUrlConfig();
  },
  methods: {
    getSchoolTopicTags() {
      let _this = this;
      _this.$http.get(apiRouter.SPACE_TAG + "?SPACE_ID=" + _this.SPACE_ID + "&TOPIC_ID=" + this.TOPIC_ID).then(response => {
        if (response.status === 200) {
          console.log(response.data.data);
          _this.tagList = response.data.data;
          for (let i = 0; i < _this.tagList.length; i++) {
            if (_this.tagList[ i ].ID === _this.TAG_ID) {
              _this.checkedTag = _this.tagList[ i ];
              break;
            }
          }
        }
      });
    },
    checkTag(id) {
      if (this.TAG_ID === id) {
        this.TAG_ID = '';
      } else {
        this.TAG_ID = id;
        for (let i = 0; i < this.tagList.length; i++) {
          if (this.tagList[ i ].ID === this.TAG_ID) {
            this.checkedTag = this.tagList[ i ];
            break;
          }
        }
      }
    },
    ediltTopic() {
      let _this = this;
      _this.$http
        .get(
          apiRouter.SPACE_DETAIL +
          "?SPACE_ID=" + this.SPACE_ID +
          "&TOPIC_ID=" + this.TOPIC_ID +
          "&tagId=" + this.TAG_ID
        )
        .then(response => {
          if (response.status === 200) {
            let imgs = response.data.data.IMG_LIST;
            console.log(imgs);
            this.contentValue = response.data.data.CONTENT;
            this.serverId = imgs;
            imgs.forEach((item, index) => {
              this.localIdImgs.push(roterPath + item.url);
            });
            console.log(response);
          }
        });
    },

    // 删除本条记录
    delSubmit() {
      let _this = this;
      _this.popup = true;
    },
    onConfirm(position, msg) {
      let _this = this;
      let url = apiRouter.SPACE_DEL +
        "?SPACE_ID=" + _this.SPACE_ID +
        "&TOPIC_ID=" + _this.TOPIC_ID;
      _this.$http.post(url).then(response => {
        if (response.body.status === 200) {
          setTimeout(_this.backHome, 1200);
        } else {
          _this.position = position;
          _this.toastMessage = response.body.message;
          _this.showPositionValue = true;
        }
      }, erro => {
      });
      this.popup = false;
      return;
      this.$vux.loading.show({
        transition: '',
        text: 'processing'
      });
      setTimeout(() => {
        this.$vux.loading.hide();
        this.popup = false;
      }, 1000);
    },

    showTop() {
      window.scrollTo(0, 0);
    },

    // goBack() {
    //   alert("返回了")
    // },

    change(value, label) {
      //  console.log('change:', value, label)
    },
    goUploder(position, msg) {
      this.showLoading = true;
      let _this = this;
      if (_this.TAG_ID) {
        let picMinMun = ~~_this.checkedTag.PIC_NUM;
        if (_this.localIdImgs.length < picMinMun) {
          _this.position = position;
          _this.toastMessage = "本主题至少上传" + picMinMun + "张图片";
          _this.showPositionValue = true;
          _this.showLoading = false;
          return;
        }
      }
      if (_this.contentValue === "" || _this.contentValue.trim() == "") {   //   || _this.serverId.length === 0
        _this.position = position;
        _this.toastMessage = "请填写内容";
        _this.showPositionValue = true;
        _this.showLoading = false;

      } else {
        let sendObj = {
          SPACE_ID: _this.SPACE_ID,
          CONTENT: _this.contentValue.replace(/＃/g, '#'),
          IMG_LIST: JSON.stringify(_this.serverId),
          TOPIC_ID: _this.TOPIC_ID,
          tagId: _this.TAG_ID,
          IS_VIDEO: 0
        };
        console.log(sendObj);

        _this.$http.post(apiRouter.SPACE_PHOTO, sendObj).then(
          response => {
            console.log(response);
            if (response.status === 200) {
              _this.position = position;
              _this.toastMessage = "发布成功";
              _this.showPositionValue = true;
              setTimeout(_this.backHome, 1200);
            } else {
              _this.position = position;
              _this.toastMessage = "发布失败";
              _this.showPositionValue = true;
              _this.showLoading = false;
            }
          },
          error => {
            _this.position = position;
            _this.toastMessage = "发布失败";
            _this.showPositionValue = true;
            _this.showLoading = false;
          }
        );
      }
    },
    backHome() {
      window.location.replace(apiRouter.BACK_SPACE + this.SPACE_ID);
      //this.showLoading = false;
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
<style lang="less" scoped>
@import "../../style/minxin.less";

.checkedTag {
  display: inline-block;
  font-size: 12px;
  color: #fff;
  background-color: #48B319;
  border-radius: 1px;
  margin-right: 10px;
  padding: 5px 10px;
}

.uncheckedTag {
  display: inline-block;
  font-size: 12px;
  color: #222;
  background-color: #ddd;
  border-radius: 1px;
  margin-right: 10px;
  padding: 5px 10px;
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
  .mixin-padding(50/@baseSize, 50/@baseSize);
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
  .mixin-padding(30/@baseSize, 30/@baseSize);
  margin-top: 20 / @baseSize;
  margin-bottom: 20 / @baseSize;
}

.span-cell span {
  border: 1px solid @green;
  border-radius: 4px;
  .mixin-padding(20/@baseSize, 20/@baseSize);
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
  .mixin-padding(30/@baseSize, 30/@baseSize);
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
  .mixin-padding(30/@baseSize, 30/@baseSize);
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
  .mixin-padding(30/@baseSize, 30/@baseSize);
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
  margin-top: 50 / @baseSize;
}

.weui-cell__ft,
.vux-cell-value {
  font-size: @fontSize28;
}

.photo-img,
.photo-img li {
  float: left;
}

.photo-img li {
  margin-bottom: 20 / @baseSize;
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

.btn-calie {
  line-height: 80/@baseSize;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  width: 200/@baseSize;
  background: #999999;
  margin-right: 40/@baseSize;
  margin-top: 80/@baseSize;
}
</style>
