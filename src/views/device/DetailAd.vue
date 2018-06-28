<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">活动创意展示</h2>
        <div class="cr-panel">
            <el-table class="cr-table" style="width:100%"
                :data="typeList">
                <el-table-column prop="id" label="创意ID" align="center" header-align="center"></el-table-column>
                <el-table-column prop="name" label="创意名字" align="center" header-align="center"></el-table-column>
                <el-table-column prop="activityMaterialUrl" label="创意URL" align="center" header-align="center"></el-table-column>
                <el-table-column prop="id" label="操作" align="center" header-align="center">
                    <template scope="item">
                        <el-button :data-url="item.activityMaterialUrl"
                            type="primary" size="small"
                            v-if="item.activityMaterialType === 1"
                            @click.prevent="showad">查看</el-button>
                        <el-button :data-url="item.activityMaterialUrl"
                            type="primary" size="small"
                            v-if="item.activityMaterialType === 2"
                            @click.prevent="showvideo">播放</el-button>
                        <el-button type="primary" size="small"
                            v-if="item.activityMaterialType === 4"
                            @click.prevent="openUrl(item.activityMaterialUrl)">打开</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination v-if="totalCount > 0"
                    layout="prev, pager, next"
                    :total="totalCount"
                    @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="silderdialog" v-model="silderdialog"
            custom-class="ele-modal" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <div class="block">
                <div class="cr-img" >
                    <img alt="广告" :src="imgsrc"/>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-if="videodialog" v-model="videodialog"
            custom-class="ele-modal" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <div class="block">
                <video :src="videourl"></video>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Button,
    Pagination,
    Table,
    TableColumn,
    Dialog,
} from 'element-ui';

import Util from '@/libs/util';
import ProcurementAPI from '@/api/Procurement';
import UserAPI from '@/api/User';

Vue.use(Dialog);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);

export default{
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            showRadioDialog: false,
            imgsrc: '',
            totalCount: '',
            silderdialog: false,
            videodialog: false,
            imgtype: true,
            videourl: '',
            videoisact: true,
            shopId: '',
            groupId: '',
            adlist: [],
        };
    },
    created() {
        UserAPI.login();
    },
    mounted() {
        if (Util.getUrlParam('id')) {
            this.shopId = Util.getUrlParam('shopId');
            this.groupId = Util.getUrlParam('groupId');
            this.search();
        }
    },
    methods: {
        // 加载创意列表
        async search() {
            if (this.IS_LOADING) {
                return false;
            }
            this.IS_LOADING = true;
            if (this.shopId === undefined || this.groupId === undefined) {
                Util.toast('暂无数据', 'failed', 1500);
                this.IS_LOADING = false;
                return false;
            }
            try {
                const { entry, totalCount } = await ProcurementAPI.getCreative({
                    shopId: this.shopId,
                    groupId: this.groupId,
                });
                this.adlist = entry;
                this.totalCount = totalCount;
            } catch (err) {
                Util.toast(err, 'failed', 1500);
            } finally {
                this.IS_LOADING = false;
            }
            return true;
        },
        // 查看图片
        showad($event) {
            this.imgsrc = $event.target.dataset.url;
            this.silderdialog = true;
        },
        // 播放视频
        showvideo($event) {
            this.videourl = $event.target.dataset.url;
            this.videodialog = true;
        },
        openUrl(url) {
            window.open(url);
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

.videoact {
    width: 98%;
}

.cr-img {
    text-align: center;
}

.cr-img img {
    vertical-align: middle;
}
</style>
