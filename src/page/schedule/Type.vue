<template>
  <div style="color: #414141;overflow-y: hidden">
    <van-nav-bar
      title="日程"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <van-collapse class="type-collapse" v-model="activeNames" @change="changeAccordion" accordion>
      <!--<div >
        <span>{{item.name}}</span>
      </div>-->
      <van-collapse-item v-for="(item,index) in list" :key='index' :name="index" :is-link="false">
        <div slot="title">
          <van-icon name="calandar" :color="item.color" size="20px" style="margin-right: 10px" />
          {{item.name}}
          <span style="float: right">({{item.total}})</span>
        </div>
        <div ref="typeList" style="max-height: 450px;overflow-y: scroll">
          <div v-for="(subItem,subIndex) in subListInfo.pageInfo" :key='subIndex' @click="goDetail(subItem)">
            <van-row style="padding: 5px">
              <span v-if="subItem.startTime">
                <van-col v-if="!(subIndex>0 && new Date(subListInfo.pageInfo[subIndex-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(subItem.startTime.replace(/-/g, '/')).format('MM月dd日'))"  span="6" style="text-align: center">
                  <div>{{new Date(subItem.startTime.replace(/-/g, '/')).format('MM月dd日')}}</div>
                  <div style="color: #9EABBE;">{{ dayWeek[new Date(subItem.startTime.replace(/-/g, '/')).getDay()]}}</div>
                </van-col>

                <van-col v-if="!(subIndex>0 && new Date(subListInfo.pageInfo[subIndex-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(subItem.startTime.replace(/-/g, '/')).format('MM月dd日'))" span="14" style="border-bottom: 1px #ECF1F8 solid;" >
                  <div style="padding: 5px 0px;">
                    <div class="tag-line tag-pink" :style="'border-color:'+subItem.color" >
                      <span class="double-line" >{{subItem.content}}</span>
                    </div>
                  </div>
                </van-col>

                <van-col offset="6" v-if="(subIndex>0 && new Date(subListInfo.pageInfo[subIndex-1].startTime.replace(/-/g, '/')).format('MM月dd日') == new Date(subItem.startTime.replace(/-/g, '/')).format('MM月dd日'))" span="14" style="border-bottom: 1px #ECF1F8 solid;" >
                  <div style="padding: 5px 0px;">
                    <div class="tag-line tag-pink" :style="'border-color:'+subItem.color" >
                      <span class="double-line" >{{subItem.content}}</span>
                    </div>
                  </div>
                </van-col>

              </span>

              <!--便签模式-->
              <van-col v-show="!subItem.startTime" span="14" offset="6" style="border-bottom: 1px #ECF1F8 solid;" >
                <div style="padding: 5px 0px;">
                  <div class="tag-line tag-pink" :style="'border-color:'+subItem.color" >
                    <span class="double-line">{{subItem.content}}</span>
                  </div>
                </div>
              </van-col>

              <van-col v-show="!subItem.startTime" span="4" style="border-bottom: 1px #ECF1F8 solid;">
                  <div style="height: 34px;margin: 5px"></div>
              </van-col>

              <van-col v-show="subItem.startTime  && subItem.allDay==0" span="4" style="border-bottom: 1px #ECF1F8 solid;">
                <div  style="text-align: right;padding-right: 5px;color: #bbbbbb">{{ new Date(subItem.startTime.replace(/-/g, '/')).format('hh:mm')}}</div>
                <div  style="text-align: right;padding-right: 5px;color: #bbbbbb">{{new Date(subItem.endTime.replace(/-/g, '/')).format('hh:mm')}}</div>
              </van-col>

              <van-col span="4" v-show="subItem.startTime && subItem.allDay!=0" style="border-bottom: 1px #ECF1F8 solid;">
                <div v-show="subItem.allDay == '1'" style="text-align: right;padding-right: 5px;color: #bbbbbb;line-height: 44px;">
                  全天
                </div>
                <div v-show="subItem.allDay == '2'" style="text-align: right;padding-right: 5px;color: #bbbbbb;line-height: 44px;">
                  多天
                </div>
              </van-col>
            </van-row>

          </div>

          <div v-show="subListInfo.pageCount > subListInfo.pageIndex+1" @click="nextPage" style="text-align: center">
            <img style="width: 15px;margin-top: 10px;" src="../../assets/schedule/forward-double-arrow-angular-right-direction.png"/>
          </div>
        </div>


      </van-collapse-item>
    </van-collapse>
  </div>

