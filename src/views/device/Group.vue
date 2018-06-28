<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">设备分组管理</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <el-button type="primary"
                    @click.prevent="addGroup">新增设备分组</el-button>
            </div>
        </form>
        <div class="cr-panel">
            <el-table class="cr-table" style="width:100%"
                :data="groupList">
                <el-table-column prop="id" label="分组ID" align="center" header-align="center"></el-table-column>
                <el-table-column prop="name" label="分组名称" align="center" header-align="center"></el-table-column>
                <el-table-column prop="deviceTypeName" label="设备类型" align="center" header-align="center"></el-table-column>
                <el-table-column label="操作" align="center" header-align="center">
                    <template scope="item">
                        <el-button type="danger" size="small"
                            @click.prevent="showDelPop(item.row.id, item.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination v-if="totalCount > 10"
                    layout="prev, pager, next"
                    :total="totalCount"
                    @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="editdialog" v-model="editdialog"
            custom-class="ele-modal" top="30%"
            :title="tilte" :show-close="false">
            <el-form>
                <el-form-item label="分组名称：" label-width="120px">
                     <el-input class="dialog-ipt"
                        v-model="groupname"></el-input>
                </el-form-item>
                <el-form-item label="设备类型：" label-width="120px">
                     <el-select placeholder="设备类型"
                        v-model="types">
                        <el-option v-for="item in type" :key="item.id"
                            :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer"
                slot="footer">
                <el-button @click="editdialog = false">取 消</el-button>
                <el-button type="primary"
                    @click="confirmupdate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Button,
    Pagination,
    Input,
    Dialog,
    Select,
    Option,
    Table,
    FormItem,
    Form,
    TableColumn,
    MessageBox,
} from 'element-ui';

import Util from '@/libs/util';
import DeviceAPI from '@/api/Device';

Vue.use(Button);
Vue.use(Pagination);
Vue.use(Input);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);

export default {
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            groupList: [],
            totalCount: '',
            editdialog: false,
            groupname: '',
            types: null,
            tilte: '编辑设备分组',
            type: [],
            pageNo: 1,
        };
    },
    mounted() {
        this.search();
    },
    methods: {
        // 加载分组列表
        async search() {
            if (this.IS_LOADING) {
                return;
            }
            this.IS_LOADING = true;
            try {
                const { entry, total } = await DeviceAPI.getDeviceGroup({
                    pageNo: this.pageNo,
                    pageSize: 10,
                });
                this.IS_LOADING = false;
                this.groupList = entry;
                this.totalCount = total;
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        // 新增设备分组
        async addGroup() {
            this.groupname = null;
            this.types = null;
            this.editdialog = true;
            this.tilte = '新增设备分组';
            try {
                const { entry } = await DeviceAPI.getAllDeviceType({
                    name: this.groupname,
                    deviceTypeId: this.types,
                });
                this.IS_LOADING = false;
                this.type = entry;
                this.search();
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        // 分页
        handleCurrentChange(pageNum) {
            this.pageNo = pageNum;
            this.search();
        },
        // 删除分组
        showDelPop(id, idx) {
            const delGroup = this.delGroup;
            MessageBox.confirm('您确定要删除该分组吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                delGroup(id, idx);
            }).catch(() => {
            });
        },
        checkdata() {
            if (!this.groupname) {
                Util.toast('请填写分组名称', 'failed', 1500);
                return false;
            }
            if (!this.types) {
                Util.toast('请选择设备类型', 'failed', 1500);
                return false;
            }
            return true;
        },
        // 保存编辑
        async confirmupdate() {
            this.checkdata();
            try {
                const message = await DeviceAPI.createDeviceGroup({
                    name: this.groupname,
                    deviceTypeId: this.types,
                });
                this.editdialog = false;
                this.IS_LOADING = false;
                this.search();
                Util.toast(message, 'succeed', 2000);
            } catch (err) {
                this.IS_LOADING = false;
                Util.toast(err, 'failed', 2000);
            }
        },
        // 确定删除
        async delGroup(id, idx) {
            try {
                const message = await DeviceAPI.deleteDeviceGroup({
                    deviceGroupId: id,
                });
                this.groupList.splice(idx, 1);
                Util.toast(message, 'succeed', 2000);
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
.dialog-ipt{
    width: 195px;
}
.cr-require {
    color: red;
    display: inline-block;
    font-size: 5px;
    padding-right: 5px;
}
.cr-m-label {
    width: 150px !important;
}
</style>
