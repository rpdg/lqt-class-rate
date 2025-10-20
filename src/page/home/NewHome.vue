<template>
    <div class="layoutMain" v-if="loaded">
        <TabTopHeader :noticeUrl="noticeUrl" :spaceUrl="spaceUrl" :userType="userType" />

        <div class="pannelContainer">

            <!-- pinned icons -->
            <div v-if="topList.length > 0" class="pannel">
                <div class="container">
                    <HomeIcon v-for="(icon) in topList" :key="'t_' + icon.code" :name="icon.name" :code="icon.code"
                        :deptCode="icon.dept_code || ''" :iconUrl="icon.iconUrl" :color="icon.color"
                        :pageUrl="icon.pageUrl" />
                </div>
            </div>

            <!-- module icons -->
            <div class="pannel" v-for="(menu) in menuList" :key="menu[ 'MENU_CODE' ]">
                <div class="title">{{ menu[ 'MENU_NAME' ] }}</div>
                <div class="container">
                    <HomeIcon v-for="(icon) in fullData[ menu[ 'MENU_CODE' ] ]" :key="icon.code" :name="icon.name"
                        :code="icon.code" :deptCode="icon.dept_code || ''" :iconUrl="icon.iconUrl" :color="icon.color"
                        :pageUrl="icon.pageUrl" />
                </div>
            </div>

        </div>

        <Draggable><Fab v-if="isTeach" /></Draggable>
    </div>
</template>

<script>
import Draggable from "../../components/common/Draggable.vue";
import TabTopHeader from './components/TabTopHeader.vue';
import HomeIcon from './components/HomeIcon.vue';
import Fab from './components/Fab.vue';
import apiRouter from '../../config/api.js';
import wx from "weixin-js-sdk";
import authonStore from '../../utils/authonStore';

export default {
    components: {
        Draggable,
        Fab,
        HomeIcon,
        TabTopHeader,
    },
    data() {
        return {
            loaded: false,
            spaceUrl: '',
            noticeUrl: '',
            urlPath: encodeURIComponent(window.location.href.split('#')[ 0 ]),
            userType: '',
            isTeach: false,
            fullData: null,
            menuList: [],
            topList: [],
        };
    },
    mounted() {
        window.localStorage.removeItem('lqt_login_errorTimes');
        this.configWx();
    },
    activated() {
        document.title = "绿蜻蜓";
        this.loadData();
    },
    methods: {
        loadData() {
            this.$http.post(apiRouter.GET_LIST + '?__=' + Date.now()).then(function (response) {
                if (response.body.status === 200) {
                    const res = response.body.data;
                    authonStore.setupData(res);
                    this.spaceUrl = res.spaceUrl;
                    this.noticeUrl = res.noticeUrl;
                    this.userType = res.userType;
                    let isTeach = res.userType;
                    window.localStorage.setItem('USER_TYPE', isTeach);
                    if (isTeach === 'T_TEACHER') {
                        this.isTeach = true;
                    } else {
                        this.isTeach = false;
                    }
                    this.fullData = res;
                    this.menuList = res.menu_list;
                    this.topList = res.top_list;
                    this.loaded = true;
                }
            });
        },
        configWx() {
            let wxCfgApi = apiRouter.GET_CONFIG + this.urlPath;
            this.$http.get(wxCfgApi).then(response => {
                let data = response.body;
                wx.config({
                    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: [
                        "scanQRCode"
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.checkJsApi({
                    jsApiList: [ 'chooseImage', 'scanQRCode' ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        console.log(res);
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    }
                });

                wx.error(function (res) {
                    //   alert(res)
                });

            }, response => {
                // console.log("请求失败了!!!!")
            });
        },
    }
};
</script>
<style lang="less" type="text/less">
.layoutMain {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.pannelContainer {
    flex: 1;
    overflow: auto;
}

.pannel {
    padding: 20px 15px;
    border-bottom: 10px solid #ededed;
}

.pannel:nth-last-of-type(1) {
    border-color: #fff;
}

.pannel>.title {
    font-size: 14px;
    color: #999;
    margin-bottom: 15px;
}

.pannel>.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 15px;
}
</style>
