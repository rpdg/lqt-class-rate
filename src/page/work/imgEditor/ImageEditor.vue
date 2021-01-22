<template>
  <div style="width: 100%;height: 100%;">

    <div ref="tuiImageEditor" style="width: 100%;height: 100%;"></div>

    <div class="tui-image-editor-controls">
      <ul class="scrollable">
        <li class="menu-item">
          <button class="menu-button" id="btn-crop">Crop</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item"><button class="submenu-button" id="btn-apply-crop">Apply</button></li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button class="menu-button">Orientation</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item"><button class="submenu-button" id="btn-rotate-clockwise">Rotate +90</button></li>
              <li class="menu-item"><button class="submenu-button" id="btn-rotate-counter-clockwise">Rotate -90</button></li>
              <li class="menu-item"><button class="submenu-button" id="btn-flip-x">FilpX</button></li>
              <li class="menu-item"><button class="submenu-button" id="btn-flip-y">FilpY</button></li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button class="menu-button" id="btn-draw-line">Drawing</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button class="submenu-button" id="btn-free-drawing">Free<br>Drawing</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-line-drawing">Line<br>Drawing</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-size">Brush<br>Size</button>
                <div class="hiddenmenu">
                  <input id="input-brush-range" type="range" min="10" max="100" value="50" />
                </div>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-text-color">Brush<br>Color</button>
                <div class="hiddenmenu">
                  <div id="tui-brush-color-picker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button class="menu-button" id="btn-draw-shape">Shape</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button class="submenu-button" id="btn-add-rect">Rectagle</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-add-square">Square</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-add-ellipse">Ellipse</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-add-circle">Circle</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-add-triangle">Triangle</button>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-stroke-size">Stroke<br>Size</button>
                <div class="hiddenmenu">
                  <input id="input-stroke-range" type="range" min="1" max="100" value="10" />
                </div>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-shape-color">Color</button>
                <div class="hiddenmenu">
                  <div class="top">
                    <label for="fill-color"><input type="radio" id="fill-color" name="select-color-type" value="fill" checked="checked" /> Fill</label>
                    <label for="stroke-color"><input type="radio" id="stroke-color" name="select-color-type" value="stroke" /> Stroke</label>
                    <label for="input-check-transparent"><input type="checkbox" id="input-check-transparent">Transparent</label>
                  </div>
                  <div id="tui-shape-color-picker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button class="menu-button">Icon</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item"><button class="submenu-button" id="btn-add-arrow-icon">Arrow<br>Icon</button></li>
              <li class="menu-item"><button class="submenu-button" id="btn-add-cancel-icon">Cancel<br>Icon</button></li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-icon-color">Color</button>
                <div class="hiddenmenu">
                  <div id="tui-icon-color-picker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="menu-item">
          <button class="menu-button" @click="addText" id="btn-add-text">文字</button>
          <div class="submenu">
            <button class="btn-prev">&lt;</button>
            <ul class="scrollable">
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-size">Size</button>
                <div class="hiddenmenu">
                  <input id="input-text-size-range" type="range" min="10" max="240" value="120">
                </div>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-style">Style</button>
                <div class="hiddenmenu">
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="bold"><b>Bold</b></button>
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="italic"><i>Italic</i></button>
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="underline"><u>Underline</u></button>
                </div>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-align">Align</button>
                <div class="hiddenmenu">
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="left">Left</button>
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="center">Center</button>
                  <button class="hiddenmenu-button btn-change-text-style" data-style-type="right">Right</button>
                </div>
              </li>
              <li class="menu-item">
                <button class="submenu-button" id="btn-change-text-color">Color</button>
                <div class="hiddenmenu">
                  <div id="tui-text-color-picker"></div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <p class="msg">Menu Scrolling <b>Left ⇔ Right</b></p>
    </div>

  </div>

</template>
<script>
  import ImageEditor from 'tui-image-editor';

  const includeUIOptions = {
    includeUI: {
      initMenu: 'filter'
    }
  };
  const editorDefaultOptions = {
    cssMaxWidth: 700,
    cssMaxHeight: 500
  };
  export default {
    name: 'TuiImageEditor',
    props: {
      includeUi: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        default() {
          return editorDefaultOptions;
        }
      }
    },
    mounted() {
      let options = editorDefaultOptions;
      // if (this.includeUi) {
      //   options = Object.assign(includeUIOptions, this.options);
      // }
      options = {
        cssMaxWidth: document.documentElement.clientWidth,
        cssMaxHeight: document.documentElement.clientHeight,
        selectionStyle: {
          cornerSize: 50,
          rotatingPointOffset: 100
        }
      }
      this.editorInstance = new ImageEditor(this.$refs.tuiImageEditor, options);
      // Load sample image
      this.addEventListener();
    },
    destroyed() {
      Object.keys(this.$listeners).forEach(eventName => {
        this.editorInstance.off(eventName);
      });
      this.editorInstance.destroy();
      this.editorInstance = null;
    },
    methods: {
      addText(){
        let initText = 'DoubleClick';

        this.editorInstance.startDrawingMode('TEXT');
        this.editorInstance.addText(initText, {
          styles: {
            fontSize: parseInt('120', 10)
          }
        });
      },

      addEventListener() {
        Object.keys(this.$listeners).forEach(eventName => {
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
        const {first, rest} = this.parseDotMethodName(methodName);
        const isInstance = (instance.constructor.name !== 'Object');
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
          rest: restMethodName
        };
      }
    }
  };
</script>
