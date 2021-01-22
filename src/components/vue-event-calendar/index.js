'use strict'

import vueEventCalendar from './vue-event-calendar.vue'
import {AddDays} from './tools'


function install (Vue, options = {}) {
  const isVueNext = Vue.version.split('.')[0] === '2'
  const inBrowser = typeof window !== 'undefined'
  let dateObj = new Date()
  const DEFAULT_OPTION = {
    locale: 'zh', // en
    color: 'red',//#f29543
    className:'selected-day',
    weekStartOn: 0 // 0 mean sunday
  }
  let Calendar = {
    $vm: null,
    bindEventBus (vm) {
      this.$vm = vm
    },
    toDate (dateString) {
      if (dateString === 'all') {
        this.$vm.CALENDAR_EVENTS_DATA.params = {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all',
          referenceDate:dateObj
        }
      } else {
        let dateArr = dateString.split('/')
        dateArr = dateArr.map((item) => {
          return parseInt(item, 10)
        })
        this.$vm.CALENDAR_EVENTS_DATA.params = {
          curYear: dateArr[0],
          curMonth: dateArr[1]-1,
          curDate: dateArr[2],
          curEventsDate: dateString,
          referenceDate:dateArr
        }
      }
    },
    nextMonth () {
      if (this.$vm.CALENDAR_EVENTS_DATA.params.curMonth < 11) {
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth++
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.curYear++
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth = 0
      }
    },
    preMonth () {
      if (this.$vm.CALENDAR_EVENTS_DATA.params.curMonth > 0) {
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth--
      } else {
        this.$vm.CALENDAR_EVENTS_DATA.params.curYear--
        this.$vm.CALENDAR_EVENTS_DATA.params.curMonth = 11
      }
    },
    nextWeek () {
      let referenceDate =  this.$vm.CALENDAR_EVENTS_DATA.params.referenceDate;
      let newReferenceDate = AddDays(referenceDate,7);
      this.$vm.CALENDAR_EVENTS_DATA.params.referenceDate = new Date(newReferenceDate);
    },
    preWeek () {
      let referenceDate =  this.$vm.CALENDAR_EVENTS_DATA.params.referenceDate;
      let newReferenceDate = AddDays(referenceDate,-7);
      this.$vm.CALENDAR_EVENTS_DATA.params.referenceDate = new Date(newReferenceDate);
    },

  }

  const calendarOptions = Object.assign(DEFAULT_OPTION, options)

  const VueCalendarBarEventBus = new Vue({
    data: {
      CALENDAR_EVENTS_DATA: {
        options: calendarOptions,
        params: {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all',
          referenceDate:dateObj
        }
      }
    }
  })

  if (inBrowser) {
    window.VueCalendarBarEventBus = VueCalendarBarEventBus
    Calendar.bindEventBus(VueCalendarBarEventBus)
  }

  Vue.component('vue-event-calendar', vueEventCalendar)

  Vue.prototype.$EventCalendar = Calendar
}

export default install

if (typeof module === 'object' && module.exports) {
  module.exports.install = install
}
