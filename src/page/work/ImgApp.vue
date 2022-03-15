<template>
  <div class="imageEditorApp">
    <!-- Image editor controls - top area -->
    <div class="header">
      <div class="menu">
        <button
          :class="btnUndoDisable ? 'button disabled' : 'button'"
          :disabled="btnUndoDisable"
          @click="btnUndo"
          id="btn-undo"
        >
          <img src="@/assets/work/undo.png" />
        </button>
        <button
          :class="btnRedoDisable ? 'button disabled' : 'button'"
          :disabled="btnRedoDisable"
          @click="btnRedo"
          id="btn-redo"
        >
          <img src="@/assets/work/redo.png" />
        </button>
      </div>
    </div>
    <!-- Image editor area -->
    <div
      ref="tuiImageEditor"
      id="tui-image-editor-container"
      style="width: 100%;height: 90%;margin-top: 50px"
    ></div>
    <!-- Image editor controls - bottom area -->
    <div class="tui-image-editor-controls">
      <ul class="scrollable">
        <li class="menu-item">
          <button v-show="btn1" class="menu-button" @click="addText" id="btn-add-text">文字</button>
          <div v-show="!btn1" class="submenu">
            <button @click="btn1 = true" class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button class="submenu-button" @click="showBtn1Item(1)">粗细</button>
                <div class="hiddenmenu" v-show="btn1Text">
                  <input
                    id="input-text-size-range"
                    @change="textSizeChange"
                    v-model="textSizeVal"
                    ref="inputTextSizeRange"
                    type="range"
                    min="10"
                    max="240"
                  />
                </div>
              </li>

              <li class="menu-item">
                <button class="submenu-button" @click="showBtn1Item(2)">颜色</button>
                <div class="hiddenmenu" v-show="btn1Color">
                  <div id="tui-text-color-picker" ref="tuiTextColorPicker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button v-if="btn2" @click="btn2 = false" class="menu-button">旋转</button>
          <div v-else class="submenu">
            <button @click="btn2 = true" class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button
                  class="submenu-button"
                  @click="rotateImg(90)"
                  id="btn-rotate-clockwise"
                >旋转 +90</button>
              </li>
              <li class="menu-item">
                <button
                  class="submenu-button"
                  @click="rotateImg(-90)"
                  id="btn-rotate-counter-clockwise"
                >旋转 -90</button>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button v-show="btn3" @click="btn3 = false" class="menu-button" id="btn-draw-line">涂鸦</button>
          <div v-show="!btn3" class="submenu">
            <button @click="btn3 = true" class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button class="submenu-button" @click="drawFree" id="btn-free-drawing">画笔</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" @click="drawLine" id="btn-line-drawing">线笔</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" @click="showBtn3Item(1)" id="btn-change-size">粗细</button>
                <div class="hiddenmenu" v-show="btn3Text">
                  <input
                    @change="drawSizeChange"
                    v-model="drawTextSizeVal"
                    id="input-brush-range"
                    type="range"
                    min="10"
                    max="100"
                    value="24"
                  />
                </div>
              </li>
              <li class="menu-item">
                <button
                  class="submenu-button"
                  @click="showBtn3Item(2)"
                  id="btn-change-text-color"
                >颜色</button>
                <div class="hiddenmenu" v-show="btn3Color">
                  <div ref="tuiBrushColorPicker" id="tui-brush-color-picker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button @click="saveUrlData" class="menu-button">保存</button>
        </li>
        <li class="menu-item">
          <button @click="cancelUrlData" class="menu-button">取消</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// Load Style Code
import axios from 'axios';
import 'tui-image-editor/dist/tui-image-editor.css';
import './imgEditor/css/service-mobile.css';
import './imgEditor/css/tui-color-picker.css';
import 'tui-color-picker/dist/tui-color-picker.css';

import ImageEditor from 'tui-image-editor';
import ColorPicker from 'tui-color-picker';
import { TransferDomDirective as TransferDom, XHeader, Loading, Icon, Toast } from 'vux';
import apiRouter from '../../config/api';
import IEditorPanZoom from './imgEditor/panZoom';

const includeUIOptions = {
	includeUI: {
		initMenu: 'filter',
	},
};

