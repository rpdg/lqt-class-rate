<template>
<div class="box" ref="boxHeight">
<!--  <div class="back-div" ref="heightBack">-->
<!--    <p @click="goBack()" class="up-back">返回</p>-->
<!--  </div>-->
    <x-header class="title-header" :left-options="{preventGoBack: true}"
              @on-click-back="goBack">工资单
    </x-header>
  <div v-if="!this.imgShow">
    <div class="payroll-div">
      <div class="payroll-title">
        <h1>
            <span>{{titleHead === "全年" ? this.yearCode + "年全年" : titleHead}}</span>
            <a href="javascript:;">
              <x-address
                @on-hide="logHide"
                :title="title"
                v-model="value"
                :value = "value"
                :list="addressData"
                @on-shadow-change="onShadowChange"
                :show.sync="showAddress"

                >
                </x-address>
            </a>
          </h1>
      </div>
    </div>
    <div class="lisnem" v-if="hasData">
      <ul class="payroll-list-d" v-if="showDetail">
        <li v-for="item in detailList" :class="addclassname(item.AMOUNT)">
          <span>{{ item.NAME }}</span>
          <i> {{ item.AMOUNT }}</i>
        </li>
      </ul>
      <ul class="payroll-list" v-else>
        <li v-for="item in listList" :class="addclassname(item.AMOUNT)">
          <span>{{ item.WAGE_MONTH_NAME }}</span>
          <i> {{ item.TOTAL }}</i>
        </li>

      </ul>
      <div class="payroll-bottom">
        <p>
          <span>合计金额</span>
          <span> {{ total }}</span>
        </p>
      </div>
    </div>


  </div>




  <div class="empty" v-else>
    <img src="../../assets/emission.png" alt="">
    <span>暂时还没有相关信息哟〜</span>
  </div>
</div>
</template>

<script type="es6">
import Back from "../../components/common/Back.vue"
import apiRouter from "../../config/api.js"
import {
  Group,
  XAddress,
  ChinaAddressV4Data,
  XButton,
  Cell,
  Value2nameFilter as value2name,
    XHeader
} from 'vux'
export default {
  components: {
    Back,
    Group,
    XAddress,
    XButton,
    Cell,
      XHeader
  },
  mounted() {
    console.log('this.addressData', this.addressData);
    this.showDetailData();
    let path = this.$route.name
    console.log(path);
    if(path=== 'payrolllist'){
      this.loadUrl();
    }
  },
  updated(){
  //  this.showDetailData();
  },
  data() {
    return {
      url:'',
      lastShow: false,
      wwwUrl: roterPath,

      navTitle: '',
      hasData: true,
      showDetail: true,
      detailList: [],
      listList: [],
      total: '',

      yearCode: '',
      wageID: '',

      titleName: '',
      titleHead: '',

      title: '更换工资表',
      value: [],
      addressData: [],
      showAddress: false,

      currtYear: '',
      currtMonth: '',


      storYear: '',
      storMonth: '',

      imgShow:false


    }
  },
  updated(){
//    console.log("New",this.yearCode,this.titleHead);
  },
  methods: {
    showDetailData() {
      let _this = this;
      let pathUrl = apiRouter.GET_WAGEINFO + "?" +
        'yearCode=' + this.yearCode +
        "&id=" + this.wageID;
      this.$http.get(pathUrl).then(response => {
        console.log("response",response);
        if (response.body.status === 200) {
          var _data = response.body.data;
          _this.showDetail = true;
          console.log('_data',_data);
          if(_data.has_wage === "1"){
            this.imgShow = false;
            _this.navTitle = _data.year_code;
            _this.hasData = !!_data.detail_list.length;
            _this.detailList = _data.detail_list;
            _this.addressData = _this.getSelectDates(_data.sel_list);
            _this.total = _data.total;
            console.log(this.addressData);

            this.currtYear = _data.year_code;
            this.currtMonth = _data.wage_id;
            this.value = [];
            this.value.push(this.currtYear);
            this.value.push(this.currtMonth);
            console.log("value",this.value);
            console.log('titleHead',this.titleHead);
          }else if(_data.has_wage === "0"){
            this.imgShow = true;
          }

        }
      }, response => {
  //      alert("请求失败了!!!!")
      });
    },
    showListData() {
      let _this = this;
      let pathUrl = apiRouter.GET_WAGELIST + "?" +
        'yearCode=' + this.yearCode;
      this.$http.get(pathUrl).then(response => {
        if (response.status === 200) {
          var _data = response.body.data;
          _this.showDetail = false;
          _this.navTitle = _this.yearCode + '年全年';
          if(_data.has_wage !== 0){
            _this.hasData = !!_data.list.length;
            _this.listList = _data.list;
            _this.total = _data.total;
          }

        }
      }, response => {
  //      alert("请求失败了!!!!")
      });
    },
    getSelectDates: function(selectList) {
      let selList = [];
      selectList.map(item => {
        selList.push({
          name: item.YEAR_NAME,
          value: item.YEAR_CODE,
        });
        item.WAGE_LIST.map(item_sub => {
          selList.push({
            name: item_sub.WAGE_NAME,
            value: item_sub.WAGE_ID,
            parent: item.YEAR_CODE,
          });
        });
      });
      return selList;
    },
    goBack() {
      window.location.replace(roterPath + "/weixin/wechat/dist/index.html")
    },
    goToDetail() {
      this.$router.push({
        path: "payrolldetail"
      });
    },
    addclassname: function(num) {
      if (num < 0) {
        return 'negative'
      }
    },

    onShadowChange(ids, names) {
      this.yearCode = ids[0];
      this.wageID = ids[1];
      this.titleHead = names[1];
    },
    logHide(str) {
      console.log('on-hide', str)
      if (str) {
        if (this.wageID) {
          this.showDetailData();
        } else {
          this.showListData();
        }
      }
    },
    logShow(str) {
      console.log('on-show')
    },

    loadUrl(){
      if(location.href.indexOf("?reloaded=")==-1){
          location.href=location.href+"?reloaded=";
          location.reload();
      }
    }

  }
}
</script>

