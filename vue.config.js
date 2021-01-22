
module.exports = {
	lintOnSave: false,
	css: { requireModuleExtension: true },
	devServer: {
		disableHostCheck: true,
		port: 8008,
		open: true,
		proxy: {
			'/': {
				target: 'http://gz.lqtedu.com/',
				changeOrigin: false,
			},
		},
	},
};
