<template>
    <div class="box">
        <x-header class="title-header" :left-options="{preventGoBack: true}"
                  @on-click-back="goBack">选择班级
        </x-header>

        <div class="lqt-wrapper" style="margin-top: 2rem" id="qa_list">

            <ul class="lqt-list" data-page="1" style="display: block;">
                <!-- 报修 -->
                <li v-for="item in getData" class="it clearfix it-m" id="" style="display: list-item;">
                    <div class="list-title" @click="evluatObj(item)">
                        <a class="link"><span class="title-common  no-anonym"></span></a>
                    </div>
                    <div class="list-content" @click="evluatObj(item)">
                        <div class="content-wapper"><a class="link">
                            <p class="content-title">{{item.NAME}}</p>
                            </a></div>
                    </div>
                </li>
            </ul>
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
        this.getObjData();
    },
    methods: {
        getObjData() {
            let evalId = this.$route.query.evalId;
            this.$http.get(apiRouter.GET_TEA_ZH_CLASS+'?eval_id='+evalId)
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

        evluatObj(data) {
            let classId = data.ID;
            let evalId = this.$route.query.evalId;
            let vm = this;
            this.$http.get(apiRouter.GET_CHECK_YCB_CLASS_VIEW+'?eval_id='+evalId+'&class_id='+classId)
                .then((response) => {
                    if (response.body.data.HAS_YCB == true) {
                        vm.$router.push({path: "/eval-rank", query: {evalId: evalId, classId: classId}})
                    }else{
                        alert('该班级暂无综评统计');
                    }
                })
                .catch(function (response) {
                    console.log(response)
                })

            //
        },

        goBack() {
            // window.sessionStorage.setItem('sListFrom', 'cList');
            // this.$router.go(-1);
            this.$router.push({path:"/eval-sList", query:{bk: 1}});
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

        }
    }
}
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';

.title {
    height: 30px;
    background: @green;
    padding-left: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: @fontSize30;
    color: @white;
    line-height: 30px;
}

.maple-list {
    width: 100%;
}

.maple-list h4 {
    padding-left: 28px;
    padding-right: 28px;
    -webkit-background-origin: border-box;
    background-origin: border-box;
    height: 50px;
    border-bottom: 1px solid #dddddd;
    line-height: 50px;

}

.maple-list h4 em {
    width: 20px;
    height: 20px;
    display: block;
    float: left;
    text-align: center;
    line-height: 20px;
    background: @green;
    border-radius: 4px;
    color: @white;
    margin-top: 14px;
}

.maple-list h4 span {
    margin-left: 10px;
    float: left;
    color: @color42;
    font-size: @fontSize30;
}

.maple-info li {
    padding-left: 28px;
    padding-right: 28px;
    -webkit-background-origin: border-box;
    background-origin: border-box;
    height: 50px;
    border-bottom: 1px dashed #dddddd;
    line-height: 50px;
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
    width: 20px;
    height: 20px;
    display: block;
    text-align: center;
    line-height: 20px;
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
    margin-top: 50px;
}

.context .weui-cell {
    width: 100%;
    height: 50px;
    border-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 28px;
    padding-left: 28px;
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
    padding-bottom: 50px;
}

