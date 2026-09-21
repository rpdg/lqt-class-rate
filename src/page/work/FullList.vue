<template>
    <div class="box">
        <back-title-bar :title="getTodayDate()" />
        <div class="homework-container wapper">
            <div v-for="(course, index0) in fullList" :key="'course-' + index0" style="margin: 20px 15px;">
                <div style="margin-bottom: 25px;">
                    <div style="font-size:16px; margin: 10px 0;">
                        【{{ course.COURSE_NAME }}】
                    </div>
                    <div v-for="(work, index1) in course.WORK_LIST" :key="'work-' + index1">
                        <div v-for="(detail, index) in work.QUESTION_LIST" :key="'detail-' + index">
                            <div style="margin: 10px 0; font-size: 14px;">

                                <!-- 单选 -->
                                <div v-if="detail.QUESTYPE == '1'"
                                    style="flex: 1; display: flex; flex-direction: column; overflow: scroll;">
                                    <div class="homework-content">
                                        <p class="homework-title">{{ detail.QUESNO }}.【{{ quesTypeView[ detail.QUESTYPE
                                        ] }}】{{ detail.CONTENT }}</p>
                                        <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length"
                                            :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />

                                        <checker style="margin-top: 10px;margin-left: -5px;" radio-required
                                            default-item-class="demo3-item" selected-item-class="demo3-item-selected">
                                            <div v-for="item in detail.OPTIONLIST" :key="item.ID">
                                                <checker-item :key="item.ID" :value="item.ORDERNO">
                                                    <span class="demo3-item-default"></span>
                                                    <span
                                                        style="font-size: 16px;margin-left: 10px;word-break: break-word">{{
                                                            item.ORDERNO }}.{{ item.CONTENT }}</span><br>
                                                </checker-item>
                                                <thumbs-grid v-if="item.PICLIST && item.PICLIST.length"
                                                    :imgList="item.PICLIST" :picBase="picRootPath"
                                                    :viewFunc="previewImage" />
                                            </div>

                                        </checker>
                                    </div>
                                    <input class="answer-data" type="hidden" value="">
                                </div>
                                <!-- 单选end -->

                                <!-- 多选 -->
                                <div v-if="detail.QUESTYPE == '2'"
                                    style="flex: 1; display: flex; flex-direction: column; overflow: scroll;">
                                    <!-- id：题目id -->
                                    <div class="homework-content">
                                        <p class="homework-title">{{ detail.QUESNO }}.【{{ quesTypeView[ detail.QUESTYPE
                                        ] }}】{{ detail.CONTENT }}</p>
                                        <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length"
                                            :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                                        <checker style="margin-top: 10px;margin-left: -5px;" type="checkbox"
                                            default-item-class="demo3-item"
                                            selected-item-class="checkbox-item-selected">
                                            <div v-for="item in detail.OPTIONLIST">
                                                <checker-item :key="item.ID">
                                                    <span class="checkbox-item-default"></span>
                                                    <span
                                                        style="font-size: 16px;margin-left: 10px;word-break: break-word">{{
                                                            item.ORDERNO }}.{{ item.CONTENT }}</span><br>
                                                </checker-item>
                                                <thumbs-grid v-if="item.PICLIST && item.PICLIST.length"
                                                    :imgList="item.PICLIST" :picBase="picRootPath"
                                                    :viewFunc="previewImage" />
                                            </div>
                                        </checker>
                                    </div>
                                    <input class="answer-data" type="hidden" value="">
                                </div>
                                <!-- 多选end -->

                                <!-- 问答题 或 自定义 -->
                                <div v-if="detail.QUESTYPE == '3' || detail.QUESTYPE == '4'"
                                    style="flex: 1; display: flex; flex-direction: column; overflow: scroll;">
                                    <div class="homework-content" style="flex: 1; overflow: scroll;">
                                        <p v-if="detail.QUESTYPE != '4'" class="homework-title">
                                            {{ detail.QUESNO }}.【{{ quesTypeView[ detail.QUESTYPE ] }}】</p>
                                        <p v-if="work.QUESTION_LIST.length > 1 && detail.QUESTYPE == '4'">{{
                                            detail.QUESNO }}.</p>
                                        <div class="sub-content" v-html="detail.CONTENT"></div>
                                        <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length"
                                            :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                                        <div v-if="detail.ATT_LIST" style="margin-top: 0.5em;">
                                            <office-item v-for="file in detail.ATT_LIST" :key="file.URL"
                                                :ext="file.FILEEXT.toLowerCase()" :display-name="file.FILENAME"
                                                :url="ossPath + '/upload' + file.URL" />
                                        </div>

                                        <!--老师的图片-->
                                        <div class="teacher-img-list">
                                            <thumbs-grid v-if="detail.IMGLIST && detail.IMGLIST.length"
                                                :imgList="detail.IMGLIST" :picBase="picRootPath"
                                                :viewFunc="previewImage" />

                                        </div>

                                        <divider><x-icon type="ios-arrow-down" size="30"></x-icon></divider>
                                        <div style="font-size: 14px;text-align: center;color: #FAC030;">
                                            提示：已上传图片和已录制语音，可长按删除</div>


                                        <div v-if="detail.sWebImgList" class="answer-qs other-ans-img">
                                            <div v-for="(vDetail, vIndex) in detail.sWebImgList">
                                                <img style="max-width: 100%" :src="picRootPath + vDetail.sUrl" />
                                            </div>
                                        </div>

                                        <div v-if="detail.sWebFileList" class="answer-qs other-ans-img">
                                            <div v-for="(vDetail, vIndex) in detail.sWebFileList">
                                                <a v-if="vDetail.sUrl.indexOf('.pdf') > 0"
                                                    style="text-decoration: underline;color: yellowgreen;"
                                                    :href="'/common/fileview/go_page.jsp?filePath=' + vDetail.sUrl">{{
                                                        vDetail.sName }}</a>
                                                <a v-else-if="vDetail.sUrl.indexOf('.doc') > 0 || vDetail.sUrl.indexOf('.xls') > 0 || vDetail.sUrl.indexOf('.ppt') > 0"
                                                    style="text-decoration: underline;color: yellowgreen;"
                                                    :href="'https://view.officeapps.live.com/op/view.aspx?src=' + picRootPath + vDetail.sUrl">{{
                                                        vDetail.sName }}</a>
                                                <a v-else style="text-decoration: underline;color: yellowgreen;"
                                                    :href="picRootPath + vDetail.sUrl">{{ vDetail.sName }}</a>

                                            </div>
                                        </div>

                                        <div class="answer-qs other-ans-img">
                                            <div v-for="(vDetail, vIndex) in detail.imgList">
                                                <div style="position: relative" v-if="vDetail.ANSWER">
                                                    <img :src="vDetail.localData || vDetail.URL" />
                                                    <div style="background-color: red;position: absolute;
                      top: 0;width: 100%;height: 100%;opacity: 0;"></div>
                                                </div>


                                                <div style="position: relative" v-else>
                                                    <img :src="vDetail.SHOW_URL" @load="scrollToDivisionBottom" />
                                                    <div style="background-color: red;position: absolute;
                      top: 0;width: 100%;height: 100%;opacity: 0;"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="answer-qs other-ans-voice">
                                            <div :class="detail.ID" v-for="(vDetail, vIndex) in detail.voiceList"
                                                :key="vDetail.ID">
                                                <div v-if="vDetail.ANSWER" style="position: relative;margin-top: 2px">
                                                    <span @touchstart="gotouchstart('mp3', detail.voiceList, vIndex)"
                                                        @touchmove="gotouchmove()"
                                                        @touchend="gotouchend('mp3', detail.voiceList, vIndex, vDetail)">
                                                        <voice-item :seconds="~~vDetail.AUDIO_TIME"
                                                            :playing="playingVoice && (vDetail.ID == currentMp3Id)" />
                                                    </span>
                                                </div>

                                                <div v-else>
                                                    <span @touchstart="gotouchstart('voice', detail.voiceList, vIndex)"
                                                        @touchmove="gotouchmove()"
                                                        @touchend="gotouchend('voice', detail.voiceList, vIndex, vDetail)">
                                                        <voice-item :seconds="~~vDetail.second"
                                                            :playing="playingVoice && (vDetail.localId == currentMp3Id)" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <ul class="homework-answer" ref="answerArea">
                                            <li class="answer-qs qs-txt" style="padding: 0;">
                                                <x-textarea class="answer-textarea" @blur="textareaFocusout()"
                                                    :max="200" placeholder="" :rows="3"></x-textarea>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- 传图，录音，两个按钮 -->
                                    <div class="qs-bar clearfix">
                                        <p><span class="bar-btn btn-img"></span></p>
                                        <p><span class="bar-btn btn-voice"></span></p>
                                    </div>
                                </div>
                                <!-- 问答题end -->


                                <!-- 判断 -->
                                <div v-if="detail.QUESTYPE == '5'"
                                    style="flex: 1; display: flex; flex-direction: column; overflow: scroll;">
                                    <div class="homework-content">
                                        <p class="homework-title">{{ detail.QUESNO }}.【{{ quesTypeView[ detail.QUESTYPE
                                        ] }}】{{ detail.CONTENT }}</p>
                                        <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length"
                                            :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />

                                        <checker style="margin-top: 16px;margin-left: -5px;"
                                            default-item-class="demo3-item" selected-item-class="demo3-item-selected">
                                            <checker-item key="1" value="true">
                                                <span class="demo3-item-default"></span>
                                                <span
                                                    style="font-size: 16px;margin-left: 10px;word-break: break-word">对</span><br>
                                            </checker-item>
                                            <checker-item key="2" value="false">
                                                <span class="demo3-item-default"></span>
                                                <span
                                                    style="font-size: 16px;margin-left: 10px;word-break: break-word">错</span><br>
                                            </checker-item>
                                        </checker>
                                    </div>
                                    <input class="answer-data" type="hidden" value="">
                                </div>
                                <!-- 判断end -->

                                <!-- 填空   -->
                                <div v-if="detail.QUESTYPE == '6'"
                                    style="flex: 1; display: flex; flex-direction: column; overflow: scroll;">
                                    <div class="homework-content">
                                        <p class="homework-title">{{ detail.QUESNO }}.【{{ quesTypeView[ detail.QUESTYPE
                                        ] }}】{{ detail.CONTENT }}</p>
                                        <thumbs-grid v-if="detail.PICLIST && detail.PICLIST.length"
                                            :imgList="detail.PICLIST" :picBase="picRootPath" :viewFunc="previewImage" />
                                        <div v-for="(sItem, sIndex) in detail.ANS_CONTENT.split(',')" :key="sIndex">
                                            <input class="qa-input" :placeholder="'(' + (sIndex + 1) + ')'" /><br>
                                        </div>
                                    </div>
                                    <input class="answer-data" type="hidden" value="">
                                </div>
                                <!-- 填空end -->
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>

