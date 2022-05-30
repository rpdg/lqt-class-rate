import apiList from '../config/api';
import axios from 'axios';

class AuthonStore {
	// _axios;
	// _userInfo;

	constructor() {
		this._axios = axios.create({
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			timeout: 0, // `0` (no timeout)
		});
	}

	setupData(data) {
		localStorage.setItem('USER', JSON.stringify(data));
		this._userInfo = {
			userId: data.userId,
			userName: data.userName,
			userTitle: data.userTitle,
			userType: data.userType,
			studentId: data.studentId, // 家长关联的小孩
			studentName: data.studentName,
		};
	}

	async fetchUserInfo() {
		let resp = await this._axios.post(apiList.GET_LIST);
		let respData = resp.data;
		if (respData.status === 200) {
			this.setupData(respData.data);
			console.log('AuthonStore Loading ...', this._userInfo);
		} else {
			alert('当前未登录');
			throw new Error('Fetching user profile error');
		}
	}

	async getUserInfo() {
		try {
			if (!this._userInfo) {
				await this.fetchUserInfo();
			}
			return this._userInfo;
		} catch (e) {
			throw e;
		}
	}

	/**
	 *
	 * @returns if app shall ask recorder permission
	 */
	shallAskRecorderPermission() {
		let willAsk = true;
		let strPermmission = localStorage.getItem('lqt-allow-record');
		if (strPermmission) {
			try {
				let permission = JSON.parse(strPermmission);
				if (permission.rejectTimes > 1 && permission.allow === false) {
					willAsk = false;
				}
			} catch (e) {}
		}

		return willAsk;
	}

	setRecorderPermission(allow) {
		if (!allow) {
			let permission = {
				rejectTimes: 0,
				allow: allow,
			};
			let strPermmission = localStorage.getItem('lqt-allow-record');
			if (strPermmission) {
				try {
					permission = JSON.parse(strPermmission);
				} catch (e) {}
			}
			permission.rejectTimes = permission.rejectTimes + 1;
			permission.allow = allow;
			localStorage.setItem('lqt-allow-record', JSON.stringify(permission));
		} else {
			localStorage.removeItem('lqt-allow-record');
		}
	}
}

export default new AuthonStore();
