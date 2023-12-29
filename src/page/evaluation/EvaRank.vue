<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">{{mapData.TITLE1}}
        </x-header>
        <h2 class="tab-check" style="text-align: center;padding-top: 12px;font-size: 1.4em;margin-top: 1.8rem;" >{{mapData.TITLE2}}</h2>

        <van-tabs v-model="sltTab" @click="switchTabItem">
            <van-tab v-for="(item, index) in typeList" :title="item.NAME" :name="index" :key="index"></van-tab>
        </van-tabs>

        <ul class="message" ref="onScoll" v-if="mapData.STU_IDX != hideIndex">
            <li class="clearfix" v-for="(news,index) in dataList"  :key="index">
                <div  class="message-icon">
                    <img v-if="news.IDX==1" class="top3-icon" src="@/assets/eval/1th.png"/>
                    <img v-else-if="news.IDX==2" class="top3-icon" src="@/assets/eval/2th.png"/>
                    <img v-else-if="news.IDX==3" class="top3-icon" src="@/assets/eval/3th.png"/>
                    <div style="height: 60px;line-height: 60px;text-align: center;font-size: 0.8rem;" v-else>{{news.IDX}}</div>
                </div>

                <a href="javascript:void(0);" class="message-info">
                    <img class="avatar" :src="news.AVATAR">
                    <h3>{{ news.STUDENT_NAME }}</h3>
                </a>
                <div class="message-handle">
                    <a class="publishBtn">{{ news.SUM_VAL }} 分</a>
                </div>
            </li>
        </ul>
        <ul v-else>
            <div class="clearfix myself-message" style="position: initial">
                <div class="message-icon">
                </div>
                <a href="javascript:void(0);" class="message-info" style="padding-top: 0;margin-right: 0">
                    <img class="avatar" :src="myInfo.AVATAR">
                    <h3 style="vertical-align: super;width: auto;">
                        {{ myInfo.NAME }}
                        <div style="margin-top: 8px;color: #777777">我的本{{ycbType=='WEEK'?'周':'学期'}}积分:{{ myInfo.SCORE }} 分</div>
                    </h3>
                </a>
            </div>
        </ul>

        <div v-if="myInfo.IDX && mapData.STU_IDX != hideIndex" class="clearfix myself-message">
            <div class="message-icon">
                <img v-if="myInfo.IDX == 1" class="top3-icon" src="@/assets/eval/1th.png"/>
                <img v-else-if="myInfo.IDX == 2" class="top3-icon" src="@/assets/eval/2th.png"/>
                <img v-else-if="myInfo.IDX == 3" class="top3-icon" src="@/assets/eval/3th.png"/>
                <div style="height: 60px;line-height: 60px;text-align: center;font-size: 0.8rem;" v-else>{{myInfo.IDX}}</div>
            </div>


            <a href="javascript:void(0);" class="message-info" style="padding-top: 0;margin-right: 0">
                <img class="avatar" :src="myInfo.AVATAR">
                <h3 style="vertical-align: super;width: auto;">
                    {{ myInfo.NAME }}
                    <div style="margin-top: 8px;color: #777777">我的本{{ycbType=='WEEK'?'周':'学期'}}积分:{{ myInfo.SCORE }} 分</div>
                </h3>
            </a>
        </div>

        <div v-transfer-dom>
            <confirm
                v-model="popup"
                :close-on-confirm="false"
                :title="('确定删除作业？删除后无法恢复数据？')"
                @on-confirm="onConfirm()"
                confirmText="是，我要删除"
            >
            </confirm>
        </div>

        <div class="releaseBtn">
            <h1 class="typeBtn" @click="changeYcbType()">切到 {{ycbType=='WEEK'?'学期':'周'}}榜</h1>
        </div>

        <toast
            v-model="showPositionValue"
            type="text"
            :time="800"
            is-show-mask
            width="140px"
            :position="position"
        >
            {{ toastMessage }}
        </toast>
    </div>
</template>

