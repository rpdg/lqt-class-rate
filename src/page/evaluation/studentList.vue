<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack" >{{courseTitle}}</x-header>

        <ul ref="onScoll" style="margin-top: 2rem;">
            <li style="width: 33%;display: inline-block;margin-top: 1.2rem" v-for="(item,index) in messageData" :key="index">
               <div style="width: 100%;text-align: center; ">
                   <div @click="editCheck(item)" style="width: 70%;height: 110px;display: inline-block;position: relative;" >
                       <img style="width: 100%;height: 100%" :src="item.AVATAR">
                       <img v-if="item.STATUS != '1'" style="width: 60%;position: absolute;bottom: 0;right: 0;" src="@/assets/curriculum/duty.png">
                   </div>

                   <div>{{item.SHORT_NAME}} {{item.NAME}}</div>
                   <img v-if="!item.REMARK" @click="editDetail(item)" style="width: 20px;margin-top: 5px" src="@/assets/edit.png">
                   <span v-else @click="editDetail(item)" style="color: #DDDDDD;margin-top: 8px;display: inline-block;">{{item.REMARK}}</span>

               </div>
            </li>
        </ul>

        <p class="moreData" v-show="needShow"><span>加载中...</span></p>
        <p class="lastShow" v-show="lastShow"><span>已经全部加载</span></p>
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

        <div v-transfer-dom>
            <confirm v-model="showDetail"
                     show-input
                     ref="confirm5"
                     :title="studentInfo.SHORT_NAME+'-'+studentInfo.NAME"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm5"
                    >
            </confirm>
        </div>

        <div v-if="showCheck" style="margin: 10px;overflow: hidden;">
            <masker fullscreen style="border-radius: 2px;" :opacity="0.8">
                <div slot="content" class="m-title">
                    <span style="font-size: 1.6em">{{ studentInfo.SHORT_NAME}}{{ studentInfo.NAME }}  本次考勤</span>
                    <br/>
                    <span class="m-time">
                         <h1 class="listBtn chidao" @click="changeStauts('2')">迟到</h1>
                         <h1 class="listBtn zaotui" @click="changeStauts('3')">早退</h1>
                         <h1 class="listBtn kuangke" @click="changeStauts('4')">旷课</h1>
                         <h1 class="listBtn bingjia" @click="changeStauts('5')">病假</h1>
                         <h1 class="listBtn shijia" @click="changeStauts('6')">事假</h1>
                    </span>

                    <span class="m-time">
                         <h1 @click="hideStatus()"><icon style="font-size: 2rem" type="clear"></icon></h1>
                    </span>
                </div>
            </masker>
        </div>


        <div v-if="showCheckDone" style="margin: 10px;overflow: hidden;">
            <masker fullscreen style="border-radius: 2px;" :opacity="0.8">
                <div slot="content" class="m-title">
                    <span style="font-size: 1.6em">{{ studentInfo.SHORT_NAME}}{{ studentInfo.NAME }}  本次考勤</span>
                    <br/>
                    <span class="m-time">
                         <h1 class="listBtnRow bingjia" @click="changeStauts('1')">改为到勤</h1>
                    </span>
                    <br/>
                    <span class="m-time">
                         <h1 @click="hideStatus()"><icon style="font-size: 2rem" type="clear"></icon></h1>
                    </span>
                </div>
            </masker>
        </div>
    </div>
</template>

