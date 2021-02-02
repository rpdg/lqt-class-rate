<template>
  <div class="panel" ref="panel" :data-index="index">
    <table v-if="task.__shown">
      <tr>
        <td>班级：{{task.CLASS_NAME}}</td>
        <td>评分项：{{task.NAME}}</td>
      </tr>
      <tr>
        <td>日期：{{task.END_TIME}}</td>
        <td>评分范围：{{task.SCORE_UP}}~{{task.SCORE_DN}}分</td>
      </tr>
      <tr>
        <td>
          评分：
          <van-stepper
            class="inline-stepper"
            disable-input
            :min="task.SCORE_UP"
            :max="task.SCORE_DN"
            :step="step"
            v-model="task.SCORE"
            @change="handleChange"
          />
        </td>
        <td rowspan="2">
          添加图片：
          <span style="color:#999;">(最多4张)</span>
          <br />
          <van-uploader
            ref="fcc"
            class="inline-uploader"
            v-model="task.IMG_LIST"
            max-count="4"
            multiple
            preview-size="12vw"
            :capture="cameraOnly"
            :after-read="afterRead"
            @delete="deleteImg"
            @click-preview="setPreviewState(true)"
            @close-preview="setPreviewState(false)"
          />
          <van-action-sheet
            v-model="showActions"
            cancel-text="取消"
            close-on-click-action
            :actions="[{ name: '拍摄' }, { name: '从相册选择' }]"
            @select="onSelectAction"
          />
        </td>
      </tr>
      <tr>
        <td valign="top">
          <span style="float:left;">
            备注：
            <br />
            <van-tag
              plain
              :type="task.WRITE_STATUS=='-1'?'danger':task.WRITE_STATUS=='0'?'primary':'success'"
              size="medium"
            >{{statusText}}</van-tag>
          </span>
          <textarea maxlength="50" v-model="task.COMMENT" @change="handleChange"></textarea>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { Stepper, Uploader, Toast, Tag, ActionSheet, Button } from "vant";
// import ImageUploader from './Uploader';
import wx from "weixin-js-sdk";
import apiRouter from "../../../../config/api.js";

async function imgCompress(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = src;

    img.onload = function() {
      let w = this.naturalWidth,
        h = this.naturalHeight,
        resizeW = 0,
        resizeH = 0;

      let option = {
        maxSize: 1600,
        level: 0.6
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

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

async function dataUrlToFile(dataUrl, fileName) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: "image/png" });
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
    io: {
      type: IntersectionObserver,
      required: true
    },
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
    [Stepper.name]: Stepper,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet
  },
  computed: {
    statusText() {
      const { WRITE_STATUS } = this.task;

      return WRITE_STATUS === "0"
        ? "未填"
        : WRITE_STATUS === "-1"
          ? "弃填"
          : "已填";
    }
  },
  data() {
    return {
      fileList: [],
      showActions: false,
      cameraOnly: "",
      localIdImgs: []
    };
  },
  mounted() {
    // console.log("mounted", this.task.ID, this.$refs.panel);
    this.io.observe(this.$refs.panel);

    //
    // Uploader.methods.chooseFile = function() {
    //   alert("aa");
    //   let _this = this;

    //   wx.chooseImage({
    //     count: 4 - _this.localIdImgs.length, // 默认9
    //     sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
    //     sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
    //     success: function(res) {
    //       let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    //       alert(localIds.length);
    //     },
    //     fail: function(res) {
    //       console.log("失败");
    //     }
    //   });
    // };
    // console.log(Uploader);
  },
  beforeDestroy() {
    // console.log("beforeDestory", this.task.ID);
    this.io.unobserve(this.$refs.panel);
  },
  updated() {
    // patch vant-uploader to use wechat image choose style
    let vUploader = this.$refs.fcc;
    if (vUploader) {
      const fileIpt = vUploader.$refs.input;

      if (fileIpt&& fileIpt.style.visibility !== "hidden") {
        fileIpt.style.visibility = "hidden";

        const iptWrapper = fileIpt.parentNode;
        let placeholder = document.createElement("div");
        placeholder.className = "photoChooser";
        iptWrapper.appendChild(placeholder);
        placeholder.addEventListener("click", () => {
          // this.showActions = true;

          let _this = this;

          wx.chooseImage({
            count: 4 - this.localIdImgs.length, // 默认9
            sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有

            success: async function(res) {
              // 返回选定照片的本地ID列表
              _this.readImages(res.localIds);
            },
            fail: function(err) {
              console.log(err);
            }
          });
        });

        // console.log("fcc", iptWrapper);
      }
    }
  },
  methods: {
    // async beforeRead(imgItem) {
    //   return new Promise((resolve, reject) => {
    //     debugger;
    //     resolve(imgItem);
    //   });
    // },

    doReadImage(item) {
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
    async readImages(localIds) {
      let files = [];
      for (let i = 0; i < localIds.length; i++) {
        let base64 = await this.doReadImage(localIds[i]);
        let file = await dataUrlToFile(base64);
        files.push(file);
      }
      this.localIdImgs = files;
      // console.log(file);
      this.$refs.fcc.readFile(files);
    },

    async afterRead(imgItems) {
      // debugger;

      // let sendData = [];
      // imgItems.forEach(imgItem => {
      //   sendData.push(imgItem.content);
      // });

      // let resp = await this.$http.post(
      //   apiRouter.CLASS_RATE_BATCH_UPLOAD_IMG,
      //   {file:sendData}
      // );

      if (imgItems instanceof Array) {
        imgItems.forEach(imgItem => {
          this.uploadImage(imgItem);
        });
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

    async deleteImg(imgItem) {
      // console.log(imgItem);

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
            // let index = this.fileList.indexOf(imgItem);
            // this.fileList.splice(index , 1);
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

    onSelectAction(item, i) {
      this.cameraOnly = i === 0 ? "camera" : null;
      setTimeout(() => {
        this.$refs.fcc.chooseFile();
      }, 2e2);
    },

    handleChange() {
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

    .photoChooser {
      position: absolute;
      top: 0;
      left: 0;
      width: 12vw;
      height: 12vw;
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
.panel {
  width: 94.7vw;
  min-height: 50vw;
  // height: 53vw;
  margin: 10px auto 20px auto;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  padding: 5vw 7vw;

  .van-tag {
    font-size: 10px;
    margin-right: 0.5em;
  }

  table {
    width: 100%;
    table-layout: fixed;

    td {
      vertical-align: top;
      line-height: 2em;
    }
    tr {
      > td:nth-of-type(2) {
        padding-left: 1.3vw;
      }
    }
    tr:last-of-type {
      td {
        padding-top: 6px;
      }
    }

    textarea {
      border: 1px solid #999;
      width: 26.7vw;
      height: 22.4vw;
      vertical-align: top;
      resize: none;
      box-shadow: none;
      font-size: 14px;
      line-height: 1.5em;
    }
  }
}
</style>
