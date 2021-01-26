<template>
    <div class="panel">
      <table> 
        <tr>
          <td>班级：{{task.CLASS_NAME}}</td>
          <td>评分项：{{task.NAME}}</td>
        </tr>
        <tr>
          <td>日期：{{task.ID}}</td>
          <td>评分范围：{{task.ID}}</td>
        </tr>
        <tr>
          <td>评分：
            <van-stepper class="inline-stepper" v-model="task.SCORE" />
          </td>
          <td rowspan="2">
            添加图片：<br>
            <van-uploader class="inline-uploader" v-model="task.IMG_LIST" multiple max-count="4" preview-size="12vw" />
          </td>
        </tr>
        <tr>
          <td valign="top">
            备注：  
            <textarea maxlength="50" v-model="task.COMMENT"> </textarea>
          </td>
        </tr>
      </table>
    </div>
</template>
<script>
import { Stepper, Uploader, Toast, Dialog } from "vant";

function Task() {
  this.ID = "";
  this.NAME = "";
  this.SCORE = "";
  this.CLASS_NAME = "";
}

export default {
  props: {
    task: {
      type: Task,
      required: true,
      default: 0
    }
  },
  components: {
    [Stepper.name]: Stepper,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast
  },
  computed:{
    // fileList(){

    // }
  },
  data() {
    return {
      value: 1,
      fileList: []
    };
  },
  methods: {}
};
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
  // height: 53vw;
  margin: 10px auto 20px auto;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  padding: 5vw 7vw;

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