<script>
import {Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader, Cell, Toast} from 'vux'
import Back from "../../components/common/Back.vue"
import {Tab, Tabs} from 'vant'
import apiRouter from "../../config/api.js"
import {mapMutations} from 'vuex'

export default {
    directives: {
        TransferDom
    },
    components: {
        Back,
        Confirm,
        Group,
        XSwitch,
        XButton,
        XHeader,
        Cell,
        Toast,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
    },
    mounted() {

    },
    activated() {
        this.page = 1;
        this.evalId = this.$route.query.evalId;
        this.classId = this.$route.query.classId;
        let userInfoStr = window.localStorage.getItem("USER");
        this.userInfo = JSON.parse(userInfoStr);
        this.loadData();
    },
    data() {
        return {
            hideIndex:0,
            myInfo:{},
            userInfo:{},
            usertype:'',
            mapData:{},
            sltTab:0,
            typeList:[],
            dataList:[],
            ycbType:'WEEK', //WEEK（周榜） OR TERM（学期榜）
            typeCode:'0',
            courseId: '',
            courseTitle: '',
            showPositionValue: false,
            position: 'default',
            toastMessage: '',
            messageData: [],
            otherCategoryList: [],
            topListCategory: [],
            //课程状态
            active: 0,
            allCategoryList: [],
            totalCourselist: [],
            checkObj: {
                finalList: [],
                noDoList: [],
            },
            currentIndex:0,
            selectTab: 0,
            id: '',
            page: 1,
            pageCount: 1,
            pageLoading: false,
            popup: false,
            isShow: false,
            showItemNumber: -1,
            isEndReached: false,
            totalPage: 1,
            needShow: false,
            lastShow: false,
            wwwUrl: roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId='
        }
    },
    methods: {
        switchTabItem(e){
            this.currentIndex = e;
            let item = this.typeList[e];
            this.typeCode = item.CODE;
            this.loadData(item.CODE);
        },
        goCheck(e) {
            let vm = this;
            this.$router.push({
                path: '/ele-std',
                query: {courseTitle: vm.courseTitle, courseId: vm.courseId, checkMainId: e.ID}
            })

        },
        changeYcbType() {
            let vm = this;
            //vm.sltTab = 0;
            if(vm.ycbType == 'WEEK'){
                vm.ycbType = 'TERM';
            }else{
                vm.ycbType = 'WEEK';
            }
            let typeCode = vm.typeCode;
            this.loadData(typeCode);
        },
        goBack() {
            this.$router.push({path:"/eval-sList", query:{bk: 1}});

            // let userType = window.localStorage.getItem("USER_TYPE");
            // let singleFlag = this.$route.query.singleFlag;
            // if (userType == 'T_TEACHER' && !singleFlag){
            //     this.$router.push({path:"/eval-sList"});
            // } else{
            //     this.$router.push({path:"/"});
            // }
        },
        goDetail(e) {
            this.$router.push({path: '/cur-enroll', query: {courseId: e.courseId}})
        },

        loadDataNext() {
            let vm = this;
            let evalId = this.$route.query.evalId;
            let classId = this.$route.query.classId;
            let typeCode = this.typeCode;
            this.$http.get(apiRouter.GET_TEA_YCB_CLASS_VIEW + "?eval_id=" + evalId + '&class_id=' + classId + '&ycb_type='+vm.ycbType+"&type_code="+typeCode).then(response => {
                if (response.body.code === 200) {
                    let mapData = response.body.data;
                    vm.mapData = mapData;
                    let dataList = mapData.DATA_LIST;
                    vm.typeList = mapData.TYPE_LIST;
                    vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
                    vm.mapData = mapData;

                    vm.dataList = vm.dataList.concat(dataList);
                    //vm.dataList.concat(dataList);
                } else {
                    alert(response.body.message);
                }
            }, error => {

            });

        },
        loadData(code) {
            let vm = this;
            vm.messageData = [];
            let evalId = this.$route.query.evalId;
            let classId = this.$route.query.classId;
            let typeCode = '0'; //type_list
            if(code){
                typeCode = code;
            }

            let usertype = window.localStorage.getItem('USER_TYPE');
            this.usertype = usertype;

            this.$http.get(apiRouter.GET_TEA_YCB_CLASS_VIEW + "?eval_id=" + evalId + '&class_id=' + classId + '&ycb_type='+vm.ycbType+"&type_code="+typeCode).then(response => {
                if (response.body.code === 200) {
                    let mapData = response.body.data;
                    vm.mapData = mapData;
                    let dataList = mapData.DATA_LIST;
                    vm.typeList = mapData.TYPE_LIST;
                    vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
                    vm.dataList = dataList;
                    vm.mapData = mapData;
                    if(mapData.STU_ID){
                        vm.myInfo = {
                            ID: mapData.STU_ID,
                            IDX: mapData.STU_IDX,
                            SCORE: mapData.STU_SCORE,
                            AVATAR:mapData.STU_AVATAR,
                            NAME:mapData.STU_NAME,

                        }
                    }

                    // dataList.forEach(v=>{
                    //     if(vm.userInfo.userId == v.STUDENT_ID || vm.userInfo.studentId == v.STUDENT_ID){
                    //         vm.myInfo = v;
                    //     }
                    // });
                    //vm.dataList.concat(dataList);
                } else {
                    alert(response.body.message);
                }
            }, error => {

            });

            if(usertype =='T_TEACHER'){
                // this.$http.get(apiRouter.GET_TEA_YCB_CLASS_VIEW + "?eval_id=" + evalId + '&class_id=' + classId + '&ycb_type='+vm.ycbType+"&type_code="+typeCode).then(response => {
                //     if (response.body.code === 200) {
                //         let mapData = response.body.data;
                //         let dataList = mapData.DATA_LIST;
                //         vm.typeList = mapData.TYPE_LIST;
                //         vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
                //         vm.dataList = dataList;
                //         vm.mapData = mapData;
                //         //vm.dataList.concat(dataList);
                //     } else {
                //         alert(response.body.message);
                //     }
                // }, error => {
                //     debugger;
                // });
            }else{

                // this.$http.get(apiRouter.GET_STU_YCB_CLASS_VIEW + "?eval_id=" + evalId  + '&ycb_type='+vm.ycbType+"&type_code="+typeCode).then(response => {
                //     if (response.body.code === 200) {
                //         let mapData = response.body.data;
                //         let dataList = mapData.DATA_LIST;
                //         vm.typeList = mapData.TYPE_LIST;
                //         vm.pageCount = Math.ceil(response.body.data.pageCount / 10);
                //         vm.dataList = dataList;
                //         vm.mapData = mapData;
                //
                //     } else {
                //         alert(response.body.message);
                //     }
                // }, error => {
                //     debugger;
                // });
            }


        },
        nextPage() {
            let _this = this;
            _this.page = _this.page + 1;
            _this.loadDataNext();
        },
    },

}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';
.myself-message{
    //height: 160/@baseSize;
    width: 100%;
    position: fixed;
    bottom: -2px;
    background-color: #DCEDC8;
    .mixin-padding(30/@baseSize, 30/@baseSize);
}
.message {
    width: 100%;
    margin-bottom: 160/@baseSize;
}

