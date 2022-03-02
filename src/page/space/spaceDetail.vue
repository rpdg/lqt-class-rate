<template>
   <div class="box">
    <back-title-bar :title="`返回`" />

    <div class="spacedetail">
      <x-textarea
        :max="1000"
        @on-focus="onEvent('focus')"
        @on-blur="onEvent('blur')"
        class="x-textarea"
        placeholder="说点什么…"
        :rows="7"
        v-model="contentValue"
      >
      </x-textarea>
    </div>



    <div class="send-type">
         <div class="type-photo" v-if="this.type === 'photo'">
            <div class="accessory-box clearfix">
              <div class="accessory-img clearfix">
                <ul class="photo-img">
                  <li  v-for="(item,index) in imgfileData" :key="index">
                    <img :src="getimgUrl(item.url)" alt="" class="imgud">
                    <img src="../../assets/cancel.png" alt="" class="cancel" @click="clodesd(item.url,item.mediaId)">
                  </li>
                  <li data-id="imgfileData.length" v-show="imgfileData.length < 9 ? true : false">
                    <a class="up-photo" href="javascript:;">
                      <img src="../../assets/addup.jpg" alt="">
                      <div id='image-list' class="mui_uploader">
                        <input id="uploaderInput" class="mui_uploader_input" value="" type="file" multiple  accept="image/*" >
                      </div>
                    </a>
                  </li>
                </ul>

                  <!-- <div id="all_pic">
                      <img v-for="(item,index) in imgfileData" :key="index" style='width:50px;height:50px' :src="getimgUrl(item.url)" />
                  </div>
                  <div><span id="uploaderInput_mess"></span></div> -->
              </div>
            </div>

            <div class="ps-info">
                <!-- <p>注：小视频的长度不能超过10秒,超过的视频服务器会自动截取前10秒内容。</p> -->
                <div style="text-align: right;">
                  <button
                        @click="delSubmit()"
                        class="btn-calie"
                        type="submit"
                        v-if="this.isDle === true"
                        >删除本条
                    </button>
                    <button
                        @click="submit()"
                        class="btn-uploder"
                        type="submit"
                        >发布
                    </button>
                </div>
            </div>
         </div>

        <div class="type-video" v-if="this.type === 'video'">
            <div class="accessory-box">
              <div class="accessory-img clearfix">
                <!-- <ul class="photo-img">
                  <li  v-for="(item,index) in videoFilesData" :key="index">
                    <img :src="getimgUrl(item.imgUrl)" alt="" class="imgud">
                    <img src="../../assets/cancel.png" alt="" class="cancel" @click="clodesd(getimgUrl(item.url))">
                  </li>
                </ul> -->

                  <a class="up-photo" href="javascript:;" v-if="imgLenght" @click="uploaderInputVideo()">
                    <img src="../../assets/addup.jpg" alt="">
                    <div id='image-list' class="mui_uploader">
                      <input id="uploaderInputVideo" class="mui_uploader_input" type="file" accept="video/*" capture="camcorder" >
                      <input id="uploaderInputVideo" class="mui_uploader_input" type="file" accept="audio/*" capture="microphone">
                    </div>
                  </a>
              </div>
              <div class="video-tnl" v-if="this.videoImg === true">
                  <img style="" width="120" height="120" src="http://gz.lqtedu.com/weixin/wechat/public/images/icon/videopng.png" alt="">
                  <!-- <video :src="getimgUrl(videoFiles.videoUrl)" width="200" height="264" controls autobuffer v-if="videoFiles.videoUrl"></video> -->
                  <img src="../../assets/cancel.png" alt="" class="cancel" @click="clodesVideo(videoFiles)">
              </div>
            </div>

            <div class="ps-info">
                <p>
                  注：小视频长度不能超过10秒，超过的视频服务器会自动截取前10秒。因视频需经服务器处理才能查看，
                  新发布的小视频将在一分钟之后更新。
                </p>
                <div style="text-align: right;">
                    <button
                        @click="delSubmit()"
                        class="btn-calie"
                        type="submit"
                        v-if="this.isDle === true"
                        >删除本条
                    </button>
                    <button
                        @click="submitVideo()"
                        class="btn-uploder right"
                        type="submit"
                        >发布
                    </button>
                </div>
            </div>
        </div>



    </div>

    <toast
      v-model="showPositionValue"
      type="text"
      :time="800"
      is-show-mask
      :position="position"
    >
      {{toastMessage}}
    </toast>

    <div v-transfer-dom>
      <confirm
        v-model="popup"
        :close-on-confirm="false"
        :title="('是否确认删除？')"
        @on-confirm="onConfirm()"
        confirmText="是，我要删除"
      >
      </confirm>
    </div>



   </div>
