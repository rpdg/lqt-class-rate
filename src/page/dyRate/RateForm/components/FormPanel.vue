<template>
  <div class="panel" ref="panel" :data-index="index">
    <table v-if="task.__shown">
      <tr>
        <td>班级：{{ task.CLASS_NAME }}</td>
        <td>评分项：{{ task.NAME }}</td>
      </tr>
      <tr>
        <td>日期：{{ task.END_TIME }}</td>
        <td>评分范围：{{ task.SCORE_UP }}~{{ task.SCORE_DN }}分</td>
      </tr>
      <tr>
        <td>
          评分：
          <van-stepper class="inline-stepper" :min="task.SCORE_UP" :max="task.SCORE_DN" :step="step"
            v-model="task.SCORE" @change="handleChange(true)" @blur="handleStepBlur" />
        </td>
        <td>
          添加图片：
          <span style="color:#999;">(最多4张)</span>
        </td>
      </tr>
      <tr>
        <td valign="top">

          <div style="display: flex; width: 155px; height: 106px;">

            <div style="width: 45px;">
              <span style="float:left;">
                备注：
              </span>
              <br />
              <van-button plain hairline color="#48B319" style="color:#48B319;" size="mini"
                v-bind:disabled="!task.COMMENT1" @click="showPopup1">语库1</van-button>
              <br />
              <van-button plain hairline color="#EE0A24" style="color:#EE0A24;" size="mini"
                v-bind:disabled="!task.COMMENT2" @click="showPopup2">语库2</van-button>
            </div>

            <div style="flex: 1;">
              <textarea style="height: 98%;" maxlength="50" v-model="task.COMMENT"
                @change="handleChange(false)"></textarea>
            </div>
          </div>

        </td>
        <td>
          <div style="display: flex; height: 106px;">
            <div style="flex: 1;">
              <van-uploader ref="fcc" class="inline-uploader" v-model="task.IMG_LIST" max-count="4" multiple
                accept="image/*;capture=camera" capture="camera" preview-size="12vw"
                :preview-options="{ closeable: true }" :after-read="afterRead" @delete="deleteImg"
                @click-preview="setPreviewState(true)" @close-preview="setPreviewState(false)" />
            </div>

            <div style="width: 38px; display: flex; align-items: end;">
              <van-tag style="font-size: 9px; padding: 2px 5px; margin-bottom: 8px;"
                :color="task.WRITE_STATUS == '-1' ? '#EEE1E1' : task.WRITE_STATUS == '0' ? '#ECF5FF' : '#EBF9D9'"
                :text-color="task.WRITE_STATUS == '-1' ? '#EE0A24' : task.WRITE_STATUS == '0' ? '#0093DD' : '#48B319'"
                size="medium">{{ statusText }}</van-tag>
            </div>

          </div>

        </td>
      </tr>
    </table>
    <van-popup v-model="showFastComment1" position="bottom" :style="{ height: '80vh' }">
      <div class="evaPicker">
        <div class="evaPickerToolbar">语库1</div>
        <div class="evaPickerRow" v-for="( str, i ) in comment1" :key="'yk1' + i" @click="putIn(str)">{{ str }}</div>
      </div>
    </van-popup>
    <van-popup v-model="showFastComment2" position="bottom" :style="{ height: '80vh' }">
      <div class="evaPicker">
        <div class="evaPickerToolbar">语库2</div>
        <div class="evaPickerRow" v-for="( str, i ) in comment2" :key="'yk2' + i" @click="putIn(str)">{{ str }}</div>
      </div>
    </van-popup>

    <van-action-sheet v-model="showActions" cancel-text="取消" close-on-click-action
      :actions="[ { name: '拍摄' }, { name: '从相册选择' } ]" @select="onSelectAction" />
    <div v-if="openCamera" class="cameraWrap">
      <button ref="takePic" @click.stop.prevent="savePicture" class="btnTakePic"></button>
      <video autoplay ref="video" class="cameraScreen"></video>
      <canvas ref="canvas" style="display: none;"></canvas>
    </div>
  </div>

</template>
<script>
import { Stepper, Uploader, Toast, Tag, ActionSheet, Button, Popup } from "vant";
// import ImageUploader from './Uploader';
import wx from "weixin-js-sdk";
import apiRouter from "../../../../config/api.js";