<script>
import BackTitleBar from "../../components/common/BackTitleBar.vue";
import Thumbs from './components/Thumbs.vue';
import VoiceItem from './components/VoiceItem.vue';
import OfficeItem from './components/OfficeItem.vue';
import apiRouter from "../../config/api.js";
import {
    XTextarea, Toast, Checker, CheckerItem, Group,
    XInput, Confirm, Divider, XHeader, Loading, Icon
} from 'vux';

export default {
    components: {
        BackTitleBar,
        [ Thumbs.name ]: Thumbs,
        [ VoiceItem.name ]: VoiceItem,
        [ OfficeItem.name ]: OfficeItem,
        XTextarea,
        Toast,
        Checker,
        CheckerItem,
        Group,
        XInput,
        Confirm,
        Divider,
        XHeader,
        Loading,
        Icon,
    },
    data() {
        return {
            ajaxLoading: false,
            loading: false,
            finished: false,
            picRootPath: '',
            fullList: [],
            pageIndex: 0,
            //1.单选 2.多选 3.问答 4.自定义 5.判断 6.填空
            quesTypeView: {
                1: '单选',
                2: '多选',
                3: '问答',
                4: '自定义',
                5: '判断题',
                6: '填空'
            },
            quesTypeShow: {
                1: '单选题',
                2: '多选题',
                3: '问答题',
                4: '作业',
                5: '判断题',
                6: '填空题'
            },
        };
    },
    async activated() {
        document.title = '作业';
        // console.log("list-length: ", this.fullList.length);
        this.ajaxLoading = false;
        this.loading = false;
        this.finished = false;
        this.fullList = [];
        this.pageIndex = 0;

        this.fetchList();
    },
    deactivated() {
        document.title = "绿蜻蜓";
    },
    methods: {
        getTodayDate() {
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            month = month < 10 ? `0${month}` : month;
            day = day < 10 ? `0${day}` : day;
            return `${month}/${day}今日作业 `;
        },
        fetchList() {
            let self = this;
            self.ajaxLoading = true;
            self.$http.post(apiRouter.Get_Homework_Full_List).then(
                (response) => {
                    if (response.body.status === 1) {
                        self.fullList = response.body.data.hkList;
                        self.picRootPath = response.body.data.root_path;
                        self.pageLoading = false;
                        if (self.fullList.length > 0) {
                        } else {
                            self.$router.back();
                        }
                    } else {
                        alert(response.body.message);
                    }
                },
                (response) => {
                    alert(response.body.message);
                }
            );
        },
        previewImage(currentUrl, imgList) {
            return;
        },
    }
};

