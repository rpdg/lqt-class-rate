<template>
  <div class="box">
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack" >选课列表</x-header>

    <van-tabs v-model="active" style="margin-top: 1.8rem" title-active-color="#48b319" swipeable>
      <van-tab v-if="allCategoryList.length>0" title="全部" >
        <ul class="message"  ref="onScoll" >
          <li class="clearfix" style="background-color: #f0f0f0" v-for="(news,index) in topListCategory" :key="news.courseId">
            <div class="message-icon"></div>
            <a href="javascript:void(0);"  @click="goDetail(news)" class="message-info">
              <h3>{{news.courseName}}</h3>
              <p style="color: #777777">{{news.typeCodeName}}</p>
            </a>
            <div class="message-handle" v-if="news.status == 100">
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{ renderTime(news) }}</a>
              <a class="delete">{{statusView[news.status].text}}</a>
            </div>
            <div class="message-handle" style="padding-top: 0.5rem;" v-else>
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{statusView[news.status].text}}</a>
            </div>
            <!-- <div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index)">
              <a class="revamp" @click="revampBtn(news.id)"><em></em>修改</a>
              <a class="delete" @click="deleteBtn(news.id)"><em></em>删除</a>
            </div> -->
          </li>
          <li class="clearfix" v-for="(news,index) in otherCategoryList" :key="news.courseId">
            <div class="message-icon"></div>
            <a href="javascript:void(0);"  @click="goDetail(news)" class="message-info">
              <h3>{{news.courseName}}</h3>
              <p style="color: #777777">{{news.typeCodeName}}</p>
            </a>
            <div class="message-handle" v-if="news.status == 100">
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{ renderTime(news) }}</a>
              <a class="delete">{{statusView[news.status].text}}</a>
            </div>
            <div class="message-handle" style="padding-top: 0.5rem;" v-else>
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{statusView[news.status].text}}</a>
            </div>
            <!-- <div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index)">
              <a class="revamp" @click="revampBtn(news.id)"><em></em>修改</a>
              <a class="delete" @click="deleteBtn(news.id)"><em></em>删除</a>
            </div> -->
          </li>
        </ul>
      </van-tab>
      <van-tab v-for="item in allCategoryList" :title="item.NAME">
        <ul class="message"  ref="onScoll">
          <li class="clearfix" v-for="(news,index) in item.COURSELIST" :key="news.courseId">
            <div class="message-icon"></div>
            <a href="javascript:void(0);"  @click="goDetail(news)" class="message-info">
              <h3>{{news.courseName}}</h3>
              <p style="color: #777777">{{news.typeCodeName}}</p>
            </a>
            <div class="message-handle" v-if="news.status == 100">
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{ renderTime(news) }}</a>
              <a class="delete">{{statusView[news.status].text}}</a>
            </div>
            <div class="message-handle" style="padding-top: 0.5rem;" v-else>
              <a class="publishBtn inform" :style="'color:' + statusView[news.status].color">{{statusView[news.status].text}}</a>
            </div>
            <!-- <div class="edlit-molde clearfix" v-if="(isShow && showItemNumber === index)">
              <a class="revamp" @click="revampBtn(news.id)"><em></em>修改</a>
              <a class="delete" @click="deleteBtn(news.id)"><em></em>删除</a>
            </div> -->
          </li>
        </ul>
      </van-tab>
    </van-tabs>

    <p class="moreData" v-show="needShow"><span>加载中...</span></p>
    <p class="lastShow" v-show="lastShow"><span>已经全部加载</span></p>
    <!-- <div v-transfer-dom>
      <confirm
        v-model="popup"
        :close-on-confirm="false"
        :title="('确定删除作业？删除后无法恢复数据？')"
        @on-confirm="onConfirm()"
        confirmText="是，我要删除"
      >
      </confirm>
    </div> -->
  </div>
</template>

