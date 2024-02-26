<template>
    <div style="position: fixed; top:0; bottom: 0; left: 0; right: 0;">
        <div :class="'typeBtn ' + (expanded ? 'expand' : '')" @click="expanded = !expanded">发{{ expanded ? '布' : '' }}</div>
        <div :class="'send act1 ' + (expanded ? 'expand' : '')" @click="sendNotice()">发通知</div>
        <div :class="'send act2 ' + (expanded ? 'expand' : '')" @click="sendQuestion()">发问卷</div>
        <div :class="'send act3 ' + (expanded ? 'expand' : '')">请期待</div>
        <div :class="'send act4 ' + (expanded ? 'expand' : '')" @click="announce()">发作业</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            expanded: false,
        };
    },
    methods: {
        sendNotice() {
            setTimeout(() => {
                this.expanded = false;
                this.$router.push({ path: 'type' });
            }, 300);

        },
        sendQuestion() {
            setTimeout(() => {
                this.$router.push({ path: 'q-type' });
                this.expanded = false;
            }, 300);
        },
        announce() {
            setTimeout(() => {
                this.$router.push({ path: 'announce' });
                this.expanded = false;
            }, 300);
        },
    }
};
</script>
<style lang="less" scoped>
@mainGreen: #48b319;
@mainRed: #ED561B;
@mainBlue: #0093DD;
@lightGray: #999999;
@mainOrange: #FF8F03;

@bigBtnSize: 60px;
@subBtnSize: 50px;

.BtnPosition(@size, @zIndex) {
    display: block;
    position: fixed;
    z-index: @zIndex;

    right: 13.5vmin;
    bottom: 14.4vmin;

    width: @size;
    height: @size;

    transform: translate3d((@size / 2), (@size / 2), 0);
}

.typeBtn {
    transition: 0.2s ease-out;
    position: fixed;
    z-index: 10;

    right: 33px;
    bottom: 70px;

    width: 50px;
    height: 50px;
    line-height: 50px;
    // transform: translate3d(25px, 25px, 0);

    border-radius: 60%;

    text-align: center;
    font-size: 18px;
    color: #fff;

    background-color: @mainGreen;

    &.expand {
        width: 60px;
        height: 60px;
        line-height: 60px;

        right: 28px;
        bottom: 65px;
    }
}

.send {
    display: block;
    position: fixed;
    z-index: 9;

    right: 33px;
    bottom: 70px;

    width: 50px;
    height: 50px;
    line-height: 50px;

    // transform: translate3d(25px, 25px, 0);
    transition: all 0.3s ease-out;
    // transition: box-shadow 0.3s ease;

    border-radius: 60%;

    text-align: center;
    font-size: 12px;
    color: #fff;

    opacity: 0;

    &.expand {
        opacity: 1;
    }

    &.act1 {
        background-color: @mainRed;

        &.expand {
            right: 28px;
            bottom: 158px;
        }

        &:active {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 1), 0 0 0 6px fade(@mainRed, 50%)
        }
    }

    &.act2 {
        background-color: @mainBlue;

        &.expand {
            right: 86px;
            bottom: 140px;
        }

        &:active {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 1), 0 0 0 6px fade(@mainBlue, 50%)
        }
    }

    &.act3 {
        background-color: @lightGray;

        &.expand {
            right: 119px;
            bottom: 89px;
        }

        &:active {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 1), 0 0 0 6px fade(@lightGray, 50%)
        }
    }

    &.act4 {
        background-color: @mainOrange;

        &.expand {
            right: 112px;
            bottom: 28px;
        }

        &:active {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 1), 0 0 0 6px fade(@mainOrange, 50%)
        }
    }
}


@keyframes animation1 {
    to {
        transform: translate3d((@subBtnSize/2) + 4vmin, (@subBtnSize/2) - 22.5vmin, 0);
        opacity: 1;
    }
}

@keyframes animation2 {
    to {
        transform: translate3d((@subBtnSize/2) - 11.4vmin, (@subBtnSize/2) - 20vmin, 0);
        opacity: 1;
    }
}

@keyframes animation3 {
    to {
        transform: translate3d((@subBtnSize/2) - 22.58vmin, (@subBtnSize/2) - 8.6vmin, 0);
        opacity: 1;
    }
}

@keyframes animation4 {
    to {
        transform: translate3d((@subBtnSize/2) - 22.58vmin, (@subBtnSize/2) + 6.8vmin, 0);
        opacity: 1;
    }
}
</style>