</script>

<style lang="less" scoped>
@import '../../style/minxin.less';
@import '../../style/detail.less';

.wapper {
    position: absolute;
    top: 47px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
}


.other-ans-img {
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/

    -webkit-user-select: none;
    /*webkit浏览器*/

    -khtml-user-select: none;
    /*早起浏览器*/

    -moz-user-select: none;
    /*火狐浏览器*/

    -ms-user-select: none;
    /*IE浏览器*/

    user-select: none;
    /*用户是否能够选中文本*/
}

.other-ans-voice {
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/

    -webkit-user-select: none;
    /*webkit浏览器*/

    -khtml-user-select: none;
    /*早起浏览器*/

    -moz-user-select: none;
    /*火狐浏览器*/

    -ms-user-select: none;
    /*IE浏览器*/

    user-select: none;
    /*用户是否能够选中文本*/
}

html,
body {
    background: #f2f2f2;
    overflow: hidden
}

.lqt-container {
    top: 0;
    bottom: 45px
}

.homework-container {
    /*height: 100%;*/
    /*overflow: hidden*/
}

.homework-container .homework-list {
    /*width: 1000000000px;*/
    width: 100%;
    height: 100%;
    border-radius: 3px;
    margin-left: 0;
    // margin-bottom: 1rem;
}