<script>
import {Confirm, Group, XSwitch, XButton, TransferDomDirective as TransferDom, XHeader,Cell,Toast,Masker,Icon} from 'vux'
import {Field, Tab, Tabs} from 'vant';
import Back from "../../components/common/Back.vue"
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
        Masker,
        Icon,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
    },
    mounted(){

    },
    activated() {
        if (this.$route.query.fresh && this.$route.query.fresh == '1') {
            this.loadData();
        } else {
            this.loadData();
        }
        let courseId =  this.$route.query.courseId;
        this.courseTitle =  this.$route.query.courseTitle;


        //this.loadData();
    },
    data(){
        return {
            statusView:{
                1:"到勤",
                2:"迟到",
                3:"早退",
                4:"旷课",
                5:"病假",
                6:"事假"
            },
            studentInfo:{},
            showDetail:false,
            showCheck:false,
            showCheckDone:false,
            baseImgUrl:roterPath,
            courseTitle:'',
            showPositionValue: false,
            position: 'default',

            toastMessage: '',
            messageData: [],


            otherCategoryList:[],
            topListCategory:[],

            active:0,
            allCategoryList:[],
            totalCourselist:[],
            checkObj:{
                finalList:[],
                noDoList:[],
            },

            selectTab:0,
            id: '',
            page: 1,
            popup: false,
            isShow: false,
            showItemNumber: -1,
            isEndReached: false,
            totalPage: 1,
            needShow: false,
            lastShow:false,
            wwwUrl:roterPath + '/weixin/wechat/views/homework/homework-view.jsp?homeworkId='
        }
    },
    methods: {
        editDetail(item){
            this.showDetail = true;
            this.studentInfo = item;
        },
        editCheck(item){
            if(item.STATUS == '1'){
                this.showCheck = true;
            }else{
                this.showCheckDone = true;

            }

            this.studentInfo = item;
        },
        onCancel(){
            debugger;
        },
        onConfirm5(value){
            let vm = this;
            this.$refs.confirm5.setInputValue('')
            let student =  vm.studentInfo;
            let courseId =  vm.$route.query.courseId;
            let checkMainId =  vm.$route.query.checkMainId;
            //this.$vux.toast.text('input value: ' + value)

            this.$http.get(apiRouter.GET_CHANGE_TCHECKON_MAIN+"?mainId="+checkMainId + '&status=' + student.STATUS+ '&studentId='+student.ID+'&remark='+ value).then(response => {
                if (response.body.code === 200) {
                    vm.showCheck = false;
                    vm.showCheckDone = false;

                    vm.toastMessage = "修改学生备注成功";
                    vm.showPositionValue = true;
                    vm.loadData();
                } else {
                    alert(response.body.message);
                }
            }, error => {
                debugger;
            });
        },
        hideStatus(){
            this.showCheck = false;
            this.showCheckDone = false;
        },
        changeStauts(status){
            let vm = this;
            let student =  vm.studentInfo;
            let courseId =  vm.$route.query.courseId;
            let checkMainId =  vm.$route.query.checkMainId;

            this.$http.get(apiRouter.GET_CHANGE_TCHECKON_MAIN+"?mainId="+checkMainId + '&status=' + status+'&studentId='+student.ID+'&remark=' ).then(response => {
                if (response.body.code === 200) {
                    vm.showCheck = false;
                    vm.showCheckDone = false;

                    vm.toastMessage = response.body.message;
                    vm.showPositionValue = true;
                    vm.loadData();
                } else {
                    alert(response.body.message);
                }
            }, error => {
                debugger;
            });
        },
        goBack(){
            this.$router.go(-1)
        },
        goDetail(e){
            this.$router.push({path:'/cur-enroll',query: {courseId: e.courseId}})
        },

        loadData(){
            let vm = this;
            let courseId =  vm.$route.query.courseId;
            let checkMainId =  vm.$route.query.checkMainId;
            this.$http.get(apiRouter.GET_STUDENT_CHECKON_LIST+"?courseId="+courseId+'&checkMainId=' + checkMainId  ).then(response => {
                if (response.body.code === 200) {
                    // let messageData = [
                    //     {
                    //         "STATUS": "1", //考勤状态（1：到勤 2：迟到 3：早退 4：旷课 5：病假 6：事假）
                    //         "ID": "A10328", //学生id
                    //         "AVATAR": "/ID-PHOTO/2020-09-28/925dc983-e8a2-4d27-929c-e6849c360d37.jpg", //学生照片路径
                    //         "REMARK": "",
                    //         "SHORT_NAME": "六1班", //班级名称
                    //         "NAME": "段延庆" //学生姓名
                    //     },
                    //     {
                    //         "STATUS": "1",
                    //         "ID": "A11387",
                    //         "AVATAR": "/ID-PHOTO/2020-08-12/97f7cfa5-0389-4231-8d68-1661c0bda58b.jpg",
                    //         "REMARK": "",
                    //         "SHORT_NAME": "六3班",
                    //         "NAME": "杨扬"
                    //     },
                    //     {
                    //         "STATUS": "1",
                    //         "ID": "A10331",
                    //         "AVATAR": "/ID-PHOTO/2020-08-12/dc12a5b9-bac9-4683-b363-2d5d1101e68c.jpg",
                    //         "REMARK": "",
                    //         "SHORT_NAME": "六3班",
                    //         "NAME": "阮星竹"
                    //     },
                    //     {
                    //         "STATUS": "1",
                    //         "ID": "A11398",
                    //         "AVATAR": "/ID-PHOTO/2020-08-12/0cc10819-e0ff-4bb7-bcff-4463d7ec3dd3.JPG",
                    //         "REMARK": "",
                    //         "SHORT_NAME": "六3班",
                    //         "NAME": "李杰"
                    //     }
                    // ]
                    //response.body.data.infoList;
                    let messageData = response.body.data.infoList;
                    vm.messageData = messageData;
                } else {
                    alert(response.body.message);
                }
            }, error => {
                debugger;
            });
        },
    },

}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';

