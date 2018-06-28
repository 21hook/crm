<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">文件上传</h2>
        <div class="cr-panel">
            <section class="content">
                <div class="panel panel-default">
                    <el-upload class="upload-demo" :name="name" :multiple="true"
                       ref="upload"
                       :action="uploadTarget" :accept="acceptType" :before-upload="stationChange" :on-success="uploadSuccess" :on-error="uploadFail" :auto-upload="false" >
                        <el-button slot="trigger"
                            type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;"
                            type="success"
                            @click="submitUpload">上传到服务器</el-button>
                        <div class="el-upload__tip"
                            slot="tip">暂时只支持上传音频文件，且文件大小默认不能超过500 KB。
                            <div class="show-info"
                                @click="userSetSize">但是，我想上传大于 500 KB 的文件。</div>
                        </div>
                    </el-upload>
                    <div class="upload-fail"></div>
                </div>
                <div class="panel">
                    <h1>已上传文件</h1>
                    <div class="file-list">
                        <div class="file-item"
                            v-for="(file, index) in files" :key="index">
                            <figure @mouseleave="resetItem">
                                <img :src="fileImage" :title="file.matterName">
                                <div class="copy-link" :data-fulllink="file.matterUrl"
                                    @click="copyLink($event)">{{ msg }}</div>
                                <div class="play-music" :data-fulllink="file.matterUrl"
                                    v-html="musicButton"
                                    @click="playMusic($event)"></div>
                            </figure>
                            <div class="file-title">{{ file.matterName }}</div>
                        </div>
                    </div>
                    <el-pagination layout="prev, pager, next, jumper"
                        :current-page.sync="currentPage" :page-size="pageSize" :total="totalCount"
                        @current-change="getMaterialList"></el-pagination>
                </div>
            </section>
        </div>
        <div class="copy-area"></div>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Upload,
    Pagination,
    Button,
    MessageBox,
} from 'element-ui';

import Util from '@/libs/util';
import { baseURL } from '@/api/HTTP';
import MaterialAPI from '@/api/Material';

Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Button);

Vue.prototype.$prompt = MessageBox.prompt;

export default {
    data() {
        return {
            uploadTarget: `${baseURL}/message/oss/voiceUpload`,
            name: 'fileUpload',
            acceptType: '.mp3, .wma, .wav, .flac, .aac, .m4a, .ogg',
            files: [],
            loading: true,
            fullLink: '',
            fileSizeMax: 500,
            currentPage: 1,
            pageSize: 30,
            totalCount: 0,
            fileImage: 'http://cdnhomepage.elephtribe.com/aifocus/mp3.png',
            msg: '复制链接',
            lastAudio: '',
            musicButton: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="fill:#13ce66;    pointer-events: none;"><title>play2</title><path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z"></path></svg>',
            playButton: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="fill:#13ce66;    pointer-events: none;"><title>play2</title><path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z"></path></svg>',
            pauseButton: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="fill:#13ce66;    pointer-events: none;"><title>pause</title><path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z"></path></svg>',
        };
    },
    async mounted() {
        // 检测是否更改默认的文件上传的大小限制
        if (location.search) {
            location.search.split('&').forEach((el) => {
                if (el.match(/fileSize/)) {
                    this.fileSizeMax = Number.parseInt(el.split('=')[1], 10);
                }
            });
        }
        await this.getMaterialList();
    },
    methods: {
        submitUpload() {
            // 确认上传之前先清空之前记录的错误信息
            const uploadFail = document.querySelector('.upload-fail');
            uploadFail.innerHTML = '';

            const uploadForm = document.querySelector('input[name=fileUpload]');

            if (uploadForm.files.length < 1) {
                Util.toast('至少选择一个文件', 'notice', 2000);
                return false;
            }

            this.$refs.upload.submit();
            return true;
        },
        // 获取当前用户的上传文件历史记录
        async getMaterialList() {
            try {
                const { count, entry } = await MaterialAPI.selectMaterialList({
                    pageNow: this.currentPage,
                    pageSize: this.pageSize,
                });
                this.loading = false;
                this.totalCount = count;
                this.files = entry;
            } catch (err) {
                this.loading = false;
                this.files = [];
                document.querySelector('.file-list').innerHTML = err;
            }
        },
        async uploadSuccess() {
            Util.toast('上传成功', 'notice', 1500);
            const uploadList = document.querySelector('.el-upload-list');
            uploadList.innerHTML = '';
            this.loading = true;
            await this.getMaterialList();
        },
        uploadFail(err, file) {
            const name = file.name;
            const uploadFail = document.querySelector('.upload-fail');
            const p = document.createElement('p');

            p.innerHTML = `${name} 上传失败 ~`;
            uploadFail.appendChild(p);
        },
        stationChange(file) {
            // 比较单位 KB
            if (file.size / 1000 > this.fileSizeMax) {
                Util.toast(`文件大小必须小于${this.fileSizeMax}KB`, 'notice', 2000);
                return false;
            }
            return true;
        },
        userSetSize() {
            this.$prompt('请输入你想要上传文件的大小', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\d+/,
                inputErrorMessage: '格式不正确',
                inputPlaceholder: '比如输入 2000，表示限制为 2000KB',
            }).then((value) => {
                const query = `?fileSize=${Number.parseInt(value.value, 10)}`;
                if (window.location.search) {
                    window.location = window.location.href.replace(window.location.search, '') + query;
                } else {
                    window.location = window.location.href + query;
                }
            }).catch(() => {
            });
        },
        copyLink(event) {
            const copyNode = document.querySelector('.copy-area');
            const range = document.createRange();
            const selection = window.getSelection();
            this.fullLink = event.currentTarget.getAttribute('data-fulllink');
            copyNode.innerHTML = this.realLink;
            range.selectNode(copyNode);

            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }

            selection.addRange(range);
            document.execCommand('copy');

            this.msg = '复制成功';
            Util.toast('复制成功 ~', 'success', 2000);
        },
        resetItem() {
            this.msg = '复制链接';
            this.musicButton = this.playButton;
            if (this.lastAudio) {
                this.lastAudio.pause();
                this.lastAudio = '';
            }
        },
        playMusic(event) {
            this.musicButton = this.pauseButton;

            if (this.lastAudio) {
                this.musicButton = this.playButton;
                this.lastAudio.pause();
                this.lastAudio = '';
                return false;
            }
            this.fullLink = event.target.getAttribute('data-fulllink');

            const audio = new Audio(this.realLink);
            this.lastAudio = audio;
            if (!audio) {
                Util.toast('你使用的浏览器不支持在线播放音乐', 'notice', 2000);
                return false;
            }
            audio.preload = 'none';
            audio.play();
            return true;
        },
    },
    computed: {
        realLink: function () {
            return `http://cdn.elephtribe.com/${this.fullLink}`;
        },
    },
};

