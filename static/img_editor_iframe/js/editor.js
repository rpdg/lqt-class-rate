
var MAX_RESOLUTION = 3264 * 2448; // 8MP (Mega Pixel)

// var cfg = {
// 	drawMode: 'FREE_DRAWING',
// 	brush: {
// 		color: '#E00000',
// 		size: '5',
// 	},
// };

// function loadCfg() {
// 	let _setStr = window.localStorage.getItem('lqt-img-editor');
// 	if (_setStr) {
// 		try {
// 			cfg = JSON.parse(_setStr);
// 		} catch (e) {}
// 	}
// 	$('#input-brush-range').val(cfg.brush.size || 10);
// }
// loadCfg();



var imageEditor = new tui.ImageEditor('.tui-image-editor', {
    cssMaxWidth: document.documentElement.clientWidth,
    cssMaxHeight: document.documentElement.clientHeight,
    // cssMaxHeight: $('.tui-image-editor')[0].clientHeight,
    selectionStyle: {
        cornerSize: 50,
        rotatingPointOffset: 100,
    },
    usageStatistics: false,
});

parent.init(imageEditor);