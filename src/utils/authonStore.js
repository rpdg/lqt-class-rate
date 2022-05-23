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

	async fetchUserInfo() {
		let resp = await this._axios.post(apiList.GET_LIST);
		let respData = resp.data;
		if (respData.status === 200) {
			localStorage.setItem('USER', JSON.stringify(respData.data));
			this._userInfo = {
				userId: respData.data.userId,
				userName: respData.data.userName,
				userTitle: respData.data.userTitle,
				userType: respData.data.userType,
			};
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
