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

// alert(window.location.search.split('?img=')[1].split('&s=')[0]);
let imgSrc = window.location.search.split('?img=')[1].split('&s=')[0];
// let imgSrc = 'https://picsum.photos/seed/rrrrrrrr/800/1760';
imageEditor.loadImageFromURL(imgSrc, 'SampleImage').then(function() {
	imageEditor.clearUndoStack();
    parent.init(imageEditor);
});

