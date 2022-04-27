<template>
  <div class="box">
<!--    <div class="back-div" ref="heightBackPub">-->
<!--      <p @click="goBack()" class="up-back">返回</p>-->
<!--    </div>-->
    <x-header class="title-header" :left-options="{preventGoBack: true}"  @on-click-back="goBack" :title="`作业列表`">
        <template  slot="right">
            <van-icon name="setting-o" color="#FF8F03" size="16" @click="showConfigure" style="margin-right: 10px;" />
        </template>
    </x-header>

    <!--<back ref="heightBackPub" style="display: none"></back>-->
    <ul class="message"  ref="onScoll">
      <li class="clearfix" v-for="(news,index) in messageData" :key="index">
        <!-- <div class="message-icon"></div> -->
        <div class="message-icon-2" :style="'background-color:' + news.COLOR">{{news.COURSE_NAME}}</div>
        <a href="javascript:void(0);"  @click="goCheck(news)" class="message-info">
          <h3>{{news.TITLE}}</h3>
          <p>发布对象：{{news.NAMES}}</p>
        </a>
        <div class="message-handle">
          <a class="publishBtn inform pubisnBtn">已发布</a>
          <a class="delete" @click="deleteBtn(news.ID)"><em></em>删除</a>
        </div>
        <!-- <div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index)">
          <a class="revamp" @click="revampBtn(news.id)"><em></em>修改</a>
          <a class="delete" @click="deleteBtn(news.id)"><em></em>删除</a>
        </div> -->
      </li>
    </ul>
    <p class="moreData" v-show="needShow"><span>加载中...</span></p>
    <p class="lastShow" v-show="lastShow"><span>已经全部加载</span></p>
    <div v-transfer-dom>
      <confirm
        v-model="popup"
        :close-on-confirm="false"
        :title="('确定删除作业？删除后无法恢复数据？')"
        @on-confirm="onConfirm()"
        confirmText="是，我要删除"
      >
      </confirm>
    </div>

    <van-popup position='bottom' style="height: 50vh;" v-model="isShowConfigure" class="evaPicker">
      <div class="evaPickerToolbar">批改设置</div> 
      <div class="evaRecord">
        <div class="evaRecordRow">
          <span>批改后跳转到下一个学生</span>
          <van-switch v-model="checkedJump"  active-color="#48b319" size="22px" />
        </div>
        <div class="evaRecordRow">
          <span>批改通过后提醒学生</span>
          <van-switch v-model="checkedWarn"  active-color="#48b319" size="22px" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader} from 'vux'
  import Back from "../../components/common/Back.vue"
  import apiRouter from "../../config/api.js"
  import {mapMutations} from 'vuex';
  import { Icon , Popup , Switch  } from 'vant';

  export default {
    directives: {
      TransferDom
    },

    components: {
      Back,
      Confirm,
      Group,
      XSwitch,
      XButton,
      XHeader,
      [Icon.name]: Icon,
      [Popup.name]: Popup,
      [Switch.name]: Switch ,
    },

    data(){
      return {
        id: '',
        page: 1,
        popup: false,
        isShow: false,
        isShowConfigure: false,

        checkedJump: true,
        checkedWarn: true,
        
        showItemNumber: -1,
        messageData: [],
        isEndReached: false,
        totalPage: 1,
        needShow: false,
        lastShow:false,
        wwwUrl:roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId='
      }
    },
    computed:{
      jumpConfig(){
        const {checkedJump , checkedWarn} = this;
        return {checkedJump , checkedWarn};
      }
    },
    watch:{
      jumpConfig(val){
        console.log(val);
        localStorage.setItem('lqt-homework-teacherCfg' , JSON.stringify(val));
      }
    },
    mounted(){
      let self = this;
      self.massageData();
      $(document).scrollTop(0)
      //let clientHeight = document.body.clientHeight - self.$refs['heightBackPub'].$el.clientHeight;

      // window.onscroll = function (event) {
      //   if (self.$router.currentRoute.name !== 'jobList')return;
      //   let innerHeight = self.$refs['onScoll'].clientHeight;
      //   var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //   if (((clientHeight + scrollTop) >= innerHeight - 20) && !self.isEndReached) {
      //     self.isEndReached = true;
      //     self.page++;
      //     self.massageData();
      //     if (self.totalPage < self.page){
      //       self.needShow = false;
      //     }else{
      //       self.needShow = true;
      //     }
      //
      //   }
      // }
    },
    activated() {
      this.loadConfig();
      $(document).scrollTop(0)

      this.oldPageTitle = document.title;
      document.title = '作业批改';
    },
    deactivated() {
      document.title = this.oldPageTitle;
    },
    methods: {
      loadConfig(){
        let cfgStr = localStorage.getItem('lqt-homework-teacherCfg');
        if(cfgStr){
          try{
            let cfg = JSON.parse(cfgStr);
            this.checkedJump = cfg.checkedJump;
            this.checkedWarn = cfg.checkedWarn;
          }
          catch(e){
            
          }
        }
      },
      showConfigure(){
        this.isShowConfigure = true;
      },
      goCheck(obj){
        window.localStorage.setItem('lqt-homework-title' , obj.TITLE);
        this.$router.push({path:'/check-work-list',query: {id: obj.ID }})
      },

      goBack(){
        this.$router.push({path:'/'})
      },

      edlitBtn(news, index){
        if (this.isShow && this.showItemNumber === index) {
          this.isShow = false;
          return;
        }
        this.isShow = true;
        this.showItemNumber = index;
      },

      deleteBtn(id){
        this.id = id;
        this.isShow = false;
        this.popup = true;

      },

      onConfirm () {
        this.$http.get( apiRouter.DEL_HOMEWORK +'?id=' + this.id).then(response => {
          if (response.body.status === 200) {
            window.location.reload();
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

      massageData(){
        let _this = this;
        if (_this.totalPage < _this.page) {
          _this.needShow = false;
          _this.lastShow = true;
          return;
        };
        this.$http.get(apiRouter.GET_HOMEWORKLIST+"?" + 'page=' + this.page).then(response => {
          _this.needShow = false;
          let list = [];
          if (_this.page === 1) {
            let totalPage = response.body.data.totalpage;
            console.log(totalPage)
            _this.totalPage = totalPage;
            list = response.body.data.list;
            console.log(response.body.data.list)
          } else {
            list = _this.messageData.concat(response.body.data.list);
          }
          _this.messageData = list;
          _this.$nextTick(() => {
            _this.isEndReached = false;
          });
        }, erro => {
          _this.needShow = false;
          //   alert("请求失败了!!!!")
        });
      },

      revampBtn(id){
        this.$http.get(apiRouter.EDLIT_INFO+'?id=' + id).then(response => {
          if (response.body.status === 200) {
            this.messageWay(response.body.data)
            console.log(response.body.data)
            let messageString = JSON.stringify(response.body.data)
            window.localStorage.setItem("MESSAGE",messageString)
            //    let userList = JSON.stringify(response.body.data.userList)
            this.$router.push({path: "posted",query: {path:"Message",itemId:id}})
            this.isShow = false;
          }
        }, erro => {
          alert("失败")
        });
      },

      ...mapMutations({
        messageWay:"SET_MESSAGE"
      })

    },
  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';



  .evaPicker {
    padding: 0 15px;
    height: 100%;
    display: flex;
    flex-direction: column;

    > .evaPickerToolbar {
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      text-align: center;
    }

    > .evaPickerRow {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      border-bottom: 1px dashed #c7c7c7;
    }

    > .evaRecord {
      margin: 0;
      flex: 1;
    }
  }

.evaRecord {
	margin: 15px 0;

	> .evaRecordRow {
		font-size: 14px;
		line-height: 24px;
		// padding: 15px 0;
		// border-bottom: 1px dashed #c7c7c7;
    display: flex;
    align-items: center;

		> span {
			display: block;
			margin: 0.5em 0;
      flex: 1;
		}

		> .evaRecordRemark {
			font-size: 12px;
			color: #666;
		}

	}
}

  .message {
    width: 100%;
    margin-top: 100/@baseSize;
  }

  .message li {
    .mixin-padding(30/@baseSize, 30/@baseSize);
    border-bottom: 1px solid @colorDD;
    height: 160/@baseSize;
    position: relative;
  }

  .message-icon {
    width: 100/@baseSize;
    height: 100/@baseSize;
    background: url("../../assets/homework.png") no-repeat left;
    background-size: 100% 100%;
    position: absolute;
    top: 30/@baseSize;
    left: 30/@baseSize;
    border-radius: 3px;
  }
  .message-icon-2 {
    width: 100/@baseSize;
    height: 100/@baseSize;
    background-size: 100% 100%;
    position: absolute;
    top: 30/@baseSize;
    left: 30/@baseSize;
    border-radius: 3px;
    font-size: 15px;
    color: #fff;
    font-weight: 400;
    text-align: center;
	  line-height: 1.78571429rem;
  }

  .message-info {
    margin-left: 125/@baseSize;
    margin-right: 100/@baseSize;
    padding-top: 40/@baseSize;
    display: block;
  }

  .message-info h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 40/@baseSize;
    font-size: @fontSize30;
    color: @color42;
  }

  .message-info p {
    font-size: @fontSize24;
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 10/@baseSize;;
  }

  .message-handle {
    position: absolute;
    top: 30/@baseSize;
    right: 30/@baseSize;
    text-align: right;
  }

  .message-handle a {
    padding-top: 8/@baseSize;
    padding-bottom: 8/@baseSize;
    display: block;
  }

  .edlit-molde {
    width: 172/@baseSize;
    height: 142/@baseSize;
    position: absolute;
    right: 130/@baseSize;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 60/@baseSize;
    z-index:9;
  }

  .edlit-molde a {
    padding-bottom: 16/@baseSize;
    padding-top: 20/@baseSize;
    display: block;
    font-size: @fontSize24;
  }

  .edlit-molde a.revamp {
    color: #2196F3;

  }

  .edlit-molde a.revamp em {
    width: 22/@baseSize;
    height: 23/@baseSize;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: -5/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 10/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a.delete em {
    width: 18/@baseSize;
    height: 22/@baseSize;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: -3/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 5/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #FF5E5E;
  }

  a.delete {
    color: #FF5E5E;
    display: flex;
    align-items: center;
  }

  .publis {
    color: #F09709;
  }

  .inform {
    color: #4CAF50;
  }

  .lose {
    color: #9B9B9B;
  }

  .weui-dialog__title {
    font-size: @fontSize34;
    color: #333333;
  }

  .moreData,.lastShow {
    height: 80/@baseSize;
    line-height: 80/@baseSize;
    text-align: center;

  }

  .moreData span {
    height: 50/@baseSize;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 45/@baseSize;
  }




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


  .pubisnBtn{
    color: #F09709
  }

  .title-header{
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    z-index: 1;
    border-bottom: solid 1px #dedede;
  }

  .title-header /deep/ .vux-header-title{
    color: #333;
    line-height: 46px;

  }

  .title-header /deep/ .vux-header-back{
    color: #38f;
  }

  .title-header /deep/ .left-arrow:before{
    border-color: #38f !important;
  }

</style>