.message li {
    .mixin-padding(30/@baseSize, 30/@baseSize);
    border-bottom: 1px solid @colorDD;
    //height: 160/@baseSize;
    position: relative;
}

.message-icon {
    width: 100/@baseSize;
    height: 100/@baseSize;
    background-size: 100% 100%;
    position: absolute;
    top: 30/@baseSize;
    left: 30/@baseSize;
    border-radius: 3px;
    text-align: center;
}

.message-icon1 {
    background: url("../../assets/eval/1th.png");
}

.message-icon2 {
    background: url("../../assets/eval/2th.png");
}

.message-icon3 {
    background: url("../../assets/eval/3th.png");
}

.avatar{
    border-radius: 30px;
    width: 60px;
    height: 60px;
}


.message-info {
    margin-left: 125/@baseSize;
    margin-right: 100/@baseSize;
    padding-top: 12px;
    display: block;
}

.message-info h3 {
    display: inline-block;
    width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    //line-height: 40/@baseSize;
    font-size: @fontSize30;
    color: @color42;
    height: 65px;
    //vertical-align: middle;
    line-height: 100%;
    margin-left: 20px;
    vertical-align: top;
    line-height: 100%;
    margin-left: 20px;
    padding-top: 20px;
}

.message-info p {
    font-size: @fontSize24;
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 10/@baseSize;;
}

