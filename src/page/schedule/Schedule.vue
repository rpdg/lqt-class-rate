<template>
	<div class="box" ref="boxHeight" style="color: #414141;">
		<x-header
			class="title-header"
			:left-options="{preventGoBack: true}"
			@on-click-back="onClickLeft"
		>我的日程</x-header>
		<div v-if="!this.imgShow" class="realContent">
			<div class="payroll-div">
				<div class="payroll-title">
					<h1>
						<span style="font-size: 15px">{{currentMonth}}</span>
						<!--<a href="javascript:;">
              <x-address
                @on-hide="logHide"
                :title="title"
                v-model="value"
                :value="value"
                :list="addressData"
                @on-shadow-change="onShadowChange"
                :show.sync="showAddress"

              >
              </x-address>
						</a>-->
						<span @click="goWeekList" style="text-align:right;font-size: 15px">查看课程表</span>
					</h1>
				</div>
			</div>
			<div class="lisnem" v-if="hasData">
				<vue-event-calendar
					:events="demoEvents"
					@month-changed="monthChange"
					@day-changed="dayChange"
					@week-changed="weekChange"
					@switch-type="typeSwitch"
					showEvents="false"
					:isWeek="isWeek"
					:showClick="false"
				></vue-event-calendar>
				<div style="    position: relative;bottom: 15px;">
					<h1 style="text-align: justify;" class="class-schedule">
						<span style="display: inline-block;font-size: 15px;color: #9EABBE">{{listTitle}}</span>
						<!--<van-icon name="wap-nav" color="#48B319" style="color: rgb(72, 179, 25);vertical-align: middle;" />-->
						<div style="display: inline-block;float: right;">
							<img style="height: 0.8em;" src="../../assets/schedule/Menu.png" />
							<span style="color: #48B319" @click="goTypeList">分类列表</span>
						</div>
					</h1>
				</div>
			</div>
			<div>
				<div v-for="(item,index) in eventList" @click="goDetail(item)">
					<van-row style="padding: 5px">
						<van-col
							span="5"
							v-if="item.startTime && !(index>0 && new Date(eventList[index-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(item.startTime.replace(/-/g, '/')).format('MM月dd日'))"
							style="text-align: center"
						>
							<div>{{ new Date(item.startTime.replace(/-/g, '/')).format('MM月dd日')}}</div>
							<div
								style="color: #9EABBE;"
							>{{ dayWeek[new Date(item.startTime.replace(/-/g, '/')).getDay()]}}</div>
						</van-col>
						<van-col
							span="15"
							v-if="item.startTime && !(index>0 && new Date(eventList[index-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(item.startTime.replace(/-/g, '/')).format('MM月dd日'))"
							style="border-bottom: 1px #ECF1F8 solid;"
						>
							<div style="padding: 5px 0;">
								<div class="tag-line tag-orange" :style="'border-color:'+item.color">
									<span class="double-line">{{item.content}}</span>
								</div>
							</div>
						</van-col>
						<van-col
							v-if="!item.startTime || (index>0 && new Date(eventList[index-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(item.startTime.replace(/-/g, '/')).format('MM月dd日'))"
							span="15"
							offset="5"
							style="border-bottom:1px #ECF1F8 solid;"
						>
							<div style="padding: 5px 0;">
								<div class="tag-line tag-orange" :style="'border-color:'+item.color">
									<span class="double-line">{{item.content}}</span>
								</div>
							</div>
						</van-col>

						<van-col
							span="4"
							v-show="item.startTime && item.allDay==0"
							style="border-bottom: 1px #ECF1F8 solid;"
						>
							<div
								style="text-align: right;padding-right: 5px;color: #bbbbbb"
							>{{ new Date(item.startTime.replace(/-/g, '/')).format('hh:mm')}}</div>
							<div
								style="text-align: right;padding-right: 5px;color: #bbbbbb"
							>{{ new Date(item.endTime.replace(/-/g, '/')).format('hh:mm')}}</div>
						</van-col>
						<van-col
							span="4"
							v-show="item.startTime && item.allDay!=0"
							style="border-bottom: 1px #ECF1F8 solid;"
						>
							<div
								v-show="item.allDay == '1'"
								style="text-align: right;padding-right: 5px;color: #bbbbbb;line-height: 44px;"
							>全天</div>
							<div
								v-show="item.allDay == '2'"
								style="text-align: right;padding-right: 5px;color: #bbbbbb;line-height: 44px;"
							>多天</div>
						</van-col>
					</van-row>
				</div>
			</div>
		</div>

		<div class="empty" v-show="eventList.length == 0">
			<span>还没有任何日程哟，可点击+号添加日程〜</span>
			<img
				style="width:30px;margin-top: 10px;"
				src="../../assets/schedule/coffee-cup-hot-drink-dessert-drink.png"
				alt
			/>
		</div>
		<div @click="typeBtn" v-show="isActive" class="mask-type-btn" :style="'height:'+maskHeight"></div>
		<div class="releaseBtn" v-show="isTeach">
			<img
				:class="isActive?'typeBtn typeBtn-click':'typeBtn' "
				@click="typeBtn()"
				src="../../assets/schedule/add-new-button-plus-create.png"
			/>
			<!-- <h1 :class="isActive?'typeBtn typeBtn-click':'typeBtn' " @click="typeBtn()" style="font-size: 1.2rem">+</h1>-->
			<span
				class="send send-notice"
				:class="{ activeSchedule: isActive }"
				@click="sendNotice('T_USER')"
				:style="{display:isActive?'block':'none'}"
			>个人日程</span>
			<span
				class="send send-quest"
				style="color: #FFFFFF; background: #FDD835"
				:class="{ myquest: isActive }"
				@click="sendNotice('T_OUT_SCHOOL')"
				:style="{display:isActive?'block':'none'}"
			>校外课程</span>
			<span
				class="send send-vote"
				style="color: #FFFFFF; background: #5C6BC0"
				:class="{ myvote: isActive }"
				@click="sendNotice('T_BIRTHDAY')"
				:style="{display:isActive?'block':'none'}"
			>生日提醒</span>
			<span
				class="send send-work"
				style="color: #FFFFFF; background: #AA1A79;"
				:class="{ mywork: isActive}"
				@click="sendNotice('T_NOTE')"
				:style="{lineHeight: '32px' ,display:isActive?'block':'none'}"
			>便笺</span>
			<!--@click="announce()"-->
		</div>
	</div>