</template>

<script>
  import {Confirm,XTextarea, Group, XSwitch, XButton,Toast,TransferDomDirective as TransferDom} from 'vux'
  import BackTitleBar from "../../components/common/BackTitleBar.vue";
  //import Photo from "./photo.vue"
  import apiRouter from "../../config/api.js"
    import wx from "weixin-js-sdk";
  import {mapMutations} from 'vuex'
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'
  export default {
    directives: {
      TransferDom
    },
    components: {
      BackTitleBar,
      Confirm,
      Group,
      XSwitch,
      XButton,
      Toast,
      XTextarea,
      videoPlayer
    },
    created: function() {
    //getSelectDates();
    //timeData()
    this.type = this.$route.query.path;
    console.log(this.type);
    this.SPACE_ID = this.$route.query.SPACE_ID;
    this.TOPIC_ID = this.$route.query.TOPIC_ID;
    this.TOPIC_ID = this.$route.query.TOPIC_ID

  },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    mounted(){
      console.log("videoFiles",this.videoFiles);
      let _this = this
      _this.type = this.$route.query.path;
      if( _this.type === 'photo' ){
        _this.onClickUp()
      }
      // if( _this.type === 'video' ){
      //   _this.uploaderInputVideo()
      // }
      _this.TOPIC_ID = this.$route.query.TOPIC_ID
      if( _this.TOPIC_ID ){
         _this.getDetailData();
         _this.isDle = true;
         _this.imgLenght = false;
         _this.videoImg = true;
      }else{
        _this.videoImg = false;
      }
    },

    updated() {

    },

    data(){
      return {
          addFalse:false,
          videoImg:false,
          text1: 'Processing',
          loadShow:false,
          isDle:false,
          videoImg:false,
          codeArr:[],
          type:'',
          contentValue: "",
          uploadImg:[],
          imgLenght: true,
          showPositionValue: false,
          showToast: true,
          position: "default",
          toastMessage: "",
          imgfileData:[],
          pathImgs:[],
          videoFilesData:[],
          videoFiles:[],
          SPACE_ID:'CLASS-A10480',
          CONTENT:'',
          IMG_LIST:'',
          TOPIC_ID:'',
          DEL_LIST:'',
          showPositionValue: false,
          showToast: true,
          position: "default",
          toastMessage: "",
          popup: false,
          key:1,
          videoUrl:'https://gz.lqtedu.com/weixin/VIDEO/5ae9fa28-6313-473b-9817-372680ec9562.mp4',


          playerOptions: {
          // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: 'https://gz.lqtedu.com/weixin/VIDEO/5ae9fa28-6313-473b-9817-372680ec9562.mp4'
          }],
        //  poster: "/static/images/author.jpg",
        }


      }
    },
    methods: {
      goBack(){
        window.location.replace(apiRouter.BACK_SPACE)
      },
      onEvent (event) {
        //   console.log('on', event)
      },

      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      },

      // 上传图片
      onClickUp(position,msg) {
        let _this = this;
        let formData = new FormData();
        var f2 = document.querySelector('#uploaderInput');
        f2.onchange = function (e) {
          console.log(e);
            var files = e.target.files;
            var len = files.length;
            var data = [];
            if (len > 9 || _this.imgfileData.length + len > 9 ){
              //  alert('图片最多只能上传9张', 'error');
                _this.position = position;
                _this.toastMessage = "图片最多只能上传9张";
                _this.showPositionValue = true;
                e.target.value = '';
                return false;
            }
            for(var i=0;i<len;i++){
                //$("#all_pic").append("<div style='float: left;width:100px;height:50px' name='all_pic_img'><img style='width:50px;height:50px' src='"+getFileURL(files[i])+"'/><a onclick=\"del('"+files[i].name+"',"+i+")\" id='all_pic_img_"+i+"'>删除</a></div>")
                var a={
                    'val':files[i]
                };
                data.push(a);
            }
            _this.goUploder(data,function(re_files){
                e.target.value = '';
                _this.imgfileData = _this.imgfileData.concat(re_files);
                console.log('_this.imgfileData::',_this.imgfileData);

            })
        }
      },
      clodesd(url,code){
          let _this = this;
          let arr = [];
          for(let i = 0; i < _this.imgfileData.length; i++) {
            arr.push(_this.imgfileData[i].url)
          }

          var index = arr.indexOf(url);
          console.log(index);
            let lincode = code;
          if (index > -1) {
              _this.imgfileData.splice(index, 1);
              console.log(_this.imgfileData);
              _this.codeArr.push(lincode);

          }
          // $("#all_pic_img_"+id).parent().remove();
        //  console.log(_this.codeArr)
      },

      // 删除本条记录
      delSubmit(){
        let _this = this;
        _this.popup = true;
      },
      onConfirm () {
        let _this = this;
        let url = apiRouter.SPACE_DEL + "?SPACE_ID=" + _this.SPACE_ID + "&TOPIC_ID=" + _this.TOPIC_ID
        _this.$http.post(url).then(response => {
          if (response.body.status === 200) {
            setTimeout(_this.backHome, 1200);
          } else {
            alert("删除失败");
          }
        }, erro => {
        });
        this.popup = false;
        return;
        this.$vux.loading.show({
          transition: '',
          text: 'processing'
        })
        setTimeout(() => {
          this.$vux.loading.hide()
          this.popup = false
        }, 1000)
      },


      goUploder(data,callback){
        let _this = this;
        let len = data.length;
        let formData = new FormData();
        if(len < 1){
          alert("请选择文件")
        }else {

          _this.$vux.loading.show({
            transition: '',
            text: '加载中...'
          })

          for(var i=0;i<len;i++){
            formData.append('file',data[i].val);
          }
          _this.$http.post(apiRouter.POST_IMG,formData)
          .then(
            (response) => {
              if( response.status === 200 ){
                _this.$vux.loading.hide()
                let _files = response.body.files;
                callback && callback(_files);
              }
            },
            (error) => {
              _this.$vux.loading.hide()
              alert("请求失败了!!!!")
            }
          );
        }
      },
      getimgUrl(uri){
        return roterPath + uri
      },
      submit(position, msg){
        let _this = this;
         var arrLen = [];
        for (let index = 0; index < _this.imgfileData.length; index++) {
          arrLen.push(_this.imgfileData[index].code);
        }
        let imgStr = arrLen.join(',');
      //  let url = "http://gz.lqtedu.com/app/space/publish" + "?SPACE_ID=" +  _this.SPACE_ID + '&CONTENT=' + _this.CONTENT + '&IMG_LIST=' + _this.IMG_LIST + '&TOPIC_ID=' + _this.TOPIC_ID + '&DEL_LIST=' + _this.DEL_LIST;
         let sendObj = {
            SPACE_ID: _this.SPACE_ID,
            CONTENT: _this.contentValue,
            IMG_LIST: imgStr,
            TOPIC_ID: _this.TOPIC_ID,
            DEL_LIST: _this.codeArr.join(',')
        }
        console.log(sendObj);

        if (this.contentValue === "") {
          this.position = position;
          this.toastMessage = "请填写标题";
          this.showPositionValue = true;
        }else{
          _this.$http.post(apiRouter.SPACE_PHOTO,sendObj)
          .then(
            (response) => {
              console.log(response);
              if( response.body.status === 200 ){
                _this.position = position;
                _this.toastMessage = "发布成功";
                _this.showPositionValue = true;
                setTimeout(_this.backHome, 1200);
              }
              if( response.body.status === 201 ){
                _this.position = position;
                _this.toastMessage = response.body.message;
                _this.showPositionValue = true;
              }
            },
            (error) => {
              alert("发布失败!!!!")
            }
          );
        }
      },


      // 图片帖子 编辑
        getDetailData(){
          let _this = this;
          this.$http.get(apiRouter.SPACE_DETAIL+"?" + 'SPACE_ID=' + _this.SPACE_ID + '&TOPIC_ID=' + _this.TOPIC_ID).then(response => {
           if( response.body.status === 200 ){
              _this.contentValue = response.body.data.CONTENT
              if( _this.type === 'photo' ){
                _this.imgfileData = response.body.data.IMG_LIST
              }
              if( _this.type === 'video' ){
                _this.videoFiles = response.body.data.IMG_LIST;
                console.log(_this.videoFiles)
                if(_this.videoFiles){
                  _this.imgLenght = false;
                  _this.videoImg = true;
                }
              }

           }
          }, erro => {

          });
        },



       backHome() {
        window.location.replace(apiRouter.BACK_SPACE + this.SPACE_ID);
      },


        // 上传视频
        uploaderInputVideo(){
          let _this = this;
          let formData = new FormData();
          var f2 = document.querySelector('#uploaderInputVideo');
          f2.onchange = function (e) {
            var files = f2.files;
            var len = files.length;
            var data = [];
          //  console.log('files::',files);
            if (len > 1 || _this.videoFilesData.length + len > 1 ){
                alert('图片最多只能上传1张', 'error');
                e.target.value = '';
                return false;
            } else {
              var a={
                'val':files[0]
              };
              data.push(a);
            }
            _this.goUploderVideo(data,function(re_file){
                e.target.value = '';
                _this.videoFiles = re_file;
                //_this.videoFilesData = _this.videoFilesData.concat(re_files);
                console.log('_this.videoFiles::',_this.videoFiles);
                if(_this.videoFiles.videoUrl){
                  _this.imgLenght = false;
                   _this.videoImg = true;
                }
            })
          }
        },

        goUploderVideo(data,callback){
        let _this = this;
        let len = data.length;
        let formData = new FormData();
        _this.$vux.loading.show({
          transition: '',
          text: '加载中...'
        })
        if(len < 1){
          alert("请选择文件")
        }else {
          for(var i=0;i<len;i++){
            formData.append('file',data[i].val);
          }
          _this.$http.post(apiRouter.GET_VIDEO,formData)
          .then(
            (response) => {
              if( response.status === 200 ){
                let _file = response.body.file;
                callback && callback(_file);
                _this.$vux.loading.hide()
              }
            },
            (error) => {
              alert("请求失败了!!!!")
            }
          );
        }
      },

      clodesVideo(obj){
        console.log('obj::', obj);
        let _this = this;
        if(_this.TOPIC_ID){
          console.log(obj[0].mediaId);
          console.log(obj[0].videoPath)
          console.log(_this.videoFiles[0].videoPath)
          if( obj[0].videoPath === this.videoFiles[0].videoPath){
            _this.videoImg = false;
            _this.imgLenght = true;
            _this.codeArr.push(obj[0].mediaId);
          }
        }else{
            _this.videoImg = false;
            _this.imgLenght = true;
        }
      },

      submitVideo(position,msg){
        let _this = this;
         var arrLen = [];
         let sendObj = {
            SPACE_ID: _this.SPACE_ID,
            CONTENT: _this.contentValue,
            IMG_LIST: _this.videoFiles.code,
            
            TOPIC_ID: _this.TOPIC_ID,
            DEL_LIST: _this.codeArr.join(',')
        }
        console.log(sendObj);

        if (this.contentValue === "") {
          this.position = position;
          this.toastMessage = "请填写标题";
          this.showPositionValue = true;
        }else{
          _this.$http.post(apiRouter.SPACE_PHOTO,sendObj)
          .then(
            (response) => {
              console.log(response);
              if( response.body.status === 200 ){
                _this.position = position;
                _this.toastMessage = "发布成功";
                _this.showPositionValue = true;
                setTimeout(_this.backHome, 1200);
              }
              if( response.body.status === 201 ){
                _this.position = position;
                _this.toastMessage = response.body.message;
                _this.showPositionValue = true;
              //  setTimeout(_this.backHome, 1200);
              }
            },
            (error) => {
              alert("请求失败了!!!!")
            }
          );
        }
      }


    },


  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';