.message-handle {
    position: absolute;
    top: 50/@baseSize;
    right: 30/@baseSize;
    text-align: right;
}

.message-handle a {
    padding-top: 8/@baseSize;
    padding-bottom: 8/@baseSize;
    display: block;
    font-size: 1em;
}

.edlit-molde {
    width: 172/@baseSize;
    height: 142/@baseSize;
    position: absolute;
    right: 130/@baseSize;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 60/@baseSize;
    z-index: 9;
}

.edlit-molde a {
    padding-bottom: 16/@baseSize;
    padding-top: 20/@baseSize;
    display: block;
    font-size: @fontSize24;
}

.edlit-molde a.revamp {
    color: #2196F3;

}

.edlit-molde a.revamp em {
    width: 22/@baseSize;
    height: 23/@baseSize;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 5/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 10/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

a.delete em {
    width: 18/@baseSize;
    height: 22/@baseSize;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 5/@baseSize;
    margin-left: 30/@baseSize;
    margin-right: 10/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #FF5E5E;
}

a.delete {
    color: #FF5E5E;
}

.publis {
    color: #F09709;
}

.inform {
    color: #48B319;
}

.lose {
    color: #9B9B9B;
}

.weui-dialog__title {
    font-size: @fontSize34;
    color: #333333;
}

.moreData, .lastShow {
    height: 80/@baseSize;
    line-height: 80/@baseSize;
    text-align: center;

}

.moreData span {
    height: 50/@baseSize;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 45/@baseSize;
}


.back-div {
    padding-bottom: 100/@baseSize;
}

.up-back {
    width: 100%;
    height: 100/@baseSize;
    font-size: @fontSize36;
    line-height: 100/@baseSize;
    color: @white;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}


.pubisnBtn {
    color: #E12727
}

.title-header {
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
    z-index: 2;
    border-bottom: solid 1px #dedede;
}

.title-header /deep/ .vux-header-title {
    color: #333;
    line-height: 46px;

}

.title-header /deep/ .vux-header-back {
    color: #38f;
}

.title-header /deep/ .left-arrow:before {
    border-color: #38f !important;
}

.tab-check {
    margin-top: 100/@baseSize;
}

.box /deep/ .van-tab--active {
    color: #48b319;

}

.box /deep/ .van-tabs__line {
    background-color: #48b319;

}

.box /deep/ .van-tab {
    border-bottom: 1px solid #DDDDDD;
}

.typeBtn {
    //width: 4.2em;
    //height:  4.2em;
    //line-height: 1.2em;
    width: 125 / @baseSize;
    height: 125 / @baseSize;
    line-height: 40 / @baseSize;
    text-align: center;
    border-radius: 50%;
    font-size: 30 / @baseSize;
    color: @white;
    position: fixed;
    bottom: 150/@baseSize;
            //45 / @baseSize;
    right: 40 / @baseSize;
    //background-color: #e7524eeb;
    background-color: rgba( 231,82,78,0.86);
    z-index: 10;
    padding: 20 / @baseSize  15 / @baseSize;
        //15px 9px;
    //padding-top: 10px;
}


.more-title {
    line-height: 45px;
    padding-bottom: 20px;
    text-align: center;
    color: #999;
    //font-size: .26rem
}

.more-title a {
    display: block;
    line-height: 40px;
    color: #999
}


.top3-icon{
    height: 40px;
    vertical-align: text-top;
    margin-top: 5px;
}
.clearfix{
    //height: 80px;
}

.van-tab{
    font-size: 18px;
}
</style>
