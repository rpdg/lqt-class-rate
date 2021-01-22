<template>
  <div style="color: #414141;" class="hl">
    <van-nav-bar
      title="日程"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-cell title="日程分类" :value="typeMap[this.detail.typeCode]" @click="showType" clickable is-link/>


      <van-field
        v-model="detail.content"
        clearable
        label="日程内容"
        placeholder="请输入日程内容"
        type="textarea"
        rows="4"
        autosize
      >
        <div class="length-tips" slot="icon">
          {{contentLength}}/50
        </div>
      </van-field>


      <van-cell v-if="!(detail.typeCode=='T_NOTE')" title="开始时间" @click="showYear=true"       :value="detail.startTime"/>
      <van-cell v-if="!(detail.typeCode=='T_NOTE')" title="结束时间" @click="showEnd=true"        :value="detail.endTime"/>
      <van-cell v-if="!(detail.typeCode=='T_NOTE')" title="日程重复" @click="showRepeatPick"  :value="repeatType[this.detail.repeatCode]" is-link/>


      <van-field
        v-if="!(detail.typeCode=='T_NOTE')"
        v-model="detail.location"
        clearable
        label="日程地点"
        placeholder="请输入日程地点（选填）"
        type="textarea"
        rows="4"
        autosize
      >
        <div class="length-tips" slot="icon">
          {{locationLength}}/50
        </div>
      </van-field>
      <van-field
        v-if="!(detail.typeCode=='T_NOTE')"
        v-model="detail.desc"
        clearable
        label="日程说明"
        placeholder="请输入日程说明（选填）"
        type="textarea"
        rows="6"
        autosize
        style="padding-bottom: 15px;"
      >
        <!--<div class="length-tips" slot="icon">
          {{descLength}}/200
        </div>-->
      </van-field>
      <div v-if="!(detail.typeCode=='T_NOTE')" class="length-tips" style="bottom:0px;right: 15px;" >
        {{descLength}}/200
      </div>
    </van-cell-group>
    <div style="text-align: right;padding-right: 1rem;margin-top: 1rem;margin-bottom: 3rem">
      <van-button v-if="$route.query.id" @click="deleteDetail" size="normal" type="primary" style="background-color: #979797;border-color: #979797;width: 100px;" >删除</van-button>
      <van-button @click="save" size="normal" type="primary" style="width: 100px;" >提交</van-button>
    </div>
    <van-popup  v-model="typeShow" position="bottom">
      <van-picker
        ref="aaa"
        show-toolbar
        value-key="name"
        :columns="typeColumns"
        @cancel="typeShow = false"
        @confirm="typeConfirm"
      />
    </van-popup>

    <van-popup class="schedule-datetime-picker" v-model="showYear" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        @cancel="showYear = false"
        @confirm="startConfirm"
        :title="currentDate.format('yyyy-MM-dd hh:mm')"
      />
      <!--:formatter="formatter"-->
    </van-popup>

    <van-popup class="schedule-datetime-picker" v-model="showEnd" position="bottom">
      <van-datetime-picker
        v-model="currentDateAfter"
        type="datetime"
        @cancel="showEnd = false"
        @confirm="endConfirm"
        :title="currentDateAfter.format('yyyy-MM-dd hh:mm')"
      />
    </van-popup>

    <van-popup v-model="showRepeat" position="bottom">
      <van-picker
        ref="repeatPick"
        show-toolbar
        :columns="repeatColumns"
        @cancel="showRepeat = false"
        @confirm="repeatConfirm"
      />
    </van-popup>

    <van-dialog
      title=""
      id="schedule-dialog"
      class="dialog-btn"
      v-model="showDelete"
      confirmButtonText="确定"
      :showCancelButton="true"
      @confirm="sureDel"
    >
      <div style="text-align: center;font-size: 18px;padding: 1rem;">确定删除吗?</div>
    </van-dialog>
  </div>

</template>

