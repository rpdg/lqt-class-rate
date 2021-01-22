<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">选择课堂
        </x-header>
        <div class="context clearfix">
            <h3 class="title">请选择班级科目</h3>
            <group style="margin-top: 0">
                <cell
                    v-for="(items,index1) in getData" :key="index1"
                    is-link
                    :title="items.CLASS_NAME+items.COURSE_NAME"
                    @click.native="go(items)">
                </cell>
            </group>
        </div>
    </div>
</template>

<script>

import {Group,Cell, CellBox, CellFormPreview,  Badge, XHeader} from 'vux'
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
        let usertype = window.localStorage.getItem('USER_TYPE');
        this.usertype = usertype;
        if(usertype =='T_TEACHER'){
            this.getObjData();
        }else{
            //this.$router.push({ path: '/eval-eList-std'})
            this.getStdData();
        }
    },

    methods: {
        getObjData() {
            let vm = this;
            this.$http.get(apiRouter.GET_CLASS_COURSE_PJ_LIST)
                .then((response) => {
                    if (response.body.code === 200) {
                        vm.getData = response.body.data;
                        if(vm.getData.length == 1){
                            vm.backHome = true;
                            vm.go(vm.getData[0]);
                        }
                        console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },

        getStdData() {
            this.$http.get(apiRouter.GET_STU_CLASS_COURSE_PJ_LIST)
                .then((response) => {
                    if (response.body.code === 200) {
                        this.getData = response.body.data;
                        console.log(this.getData)
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })
        },



        evluatObj(evalId, detailCode, nameBt) {
            this.$router.push({path: "gradeList", query: {evalId: evalId, detailCode: detailCode, nameBt: nameBt}})
        },

        goBack() {
          this.$router.push({path: '/'})
        },

        go(e){
            let backHome = this.backHome;
            if(this.usertype =='T_TEACHER'){
                this.$router.push({
                    path: '/eval-eList-up',
                    query: {
                        courseCode: e.COURSE_CODE,
                        classId:e.CLASS_ID,
                        className:e.CLASS_NAME,
                        courseName:e.COURSE_NAME,
                        gradeCode:e.GRADE_CODE,
                        backHome:backHome
                    }
                })
            }else{
                this.$router.push({
                    path: '/eval-eList-std',
                    query: {
                        courseCode: e.COURSE_CODE,
                        classId:e.CLASS_ID,
                        className:e.CLASS_NAME,
                        courseName:e.COURSE_NAME,
                        gradeCode:e.GRADE_CODE
                    }
                })
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
            usertype:'',
            backHome:false,

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



.context {
    margin-top: 100/@baseSize;
}

.context .weui-cell {
    width: 100%;
    height: 100/@baseSize;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 55/@baseSize;
    padding-left: 55/@baseSize;
    font-size: @fontSize30;
    color: @color42;
    border-bottom: 1px #DDDDDD solid;
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