.message {
    width: 100%;
}

.message li {
    .mixin-padding(15px, 15px);
    border-bottom: 1px solid @colorDD;
    height: 80px;
    position: relative;
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
    color: @color42;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 5px;;
}

.message-handle {
    position: absolute;
    top: 25px;
    right: 15px;
    text-align: right;
}

.message-handle a {
    padding-top: 4px;
    padding-bottom: 4px;
    display: block;
}

.edlit-molde {
    width: 86px;
    height: 71px;
    position: absolute;
    right: 65px;
    background: url("../../assets/xbg.png") no-repeat;
    background-size: 100% 100%;
    top: 30px;
    z-index:9;
}

.edlit-molde a {
    padding-bottom: 8px;
    padding-top: 10px;
    display: block;
    font-size: @fontSize24;
}

.edlit-molde a.revamp {
    color: #2196F3;

}

.edlit-molde a.revamp em {
    width: 11px;
    height: 12px;
    background: url("../../assets/new.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

a.delete em {
    width: 9px;
    height: 11px;
    background: url("../../assets/trash.png") no-repeat 0;
    background-size: 100% 100%;
    display: inline-block;
    float: left;
    margin-top: 3px;
    margin-left: 15px;
    margin-right: 5px;
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

.moreData,.lastShow {
    height: 40px;
    line-height: 40px;
    text-align: center;

}

.moreData span {
    height: 25px;
    background: url("../../assets/loading.gif") no-repeat;
    background-size: contain;
    padding-left: 23px;
}




.back-div{
    padding-bottom: 50px;
}
.up-back{
    width: 100%;
    height: 50px;
    font-size:@fontSize36;
    line-height: 50px;
    color: @white;
    text-align: center;
    position: fixed;
    top:0;
    left:0;
    background:rgba(0, 0, 0, 0.6);
    z-index: 999;
}


.pubisnBtn{
    color: #E12727
}

.title-header{
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    z-index: 1;
    border-bottom: solid 1px #dedede;
}

.title-header /deep/ .vux-header-title{
    color: #333;
    line-height: 46px;

}

.title-header /deep/ .vux-header-back{
    color: #38f;
}

.title-header /deep/ .left-arrow:before{
    border-color: #38f !important;
}

.tab-check{
    margin-top: 50px;
}

.box /deep/ .van-tab--active{
    color: #48b319;

}

.box /deep/ .van-tabs__line{
    background-color: #48b319;

}
.box /deep/ .van-tab{
    border-bottom: 1px solid #DDDDDD;
}

.typeBtn {
    width: 63px;
    height: 63px;
    line-height: 63px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize36;
    color: @white;
    position: fixed;
    bottom: 23px;
    right: 20px;
    background: @green;
    z-index: 10;
}


.m-img {
    padding-bottom: 33%;
    display: block;
    position: relative;
    max-width: 100%;
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    border-radius: 2px;
}

.m-title {
    color: #fff;
    text-align: center;
    text-shadow: 0 0 2px rgba(0, 0, 0, .5);
    font-weight: 500;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    top: 40%;
    transform: translateY(-50%);
}

.m-time {
    font-size: 12px;
    padding-top: 1rem;
    display: inline-block;
    margin-top: 5px;
}


.listBtn {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize34;
    bottom: 23px;
    right: 20px;
    color: @white;
    z-index: 10;
    display: inline-block;
    margin: 1em 5px;
}

.listBtnRow{
    width: 60px;
    height: 60px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize30;
    bottom: 23px;
    right: 20px;
    color: @white;
    z-index: 10;
    display: inline-block;
    margin: 1em 5px;
    padding: 5px 10px;
}

.chidao {
    background: #fbc02d;
}
.zaotui {
    background: #1ba0e1;
}
.kuangke {
    background: #ff5e5e;
}
.bingjia {
    background: #48b31a;
}
.shijia {
    background: #9c26b0;
}

.chenlBtn {
    width: 60px;
    height: 60px;
    line-height: 63px;
    text-align: center;
    border-radius: 50%;
    font-size: @fontSize36;
    bottom: 23px;
    right: 20px;
    background: @green;
    z-index: 10;

}
</style>
