<template>
  <div style="color: #414141;">
      <x-header class="title-header" :left-options="{preventGoBack: true}"
                @on-click-back="onClickLeft">我的课表
      </x-header>
    <!--<div class="week-title">{{className}}第{{weekNum}}教学周（{{new Date(startDate).format('MM/dd')}}〜{{new Date(endDate).format('MM/dd')}}）</div>-->
    <div class="week-title" style="margin-top: 2rem">{{title}}</div>
    <vue-event-calendar-week v-if="show"
                        :events="demoEvents"
                        @month-changed="monthChange"
                        @dayChanged="dayChange"
                        @week-changed="weekChange"
                        showEvents="false"
                        :ifSwitch="false"
                        :eventClick="false"
                        :currentWeekClass="false"
                        :sundayFirstDay="sundayFirstDay"
    ></vue-event-calendar-week>
    <div style="padding: 0 7px;margin-top: -55px;">
      <table style='margin: 0 auto;width: 100%'>
        <tr>
          <td colspan="7" style="text-align: center;background: #E1E1E1;color: white;padding: 3px;font-size: 1.2em;">上&nbsp;&nbsp;&nbsp;午</td>
        </tr>
        <tr>
          <td class="double-col">{{viewData[0][0]?viewData[0][0].courseName:""}}</td>
          <td class="single-col">{{viewData[1][0]?viewData[1][0].courseName:""}}</td>
          <td class="double-col">{{viewData[2][0]?viewData[2][0].courseName:""}}</td>
          <td class="single-col">{{viewData[3][0]?viewData[3][0].courseName:""}}</td>
          <td class="double-col">{{viewData[4][0]?viewData[4][0].courseName:""}}</td>
          <td class="single-col">{{viewData[5][0]?viewData[5][0].courseName:""}}</td>
          <td class="double-col">{{viewData[6][0]?viewData[6][0].courseName:""}}</td>
        </tr>
       <tr>
          <td class="double-col">{{viewData[0][1]?viewData[0][1].courseName:""}}</td>
          <td class="single-col">{{viewData[1][1]?viewData[1][1].courseName:""}}</td>
          <td class="double-col">{{viewData[2][1]?viewData[2][1].courseName:""}}</td>
          <td class="single-col">{{viewData[3][1]?viewData[3][1].courseName:""}}</td>
          <td class="double-col">{{viewData[4][1]?viewData[4][1].courseName:""}}</td>
          <td class="single-col">{{viewData[5][1]?viewData[5][1].courseName:""}}</td>
          <td class="double-col">{{viewData[6][1]?viewData[6][1].courseName:""}}</td>
        </tr>
        <tr>
          <td class="double-col">{{viewData[0][2]?viewData[0][2].courseName:""}}</td>
          <td class="single-col">{{viewData[1][2]?viewData[1][2].courseName:""}}</td>
          <td class="double-col">{{viewData[2][2]?viewData[2][2].courseName:""}}</td>
          <td class="single-col">{{viewData[3][2]?viewData[3][2].courseName:""}}</td>
          <td class="double-col">{{viewData[4][2]?viewData[4][2].courseName:""}}</td>
          <td class="single-col">{{viewData[5][2]?viewData[5][2].courseName:""}}</td>
          <td class="double-col">{{viewData[6][2]?viewData[6][2].courseName:""}}</td>

        </tr>
        <tr>
          <td class="double-col">{{viewData[0][3]?viewData[0][3].courseName:""}}</td>
          <td class="single-col">{{viewData[1][3]?viewData[1][3].courseName:""}}</td>
          <td class="double-col">{{viewData[2][3]?viewData[2][3].courseName:""}}</td>
          <td class="single-col">{{viewData[3][3]?viewData[3][3].courseName:""}}</td>
          <td class="double-col">{{viewData[4][3]?viewData[4][3].courseName:""}}</td>
          <td class="single-col">{{viewData[5][3]?viewData[5][3].courseName:""}}</td>
          <td class="double-col">{{viewData[6][3]?viewData[6][3].courseName:""}}</td>

        </tr>
        <tr>
          <td colspan="7" style="text-align: center;background: #E1E1E1;color: white;padding: 3px;font-size: 1.2em;">下&nbsp;&nbsp;&nbsp;午</td>
        </tr>
        <tr>
          <td class="double-col">{{viewData[0][4]?viewData[0][4].courseName:""}}</td>
          <td class="single-col">{{viewData[1][4]?viewData[1][4].courseName:""}}</td>
          <td class="double-col">{{viewData[2][4]?viewData[2][4].courseName:""}}</td>
          <td class="single-col">{{viewData[3][4]?viewData[3][4].courseName:""}}</td>
          <td class="double-col">{{viewData[4][4]?viewData[4][4].courseName:""}}</td>
          <td class="single-col">{{viewData[5][4]?viewData[5][4].courseName:""}}</td>
          <td class="double-col">{{viewData[6][4]?viewData[6][4].courseName:""}}</td>

        </tr>
         <tr>
           <td class="double-col">{{viewData[0][5]?viewData[0][5].courseName:""}}</td>
           <td class="single-col">{{viewData[1][5]?viewData[1][5].courseName:""}}</td>
           <td class="double-col">{{viewData[2][5]?viewData[2][5].courseName:""}}</td>
           <td class="single-col">{{viewData[3][5]?viewData[3][5].courseName:""}}</td>
           <td class="double-col">{{viewData[4][5]?viewData[4][5].courseName:""}}</td>
           <td class="single-col">{{viewData[5][5]?viewData[5][5].courseName:""}}</td>
           <td class="double-col">{{viewData[6][5]?viewData[6][5].courseName:""}}</td>

         </tr>

        <tr>
          <td class="double-col">{{viewData[0][6]?viewData[0][6].courseName:""}}</td>
          <td class="single-col">{{viewData[1][6]?viewData[1][6].courseName:""}}</td>
          <td class="double-col">{{viewData[2][6]?viewData[2][6].courseName:""}}</td>
          <td class="single-col">{{viewData[3][6]?viewData[3][6].courseName:""}}</td>
          <td class="double-col">{{viewData[4][6]?viewData[4][6].courseName:""}}</td>
          <td class="single-col">{{viewData[5][6]?viewData[5][6].courseName:""}}</td>
          <td class="double-col">{{viewData[6][6]?viewData[6][6].courseName:""}}</td>
        </tr>

        <tr>
          <td class="double-col">{{viewData[0][7]?viewData[0][7].courseName:""}}</td>
          <td class="single-col">{{viewData[1][7]?viewData[1][7].courseName:""}}</td>
          <td class="double-col">{{viewData[2][7]?viewData[2][7].courseName:""}}</td>
          <td class="single-col">{{viewData[3][7]?viewData[3][7].courseName:""}}</td>
          <td class="double-col">{{viewData[4][7]?viewData[4][7].courseName:""}}</td>
          <td class="single-col">{{viewData[5][7]?viewData[5][7].courseName:""}}</td>
          <td class="double-col">{{viewData[6][7]?viewData[6][7].courseName:""}}</td>
        </tr>

        <tr>
          <td class="double-col">{{viewData[0][8]?viewData[0][8].courseName:""}}</td>
          <td class="single-col">{{viewData[1][8]?viewData[1][8].courseName:""}}</td>
          <td class="double-col">{{viewData[2][8]?viewData[2][8].courseName:""}}</td>
          <td class="single-col">{{viewData[3][8]?viewData[3][8].courseName:""}}</td>
          <td class="double-col">{{viewData[4][8]?viewData[4][8].courseName:""}}</td>
          <td class="single-col">{{viewData[5][8]?viewData[5][8].courseName:""}}</td>
          <td class="double-col">{{viewData[6][8]?viewData[6][8].courseName:""}}</td>
        </tr>
      </table>
    </div>
  </div>

