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

	setupData(data){
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
}

export default new AuthonStore();