</template>

<script type="es6">
import apiRouter from "../../config/api.js";
import {
  firstDayOfWeek,
  firstDayOfWeek2,
  nDayLater,
  firstDayOfMonth,
  lastDayOfMonth,
  firstDayOfWeekWithoutTime,
  nDayLaterWithoutTime
} from "../../utils/DateUtils";
import { Row, Col, Icon, Cell, CellGroup, Tag, Toast } from "vant";
//import 'vant/lib/vant-css/index.css';
import "vant/lib/index.css";

import { XHeader } from "vux";

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Tag.name]: CellGroup,
    [Toast.name]: Toast,
    XHeader
  },
  mounted() {
    var now = new Date();
    //mydata=data.replace(/-/g, '/');
    var a = firstDayOfWeekWithoutTime(now);
    var b = nDayLaterWithoutTime(new Date(a.replace(/-/g, "/")), 6);
    this.a = a;
    this.b = b;
    this.loadData(a, b);
    /*console.log('this.addressData', this.addressData);
      this.showDetailData();
      var path = this.$route.name
      console.log(path);
      if(path=== 'payrolllist'){
        this.loadUrl();
      }*/
  },
    activated() {
      document.title = '日程'
    },
    deactivated() {
      document.title = "绿蜻蜓"
    },
  updated() {
    //  this.showDetailData();
  },
  data() {
    return {
      a: "",
      b: "",
      today: "",
      isWeek: true,
      //////////////
      currentMonth: new Date().format("yyyy年MM月"),
      maskHeight: "100px",
      listTitle: "本周日程安排",
      eventList: [],
      dayWeek: {
        0: "周日",
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六"
      },
      //////////////
      isActive: false,
      isTeach: true,
      demoEvents: [
        {
          date: "2018/10/30",
          title: ""
        },
        {
          date: "2018-10-31",
          title: ""
        },
        {
          date: "2018-11-1",
          title: ""
        }
      ],

      url: "",
      lastShow: false,
      wwwUrl: roterPath,

      navTitle: "",
      hasData: true,
      showDetail: true,
      detailList: [],
      listList: [],
      total: "",

      yearCode: "",
      wageID: "",

      titleName: "",
      titleHead: "",

      title: "查看课程表",
      value: [],
      addressData: [],
      showAddress: false,

      currtYear: "",
      currtMonth: "",

      storYear: "",
      storMonth: "",

      imgShow: false
    };
  },
  watch: {
    $route: function(e) {
      if (e.path == "/schedule") {
        var a = this.a;
        var b = this.b;
        if (!a) {
          var a = firstDayOfWeekWithoutTime(now);
          var b = nDayLaterWithoutTime(new Date(a.replace(/-/g, "/")), 6);
          this.a = a;
          this.b = b;
        }
        this.loadData(a, b);
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/');
    },
    goWeekList() {
      this.$router.push({ path: "schedule-week" });
    },
    goTypeList() {
      this.$router.push({ path: "schedule-type" });
    },
    sendNotice(e) {
      if (this.today) {
        this.$router.push({
          path: "schedule-add?type=" + e + "&date=" + this.today
        });
      } else {
        this.$router.push({ path: "schedule-add?type=" + e });
      }
      //this.$router.push({ path: "schedule-add?type=" +e});
      this.isActive = false;
    },
    typeBtn() {
      if (this.isActive === false) {
        this.isActive = true;
        var height =
          window.outerHeight > this.$el.offsetHeight
            ? window.outerHeight
            : this.$el.offsetHeight;
        this.maskHeight = height + "px";
      } else {
        this.isActive = false;
      }
    },
    typeSwitch(e) {
      this.isWeek = e.isWeek;
      if (!e.isWeek) {
        var first =
          this.currentMonth.replace("年", "-").replace("月", "-") + "01";
        var last = lastDayOfMonth(new Date(first));
        this.loadData(first, last.format("yyyy-MM-dd"));
        this.listTitle = "本月日程安排";
      } else {
        this.weekChange(new Date().format("yyyy-MM-dd"));
        this.listTitle = "本周日程安排";
      }
    },
    monthChange(month) {
      var first = month.replace("年", "-").replace("月", "-") + "01";
      var last = lastDayOfMonth(new Date(first));
      this.loadData(first, last.format("yyyy-MM-dd"));
      this.listTitle = "本月日程安排";
      this.currentMonth = month;
    },
    //周改变
    weekChange(today) {
      var a = firstDayOfWeek(new Date(today));
      var aa = firstDayOfWeek2(new Date(today)); //for:ios-bug
      var b = nDayLater(new Date(aa), 6);

      this.listTitle = "本周日程安排";
      this.currentMonth = new Date(today).format("yyyy年MM月");
      this.loadData(a, b);
    },
    dayChange(e) {
      this.listTitle = "当日安排";
      this.today = new Date(e.date).format("yyyy-MM-dd");
      this.loadData(new Date(e.date).format("yyyy-MM-dd"));
      /* if(e.events.length>0){

        }*/
    },
    //获取数据
    loadData(startTime, endTime) {
      var toast1 = Toast.loading({
        mask: true,
        message: "数据加载中...",
        duration: 0
      });
      if (!endTime) {
        endTime = startTime;
      }
      this.a = startTime;
      this.b = endTime;
      /*var s = new Date(startTime);
        var e = new Date(endTime);
        alert(startTime+"$$$$"+s);*/
      var _this = this;
      this.$http
        .get(
          apiRouter.GET_CALENDAR_DATA_LIST +
            "?startDate=" +
            startTime +
            "&endDate=" +
            endTime
        )
        .then(
          res => {
            toast1.clear();
            if (res.data.status == -1) {
              return;
            }
            //alert(JSON.stringify(res));
            _this.eventList = res.data.data.infoList;
            var actionDate = res.data.data.actionDate;

            if (startTime == endTime) {
            } else {
              var demoEvents = [];
              var demoEventsMap = {};
              for (var i = 0; i < _this.eventList.length; i++) {
                var date = new Date(
                  _this.eventList[i].startTime.replace(/-/g, "/")
                ).format("yyyy/MM/dd");
                if (!demoEventsMap[date]) {
                  demoEventsMap[date] = _this.eventList[i].content;
                }
              }
              for (var k in demoEventsMap) {
                var e = {
                  date: k,
                  title: "hehe"
                };
                demoEvents.push(e);
              }

              var eventPoints = [];
              for (var j = 0; j < actionDate.length; j++) {
                var date = new Date(actionDate[j]).format("yyyy/MM/dd");
                var e = {
                  date: date,
                  title: "point"
                };
                eventPoints.push(e);
              }
              this.demoEvents = eventPoints;
            }
          },
          error => {
            toast1.clear();
          }
        );
    },
    //跳转detail
    goDetail(e) {
      var detailStr = JSON.stringify(e);
      window.localStorage.setItem("scheduleDetail", detailStr);
      window.localStorage.setItem("scheduleFrom", "index");
      this.$router.push({
        path:
          "schedule-detail?id=" +
          e.id +
          "&typeCode=" +
          e.typeCode +
          "&typeId=" +
          e.typeId
      });
    },

    /////////////////////
    showDetailData() {
      var _this = this;
      var pathUrl =
        apiRouter.GET_WAGEINFO +
        "?" +
        "yearCode=" +
        this.yearCode +
        "&id=" +
        this.wageID;
      this.$http.get(pathUrl).then(
        response => {
          console.log("response", response);
          if (response.body.status === 200) {
            var _data = response.body.data;
            _this.showDetail = true;
            console.log("_data", _data);
            if (_data.has_wage === "1") {
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
              console.log("value", this.value);
              console.log("titleHead", this.titleHead);
            } else if (_data.has_wage === "0") {
              this.imgShow = true;
            }
          }
        },
        response => {
          Toast.fail("请求失败了!!!!");
          //      alert("请求失败了!!!!")
        }
      );
    },
    showListData() {
      var _this = this;
      var pathUrl = apiRouter.GET_WAGELIST + "?" + "yearCode=" + this.yearCode;
      this.$http.get(pathUrl).then(
        response => {
          if (response.status === 200) {
            var _data = response.body.data;
            _this.showDetail = false;
            _this.navTitle = _this.yearCode + "年全年";
            if (_data.has_wage !== 0) {
              _this.hasData = !!_data.list.length;
              _this.listList = _data.list;
              _this.total = _data.total;
            }
          }
        },
        response => {
          Toast.fail("请求失败了!!!!");

          //      alert("请求失败了!!!!")
        }
      );
    },
    getSelectDates: function(selectList) {
      var selList = [];
      selectList.map(item => {
        selList.push({
          name: item.YEAR_NAME,
          value: item.YEAR_CODE
        });
        item.WAGE_LIST.map(item_sub => {
          selList.push({
            name: item_sub.WAGE_NAME,
            value: item_sub.WAGE_ID,
            parent: item.YEAR_CODE
          });
        });
      });
      return selList;
    },
    goBack() {
      window.location.replace(roterPath + "/weixin/wechat/dist/index.jsp");
    },
    goToDetail() {
      this.$router.push({
        path: "payrolldetail"
      });
    },
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
          this.showDetailData();
        } else {
          this.showListData();
        }
      }
    },
    logShow(str) {
      console.log("on-show");
    },

    loadUrl() {
      if (location.href.indexOf("?reloaded=") == -1) {
        location.href = location.href + "?reloaded=";
        location.reload();
      }
    }
  }
};
</script>