.homework-container .homework-list.active {
    -webkit-transition: all .3s ease;
    transition: all .3s ease
}

.homework-container .homework-list .it {
    display: block;
    // position: relative;
    // float: left;
    width: 100%;
    /*width: 750rem;*/
    height: 100%;
    min-height: 10px;
    overflow: hidden
}

.homework-container .homework-list .scroll-wrapper {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
}

.homework-container .homework-list .scroll-dom {
    margin-bottom: 120px;
    background: #fff
}

.homework-container .homework-tips {
    padding-bottom: 5px;
    border-bottom: solid 1px #dedede
}

.homework-container .homework-tips .tips-content {
    float: left;
    width: 70%;
    text-indent: 10px
}

.homework-container .homework-tips .tips-content p:first-child {
    line-height: 30px;
    font-size: 16px
}

.homework-container .homework-tips .tips-content p:last-child {
    line-height: 20px;
    font-size: 14px
}

.homework-container .homework-tips .homework-deadline {
    float: left;
    width: 30%;
    line-height: 30px;
    font-size: 11px;
    color: #999
}

.homework-container .homework-content {
    padding: 10px;
    font-size: 16px;
    // padding-bottom: 90px;
}

.homework-container .homework-content .homework-title {
    line-height: 23px
}

.homework-container .homework-content .homework-answer {
    padding-bottom: 20px
}

.homework-container .homework-content .homework-answer .answer {
    padding: 10px 0 10px 25px
}

.homework-container .homework-content .homework-answer .answer label {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
    tap-highlight-color: rgba(0, 0, 0, 0.05)
}

.homework-container .homework-content .homework-answer .answer .icon-common {
    float: left;
    margin-left: -25px
}

.homework-container .homework-content .homework-answer .answer .answer-content {
    float: left;
    width: 100%;
    line-height: 23px
}

.homework-container .homework-content .homework-answer .correct-answer {
    padding-top: 10px
}

.homework-container .homework-content .homework-msg {
    padding-top: 5px;
    padding-bottom: 15px;
    font-size: 14px;
    color: #999
}

.homework-container .homework-content .answer-right {
    color: #48b319
}