async function imgCompress(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;

    img.onload = function () {
      let w = this.naturalWidth,
        h = this.naturalHeight,
        resizeW = 0,
        resizeH = 0;

      const option = {
        maxSize: 1200,
        level: 0.5
      };

      if (w > option.maxSize || h > option.maxSize) {
        const multiple = Math.max(w / option.maxSize, h / option.maxSize);
        resizeW = w / multiple;
        resizeH = h / multiple;

        const imgType =
          src.indexOf("image/jpeg") > -1 ? "image/jpeg" : "image/png";
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = resizeW;
        canvas.height = resizeH;
        ctx.drawImage(img, 0, 0, resizeW, resizeH);
        let base64 = canvas.toDataURL(imgType, option.level);
        resolve(base64);
      } else {
        resolve(src);
      }
    };
  });
}

async function getBase64(blob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(new Blob(blob));
  });
}

function dataURLtoFile(dataURI, filename) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[ 0 ].indexOf("base64") >= 0) {
    byteString = atob(dataURI.split(",")[ 1 ]);
  } else {
    byteString = unescape(dataURI.split(",")[ 1 ]);
  }

  // separate out the mime component
  let mimeString = dataURI
    .split(",")[ 0 ]
    .split(":")[ 1 ]
    .split(";")[ 0 ];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[ i ] = byteString.charCodeAt(i);
  }

  return new Blob([ ia ], { type: mimeString });
}

async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([ blob ], fileName, { type: "image/jpeg" });
}

function platform() {
  //检查用户代理
  const ua = navigator.userAgent.toLowerCase();
  if (/micromessenger/.test(ua)) {
    return 'wechat';
  } else if (/iphone|ipad|ipod/.test(ua)) {
    return 'iOS';
  } else if (/android/.test(ua) || /harmonyos/.test(ua)) {
    return 'Android';
  } else {
    return 'unkown';
  }
}

