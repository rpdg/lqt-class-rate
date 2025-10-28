<template>
  <div class="box">
    <back-title-bar :title="this.republishTitle||'发通知'" />
    <div class="wapper">
      <div class="form-info clearfix" style="padding-top:20px;">
        <!-- <p class="cancel-btn" @click="cancel()">取消发布</p> -->

        <!--<form action="/" method="post">-->
        <div class="scope clearfix">
          <div @click="goBack()">
            <cell class="scope-box" title="通知类型与发送范围" :value="this.objType.objectName" is-link></cell>
          </div>
          <!--<input type="hidden" name="type" v-model="type">-->
          <input type="hidden" name="objectId" v-model="objectId" />
          <div class="span-cell clearfix">
            <span v-for="(item, index) in scope" :key="index">{{ item }}</span>
          </div>
          <!-- <input type="hidden" name="userList" v-model="userList">-->
        </div>
        <div class="scope-title-box">
          <p class="scope-title" style="padding:0 15px; display:flex; align-items: center;">
            <span style="flex:1;">通知标题</span>
            <popup-picker v-if='objType.type === "DEPT"' :data='labelOptions' v-model='selectedLabelCode'
              :display-format="formatV1" class='v1' :disabled="republishTitle==='只改内容不重发'"></popup-picker>
          </p>
          <x-textarea :max="50" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" class="x-textarea"
            placeholder="请输入通知标题" :rows="2" v-model="titleValue" :readonly="republishTitle==='只改内容不重发'"></x-textarea>
          <!--<input type="hidden" name="title" v-model="titleValue">-->
        </div>

        <div class="write-back">
          <label class="write-back-left">通知是否允许回复</label>
          <div class="write-back-right">
            <checker v-model="allow" type="radio" default-item-class="write-back-item"
              selected-item-class="write-back-selected" :radio-required="false">
              <checker-item v-for="(item, i) in isBack" :key="i" :value="i" :disabled="republishTitle==='只改内容不重发' && i!=allow">{{ item }}</checker-item>
            </checker>
          </div>
        </div>

        <div class="scope-data-box">
          <x-address :title="title2" v-model="timeData" raw-value :list="addressData" hide-district
            value-text-align="right" class="x-address" :disabled="republishTitle==='只改内容不重发'"></x-address>
        </div>

        <div class="scope-title-box">
          <p class="scope-title">通知内容</p>
          <x-textarea :max="1000" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" class="x-textarea"
            placeholder="请输入通知内容" :rows="7" v-model="contentValue"></x-textarea>
        </div>
        <div class="accessory-box">
          <p class="accessory-title" style="margin-bottom: 20px;">通知附件</p>

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
        </div>

        <!--<button-->
        <!--@click="goUploder()"-->
        <!--class="btn-uploder right"-->
        <!--type="submit"-->
        <!--&gt;发布通知-->
        <!--</button>-->
        <!-- <x-button
					v-on:click.native="goUploder"
					:show-loading="showLoading"
					:disabled="showLoading"
					class="btn-uploder right"
					type="submit"
				>发布通知</x-button> -->

        <div style="padding: 20px 15px;">
          <van-button block color="#54B331" @click="goUploder" :loading="showLoading" :disabled="showLoading">
            提交
          </van-button>
        </div>
        <!-- <toast
					v-model="showPositionValue"
					type="text"
					:time="800"
					is-show-mask
					:position="position"
				>{{toastMessage}}</toast> -->

        <!-- </form>-->
      </div>
    </div>
  </div>
</template>

