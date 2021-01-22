<template>
  <div class="container">
    <div style="margin-top: 1em">
      <divider style="color: #1aad19">订正要求</divider>
    </div>
    <!--      <img class="teacher-img" src="@/assets/work/zero-emission.png">-->
    <!--      <div style="width:60%;margin-top: 1rem;color: #414141;display: inline-block;font-size: 1.4em">-->
    <!--        你的作业有一点小问题，-->
    <!--        需要认真订正哟！-->
    <!--      </div>-->
    <div class="comment-back" style="">
      <span v-html="hkMap.BACK_COMMENT"></span>
    </div>

    <x-button @click.native="goDetail" plain type="primary" class="rev-btn">立马去订正</x-button>

  </div>
</template>

<script type="es6">
  import {
    XButton,
    Divider,
    TransferDomDirective as TransferDom
  } from 'vux';
  import apiRouter from "../../config/api.js";
  import FirstHeader from './FirstHeader.vue';


  export default {
    directives: {
      TransferDom
    },
    components: {
      XButton,
      Divider
    },
    created() {

    },
    mounted() {

    },
    computed: {},
    watch: {
      "$route": function (e) {
        // if (e.path == '/schedule-detail') {
        //   this.loadData();
        // }

      }
    },
    activated() {
      this.currentWork = 0;
      this.loadData();
    },
    updated() {

    },
    data() {
      return {
        locationLine: '',
        descLine: '',
        wwwUrl: roterPath,
        rootDomain: window.location.protocol + "//" + window.location.host,
        id: '',
        typeId: '',
        typeCode: '',
        hkMap: {},

        //
        workObj: {},
        detail: {},
        imgObj: {
          content: "",
          serverid: [],
          imgs: []
        },

        trueList: [],
        currentWork: 0,
        workId: '',
        quesList: [],
        checkList: [],
        showRecording: false,
        progress: 20,
        voiceSecond: 60,
        voiceTimer: {},
        showSubmit: false,
        showDelVoice: false,
        showDelImg: false,
        timeOutEvent: 0,
        delList: [],
        delIndex: 0
      }
    },

    methods: {
      getUrlConfigTrue() {
        let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
        this.$http.get(wiexin).then(response => {
          let data = response.body
          wx.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
              "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
              'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function (res) {
            //   alert(res)
          });

        }, response => {
          // console.log("请求失败了!!!!")
        });
      },
      getUrlConfig() {
        let wiexin = apiRouter.GET_CONFIG + encodeURIComponent(this.urlPath)
        this.$http.get('/ua-service/wx/token?url=' + "http://web.pxy.com/#/work-detail")
          .then(response => {
            let info = response.body.data;
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: info.appId, // 必填，公众号的唯一标识
              timestamp: info.timestamp, // 必填，生成签名的时间戳
              nonceStr: info.nonceStr,
              signature: info.signature,// 必填，签名
              jsApiList: [
                "chooseImage", "uploadImage", "downloadImage", "getLocalImgData", "previewImage", "chooseWXPay",
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'downloadVoice', 'playVoice', 'stopVoice', 'translateVoice',
              ] // 必填，需要使用的JS接口列表
            });

          }, response => {
            alert("请求失败了!!!!")
          });
      },

      loadData() {
        let workId = this.$route.query.workId;
        let anId = this.$route.query.anId;
        let _this = this;
        this.$http.get(apiRouter.GET_HOMEWORK_BACK_COMMENT + '?workId=' + workId).then(response => {
          if (response.status === 200) {
            _this.hkMap = response.body.data.hkMap;

          }
        }, response => {
          this.$vux.toast.show({
            text: '"请求失败了!!!!"',
          })
        });

      },
      goDetail() {
        let workId = this.$route.query.workId;
        let anId = this.$route.query.anId;
        this.$router.push({path: 'work-detail', query: {workId: workId, anId: anId}})

      }
    }
  }
</script>


<style lang="less" scoped>
  @import '../../style/minxin.less';

  .container {
    text-align: center;
  }

  .teacher-img {
    margin-top: 2rem;
    width: 50%;
  }

  .comment-back {
    width: 92%;
    margin-top: 1.5rem;
    color: #414141;
    display: inline-block;
    margin-bottom: 2.5rem;
  }

  .comment-back /deep/ img {
    max-width: 100%;
  }

  .rev-btn {
    background-color: white;
    border-radius: 99px;
    width: 70%;
    position: fixed;
    bottom: 10px;
    left: 15%
  }
</style>