</script>

<style>
@import '../../assets/common';

.content-header h1 {
    color: #000;
    font-weight: 700;
    font-size: 16px;
    font-family: "Microsoft YaHei", "宋体", Helvetica Neue, Arial, SimSun, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    padding-bottom: 20px;
    border-bottom: solid 1px #ddd;
    margin-bottom: 20px;
}

.panel {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
}

.panel h1 {
    color: #666;
    font-size: 1.2em;
    padding-bottom: 6px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.el-upload-list__item {
    width: 500px;
    height: 24px;
}

.el-progress--line {
    box-sizing: border-box;
    position: absolute;
    top: 20px;
    margin: 0;
    padding: 0 5px;
}

.upload-fail p {
    margin: 5px 2px;
    color: red;
}

.upload-fail p:first-child {
    margin-top: 20px;
}

.file-item {
    display: inline-block;
    width: 150px;
    height: 200px;
    margin: 10px;
}

.file-item figure {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 170px;
    overflow: auto;
}

.file-item figure img {
    width: 90%;
    transition: 0.3s;
}

.copy-link {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    z-index: 9;
    width: 100px;
    height: 30px;
    margin: auto;
    line-height: 30px;
    text-align: center;
    border-radius: 6px;
    opacity: 0;
    color: #FFF;
}

.play-music {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40px;
    z-index: 9;
    width: 32px;
    height: 32px;
    margin: auto;
    line-height: 32px;
    text-align: center;
    border-radius: 6px;
    opacity: 0;
    color: #FFF;
}

.file-item figure:hover img {
    opacity: 0.2;
    transition: 0.5s;
}

.file-item figure:hover .copy-link {
    background: #13ce66;
    opacity: 0.8;
    cursor: pointer;
    transition: 0.6s;
}

.file-item figure:hover .play-music {
    opacity: 1;
    cursor: pointer;
    transition: 0.6s;
}

.file-title {
    line-height: 30px;
    white-space: nowrap;
    overflow: auto;
    text-align: center;
}

.copy-area {
    width: 0;
    height: 0;
    opacity: 0;
    position: absolute;
    z-index: -1;
}

.el-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

.show-info {
    display: inline-block;
    color: red;
}

.show-info:hover {
    color: deepskyblue;
    font-weight: bold;
    cursor: pointer;
}

.el-message {
    z-index: 999999 !important;
}
</style>