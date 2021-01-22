
<template>
  <div
    :class="[b(), className]"
    :style="columnStyle"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <ul :style="wrapperStyle">
      <li
        v-for="(option, index) in options"
        v-html="getOptionText(option)"
        :style="optionStyle"
        class="van-ellipsis"
        :class="b('item', {
          disabled: isDisabled(option),
          selected: index === currentIndex
        })"
        @click="setIndex(index, true)"
      />
    </ul>
  </div>
</template>

<script>
import create from '../vant/lib/utils/create';
import deepClone from '../vant/lib/utils/deep-clone';
import { isObj, range } from '../vant/lib/utils';

const DEFAULT_DURATION = 200;

export default create({
  name: 'picker-column',

  props: {
    valueKey: String,
    className: String,
    itemHeight: Number,
    visibleItemCount: Number,
    initialOptions: {
      type: Array,
      default: () => []
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    current:{
      default:0
    }
  },

  data() {
    return {
      startY: 0,
      offset: 0,
      duration: 0,
      startOffset: 0,
      options: deepClone(this.initialOptions),
      currentIndex: this.defaultIndex
    };
  },

  created() {
    this.$parent.children && this.$parent.children.push(this);
    this.setIndex(this.currentIndex);
  },

  destroyed() {
    const { children } = this.$parent;
    children && children.splice(children.indexOf(this), 1);
  },

  watch: {
    defaultIndex() {
      this.setIndex(this.defaultIndex);
    }
  },

  computed: {
    count() {
      return this.options.length;
    },

    baseOffset() {
      return this.itemHeight * (this.visibleItemCount - 1) / 2;
    },

    columnStyle() {
      return {
        height: this.itemHeight * this.visibleItemCount + 'px'
      };
    },

    wrapperStyle() {
      return {
        transition: `${this.duration}ms`,
        transform: `translate3d(0, ${this.offset + this.baseOffset}px, 0)`,
        lineHeight: this.itemHeight + 'px'
      };
    },

    optionStyle() {
      return {
        height: this.itemHeight + 'px'
      };
    }
  },

  methods: {
    onTouchStart(event) {
      this.startY = event.touches[0].clientY;
      this.startOffset = this.offset;
      this.duration = 0;
    },

    onTouchMove(event) {
      //debugger;
      const deltaY = event.touches[0].clientY - this.startY;

      let a = this.startOffset + deltaY;
      let b = -(this.count * this.itemHeight);
      let c = this.itemHeight;


      /*console.log("deltaY:"+deltaY);
      console.log("a:"+a);
      console.log("b:"+b);
      console.log("c:"+c);*/

      this.offset = range(
        a,
        b,
        c
      );
      //console.log("offset:"+this.offset);

    },

    onTouchEnd() {
      if (this.offset !== this.startOffset) {
        this.duration = DEFAULT_DURATION;
        const index = range(
          Math.round(-this.offset / this.itemHeight),
          0,
          this.count - 1
        );
        if( Math.round(-this.offset / this.itemHeight) > index ){
          //debugger;
          this.setIndex(0, true,true);
        }else if( Math.round(-this.offset / this.itemHeight) ==  -1){
          this.setIndex(this.count-1, true,-1);
        }else{
          this.setIndex(index, true);
        }
      }
    },

    adjustIndex(index) {
      index = range(index, 0, this.count);
      for (let i = index; i < this.count; i++) {
        if (!this.isDisabled(this.options[i])) return i;
      }
      for (let i = index - 1; i >= 0; i--) {
        if (!this.isDisabled(this.options[i])) return i;
      }
    },

    isDisabled(option) {
      return isObj(option) && option.disabled;
    },

    getOptionText(option) {
      return isObj(option) && this.valueKey in option
        ? option[this.valueKey]
        : option;
    },

    setIndex(index, userAction,addFlag) {
      index = this.adjustIndex(index) || 0;
      this.offset = -index * this.itemHeight;

      if (index !== this.currentIndex) {
        this.currentIndex = index;
        //index
        userAction && this.$emit('change',this.current,addFlag);
      }
    },

    setValue(value) {
      const { options } = this;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
    },

    getValue() {
      return this.options[this.currentIndex];
    }
  }
});
</script>