export default {
  props: {
    step: {
      type: Number,
      required: true,
      default: 1
    },
    task: {
      type: Object,
      required: true,
      default: 0
    },
    // io: {
    //   type: IntersectionObserver,
    //   required: true
    // },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    setPreviewState: {
      type: Function,
      required: true
    }
  },
  components: {
    // ImageUploader,
    [ Stepper.name ]: Stepper,
    [ Uploader.name ]: Uploader,
    [ Toast.name ]: Toast,
    [ Tag.name ]: Tag,
    [ Button.name ]: Button,
    [ ActionSheet.name ]: ActionSheet,
    [ Popup.name ]: Popup,
  },
  computed: {
    statusText() {
      const { WRITE_STATUS } = this.task;

      return WRITE_STATUS === "0"
        ? "未填"
        : WRITE_STATUS === "-1"
          ? "弃填"
          : "已填";
    },
    leftImageCount() {
      return 4 - this.task.IMG_LIST.length;
    },
    comment1() {
      const { COMMENT1 } = this.task;
      return COMMENT1.split('<br />\n');
    },
    comment2() {
      const { COMMENT2 } = this.task;
      return COMMENT2.split('<br />\n');
    }
  },
  data() {
    return {
      showActions: false,
      isWx: platform() === 'wechat',
      showFastComment1: false,
      showFastComment2: false,
      openCamera: false,
      mediaStream: null,
    };
  },
  mounted_old() {
    // console.log("mounted", this.task.ID, this.$refs.panel);
    // this.io.observe(this.$refs.panel);
  },
  beforeDestroy() {
    // console.log("beforeDestory", this.task.ID);
    // this.io.unobserve(this.$refs.panel);
  },
  mounted() {
    const p = platform();
    if (p === 'wechat') {
      this.patchWx();
    } else if (p === 'unkown') {
      this.patchWindows();
    }
  },
  updated() {
    const p = platform();
    if (p === 'wechat') {
      this.patchWx();
    } else if (p === 'unkown') {
      this.patchWindows();
    }
  },
  methods: {
    async savePicture() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.drawImage(this.$refs.video, 0, 0);
      const base64 = canvas.toDataURL();
      let file = await dataUrlToFile(base64);
      let files = file;
      // console.log(file);
      this.mediaStream.getVideoTracks().forEach(videoTrack => {
        videoTrack.stop();
      });
      // debugger;
      // this.mediaStream.release();
      this.mediaStream = null;
      this.openCamera = false;
      this.$refs.fcc.readFile(files);
    },
    processCamera() {
      const video = this.$refs.video;
      video.srcObject = this.mediaStream;
      video.onloadedmetadata = () => {
        // debugger;
        // let rect = video.getBoundingClientRect();
        const canvas = this.$refs.canvas;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };
    },
    onSelectAction(item, i) {
      setTimeout(() => {
        if (i === 0) {
          if (window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia) {
            // Good to go!
            navigator.mediaDevices.getUserMedia({ video: { width: { exact: 1280 }, height: { exact: 720 } }, audio: false })
              .then((localMediaStream) => {
                this.openCamera = true;
                this.mediaStream = localMediaStream;
                this.$nextTick(() => {
                  this.processCamera();
                });
              }).catch((error) => {
                alert("拒绝访问, " + error.toString());
              });
          } else {
            alert("当前平台不支持媒体获取");
          }
        } else {
          this.$refs.fcc.chooseFile();
        }
      }, 2e2);
    },

    patchWindows() {
      let vUploader = this.$refs.fcc;
      if (vUploader) {
        const fileIpt = vUploader.$refs.input;

        if (
          fileIpt &&
          fileIpt.tagName === "INPUT" &&
          fileIpt.style.visibility !== "hidden"
        ) {
          fileIpt.style.visibility = "hidden";
          fileIpt.style.display = "none";

          const iptWrapper = fileIpt.parentNode;
          let doms = iptWrapper.parentNode.querySelectorAll(".van-uploader__preview > .photoChooser");
          if (doms && doms.length) {
            doms.forEach(dom => dom.remove());
          }

          let placeholder = document.createElement("div");
          placeholder.className = "photoChooser";
          iptWrapper.appendChild(placeholder);
          placeholder.addEventListener("click", () => {
            this.showActions = true;
          });
        }
      }
    },
    // async beforeRead(imgItem) {
    //   return new Promise((resolve, reject) => {
    //     debugger;
    //     resolve(imgItem);
    //   });
    // },

    putIn(str) {
      this.task.COMMENT = (this.task.COMMENT ? this.task.COMMENT + '' : '') + str;
      this.showFastComment1 = this.showFastComment2 = false;
    },

    showPopup1() {
      this.showFastComment1 = true;
    },

    showPopup2() {
      this.showFastComment2 = true;
    },

    patchWx() {
      debugger;
      // patch vant-uploader to use wechat image choose style
      // if using lazy-render, this should be trigged at "updated"
      let vUploader = this.$refs.fcc;
      if (vUploader) {
        const fileIpt = vUploader.$refs.input;

        if (
          fileIpt &&
          fileIpt.tagName === "INPUT" &&
          fileIpt.style.visibility !== "hidden"
        ) {
          fileIpt.style.visibility = "hidden";
          fileIpt.style.display = "none";

          const iptWrapper = fileIpt.parentNode;
          let doms = iptWrapper.parentNode.querySelectorAll(".van-uploader__preview > .photoChooser");
          if (doms && doms.length) {
            // debugger;
            // iptWrapper.appendChild(dom);
            // console.log(doms);
            doms.forEach(dom => dom.remove());
          }

          let placeholder = document.createElement("div");
          placeholder.className = "photoChooser";
          iptWrapper.appendChild(placeholder);
          placeholder.addEventListener("click", () => {
            // this.showActions = true;

            let _this = this;
            // alert("count: " + JSON.stringify(this.leftImageCount));

            setTimeout(function () {
              wx.chooseImage({
                count: _this.leftImageCount, // max: 9
                sizeType: [ "original", "compressed" ], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: [ "album", "camera" ], // 可以指定来源是相册还是相机，默认二者都有

                success: async function (res) {
                  // 返回选定照片的本地ID列表
                  _this.readImages(res.localIds);
                },
                fail: function (err) {
                  console.log(err);
                }
              });
            }, 3e2);

          });

          // console.log("fcc", iptWrapper);
        }
      }
    },

    doReadImage(item) {
      return new Promise(resolve => {
        wx.getLocalImgData({
          localId: item,
          success: function (res) {
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
          fail: function (err) {
            console.error(err);
          }
        });
      });
    },
    async readImages(localIds) {
      let files = [];
      for (let i = 0; i < localIds.length; i++) {
        let base64 = await this.doReadImage(localIds[ i ]);
        let file = await dataUrlToFile(base64);
        files.push(file);
      }
      // console.log(file);
      this.$refs.fcc.readFile(files);
      //
      //// this.leftImageCount = 4 - files.length;
    },

    async afterRead(imgItems) {
      if (imgItems instanceof Array) {
        imgItems.forEach(imgItem => {
          imgItem.status = "uploading";
        });

        for (let i = 0, l = imgItems.length; i < l; i++) {
          await this.uploadImage(imgItems[ i ]);
        }
      } else {
        this.uploadImage(imgItems);
      }
    },

    async uploadImage(imgItem) {
      try {
        imgItem.status = "uploading";

        let compressedImg = await imgCompress(imgItem.content);

        const sendData = {
          detail_id: this.task.ID,
          baseImg: compressedImg
        };

        let resp = await this.$http.post(
          apiRouter.CLASS_RATE_UPLOAD_IMG,
          sendData
        );

        if (resp.status === 200) {
          let respBody = resp.body;
          if (respBody.code === 200) {
            imgItem.id = respBody.data.id;
            imgItem.status = "done";
          } else {
            imgItem.status = "failed";
          }
        } else {
          imgItem.status = "failed";
        }
      } catch (e) {
        imgItem.status = "failed";
      }
    },

    async deleteImg(imgItem, info) {
      // console.log(imgItem, info);

      try {
        imgItem.status = "uploading";

        const sendData = {
          detail_id: this.task.ID,
          id: imgItem.id
        };

        let resp = await this.$http.post(
          apiRouter.CLASS_RATE_DEL_IMG,
          sendData
        );

        if (resp.status === 200) {
          let respBody = resp.body;
          if (respBody.code === 200) {
            imgItem.status = "done";
            //// this.leftImageCount = this.leftImageCount + 1;
            // let index = info.index;
            // this.task.IMG_LIST.splice(index , 1);
          } else {
            imgItem.status = "failed";
          }
        } else {
          imgItem.status = "failed";
        }
      } catch (e) {
        imgItem.status = "failed";
      }
    },


    handleStepBlur(e) {
      // console.log(this.task.SCORE);
      let v = ~~(this.task.SCORE * 100) / 100;
      this.task.SCORE = v;
    },
    handleChange(isFromStepper) {
      // if(isFromStepper){
      //   console.log('aa')
      // }
      this.$emit("modify", true);
    }
    // handlePreview(status){
    //   window.alert(status)
    // }
  }
};
</script>
<style lang="less">
.box {
  .van-cell__right-icon {
    color: #ddd;
  }
}

