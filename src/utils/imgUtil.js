import wx from 'weixin-js-sdk';

export async function readWxImages(localIds) {
	let files = [];

	for (let i = 0; i < localIds.length; i++) {
		let base64 = await transWxImage2Uri(localIds[i]);
		let file = await dataUrlToFile(
			base64,
			(Date.now() +
				Math.random()
					.toString()
					.split('.')[1] || '') + '.jpg'
		);
		files.push(file);
	}
	// console.log(files);
	return files;
}

async function dataUrlToFile(dataUrl, fileName) {
	const res = await fetch(dataUrl);
	const blob = await res.blob();
	return new File([blob], fileName, { type: 'image/jpeg' });
}

async function transWxImage2Uri(item) {
	return new Promise((resolve) => {
		// @ts-ignore
		wx.getLocalImgData({
			localId: item,
			success: function(res) {
				let { localData } = res;

				if (localData.indexOf('data:image') != 0) {
					//判断是否有这样的头部
					localData = 'data:image/jpeg;base64,' + localData;
				}

				localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg');

				resolve(localData);
			},
			fail: function(err) {
				throw err;
			},
		});
	});
}
