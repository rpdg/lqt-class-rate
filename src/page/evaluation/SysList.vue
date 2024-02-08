<template>
    <div class="box" v-if="showList">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">选择评价体系
        </x-header>

        <div class="context clearfix">
            <h3 class="title">请选择</h3>
            <group>
                <cell
                    v-for="(items,index1) in getData" :key="index1"
                    is-link
                    :title="items.NAME"
                    @click.native="evluatObj(items)">
                </cell>
            </group>
        </div>
    </div>
</template>

<script>

import {Group, Cell, CellBox, CellFormPreview, Badge, XHeader} from 'vux'
import apiRouter from "../../config/api.js"

export default {
    components: {
        Group,
        Cell,
        CellFormPreview,
        CellBox,
        Badge,
        XHeader
    },
    mounted() {
        //  this.getObjData();
    },
    activated() {
        let userType = window.localStorage.getItem("USER_TYPE");
        this.userType = userType;
        if (userType == 'T_TEACHER') {
            this.getZhIndex();
        } else {
            this.getStuIndex();
        }

        //this.getObjData();

        document.title = '综评榜单'
    },
    deactivated() {
      document.title = "绿蜻蜓"
    },
    methods: {
        evluatObj(data) {
            let userType = this.userType;
            let vm = this;
            if (userType == 'T_TEACHER') {
                this.$router.push({path: '/eval-cList', query: {evalId: data.ID}})
            } else {
                this.$http.get(apiRouter.GET_CHECK_YCB_CLASS_VIEW+'?eval_id='+data.ID+'&class_id='+data.CLASS_ID)
                    .then((response) => {
                        if (response.body.data.HAS_YCB == true) {
                            //vm.$router.push({path: "eval-rank", query: {evalId: evalId, classId: classId}})
                            vm.$router.push({path: "eval-rank", query: {evalId: data.ID, classId: data.CLASS_ID}})
                        }else{
                            alert('暂无综评统计');
                        }
                    })
                    .catch(function (response) {
                        console.log(response)
                    })
                //this.$router.push({path: '/eval-cList', query: {evalId: data.ID}})
            }
        },
        getZhIndex() {
            let _this = this;
            _this.showList = false;
            this.$http.get(apiRouter.GET_TEA_ZH_INDEX)
                .then((response) => {
                    if (response.body.status === 200) {
                        let data = response.body.data;
                        // 业务逻辑：
                        // TO_URL为 /app/zh/teacher/tea_zh_class，直接传递EVAL_ID 转跳选取体系班级页面
                        // TO_URL为 /app/zh/teacher/tea_zh_eval，说明有多个评价体系，转跳选取体系页面
                        //teacher/tea_ycb_class_view
                        if(data.TO_URL == '/app/zh/teacher/tea_ycb_class_view'){
                            _this.$router.push({path: "eval-rank", query: {evalId: data.EVAL_ID, classId: data.CLASS_ID,singleFlag:true}})
                        }else if (data.TO_URL == '/app/zh/teacher/tea_zh_class') { // 直接传递EVAL_ID 班级页面
                            _this.$router.push({path: '/eval-cList', query: {evalId: data.EVAL_ID}})
                        } else {
                            //   /app/zh/teacher/tea_zh_eval
                            _this.showList = true;
                            _this.getObjData();
                        }
                        //this.getData = response.body.data
                        //console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },
        getStuIndex() {
            let _this = this;
            _this.showList = false;
            this.$http.get(apiRouter.GET_STU_ZH_INDEX)
                .then((response) => {
                    if (response.body.status === 200) {
                        let data = response.body.data;
                        // TO_URL为/app/zh/teacher/tea_ycb_class_view，直接转跳英才榜展示页面，传递data
                        // TO_URL为/app/zh/teacher/stu_zh_eval，转跳学生选取体系页面
                        if (data.TO_URL == '/app/zh/teacher/tea_ycb_class_view') {
                            // "EVAL_ID": "1",
                            // "CLASS_ID": "A33196",
                            // "YCB_TYPE": "WEEK",
                            // "TYPE_CODE": "0",
                            // "TO_URL": "/app/zh/teacher/tea_ycb_class_view"
                            let isFromBack = this.$route.query.bk;
                            if(isFromBack){
                                this.goBack();
                            } else {
                                this.$router.push({
                                    path: "eval-rank",
                                    query: {evalId: data.EVAL_ID, classId: data.CLASS_ID}
                                });
                            }
                        } else {
                            _this.showList = true;
                            _this.getStuObjData();
                        }
                        //this.getData = response.body.data
                        //console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },
        getObjData() {
            this.$http.get(apiRouter.GET_TEA_ZH_EVAL)
                .then((response) => {
                    if (response.body.status === 200) {
                        this.getData = response.body.data
                        console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },

        getStuObjData() {
            this.$http.get(apiRouter.GET_STU_ZH_EVAL)
                .then((response) => {
                    if (response.body.status === 200) {
                        this.getData = response.body.data.DATA;
                        console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },


        goBack() {
            let userType = this.userType;
            if (userType === 'T_TEACHER') {
                this.$router.push({path: '/'});
            } else{
                window.location.href = '/weixin/wechat/v2/index.html#/evaluate/stu_home';
            }
        }

    },
    data() {
        return {
            title1: "班主任评价学生",
            title2: "任课教师评价学生",
            title3: "评价任意学生",
            showOne: true,
            showTwo: false,
            showThree: false,

            getData: [],
            showList: false,
            userType: '',

        }
    }
}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';

.title {
    height: 60/@baseSize;
    background: @green;
    padding-left: 30/@baseSize;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: @fontSize30;
    color: @white;
    line-height: 60/@baseSize;
}

.maple-list {
    width: 100%;
}

.maple-list h4 {
    padding-left: 55/@baseSize;
    padding-right: 55/@baseSize;
    -webkit-background-origin: border-box;
    background-origin: border-box;
    height: 100/@baseSize;
    border-bottom: 1px solid #dddddd;
    line-height: 100/@baseSize;

}

.maple-list h4 em {
    width: 40/@baseSize;
    height: 40/@baseSize;
    display: block;
    float: left;
    text-align: center;
    line-height: 40/@baseSize;
    background: @green;
    border-radius: 4px;
    color: @white;
    margin-top: 28/@baseSize;
}

.maple-list h4 span {
    margin-left: 20/@baseSize;
    float: left;
    color: @color42;
    font-size: @fontSize30;
}

.maple-info li {
    padding-left: 55/@baseSize;
    padding-right: 55/@baseSize;
    -webkit-background-origin: border-box;
    background-origin: border-box;
    height: 100/@baseSize;
    border-bottom: 1px dashed #dddddd;
    line-height: 100/@baseSize;
}

.maple-info li span {
    color: #777777;
    font-size: @fontSize30;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}

.slide {
    padding: 0 0;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}

.animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
}

.grade-icon {
    width: 40/@baseSize;
    height: 40/@baseSize;
    display: block;
    text-align: center;
    line-height: 40/@baseSize;
    border-radius: 4px;
    color: @white;
    margin-right: 0.2rem;
}

.grade-icon-one {
    background: @green;
}

.grade-icon-two {
    background: #2196F3;
}

.grade-icon-three {
    background: #E91E63;
}


.box {
    height: 100%;
}

.amenene {
    width: 10px;
}

.box .maple-nav .maple-info {
    padding: 0;
}

.box .maple-nav .weui-cells {
    margin-top: 0px;
}

.box .maple-nav .vux-no-group-title {
    margin-top: 0px;
}

.box .maple-nav .weui-cells {
    font-size: @fontSize30;
    color: @color42;
    margin-top: 0px;
}

.box .maple-nav .weui-cell:before {
    padding-top: 0;
}

.context {
    margin-top: 100/@baseSize;
}

.context .weui-cell {
    width: 100%;
    height: 100/@baseSize;
    border-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 55/@baseSize;
    padding-left: 55/@baseSize;
    font-size: @fontSize30;
    color: @color42;
}

.context .weui-cell:before {
    left: 0;
}

.context .vux-no-group-title {
    padding: 0;
}

.maple-info li:last-child {
    border-bottom: 0;
}

.box /deep/ .weui-cells {
    margin-top: 0px;
}

.vux-no-group-title {
    margin-top: 0;
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


.title-header {
    background-color: #fff;;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100/@baseSize;
    line-height: 100/@baseSize;
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


</style>
