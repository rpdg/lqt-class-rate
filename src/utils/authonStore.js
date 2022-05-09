import apiList from '../config/api';
import axios from 'axios';

class Authon {
	#service;

	constructor() {
		this.#service = axios.create({
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			timeout: 0, // `0` (no timeout)
		});
	}

	async getUserInfo() {
        let resp = await this.#service.post(apiList.GET_LIST);
        let respData = resp.data;
        if(respData.status === 200) {
            let userInfo = respData.data;
        }
    }
}
export default new Authon();