.back-div{
    padding-bottom: 100/@baseSize;
  }
  .up-back{
    width: 100%;
    height: 100/@baseSize;
    font-size:@fontSize36;
    line-height: 100/@baseSize;
    color: @white;
    text-align: center;
    position: fixed;
    top:0;
    left:0;
    background:rgba(0, 0, 0, 0.6);
    z-index: 999;
  }

  .accessory-box {
    .mixin-padding(30/@baseSize, 30/@baseSize);
  }

  .accessory-title {
    font-size: @fontSize30;
    color: @color42;
    margin-top: 15/@baseSize;
  }

  .form-info .vux-label {
    font-size: @fontSize30;
  }

  .accessory-img {
    margin-top: 50/@baseSize;
  }

  .weui-cell__ft, .vux-cell-value {
    font-size: @fontSize28;
  }

  .photo-img, .up-photo, .photo-img li {
    float: left;
  }

  .photo-img li{
    margin-bottom: 20/@baseSize;
  }
  .up-photo{
    margin-left: 20/@baseSize;
    width: 150/@baseSize;
    height: 150/@baseSize;
    display: block;
    position: relative;
  }

  .photo-img li {
    margin-right: 22/@baseSize;
    position: relative;
  }
  // .photo-img li:last-child{
  //   margin-right: 0;
  // }

  .photo-img li, .photo-img li img.imgud, .up-photo img {
    width: 150/@baseSize;
    height: 150/@baseSize;
  }

  .photo-img li img.imgud, .up-photo img {
    display: block;
  }

  .cancel{
    width:50/@baseSize;
    height: 50/@baseSize;
    font-size: 50/@baseSize;
    position: absolute;
    top: -25/@baseSize;
    right:-25/@baseSize;
    display: block;
  }


