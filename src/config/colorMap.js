export const THEME_COLOR_LIST = [
	{
		desc: '浅粉',
		name: 'lightPink',
		value: '#FF6091',
	},
	{
		desc: '标准粉',
		name: 'mainPink',
		value: '#E91D62',
	},
	{
		desc: '浅蓝',
		name: 'lightBlue',
		value: '#29C7FF',
	},
	{
		desc: '警示红',
		name: 'warningRed',
		value: '#ED431E',
	},
	{
		desc: '标准蓝',
		name: 'mainBlue',
		value: '#0093DD',
	},
	{
		desc: '标准红',
		name: 'mainRed',
		value: '#ED431E',
	},
	{
		desc: '深蓝',
		name: 'darkBlue',
		value: '#0077C0',
	},
	{
		desc: '浅红',
		name: 'lightRed',
		value: '#F0603E',
	},
	{
		desc: '浅紫',
		name: 'lightPurple',
		value: '#B64A9E',
	},
	{
		desc: '标准橙',
		name: 'mainOrange',
		value: '#FF8F03',
	},
	{
		desc: '标准紫',
		name: 'mainPurple',
		value: '#AA1A79',
	},
	{
		desc: '浅橙',
		name: 'lightOrange',
		value: '#FAC030',
	},
	{
		desc: '标准棕',
		name: 'mainBrown',
		value: '#8E6558',
	},
	{
		desc: '淡黄(背景)',
		name: 'lightYellow',
		value: '#FFFBE8',
	},
	{
		desc: '标准黑',
		name: 'mainBlack',
		value: '#333333',
	},
	{
		desc: '标准黄',
		name: 'mainYellow',
		value: '#FFE93B',
	},
	{
		desc: '标准灰',
		name: 'mainGray',
		value: '#666666',
	},
	{
		desc: '警示黄',
		name: 'warningYellow',
		value: '#FFFF00',
	},
	{
		desc: '浅灰',
		name: 'lightGray',
		value: '#999999',
	},
	{
		desc: '柠檬黄',
		name: 'lemonYellow',
		value: '#DDDF00',
	},
	{
		desc: '边框灰',
		name: 'lineNormal',
		value: '#C7C7C7',
	},
	{
		desc: '禁止灰（分割线同）',
		name: 'lineDisable',
		value: '#DEDEDE',
	},
	{
		desc: '浅绿',
		name: 'lightGreen',
		value: '#79D04B',
	},
	{
		desc: '背景灰',
		name: 'backgroundGray',
		value: '#EDEDED',
	},
	{
		desc: '标准绿',
		name: 'mainGreen',
		value: '#48B319',
	},
	{
		desc: '深绿',
		name: 'darkGreen',
		value: '#248A26',
	},
];

export const THEME_COLOR_MAP = THEME_COLOR_LIST.reduce((acc, item) => {
	acc[item.name] = item.value;
	return acc;
}, {});