<style lang="less" type="text/less" scoped>
@import "../../style/minxin.less";

.realContent {
  margin-top: 100 / @baseSize;
}

.title-header {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100 / @baseSize;
  line-height: 100 / @baseSize;
  z-index: 1000;
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

.mask-type-btn {
  width: 100%;
  position: absolute;
  top: 0;
}

.class-schedule {
  padding-left: 40 / @baseSize;
  padding-right: 40 / @baseSize;
  font-size: 15px;
}

.tag-pink {
  border-color: #ff6091;
}

.tag-orange {
  border-color: #ff7043;
}

.tag-yellow {
  border-color: #fff048;
}

.tag-green {
  border-color: #48b319;
}

.tag-blue {
  border-color: #5c6bc0;
}

.tag-red {
  border-color: #aa1a79;
}
.dates /deep/ .week-bg {
  background-color: #f4f9ee;
}

.__vev_calendar-wrapper /deep/ .events-wrapper {
  display: none;
}
.__vev_calendar-wrapper /deep/ .cal-body {
  font-size: 16px;
}

.__vev_calendar-wrapper /deep/ .is-event {
  //border-color: rgba(66,189,65,0.70) !important;
}

/*background-color: rgba(66,189,65,0.70);*/

.tag-height {
  line-height: 34px;
  margin: 5px 0;
  padding: 0 5px;
}
.tag-line {
  height: 34px;
  border-left: 4px solid;
  margin: 5px 0;
  padding: 0 5px;
  display: table-cell;
  vertical-align: middle;
}

.tag-orange {
  border-color: orange;
}

.double-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.box {
  height: 100%;
}

.back-div {
  padding-bottom: 100 / @baseSize;
}

.up-back {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  line-height: 100 / @baseSize;
  color: @white;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
}

.payroll-div {
  padding-bottom: 100 / @baseSize;
  position: relative;
  z-index: 100;
}

.payroll-title {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  //line-height: 100/@baseSize;
  line-height: 50px;
  color: @white;
  text-align: center;
  position: fixed;
  //top: 100/@baseSize;
  left: 0;
  z-index: 10;
}

.payroll-title h1 {
  display: flex;
  justify-content: space-between;
  padding-left: 40 / @baseSize;
  padding-right: 40 / @baseSize;
  border-bottom: 1px solid #aab2c0;
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
  color: #48b319;
  font-size: @fontSize30;
}

.payroll-list {
  width: 100%;
  padding-bottom: 100 / @baseSize;
}

.payroll-list li {
  display: flex;
  justify-content: space-between;
  line-height: 90 / @baseSize;
  padding-left: 40 / @baseSize;
  padding-right: 40 / @baseSize;
  box-sizing: border-box;
}

.payroll-list li span {
  font-size: @fontSize30;
  color: #666666;
}

.payroll-list li:nth-child(even) {
  background: #f4f9ee;
}

.payroll-list li i {
  display: inline;
  font-style: normal;
}

.payroll-list-d {
  width: 100%;
  padding-bottom: 100 / @baseSize;
}

.payroll-list-d li {
  display: flex;
  justify-content: space-between;
  padding-left: 40 / @baseSize;
  padding-right: 40 / @baseSize;
  box-sizing: border-box;
  padding-top: 20 / @baseSize;
  padding-bottom: 20 / @baseSize;
  flex-flow: row;
  font-size: @fontSize30;
}

.payroll-list-d li.negative i {
  color: #e51c23;
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
  background: #f4f9ee;
}

.payroll-list-d li i {
  display: inline;
  font-style: normal;
}

.payroll-bottom {
  width: 100%;
  height: 100 / @baseSize;
  font-size: @fontSize36;
  line-height: 100 / @baseSize;
  color: @white;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;

  background: #ffffff;
}

.payroll-bottom p {
  width: 100%;
  height: 100 / @baseSize;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #aab2c0;
  padding-left: 40 / @baseSize;
  padding-right: 40 / @baseSize;
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
  height: calc(100% - 500 / @baseSize);
}

.empty img {
  width: 208 / @baseSize;
  display: block;
}

.empty span {
  padding-top: 74 / @baseSize;
  font-size: @fontSize30;
  color: #bbbbbb;
}

.payroll-title .weui-cell {
  padding: 0;
}

.popup-style {
  background: red;
}

figure {
  display: block;
}

.user-type {
  position: absolute;
  width: 39 / @baseSize;
  height: 38 / @baseSize;
  top: 0.55rem;
}

.tab-btn {
  width: 100%;
  height: 100 / @baseSize;
  line-height: 100 / @baseSize;
  border-bottom: 1px solid #eee;
}
.tab-btn li {
  width: 100/3 * 1%;
  float: left;
  text-align: center;
  position: relative;
}
.tab-btn li p span {
  font-size: 36 / @baseSize;
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
  bottom: 2px;
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
  font-size: 30 / @baseSize;
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
  /* height: 180/@baseSize;*/
  text-align: center;
  box-sizing: border-box;
}
.iocn-list li a {
  display: block;
}

.iocn-list li[type="ZH"] img {
  width: 45 / @baseSize;
  height: 110 / @baseSize;
}

.link-class {
  height: 180 / @baseSize;
}
.icon {
  width: 45 / @baseSize;
  height: 110 / @baseSize;
}

.iocn-list .name {
  text-align: center;
  white-space: nowrap;
  height: 55 / @baseSize;
  line-height: 55 / @baseSize;
  font-size: 22 / @baseSize;
  color: @color42;
}

.messageBtn {
  width: 125 / @baseSize;
  height: 125 / @baseSize;
  line-height: 125 / @baseSize;
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize26;
  color: @white;
  position: fixed;
  bottom: 45 / @baseSize;
  left: 40 / @baseSize;
  background: #ff5e5e;
  z-index: 10;
}

.typeBtn {
  transition: All 0.4s ease-in-out;
  -webkit-transition: All 0.4s ease-in-out;
  -moz-transition: All 0.4s ease-in-out;
  -o-transition: All 0.4s ease-in-out;
  width: 90 / @baseSize;
  height: 90 / @baseSize;
  /*line-height: 87 / @baseSize;
    width: 32px;
    height: 32px;
    line-height: 26px;*/
  text-align: center;
  border-radius: 50%;
  font-size: @fontSize36;
  color: @green;
  position: fixed;
  bottom: 45 / @baseSize;
  right: 40 / @baseSize;
  background: @white;
  z-index: 10;
  /*border: 2px solid #48B319;*/
}
.typeBtn-click {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg) scale(1);
  -o-transform: rotate(45deg) scale(1);
  -ms-transform: rotate(45deg) scale(1);
}

