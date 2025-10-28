<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">{{ className }}{{ courseName }}
        </x-header>

<!--        <tab class="tab-check" prevent-default>-->
<!--            <tab-item selected @on-item-click="switchTabItem">全部</tab-item>-->
<!--            <tab-item v-for="(item, index) in oneList" @on-item-click="switchTabItem">{{ item.NAME }}</tab-item>-->
<!--        </tab>-->

        <van-tabs v-model="tabIndex" @click="switchTabItem" class="tab-check">
            <van-tab title="全部" :name="0" :key="0"></van-tab>
            <van-tab v-for="(item, index) in oneList" :title="item.NAME" :name="index+1" :key="index+1"></van-tab>
        </van-tabs>

        <group style="margin: 5px;">
            <!--            <div style="padding: 10px">-->
            <!--                <div-->
            <!--                    style="display: inline-block;width: 24.9%;text-align: center;margin-top: 10px;"-->
            <!--                    v-for="(item, index) in stuList"-->
            <!--                    :key="index"-->
            <!--                >-->
            <!--                    <img :src="item.AVATAR" style="width: 90%;"/>-->
            <!--                    <span style="display: inline-block;font-size: 10px;">{{ item.CLASS_NUM }} {{ item.NAME }}</span>-->
            <!--                </div>-->
            <!--            </div>-->


            <checker v-model="pickStudent" type="checkbox" default-item-class="demo1-item"
                     selected-item-class="demo1-item-selected">
                <checker-item :value="item" v-for="(item, index) in stuList" :key="index">
                    <img :src="item.AVATAR" width="100%" alt="">
                    <div class="std-name">
                        {{item.CLASS_NUM}}&nbsp;{{item.NAME}}
                    </div>
                </checker-item>
            </checker>
        </group>

        <div>
            <div style="display: inline-block;width: 49%;padding: 0 1rem;">
                <checker @on-change="changeAll" v-model="allCheck" default-item-class="check-item"
                         selected-item-class="check-item-selected">
                    <checker-item style="vertical-align: top;" :value="item" v-for="(item, index) in 1" :key="index">
                    </checker-item>
                    全选
                </checker>

            </div>
            <div style="display: inline-block;width: 49%;padding: 0 1rem;text-align: right;">
                <span>共{{ pickStudent.length }}名学生</span>
            </div>

        </div>

        <p class="pltne-btn" @click="startPJ()">进行评价</p>


    </div>
</template>

<script>
import {XHeader, Cell, Group, Checker, CheckerItem} from 'vux'
import {Tab, Tabs} from 'vant';

import apiRouter from "../../config/api.js"

export default {

    components: {
        XHeader,
        Cell,
        Group,
        Checker,
        CheckerItem,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
    },
    mounted() {

    },
    activated() {
        this.page = 1;
        this.className = this.$route.query.className;
        this.courseName = this.$route.query.courseName;
        this.tabIndex = 0;
        this.pickStudent = [];
        this.loadData();

    },
    data() {
        return {
            className: '',
            courseName: '',
            detailMap: {},
            allList: [],
            oneList: [],
            stuList: [],
            pickStudent: [],
            allCheck: '',
            tabIndex:0

        }
    },
    methods: {
        startPJ(){
            let pickStudent = this.pickStudent;
            let query = this.$route.query;
            let pickStdMap = {
                allNum:this.allList.length,
                pickStudent:pickStudent,
            }
            sessionStorage.setItem("PJ_STD_MAP",JSON.stringify(pickStdMap));
            this.$router.push({
                path: '/eval-edit',
                query:query
            })

        },
        changeAll(e) {
            if (e) {
                this.pickStudent = JSON.parse(JSON.stringify(this.stuList));
            }else{
                this.pickStudent = [];
            }
        },
        switchTabItem(e) {
            let vm = this;
            vm.pickStudent = [];
            vm.allCheck = false;
            if(e == 0){
                let allList = vm.allList;
                let stuList = [];
                allList.forEach(e => {
                    // e.forEach(ei => {
                    //     stuList.push(ei);
                    // })
                    stuList.push(e);
                })
                this.stuList = stuList;
            }else{
                let oneList = vm.oneList;
                let stuList = [];
                oneList[e-1].STULIST.forEach(e => {
                    stuList.push(e);
                })
                this.stuList = stuList;
            }
        },
        goBack(e) {
            this.$router.go(-1);
        },
        loadData() {
            let vm = this;
            let classId = this.$route.query.classId;
            let courseCode = this.$route.query.courseCode;
            this.$http.get(apiRouter.GET_STU_GROUP_LIST + "?classId=" + classId + '&courseCode=' + courseCode).then(response => {
                if (response.body.code === 200) {
                    let bodyData = response.body.data;
                    let allList = bodyData.allList;
                    let oneList = bodyData.oneList;
                    vm.allList = allList;
                    vm.oneList = oneList;

                    let stuList = [];
                    allList.forEach(e => {
                        // e.forEach(ei => {
                        //     stuList.push(ei);
                        // })
                        stuList.push(e);
                    })
                    this.stuList = stuList;

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

.check-item:after {
    background: #ffffff url('../../assets/eval/nochose.png') no-repeat;
    width: 20px;
    height: 20px;
    display: block;
    background-size: contain;
    content: '';
}

.check-item-selected:after {
    background: #ffffff url('../../assets/eval/chose.png') no-repeat;
    width: 20px;
    height: 20px;
    display: block;
    background-size: contain;
    content: '';
}

.demo1-item {
    //padding: 5px 15px;
    width: 24%;
    margin-right: 1%;
    position: relative;
    //background: #ffffff url('../../assets/eval/nochose.png') no-repeat right top;
}

.demo1-item:after {
    content: '';
    background: url('../../assets/eval/nochose.png');
    width: 20px;
    height: 20px;
    display: block;
    background-size: contain;
    position: absolute;
    right: 0;
    top: 0;
}

.demo1-item-selected {
    //background: #ffffff url('../../assets/eval/chose.png') no-repeat right top;
}

.demo1-item-selected:after {
    content: '';
    background: url('../../assets/eval/chose.png');
    width: 20px;
    height: 20px;
    display: block;
    background-size: contain;
    position: absolute;
    right: 0;
    top: 0;
}

.title-header {
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

.content {
    margin-top: 50px;
}

.title-detail {
    padding: 1em;
    text-align: center;
    font-weight: bolder;
    font-size: 16px;
}

.title-left {
    color: rgb(72, 179, 25);
    padding-left: 10px;
}

.title-right {
    position: absolute;
    right: 10px;
}

.tab-check {
    margin-top: 50px;
}

.pltne-btn {
    width: 90%;
    height: 40px;
    line-height: 40px;
    font-size: @fontSize30;
    color: @white;
    background: @green;
    //margin-top: 40px;
    text-align: center;
    margin: 1em auto;
}
.std-name{
    position: absolute;
    bottom: 6px;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,0.7);
    color: white;
    text-align: center;
}

.van-tab{
    font-size: 18px;
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
</style>
