<template>
  <ul class="message">
    <li class="clearfix" v-for="item in listData" :key="item.ID">
      <div :class="`message-icon ${item.STATUS==='0'?'new':''}`"></div>
      <a
        href="javascript:void(0);"
        @click="goCheck(item.ID , item.TASK_NAME1 ,item.F_DETAIL_ID, item.F_CLASS_ID)"
        class="message-info"
      >
        <h3>{{item.TASK_NAME}}</h3>
        <p>{{item.DEPT_NAME}}</p>
      </a>
      <div class="message-handle">
        <a class="inform btn-gray">{{item.END_DATE}}</a>
        <a :class="item.STATUS==='0'?'btn-red':'btn-gray'">{{item.STATUS_NAME}}</a>
      </div>
    </li>
  </ul>
</template>

<script>
import { ViewBox } from "vux";

export default {
  components: {
    ViewBox
  },
  props: {
    listData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    goCheck(id, title, foId, fcId) {
      this.$router.push({
        path: "/dyrate-form",
        query: {
          id,
          title,
          foId,
          fcId
        }
      });
    }
  }
};
</script>
    
<style lang="less" scoped>
@import "../../../../style/minxin.less";
@color-gray: #a7a7a7;

.message {
  width: 100%;

  .new::before {
    right: -3px;
    content: "";
    width: 8px;
    height: 8px;
    background-color: #ff4d33;
    border-radius: 100%;
    position: absolute;
    top: -3px;
    bottom: auto;
    left: auto;
  }
}

.message li {
  .mixin-padding(30 / @baseSize, 30 / @baseSize);
  border-bottom: 1px solid @colorDD;
  height: 160 / @baseSize;
  position: relative;
}

.message-icon {
  width: 100 / @baseSize;
  height: 100 / @baseSize;
  background: url("./dyRate07.png") no-repeat left;
  background-size: 100% 100%;
  position: absolute;
  top: 30 / @baseSize;
  left: 30 / @baseSize;
  border-radius: 3px;
}

.message-info {
  margin-left: 125 / @baseSize;
  margin-right: 100 / @baseSize;
  padding-top: 40 / @baseSize;
  display: block;
}

.message-info h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 40 / @baseSize;
  font-size: @fontSize30;
  color: @color42;
}

.message-info p {
  font-size: @fontSize24;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 10 / @baseSize;
}

.message-handle {
  position: absolute;
  top: 30 / @baseSize;
  right: 30 / @baseSize;
  text-align: right;
}

.message-handle a {
  padding-top: 8 / @baseSize;
  padding-bottom: 8 / @baseSize;
  display: block;
}
.btn-red {
  color: #ff5e5e;
}
.btn-gray {
  color: @color-gray;
}
</style>