</template>

<script type="es6">
  import apiRouter from "../../config/api.js"
  import {Toast,NavBar} from 'vant';
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import {XHeader} from 'vux'

  import {firstDayOfWeek,nDayLater,firstDayOfMonth,lastDayOfMonth,formatDate} from "../../utils/DateUtils"


  import {Collapse, CollapseItem} from 'vant';


  export default {
    components: {
        XHeader,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [NavBar.name]: NavBar,
      [Toast.name]: Toast,
    },
    created(){
      this.$http.get(apiRouter.GET_CALENDAR_WEEKSTART+"?"+new Date().getTime())
        .then(res => {
          if(res.data.data == '1'){
            this.sundayFirstDay = false;
            this.show=true;
          }else{
            this.sundayFirstDay = true;
            this.show=true;
          }
        },error =>{

        })

    },
    mounted() {
      /*this.sundayFirstDay = false;
      this.show=true;*/
      let now = new Date();
      //let a = firstDayOfWeek(now);
      //let b = nDayLater(new Date(a),6);
      this.loadWeekNum(now);
      //this.loadData(1);
    },
    activated() {
      document.title = '课程表'
    },
    deactivated() {
      document.title = "绿蜻蜓"
    },
    updated() {

    },
    data() {
      return {
        isWeek:true,
        show:false,
        sundayFirstDay:false,
        title:"",

        className:'',
        weekNum:1,
        startDate:new Date().format('yyyy-MM-dd'),
        endDate:new Date().format('yyyy-MM-dd'),
        demoEvents: [],
        viewData:{
          0:[],
          1:[],
          2:[],
          3:[],
          4:[],
          5:[],
          6:[]
        },
      }
    },
    watch: {
      // 如果 `question` 发生改变，这个函数就会运行
      weekNum: function (newQuestion, oldQuestion) {
        this.loadData(newQuestion);
      },
    },
    methods: {
      onClickLeft(){
        this.$router.go(-1);
      },
      monthChange(month) {
        console.log(month)
      },
      dayChange(day) {
        console.log(day)
      },
      weekChange(today,next){
        if(next){
          this.weekNum = Number(this.weekNum) +1;
        }else{
          this.weekNum = Number(this.weekNum) -1;
        }
        //debugger;
        /*let a =  this.startDate;
        this.startDate = today.format('yyyy-MM-dd');
        this.endDate  = nDayLater(today,6);
        */
      },
      //获取数据
      loadData(e){
        let toast1 = Toast.loading({
          mask: true,
          message: '数据加载中...',
          duration: 0
        });
        let _this = this;
        this.$http.post(apiRouter.GET_CALENDAR_KBWEEKDETAIL,
          {weekNO:e}
          ).then(res => {
            toast1.clear();
            //debugger;
            if(res.data.code == '200'){
              _this.title = res.data.data.title;
              let d = _this.fmtData(res.data.data.infoList);
              _this.viewData = d;
              for(let k in d){
                for(let j=0;j<d[k].length;j++){
                  if(d[k][j] && d[k][j].className){
                    _this.className = d[k][j].className;
                    return;
                  }
                }
              }
            }else {

            }
          },error =>{
            toast1.clear();
          })
      },

      loadWeekNum(date){
        let _this = this;
        this.$http.get(apiRouter.GET_CALENDAR_KBWEEKBYDATE
          +'?date='+ formatDate('yyyy-MM-dd', date))
          .then(res => {
            if(res.data.status == '200'){
              let data = res.data.data;
              _this.weekNum = data.weekNO;
              _this.startDate = data.startDate;
              _this.endDate = data.endDate;
            }else{

            }
          },error =>{

          })
      },
      fmtData(e){
        let dataView = {
          0:[],
          1:[],
          2:[],
          3:[],
          4:[],
          5:[],
          6:[]
        };
        let p = 1;
        //如果第一天是周日，则差值没0
        if(this.sundayFirstDay){
          p = 0;
        }
        for(let k in e){
          dataView[new Date(k).getDay()-p]=e[k];
        }
        //debugger;
        return dataView;
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';
  .__vev_calendar-wrapper /deep/ .events-wrapper {
    display: none;
  }

  .week-title {
    margin: 0 auto;
    width: 95%;
    line-height: 2rem;
    text-align: center;
    border-bottom: 1px solid #333333 ;
  }
  td{
    width: 14.285%;
    padding: 5px 1px;
    border: 1px solid white;
    text-align: center;
    height: 35px;
    font-size: 12px;
  }
  .single-col{
    background-color: #F1F1F1;
  }
  .double-col{
    background-color: #F4F9EE;
  }

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

</style>