</template>

<script type="es6">
  import apiRouter from "../../config/api.js"
  //import 'vant/lib/vant-css/index.css';
  import 'vant/lib/index.css';
  import dateUtils from "../../utils/DateUtils"

  import { Collapse, CollapseItem,Icon,Row, Col, Cell, CellGroup, Tag ,NavBar} from 'vant';

  export default {
    components: {
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      [Icon.name]: Icon,
      [Row.name]: Row,
      [Col.name]: Col,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Tag.name]: Tag,
      [NavBar.name]: NavBar

    },
    mounted() {
      this.loadData();
    },
    updated() {
      let typeList = this.$refs.typeList;
      if(typeList && typeList.length > 0){
        for(let i=0;i<typeList.length;i++){
          let tHeight = typeList[i].offsetHeight;
          if(tHeight>0){
            typeList[i].parentElement.parentElement.height = tHeight;
            typeList[i].parentElement.parentElement.style.height = tHeight+"px";

          }
        }
      }
    },
    watch:{
      "$route": function (e) {
        if(e.path == '/schedule-type'){
           this.loadData();
        }

      }
    },
    computed: {
      cut: function (e) {
        debugger;
        return "";
      }
    },

    data() {
      return {
        activeNames: '',
        list:[],
        subListInfo:{},
        dayWeek:{
          0:'周日',
          1:'周一',
          2:'周二',
          3:'周三',
          4:'周四',
          5:'周五',
          6:'周六',
        },
      }
    },

    methods: {
      onClickLeft(){
        this.$router.go(-1);
      },
      nextPage(e){
        let activeNames = this.activeNames;
        let type = this.list[activeNames];
        let pageIndex = this.subListInfo.pageIndex+1;
        if(pageIndex < this.subListInfo.pageCount){
          let _this = this;
          this.$http.get(apiRouter.GET_CALENDAR_DATA_BY_TYPE+'?typeCode='+type.code+"&typeId="+type.id+"&pageIndex="+pageIndex)
            .then(res => {
              let d = res.data.data;
              _this.subListInfo.pageIndex = d.pageIndex;
              _this.subListInfo.pageCount = d.pageCount;
              _this.subListInfo.pageInfo = _this.subListInfo.pageInfo.concat( d.pageInfo );
            },error =>{

            })
        }
      },
      changeAccordion(e){
        let _this = this;
        if(e || e=='0'){
          _this.subListInfo.pageInfo = [];
          let type = this.list[e];
          this.$http.get(apiRouter.GET_CALENDAR_DATA_BY_TYPE+'?typeCode='+type.code+"&typeId="+type.id+"&pageIndex=0")
            .then(res => {
              _this.subListInfo = res.data.data;
            },error =>{

          })
        }
      },
      goDetail(e){
        let detailStr = JSON.stringify(e);
        window.localStorage.setItem('scheduleDetail',detailStr);
        window.localStorage.setItem('scheduleFrom',"type");
        this.$router.push({path:
          "schedule-detail?id="+e.id
          +'&typeCode='+e.typeCode
          +'&typeId='+e.typeId});
      },
      loadData(){
        this.$http
          .get(apiRouter.GET_CALENDAR_ALL_TYPE_TOTAL)
          .then(response => {
            this.list = response.data.data;
            let activeNames = this.activeNames;
            this.changeAccordion(activeNames);
          }, error => {

          });
      }

    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';



  .type-collapse /deep/ .van-collapse-item__wrapper{
    max-height: 450px;
    overflow-y: scroll;
  }


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

  .tag-pink {
    border-color: #FF6091;
  }

  .tag-orange {
    border-color: #ff6e3a;
      /*#FF7043;*/

  }

  .tag-yellow {
    border-color: #FFF048;
  }

  .tag-green {
    border-color: #48B319;
  }

  .tag-blue {
    border-color: #5C6BC0;
  }

  .tag-red {
    border-color: #AA1A79;
  }

  .double-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 17px;
  }

  @font-face {
    font-family: 'custom-iconfont';
    src: url('../../assets/schedule/iconfont.ttf') format('truetype');
  }

  .van-icon {
    font-family: 'vant-icon', 'custom-iconfont' !important;
  }

  .van-icon-calandar:before {
    content: "\e684";
  }


</style>
