<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">活动管理</h2>
        <div class="cr-panel">
            <el-input type="text"  placeholder="活动id"
                v-model="searchInfo.id" class="inline"></el-input>
            <el-input type="text"  placeholder="店铺id"
                v-model="searchInfo.storeId" class="inline"></el-input>
            <el-input type="text"  placeholder="店铺名称"
                v-model="searchInfo.storeName" class="inline"></el-input>
            <el-select v-model="searchInfo.value" size="11%" placeholder="活动状态">
                <el-option v-for="item in searchInfo.options"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary"
                @click.prevent="searchBtn">搜索</el-button>
            <el-button type="primary"
                @click="newActivity">新增活动</el-button>
        </div>
        <div class="cr-panel">
            <el-table style="width: 100%"
                element-loading-text="拼命加载中" v-loading.body="isLoading"
                :data="tableData">
                <el-table-column type="expand" width="50">
                    <template scope="props">
                        <div class="tag-block">
                            <div class="tag-list-title">关联的创意</div>
                            <div class="tag-list">
                                <el-tag v-for="(item,index) in props.row.ideas" :key="index"
                                    type="primary">{{ item.id }} | {{ item.name }}</el-tag>
                            </div>
                        </div>
                        <div class="tag-block">
                            <div class="tag-list-title">投放店铺</div>
                            <div class="tag-list">
                                <el-tag v-for="(item,index) in props.row.shops" :key="index"
                                    type="primary">{{ item.id }} | {{ item.shopName }}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="活动id" prop="id"></el-table-column>
                <el-table-column label="活动名称" prop="name"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="投放日期" prop="dateShowRange"></el-table-column>
                <el-table-column label="投放时间" prop="timeShowRange"></el-table-column>

                <el-table-column label="创建人" prop="author"></el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button :disabled="!scope.row.canIEdit"
                            size="small"
                            @click="editActivity(scope.$index, scope.row)">编辑</el-button>
                        <el-button :disabled="!scope.row.canIEdit"
                            size="small" type="danger"
                            @click="showdeleteDialog(scope.$index, scope.row)">删除</el-button>
                        <el-button size="small"
                            @click="changeActivityState(scope.$index, scope.row)">{{ scope.row.activityState }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination v-if="total>10" layout="prev, pager, next"
                :page-size="pageSize" :total="total" :current-page="pageNow"
                @current-change="changePage"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Util from '@/libs/util';
import {
    Form,
    FormItem,
    Input,
    Table,
    TableColumn,
    Loading,
    Button,
    Tag,
    Pagination,
    MessageBox,
    Select,
    Option,
} from 'element-ui';

import ActivityAPI from '@/api/Activity';

Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);

