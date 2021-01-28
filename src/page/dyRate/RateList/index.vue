<template>
    <div class="box">
      <back-title-bar title="班级综评列表" />
      <div class="wapper">
        <van-list v-model="loading" :finished="finished" @load="fetchList">
            <rate-list v-if="listData" :listData="listData" />
        </van-list>
      </div>
    </div>
</template>
<script>
import { ViewBox } from "vux";
import { Loading, List } from "vant";
import BackTitleBar from "../../../components/common/BackTitleBar";
import RateList from "./components/List";
import apiRouter from "../../../config/api.js";

async function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

export default {
  components: {
    ViewBox,
    BackTitleBar,
    [Loading.name]: Loading,
    [List.name]: List,
    RateList
  },
  data() {
    return {
      loading: false,
      finished: false,
      listData: [],
      pageIndex: 0
    };
  },
  async activated() {
    // console.log("list-length: ", this.listData.length);
    this.loading = false;
    this.finished = false;
    this.listData = [];
    this.pageIndex = 0;

    this.fetchList();
  },
  methods: {
    async fetchList() {
      ++this.pageIndex;
      // console.log("list", this.$http);

      // this.loading = true;
      // await delay(3e3);
      // this.listData.push(...testData);

      try {
        let resp = await this.$http.get(
          `${apiRouter.CLASS_RATE_LIST}?page_index_str=${this.pageIndex}`
        );
        // console.log(resp);
        // debugger;
        if (resp.status === 200) {
          let response = resp.body;
          if (response.code === 200) {
            this.listData.push(...response.data.page_list);
            this.loading = false;
            if (response.data.pageIndex + 1 === response.data.pageCount) {
              this.finished = true;
            }
          } else {
            alert(response.message);
          }
        } else {
          alert("请求失败!");
        }
      } catch (e) {
        alert(e.message);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../style/minxin.less";
.wapper {
  position: absolute;
  top: 47px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
}
</style>