.btn-uploder {
    line-height: 80/@baseSize;
    text-align: center;
    font-size: @fontSize30;
    color: @white;
    width: 200/@baseSize;
    background: @green;
    margin-right: 40/@baseSize;
    margin-top: 80/@baseSize;
  }

  .cancel-btn {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    color: @white;
    text-align: center;
    line-height: 100/@baseSize;
    position: fixed;
    top:0;
    left:0;
    background:rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .ps-info p{
      color: #4CAF50;
      font-size: @fontSize28;
      padding-left: 30/@baseSize;
      padding-right: 30/@baseSize;
      box-sizing: border-box;
      margin-top: 30/@baseSize;
  }



  .mui_uploader{
    width: 150/@baseSize;
    height: 150/@baseSize;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .mui_uploader .mui_uploader_input{
    width: 150/@baseSize;
    height: 150/@baseSize;
    display: block;
    opacity: 0;
  }


  .container {
    background-color: #efefef;
    min-height: 100%;
  }

  .btn-calie{
    line-height: 80/@baseSize;
    text-align: center;
    font-size: @fontSize30;
    color: @white;
    width: 200/@baseSize;
    background: #999999;
    margin-right: 40/@baseSize;
    margin-top: 80/@baseSize;
  }

  .video-tnl{
    width: 120px;
    height: 120px;
    position: relative;
    margin-top: 20px;
  }

</style>