.up-back {
    width: 100%;
    height: 50px;
    font-size: @fontSize36;
    line-height: 50px;
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
@import '../../style/minxin.less';

* {
    padding: 0;
    margin: 0;
    word-break: break-all
}

html {
    font-size: 50px
}

body {
    color: #333;
    //font-size: 62.5%;
    font-family: "Microsoft Yahei, Arial, sans-serif"
}

img {
    max-width: 100%
}

ul, li {
    list-style: none
}

em, i, s, u {
    font-weight: normal;
    font-style: normal;
    text-decoration: none
}

a {
    color: #333;
    text-decoration: none
}

a:hover {
    text-decoration: none
}

.clearfix:after {
    display: table;
    content: "";
    clear: both
}

.hidden {
    visibility: hidden
}

.fl {
    float: left
}

.fr {
    float: right
}

.shake-in-out {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
    -webkit-animation-delay: 0;
    animation-delay: 0;
    -webkit-animation-fill-mode: none;
    animation-fill-mode: none
}

.shakeOut {
    -webkit-animation-name: shakeOut;
    animation-name: shakeOut
}

.shakeIn {
    -webkit-animation-name: shakeIn;
    animation-name: shakeIn
}

.scale-point {
    -webkit-animation-duration: .8s;
    animation-duration: .8s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-delay: 0;
    animation-delay: 0;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.scalePoint {
    -webkit-animation-name: scalePoint;
    animation-name: scalePoint
}

.shake-rotate {
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
    -webkit-animation-delay: 0;
    animation-delay: 0;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.shakeRotate {
    -webkit-animation-name: shakeRotate;
    animation-name: shakeRotate
}

.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite
}

.animated.hinge {
    -webkit-animation-duration: 2s;
    animation-duration: 2s
}

.bounceInDown {
    -webkit-animation-name: bounceInDown;
    animation-name: bounceInDown
}

.bounceOutUp {
    -webkit-animation-name: bounceOutUp;
    animation-name: bounceOutUp
}

.fadeOut {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut
}

.bounceIn {
    -webkit-animation-name: bounceIn;
    animation-name: bounceIn
}

.bounceOut {
    -webkit-animation-name: bounceOut;
    animation-name: bounceOut
}

.bounceInUp {
    -webkit-animation-name: bounceInUp;
    animation-name: bounceInUp
}

.bounceOutDown {
    -webkit-animation-name: bounceOutDown;
    animation-name: bounceOutDown
}

.icon {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: 100%
}

.icon-op::before, .icon-op::after, .icon-op em {
    float: left;
    display: block;
    content: '';
    width: 5px;
    height: 5px;
    margin: 0 2px 0 3px;
    background: #888;
    border-radius: 50%
}

.icon-like {
    width: 12.5px;
    height: 11.5px;
    //background-image: url("../../images/icon/love.png")
}

.icon-like.active {
    //background-image: url("../../images/icon/loved.png")
}

.icon-like-w {
    width: 16px;
    height: 14.5px;
    //background-image: url("../../images/icon/momentHeart.png")
}

.icon-comment {
    width: 15px;
    height: 14.5px;
    //background-image: url("../../images/icon/momentComment.png")
}

.icon-publish {
    width: 29px;
    height: 28.5px;
    //background-image: url("../../images/icon/edit.png")
}

.icon-pre {
    font-family: "icon"
}

.icon-pre {
    display: inline-block;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}

.icon-rise, .icon-set {
    position: relative;
    top: -.01rem;
    display: inline-block;
    width: .15rem;
    height: .2rem;
    margin-right: .03rem;
    background-repeat: no-repeat;
    background-size: 100%
}

.icon-set {
    //background-image: url("../../images/icon/set.png")
}

.icon-rise {
    font-family: 'icon';
    //background-image: url("../../images/icon/rise.png")
}

.icon-radio {
    position: relative;
    width: 18px;
    height: 18px;
    border: solid 1px #48b319;
    border-radius: 50%;
    background: #fff;
    overflow: hidden
}

.icon-radio input {
    opacity: 0;
    position: absolute;
    top: 0;
    right: auto;
    bottom: auto;
    left: 0
}

.icon-radio .icon-radio-point.active, .icon-radio input:checked + .icon-radio-point {
    display: block;
    width: 12px;
    height: 12px;
    margin: 3px auto 0;
    background: #48b319;
    border-radius: 50%
}

.icon-checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    border: solid 1px #48b319;
    border-radius: 3px;
    background: #fff;
    overflow: hidden
}

.icon-checkbox input {
    opacity: 0;
    outline: none;
    position: absolute;
    top: 0;
    right: auto;
    bottom: auto;
    left: 0
}

.icon-checkbox input:checked + .icon-checkbox-point {
    display: block
}

.icon-checkbox .icon-checkbox-point {
    display: none;
    font-family: 'icon';
    font-size: 40px;
    line-height: 14px;
    text-align: center;
    color: #48b319
}

.icon-checkbox .icon-checkbox-point.active {
    display: block
}

.icon-next {
    font-family: icon;
    position: absolute;
    width: .4rem;
    height: 0.4rem
}

.icon-next:after {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg)
}

.icon-star_e, .icon-star_f {
    width: .49rem;
    height: .46rem;
    background-repeat: no-repeat;
    background-size: auto 100%
}

.icon-star_f, .icon-star_e.active {
    //background-image: url("../../images/icon/star_fill.png")
}

.icon-star_e {
    //background-image: url("../../images/icon/star_w.png")
}

body {
    background: #f2f2f2
}

.lqt-list {
    display: none;
    padding-left: 10px;
    overflow: hidden;
    background: #fff;
    //box-shadow: 0 0 3px rgba(9, 9, 9, 0.2)
}

.lqt-list .it {
    padding: 10px 10px 10px 1.4rem;
    border-top: solid 1px #dedede;
    border-bottom: solid 1px #dedede;
    margin-top: -1px
}

