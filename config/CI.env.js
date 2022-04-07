var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	API_BASE_URL: '"/api/"',
	ROUTER_PATH: '""',
	MIDDLE_PATH: '"/weixin/wechat"',
});