.homework-container .homework-content .answer-wrong {
    color: #bb002b
}

.homework-container .homework-answer {
    padding-bottom: 0
}

.homework-container .answer-qs {
    margin-top: 10px
}

.homework-container .qs-txt {
    position: relative;
    border: solid 1px #dedede;
    padding: 10px
}

.homework-container .qs-txt textarea {
    position: absolute;
    top: 10px;
    right: auto;
    bottom: 10px;
    left: 10px;
    width: 93%;
    z-index: 2;
    font-size: 14px;
    color: #666;
    border: none;
    resize: none;
    outline: none;
    overflow: hidden
}

.homework-container .qs-txt .qs-content {
    position: relative;
    z-index: 1;
    width: 100%;
    font-size: 14px;
    color: #666;
    min-height: 20px;
    max-height: 300px;
    margin-left: auto;
    margin-right: auto;
    line-height: 19px;
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: auto;
    opacity: 0
}

.homework-container .qs-img img {
    display: block;
    max-width: 100%
}

.homework-container .qs-bar {
    border-top: solid 1px #dedede;
    position: fixed;
    top: auto;
    right: 0;
    bottom: 45px;
    left: 0;
    z-index: 15;
    background: #fff
}

.homework-container .qs-bar p {
    float: left;
    width: 50%;
    padding: 10px 0;
    -webkit-user-select: none;
    -webkit-touch-callout: none
}

.homework-container .qs-bar .bar-btn {
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-family: 'icon';
    font-size: 26px;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    -webkit-user-select: none;
    -webkit-touch-callout: none
}

.homework-container .qs-bar .btn-img {
    float: right;
    margin-right: 23px;
    background: #ff8a65;
    background-image: url('../../assets/work/camera.png');
    background-size: cover;
}

.homework-container .qs-bar .btn-voice {
    float: left;
    margin-left: 22px;
    background: #2782d7;
    background-image: url('../../assets/work/voice.png');
    background-size: cover
}

.homework-container .qs-answer {
    padding-top: 10px
}

.homework-container .qs-voice-icon {
    font-family: 'icon';
    font-size: 28px;
    padding-left: 13px
}

.homework-container .recordtime {
    float: left;
    margin: 6px 0 0 10px;
    line-height: 44px;
    color: #999
}

.homework-container .btn-play {
    float: left;
    position: relative;
    margin-top: 6px;
    line-height: 23px;
    padding: 8px 5px;
    font-size: 14px;
    color: #666;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#ededf2),
            to(#e2e2e6));
    /*background: gradient(linear, 0 0, 0 100%, from(#ededf2), to(#e2e2e6));*/
    box-shadow: 0 0 1px 0 #fff inset;
    border: solid 1px #dedede;
    border-radius: 3px;
    max-width: 75%;
    min-width: 15%;
    width: 20%;
    -webkit-transition: width .3s ease-in-out;
    transition: width .3s ease-in-out
}

.homework-container .btn-play.active {
    border: solid 1px #48b319
}

.homework-container .btn-play.active .arrow-up {
    background: #48b319
}

.homework-bar {
    padding: 4px 0;
    background: #48b319;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 25;
    overflow: hidden
}

.homework-bar .homework-btn {
    position: relative;
    z-index: 2;
    display: block;
    float: left;
    width: 50%;
    height: 37px;
    line-height: 37px;
    font-size: 16px;
    color: #fff;
    -webkit-transition: all .3s ease;
    transition: all .3s ease
}

.homework-bar .homework-pre,
.homework-bar .homework-submit {
    opacity: 0
}

.homework-bar .homework-next,
.homework-bar .homework-submit {
    margin-left: -2px;
    border-left: solid 2px #fff;
    position: absolute;
    top: auto;
    right: 0;
    bottom: auto;
    left: auto
}

.homework-bar .homework-next {
    z-index: 5
}

.homework-bar .homework-submit {
    z-index: 2
}

.homework-bar .icon-change,
.homework-bar .txt-change {
    float: left;
    text-align: center
}

.homework-bar .icon-change {
    width: 30%
}

.homework-bar .txt-change {
    width: 70%
}

.homework-bar .txt-submit {
    display: block;
    width: 100%;
    text-align: center
}

.homework-bar .icon-next {
    position: relative;
    top: 5px
}

.homework-bar .pre-loc {
    width: 0;
    height: 1rem;
    position: absolute;
    top: 0;
    right: auto;
    bottom: auto;
    left: 0;
    z-index: 1;
    opacity: .3;
    background: #fff;
    -webkit-transition: all .3s ease;
    transition: all .3s ease
}

#complete .scroll-dom {
    margin-bottom: 66px
}

