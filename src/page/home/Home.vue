<template>
  <div class="home-box">
    <ul class="tab-btn clearfix">
      <li>
        <a :href="wwwUrl + spaceUrl">
          <p><span>空间</span></p>
        </a>
      </li>
      <li>
        <a :href="wwwUrl + noticeUrl">
          <p><span>通知</span></p>
        </a>
      </li>
      <li class="currt-actiove">
        <a href="#">
          <p>
            <span>我的</span>
            <img v-if="userType === 'T_TEACHER'" class="user-type" src="../../assets/teacher.png" alt="">
            <img v-else-if="userType === 'T_PARENT'" class="user-type" src="../../assets/teacher3.png" alt="">
            <img v-else="userType === 'T_STUDENT'" class="user-type" src="../../assets/teacher2.png" alt="">
          </p>
        </a>
        <div class="border-bottom"> </div>
      </li>
    </ul>

    <div class="home clearfix">
      <h2 class="mune-title">我的应用</h2>
      <ul class="iocn-list">
        <li v-for="(item,index) in myIcon" :type="item.code" :keyNumber="key" :key="index">
          <a class="link-class" :class="item.newFlag?'new':''" :href="wwwUrl + item.pageUrl">
            <div
              :style="{background:item.color,display:'block',borderRadius: '5px'}"
            >
              <img class="icon" :src=wwwUrl+item.iconUrl alt="">
            </div>
            <p class="name" style="font-size: 0.5rem">{{item.name}}</p>
          </a>
        </li>
        <!--<li>
          <a class="link-class" href="#/schedule">
            <div :style="{background:'red',display:'block'}"
            >
              <img class="icon" src='http://gz.lqtedu.com/weixin/wechat/public/images/icon/wage.png' alt="">
            </div>
            <p class="name">课程表</p>
          </a>
        </li>-->
      </ul>
    </div>
    <div class="home clearfix" v-show="isShow">
      <h2 class="mune-title">我的管理</h2>
      <ul class="iocn-list">
        <li v-for="(item,index) in mgrIcon" :type="item.code" :key="index">
          <a class="link-class" :href="wwwUrl + item.pageUrl">
            <div
              :style="{background:item.color,display:'block',borderRadius: '5px'}"
            >
              <img class="icon" :src=wwwUrl+item.iconUrl alt="">
            </div>
            <p class="name" style="font-size: 0.5rem">{{item.name}}</p>
          </a>
        </li>

      </ul>
    </div>
    <div class="releaseBtn" v-show="isTeach">
      <h1 class="typeBtn" @click="typeBtn()">发布</h1>
      <span
        class="send send-notice"
        :class="{ active: isActive }"
        @click="sendNotice()">发通知</span>
      <!--style="color: #FFFFFF; background: #dddddd"-->
      <span
        class="send send-quest"
        :class="{ myquest: isActive }"
        @click="sendQuestion()"
      >发问卷</span>
      <span
        class="send send-vote" style="color: #FFFFFF; background: #dddddd"
        :class="{ myvote: isActive }">请期待</span>
      <span
        class="send send-work" style=""
        :class="{ mywork: isActive}"
        @click="announce()"
        >发作业</span>
    </div>
  </div>
</template>

