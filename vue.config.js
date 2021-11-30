
module.exports = {
	lintOnSave: false,
	css: { requireModuleExtension: true },
	devServer: {
		disableHostCheck: true,
		open: true,
		proxy: {
			'/': {
				target: 'https://gz2.lqtedu.com/',
				secure: true,
				changeOrigin: false,
			},
			'/app/':{
				target: 'https://gz2.lqtedu.com/',
				secure: true,
				changeOrigin: false,
			}
		},
	},
};
