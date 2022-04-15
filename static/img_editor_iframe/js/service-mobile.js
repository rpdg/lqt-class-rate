/**
 * service-mobile.js
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview
 */
/* eslint-disable vars-on-top,no-var,strict,prefer-template,prefer-arrow-callback,prefer-destructuring,object-shorthand,require-jsdoc,complexity */
'use strict';
document.write(
	'<iframe class="tui-image-editor" src="./editor.html' + window.location.search + '" border="0"></iframe>'
);

function init(editor , startPanZoom , stopPanZoom) {
	console.log(editor);

	var MAX_RESOLUTION = 3264 * 2448; // 8MP (Mega Pixel)

	var cfg = {
		drawMode: 'FREE_DRAWING',
		brush: {
			color: '#E00000',
			size: '5',
		},
	};

	function loadCfg() {
		let _setStr = window.localStorage.getItem('lqt-img-editor');
		if (_setStr) {
			try {
				cfg = JSON.parse(_setStr);
			} catch (e) {}
		}
		$('#input-brush-range').val(cfg.brush.size || 10);
	}
	loadCfg();

	function saveCfg() {
		window.localStorage.setItem('lqt-img-editor', JSON.stringify(cfg));
	}

	var supportingFileAPI = !!(window.File && window.FileList && window.FileReader);
	var rImageType = /data:(image\/.+);base64,/;
	var shapeOpt = {
		fill: '#fff',
		stroke: '#000',
		strokeWidth: 10,
	};
	var activeObjectId;

	// Selector of image editor controls
	var submenuClass = '.submenu';
	var hiddenmenuClass = '.hiddenmenu';

	var $controls = $('.tui-image-editor-controls');
	var $menuButtons = $controls.find('.menu-button');
	var $submenuButtons = $controls.find('.submenu-button');
	var $btnShowMenu = $controls.find('.btn-prev');
	var $msg = $controls.find('.msg');

	var $subMenus = $controls.find(submenuClass);
	var $hiddenMenus = $controls.find(hiddenmenuClass);

	// Image editor controls - top menu buttons
	var $inputImage = $('#input-image-file');
	var $btnDownload = $('#btn-download');
	var $btnUndo = $('#btn-undo');
	var $btnRedo = $('#btn-redo');
	var $btnRemoveActiveObject = $('#btn-remove-active-object');

	// Image editor controls - bottom menu buttons
	var $btnCrop = $('#btn-crop');
	var $btnAddText = $('#btn-add-text');

	// Image editor controls - bottom submenu buttons
	var $btnApplyCrop = $('#btn-apply-crop');
	var $btnFlipX = $('#btn-flip-x');
	var $btnFlipY = $('#btn-flip-y');
	var $btnRotateClockwise = $('#btn-rotate-clockwise');
	var $btnRotateCounterClockWise = $('#btn-rotate-counter-clockwise');
	var $btnAddArrowIcon = $('#btn-add-arrow-icon');
	var $btnAddCancelIcon = $('#btn-add-cancel-icon');
	var $btnAddCustomIcon = $('#btn-add-custom-icon');
	var $btnFreeDrawing = $('#btn-free-drawing');
	var $btnLineDrawing = $('#btn-line-drawing');
	var $btnAddRect = $('#btn-add-rect');
	var $btnAddSquare = $('#btn-add-square');
	var $btnAddEllipse = $('#btn-add-ellipse');
	var $btnAddCircle = $('#btn-add-circle');
	var $btnAddTriangle = $('#btn-add-triangle');
	var $btnChangeTextStyle = $('.btn-change-text-style');

	// Image editor controls - etc.
	var $inputTextSizeRange = $('#input-text-size-range');
	var $inputBrushWidthRange = $('#input-brush-range');
	var $inputStrokeWidthRange = $('#input-stroke-range');
	var $inputCheckTransparent = $('#input-check-transparent');

	// Colorpicker
	var iconColorpicker = tui.colorPicker.create({
		container: $('#tui-icon-color-picker')[0],
		color: '#000000',
	});

	var textColorpicker = tui.colorPicker.create({
		container: $('#tui-text-color-picker')[0],
		color: '#000000',
	});

	var brushColorpicker = tui.colorPicker.create({
		container: $('#tui-brush-color-picker')[0],
		color: cfg.brush.color || '#FF0000',
	});

	var shapeColorpicker = tui.colorPicker.create({
		container: $('#tui-shape-color-picker')[0],
		color: '#000000',
	});

	// Create image editor
	var imageEditor = editor;
	// var imageEditor = new tui.ImageEditor('.tui-image-editor', {
	// 	cssMaxWidth: document.documentElement.clientWidth,
	// 	cssMaxHeight: document.documentElement.clientHeight,
	// 	// cssMaxHeight: $('.tui-image-editor')[0].clientHeight,
	// 	selectionStyle: {
	// 		cornerSize: 50,
	// 		rotatingPointOffset: 100,
	// 	},
	// 	usageStatistics: false,
	// });

	var $displayingSubMenu, $displayingHiddenMenu;

	function hexToRGBa(hex, alpha) {
		var r = parseInt(hex.slice(1, 3), 16);
		var g = parseInt(hex.slice(3, 5), 16);
		var b = parseInt(hex.slice(5, 7), 16);
		var a = alpha || 1;

		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
	}

	function base64ToBlob(data) {
		var mimeString = '';
		var raw, uInt8Array, i, rawLength;

		raw = data.replace(rImageType, function(header, imageType) {
			mimeString = imageType;

			return '';
		});

		raw = atob(raw);
		rawLength = raw.length;
		uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

		for (i = 0; i < rawLength; i += 1) {
			uInt8Array[i] = raw.charCodeAt(i);
		}

		return new Blob([uInt8Array], { type: mimeString });
	}

	function getBrushSettings() {
		var brushWidth = $inputBrushWidthRange.val();
		var brushColor = brushColorpicker.getColor();

		return {
			width: brushWidth,
			color: hexToRGBa(brushColor, 0.8),
		};
	}

	function activateShapeMode() {
		imageEditor.stopDrawingMode();
	}

	function activateIconMode() {
		imageEditor.stopDrawingMode();
	}

	function activateTextMode() {
		if (imageEditor.getDrawingMode() !== 'TEXT') {
			imageEditor.stopDrawingMode();
			imageEditor.startDrawingMode('TEXT');
		}
	}

	function setTextToolbar(obj) {
		var fontSize = obj.fontSize;
		var fontColor = obj.fill;

		$inputTextSizeRange.val(fontSize);
		textColorpicker.setColor(fontColor);
	}

	function setIconToolbar(obj) {
		var iconColor = obj.fill;

		iconColorpicker.setColor(iconColor);
	}

	function setShapeToolbar(obj) {
		var strokeColor, fillColor, isTransparent;
		var colorType = $('[name="select-color-type"]:checked').val();

		if (colorType === 'stroke') {
			strokeColor = obj.stroke;
			isTransparent = strokeColor === 'transparent';

			if (!isTransparent) {
				shapeColorpicker.setColor(strokeColor);
			}
		} else if (colorType === 'fill') {
			fillColor = obj.fill;
			isTransparent = fillColor === 'transparent';

			if (!isTransparent) {
				shapeColorpicker.setColor(fillColor);
			}
		}

		$inputCheckTransparent.prop('checked', isTransparent);
		$inputStrokeWidthRange.val(obj.strokeWith);
	}

	function showSubMenu(type) {
		var index;

		switch (type) {
			case 'shape':
				index = 3;
				break;
			case 'icon':
				index = 4;
				break;
			case 'text':
				index = 5;
				break;
			default:
				index = 0;
		}

		$displayingSubMenu.hide();
		$displayingHiddenMenu.hide();

		$displayingSubMenu = $menuButtons
			.eq(index)
			.parent()
			.find(submenuClass)
			.show();
	}

	// Bind custom event of image editor
	imageEditor.on({
		undoStackChanged: function(length) {
			if (length) {
				$btnUndo.removeClass('disabled');
			} else {
				$btnUndo.addClass('disabled');
			}
		},
		redoStackChanged: function(length) {
			if (length) {
				$btnRedo.removeClass('disabled');
			} else {
				$btnRedo.addClass('disabled');
			}
		},
		objectScaled: function(obj) {
			if (obj.type === 'text') {
				$inputTextSizeRange.val(obj.fontSize);
			}
		},
		objectActivated: function(obj) {
			activeObjectId = obj.id;
			if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
				showSubMenu('shape');
				setShapeToolbar(obj);
				activateShapeMode();
			} else if (obj.type === 'icon') {
				showSubMenu('icon');
				setIconToolbar(obj);
				activateIconMode();
			} else if (obj.type === 'text') {
				showSubMenu('text');
				setTextToolbar(obj);
				activateTextMode();
			}
		},
	});

	function setMoveMode(b) {
		currentMoving = b;
		imageEditor.changeSelectableAll(!currentMoving);
		btnMove[currentMoving ? 'addClass' : 'removeClass']('disabledBtn');
		btnMove.text(currentMoving ? '停止' : '移动');

		if (b) {
			$btnShowMenu.click();
		}
	}
	// Image editor controls action
	$menuButtons.on('click', function() {
		setMoveMode(false);

		$displayingSubMenu = $(this)
			.parent()
			.find(submenuClass)
			.show();
		$displayingHiddenMenu = $(this)
			.parent()
			.find(hiddenmenuClass);

		stopPanZoom();
	});

	$submenuButtons.on('click', function() {
		$displayingHiddenMenu.hide();
		$displayingHiddenMenu = $(this)
			.parent()
			.find(hiddenmenuClass)
			.show();
	});

	$btnShowMenu.on('click', function() {
		$displayingSubMenu.hide();
		$displayingHiddenMenu.hide();
		$msg.show();

		imageEditor.stopDrawingMode();

		startPanZoom();
	});

	// Image load action
	$inputImage.on('change', function(event) {
		var file;
		var img;
		var resolution;

		if (!supportingFileAPI) {
			alert('This browser does not support file-api');
		}

		file = event.target.files[0];

		if (file) {
			img = new Image();

			img.onload = function() {
				resolution = this.width * this.height;

				if (resolution <= MAX_RESOLUTION) {
					imageEditor.loadImageFromFile(file).then(function() {
						imageEditor.clearUndoStack();
						fixMobileUI();
					});
				} else {
					alert("Loaded image's resolution is too large!\nRecommended resolution is 3264 * 2448!");
				}

				URL.revokeObjectURL(file);
			};

			img.src = URL.createObjectURL(file);
		}
	});

	// Undo action
	$btnUndo.on('click', function() {
		if (!$(this).hasClass('disabled')) {
			imageEditor.undo();
		}
	});

	// Redo action
	$btnRedo.on('click', function() {
		if (!$(this).hasClass('disabled')) {
			imageEditor.redo();
		}
	});

	// Remove active object action
	$btnRemoveActiveObject.on('click', function() {
		imageEditor.removeObject(activeObjectId);
	});

	// Download action
	$btnDownload.on('click', function() {
		var imageName = imageEditor.getImageName();
		var dataURL = imageEditor.toDataURL();
		var blob, type, w;

		if (supportingFileAPI) {
			blob = base64ToBlob(dataURL);
			type = blob.type.split('/')[1];
			if (imageName.split('.').pop() !== type) {
				imageName += '.' + type;
			}

			// Library: FileSaver - saveAs
			saveAs(blob, imageName); // eslint-disable-line
		} else {
			alert('This browser needs a file-server');
			w = window.open();
			w.document.body.innerHTML = '<img src=' + dataURL + '>';
		}
	});

	/**
	 * Zoom
	 */
	let currentZoomLevel = 1;
	let currentScale = 1;
	let centerPoint = { x: 400, y: 880 };
	$('#btn-zoom-in').click(function() {
		currentZoomLevel += 0.3;
		if (currentZoomLevel > 5) {
			currentZoomLevel = 5;
		}
		imageEditor.zoom({ ...centerPoint, zoomLevel: currentZoomLevel });
	});
	$('#btn-zoom-out').click(function() {
		currentZoomLevel -= 0.3;
		if (currentZoomLevel < 1) {
			currentZoomLevel = 1;
		}
		imageEditor.zoom({ ...centerPoint, zoomLevel: currentZoomLevel });
	});
	let currentMoving = false;
	let moveTimer = 0;
	let moveStartPoint = null;
	let btnMove = $('#btn-move').click(function() {
		setMoveMode(!currentMoving);
	});
	// $('.tui-image-editor-canvas-container')[0].addEventListener(
	// 	'touchmove',
	// 	function(event) {
	// 		if (currentMoving) {
	// 			let clientX = event.clientX || event.targetTouches[0].clientX;
	// 			let clientY = event.clientY || event.targetTouches[0].clientY;

	// 			if (!moveStartPoint) {
	// 				moveStartPoint = { x: clientX, y: clientY };
	// 			}

	// 			// let moveX = centerPoint.x - clientX;
	// 			// let moveY = centerPoint.y - clientY;
	// 			if (moveTimer) {
	// 				clearTimeout(moveTimer);
	// 			}

	// 			moveTimer = setTimeout(() => {
	// 				let moveEndPoint = { x: clientX, y: clientY };
	// 				console.log('[centerPoint] ', centerPoint);
	// 				console.log('[touchmove] ', moveStartPoint, '->', moveEndPoint, currentZoomLevel, currentScale);
	// 				centerPoint.x -= ((moveEndPoint.x - moveStartPoint.x) * currentZoomLevel) / currentScale;
	// 				// if (centerPoint.x < 0) centerPoint.x = 0;
	// 				centerPoint.y -= ((moveEndPoint.y - moveStartPoint.y) * currentZoomLevel) / currentScale;
	// 				// if (centerPoint.y < 0) centerPoint.y = 0;
	// 				let { height, width } = imageEditor._graphics.canvasImage;
	// 				// if(centerPoint.x > width) centerPoint.x = width;
	// 				// if(centerPoint.y > height) centerPoint.y = height;
	// 				console.log('[centerPoint] ', centerPoint);
	// 				imageEditor.zoom({ ...centerPoint, zoomLevel: currentZoomLevel });
	// 				moveStartPoint = null;
	// 			}, 50);
	// 		}
	// 	},
	// 	false
	// );

	// Crop menu action
	$btnCrop.on('click', function() {
		imageEditor.startDrawingMode('CROPPER');

		cfg.drawMode = 'CROPPER';
		saveCfg();
	});

	$btnApplyCrop.on('click', function() {
		imageEditor.crop(imageEditor.getCropzoneRect()).then(function() {
			imageEditor.stopDrawingMode();
			$subMenus.removeClass('show');
			$hiddenMenus.removeClass('show');
		});
	});

	// Orientation menu action
	$btnRotateClockwise.on('click', function() {
		imageEditor.rotate(90);
	});

	$btnRotateCounterClockWise.on('click', function() {
		imageEditor.rotate(-90);
	});

	$btnFlipX.on('click', function() {
		imageEditor.flipX();
	});

	$btnFlipY.on('click', function() {
		imageEditor.flipY();
	});

	// Icon menu action
	$btnAddArrowIcon.on('click', function() {
		imageEditor.addIcon('arrow');
	});

	$btnAddCancelIcon.on('click', function() {
		imageEditor.addIcon('cancel');
	});

	$btnAddCustomIcon.on('click', function() {
		imageEditor.addIcon('customArrow');
	});

	iconColorpicker.on('selectColor', function(event) {
		imageEditor.changeIconColor(activeObjectId, event.color);
	});

	// Text menu action
	$btnAddText.on('click', function() {
		var initText = '批注：';

		cfg.drawMode = 'TEXT';
		saveCfg();

		imageEditor.startDrawingMode('TEXT');
		imageEditor.addText(initText, {
			styles: {
				fontSize: parseInt($inputTextSizeRange.val(), 10),
			},
		});
	});

	$btnChangeTextStyle.on('click', function() {
		var styleType = $(this).attr('data-style-type');
		var styleObj = {};
		var styleObjKey;

		switch (styleType) {
			case 'bold':
				styleObjKey = 'fontWeight';
				break;
			case 'italic':
				styleObjKey = 'fontStyle';
				break;
			case 'underline':
				styleObjKey = 'underline';
				break;
			case 'left':
				styleObjKey = 'textAlign';
				break;
			case 'center':
				styleObjKey = 'textAlign';
				break;
			case 'right':
				styleObjKey = 'textAlign';
				break;
			default:
				styleObjKey = '';
		}

		styleObj[styleObjKey] = styleType;

		imageEditor.changeTextStyle(activeObjectId, styleObj);
	});

	$inputTextSizeRange.on('change', function() {
		imageEditor.changeTextStyle(activeObjectId, {
			fontSize: parseInt($(this).val(), 10),
		});
	});

	textColorpicker.on('selectColor', function(event) {
		imageEditor.changeTextStyle(activeObjectId, {
			fill: event.color,
		});
	});

	// Draw line menu action
	$btnFreeDrawing.on('click', function() {
		var settings = getBrushSettings();

		imageEditor.stopDrawingMode();
		imageEditor.startDrawingMode('FREE_DRAWING', settings);

		cfg.drawMode = 'FREE_DRAWING';
		saveCfg();
	});

	$btnLineDrawing.on('click', function() {
		var settings = getBrushSettings();

		imageEditor.stopDrawingMode();
		imageEditor.startDrawingMode('LINE_DRAWING', settings);

		cfg.drawMode = 'LINE_DRAWING';
		saveCfg();
	});

	$inputBrushWidthRange.on('change', function() {
		cfg.brush.size = $(this).val();
		saveCfg();

		imageEditor.setBrush({
			width: parseInt($(this).val(), 10),
		});
	});

	brushColorpicker.on('selectColor', function(event) {
		cfg.brush.color = event.color;
		saveCfg();

		imageEditor.setBrush({
			color: hexToRGBa(event.color, 0.8),
		});
	});

	// Add shape menu action
	$btnAddRect.on('click', function() {
		imageEditor.addShape(
			'rect',
			tui.util.extend(
				{
					width: 500,
					height: 300,
				},
				shapeOpt
			)
		);
	});

	$btnAddSquare.on('click', function() {
		imageEditor.addShape(
			'rect',
			tui.util.extend(
				{
					width: 400,
					height: 400,
					isRegular: true,
				},
				shapeOpt
			)
		);
	});

	$btnAddEllipse.on('click', function() {
		imageEditor.addShape(
			'circle',
			tui.util.extend(
				{
					rx: 300,
					ry: 200,
				},
				shapeOpt
			)
		);
	});

	$btnAddCircle.on('click', function() {
		imageEditor.addShape(
			'circle',
			tui.util.extend(
				{
					rx: 200,
					ry: 200,
					isRegular: true,
				},
				shapeOpt
			)
		);
	});

	$btnAddTriangle.on('click', function() {
		imageEditor.addShape(
			'triangle',
			tui.util.extend(
				{
					width: 500,
					height: 400,
					isRegular: true,
				},
				shapeOpt
			)
		);
	});

	$inputStrokeWidthRange.on('change', function() {
		imageEditor.changeShape(activeObjectId, {
			strokeWidth: parseInt($(this).val(), 10),
		});
	});

	$inputCheckTransparent.on('change', function() {
		var colorType = $('[name="select-color-type"]:checked').val();
		var isTransparent = $(this).prop('checked');
		var color;

		if (!isTransparent) {
			color = shapeColorpicker.getColor();
		} else {
			color = 'transparent';
		}

		if (colorType === 'stroke') {
			imageEditor.changeShape(activeObjectId, {
				stroke: color,
			});
		} else if (colorType === 'fill') {
			imageEditor.changeShape(activeObjectId, {
				fill: color,
			});
		}
	});

	shapeColorpicker.on('selectColor', function(event) {
		var colorType = $('[name="select-color-type"]:checked').val();
		var isTransparent = $inputCheckTransparent.prop('checked');
		var color = event.color;

		if (isTransparent) {
			return;
		}

		if (colorType === 'stroke') {
			imageEditor.changeShape(activeObjectId, {
				stroke: color,
			});
		} else if (colorType === 'fill') {
			imageEditor.changeShape(activeObjectId, {
				fill: color,
			});
		}
	});

	// alert(window.location.search.split('?img=')[1].split('&s=')[0]);
	// let imgSrc = window.location.search.split('?img=')[1].split('&s=')[0];
	let imgSrc = 'https://picsum.photos/seed/rrrrrrrr/800/1760';
	imageEditor.loadImageFromURL(imgSrc, 'SampleImage').then(function() {
		imageEditor.clearUndoStack();

		// 	// init start mode
		startEditorUseCfgMode();

		//
		let obj = calcScale();
		currentScale =
			obj.img.height > obj.img.width
				? obj.canvas.maxHeight / obj.img.height
				: obj.canvas.maxWidth / obj.img.width;

		// // fix mobile ui

		debugger;
		fixMobileUI();
		// // zoom 中心是根据原图来的
		imageEditor.zoom({ zoomLevel: 1, x: obj.img.width / 2, y: obj.img.height / 2 });

		// setTimeout(()=>{
		// 	imageEditor.zoom({x:400,y:880, zoomLevel:2.5});
		// } ,3e3);
	});

	// Load image
	// function getBase64Image(img) {
	// 	let canvas = document.createElement('canvas');
	// 	canvas.width = img.width;
	// 	canvas.height = img.height;
	// 	let ctx = canvas.getContext('2d');
	// 	ctx.drawImage(img, 0, 0, img.width, img.height);
	// 	let dataURL = canvas.toDataURL('image/png');
	// 	return dataURL;
	// }
	// function startDownload(imageURL) {
	// 	// debugger;
	// 	var downloadedImg = new Image();
	// 	downloadedImg.crossOrigin = '*';
	// 	downloadedImg.onload = function() {

	// 		// let b64 = getBase64Image(downloadedImg);
	// 		// debugger

	// 		imageEditor.loadImageFromURL(imageURL, 'SampleImage').then(function() {
	// 			imageEditor.clearUndoStack();

	// 			// init start mode
	// 			startEditorUseCfgMode();

	// 			//
	// 			let obj = calcScale();
	// 			currentScale =
	// 				obj.img.height > obj.img.width
	// 					? obj.canvas.maxHeight / obj.img.height
	// 					: obj.canvas.maxWidth / obj.img.width;

	// 			// // fix mobile ui
	// 			// fixMobileUI();

	// 			// // zoom 中心是根据原图来的
	// 			// imageEditor.zoom({x:400,y:880, zoomLevel:2});
	// 			// setTimeout(()=>{
	// 			// 	imageEditor.zoom({x:400,y:880, zoomLevel:2.5});
	// 			// } ,3e3);
	// 		});
	// 	};
	// 	downloadedImg.src = imageURL;
	// }
	// startDownload(imgSrc);

	function calcScale() {
		let maxHeight, maxWidth;
		let { height, width } = imageEditor._graphics.canvasImage;
		if (height > width) {
			maxHeight = window.document.body.clientHeight - 50 - 80;
			maxWidth = (maxHeight / height) * width;
		} else {
			maxWidth = window.document.body.clientWidth;
			maxHeight = (maxWidth / width) * height;

			if (maxHeight > window.document.body.clientHeight - 50 - 80) {
				maxHeight = window.document.body.clientHeight - 50 - 80;
				maxWidth = (maxHeight / height) * width;
			}
		}
		return {
			img: { height, width },
			canvas: { maxHeight, maxWidth },
		};
	}
	function fixMobileUI() {
		let obj = calcScale();
		imageEditor.resizeCanvasDimension({ width: obj.canvas.maxWidth + 1000, height: obj.canvas.maxHeight });
		// $('.tui-image-editor-canvas-container , .tui-image-editor-canvas-container > canvas').css({ maxWidth, maxHeight });
	}
	function startEditorUseCfgMode() {
		try {
			debugger;
			if (cfg.drawMode) {
				switch (cfg.drawMode) {
					case 'TEXT':
						$btnAddText.click();
						break;
					case 'CROPPER':
						$btnCrop.click();
						break;
					case 'FREE_DRAWING':
						$('#btn-draw-line').click();
						$btnFreeDrawing.click();
						break;
					case 'LINE_DRAWING':
						$('#btn-draw-line').click();
						$btnLineDrawing.click();
						break;
					default:
						break;
				}
			}
		} catch (e) {}
	}
	// startEditorUseCfgMode();

	// FUNCTION TO CONVERT DATA-URL to BLOB
	function dataURLtoBlob(dataurl) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}
	/**
	 * 
 		// GET TUI IMAGE AS A BLOB
        var blob = dataURLtoBlob(imageEditor.toDataURL());

        // PREPARE FORM DATA TO SEND VIA POST
        var formData = new FormData();
        formData.append('croppedImage', blob, 'sampleimage.png');

	 */

	function getImgByteSize(graphicContents) {
		let size = 0;
		if (graphicContents) {
			// 获取base64图片byte大小
			const equalIndex = graphicContents.indexOf('='); // 获取=号下标
			if (equalIndex > 0) {
				const str = graphicContents.substring(0, equalIndex); // 去除=号
				const strLength = str.length;
				const fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
				size = Math.floor(fileLength); // 向下取整
			} else {
				const strLength = graphicContents.length;
				const fileLength = strLength - (strLength / 8) * 2;
				size = Math.floor(fileLength); // 向下取整
			}
		} else {
			size = 0;
		}
		return size;
	}
	//
	$('#btnCancelEdit').click(function() {
		window.top.ifrCancel();
	});
	//
	$('#btnPostImage').click(function() {
		imageEditor.resetZoom();
		//multiplier: 0.5,
		let dataURL = imageEditor.toDataURL({
			format: 'jpeg',
			quality: 0.85,
		});

		let formData = new FormData();
		formData.append('baseImg', dataURL);

		window.top.ifrLoading();
		window.top.ifrCommit(formData);

		// $.ajax({
		// 	url: '/wechat/homeworkH5/getTempFile',
		// 	// url: '/api/wechat/homeworkH5/getTempFile',
		// 	data: formData,
		// 	processData: false,
		// 	contentType: false,
		// 	type: 'POST',
		// 	success: function(resp) {
		// 		window.top.ifrSuccess(resp.data);
		// 	},
		// });
	});
}
