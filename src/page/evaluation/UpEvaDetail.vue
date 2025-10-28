<template>
  <div class="box">
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack">{{ className }}{{courseName}}
    </x-header>
    <div class="content">
      <h1 class="title-detail">课堂评价详情</h1>
      <div>
        <span class="title-left">
          {{detailMap.PJ_ITEM_NAME}} &nbsp; {{detailMap.STUNUM}}人</span>
        <span class="title-right">{{detailMap.PJ_TIME}}</span>

      </div>
      <div style="padding: 10px">
        <div
          style="display: inline-block;width: 19.8%;text-align: center;margin-top: 10px;"
          v-for="(item, index) in stuList"
          :key="index"
        >
          <img :src="item.AVATAR" style="width: 50px;height: 50px;border-radius: 50%"/>
          <span style="display: inline-block;font-size: 10px;">{{item.CLASS_NUM}} {{item.NAME}}</span>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import {XHeader, Cell} from 'vux'
  import apiRouter from "../../config/api.js"

  export default {

    components: {
      XHeader,
      Cell,
    },
    mounted() {

    },
    activated() {
      this.page = 1;
      this.className = this.$route.query.className;
      this.courseName = this.$route.query.courseName;
      this.loadData();

    },
    data() {
      return {
        className: '',
        courseName: '',
        detailMap:{},
        stuList:[]
      }
    },
    methods: {
      goBack(e) {
          this.$router.go(-1);
      },
      loadData() {
        let vm = this;
        let pjId = vm.$route.query.pjId;
        this.$http.get(apiRouter.GET_COURSE_PJ_DETAIL + "?pjId=" + pjId).then(response => {
          if (response.body.code === 200) {
            let bodyData = response.body.data;
            let detailMap = bodyData.detailMap;
            let stuList = bodyData.stuList;
            vm.detailMap = detailMap;
            vm.stuList = stuList;

            //vm.messageData = messageData;

          } else {
            alert(response.body.message);
          }
        }, error => {
          debugger;
        });
      },
    },

  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';


  .title-header {
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

  .title-header /deep/ .vux-header-title {
    color: #333;
    line-height: 46px;

  }

  .title-header /deep/ .vux-header-back {
    color: #38f;
  }

  .title-header /deep/ .left-arrow:before {
     border-color: #38f !important;
  }

  .content{
    margin-top: 50px;
  }

  .title-detail{
    padding: 1em;
    text-align: center;
    font-weight: bolder;
    font-size: 16px;
  }

  .title-left{
    color: rgb(72, 179, 25);
    padding-left: 10px;
  }

  .title-right{
    position: absolute;
    right: 10px;
  }
</style>