.lqt-list .list-title {
    float: left;
    position: relative
}

.lqt-list .list-title .title-common {
    display: block;
    width: 1.9rem;
    height: 1.9rem;
    text-align: center;
    color: #fff
}

.lqt-list .list-title .title-results {
    line-height: 1rem;
    text-align: center;
    font-family: 'icon';
    color: #48b319;
    font-size: 36px
}

.lqt-list .list-title .title-results {
    color: #1ba0e1
}

.lqt-list .list-title .single-line {
    line-height: 1rem;
    //font-size: 15px
}

.lqt-list .list-title .double-line {
    line-height: .36rem;
    //font-size: 14px
}

.lqt-list .list-title .double-line p:first-child {
    padding-top: 6px
}

.lqt-list .list-title .new::before {
    content: '';
    width: .16rem;
    height: .16rem;
    background-color: #ff4d33;
    border-radius: 100%;
    position: absolute;
    top: -3px;
    right: -3px;
    bottom: auto;
    left: auto
}

.lqt-list .list-title .anonym:after, .lqt-list .list-title .no-anonym:after {
    content: '';
    width: .3rem;
    height: .27rem;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 100%;
    position: absolute;
    top: auto;
    right: 1px;
    bottom: 1px;
    left: auto
}

.lqt-list .it-m {
    padding-left: 1.3rem
}

.lqt-list .it-m .list-title {
    margin-left: -1.2rem
}

.lqt-list .it-s {
    padding-left: 1rem
}

.lqt-list .it-s .list-title {
    margin-left: -1rem
}

.lqt-list .list-content {
    position: relative;
    float: left;
    width: 92%;
    padding-left: 1em;
    height: 60px;
    line-height: 60px;
}

.lqt-list .list-content .content-wapper {
    padding-right: 0.48rem
}

.lqt-list .list-content .content-wapper a{
    /*font-size: .5rem;*/
    font-size: 1.1em;
}

.lqt-list .list-content .content-title {
    //font-size: .3rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.lqt-list .list-content .content-info {
    //padding-top: 7px;
    //font-size: .28rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.lqt-list .icon-next {
    color: #d2d3d5;
    position: absolute;
    top: .3rem;
    right: 0;
    bottom: auto;
    left: auto
}

.lqt-list .icon-noticeTime {
    font-family: 'Microsoft Yahei';
    /*font-size: 11px;*/
    color: #999;
    position: absolute;
    top: 20px;
    right: -5px;
    bottom: auto;
    left: auto
}

.lqt-resultsList .content-title {
    line-height: 1rem
}

.lqt-resultsList .icon-next {
    top: 10px
}

#zone .title-common {
    background-position: center;
    background-size: cover
}

#homework .title-common, #zone .title-common {
    text-align: center;
    border-radius: 3px;
    color: #fff
}

#notice .title-common {
    line-height: 1rem;
    text-align: center;
    font-family: 'icon';
    color: #48b319;
    font-size: 36px
}

html, body {
    height: 100%
}

/*@font-face {
  font-family: 'icon';
  src: url("../../font/icon-webfont.eot");
  src: url("../../font/icon-webfont.eot?#iefix") format("embedded-opentype"), url("../../font/icon-webfont.woff") format("woff"), url("../../font/icon-webfont.ttf") format("truetype"), url("../../font/icon-webfont.svg#iconregular") format("svg");
  font-weight: normal;
  font-style: normal
}*/

img {
    max-width: 100%
}

.lqt-arrow {
    position: absolute;
    top: 12px;
    right: auto;
    bottom: auto;
    left: -8px;
    z-index: 2;
    width: 8.5px;
    height: 14px;
    overflow: hidden
}

.lqt-arrow .arrow-up, .lqt-arrow .arrow-down {
    position: absolute;
    top: 2px;
    right: auto;
    bottom: auto;
    left: 2px;
    width: 10px;
    height: 10px;
    background: #dedede;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg)
}

.lqt-arrow .arrow-down {
    left: 3.5px;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));
    box-shadow: 1px -1px 1px -1px #fff inset
}

.lqt-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}

.lqt-wrapper {
    margin-top: 50px;
}

.pullDownLabel, .pullUpLabel {
    line-height: 30px;
    color: #8e8e8e;
    text-align: center
}

.pullDownLabel .scalePoint, .pullUpLabel .scalePoint {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    margin: 0 1px 2px
}

.pullDownLabel .pullTxt, .pullUpLabel .pullTxt {
    padding-left: 5px
}

.pullDownLabel .active-1, .pullUpLabel .active-1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s
}