<style lang="less" type="text/less" scoped>
@import '../../style/minxin.less';
.box {
    height: 100%;
}
.back-div {
    padding-bottom: 100/@baseSize;
}
.up-back {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    line-height: 100/@baseSize;
    color: @white;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
}

.payroll-div {
    margin-top: 100/@baseSize;
    padding-bottom: 100/@baseSize;
}
.payroll-title {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    line-height: 100/@baseSize;
    color: @white;
    text-align: center;
    position: fixed;
    top: 100/@baseSize;
    left: 0;
    z-index: 10;
}
.payroll-title h1 {
    display: flex;
    justify-content: space-between;
    padding-left: 40/@baseSize;
    padding-right: 40/@baseSize;
    border-bottom: 1px solid #AAB2C0;
    box-sizing: border-box;
    background: #ffffff;
}
.payroll-title h1 span {
    color: #333333;
    font-size: @fontSize30;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
}
.payroll-title h1 a {
    color: #48B319;
    font-size: @fontSize30;
}
.payroll-list {
    width: 100%;
    padding-bottom: 100/@baseSize;
}
.payroll-list li {
    display: flex;
    justify-content: space-between;
    line-height: 90/@baseSize;
    padding-left: 40/@baseSize;
    padding-right: 40/@baseSize;
    box-sizing: border-box;
}
.payroll-list li span {
    font-size: @fontSize30;
    color: #666666;
}
.payroll-list li:nth-child(even) {
    background: #F4F9EE;
}
.payroll-list li i {
    display: inline;
    font-style: normal;
}

.payroll-list-d {
    width: 100%;
    padding-bottom: 100/@baseSize;
}
.payroll-list-d li {
    display: flex;
    justify-content: space-between;
    padding-left: 40/@baseSize;
    padding-right: 40/@baseSize;
    box-sizing: border-box;
    padding-top: 20/@baseSize;
    padding-bottom: 20/@baseSize;
    flex-flow: row;
    font-size: @fontSize30;
}
.payroll-list-d li.negative i {
    color: #E51C23;
}
.payroll-list-d li span {
    color: #666666;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.payroll-list-d li:nth-child(even) {
    background: #F4F9EE;
}

.payroll-list-d li i {
    display: inline;
    font-style: normal;
}

.payroll-bottom {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    line-height: 100/@baseSize;
    color: @white;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;

    background: #ffffff;
}
.payroll-bottom p {
    width: 100%;
    height: 100/@baseSize;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #AAB2C0;
    padding-left: 40/@baseSize;
    padding-right: 40/@baseSize;
    box-sizing: border-box;

}
.payroll-bottom p a,
.payroll-bottom p span {
    font-size: @fontSize32;
    color: #666666;
}

.empty {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 500/@baseSize);
}

.empty img {
    width: 208/@baseSize;
    display: block;
}

.empty span {
    padding-top: 74/@baseSize;
    font-size: @fontSize30;
    color: #666666;
}

.payroll-title .weui-cell {
    padding: 0;
}

.popup-style {
    background: red;
}

.title-header {
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    z-index: 2;
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

</style>
