<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">设备类型管理</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <el-button type="primary"
                    @click.prevent="addgrpup">新增设备类型</el-button>
            </div>
        </form>
        <div class="cr-panel">
            <el-table class="cr-table" style="width:100%"
                :data="typeList">
                <el-table-column prop="id" label="类型ID" align="center" header-align="center"></el-table-column>
                <el-table-column prop="name" label="类型名称" align="center" header-align="center"></el-table-column>
                <el-table-column  label="操作" align="center" header-align="center">
                    <template scope="item">
                        <el-button
                            type="danger" size="small"
                            @click.prevent="showdelpopup(item.row.id, item.$indx)">删除</el-button>
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
            :title="this.tilte" :show-close="false">
            <div class="no-top-border">
                <form class="cr-form">
                    <div class="cr-panel">
                        <div class="el-form-item">
                            <label class="el-form-label cr-m-label"><span class="cr-require">&#10045;</span>设备类型名称：</label>
                            <input type="text" class="el-form-input" autocomplete="off"
                                v-model="groupname">
                        </div>
                    </div>
                </form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                    @click="confirmupdate">确定</el-button>
                <el-button @click="editdialog = false">取消</el-button>
			</span>
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
    Table,
    TableColumn,
    MessageBox,
} from 'element-ui';

import Util from '@/libs/util';
import DeviceAPI from '@/api/Device';

Vue.use(Button);
Vue.use(Pagination);
Vue.use(Input);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);

export default {
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            typeList: [],
            totalCount: '',
            editdialog: false,
            groupname: '',
            types: [],
            deldialog: false,
            tilte: '编辑设备分组',
            type: [],
            editId: '',
            deteleId: '',
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
                return false;
            }
            this.IS_LOADING = true;
            try {
                const { entry, total } = await DeviceAPI.getDeviceType({
                    pageNo: this.pageNo,
                    pageSize: 10,
                });
                this.IS_LOADING = false;
                this.typeList = entry;
                this.totalCount = total;
            } catch (err) {
                this.IS_LOADING = false;
            }
            return true;
        },
        // 分页
        handleCurrentChange(pageNum) {
            this.pageNo = pageNum;
            this.search();
        },
        // 新增设备分组
        addgrpup() {
            this.editdialog = true;
            this.tilte = '新增设备类型';
            this.groupname = '';
        },
        // 弹出删除弹窗
        showdelpopup(id, idx) {
            this.deteleId = id;
            const deldevicetype = this.deldevicetype;
            MessageBox.confirm('您确定要删除该设备吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deldevicetype(id, idx);
            }).catch(() => {
            });
        },
        checkdata() {
            if (!this.groupname) {
                Util.toast('请填写设备类型名称', 'failed', 1500);
                return false;
            }
            return true;
        },
        // 保存编辑
        async confirmupdate() {
            this.checkdata();
            try {
                const message = await DeviceAPI.addDeviceType({
                    name: this.groupname,
                });
                this.IS_LOADING = false;
                this.editdialog = false;
                Util.toast(message, 'succeed', 2000);
                this.search();
            } catch (err) {
                this.IS_LOADING = false;
                Util.toast(err, 'failed', 2000);
            }
        },
        // 确定删除
        async deldevicetype() {
            try {
                const message = await DeviceAPI.deviceGroup({
                    deviceTypeId: this.deteleId,
                });
                this.IS_LOADING = false;
                this.deldialog = false;
                Util.toast(message, 'succeed', 2000);
                this.search();
            } catch (err) {
                this.IS_LOADING = false;
                Util.toast(err, 'failed', 2000);
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

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