.pullDownLabel .active-2, .pullUpLabel .active-2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s
}

.txt-mark {
    color: #48b319
}

.detail-container {
    padding: 0 10px
}

.avatar {
    width: 40px;
    height: 40px;
    background-position: center;
    background-size: cover
}

.avatar-m {
    width: 50px;
    height: 50px
}

.lqt-backtop {
    width: 40px;
    height: 40px;
    line-height: 33px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    position: absolute;
    top: auto;
    right: 10px;
    bottom: 60px;
    left: auto;
    z-index: 20
}

.lqt-backtop .icon-rise {
    position: absolute;
    top: .3rem;
    left: .08rem;
    font-size: 30px;
    color: #fff;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    background: transparent
}

.qs-delete {
    -webkit-touch-callout: none;
    touch-callout: none;
    -webkit-user-select: none;
    user-select: none
}

.link {
    /*padding-left: 2px;*/
    display: block;
    color: #1474A3
}

#loading {
    min-width: 2rem;
    margin: 0 auto;
    //font-size: .3rem;
    color: #999;
    text-align: center
}

#loading .scalePoint {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    margin: 0 1px 2px
}

#loading .scalePoint.active-1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s
}

#loading .scalePoint.active-2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s
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

.a-back {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    line-height: 1rem;
    //font-size: .36rem;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.6)
}

#comment-container {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 100%;
    width: 100%;
    z-index: 30;
    background: #f2f2f2;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out
}

#comment-container .comment-main {
    padding-bottom: 15px;
    margin: 10px
}

#comment-container .comment-main p:last-child {
    border: none;
    line-height: 45px;
    padding-right: 0;
    margin-top: 10px;
    background: transparent;
    text-align: right
}

#comment-container .comment-main span {
    float: left;
    width: 70%;
    //font-size: 18px;
    text-align: center
}

#comment-container .comment-main .tips {
    float: none;
    line-height: 30px;
    //font-size: 14px;
    text-align: left;
    color: #666
}

#comment-container.active {
    left: 0
}

.textarea {
    padding: 10px;
    border: solid 1px #dedede;
    background: #fff;
    border-radius: 3px
}

.textarea textarea {
    display: block;
    width: 100%;
    min-height: 120px;
    line-height: 23px;
    border: none;
    resize: none;
    outline: none
}

a.btn {
    display: inline-block;
    width: 100px;
    line-height: 45px;
    margin-left: 10px;
    //font-size: 16px;
    text-align: center;
    color: #fff;
    border-radius: 3px
}

a#button-close {
    background-color: #7d7d7d
}

a#button-confirm {
    background-color: #529b44
}

.mask {
    position: absolute;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    text-align: center
}

.mask #loading {
    position: absolute;
    width: 100%;
    color: #fff;
    top: 50%;
    //font-size: .4rem
}

.mask #loading .scalePoint {
    background: #fff
}

#recording {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    text-align: center
}

#recording::before {
    content: '';
    display: inline-block;
    width: 36px;
    height: 62px;
    margin-top: 19px;
    background-repeat: no-repeat;
    background-size: 100%;
    //background-image: url("../../images/icon/icon_record.png")
}

#floatWindow {
    position: fixed;
    right: 6px;
    bottom: 12px;
    z-index: 50;
    width: 1.28rem;
    height: 1.28rem;
    //font-size: .32rem;
    color: #fff;
    background: rgba(82, 155, 68, 0.8);
    text-align: center;
    border-radius: 100%
}

#preview-list {
    padding: .2rem 0 .1rem;
    margin-left: -.1rem
}

#preview-list .it {
    float: left;
    width: 25%;
    height: 1.5rem
}

#preview-list .it p {
    position: relative;
    height: 1.4rem;
    margin: 0 0.1rem
}

#preview-list .avatar {
    display: block;
    width: 100%;
    height: 100%
}

#preview-list #addpic {
    position: relative;
    display: block;
    height: 100%;
    box-shadow: 0 0 1px 1px #dcdddf
}

#preview-list #addpic::before, #preview-list #addpic::after {
    position: absolute;
    left: 50%;
    margin-left: -27.5%;
    top: 50%;
    margin-top: -.02rem;
    content: '';
    display: block;
    width: 55%;
    height: .04rem;
    background: #ddd;
    border-radius: 3px
}

#preview-list #addpic::after {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg)
}

#preview-list .deletepic {
    position: absolute;
    top: -.14rem;
    right: -.14rem;
    width: .36rem;
    height: .36rem;
    z-index: 4;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6)
}