const editorDefaultOptions = {
	cssMaxWidth: 700,
	cssMaxHeight: 500,
};

export default {
	directives: {
		TransferDom,
	},
	components: {
		XHeader,
		Loading,
		Icon,
		Toast,
	},

	data() {
		return {
			btnUndoDisable: false,
			btnRedoDisable: true,

			imgUrl: '',
			activeObjectId: '',
			textColorpicker: {},
			brushColorpicker: {},

			$inputTextSizeRange: {},
			textSizeVal: '30',
			drawTextSizeVal: '6',

			dataUrl: '',
			options: {
				includeUI: {
					loadImage: {
						path: '',
						name: 'sampleImage2',
					},
				},
				cssMaxWidth: 700,
				cssMaxHeight: 500,
			},
			btn1: true,
			btn1Color: false,
			btn1Text: false,

			btn2: true,
			btn3: true,
			btn3Color: false,
			btn3Text: false,
			btn4: true,
		};
	},
	mounted() {
		let options = {};
		let _this = this;
		options = {
			// includeUI: {
			// 	initMenu: 'draw',
			// 	menuBarPosition: 'bottom',
			// },
			cssMaxWidth: document.documentElement.clientWidth,
			cssMaxHeight: document.documentElement.clientHeight,
			selectionStyle: {
				cornerSize: 50,
				rotatingPointOffset: 100,
			},
			usageStatistics: false,
		};
		this.editorInstance = new ImageEditor(this.$refs.tuiImageEditor, options);
		this.addEventListener();

		this.$inputTextSizeRange = this.$refs.inputTextSizeRange;

		// Bind custom event of image editor
		this.editorInstance.on({
			undoStackChanged: function(length) {
				if (length) {
					_this.btnUndoDisable = false;
				} else {
					_this.btnUndoDisable = true;
				}
			},
			redoStackChanged: function(length) {
				if (length) {
					_this.btnRedoDisable = false;
				} else {
					_this.btnRedoDisable = true;
				}
			},
			objectScaled: function(obj) {
				if (obj.type === 'text') {
					//_this.$inputTextSizeRange.val(obj.fontSize);
					_this.textSizeVal = obj.fontSize;
				}
			},
			objectActivated: function(obj) {
				_this.activeObjectId = obj.id;
				if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
					//showSubMenu('shape');
					//setShapeToolbar(obj);
					//activateShapeMode();
				} else if (obj.type === 'icon') {
					//showSubMenu('icon');
					//setIconToolbar(obj);
					//activateIconMode();
				} else if (obj.type === 'text') {
					// showSubMenu('text');
					// setTextToolbar(obj);
					// activateTextMode();
				}
			},
		});

		this.initTool();
		// debugger;
		new IEditorPanZoom(this.editorInstance).enable();
	},
	activated() {
		let test = this.$route.query.test;
		if (test) {
			let imgUrl = '/static/sampleImage.jpg';
			this.initImg(imgUrl);
		}
	},
	destroyed() {
		Object.keys(this.$listeners).forEach((eventName) => {
			this.editorInstance.off(eventName);
		});
		this.editorInstance.destroy();
		this.editorInstance = null;
	},

	methods: {
		btnUndo() {
			let vm = this;
			vm.editorInstance.undo();
		},
		btnRedo() {
			let vm = this;
			vm.editorInstance.redo();
		},
		initTool() {
			let vm = this;
			//调色板  $('#tui-text-color-picker')[0],
			this.textColorpicker = ColorPicker.create({
				container: this.$refs.tuiTextColorPicker,
				color: '#FF0000',
			});

			this.textColorpicker.on('selectColor', function(event) {
				vm.editorInstance.changeTextStyle(vm.activeObjectId, {
					fill: event.color,
				});
			});

			this.brushColorpicker = ColorPicker.create({
				container: vm.$refs.tuiBrushColorPicker,
				color: '#FF0000',
			});

			this.brushColorpicker.on('selectColor', function(event) {
				debugger;
				vm.editorInstance.setBrush({
					color: vm.hexToRGBa(event.color, 0.5),
				});
			});
		},

		initImg(imgUrl) {
			let imageEditor = this.editorInstance;
			imageEditor.loadImageFromURL(imgUrl, 'SampleImage').then(function() {
				imageEditor.clearUndoStack();
			});
		},
		saveUrlData2() {
			this.$emit('finishEdit', '');
		},
		cancelUrlData() {
			this.$emit('cancelEdit', '');
		},

		saveUrlData() {
			let imageEditor = this.editorInstance;
			//multiplier: 0.5,
			let dataURL = imageEditor.toDataURL({
				format: 'jpeg',
				quality: 0.7,
			});
			console.log(dataURL);
			console.log(this.getImgByteSize(dataURL) / 1024);
			debugger;
			let data = { baseImg: dataURL };

			let vm = this;
			vm.$vux.loading.show({
				text: '上传中...',
			});

			let formData = new FormData();
			formData.append('baseImg', dataURL);

			// this.$http.post(apiRouter.POST_HOMEWORK_FILE, data)

			axios.post(apiRouter.POST_HOMEWORK_FILE, formData).then(
				(response) => {
					debugger;
					vm.$vux.loading.hide();
					if (response.data.code === 200) {
						vm.$vux.toast.text('图片上传成功!');
						vm.$emit('finishEdit', response.data.data);
					} else {
						vm.$vux.toast.text(response.data.message);
						vm.$vux.loading.hide();
					}
				},
				(response) => {
					alert('请求失败了!!!!');
				}
			);
			this.dataUrl = dataURL;
		},
		getImgSize(base64url) {
			//获取base64图片大小，返回KB数字
			let str = base64url.replace('data:image/jpeg;base64,', ''); //这里根据自己上传图片的格式进行相应修改

			let strLength = str.length;
			let fileLength = parseInt(strLength - (strLength / 8) * 2);

			// 由字节转换为KB
			let size = '';
			size = (fileLength / 1024).toFixed(2);

			return parseInt(size);
		},

		getImgByteSize(graphicContents) {
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
		},

		// -----------------------------------------------------------------------------------------------------------------------------------------
		addText() {
			let initText = '正确';
			this.btn1 = false;
			this.editorInstance.startDrawingMode('TEXT');
			this.editorInstance.addText(initText, {
				styles: {
					fontSize: parseInt('50', 10),
					fill: '#FF0000',
				},
			});
		},
		btn1SizeChange() {
			debugger;
			this.editorInstance.changeTextStyle(activeObjectId, {
				fontSize: parseInt($(this).val(), 10),
			});
		},

		showBtn1Item(e) {
			if (e == 1) {
				this.btn1Text = true;
				this.btn1Color = false;
			} else {
				this.btn1Color = true;
				this.btn1Text = false;
			}
		},
		textSizeChange() {
			let vm = this;
			vm.editorInstance.changeTextStyle(vm.activeObjectId, {
				fontSize: parseInt(vm.textSizeVal, 10),
			});
		},
		rotateImg(e) {
			this.editorInstance.rotate(e);
		},
		showBtn3Item(e) {
			if (e == 1) {
				this.btn3Text = true;
				this.btn3Color = false;
			} else {
				this.btn3Color = true;
				this.btn3Text = false;
			}
		},

		hexToRGBa(hex, alpha) {
			var r = parseInt(hex.slice(1, 3), 16);
			var g = parseInt(hex.slice(3, 5), 16);
			var b = parseInt(hex.slice(5, 7), 16);
			var a = alpha || 1;

			return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
		},
		drawSizeChange(e) {
			let vm = this;

			var brushWidth = vm.drawTextSizeVal;
			vm.editorInstance.setBrush({
				width: brushWidth,
			});
			// vm.editorInstance.changeTextStyle(vm.activeObjectId, {
			//   fontSize: parseInt(vm.drawTextSizeVal, 10)
			// });
		},
		getBrushSettings() {
			let vm = this;
			var brushWidth = vm.drawTextSizeVal;
			var brushColor = vm.brushColorpicker.getColor();
			return {
				width: brushWidth,
				color: vm.hexToRGBa(brushColor, 0.5),
			};
		},

		drawFree() {
			let settings = this.getBrushSettings();
			this.editorInstance.stopDrawingMode();
			this.editorInstance.startDrawingMode('FREE_DRAWING', settings);
		},

		drawLine() {
			let settings = this.getBrushSettings();
			this.editorInstance.stopDrawingMode();
			this.editorInstance.startDrawingMode('LINE_DRAWING', settings);
		},

		addEventListener() {
			Object.keys(this.$listeners).forEach((eventName) => {
				this.editorInstance.on(eventName, (...args) => this.$emit(eventName, ...args));
			});
		},
		getRootElement() {
			return this.$refs.tuiImageEditor;
		},
		invoke(methodName, ...args) {
			let result = null;
			if (this.editorInstance[methodName]) {
				result = this.editorInstance[methodName](...args);
			} else if (methodName.indexOf('.') > -1) {
				const func = this.getMethod(this.editorInstance, methodName);

				if (typeof func === 'function') {
					result = func(...args);
				}
			}

			return result;
		},
		getMethod(instance, methodName) {
			const { first, rest } = this.parseDotMethodName(methodName);
			const isInstance = instance.constructor.name !== 'Object';
			const type = typeof instance[first];
			let obj;

			if (isInstance && type === 'function') {
				obj = instance[first].bind(instance);
			} else {
				obj = instance[first];
			}

			if (rest.length > 0) {
				return this.getMethod(obj, rest);
			}

			return obj;
		},
		parseDotMethodName(methodName) {
			const firstDotIdx = methodName.indexOf('.');
			let firstMethodName = methodName;
			let restMethodName = '';

			if (firstDotIdx > -1) {
				firstMethodName = methodName.substring(0, firstDotIdx);
				restMethodName = methodName.substring(firstDotIdx + 1, methodName.length);
			}

			return {
				first: firstMethodName,
				rest: restMethodName,
			};
		},
	},
};
</script>
<style scoped>
.imageEditorApp {
	width: 100%;
	height: 600px;
}
</style>
<style>
/* To prevent image jumping issue required to override top position of .tui-image-editor.*/