#vote.lqt-container {
    top: 1rem
}


.pic .i {
    float: left;
    width: 100%;
    margin-top: 5px;
    height: 95px
}

.pic .i a {
    display: block
}

.pic .i p {
    margin-right: 3px;
    background-position: center;
    background-size: cover
}

.pic img {
    display: block
}

.pic.two {
    margin-left: -2px
}

.pic.two .i {
    width: 50%
}

.pic.two a {
    height: 100%
}

.pic.two p {
    height: 100%;
    margin: 0 3px 0 2px
}

.pic.ninecell {
    margin-left: -2px
}

.pic.ninecell .i {
    width: 33.333%;
    height: 95px
}

.pic.ninecell a {
    height: 100%
}

.pic.ninecell p {
    height: 100%;
    margin: 0 3px 0 2px
}

/////////
.demo3-item {
    padding: 8px 5px;
    font-size: 0;
    display: block;
}

.demo3-item-default {
    background: url('../../assets/question/radio-on-new.png') no-repeat;
    background-size: contain;
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    vertical-align: bottom;
}

.demo3-item-selected .demo3-item-default {
    background-image: url('../../assets/question/radio-on.png')
}


.checkbox-item-default {
    background: url('../../assets/question/check-box-off.png') no-repeat;
    background-size: contain;
    width: 0.9rem;
    height: 0.9rem;
    display: inline-block;
    vertical-align: bottom;
}

.checkbox-item-selected .checkbox-item-default {
    background-image: url('../../assets/question/check-box-on.png');
}

.title-header {
    background-color: #fff;
    ;
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

.qa-input {
    border: 1px solid #979797;
    height: 2.2em;
    font-size: 14px;
    margin-top: 1em;
    padding-left: 6px;
}

.icon-work-pre {
    background-image: url('../../assets/work/arrow-left-circle.png');
    background-size: cover;
}

.icon-work-next {
    background-image: url('../../assets/work/arrow-left-circle.png');
    background-size: cover;
}

.sub-content /deep/ img {
    max-width: 100%;
    /* max-height: 200px;*/
}

.sub-content {
    overflow-x: auto;
}

.sub-content /deep/ td {
    border: 1px solid #dedede;
}

.homework-answer /deep/ img {
    max-width: 100%;
}

.other-ans-img /deep/ img {
    max-width: 100%;
}

.teacher-img-list img {
    /* border: 1px blue solid;*/
    max-width: 49%;
}

.teacher-img-list p {
    height: 110px;
    width: 31%;
    display: inline-block;
    margin-right: 3px;
}

.vux-x-icon {
    fill: #dedede;
}

.wer-textarea /deep/ .weui-textarea-counter {
    margin-bottom: -1rem;
}

.answer-textarea /deep/ .weui-textarea-counter {
    color: #dedede;
}


input::-webkit-input-placeholder {
    /* 修改字体颜色 */
    color: #dedede !important;
    ;
    /* 修改字号，默认继承input */
    /*font-size: 12px;*/
    /* 设置背景色 */
    /*background: #8ac6d1;*/
}

.voice-play {
    display: inline-block;
    background-color: #03a9f4;
    height: 2em;
    border-radius: 5px;
    width: 5em;
    margin-bottom: 5px;
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    touch-callout: none;
}

.voice-ready {
    display: inline-block;
    height: 1em;
    width: 15px;
    margin-left: 5px;
    background-repeat: no-repeat;
    background-size: contain;
    vertical-align: middle;
    background-image: url('../../assets/work/airplay.png');
}

.img-local {
    max-width: 100%
}
</style>
<style lang="less" type="text/less" scoped>
.wrapContainer {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.title-header,
.lqt-container {
    padding-top: 0;
    position: unset !important;
}

.homework-bar,
.qs-bar {
    position: unset !important;
}

.homework-bar .pre-loc {
    position: relative;
}
</style>