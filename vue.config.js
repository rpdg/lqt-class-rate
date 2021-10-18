
module.exports = {
	lintOnSave: false,
	css: { requireModuleExtension: true },
	devServer: {
		disableHostCheck: true,
		port: 8008,
		open: true,
		proxy: {
			'/': {
				target: 'https://gz.lqtedu.com/',
				changeOrigin: true,
			},
			'/app/':{
				target: 'https://gz.lqtedu.com/',
				changeOrigin: true,
			}
		},
	},
};
