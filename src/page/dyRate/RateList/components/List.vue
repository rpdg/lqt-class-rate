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
        <a :class="item.STATUS==='0'?'btn-red':item.STATUS==='1'?'btn-green':'btn-gray'">{{item.STATUS_NAME}}</a>
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
    background-color: #ed431e;
    border-radius: 100%;
    position: absolute;
    top: -3px;
    bottom: auto;
    left: auto;
  }
}

.message li {
  padding: 0 15px;
  border-bottom: 1px solid @colorDD;
  height: 80px;
  position: relative;
}

.message-icon {
  width: 50px;
  height: 50px;
  background: url("./dyRate07.png") no-repeat left;
  background-size: 100% 100%;
  position: absolute;
  top: 15px;
  left: 15px;
  border-radius: 3px;
}

.message-info {
  margin-left: 63px;
  margin-right: 50px;
  padding-top: 20px;
  display: block;
}

.message-info h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
  font-size: @fontSize30;
  color: @color42;
}

.message-info p {
  font-size: @fontSize24;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 5px;
}

.message-handle {
  position: absolute;
  top: 15px;
  right: 15px;
  text-align: right;
}

.message-handle a {
  padding-top: 4px;
  padding-bottom: 4px;
  display: block;
}
.btn-red {
  color: #ed431e;
}
.btn-green {
  color: @green;
}
.btn-gray {
  color: @color-gray;
}
</style>