<script>
  import {Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader,Cell} from 'vux'
  import {Field, Tab, Tabs} from 'vant';
  import Back from "../../components/common/Back.vue"
  import apiRouter from "../../config/api.js"
  // import {mapMutations} from 'vuex';
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
      Cell,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
    },
    mounted(){
      // let self = this;
      // self.massageData();
      // let clientHeight = document.body.clientHeight - self.$refs['heightBackPub'].$el.clientHeight;
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
      // if (this.$route.query.fresh && this.$route.query.fresh == '1') {
      //   this.loadData();
      // } else {
      //   this.loadData();
      // }
      this.loadData();
      document.title = '在线选课'
    },
    deactivated() {
      document.title = "绿蜻蜓"
    },
    data(){
      return {
        otherCategoryList:[],
        topListCategory:[],
        //课程状态
        statusView:{
            100:{
              text:'待开始',
              color:'red'
            },
            200:{
              text:'可报名',
              color:'#0bb20c'
            },
            201:{
              text:'已报名',
              color:'#38f'
            },
            0:{
              text:'已报满',
              color:'rgb(119, 119, 119)'
            },
            300:{
              text:'已结束',
              color:'rgb(119, 119, 119)'
            }
        },
        active:0,
        allCategoryList:[],
        totalCourselist:[],
        checkObj:{
          finalList:[],
          noDoList:[],
        },

        selectTab:0,
        id: '',
        page: 1,
        // popup: false,
        isShow: false,
        showItemNumber: -1,
        messageData: [],
        isEndReached: false,
        totalPage: 1,
        needShow: false,
        lastShow:false,
        wwwUrl:roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId='
      }
    },
    methods: {
      renderTime(record) {
        if (record.openTime.substr(0,10) === record.serverTime.substr(0,10)) {
          return record.openTime.substr(11,5);
        } else {
          return record.openTime.substr(5,5);
        }
      },
      goBack(){
        this.$router.push({path:'/'})
      },
      goDetail(e){
        this.$router.push({path:'/cur-enroll',query: {courseId: e.courseId}})
      },
      // switchTabItem(e){
      //   this.selectTab = e;
      //   console.log(this.selectTab)
      // },
      loadData(){
        let id = this.$route.query.id;
        let vm = this;
        this.$http.get( apiRouter.GET_SELCOURSE_H5_LIST ).then(response => {
          if (response.body.code === 200) {
            let allCategoryList =  response.body.data.COURSELIST;

            let otherCategoryList =  [];
            let topListCategory = [];
            let topList = [];
            let topListStr = sessionStorage.getItem("topList");
            if(!topListStr){
              topList = [];
            }else{
              topList = topListStr.split(',');
            }

            for(let j=0;j<allCategoryList.length;j++){
              let flag = true;
              for(let i=topList.length-1;i>=0;i--){
                if(flag && allCategoryList[j].courseId == topList[i]){
                  topListCategory.push(allCategoryList[j])
                  flag = false;
                }
              }
              if(flag){
                otherCategoryList.push(allCategoryList[j])
              }
            }
            vm.otherCategoryList = otherCategoryList;
            vm.topListCategory = topListCategory;
            vm.allCategoryList =  response.body.data.ALLCATEGORYLIST;
            vm.totalCourselist = response.body.data.COURSELIST;
          } else {
            alert(response.body.message);
          }
        }, error => {
          debugger;
        });
      },

      // edlitBtn(news, index){
      //   if (this.isShow && this.showItemNumber === index) {
      //     this.isShow = false;
      //     return;
      //   }
      //   this.isShow = true;
      //   this.showItemNumber = index;
      // },

      // deleteBtn(id){
      //   this.id = id;
      //   this.isShow = false;
      //   // this.popup = true;

      // },

      // onConfirm () {
      //   this.$http.get( apiRouter.DEL_HOMEWORK +'?id=' + this.id).then(response => {
      //     if (response.body.status === 200) {
      //       window.location.reload();
      //     } else {
      //       alert("删除失败");
      //     }
      //   }, erro => {
      //   });

      //   this.popup = false;
      //   return;
      //   this.$vux.loading.show({
      //     transition: '',
      //     text: 'processing'
      //   })
      //   setTimeout(() => {
      //     this.$vux.loading.hide()
      //     this.popup = false
      //   }, 1000)
      // },

      // massageData(){
      //   let _this = this;
      //   if (_this.totalPage < _this.page) {
      //     _this.needShow = false;
      //     _this.lastShow = true;
      //     return;
      //   };
      //   this.$http.get(apiRouter.GET_HOMEWORKLIST+"?" + 'page=' + this.page).then(response => {
      //     _this.needShow = false;
      //     let list = [];
      //     if (_this.page === 1) {
      //       let totalPage = response.body.data.totalpage;
      //       console.log(totalPage)
      //       _this.totalPage = totalPage;
      //       list = response.body.data.list;
      //       console.log(response.body.data.list)
      //     } else {
      //       list = _this.messageData.concat(response.body.data.list);
      //     }
      //     _this.messageData = list;
      //     _this.$nextTick(() => {
      //       _this.isEndReached = false;
      //     });
      //   }, erro => {
      //     _this.needShow = false;
      //     //   alert("请求失败了!!!!")
      //   });
      // },

      // revampBtn(id){
      //   this.$http.get(apiRouter.EDLIT_INFO+'?id=' + id).then(response => {
      //     if (response.body.status === 200) {
      //       this.messageWay(response.body.data)
      //       console.log(response.body.data)
      //       let messageString = JSON.stringify(response.body.data)
      //       window.localStorage.setItem("MESSAGE",messageString)
      //       //    let userList = JSON.stringify(response.body.data.userList)
      //       this.$router.push({path: "posted",query: {path:"Message",itemId:id}})
      //       this.isShow = false;
      //     }
      //   }, erro => {
      //     alert("失败")
      //   });
      // },


      // ...mapMutations({
      //   messageWay:"SET_MESSAGE"
      // })

    },

  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';

  .message {
    width: 100%;
  }

  .message li {
    .mixin-padding(15px, 15px);
    border-bottom: 1px solid @colorDD;
    height: 80px;
    position: relative;
  }

  .message-icon {
    width: 50px;
    height: 50px;
    background: url("../../assets/curriculum/group.png") no-repeat left;
    background-size: 100% 100%;
    position: absolute;
    top: 15px;
    left: 15px;
    border-radius: 3px;
  }

  .message-info {
    margin-left: 63px;
    margin-right: 50px;
    padding-top: 20px;
    display: block;
  }

  .message-info h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    font-size: @fontSize30;
    color: @color42;
  }

  .message-info p {
    font-size: @fontSize24;
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;;
  }

  .message-handle {
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: right;
  }

  .message-handle a {
    padding-top: 4px;
    padding-bottom: 4px;
    display: block;
  }

  .edlit-molde {
    width: 86px;
    height: 71px;
    position: absolute;
    right: 65px;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 30px;
    z-index:9;
  }

  .edlit-molde a {
    padding-bottom: 8px;
    padding-top: 10px;
    display: block;
    font-size: @fontSize24;
  }

  .edlit-molde a.revamp {
    color: #2196F3;

  }

  .edlit-molde a.revamp em {
    width: 11px;
    height: 12px;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a.delete em {
    width: 9px;
    height: 11px;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #FF5E5E;
  }

  a.delete {
    color: #FF5E5E;
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
    height: 40px;
    line-height: 40px;
    text-align: center;

  }

  .moreData span {
    height: 25px;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 23px;
  }




  .back-div{
    padding-bottom: 50px;
  }
  .up-back{
    width: 100%;
    height: 50px;
    font-size:@fontSize36;
    line-height: 50px;
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
    height: 50px;
    line-height: 50px;
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

  .tab-check{
    margin-top: 50px;
  }

  .box /deep/ .van-tab--active{
    color: #48b319;

  }

  .box /deep/ .van-tabs__line{
    background-color: #48b319;

  }
  .box /deep/ .van-tab{
    border-bottom: 1px solid #DDDDDD;
  }

</style>