<script>
import BackTitleBar from '../../components/common/BackTitleBar.vue';
import { mapGetters } from "vuex";
import {
  // Toast,
  Checker,
  CheckerItem,
  Group,
  XAddress,
  XTextarea,
  XButton,
  Cell,
  Radio,
  PopupPicker
} from "vux";
import { Button, Uploader, Dialog, Toast, Icon, DropdownMenu, DropdownItem } from 'vant';
import { getSelectDates } from "../../utils/DateUtils";
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
  created: function () {
    //getSelectDates();
    //timeData()
    this.showTop();
    this.localIdImgs = [];
  },
  components: {
    BackTitleBar,
    // Toast,
    Group,
    XAddress,
    Cell,
    XButton,
    XTextarea,
    Checker,
    CheckerItem,
    Radio,
    PopupPicker,
    [ DropdownMenu.name ]: DropdownMenu,
    [ DropdownItem.name ]: DropdownItem,
    [ Icon.name ]: Icon,
    [ Button.name ]: Button,
    [ Uploader.name ]: Uploader
  },
  data() {
    return {
      THEME_COLOR_MAP: THEME_COLOR_MAP,
      ossPath: roterOssPath,
      fileAccepts: getMobileOS() === 'iOS' ? '.png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.rar,.zip,.7z,.tar,.mp4' : '*/*',
      //提交按钮状态
      showLoading: false,
      //
      imgLenght: true,
      imgaesMaxLenght: 9,
      images: {
        localId: [],
        serverId: []
      },

      radio: [ "允许", "不允许" ],
      radioValue: "允许",

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
      allow: localStorage.getItem('notice_can_reply') == '1' ? 0 : 1,
      scope: [],
      titleValue: "",
      contentValue: "",
      showPositionValue: false,
      showToast: true,
      position: "default",
      toastMessage: "",
      title: "时间选择",
      title2: "通知发送时间",
      timeData: [ "今天", "立刻发送" ],
      isBack: [ "允许", "不允许" ],
      addressData: getSelectDates(),
      showAddress: false,

      willRemove: false,
      imgTempList: [],
      fileTempList: [],
      imgDelList: [],
      fileDelList: [],
      grade_choosed_classes: [],

      noticeData: null,
      labelOptions: [ [ { name: '选择标签', value: '', parent: 0 } ] ],
      selectedLabelCode: [ '' ],
      pickerData: [ [ { name: '选择标签', value: '' } ] ],
      pickerVisible: false,
      selectedValue: null,
      republish: false,
      republishTitle :  '',
      formatV1: function (value, name) {
        return `${name}`;
      }
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
    this.showLoading = false;
    this.showTop();
    this.localIdImgs = [];
    this.titleValue = "";
    this.contentValue = "";
    let path = this.$route.query.path;
    if (path === "Space") {
      let stringStore = JSON.stringify(this.spaceStore);
      let stringArray = this.spaceStore;
      if (stringStore === "[]" && stringStore.length === 2) {
        this.userList = JSON.parse(window.localStorage.SPACE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        this.userList = JSON.parse(window.localStorage.SPACE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.scope = [];
        stringArray.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      }
    } else if (path === "Optional") {
      let stringStore = JSON.stringify(this.optionalStore);
      let stringArray = this.optionalStore;
      if (stringStore === "[]" && stringStore.length === 2) {
        this.userList = JSON.parse(window.localStorage.OPTIONAL);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        this.userList = JSON.parse(window.localStorage.OPTIONAL);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.scope = [];
        stringArray.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      }
    } else if (path === "curriculum") {
      let stringStore = JSON.stringify(this.curriculumStore);
      let stringArray = this.curriculumStore;
      if (stringStore === "[]" && stringStore.length === 2) {
        this.userList = JSON.parse(window.localStorage.CURRICULUM);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        this.userList = JSON.parse(window.localStorage.CURRICULUM);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.scope = [];
        stringArray.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      }
    } else if (path === "Grade") {
      // debugger;
      try {
        let grade_choosed_classes_dic = JSON.parse(window.localStorage.CLASSES_CHOOSED);
        this.grade_choosed_classes = Object.values(grade_choosed_classes_dic);
      } catch (e) {
      }
      let stringStore = JSON.stringify(this.gradeStore);
      let stringArray = this.gradeStore;
      if (stringStore === "[]" && stringStore.length === 2) {
        this.userList = JSON.parse(window.localStorage.GRADE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        this.userList = JSON.parse(window.localStorage.GRADE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.scope = [];
        stringArray.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      }
    } else if (path === "Notice") {
      this.noticeData = JSON.parse(window.localStorage.NOTICE_DATA || '{}');
      if (this.noticeData.labelList) {
        this.labelOptions[ 0 ].push(...this.noticeData.labelList.map(item => {
          return { name: item.NAME, value: item.CODE, parent: 0 };
        }));
      }
      let stringStore = JSON.stringify(this.schoolStore);
      let stringArray = this.schoolStore;
      if (stringStore === "[]" && stringStore.length === 2) {
        this.userList = JSON.parse(window.localStorage.NOTICE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        this.userList = JSON.parse(window.localStorage.NOTICE);
        this.objType = JSON.parse(window.localStorage.type);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.scope = [];
        stringArray.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      }
    } else if (path === "Message") {
      debugger;
      let msgObject = JSON.parse(window.localStorage.MESSAGE || '{}');
      this.noticeData = JSON.parse(window.localStorage.NOTICE_DATA || '{}');
      if (this.noticeData.labelList) {
        this.labelOptions[ 0 ].push(...this.noticeData.labelList.map(item => {
          return { name: item.NAME, value: item.CODE, parent: 0 };
        }));

        if(msgObject.label) {
          let ll = this.noticeData.labelList.find(item => item.NAME === msgObject.label)
          let labelCode = ll ? ll.CODE : '';
          this.selectedLabelCode[0] = labelCode;
        }
      }
      let stringStore = JSON.stringify(this.messageStore);
      this.itemId = this.$route.query.itemId;
      let stringArray = this.messageStore;
      if (stringArray && stringStore === "[]" && stringStore.length === 2) {
        this.userList = msgObject.userList;
        this.titleValue = msgObject.title;
        let cheoonOn = msgObject.commentFlag;
        let imgs = msgObject.imgList || [];
        this.serverId = imgs;
        imgs.forEach((item, index) => {
          this.localIdImgs.push(roterPath + item.url);
        });
        let files = msgObject.fileList || [];
        files.forEach(file => {
          file = Object.assign({
            viewPath: this.ossPath + '/upload' + file.URL,
            newfileName: 'xxx-' + file.ID,
            originalName: file.FILENAME
          }, file);
          this.fileTempList.push({
            viewPath: this.ossPath + '/upload' + file.URL,
            newfileName: 'xxx-' + file.ID,
            originalName: file.FILENAME
          });
        });

        if (cheoonOn === true) {
          this.allow = 0;
        } else {
          this.allow = 1;
        }
        this.contentValue = JSON.parse(window.localStorage.MESSAGE || '{}').content;
        this.objType = JSON.parse(window.localStorage.MESSAGE || '{}');
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.republish = this.objType.republish;
        this.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
      } else {
        let cheoonOn = stringArray.commentFlag;
        if (cheoonOn === true) {
          this.allow = 0;
        } else {
          this.allow = 1;
        }
        this.titleValue = stringArray.title;
        this.contentValue = stringArray.content;

        this.objType = JSON.parse(window.localStorage.MESSAGE);
        this.objType.objectId = this.objType.objectId;
        this.objType.type = this.objType.type;
        this.objType.objectName = this.objType.objectName;
        this.republish = this.objType.republish;

        let imgs = stringArray.imgList;
        this.serverId = imgs;
        this.localIdImgs = [];
        imgs.forEach((item, index) => {
          this.localIdImgs.push(roterPath + item.url);
          let picObj = {
            viewPath: this.ossPath + '/upload' + item.url,
            newfileName: 'xxx-' + item.id
          };
          this.imgTempList.push(picObj);
        });

        let files = stringArray.fileList;
        files.forEach(file => {
          file = Object.assign({
            viewPath: this.ossPath + '/upload' + file.URL,
            newfileName: 'xxx-' + file.ID,
            originalName: file.FILENAME
          }, file);
          this.fileTempList.push({
            viewPath: this.ossPath + '/upload' + file.URL,
            newfileName: 'xxx-' + file.ID,
            originalName: file.FILENAME
          });
        });

        this.scope = [];
        stringArray.userList.forEach((item, index) => {
          this.scope.push(item.toName);
        });
        this.userList = stringArray.userList;
      }

      this.republishTitle = this.republish ? '修改并重发' : '只改内容不重发';
    }

    if (this.localIdImgs.length >= this.imgaesMaxLenght) {
      this.imgLenght = false;
    } else {
      this.imgLenght = true;
    }
  },

  mounted() {
    // console.log(apiRouter.POST_SEND)
    this.showLoading = false;
    this.localIdImgs = [];
    this.urlPath = window.location.href.split("#")[ 0 ];
    // this.getUrlConfig();
  },
  methods: {
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

    goBack() {
      if (this.$route.query.path === "Message") {
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
    goUploder() {
      this.showLoading = true;
      if (this.allow === 0) {
        this.commentFlag = true;
      } else {
        this.commentFlag = false;
      }

      let data = this.format(this.timeData[ 0 ]);
      let time = this.timeData[ 1 ];
      let dataDatime = data + " " + time;

      if (this.titleValue === "") {
        Toast('请填写标题');
        // this.position = position;
        // this.toastMessage = "请填写标题";
        // this.showPositionValue = true;
        this.showLoading = false;
      } else if (this.contentValue === "") {
        Toast('请填写内容');
        // this.position = position;
        // this.toastMessage = "请填写内容";
        // this.showPositionValue = true;
        this.showLoading = false;
      } else {
        //    console.log(this.userList);return
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
          id: this.itemId,
          type: this.objType.type,
          objectId: this.objType.objectId,
          title: this.titleValue,
          content: this.contentValue,
          commentFlag: this.commentFlag,
          noticeTime: dataDatime,
          userList: JSON.stringify(this.userList),
          img_add: JSON.stringify(imgTempList),
          img_del: JSON.stringify(this.imgDelList),
          file_add: JSON.stringify(fileTempList),
          file_del: JSON.stringify(this.fileDelList),
          imgList: JSON.stringify(this.serverId),
          label: this.selectedLabelCode[ 0 ],
          is_notify: this.republish ? 1 : 0,
        };
        debugger;

        if (this.$route.query.path === 'Grade') {
          sendObj.cls_mbrs = JSON.stringify(this.grade_choosed_classes);
        } else if (this.objType.type ==='CLASS') {
          sendObj.cls_mbrs = JSON.stringify(this.userList);
        }

        //  console.log(JSON.stringify(sendObj))
        let _this = this;
        _this.$http.post(apiRouter.POST_SEND, sendObj).then(
          response => {
            Toast(response.body.message);
            _this.showLoading = false;
            if (response.body.status === 200) {
              setTimeout(_this.backHome, 600);
            }
            // if (response.body.status === 200) {
            //   // _this.position = position;
            //   // _this.toastMessage = response.body.message;
            //   // _this.showPositionValue = true;
            //   // setTimeout(_this.backHome, 1200);
            // } else {
            //   // _this.position = position;
            //   // _this.toastMessage = response.body.message;
            //   // _this.showPositionValue = true;
            //   // _this.showLoading = false;
            // }
          },
          error => {
            Toast(error);
            _this.showLoading = false;
            // _this.position = position;
            // _this.toastMessage = response.body.message;
            // _this.showPositionValue = true;
            // _this.showLoading = false;
          }
        );
      }
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

.imgContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  // padding-top: 20px;

  img.deletable {
    width: 100%;
    pointer-events: none;
    -webkit-touch-callout: none;
  }

  .spRow {
    display: inline-flex;
  }

  a {
    font-size: 14px;
    color: @darkBlue;
    text-decoration: none;
    margin-right: 1em;
  }
}

.wapper {
  position: absolute;
  top: 47px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
}

.form-info {
  padding-bottom: 50px;
  padding-top: 50px;
  background: #ffffff !important;
}

.img-t {
  width: 40px;
  height: 40px;
  display: block;
}

.btn-uploder {
  line-height: 40px;
  text-align: center;
  font-size: @fontSize30;
  color: @white;
  width: 150px;
  background: @green;
  margin-right: 20px;
  margin-top: 40px;
}

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

.posted-title {
  display: block;
  font-size: @fontSize30;
  color: @color42;
  line-height: 1.5rem;
  .mixin-padding(25px, 25px);
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
  .mixin-padding(15px, 15px);
  margin-top: 10px;
  margin-bottom: 10px;
}

.span-cell span {
  border: 1px solid @green;
  border-radius: 4px;
  .mixin-padding(10px, 10px);
  font-size: @fontSize24;
  color: @color42;
  height: 25px;
  line-height: 26px;
  display: inline-block;
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
}

.scope,
.scope-data-box {
  border-bottom: 1px solid @colorDD;
}

.scope-title {
  padding-left: 15px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: @fontSize30;
  color: @color42;
  margin-top: 8px;

  >.vux-cell-box {
    &:before {
      border-top: none !important;
    }


  }

}



.scope-title-box {
  border-bottom: 1px solid @colorDD;
}

.form-info .weui-cell:before {
  border-top: none;
}

.write-back {
  line-height: 45px;
  height: 45px;
  .mixin-padding(15px, 15px);
  position: relative;
}

.write-back-left {
  display: inline-block;
  position: absolute;
  line-height: 45px;
  height: 45px;
  left: 15px;
  font-size: @fontSize30;
}

.write-back-right {
  margin-left: 140px;
}

.write-back-item {
  border: 1px solid @color97;
  margin-left: 8px;
  height: 25px;
  display: inline-block;
  line-height: 26px;
  font-size: @fontSize24;
  .mixin-padding(15px, 15px);
  color: @color97;
  border-radius: 4px;
}

.write-back-selected,
.write-back-selected {
  background: url("../../assets/combined.png") no-repeat right bottom;
  background-size: 13px 12px;
  border-color: @green;
  color: @color42;
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

.accessory-img {
  margin-top: 25px;
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
  margin-bottom: 10px;
}

.up-photo {
  margin-left: 10px;
}

.photo-img li {
  margin-right: 11px;
  position: relative;
}

.photo-img li:last-child {
  margin-right: 0;
}

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
</style>
<style>
.x-address .vux-cell-value,
.v1>div {
  padding-right: 0 !important;
  color: #999 !important;
}
</style>