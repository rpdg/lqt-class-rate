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
          />
        </td>
        <td rowspan="2">
          添加图片：
          <br />
          <van-uploader
            class="inline-uploader"
            v-model="task.IMG_LIST"
            max-count="4"
            preview-size="12vw"
            :before-read="beforeRead"
            :after-read="afterRead"
            @delete="deleteImg"
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
              :type="task.WRITE_STATUS=='-1'?'danger':'primary'"
              size="medium"
            >{{statusText}}</van-tag>
          </span>
          <textarea maxlength="50" v-model="task.COMMENT"></textarea>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { Stepper, Uploader, Toast, Tag } from 'vant'
import apiRouter from '../../../config/api.js'

function imgCompress(src, callback) {
  //图片超过尺寸压缩
  let img = new Image()
  img.src = src
  img.onload = function () {
    let w = this.naturalWidth,
      h = this.naturalHeight,
      resizeW = 0,
      resizeH = 0
    let maxSize = {
      width: 1000,
      height: 1000,
      level: 0.5,
    }
    if (w > maxSize.width || h > maxSize.height) {
      let multiple = Math.max(w / maxSize.width, h / maxSize.height)
      resizeW = w / multiple
      resizeH = h / multiple
    } else {
      // 如果图片尺寸小于最大限制，则不压缩直接上传
      return callback()
    }
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = resizeW
    canvas.height = resizeH
    ctx.drawImage(img, 0, 0, resizeW, resizeH)
    let base64 = canvas.toDataURL('image/jpeg', maxSize.level)
    callback(base64)
  }
}

async function getBase64(blob, callback) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(new Blob(blob))
  })
}

export default {
  props: {
    step: {
      type: Number,
      required: true,
      default: 1,
    },
    task: {
      type: Object,
      required: true,
      default: 0,
    },
    io: {
      type: IntersectionObserver,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  components: {
    [Stepper.name]: Stepper,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast,
    [Tag.name]: Tag,
  },
  computed: {
    statusText() {
      const { WRITE_STATUS } = this.task

      return WRITE_STATUS === '0'
        ? '未填'
        : WRITE_STATUS === '-1'
        ? '已弃填'
        : '已填'
    },
  },
  data() {
    return {
      fileList: [],
    }
  },
  mounted() {
    // console.log("mounted", this.task.ID, this.$refs.panel);
    this.io.observe(this.$refs.panel)
  },
  beforeDestroy() {
    // console.log("beforeDestory", this.task.ID);
    this.io.unobserve(this.$refs.panel)
  },
  methods: {
    async beforeRead(imgItem) {
      return new Promise((resolve, reject) => {
        // let imageUrl = getObjectURL(imgItem.file);
        resolve(imgItem)
      })
    },

    async afterRead(imgItem) {
      try {
        imgItem.status = 'uploading'

        // let base64 = await getBase64(imgItem.file);
        // console.log(base64);

        const sendData = {
          detail_id: this.task.ID,
          baseImg: imgItem.content,
        }

        let resp = await this.$http.post(
          apiRouter.CLASS_RATE_UPLOAD_IMG,
          sendData
        )

        if (resp.status === 200) {
          let respBody = resp.body
          if (respBody.code === 200) {
            imgItem.id = respBody.data.id
            imgItem.status = 'done'
          } else {
            imgItem.status = 'failed'
          }
        } else {
          imgItem.status = 'failed'
        }
      } catch (e) {
        imgItem.status = 'failed'
      }
    },

    async deleteImg(imgItem) {
      console.log(imgItem)

      try {
        imgItem.status = 'uploading'

        const sendData = {
          detail_id: this.task.ID,
          id: imgItem.id,
        }

        let resp = await this.$http.post(apiRouter.CLASS_RATE_DEL_IMG, sendData)

        if (resp.status === 200) {
          let respBody = resp.body
          if (respBody.code === 200) {
            imgItem.status = 'done'
            // let index = this.fileList.indexOf(imgItem);
            // this.fileList.splice(index , 1);
          } else {
            imgItem.status = 'failed'
          }
        } else {
          imgItem.status = 'failed'
        }
      } catch (e) {
        imgItem.status = 'failed'
      }
    },
  },
}
</script>
<style lang="less">
.inline-uploader {
  .van-uploader__upload {
    width: 12vw;
    height: 12vw;
    border: 1px solid #ccc;
  }
}
.inline-stepper {
  vertical-align: middle;
  display: inline-flex;
  border: 1px solid #979797;
  border-radius: 4px;
  height: 22px;

  button {
    width: 20px;
    height: 20px;
  }

  input {
    margin: 0;
    border: solid #979797;
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
  
  .van-tag{
    font-size: 10px;
    margin-right:0.5em;
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
      border: 1px solid #979797;
      width: 26.7vw;
      height: 22.4vw;
      vertical-align: top;
      resize: none;
      box-shadow: none;
    }
  }
}
</style>