.inline-uploader {
  .van-uploader__upload {
    width: 12vw;
    height: 12vw;
    border: 1px solid #ccc;
  }

  .photoChooser {
    position: absolute;
    top: 0;
    left: 0;
    width: 12vw;
    height: 12vw;
  }

  .van-uploader__preview {
    .photoChooser {
      display: none;
    }
  }
}

.inline-stepper {
  vertical-align: middle;
  display: inline-flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 22px;

  button {
    width: 20px;
    height: 20px;
  }

  input {
    margin: 0;
    border: solid #ddd;
    border-width: 0 1px;
    height: 20px;
  }
}
</style>

<style lang="less" scoped>
.cameraWrap {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;

  .cameraScreen {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }

  .btnTakePic {
    z-index: 9999;
    position: fixed;
    border-radius: 100%;
    width: 60px;
    height: 60px;
    bottom: 20px;
    left: 50%;
    margin-left: -30px;
    // border: 5px solid transparent;
    box-shadow: 0 0 0 5px transparent, 0 0 0 6px fade(#fff, 35%)
  }
}


.panel {
  // width: 94.7vw;
  min-height: 50vw;
  // height: 53vw;
  margin: 10px 15px 20px 15px;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  padding: 3vw 4vw;

  .van-tag {
    font-size: 10px;
    margin-right: 0.5em;
    padding-top: 3px;
  }

  .van-tag--success {
    color: #48b319;
  }

  .van-tag--danger {
    color: #ed561b;
  }

  table {
    width: 100%;
    table-layout: fixed;

    td {
      vertical-align: top;
      line-height: 2em;
    }

    tr {
      >td:nth-of-type(2) {
        padding-left: 1.3vw;
      }
    }

    tr:last-of-type {
      td {
        padding-top: 6px;
      }
    }

    textarea {
      border: 1px solid #ddd;
      width: 26.7vw;
      height: 22.4vw;
      vertical-align: top;
      resize: none;
      box-shadow: none;
      font-size: 14px !important;
      line-height: 1.5em;

      &:focus {
        border-color: #999;
      }
    }
  }
}


.evaPicker {
  padding: 0 15px;
  height: 100%;
  display: flex;
  flex-direction: column;

  >.evaPickerToolbar {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    text-align: center;
  }

  >.evaPickerRow {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    border-bottom: 1px dashed #dedede;
  }

  >.evaRecord {
    margin: 0;
    flex: 1;
  }
}
</style>
