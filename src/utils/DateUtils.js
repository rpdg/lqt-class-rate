/**
 * Created by lume on 2017/10/22.
 */

export function getSelectDates(days = 7) {
  let dates = [];
  let currDate = new Date();
  for (let i = 0; i < days; i++) {
    let nextDate = new Date(currDate);
    nextDate.setDate(currDate.getDate() + (i));
    let date = {};
    if (i === 0) {
      date['name'] = '今天';
      date['value'] = '' + currDate.getTime();
      date['date'] = currDate;
    } else if (i === 1) {
      date['name'] = '明天';
      date['value'] = '' + nextDate.getTime();
      date['date'] = nextDate;
    } else {
      date['name'] = formatDate('yyyy-MM-dd', nextDate);
      date['value'] = '' + nextDate.getTime();
      date['date'] = nextDate;
    }
    dates.push(date);
    //计算当天右边数据
    if (i === 0) {
      let oneResults = getDataAtOne(date);
      //console.log(oneResults);
      dates.push(...oneResults);
    }
    //计算当天之后右边数据
    for (let j = 0; j < 12; j++) {
      let rightData = {};
      if (i !== 0) {
        let currTime = 8 + j;
        currTime = currTime < 10 ? '0' + currTime + ':00' : currTime + ':00';
        rightData['name'] = currTime;
        rightData['value'] = currTime;
        rightData['parent'] = '' + date.value;
        dates.push(rightData);
      }
    }
  }
  return dates;
}

function getDataAtOne(date) {
  let results = [];
  let currDate = new Date();
  let currHour = currDate.getHours();
  let currMinute = currDate.getMinutes();
  let isOver = (currHour > 19) || (currHour === 19 && currMinute > 0) || (currHour < 7) || (currHour === 7 && currMinute === 0);
  if (isOver) {
    let rightData = {};
    rightData['name'] = '立刻发送';
    rightData['value'] = formatDate('hh:mm');
    rightData['parent'] = '' + date.value;
    results.push(rightData);
  } else {
    for (let i = currHour; i < 20; i++) {
      let rightData = {};
      if (i === currHour) {
        rightData['name'] = '立刻发送';
        rightData['value'] = formatDate('hh:mm');
      } else {
        let currTime = i;
        currTime = currTime < 10 ? '0' + currTime + ':00' : currTime + ':00';
        rightData['name'] = currTime;
        rightData['value'] = currTime;
      }
      rightData['parent'] = '' + date.value;
      results.push(rightData);
    }
  }
  return results;
}

//转换成日期
export function formatDate(format1 = 'yyyy-MM-dd hh:mm:ss', timestamp = new Date()) {
  try {
    timestamp = timestamp.getTime();
    let date = new Date();
    date.setTime(timestamp);
    return date.format(format1);//2014-07-10 10:21:12
  } catch (erro) {
    return '';
  }
  return '';
}


//时间处理
Date.prototype.format = function (format) {
  let date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

//本周第一天
export function firstDayOfWeek(date){
  date.setDate(date.getDate() - date.getDay());
  var begin = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00";
  return begin;
}

//本周第一天
export function firstDayOfWeek2(date){
  date.setDate(date.getDate() - date.getDay());
  var begin = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return begin;
}

//N天后
export function nDayLater(date,n){
  date.setDate(date.getDate() + n);
  var end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59";
  return end;
}

//N天后
export function nDayLaterDate(date,n){
  date.setDate(date.getDate() + n);
  let end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  console.log("end:"+endDate);
  return endDate;
}


//本周第一天
export function firstDayOfWeekWithoutTime(date){
  date.setDate(date.getDate() - date.getDay());
  var begin = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return begin;
}
//N天后
export function nDayLaterWithoutTime(date,n){
  date.setDate(date.getDate() + n);
  var end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return end;
}


//本周最后一天
/*export function lastDayOfWeek(date){
  date.setDate(date.getDate() + 6);
  var end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59";
  return end;
}*/
//本月第一天
export function firstDayOfMonth(date){
  let first = date;
  //设置成第一天
  first.setDate(1);
  return first;
}
//本月最后一天
export function lastDayOfMonth(date){
  let last = date;
  //设置当前月最后一天
  last.setDate(1);//设置到当月第一天
  last.setMonth(date.getMonth() + 1);//再设置成下个月
  last.setDate(date.getDate() - 1);//最后减一天即为当月最后一天
  return last;
}
