<template>
    <div class="wrap" @click="forward(code)">
        <div class="iconWrap">
            <van-icon class="icon" :color="renderColor(color)" :name="iconUrl" />
        </div>
        <div class="babel">{{ name }}</div>
    </div>
</template>
<script>
import { Dialog, Icon } from 'vant';
import { COLOR_MAP } from '../../../config/colorMap';
import wx from "weixin-js-sdk";

export default {
    props: {
        iconUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        pageUrl: {
            type: String,
            required: true,
        },
    },
    components: {
        [ Icon.name ]: Icon,
    },
    methods: {
        forward(code) {
            if (code === 'qr') {
                this.scanMaterialQR()
                return;
            }
            else if (code === 'ZH_MEDAL') {
                this.scanQR()
                return;
            }

            const t = this.pageUrl.startsWith('/weixin/wechat/dist/index.html#/') ? '#' + this.pageUrl.split('#')[ 1 ] : this.pageUrl;
            window.location.assign(t);
        },
        renderColor(clr) {
            if (clr.startsWith('#')) {
                return clr;
            } else {
                return COLOR_MAP[ clr ] || 'black';
            }
        },
        scanMaterialQR() {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    let url = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    const clip = '/app/assets/';
                    url = encodeURIComponent(clip + url.split(clip)[ 1 ]);
                    window.location.href = '/weixin/wechat/v2/index.html#/material_application/scan?url=' + url;
                },
                fail: function (res) {
                    console.log(res);
                    alert(JSON.stringify(res));
                }
            });
        },
        scanQR() {
            let vm = this;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: [ "qrCode" ], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    console.log(res);
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    // alert('[' + result + ']');
                    try {
                        vm.$http.get(result).then(response => {
                            let result = response.body;
                            if (result.code != 200) {
                                return alert(result.message);
                            }
                            // alert(JSON.stringify(result));

                            Dialog.confirm({
                                className: "dy-rate-dialog",
                                title: "",
                                message: "奖章扫码登记成功",
                                confirmButtonColor: '#0093DD',
                                confirmButtonText: "继续扫码",
                                cancelButtonText: "完成",
                            }).then(() => {
                                vm.scanQR();
                            }).catch(() => {
                                window.location.href = '/weixin/wechat/v2/index.html#/evaluate/stu';
                            });
                        }).catch((err) => {
                            alert(JSON.stringify(err));
                        });
                    } catch (e) {
                        alert(JSON.stringify(e.message));
                    }




                },
                fail: function (res) {
                    console.log(res);
                    alert(JSON.stringify(res));
                }
            });
        },
    }
};
</script>
<style lang="less" scoped>
.wrap {
    text-align: center;
}

.iconWrap {
    position: relative;
    // background-color: #bbb;
    display: flex;
    height: 50px;
    align-items: center;
}

// .iconWrap:after {
//     content: '';
//     display: block;
//     padding-bottom: 100%;
// }

.icon {
    position: absolute;
    font-size: 32px;
    width: 1em;
    left: 50%;
    margin-left: -16px;
    color: #fff;
    text-align: center;
}

.babel {
    font-size: 14px;
    color: #333;
}
</style>