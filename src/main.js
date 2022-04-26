// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import FastClick from 'fastclick';
import App from './App.vue';
import router from './router/index';
import axios from 'axios';
import store from './store/index';
import './style/css/style.css'; //1.1.10之后的版本，css被放在了单独的文件中，方便替换
import vueEventCalendar from './components/vue-event-calendar';
import vueEventCalendarWeek from './components/vue-event-calendar-week';

//日历控件
Vue.use(vueEventCalendar, { locale: 'zh', color: '#48b319' }); //可以设置语言，支持中文和英文
Vue.use(vueEventCalendarWeek, { locale: 'zh', color: '#48b319' }); //可以设置语言，支持中文和英文

//import VueVideoPlayer from 'vue-video-player'
//import 'video.js/dist/video-js.css'

import { LoadingPlugin } from 'vux';
Vue.use(LoadingPlugin);
import { ToastPlugin, ConfirmPlugin } from 'vux';
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

//Vue.use(VueVideoPlayer);
Vue.use(VueResource);

axios.defaults.timeout = 30e3;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
Vue.prototype.$axios = axios;

//FastClick.attach(document.body)
Vue.config.productionTip = false;

Vue.http.options.emulateJSON = true;
Vue.http.options.headers = {
	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};
Vue.http.interceptors.push((request, next) => {
	let timeout;
	// 这里改用 _timeout
	// if (request._timeout) {
	//   timeout = setTimeout(() => {
	//     //自定义响应体 status:408,statustext:"请求超时"，并返回给下下边的next
	//     next(request.respondWith(request.body, {
	//       status: 408,
	//       statusText: '请求超时'
	//     }));
	//
	//   }, request._timeout);
	// }
	next((response) => {
		switch (response.status) {
			case 401:
			// if (process.server){

			// }
			case 504:
				window.location.replace(roterPath + '/weixin/wechat/dist/index.jsp#504');
			case 502:
				window.location.replace(roterPath + '/weixin/wechat/dist/index.jsp#502');
			case 500:
				return error.response;
		}
		console.log(response.status); //如果超时输出408
		return response;
	});
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App,
	},
});