#preview-list .deletepic::before, #preview-list .deletepic::after {
    position: absolute;
    left: 50%;
    top: 50%;
    content: '';
    display: block;
    width: .24rem;
    height: .04rem;
    margin-top: -.02rem;
    margin-left: -.12rem;
    background-color: #fff;
    border-radius: 3px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg)
}

#preview-list .deletepic::after {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg)
}

.pop-layer {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 100%;
    z-index: 100;
    background: #f2f2f2;
    -webkit-transition: .3s all ease-in-out;
    transition: .3s all ease-in-out
}

.pop-layer #layer-scroll {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}

.pop-layer .scroll-bar {
    height: 100%
}

.pop-layer.active {
    left: 0
}

.pop-alert {
    position: fixed;
    left: 0;
    bottom: -20%;
    max-width: 60%;
    padding: 6px 16px;
    //font-size: .26rem;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50px;
    z-index: 200;
    -webkit-transition: bottom .1s ease-in-out;
    transition: bottom .1s ease-in-out
}

.pop-comfirm {
    position: absolute;
    top: 100%;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
    opacity: 0;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out
}

.pop-comfirm.active {
    top: 0;
    opacity: 1
}

.comfirm-main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 240px;
    margin-left: -120px;
    background: #fff;
    border-radius: 3px;
    //font-size: 15px;
    color: #333
}

.comfirm-main .comfirm-bottom {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow: hidden
}

.comfirm-main .comfirm-btn {
    float: left;
    width: 50%;
    line-height: 40px;
    text-align: center
}

.comfirm-main .comfirm-cancel {
    color: #fff;
    background: #48b319;
    border-top: solid 1px transparent
}

.comfirm-main .comfirm-comfirm {
    color: #333;
    border-top: solid 1px #dedede
}

.comfirm-main .comfirm-txt {
    line-height: 21px;
    padding: 30px;
    text-align: center
}

.comfirm-main .comfirm-close {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    background: #48b319;
    border-radius: 50%;
    box-shadow: 1px 0px 2px 2px rgba(0, 0, 0, 0.1)
}

.comfirm-main .comfirm-close span {
    display: block;
    width: 16px;
    height: 2px;
    margin: 0 auto;
    background: #fff
}

.comfirm-main .comfirm-close span:first-child {
    margin-top: 13px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg)
}

.comfirm-main .comfirm-close span:last-child {
    margin-top: -2px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg)
}

#repair_list .lqt-wrapper {
    padding-top: 1.72rem
}

.list-title .link {
    //border: solid 2px #82d4fa;
    border-radius: 2px;
    //background: url("../../images/icon/fix_tools.png") center no-repeat;
    background-size: auto 100%
}

.lqt-list .it {
    position: relative;
    padding-right: 1.25rem
}

.list-tips {
    position: absolute;
    right: .2rem;
    top: .4rem;
    width: 2.5rem;
    font-size: .4rem;
    color: #9B9B9B;
    text-align: center
}

.status {
    padding-top: 0.05rem
}

.status[status=waitting], .status[status=fixing] {
    color: #FFCC80
}

.status[status=comfirming] {
    color: #E12727
}

/*.icon {
  width: 17px;
  height: 16px;
  background: url("../../images/icon/star_fill.png");
  background-size: auto 100%;
  margin: 0 1px
}*/

#floatWindow {
    color: #fff
}

#floatWindow span {
    display: block;
    margin-top: 10px
}

#vote_list .list-title .link {
    //background-image: url("../../images/icon/vote_align-left.png");
    border-color: #ffcc80
}

#qa_list .list-title .link {
    //background-image: url("../../images/icon/q_square.png");
    background-image: url("../../assets/eval/zp.png");
    border-color: #80cbc4
}

#nav {
    position: fixed;
    top: 1rem;
    left: 0;
    z-index: 55;
    width: 100%;
    background: #fff;
    border-bottom: solid 0.02rem #dedede
}

#nav ul {
    position: relative
}

#nav li {
    position: relative;
    z-index: 2;
    float: left;
    width: 20%;
    line-height: .7rem;
    //font-size: .3rem;
    text-align: center
}

#nav li.bg {
    position: absolute;
    top: .1rem;
    left: 0;
    z-index: 1;
    height: .5rem;
    border-radius: .5rem;
    background: #82d4fa;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out
}

#nav li.active a {
    color: #fff;
    -webkit-transition: color .2s ease-in-out;
    transition: color .2s ease-in-out
}

.cancel-btn {
    width: 100%;
    height: 50px;
    font-size: @fontSize36;
    color: @white;
    text-align: center;
    line-height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

.title-return-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
}

</style>
