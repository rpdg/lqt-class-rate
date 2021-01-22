<template>
  <picker
    ref="picker"
    :title="title"
    :columns="columns"
    :item-height="itemHeight"
    :show-toolbar="showToolbar"
    :visible-item-count="visibleItemCount"
    :confirm-button-text="confirmButtonText"
    :cancel-button-text="cancelButtonText"
    @change="onChange"
    @confirm="onConfirm"
    @cancel="$emit('cancel')"
  />
</template>

<script>
  import Picker from '../picker';
  import create from '../vant/lib/utils/create';
  import { range } from '../vant/lib/utils';

  const currentYear = new Date().getFullYear();
  const isValidDate = date => Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());


  export default create({
    name: 'datetime-picker',

    components: {
      Picker
    },

    props: {
      value: {},
      title: String,
      itemHeight: Number,
      visibleItemCount: Number,
      confirmButtonText: String,
      cancelButtonText: String,
      type: {
        type: String,
        default: 'datetime'
      },
      showToolbar: {
        type: Boolean,
        default: true
      },
      format: {
        type: String,
        default: 'YYYY.MM.DD HH时 mm分'
      },
      formatter: {
        type: Function,
        default: (type, value) => value
      },
      minDate: {
        type: Date,
        default: () => new Date(currentYear - 10, 0, 1),
        validator: isValidDate
      },
      maxDate: {
        type: Date,
        default: () => new Date(currentYear + 10, 11, 31),
        validator: isValidDate
      },
      minHour: {
        type: Number,
        default: 0
      },
      maxHour: {
        type: Number,
        default: 23
      },
      minMinute: {
        type: Number,
        default: 0
      },
      maxMinute: {
        type: Number,
        default: 59
      }
    },

    data() {
      return {
        showValue: this.correctValue(this.value),
        innerValue: this.correctValue(this.value),
        weekDay : {
          0:'星期日',
          1:'星期一',
          2:'星期二',
          3:'星期三',
          4:'星期四',
          5:'星期五',
          6:'星期六',
        },
        pm:false,
      };
    },

    watch: {
      value(val) {
        val = this.correctValue(val);
        const isEqual = this.type === 'time' ? val === this.innerValue : val.valueOf() === this.innerValue.valueOf();
        if (!isEqual) this.innerValue = val;
      },

      innerValue(val) {
        this.$emit('input', val);
      },

      columns() {
        this.updateColumnValue(this.innerValue);
      }
    },

    computed: {
      ranges() {
        if (this.type === 'time') {
          return [
            {
              type: 'hour',
              range: [this.minHour, this.maxHour]
            },
            {
              type: 'minute',
              range: [this.minMinute, this.maxMinute]
            }
          ];
        }

        let { maxYear, maxDate, maxMonth, maxHour, maxMinute } = this.getBoundary('max', this.innerValue);
        let { minYear, minDate, minMonth, minHour, minMinute } = this.getBoundary('min', this.innerValue);
        let yearDay = [];

        for(let i =0; i<maxMonth; i++){
          const boundaryNew = this[`maxDate`];
          const yearNew = this.innerValue.getFullYear();
          //boundaryNew.getFullYear();
          let maxDayNew =  this.getMonthEndDay(yearNew, i + 1);
          for(let j=1; j <= maxDayNew; j++){
            let currentDay = new Date(yearNew,i,j);
            yearDay.push(i+1+"月"+j+"日"+this.weekDay[currentDay.getDay()]);
          }
        }
        /*let hoursNew =  this.innerValue.getHours();
        if(hoursNew > 11){
          minHour = 12 ;
          maxHour = 23
        }else {
          minHour = 0;
          maxHour = 11
        }*/

        if(this.innerValue.getHours()>12){
          minHour = 1;
          maxHour = 11;
        }else{
          minHour = 0;
          maxHour = 12;
        }

        const result = [
          {
            type: 'year',
            range: [minYear, maxYear]
          },
          {
            type: 'month',
            range: [minMonth, maxMonth]
          },
          {
            type: 'day',
            range: [minDate, maxDate]
          },
          {
            type: 'yearDay',
            range: yearDay
          },
          {
            type: 'hourDay',
            range: [1, 2]
          },
          {
            type: 'hour',
            range: [minHour, maxHour]
          },
          {
            type: 'minute',
            range: [minMinute, maxMinute]
          }
        ];

        if (this.type === 'date') result.splice(3, 2);
        if (this.type === 'year-month') result.splice(2, 3);
        return result;
      },

      columns() {
        const results = this.ranges.map(({ type, range }) => {
          if(type == 'yearDay'){
            return {values:range};
          }
          let values = this.times(range[1] - range[0] + 1, index => {

            let value = range[0] + index;
            value = value < 10 ? `0${value}` : `${value}`;
            if(type === 'hourDay'){
              if(value == '01'){
                return '上午';
              }
              if(value == '02'){
                return '下午';
              }
            }
            return this.formatter(type, value);
          });
          let newArray = [];
          //五分钟一个间隔
          if(type == 'minute'){
            for(let i=0;i<values.length;i++){
              if(values[i]%5 == 0){
                newArray.push(values[i]);
              }
            }
            values = newArray;
          }
          return {
            values
          };
        });

        return results;
      }
    },

    methods: {
      pad(val) {
        return `00${val}`.slice(-2);
      },

      //修正值
      correctValue(value) {
        // validate value
        const isDateType = this.type !== 'time';
        if (isDateType && !isValidDate(value)) {
          value = this.minDate;
        } else if (!value) {
          const { minHour } = this;
          value = `${minHour > 10 ? minHour : '0' + minHour}:00`;
        }

        // time type
        if (!isDateType) {
          let [hour, minute] = value.split(':');
          hour = this.pad(range(hour, this.minHour, this.maxHour));
          minute = this.pad(range(minute, this.minMinute, this.maxMinute));

          return `${hour}:${minute}`;
        }

        // date type
        const { maxYear, maxDate, maxMonth, maxHour, maxMinute } = this.getBoundary('max', value);
        const { minYear, minDate, minMonth, minHour, minMinute } = this.getBoundary('min', value);
        const minDay = new Date(minYear, minMonth - 1, minDate, minHour, minMinute);
        const maxDay = new Date(maxYear, maxMonth - 1, maxDate, maxHour, maxMinute);
        value = Math.max(value, minDay);
        value = Math.min(value, maxDay);
        //debugger;
        return new Date(value);
      },

      times(n, iteratee) {
        let index = -1;
        const result = Array(n);

        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      },

      getBoundary(type, value) {
        const boundary = this[`${type}Date`];
        const year = boundary.getFullYear();
        let month = 1;
        let date = 1;
        let hour = 0;
        let minute = 0;

        if (type === 'max') {
          month = 12;
          date = this.getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
          hour = 23;
          minute = 59;
        }

        if (value.getFullYear() === year) {
          month = boundary.getMonth() + 1;
          if (value.getMonth() + 1 === month) {
            date = boundary.getDate();
            if (value.getDate() === date) {
              hour = boundary.getHours();
              if (value.getHours() === hour) {
                minute = boundary.getMinutes();
              }
            }
          }
        }

        return {
          [`${type}Year`]: year,
          [`${type}Month`]: month,
          [`${type}Date`]: date,
          [`${type}Hour`]: hour,
          [`${type}Minute`]: minute
        };
      },

      getTrueValue(formattedValue) {
        if (!formattedValue) return;
        while (isNaN(parseInt(formattedValue, 10))) {
          formattedValue = formattedValue.slice(1);
        }
        return parseInt(formattedValue, 10);
      },

      getMonthEndDay(year, month) {
        return 32 - new Date(year, month - 1, 32).getDate();
      },

      onConfirm() {
        this.$emit('confirm', this.innerValue);
      },

      onChange(picker,a,b,c) {
        const values = picker.getValues();
        let value;

        if (this.type === 'time') {
          value = values.join(':');
        } else {
          let year = this.getTrueValue(values[0]);
          if(b == 3 && c){
            if(c == -1){
              year = year - 1;
            }else{
              year = year + 1;
            }
          }
          //const year = this.getTrueValue(values[0]);
          let month = this.getTrueValue(values[1]);
          const maxDate = this.getMonthEndDay(year, month);
          let date = this.getTrueValue(values[2]);
          if (this.type === 'year-month') {
            date = 1;
          }
          date = date > maxDate ? maxDate : date;
          let hour = 0;
          let minute = 0;
          if (this.type === 'datetime') {
            hour = this.getTrueValue(values[5]); //todo
            minute = this.getTrueValue(values[6]);
            //上午下午
            let hourDay =  values[4];

            if(hourDay == "下午"){
              if(hour == 12 ){
                hour = 11;
              }
              if(hour == 0){
                hour = 1
              }
              hour=hour+12;
            }
            /*if(hourDay == '上午' && hour > 11){
              hour=0;
            }
            if(hourDay == '下午' && hour < 12){
              hour=12;
            }*/
            let yearDay =  values[3];
            let newMonth = yearDay.substring(0,yearDay.indexOf("月"));
            let newDay = yearDay.substring(yearDay.indexOf("月")+1,yearDay.indexOf("日"));
            month = this.getTrueValue(newMonth);
            date = this.getTrueValue(newDay);
          }
          value = new Date(year, month - 1, date, hour, minute);
        }
        value = this.correctValue(value);
        this.innerValue = value;

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$emit('change', picker);
          });
        });
      },

      updateColumnValue(value) {
        let values = [];
        const { formatter, pad } = this;

        if (this.type === 'time') {
          const currentValue = value.split(':');
          values = [
            formatter('hour', currentValue[0]),
            formatter('minute', currentValue[1])
          ];
        } else {
          values = [
            formatter('year', `${value.getFullYear()}`),
            formatter('month', pad(value.getMonth() + 1)),
            formatter('day', pad(value.getDate()))
          ];
          if (this.type === 'datetime') {
            //debugger;
            let hourDay = '上午';
            /*if(value.getHours() > 12){
              hourDay = '下午';
            }*/
            let newHours = value.getHours();
            if(value.getHours() > 12){
              hourDay = '下午';
              newHours = newHours - 12;
            }
            //当前天
            let newDay = new Date(values[0],values[1]-1,values[2]);
            //
            values.push( value.getMonth() + 1+"月"+value.getDate()+"日"+this.weekDay[newDay.getDay()]);

            values.push(hourDay);
            /*if(hourDay == '下午'){
              values.push(）
            }*/
            values.push(
              formatter('hour', pad(newHours)),
              formatter('minute', pad(value.getMinutes()))
            );
          }
          if (this.type === 'year-month') {
            values = values.slice(0, 2);
          }
        }

        this.$nextTick(() => {
          this.$refs.picker.setValues(values);
        });
      }
    },

    mounted() {
      this.updateColumnValue(this.innerValue);
    }
  })
</script>
