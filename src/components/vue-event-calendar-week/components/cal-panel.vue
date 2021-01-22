<template>
  <div class="cal-wrapper">
    <div class="cal-header" v-if="showClick">
      <div class="l" @click="preMonth"><div class="arrow-left icon">&nbsp</div></div>
      <div class="title">{{curYearMonth}}</div>
      <div class="r" @click="nextMonth"><div class="arrow-right icon">&nbsp</div></div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span
          v-if="sundayFirstDay"
          v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames"
          class="item"
          :key="dayIndex"
        >
          {{i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7]}}
        </span>

        <span
          v-if="!sundayFirstDay"
          v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNamesFirst"
          class="item"
          :key="dayIndex"
        >
          {{i18n[calendar.options.locale].dayNamesFirst[(dayIndex + calendar.options.weekStartOn) % 7]}}
        </span>
      </div>
      <div class="dates" >
        <div v-for="date in dayList" class="item"
             :class="[{
            today: date.status ? (today == date.date) : false,
            event: date.status ? (date.title != undefined) : false,
            [calendar.options.className] : (date.date == selectedDay)
          }, ...date.customClass]"
             :key="date.date"
        >
          <p class="date-num"
             @click="handleChangeCurday(date)"
             :style="{color: date.title != undefined ? ((date.date == selectedDay) ? '#fff' : 'inherit') : 'inherit'}">
            <!--            :style="{color: date.title != undefined ? ((date.date == selectedDay) ? '#fff' : customColor) : 'inherit'}">-->

            {{date.status ? date.date.split('/')[2] : '&nbsp'}}</p>

          <span v-if="date.status ? (today == date.date) : false" class="" :style="{backgroundColor: customColor }" ></span>
          <!--          <span v-if="date.status ? (today == date.date) : false" class="is-today" :style="{backgroundColor: customColor }" ></span>-->

          <span v-if="date.status ? (date.title != undefined) : false" class="is-event is-today">

          </span>
          <span v-if="date.title==undefined" class="is-undefined"></span>
          <!--:style="{borderColor: customColor, backgroundColor: customColor ? customColor : 'inherit'}"-->
          <!--:style="{borderColor: customColor, backgroundColor: (date.date == selectedDay) ? customColor : 'inherit'}"></span>-->
        </div>
      </div>

      <img v-if="ifSwitch" @click="switchType" :class="isWeek?'arrow-down':'arrow-up'" src="../../../assets/schedule/forward-double-arrow-angular-right-direction.png"/>

    </div>
  </div>
</template>

<script>
  import i18n from '../i18n.js'
  import { dateTimeFormatter, isEqualDateStr} from '../tools.js'

  const inBrowser = typeof window !== 'undefined'
  export default {
    name: 'cal-panel',
    data () {
      return {
        i18n
      }
    },
    props: {
      events: {
        type: Array,
        required: true
      },
      calendar: {
        type: Object,
        required: true
      },
      selectedDay: {
        type: String,
        required: false
      },
      isWeek:{
        type:Boolean,
        default:false,
      },
      showClick:{
        type:Boolean,
        default:false,
      },
      ifSwitch:{
        type:Boolean,
        default:true,
      },
      eventClick:{
        type:Boolean,
        default:true,
      },
      currentWeekClass:{
        type:Boolean,
        default:true,
      },
      //第一天是否为周日（true：周日为第一天，false：周一为第一天）
      sundayFirstDay:{
        type:Boolean,
        default:true,
      }
    },
    computed: {
      dayList () {
        return this.monthItems;

      },
      monthItems () {
        let referenceDate = this.calendar.params.referenceDate;
        let dayOfWeek = referenceDate.getDay();
        if (this.calendar.options.weekStartOn > dayOfWeek) {
          if(this.sundayFirstDay){
            dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
          }else{
            dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 6
          }
        } else {
          if(this.sundayFirstDay){
            dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
          }else{
            dayOfWeek = dayOfWeek - (this.calendar.options.weekStartOn+1)

          }
        }

        let startDate = referenceDate;
        startDate.setDate(referenceDate.getDate() - dayOfWeek)
        let item, status, tempArr = [], tempItem
        for (let i = 0 ; i < 8 ; i++) {
          item = new Date(startDate);
          item.setDate(startDate.getDate() + i);
          status = 1
          /*if (this.calendar.params.curMonth === item.getMonth()) {
            status = 1
          } else {
            status = 0
          }*/
          if(i==7){
            status = 0;
          }
          tempItem = {
            date: `${item.getFullYear()}/${item.getMonth()+1}/${item.getDate()}`,
            status: status,
            customClass: []
          }

          this.events.forEach((event) => {
            if (isEqualDateStr(event.date, tempItem.date)) {
              tempItem.title = event.title
              tempItem.desc = event.desc || ''
              if (event.customClass) tempItem.customClass.push(event.customClass)
            }
          })
          tempArr.push(tempItem)
        }
        return tempArr
      },
      today () {
        let dateObj = new Date()
        return `${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`
      },
      curYearMonth () {
        let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`))
        return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
      },
      customColor () {
        return this.calendar.options.color
      }
    },
    methods: {
      switchType(){
        //this.isWeek = this.isWeek?false:true;
        this.$emit('switch-type',{isWeek:this.isWeek?false:true});
      },
      nextMonth () {
        this.$EventCalendarWeek.nextWeek();
        this.$emit('week-changed', this.calendar.params.referenceDate,true);
      },
      preMonth () {
        this.$EventCalendarWeek.preWeek();
        this.$emit('week-changed', this.calendar.params.referenceDate,false);
      },
      handleChangeCurday (date) {
        if(this.eventClick && date.status){
          this.$emit('cur-day-changed', date.date)
        }
      }
    },
    mounted(){

      let _this = this;
      let calendarElement=  document.getElementsByClassName('cal-body')[0];
      var startx, starty;
      //获得角度
      function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
      };

      //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
      function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;

        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
          return result;
        }

        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
          result = 1;
        } else if (angle > 45 && angle < 135) {
          result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 3;
        } else if (angle >= -45 && angle <= 45) {
          result = 4;
        }

        return result;
      }
      //手指接触屏幕
      calendarElement.addEventListener("touchstart", function(e){
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
      }, false);
      //手指离开屏幕
      calendarElement.addEventListener("touchend", function(e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
          case 0:
            //alert("未滑动！");
            break;
          case 1:
            //alert("向上！");
            break;
          case 2:
            //alert("向下！");
            break;
          case 3:
            //alert("向左！");
            _this.nextMonth();
            break;
          case 4:
            //alert("向右！");
            _this.preMonth();
            break;
          default:
        }
      }, false);
    }
  }
</script>
<style>
  .arrow-down{
    position: absolute;
    width: 0.6rem;
    bottom: 30px;
    left: 47.5%;
    z-index: 99;
  }
  .arrow-up{
    position: absolute;
    width: 0.6rem;
    bottom: 30px;
    left: 47.5%;
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* Internet Explorer */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); /* Opera */
  }
  .week-bg{
    background-color: #F4F9EE;
  }
  .today{
    color: rgb(66, 189, 65);
  }
</style>
