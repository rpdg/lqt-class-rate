<template>
    <div class="wrap" @click="forward(code, deptCode)">
        <div class="iconWrap">
            <van-icon class="icon" :color="renderColor(color)" :name="iconUrl" style="font-weight: 900;" />
        </div>
        <div class="babel">{{ name }}</div>
    </div>
</template>
<script>
import { Dialog, Icon } from 'vant';
import { THEME_COLOR_MAP } from '../../../config/colorMap';
import wx from "weixin-js-sdk";


/**
 * 向 URL 添加或更新查询参数
 * @param {string} url - 原始URL
 * @param {Object} params - 要添加或更新的参数对象
 * @returns {string} - 更新后的URL
 */
function addUrlParams(url, params) {
    try {
        const urlObj = new URL(url);

        // 保存原有的 hash
        const hash = urlObj.hash;

        // 添加或更新所有参数
        Object.entries(params).forEach(([ key, value ]) => {
            urlObj.searchParams.set(key, value);
        });

        // 确保 hash 在最后
        return urlObj.href.replace(hash, '') + hash;

    } catch (e) {
        // 如果 URL 解析失败，使用字符串处理方法
        const [ baseUrl, hash = '' ] = url.split('#');
        const separator = baseUrl.includes('?') ? '&' : '?';

        // 将参数对象转换为查询字符串
        const queryString = Object.entries(params)
            .map(([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return `${baseUrl}${separator}${queryString}${hash ? '#' + hash : ''}`;
    }
}


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
        deptCode: {
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
        forward(code, deptCode) {
            if (code === 'qr') {
                this.scanMaterialQR();
                return;
            } else if (code === 'ZH_MEDAL') {
                this.scanQR();
                return;
            }

            let t = this.pageUrl.startsWith('/weixin/wechat/dist/index.html#/') ? '#' + this.pageUrl.split('#')[ 1 ] : this.pageUrl;
            if (deptCode) {
                t = addUrlParams(t, { deptCode, docTitle: this.name });
                // t += '?deptCode=' + deptCode + '&docTitle=' + this.name;
            }

            window.location.assign(t);
        },
        renderColor(clr) {
            if (clr.startsWith('#')) {
                return clr;
            } else {
                return THEME_COLOR_MAP[ clr ] || 'black';
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
    height: 53px;
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