<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">{{ className }}{{ courseName }}
        </x-header>

        <div class="tab-check">
            <div style="color: #48B319;">{{pickStudent.length}} / {{pickStdMap.allNum}}</div>
            <span style="padding: 5px 5px 5px 0" v-for="(item, index) in pickStudent" >{{item.NAME}}</span>
        </div>

        <div style="margin-top: 1em;">以上同学今日表现：</div>

        <div>
            <group>
                <checker v-model="goodCheck" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                    <checker-item class="good1" :value="item" v-for="(item, index) in goodList" :key="index">
                        {{ item.ITEM_NAME }}
                    </checker-item>
                    <br>
                    <checker-item class="bad1" :value="item" v-for="(item, index) in badList" :key="index">
                        {{ item.ITEM_NAME }}
                    </checker-item>
                </checker>
            </group>
        </div>

        <p class="pltne-btn" @click="startPJ()">提交</p>

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
import {XHeader, Cell, Tab, TabItem, Group, Checker, CheckerItem,Toast} from 'vux'
import apiRouter from "../../config/api.js"

export default {

    components: {
        XHeader,
        Cell,
        Tab,
        TabItem,
        Group,
        Checker,
        CheckerItem,
        Toast
    },
    mounted() {

    },
    activated() {
        this.page = 1;
        let pickStdMapStr = sessionStorage.getItem("PJ_STD_MAP");
        let pickStdMap = JSON.parse(pickStdMapStr);
        this.pickStdMap = pickStdMap;
        this.pickStudent = pickStdMap.pickStudent;
        this.loadData();

    },
    data() {
        return {
            showPositionValue: false,
            position: 'default',
            toastMessage: '',
            className: '',
            courseName: '',
            detailMap: {},
            allList: [],
            oneList: [],
            stuList: [],
            pickStudent: [],
            allCheck: '',
            goodList: [],
            badList: [],
            goodCheck: [],
            badCheck: [],
            pickStdMap:{},
            query:{}
        }
    },
    methods: {
        startPJ() {
            let vm = this;
            let goodCheck = this.goodCheck;
            if(!goodCheck.ITEM_NAME){
                vm.toastMessage = "请选择评价";
                vm.showPositionValue = true;
                return ;
            }

            let pickStudent = this.pickStudent
            let stdList = [];
            for(let i = 0;i<pickStudent.length;i++){
                stdList.push({"STU_ID":pickStudent[i].STUDENT_ID,"STU_NO":pickStudent[i].CLASS_NUM})
            }
            let obj = {
                pjType: goodCheck.PJ_TYPE,//评价类型
                itemName: goodCheck.ITEM_NAME,//评价名称
                orderNo: goodCheck.ORDER_NO,//评价序号
                gradeCode: this.$route.query.gradeCode,//年级code
                courseCode: this.$route.query.courseCode,//课程code
                classId: this.$route.query.classId,//班级id
                stuData: JSON.stringify(stdList)
            }

            this.$http.post(apiRouter.GET_ADD_KT_PJ ,obj).then(response => {
                if (response.body.code === 200) {
                    vm.toastMessage = response.body.message;
                    vm.showPositionValue = true;
                    setTimeout(()=>{
                        vm.$router.push({
                            path: '/eval-eList-up',
                            query:vm.$route.query
                        })
                    },800)
                } else {
                    alert(response.body.message);
                }
            }, error => {
                debugger;
            });
        },

        changeAll(e) {
            if (e) {
                this.pickStudent = this.stuList;
            } else {
                this.pickStudent = [];
            }
        },

        switchTabItem(e) {
            debugger;
        },

        goBack(e) {
            this.$router.go(-1);
        },

        loadData() {
            let vm = this;
            let classId = this.$route.query.classId;
            let courseCode = this.$route.query.courseCode;
            let gradeCode = this.$route.query.gradeCode;

            this.$http.get(apiRouter.GET_PJ_ITEM + "?classId=" + classId + '&courseCode=' + courseCode + '&gradeCode=' + gradeCode).then(response => {
                if (response.body.code === 200) {
                    let bodyData = response.body.data;
                    vm.goodList = bodyData.item1List;
                    vm.badList = bodyData.item0List;
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
.box{
   padding: 1em;
}
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
    width: 45%;
    margin: 6px;
    position: relative;
    border-radius: 20px;
    text-align: center;
    padding: 5px; //background: #ffffff url('../../assets/eval/nochose.png') no-repeat right top;
}

.good1 {
    border: 1px solid #48B319;
}

.bad1 {
    border: 1px solid #E12727;
}

.good1.demo1-item-selected {
    background: #48B319;
    color: white;
}

.bad1.demo1-item-selected {
    background: red;
    color: white;
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
</style>
