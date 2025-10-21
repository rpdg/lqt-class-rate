<template>
    <ul class="tab-btn clearfix">
        <li>
            <a :href="spaceUrl">
                <p><span>空间</span></p>
            </a>
        </li>
        <li>
            <a :href="noticeUrl">
                <p><span>通知</span></p>
            </a>
        </li>
        <li class="currt-actiove">
            <a href="#" style="display: flex">
                <p style="flex: 1; display: flex; align-items: center; width: 100%; justify-content: center;">
                    <span>我的</span>
                    <img v-if="userType === 'T_TEACHER'" class="user-type" src="../../../assets/teacher.png" alt="">
                    <img v-else-if="userType === 'T_PARENT'" class="user-type" src="../../../assets/teacher3.png"
                        alt="">
                    <img v-else="userType === 'T_STUDENT'" class="user-type" src="../../../assets/teacher2.png" alt="">
                </p>
            </a>
            <div class="border-bottom"> </div>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        userType: {
            type: String,
            required: true,
        },
        spaceUrl: {
            type: String,
            required: true,
        },
        noticeUrl: {
            type: String,
            required: true,
        },
    }
};
</script>
<style lang="less" scoped>
@import '../../../style/minxin.less';

.tab-btn {
    width: 100%;
    // height: 100 / @baseSize;
    line-height: 50px;
    border-bottom: 1px solid #eee;
}

.tab-btn li {
    width: 100/3 * 1%;
    float: left;
    text-align: center;
    position: relative;
}

.tab-btn li p span {
    font-size: 18px;
    color: #000000;
    padding-right: 0.2rem;
}

.tab-btn li.currt-actiove p span {
    color: #48b319;
}

.user-type {
    // position: absolute;
    // top: 0.55rem;
    width: 19px;
    height: 19px;
    vertical-align: text-bottom;
}

.border-bottom {
    width: 100%;
    height: 5px;
    background: #48b319;
    position: absolute;
    bottom: 1px;
    left: 0;
    border-radius: 6px;
}
</style>