export default {
    name: 'activity-list',
    data() {
        return {
            isLoading: false,
            tableData: [],
            total: 0,
            pageSize: 10,
            pageNow: 1,
            searchInfo: {
                value: null,
                status: '',
                storeId: '',
                id: '',
                storeName: '',
                options: [
                    {
                        label: '全部',
                        value: 0,
                    },
                    {
                        label: '已下线',
                        value: 1,
                    },
                    {
                        label: '未开始',
                        value: 2,
                    },
                    {
                        label: '进行中',
                        value: 3,
                    },
                    {
                        label: '已结束',
                        value: 4,
                    },
                ],
            },
        };
    },
    mounted() {
        this.getActivityList();
    },
    methods: {
        newActivity() {
            location.href = './createActivity.html';
        },
        changePage(currentPage) {
            this.pageNow = currentPage;
            this.getActivityList();
        },
        searchBtn() {
            this.pageNow = 1;
            this.getActivityList();
        },
        // 获取活动列表
        async getActivityList() {
            this.isLoading = true;
            try {
                const data = await ActivityAPI.getActivityList({
                    pageSize: this.pageSize,
                    pageNow: this.pageNow,
                    id: this.searchInfo.id,
                    shopName: this.searchInfo.storeName,
                    shopId: this.searchInfo.storeId,
                    status: this.searchInfo.status,
                    startDate: this.searchInfo.startDate,
                    endDate: this.searchInfo.endDate,
                });
                this.isLoading = false;
                this.total = data.count;
                // 表格数据
                const arr = [];

                data.entry.forEach((el) => {
                    const obj = {};

                    obj.id = el.id;
                    obj.name = el.name;
                    obj.createTime = el.gmtCreate.split('\u0020')[0];
                    obj.timeRange = this.getRange(el.startDate, el.endDate);

                    const tRange = this.getTempRange(el.startDate.slice(0, -3), el.endDate.slice(0, -3)).split('\u0020');

                    obj.dateShowRange = tRange[0];
                    obj.timeShowRange = tRange[1];

                    obj.author = el.author;
                    obj.status = el.status;
                    obj.activityState = el.status ? '下线' : '上线';

                    obj.startDate = el.startDate;
                    obj.endDate = el.endDate;
                    obj.state = this.setState(el.status, Date.parse(el.startDate), Date.parse(el.endDate));

                    // 判断当前活动是否可编辑
                    let edit = false;
                    if (!el.status) {
                        edit = true;
                    }
                    obj.canIEdit = edit;
                    obj.ideas = el.activityCreativeIds;
                    obj.shops = el.shopIds;

                    arr.push(obj);
                });
                this.tableData = arr;
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        getTempRange(a, b) {
            const arr1 = a.split('\u0020');
            const arr2 = b.split('\u0020');
            return `${arr1[0]}~${arr2[0]} ${arr1[1]}~${arr2[1]}`;
        },
        getRange(a, b) {
            const arr1 = a.split('\u0020');
            const arr2 = b.split('\u0020');
            return `${arr1[0]}~${arr2[0]}(${arr1[1]}~${arr2[1]})`;
        },
        editActivity(index, activityObj) {
            location.href = `createActivity.html?id=${activityObj.id}`;
            localStorage.setItem('activityObj', JSON.stringify(activityObj));
        },
        // 点击删除创意的按钮，显示提示框
        showdeleteDialog(index, activityObj) {
            const deleteActivity = this.deleteActivity;
            MessageBox.confirm('您确定要删除该活动吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteActivity(index, activityObj);
            });
        },
        // 删除创意的接口
        async deleteActivity(index, activityObj) {
            // 提交数据
            try {
                const data = await ActivityAPI.deleteActivity({
                    id: activityObj.id,
                    isDelete: 1,
                });
                Util.toast(data.message, 'notice', 1500);
                this.getActivityList();
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        async changeActivityState(index, activityObj) {
            try {
                await ActivityAPI.updateActivityStatus({
                    id: activityObj.id,
                    status: (activityObj.activityState === '上线') ? 1 : 0,
                });
                Util.toast('操作成功', 'notice', 1500);
                activityObj.activityState = activityObj.activityState === '上线' ? '下线' : '上线';

                activityObj.status = activityObj.status === 1 ? 0 : 1;
                activityObj.state = this.setState(activityObj.status, Date.parse(activityObj.startDate), Date.parse(activityObj.endDate));

                // 判断当前活动是否可编辑
                let edit = false;
                if (!activityObj.status) {
                    edit = true;
                }
                activityObj.canIEdit = edit;
                this.$set(this.tableData, index, activityObj);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        setState(status, startDate, endDate) {
            let str = '';
            const nowDate = Date.now();
            if (status === 0) {
                str = '已下线';
            } else if (nowDate < startDate) {
                str = '未开始';
            } else if (nowDate > endDate) {
                str = '已结束';
            } else {
                str = '进行中';
            }
            return str;
        },
    },
    watch: {
        'searchInfo.value': function() {
            if (this.searchInfo.value === 0) {
                this.searchInfo.status = '';
                this.searchInfo.startDate = '';
                this.searchInfo.endDate = '';
            } else if (this.searchInfo.value === 1) {
                this.searchInfo.status = 0;
                this.searchInfo.startDate = false;
                this.searchInfo.endDate = false;
            } else if (this.searchInfo.value === 2) {
                this.searchInfo.status = 1;
                this.searchInfo.startDate = true;
                this.searchInfo.endDate = false;
            } else if (this.searchInfo.value === 3) {
                this.searchInfo.status = 1;
                this.searchInfo.startDate = true;
                this.searchInfo.endDate = true;
            } else {
                this.searchInfo.status = 1;
                this.searchInfo.startDate = false;
                this.searchInfo.endDate = true;
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

.tag-list-title {
    font-weight:bold;
}
.tag-block {
    margin:10px auto;
}
.el-input.inline{
    display: inline-block;
    width: 11% !important;
}
</style>
