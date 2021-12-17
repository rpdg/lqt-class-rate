
module.exports = {
	lintOnSave: false,
	css: { requireModuleExtension: true },
	devServer: {
		disableHostCheck: true,
		open: true,
		proxy: {
			'/': {
				target: 'https://gz.lqtedu.com/',
				secure: true,
				changeOrigin: false,
			},
			'/app/':{
				target: 'https://gz.lqtedu.com/',
				secure: true,
				changeOrigin: false,
			}
		},
	},
};
