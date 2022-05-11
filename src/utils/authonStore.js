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
			localStorage.setItem('USER' , JSON.stringify(respData.data))
			this._userInfo = {
				userId: respData.data.userId,
				userName: respData.data.userName,
				userTitle: respData.data.userTitle,
				userType: respData.data.userType,
			};
		}
	}

	async getUserInfo() {
		if (!this._userInfo) {
			await this.fetchUserInfo();
		}
		console.log('AuthonStore', this._userInfo);
		return this._userInfo;
	}
}

export default new AuthonStore();