.tui-image-editor {
	top: 0px !important;
}

.tui-image-editor-container .svg_ic-menu {
	/*            width: 24px;*/
	/*            height: 24px;*/
}

.tui-image-editor-controls {
	/*position: absolute;
              display: block;
              top: 0;
              left: 0;
              width: calc(120vw);
              max-height: 750px;
              margin: 0;
              padding-top: 1px;
              background: #abc;
              overflow-y: auto;
              overflow-x: hidden;
              transform: rotate(-90deg) translateY(-100px);
              transform-origin: right top;*/
}

.tui-image-editor-controls > .card {
	/*display: block;
              transform: rotate(90deg);
              transform-origin: right top; */
}

.tui-image-editor-container.left .tui-image-editor-controls {
	width: 64px;
	height: 100%;
	display: list-item;
	overflow-x: hidden; /* broken tooltips*/
	overflow-y: scroll;
	top: 0;
}

.tui-image-editor-container.bottom .tui-image-editor-controls {
	width: 100%;
	display: list-item;
	overflow-x: scroll; /* broken tooltips*/
	overflow-y: hidden;
	left: 0;
}

.tui-image-editor-container.bottom .tui-image-editor-menu {
	display: list-item;
	margin-top: 10px;
}

/*
        .tui-image-editor-item:hover:after{
            border-bottom:0;
            display:block !important;
            position:absolute !important;
            width:10em !important;
            border:1px solid red;
            background-color:#feffe1; color:#6e7044;
            text-align: center;
            margin:-1.8em 0 0 -1.6em;
        }
*/
/* broken tooltips ref, http://jsfiddle.net/1bz0v4ny/  . http://jsfiddle.net/dsczxkpf/4/ */
li.tui-image-editor-item:after,
li.tui-image-editor-item:before {
	display: none !important;
}

.tooltip {
	position: absolute;
	left: 60px;
	/*            background-color: red;*/
	background-color: #2f2f2f;
	z-index: 100;

	display: inline-block;
	color: #fff;
	padding: 5px 8px;
	font-size: 11px;
	font-weight: lighter;
	border-radius: 3px;
	max-height: 23px;
	top: -25px;
	min-width: 24px;
}
</style>
