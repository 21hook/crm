<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">计划管理 > 计划查询</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <div class="el-form-item">
                    <label class="el-form-label">ID：</label>
                    <input autocomplete="off" v-model="id" type="text" class="el-form-input">
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">广告主名称：</label>
                    <input autocomplete="off" v-model="advertiserName" type="text" class="el-form-input">
                </div>
                <div class="el-form-item btn-form-item">
                    <el-button type="primary" @click.prevent="queryPlanList">搜索</el-button>
                    <el-button type="primary" @click.prevent="createPlan">新建计划</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
         <el-table element-loading-text="拼命加载中" v-loading.body="isLoading" :data="activityList" >
                <el-table-column label="计划ID" prop="id"></el-table-column>
                <el-table-column label="计划名称" prop="activityName"></el-table-column>
                <el-table-column label="红包金额">
                    <template scope="item">
                        {{item.row.hongbaoTotalPrice | moneyToyuan}}
                    </template>
                </el-table-column>
                <el-table-column label="每笔红包金额">
                    <template scope="item">
                        {{item.row.maxHongbaoPrice | moneyToyuan}}
                    </template>
                </el-table-column>
                <el-table-column label="商户每笔佣金">
                    <template scope="item">
                        {{item.row.shopCommissionIncome | moneyToyuan}}
                    </template>
                </el-table-column>
                <el-table-column label="限制" prop="limitCountForDevice"></el-table-column>
                <el-table-column label="活动商品" prop="id">
                    <template scope="item">
                        <p v-for="(obj,i) in item.row.adScanActivityItemDTOs" :key="i.barcode">
                            {{obj.barcode}}/{{obj.itemName}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="计划时间"  width="180px">
                    <template scope="item">
                     <p>{{item.row.startTime}}</p>
                     <p>{{item.row.endTime}}</p>
                     </template>
                </el-table-column>
                <el-table-column label="广告主" prop="advertiserName">
                </el-table-column>
                <el-table-column label="状态"  width="80px">
                    <template scope="item">
                        <span v-if="item.row.status == 1">待开始</span>
                        <span v-if="item.row.status == 2">进行中</span>
                        <span v-if="item.row.status == 3">已结束</span>
                        <span v-if="item.row.status == 4">已删除</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70px">
                    <template scope="item">
                        <p class="f-mb10">
                            <el-button size="small" @click.prevent="showEditPop(item.$index,item.row.id)">编辑</el-button>
                        </p>
                        <p>
                            <el-button size="small" type="danger" @click.prevent="showDelPop(item.$index,item.row.id)">删除</el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination
                    v-if ="pagination.totalPagination"
                    layout="total, prev, pager, next"
                    :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="queryPlanList"></el-pagination>
            </div>
        </div>
        <!-- 编辑 -->
        <el-dialog v-if="editDialog.show" v-model="editDialog.show" :show-close="false" custom-class="ele-modal" top="30%">
            <div class="no-top-border">
                <div class="el-form-item">
                    <label class="el-form-label">计划开始时间：</label>
                    <el-date-picker v-model="editDialog.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">计划结束时间：</label>
                    <el-date-picker v-model="editDialog.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmUpdate">确定</el-button>
                    <el-button type="cancel" @click="editDialog.show=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        DatePicker,
        Pagination,
        Button,
        Dialog,
        Switch,
        Table,
        TableColumn,
        MessageBox,
        Loading,
    } from 'element-ui';
    import Util from '@/libs/util';
    import adActivityAPI from '@/api/AdActivity';

    Vue.use(DatePicker);
    Vue.use(Pagination);
    Vue.use(Button);
    Vue.use(Dialog);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Switch);
    Vue.use(Loading);
    export default {
        data() {
            return {
                id: '',
                advertiserName: '',
                activityList: [],
                editDialog: {
                    show: false,
                    startTime: '',
                    endTime: '',
                },
                isLoading: false,
                operateItem: {
                    id: null,
                    idx: 0,
                },
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    totalPagination: 0,
                },
            };
        },
        mounted() {
            this.queryPlanList();
        },
        methods: {
            async queryPlanList() {
                this.isLoading = true;
                try {
                    const adActivityList = await adActivityAPI.queryAllAdScanActivity({
                        activityId: this.id,
                        advertiserName: this.advertiserName,
                        pageNo: this.pagination.currentPage,
                        pageSize: this.pagination.pageSize,
                    });
                    this.activityList = adActivityList.entry;
                    this.pagination.totalPagination = adActivityList.totalCount;
                } catch (e) {
                    Util.toast(e, 'notice', 1500);
                } finally {
                    this.isLoading = false;
                }
            },
            createPlan() {
                location.href = 'createActivity.html';
            },
            showEditPop(idx, id) {
                this.operateItem = {
                    id,
                    idx,
                };
                this.editDialog = {
                    show: true,
                    startTime: Util.formatDateNew(new Date(this.activityList[idx].startTime), 'yyyy-MM-dd HH:mm:ss'),
                    endTime: Util.formatDateNew(new Date(this.activityList[idx].endTime), 'yyyy-MM-dd HH:mm:ss'),
                };
            },
            //  显示删除弹框
            showDelPop(idx, id) {
                const deleteActitityFn = this.deleteActitityFn;
                MessageBox.confirm('您确定要删除该计划吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButactivityCreativeDetailDTOtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    deleteActitityFn(idx, id);
                }).catch(() => {});
            },
            async deleteActitityFn(idx, id) {
                try {
                    await adActivityAPI.updateAdScanActivity({
                        isDelete: 1,
                        id,
                    });
                    this.activityList.splice(idx, 1);
                } catch (e) {
                    Util.toast(e, 'notice', 1500);
                }
            },
            // 编辑活动
            async confirmUpdate() {
                if (!this.editDialog.startTime || !this.editDialog.endTime) {
                    Util.toast('请填写活动时间起止时间', 'failed', 1500);
                    return false;
                }
                // 活动时间规则
                if (new Date(this.editDialog.startTime).getTime() > new Date(this.editDialog.endTime).getTime()) {
                    Util.toast('活动的结束时间应晚于开始时间', 'failed', 1500);
                    return false;
                }
                try {
                    await adActivityAPI.updateAdScanActivity({
                        id: this.operateItem.id,
                        startTime: Util.formatDateNew(new Date(this.editDialog.startTime), 'yyyy-MM-dd HH:mm:ss'),
                        endTime: Util.formatDateNew(new Date(this.editDialog.endTime), 'yyyy-MM-dd HH:mm:ss'),
                    });
                    this.editDialog.show = false;
                    Util.toast('操作成功', 'succeed', 2000);
                    this.queryPlanList();
                } catch (e) {
                    Util.toast(e, 'failed', 1500);
                }
                return true;
            },
        },
        filters: {
            // 将钱的单位又分显示为元
            moneyToyuan: (val) => {
                if (val === 0) {
                    return 0;
                }
                return (val / 100).toFixed(2);
            },
        },
    };
</script>
<style type="text/css">
@import '../../assets/common';
</style>