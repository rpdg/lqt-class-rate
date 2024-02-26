<template>
    <div :class="'mask ' + (expanded ? 'expand' : '')" @click="expanded = false">
        <div :class="'typeBtn ' + (expanded ? 'expand' : '')" @click.stop="expanded = !expanded">发{{ expanded ? '布' : '' }}
        </div>
        <div :class="'send act1 ' + (expanded ? 'expand' : '')" @click.stop="sendNotice()">发通知</div>
        <div :class="'send act2 ' + (expanded ? 'expand' : '')" @click.stop="sendQuestion()">发问卷</div>
        <div :class="'send act3 ' + (expanded ? 'expand' : '')" @click.stop="noneAction()">请期待</div>
        <div :class="'send act4 ' + (expanded ? 'expand' : '')" @click.stop="announce()">发作业</div>
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
            }, 200);

        },
        sendQuestion() {
            setTimeout(() => {
                this.$router.push({ path: 'q-type' });
                this.expanded = false;
            }, 200);
        },
        announce() {
            setTimeout(() => {
                this.$router.push({ path: 'announce' });
                this.expanded = false;
            }, 200);
        },
        noneAction() {
            setTimeout(() => {
                this.expanded = false;
            }, 100);
        }
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

.mask {
    position: fixed;
    top: 0;
    left: 0;
    transition: 0.2s;

    &.expand {
        bottom: 0;
        right: 0;
        background-color: #ffffffc0;
        // backdrop-filter: blur(3px);
    }
}

.typeBtn {
    position: fixed;
    z-index: 10;

    right: 33px;
    bottom: 70px;

    width: @subBtnSize;
    height: @subBtnSize;
    line-height: @subBtnSize;

    transform: translate3d(0, 0, 0);
    transition: 0.2s ease-out;

    border-radius: 60%;

    text-align: center;
    font-size: 18px;
    color: #fff;

    background-color: @mainGreen;

    &.expand {
        width: @bigBtnSize;
        height: @bigBtnSize;
        line-height: @bigBtnSize;

        right: 28px;
        bottom: 65px;
    }


    &:active {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 1), 0 0 0 6px fade(@mainGreen, 35%)
    }
}

.send {
    display: block;
    position: fixed;
    z-index: 9;

    right: 33px;
    bottom: 70px;

    width: @subBtnSize/1.5;
    height: @subBtnSize/1.5;
    line-height: @subBtnSize/1.5;

    transform: translate3d(0, 0, 0);
    transition: all 0.3s ease-out, box-shadow 0.2s;

    border-radius: 60%;

    text-align: center;
    font-size: 12px;
    color: #fff;

    opacity: 0;

    &.expand {
        opacity: 1;
        width: @subBtnSize;
        height: @subBtnSize;
        line-height: @subBtnSize;
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