.send {
  /*width: 100 / @baseSize;
    height: 100 / @baseSize;
    line-height: 100 / @baseSize;
    */
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-block;
  line-height: 16px;
  text-align: center;
  /*font-size: @fontSize24;*/
  font-size: 0.95em;
  color: @white;
  padding: 4px;
  font-weight: 300;
}
.send-notice,
.send-quest,
.send-vote,
.send-work {
  position: fixed;
  bottom: 43 / @baseSize;
  right: 37 / @baseSize;
  z-index: 5;
}
.send-notice {
  background: rgb(84, 179, 49);
  /*#ff5e5e;*/
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
    transform: translate(30 / @baseSchedule, -160 / @baseSchedule);
    -webkit-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(30 / @baseSchedule, -160 / @baseSchedule);
    -webkit-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(30 / @baseSchedule, -160 / @baseSchedule);
    -webkit-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(30 / @baseSchedule, -160 / @baseSchedule);
    -webkit-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(30 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -webkit-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -webkit-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -webkit-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -webkit-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -moz-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -o-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
    -ms-transform: translate(-85 / @baseSchedule, -150 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, -65 / @baseSchedule);
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
    transform: translate(-150 / @baseSchedule, 40 / @baseSchedule);
    -webkit-transform: translate(-150 / @baseSchedule, 40 / @baseSchedule);
    -moz-transform: translate(-150 / @baseSchedule, 40 / @baseSchedule);
    -o-transform: translate(-150 / @baseSchedule, 40 / @baseSchedule);
    -ms-transform: translate(-150 / @baseSchedule, 40 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
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
    transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -webkit-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -moz-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -o-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    -ms-transform: translate(-170 / @baseSchedule, 50 / @baseSchedule);
    opacity: 1;
  }
}

//执行动画
.activeSchedule {
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

.double-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 17px;
}
</style>
