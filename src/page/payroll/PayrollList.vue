<template>
	<div class="box" ref="boxHeight">
		<!--  <div class="back-div" ref="heightBack">-->
		<!--    <p @click="goBack()" class="up-back">返回</p>-->
		<!--  </div>-->
		<x-header class="title-header" :left-options="{preventGoBack: true}" @on-click-back="goBack">工资单</x-header>
		<div v-if="!this.showEmptyImg">
			<div class="payroll-div">
				<div class="payroll-title">
					<h1>
						<span>{{titleHead === "全年" ? this.yearCode + "年全年" : titleHead}}</span>
						<a href="javascript:void(0);">
							<x-address
								:title="title"
								v-model="value"
								:value="value"
								:list="addressData"
								@on-hide="logHide"
								@on-shadow-change="onShadowChange"
								:show.sync="showPicker"
							></x-address>
						</a>
					</h1>
				</div>
			</div>
			<div class="lisnem" v-if="hasData">
				<ul class="payroll-list-d" v-if="isShowMonthEntry">
					<li v-for="item in detailList" :class="addclassname(item.AMOUNT)" :key="item.ID">
						<span>{{ item.NAME }}</span>
						<i>{{ item.AMOUNT }}</i>
					</li>
				</ul>
				<ul class="payroll-list" v-else>
					<li v-for="item in listList" :class="addclassname(item.AMOUNT)" :key="item.WAGE_MONTH">
						<span>{{ item.WAGE_MONTH_NAME }}</span>
						<i>{{ item.TOTAL }}</i>
					</li>
				</ul>
				<!-- <div class="payroll-bottom">
					<p>
						<span>合计金额</span>
						<span>{{ total }}</span>
					</p>
				</div>-->
			</div>
		</div>

		<div class="empty" v-else>
			<img src="../../assets/emission.png" alt />
			<span>暂时还没有相关信息哟〜</span>
		</div>

		<popup v-model="isShowMonthEntry" height="75vh">
			<div style="height:75vh;display:flex;overflow: auto;">
				<ul class="payroll-list-d">
					<li v-for="item in detailList" :class="addclassname(item.AMOUNT)" :key="item.ID">
						<span>{{ item.NAME }}</span>
						<i>{{ item.AMOUNT }}</i>
					</li>
				</ul>
			</div>
		</popup>
	</div>
</template>

<script>
import Back from "../../components/common/Back.vue";
import apiRouter from "../../config/api.js";
import { Group, XAddress, XButton, Cell, XHeader, Popup } from "vux";

export default {
  components: {
    Back,
    Group,
    XAddress,
    XButton,
    Cell,
    XHeader,
    Popup
  },
  data() {
    return {
      addressData: [],

      currtMonth: "",
      currtYear: "",

      detailList: [],
      hasData: true,
      lastShow: false,
      listList: [],
      navTitle: "",
      showPicker: false,
      isShowMonthEntry: true,
      showEmptyImg: false,
      storMonth: "",
      storYear: "",
      title: "更换工资表",
      titleHead: "",
      titleName: "",
      total: "",
      url: "",
      value: [],
      wageID: "",
      wwwUrl: roterPath,
      yearCode: ""
    };
  },
  mounted() {
    this.getDetailData();
    let path = this.$route.name;
    // console.log(path);
    if (path === "payrolllist") {
      this.loadUrl();
    }
  },
  // updated() {
  //   //  this.showDetailData();
  // },
  // updated() {
  //   //    console.log("New",this.yearCode,this.titleHead);
  // },
  methods: {
    getDetailData() {
      let _this = this;

      let apiUrl = `${apiRouter.GET_WAGEINFO}?yearCode=${this.yearCode}&id=${
        this.wageID
      }`;

      this.$http.get(apiUrl).then(
        response => {
          if (response.body.status === 200) {
            _this.isShowMonthEntry = true;

            let _data = response.body.data;

            if (_data.has_wage === "1") {
              _this.showEmptyImg = false;
              _this.navTitle = _data.year_code;
              _this.hasData = !!_data.detail_list.length;
              _this.detailList = _data.detail_list;
              _this.total = _data.total;

              _this.addressData = _this.getSelectDates(_data.sel_list);

              _this.currtYear = _data.year_code;
              _this.currtMonth = _data.wage_id;

              _this.value = [_this.currtYear, _this.currtMonth];
              console.log("value", _this.value);
              console.log("titleHead", _this.titleHead);
            } else if (_data.has_wage === "0") {
              _this.showEmptyImg = true;
            }
          }
        },
        response => {
          //      alert("请求失败了!!!!")
        }
      );
    },

    getListData() {
      let _this = this;
      let pathUrl = apiRouter.GET_WAGELIST + "?yearCode=" + this.yearCode;
      this.$http.get(pathUrl).then(
        response => {
          if (response.status === 200) {
            _this.isShowMonthEntry = false;
            _this.navTitle = _this.yearCode + "年全年";

            let _data = response.body.data;
            if (_data.has_wage !== 0) {
              _this.hasData = !!_data.list.length;
              _this.listList = _data.list;
              _this.total = _data.total;
            }
          }
        },
        response => {
          //      alert("请求失败了!!!!")
        }
      );
    },

    getSelectDates: function(selectList) {
      let optionArr = [];

      selectList.forEach(item => {
        optionArr.push({
          name: item.YEAR_NAME,
          value: item.YEAR_CODE
        });

        item.WAGE_LIST.forEach(item_sub => {
          optionArr.push({
            name: item_sub.WAGE_NAME,
            value: item_sub.WAGE_ID,
            parent: item.YEAR_CODE
          });
        });
      });

      console.log("option List", optionArr);

      return optionArr;
    },
    goBack() {
      window.location.replace(roterPath + "/weixin/wechat/dist/index.html");
    },
    // goToDetail() {
    //   this.$router.push({
    //     path: "payrolldetail"
    //   });
    // },
    addclassname: function(num) {
      if (num < 0) {
        return "negative";
      }
    },

    onShadowChange(ids, names) {
      this.yearCode = ids[0];
      this.wageID = ids[1];
      this.titleHead = names[1];
    },

    logHide(str) {
      console.log("on-hide", str);

      if (str) {
        if (this.wageID) {
          this.getDetailData();
        } else {
          this.getListData();
        }
      }
    },
    // logShow(str) {
    //   console.log("on-show");
    // },

    loadUrl() {
      if (location.href.indexOf("?reloaded=") == -1) {
        location.href = location.href + "?reloaded=";
        location.reload();
      }
    }
  }
};
</script>

<style lang="less" type="text/less" scoped src="./payroll.less">
</style>
