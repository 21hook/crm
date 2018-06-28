<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">邀请码配置</h2>
        <div class="cr-panel">
            <el-button type="primary"
                @click="createCodeModel = true">新建邀请码</el-button>
        </div>
        <div class="cr-panel"
            v-loading="isLoading">
            <el-table style="width: 100%"
                :data="codeList">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="code" label="邀请码"></el-table-column>
                <el-table-column label="创建时间">
                    <template scope="item">{{ item.row.gmtCreate.substring(0,10) }}</template>
                </el-table-column>
                <el-table-column label="过期时间">
                    <template scope="item">{{ item.row.expiryDate.substring(0,10) }}</template>
                </el-table-column>
                <el-table-column label="使用次数">
                    <template scope="item">
                        <a class="table-link" :href="'invitedUser.html?code='+item.row.code">{{ item.row.useCount }}/{{ item.row.totalCount }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="绑定用户"></el-table-column>
                <el-table-column label="用户类型">
                    <template scope="item">
                        <div v-if="item.row.userType === 1">商家</div>
                        <div v-else>运营</div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" width="180" label="绑定用户手机号"></el-table-column>
                <el-table-column label="操作">
                    <template scope="item">
                        <el-button size="small"
                            @click="openUpdateModel(item.row.code)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination style="text-align: center;padding-top: 40px;"
                layout="prev, pager, next" :current-page.sync="beginIndex"
                :page-size="pageSize" :total="totalNum"
                @current-change="getCodeList"></el-pagination>
            </div>
        </div>
        <el-dialog title="新建邀请码" size="tiny"
                :visible.sync="createCodeModel"
                @close="clearCreate">
            <el-form label-width="120px"
                :model="createCodeData"  :rules="rules"  ref="codeDialog">
                <el-form-item label="有效期配置" prop="validDay">
                    <el-input v-model="createCodeData.validDay"></el-input>
                </el-form-item>
                <el-form-item label="邀请次数限制" prop="totalCount">
                    <el-input v-model="createCodeData.totalCount"></el-input>
                </el-form-item>
                <el-form-item label="绑定手机号" >
                    <el-input v-model="createCodeData.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearCreate">取 消</el-button>
                <el-button type="primary" @click="validateCode">创 建</el-button>
            </span>
        </el-dialog>
        <el-dialog title="邀请码修改" size="tiny"
            :visible.sync="codeEditModel"
            @close="clearEdit">
            <el-form label-width="150px"
                :model="editCodeData" :rules="rules" ref="editCodeDialog" >
                <el-form-item label="邀请码">
                    {{ editCodeData.code }}
                </el-form-item>
                <el-form-item label="已邀请次数">
                    {{ editCodeData.useCount }}
                </el-form-item>
                <el-form-item label="有效期配置" prop="validDay">
                    <el-input v-model="editCodeData.validDay"></el-input>
                </el-form-item>
                <el-form-item label="邀请次数限制" prop="totalCount">
                    <el-input v-model="editCodeData.totalCount"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearEdit">取 消</el-button>
                <el-button type="primary" @click="showUpdateDialog">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Form,
    FormItem,
    Input,
    Table,
    TableColumn,
    Pagination,
    Button,
    Loading,
    Dialog,
} from 'element-ui';

import Util from '@/libs/util';
import CodeAPI from '@/api/InvitationCode';

Vue.use(Loading);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Button);
Vue.use(Dialog);

export default {
    data() {
        return {
            isLoading: true,
            // 列表信息
            codeList: [],
            pageSize: 10,
            totalNum: 0,
            beginIndex: 1,
            createCodeModel: false,
            codeEditModel: false,
            // 创建邀请码信息
            createCodeData: {},
            rules: {
                validDay: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value || !/^\d*$/.test(value) || value < 0) {
                                return callback(new Error('必须为正整数'));
                            }
                            return callback();
                        },
                        trigger: 'blur',
                    },
                ],
                totalCount: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value || !/^\d*$/.test(value) || value < 0) {
                                return callback(new Error('邀请次数为正整数'));
                            }
                            return callback();
                        },
                        trigger: 'blur',
                    },
                ],
                // mobile: [
                //     {
                //         validator: (rule, value, callback) => {
                //             if (!value) {
                //                 return callback(new Error('号码不能为空'));
                //             } else if (!/^1[34578]\d{9}$/.test(value)) {
                //                 return callback(new Error('号码格式错误'));
                //             }
                //             return true;
                //         },
                //         trigger: 'blur',
                //     },
                // ],
            },
            editCodeData: {
                validDay: '',
                totalCount: '',
                code: '',
            },
        };
    },
    mounted() {
        this.getCodeList();
    },
    methods: {
        // 获得邀请码列表
        async getCodeList() {
            try {
                this.isLoading = true;
                const { invitationCodeList, total } = await CodeAPI.getInvitationCodeList({
                    pageSize: this.pageSize,
                    beginIndex: (this.beginIndex * 10) - 10,
                });
                this.codeList = invitationCodeList;
                this.totalNum = total;
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            } finally {
                this.isLoading = false;
            }
        },
        clearCreate() {
            // 清空信息
            this.createCodeModel = false;
            this.createCodeData = {
                validDay: '',
                totalCount: '',
                mobile: '',
                useCount: '',
            };
        },
        // 创建邀请码
        async createCode() {
            try {
                const message = await CodeAPI.addInvitationCode(this.createCodeData);
                Util.toast(message, 'success', 2000);
                this.clearCreate();
                // 加载新列表信息
                this.isLoading = true;
                await this.getCodeList();
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            } finally {
                this.isLoading = false;
            }
            return true;
        },
        //  点击添加邀请码按钮
        validateCode() {
            const createCode = this.createCode;
            this.$refs.codeDialog.validate((valid) => {
                if (valid) {
                    createCode();
                }
            });
        },
        clearEdit() {
            this.codeEditModel = false;
        },
        async openUpdateModel(code) {
            try {
                this.codeEditModel = true;
                const entry = await CodeAPI.getInvitationCode({ code });
                this.editCodeData = entry;
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            }
        },
        showUpdateDialog() {
            const updateCodeConfig = this.updateCodeConfig;
            this.$refs.editCodeDialog.validate((valid) => {
                if (valid) {
                    updateCodeConfig();
                }
            });
        },
        async updateCodeConfig() {
            try {
                const message = await CodeAPI.updateInvitationCode({
                    code: this.editCodeData.code,
                    totalCount: this.editCodeData.totalCount,
                    validDay: this.editCodeData.validDay,
                });
                Util.toast(message, 'success', 2000);
                this.clearEdit();
                await this.getCodeList();
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            }
            return true;
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
.table-link{
    color:#148ddc;
}
</style>