<script type="es6">
  import apiRouter from "../../config/api.js"
  import Vue from 'vue';
  import {Field, Cell, Toast, Button, Popup, Picker, CellGroup,Dialog,NavBar} from 'vant';
   import DatetimePicker from '../../components/datetime-picker';
  import 'vant/lib/index.css';
  Vue.use(Dialog);
  export default {
    components: {
      [Field.name]: Field,
      [Cell.name]: Cell,
      [Toast.name]: Toast,
      [Button.name]: Button,
      [Popup.name]: Popup,
      [Picker.name]: Picker,
      [CellGroup.name]: CellGroup,
      [NavBar.name]: NavBar,

      [DatetimePicker.name]: DatetimePicker,
    },
    mounted() {
      this.typeShow = false;
      this.showRepeat = false;

      let para = this.$route.query;
      if (para.id) {
        this.loadData();
        this.beforeLoadData();
      }else {
        this.detail={
          typeCode: '',
            typeId: '',
            content: '',
            repeatCode: '0',
            startTime: '',
            endTime: '',
            location:'',
            desc:''
        };
        this.detail.typeCode = para.type;
        if(para.date){

         /* this.detail.startTime = para.date+' 08:00';
          this.detail.endTime = para.date+' 09:00';*/
          let dateStr = para.date;
          this.detail.startTime = dateStr+' 08:00';
          this.detail.endTime = dateStr+' 09:00';

          let dateNew =new Date(new Date(dateStr).setMinutes(0)); //.setHours(9);
          this.currentDate = dateNew;
          let dateNew2 = new Date(dateNew.getTime());
          dateNew2 = new Date(dateNew2.setHours(9));
          this.currentDateAfter = dateNew2;

        }else{
          let value = new Date();
          let time = value.getTime();
          let timeHourAfter = time + 3600000;
          let nextTime = new Date(timeHourAfter);
          this.detail.startTime = nextTime.format('yyyy-MM-dd hh')+":00";

          //let time2 = new Date(this.detail.startTime).getTime() ;
          let timeHourAfter2 = timeHourAfter + 3600000;
          let endTime = new Date(timeHourAfter2);
          this.detail.endTime = endTime.format('yyyy-MM-dd hh')+":00"; //todo
          //
          nextTime.setMinutes(0);
          endTime.setMinutes(0);
          this.currentDate = nextTime;
          this.currentDateAfter = endTime;
        }
        this.beforeLoadData();
      }
      //this.beforeLoadData();
    },
    watch:{
      "$route": function (e) {
        if(e.path == '/schedule-add'){
          let para = this.$route.query;
          if (para.id) {
            this.beforeLoadData();
            this.loadData();
          }else {
            this.detail={
              typeCode: '',
              typeId: '',
              content: '',
              repeatCode: '0',
              startTime: '',
              endTime: '',
              location:'',
              desc:''
            };
            this.detail.typeCode = para.type;
            if(para.date){

              let dateStr = para.date;
              this.detail.startTime = dateStr+' 08:00';
              this.detail.endTime = dateStr+' 09:00';

              let dateNew =new Date(new Date(dateStr).setMinutes(0)); //.setHours(9);
              this.currentDate = dateNew;
              let dateNew2 = new Date(dateNew.getTime());
              dateNew2 = new Date(dateNew2.setHours(9));
              this.currentDateAfter = dateNew2;
            }else{
              let value = new Date();
              let time = value.getTime();
              let timeHourAfter = time + 3600000;
              let nextTime = new Date(timeHourAfter);
              this.detail.startTime = nextTime.format('yyyy-MM-dd hh')+":00";

              let timeHourAfter2 = timeHourAfter + 3600000;
              let endTime = new Date(timeHourAfter2);
              this.detail.endTime = endTime.format('yyyy-MM-dd hh:mm');

              nextTime.setMinutes(0);
              endTime.setMinutes(0);
              this.currentDate = nextTime;
              this.currentDateAfter = endTime;
            }
            this.beforeLoadData();
          }

        }

      }
    },
    updated() {

    },
    data() {
      return {
        showDelete:false,
        //
        typeMap:{
          "T_USER":"个人日程",
          "T_OUT_SCHOOL": "校外课程",
          "T_BIRTHDAY": "生日提醒",
          "T_NOTE": "便笺",
        },
        repeatType:{
          '0':'不重复',
          'day':'每天重复',
          'week':'每周重复',
          'month':'每月重复',
          'year':'每年重复'
        },

        typeShow: false,
        typeColumns: [],

        showEnd: false,
        showYear: false,
        showRepeat: false,

        show: false,
        repeatColumns: [
          {text: '不重复', code: '0'},
          {text: '每天重复', code: 'day'},
          {text: '每周重复', code: 'week'},
          {text: '每月重复', code: 'month'},
          {text: '每年重复', code: 'year'}
        ],

        //日程对象
        typeName: '',
        repeatName: '',
        currentDate: new Date(),
        currentDateAfter: new Date(),
        detail: {
          typeCode: '',
          typeId: '',
          content: '',
          repeatCode: '0',
          startTime: '',
          endTime: '',
          location:'',
          desc:''
        },

      }
    },
    computed:{
      contentLength:function (e) {
        if(this.detail.content.length > 50){
          Toast.fail('日程内容最多为50字');
        }
        return this.detail.content.length;
      },
      locationLength:function (e) {
        if(this.detail.location.length > 50){
          Toast.fail('日程地点最多为50字');
        }
        return this.detail.location.length;
      },
      descLength:function (e) {
        if(this.detail.desc.length > 200){
          Toast.fail('日程说明最多为200字');
        }
        return this.detail.desc.length;
      }
    },

    methods: {
      onClickLeft(){
        this.$router.go(-1);
      },
      //显示日程分类pick
      showType() {
        //typePop.setIndexes(3);
        this.typeShow = true;
        setTimeout(()=>{
          if(this.detail.typeCode){
            let name = this.typeMap[this.detail.typeCode];
            this.$refs.aaa.setValues([name]);
          }
        },800)

      },
      //显示日程重复pick
      showRepeatPick() {
        //typePop.setIndexes(3);
        this.showRepeat = true;
        setTimeout(()=>{
          if(this.detail.repeatCode){
            let name = this.repeatType[this.detail.repeatCode];
            this.$refs.repeatPick.setValues([name]);
          }
        },800)

      },
      typeConfirm(value, index) {
        //debugger;
        //this.$refs.aaa.setValues([value.name]);
        this.detail.typeCode = value.code;
        this.detail.typeId = value.id;
        this.typeName = value.name;
        this.typeShow = false;
      },
      //
      startConfirm(value) {
        this.detail.startTime = value.format('yyyy-MM-dd hh:mm');
        let time = value.getTime();
        let timeHourAfter = time + 3600000;
        let endTime = new Date(timeHourAfter);
        this.detail.endTime = endTime.format('yyyy-MM-dd hh:mm');
        this.currentDateAfter = endTime;
        this.showYear = false;
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}`;//
        } else if (type === 'month') {
          return `${value}月`
        } else if (type === 'day') {
          return `${value}日`
        } else if (type === 'hour') {
          return `${value}点`
        } else {
          return `${value}分`
        }
      },
      endConfirm(value) {
        this.detail.endTime = value.format('yyyy-MM-dd hh:mm');
        this.showEnd = false;
      },
      //日程重复确认
      repeatConfirm(value, index) {
        this.repeatName = value.text;
        this.detail.repeatCode = value.code;
        this.showRepeat = false;
      },
      sorry() {
        Toast('暂无后续逻辑~');
      },

      /*formatterEnd(type, value) {
        if (type === 'hour') {
          return `${value}点`
        } else {
          return `${value}分`
        }
      },*/

      save() {
        let obj = this.detail;

        if(this.detail.content.length > 50){
          Toast.fail('日程内容最多为50字');
          return;
        }

        if(this.detail.location.length > 50){
          Toast.fail('日程地点最多为50字');
          return;
        }

        if(this.detail.desc.length > 200){
          Toast.fail('日程说明最多为200字');
          return;
        }

        console.log(this.detail);
        this.$http.post(apiRouter.POST_CALENDAR_SAVE,obj)
          .then(response => {
            if(response.data.code == 200){
              Toast.success('保存成功！');
              let second = 1;
              const timer = setInterval(() => {
                second--;
                if (second) {} else {
                  clearInterval(timer);
                  Toast.clear();
                  //A10934
                  /*this.$router.push({path:
                    "schedule?id="+response.data.data
                  +'&typeCode='+this.detail.typeCode
                  +'&typeId='+this.detail.typeId});*/
                  let detailStr = JSON.stringify(response.data.data);
                  window.localStorage.setItem('scheduleDetail',detailStr);
                  if(obj.id){
                    this.onClickLeft();
                  }else{
                    this.$router.push({path:
                      "schedule?id="+response.data.data
                      +'&typeCode='+this.detail.typeCode
                      +'&typeId='+this.detail.typeId});
                  }

                }
              }, 1000);
            }else{
              Toast.fail(response.data.message);
            }
          }, erro => {
          });
        /*const toast = Toast.success('保存成功！');

        */

      },
      //删除
      deleteDetail(){
        /*Dialog.confirm({
          title: '',
          message: '<div style="text-align: center;font-size: 18px">确定删除吗?</div>',
          confirmButtonText:'确定'
        }).then(() => {
          // on confirm
          this.sureDel();

        }).catch(() => {
          // on cancel

        });*/
        this.showDelete = true;

      },
      //确认删除
      sureDel(){
        let id = this.detail.id;
        //let typeCode = this.$route.query.typeCode;
        let typeId = this.detail.typeId;
        let typeCode = this.detail.typeCode;
        this.$http
          .get(apiRouter.GET_CALENDAR_DEL+"?eventId="+id
            +'&typeCode='+typeCode
            +'&typeId='+typeId)
          .then(response => {
            if (response.data.status == -1) {
              Dialog.alert({
                message: response.data.message
              }).then(() => {});
            } else {
              Toast.success(response.data.message);
              let second = 1;
              const timer = setInterval(() => {
                second--;
                if (second) {}
                else {
                  clearInterval(timer);
                  Toast.clear();
                  //this.$router.push({path: "schedule?typeCode="+typeCode});
                  let scheduleFrom =  window.localStorage.getItem('scheduleFrom');
                  if(scheduleFrom == 'type'){
                    this.$router.push({path: "schedule-type"});
                  }else{
                    this.$router.push({path: "schedule"});
                  }
                }
              }, 1000);
            }
          }, error => {

          });
      },

      //
      beforeLoadData(){
        let para = this.$route.query;
        let id = '';
        let _this = this;
        this.$http
          .get(apiRouter.GET_CALENDAR_TYPE+"?enable_add=1")
          .then(response => {
            let backData = response.data.data;
            _this.typeColumns = backData;
          }, error => {
          });

      },
      loadData(){
        this.id = this.$route.query.id;
        this.typeCode = this.$route.query.typeCode;
        this.typeId = this.$route.query.typeId;
        this.detail = JSON.parse(window.localStorage.getItem('scheduleDetail'));
        if(this.detail.startTime){
          this.currentDate      = new Date(this.detail.startTime.replace(/-/g, '/'));
          this.currentDateAfter = new Date(this.detail.endTime.replace(/-/g, '/'));
        }


        /*this.$http
          .get(apiRouter.GET_CALENDAR_DETAIL+"?eventId="+this.id
            +'&typeCode='+this.typeCode
            +'&typeId='+this.typeId)
          .then(response => {
            this.detail = response.data.data;
          }, error => {

          });*/
      },

    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../style/minxin.less';
  .van-cell:not(:last-child)::after{
    border-bottom-width: 0;
  }
  .van-cell{
    border-bottom: 1px solid #eee;
  }
  .length-tips{
    color: #979797;
    position: absolute;
    bottom: -6px;
    right: 0;
  }

  .dialog-btn /deep/ .van-button__text{
     color: #333;
  }
  .hl /deep/ .van-picker__confirm{
    color: #48B319;
  }
  .hl /deep/ .van-picker__cancel{
    color: #999;
  }
  .schedule-datetime-picker /deep/ .van-picker-column:first-child{
    display: none;
  }
  .schedule-datetime-picker /deep/ .van-picker-column:first-child + div {
    display: none;
  }
  .schedule-datetime-picker /deep/ .van-picker-column:first-child + div + div {
    display: none;
  }

  .schedule-datetime-picker /deep/ .van-picker-column:first-child + div + div {
    display: none;
  }

  .schedule-datetime-picker /deep/ .van-picker-column:first-child + div + div + div > ul {
    width: 155px;
    //display: none;
  }

  .schedule-datetime-picker /deep/ .van-picker__columns{
     overflow: hidden;
  }

  .schedule-datetime-picker /deep/ .van-picker-column{
    overflow: visible;
  }



  .schedule-datetime-picker /deep/ .van-picker-column__item--selected{
    color: #017afb;
    font-size: 1.2em;
    /*height: 60px !important;*/
  }
</style>