<script>
import apiRouter from "../../config/api.js";
export default {
  mounted() {
    this.showList();
  },
  activated() {
    this.key += 1;
    this.showList();
    $(".vux-x-dialog").hide();
  },
  methods: {
    closedSend() {
      this.isActive = false;
    },
    toSpace(){
      this.$router.push({ path: "spaceIndex" });
    },

     //  获取首页列表数据

    showList() {
      this.$http.get(apiRouter.GET_LIST).then(function(response) {
        //    console.log(response)
        if (response.body.status === 200) {
          this.myIcon = response.body.data.myIcon;
          let mgrIcon = response.body.data.mgrIcon;
          let isTeach = response.body.data.userType;
          this.userType = response.body.data.userType;
          this.spaceUrl = response.body.data.spaceUrl;
          this.noticeUrl = response.body.data.noticeUrl;
          if (isTeach === "T_TEACHER") {
            this.isTeach = true;
          } else {
            this.isTeach = false;
          }
          if (mgrIcon.length !== 0) {
            this.isShow = true;
            this.mgrIcon = response.body.data.mgrIcon;
          } else {
            this.isShow = false;
          }
        }else{
          alert(response.data.message);
        }
      });
    },
    typeBtn() {
      if (this.isActive === false) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    sendNotice() {
      this.$router.push({ path: "type" });
      this.isActive = false;
    },
    sendQuestion() {
      this.$router.push({ path: "q-type" });
      this.isActive = false;
    },

    payroll() {
      this.$router.push({ path: "payrolllist" });
    },

    announce() {
      this.$router.push({ path: "announce" });
    },

    // sendVideo(){
    //   this.$router.push({ path: "spaceDetail",query:{path:"video"}});
    // },
    // sendPhoto(){
    //   this.$router.push({ path: "spaceDetail",query:{path:"photo"}});
    // }

  },
  data() {
    return {
      isShow: false,
      isActive: false,
      myIcon: [],
      mgrIcon: [],
      wwwUrl: roterPath,
      isTeach: false,
      userType: "",
      spaceUrl: "",
      noticeUrl: "",
      key: 1,
      test: ""
    };
  }
};
</script>

<style lang="less" type="text/less">
  @import "../../style/minxin.less";
  figure {
    display: block;
  }

  .user-type {
    position: absolute;
    width: 20px;
    height: 19px;
    top: 0.55rem;
  }

  .tab-btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
  }
  .tab-btn li {
    width: 100/3 * 1%;
    float: left;
    text-align: center;
    position: relative;
  }
  .tab-btn li p span {
    font-size: 18px;
    color: #000000;
    padding-right: 0.2rem;
  }
  .tab-btn li.currt-actiove p span {
    color: #48b319;
  }
  .border-bottom {
    width: 100%;
    height: 3px;
    background: #48b319;
    position: absolute;
    bottom: 1px;
    left: 0;
  }

  .home-box {
    box-sizing: border-box;
    height: 100%;
  }
  .home {
    padding-top: 0.5rem;
  }
  .mune-title {
    line-height: 0.6rem;
    padding-left: 0.2rem;
    font-size: 15px;
    color: @color42;
    margin-right: 0.5rem;
    margin-left: 1rem;
    border-left: solid 4px #48b319;
    margin-bottom: 0.5rem;
  }
  .iocn-list {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .iocn-list li {
    position: relative;
    float: left;
    width: 25%;
    padding: 0rem 0.5rem;
    /* height: 90px;*/
    text-align: center;
    box-sizing: border-box;
  }
  .iocn-list li a {
    display: block;
  }

  .iocn-list li[type="ZH"] img {
    width: 23px;
    height: 55px;
  }

  .link-class {
    height: 90px;
  }
  .icon {
    width: 23px;
    height: 55px;
  }

  .iocn-list .name {
    text-align: center;
    white-space: nowrap;
    height: 28px;
    line-height: 28px;
    font-size: 11px;
    color: @color42;
  }

  .messageBtn {
    width: 63px;
    height: 63px;
    line-height: 63px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize26;
    color: @white;
    position: fixed;
    bottom: 23px;
    left: 20px;
    background: #ff5e5e;
    z-index: 10;
  }
  .typeBtn {
    width: 63px;
    height: 63px;
    line-height: 63px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize36;
    color: @white;
    position: fixed;
    bottom: 23px;
    right: 20px;
    background: @green;
    z-index: 10;
  }
  .send {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    font-size: @fontSize24;
    color: @white;
  }
  .send-notice,
  .send-quest,
  .send-vote,
  .send-work {
    position: fixed;
    bottom: 29px;
    right: 26px;
    z-index: 5;
  }
  .send-notice {
    background: #ff5e5e;
  }
  .send-quest {
    background: #1ba0e1;
  }
  .send-vote {
    background: #f09709;
  }
  .send-work {
    background: rgb(251, 192, 45);
  }

  // 定义动画  ---------------------------------------- mymove 发通知------------------------------------------
  @keyframes mymove {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(15px, -83px);
      -webkit-transform: translate(15px, -83px);
      -moz-transform: translate(15px, -83px);
      -o-transform: translate(15px, -83px);
      -ms-transform: translate(15px, -83px);
      opacity: 1;
    }
  }

  @-moz-keyframes mymove /* Firefox */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(15px, -80px);
      -webkit-transform: translate(15px, -75px);
      -moz-transform: translate(15px, -75px);
      -o-transform: translate(15px, -75px);
      -ms-transform: translate(15px, -75px);
      opacity: 1;
    }
  }

  @-webkit-keyframes mymove /* Safari 和 Chrome */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(15px, -80px);
      -webkit-transform: translate(15px, -75px);
      -moz-transform: translate(15px, -75px);
      -o-transform: translate(15px, -75px);
      -ms-transform: translate(15px, -75px);
      opacity: 1;
    }
  }

  @-o-keyframes mymove /* Opera */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(15px, -80px);
      -webkit-transform: translate(15px, -75px);
      -moz-transform: translate(15px, -75px);
      -o-transform: translate(15px, -75px);
      -ms-transform: translate(15px, -75px);
      opacity: 1;
    }
  }

  // ----------------------------------------发问卷------------------------------------------
  @keyframes myquest {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-43px, -75px);
      -webkit-transform: translate(-43px, -75px);
      -moz-transform: translate(-43px, -75px);
      -o-transform: translate(-43px, -75px);
      -ms-transform: translate(-43px, -75px);
      opacity: 1;
    }
  }

  @-moz-keyframes myquest /* Firefox */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-43px, -75px);
      -webkit-transform: translate(-43px, -75px);
      -moz-transform: translate(-43px, -75px);
      -o-transform: translate(-43px, -75px);
      -ms-transform: translate(-43px, -75px);
      opacity: 1;
    }
  }

  @-webkit-keyframes myquest /* Safari 和 Chrome */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-43px, -75px);
      -webkit-transform: translate(-43px, -75px);
      -moz-transform: translate(-43px, -75px);
      -o-transform: translate(-43px, -75px);
      -ms-transform: translate(-43px, -75px);
      opacity: 1;
    }
  }

  @-o-keyframes myquest /* Opera */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-43px, -75px);
      -webkit-transform: translate(-43px, -75px);
      -moz-transform: translate(-43px, -75px);
      -o-transform: translate(-43px, -75px);
      -ms-transform: translate(-43px, -75px);
      opacity: 1;
    }
  }

  // -----------------------------------发投票-----------------------------------------------------
  @keyframes myvote {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, -33px);
      -webkit-transform: translate(-65px, -33px);
      -moz-transform: translate(-65px, -33px);
      -o-transform: translate(-65px, -33px);
      -ms-transform: translate(-65px, -33px);
      opacity: 1;
    }
  }

  @-moz-keyframes myvote /* Firefox */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, -33px);
      -webkit-transform: translate(-65px, -33px);
      -moz-transform: translate(-65px, -33px);
      -o-transform: translate(-65px, -33px);
      -ms-transform: translate(-65px, -33px);
      opacity: 1;
    }
  }

  @-webkit-keyframes myvote /* Safari 和 Chrome */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, -33px);
      -webkit-transform: translate(-65px, -33px);
      -moz-transform: translate(-65px, -33px);
      -o-transform: translate(-65px, -33px);
      -ms-transform: translate(-65px, -33px);
      opacity: 1;
    }
  }

  @-o-keyframes myvote /* Opera */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, -33px);
      -webkit-transform: translate(-65px, -33px);
      -moz-transform: translate(-65px, -33px);
      -o-transform: translate(-65px, -33px);
      -ms-transform: translate(-65px, -33px);
      opacity: 1;
    }
  }

  // -----------------------------------发作业-----------------------------------------------------
  @keyframes mywork {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, 25px);
      -webkit-transform: translate(-65px, 25px);
      -moz-transform: translate(-65px, 25px);
      -o-transform: translate(-65px, 25px);
      -ms-transform: translate(-65px, 25px);
      opacity: 1;
    }
  }

  @-moz-keyframes mywork /* Firefox */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, 25px);
      -webkit-transform: translate(-65px, 25px);
      -moz-transform: translate(-65px, 25px);
      -o-transform: translate(-65px, 25px);
      -ms-transform: translate(-65px, 25px);
      opacity: 1;
    }
  }

  @-webkit-keyframes mywork /* Safari 和 Chrome */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, 25px);
      -webkit-transform: translate(-65px, 25px);
      -moz-transform: translate(-65px, 25px);
      -o-transform: translate(-65px, 25px);
      -ms-transform: translate(-65px, 25px);
      opacity: 1;
    }
  }

  @-o-keyframes mywork /* Opera */ {
    from {
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
      -moz-transform: translate(0, 0);
      -o-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      opacity: 0;
    }
    to {
      transform: translate(-65px, 25px);
      -webkit-transform: translate(-65px, 25px);
      -moz-transform: translate(-65px, 25px);
      -o-transform: translate(-65px, 25px);
      -ms-transform: translate(-65px, 25px);
      opacity: 1;
    }
  }

  //执行动画
    .active {
      animation: mymove 0.8s ease 1 alternate 0.2s forwards;
      -moz-animation: mymove 0.8s ease 1 alternate 0.2s forwards;
      -webkit-animation: mymove 0.8s ease 1 alternate 0.2s forwards;
    }

  .myquest {
    animation: myquest 0.8s ease 1 alternate 0.2s forwards;
    -moz-animation: myquest 0.8s ease 1 alternate 0.2s forwards;
    -webkit-animation: myquest 0.8s ease 1 alternate 0.2s forwards;
  }

  .myvote {
    animation: myvote 0.8s ease 1 alternate 0.2s forwards;
    -moz-animation: myvote 0.8s ease 1 alternate 0.2s forwards;
    -webkit-animation: myvote 0.8s ease 1 alternate 0.2s forwards;
  }

  .mywork {
    animation: mywork 0.8s ease 1 alternate 0.2s forwards;
    -moz-animation: mywork 0.8s ease 1 alternate 0.2s forwards;
    -webkit-animation: mywork 0.8s ease 1 alternate 0.2s forwards;
  }



  .new::before {
    content: '';
      /*.2rem;*/
    width: 8px;
    height: 8px;
    background-color: #ff4d33;
    border-radius: 100%;
    position: absolute;
    top: -3px;
    right: 10px;
    bottom: auto;
    left: auto
  }
</style>
