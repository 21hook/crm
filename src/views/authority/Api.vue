<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">用户权限 > api管理</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-input  placeholder="url" v-model="searchForm.url" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-select placeholder="系统" class="select"
                        v-model="searchForm.system">
                        <el-option :label="item" :value="index" v-for="item ,index in system" :key="index"></el-option>
                    </el-select>
                </div>
                <div class="el-form-item">
                    <el-input  placeholder="创建人" v-model="searchForm.author" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="searchBtn">搜索</el-button>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="clearSearchBtn">重置</el-button>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="addApiClearForm">添加api</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <el-table style="width: 100%" v-loading.body="isLoading"
                :data="apiTable">
                <el-table-column label="ID" prop="apiId"></el-table-column>
                <el-table-column label="API名称" prop="name"></el-table-column>
                <el-table-column label="URL" prop="url"></el-table-column>
                <el-table-column label="所属系统">
                    <template scope="item">
                        <p>{{system[item.row.system]}}</p>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column label="创建人" prop="author"></el-table-column>
                <el-table-column label="请求方式">
                    <template scope="item">
                        <p>{{type[item.row.type]}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" prop="gmtModified"></el-table-column>
                <el-table-column label="操作" width="140px">
                    <template scope="item">
                        <el-button size="small" @click.prevent="editApiForm(item.row.apiId, item.$index)">编辑</el-button>
                        <el-button size="small" type="danger" @click.prevent="delConfirm(item.row.apiId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination
                    v-if ="pagination.totalPagination > 10"
                    layout="total, prev, pager, next"
                    :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="getAllApi"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="dialogFormShow" v-model="dialogFormShow"  title="添加API"
            :show-close="true" :close-on-click-modal="false" >
            <el-form label-width="80px"
                :model="dialogForm" :rules="FormRules" ref="addEidtForm" >
                <el-form-item label="API名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="url" prop="url">
                   <el-input v-model="dialogForm.url"></el-input>
                </el-form-item>
                <el-form-item label="所属系统" prop="system">
                    <el-select v-model="dialogForm.system">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in system"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求方式" prop="type">
                    <el-select v-model="dialogForm.type">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in type"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogFormShow= false">取 消</el-button>
                <el-button type="primary" @click="validateAddEdit">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue';
import {
    DatePicker,
    Select,
    Option,
    Dialog,
    Button,
    Input,
    FormItem,
    Form,
    Pagination,
    MessageBox,
    Table,
    TableColumn,
    Tag,
    Loading,
} from 'element-ui';

import Util from '@/libs/util';

import ApiAPI from '@/api/Api.js';

Vue.use(Loading);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Tag);
Vue.use(Pagination);
export default {
    data() {
        return {
            searchForm: {
                url: '',
                system: '',
                author: '',
            },
            apiTable: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            isLoading: true,
            system: {
                1: 'member',
                2: 'dacq',
                3: 'shop',
                4: 'procurement',
                5: 'message',
            },
            type: {
                1: '不需要登录访问',
                2: '登录就能访问',
            },
            dialogForm: {
                name: '',
                url: '',
                system: '',
                type: '',
            },
            dialogFormShow: false,
            FormRules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('API名称必填'));
                            } else if (value.length > 64) {
                                callback(new Error('API不能超过64个字符'));
                            }
                            callback();
                        },
                    },
                ],
                url: [
                    {
                        required: true,
                        message: 'url必填',
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('url必填'));
                            } else if (value.length > 256) {
                                callback(new Error('url不能超过256个字符'));
                            }
                            callback();
                        },
                    },
                ],
                system: [
                    {
                        required: true,
                        message: '所属系统必选',
                        trigger: 'change',
                    },
                ],
                type: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '请求方式必选',
                    },
                ],
            },
            operatorItem: {
                apiId: null,
                index: -1,
            },
        };
    },
    mounted() {
        this.getAllApi();
    },
    methods: {
        // 点击搜索按钮
        searchBtn() {
            this.pagination.currentPage = 1;
            this.getAllApi();
        },
        // 获取所有api
        async getAllApi() {
            try {
                const { count, entry } = await ApiAPI.getAllApi({
                    pageNow: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    author: this.searchForm.author,
                    system: this.searchForm.system,
                    url: this.searchForm.url,
                });
                this.pagination.totalPagination = count;
                this.apiTable = entry;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 添加api按钮，把数据清空
        addApiClearForm() {
            this.operatorItem.apiId = null;
            this.operatorItem.index = -1;
            this.dialogFormShow = true;
            this.dialogForm.name = '';
            this.dialogForm.url = '';
            this.dialogForm.system = '';
            this.dialogForm.type = '';
        },
        // 点击编辑按钮，将数据填了form 表单
        editApiForm(id, index) {
            this.operatorItem.index = index;
            this.operatorItem.apiId = id;
            this.dialogFormShow = true;
            this.dialogForm.name = this.apiTable[index].name;
            this.dialogForm.url = this.apiTable[index].url;
            this.dialogForm.system = this.apiTable[index].system.toString();
            this.dialogForm.type = this.apiTable[index].type.toString();
        },
        // 点击确认按钮，提交新增或编辑的按钮
        async validateAddEdit() {
            this.$refs.addEidtForm.validate((valid) => {
                if (valid) {
                    this.addEditSubmit();
                }
            });
        },
        async addEditSubmit() {
            const submitObj = {};
            submitObj.name = this.dialogForm.name;
            submitObj.url = this.dialogForm.url;
            submitObj.system = this.dialogForm.system;
            submitObj.type = this.dialogForm.type;

            try {
                if (this.operatorItem.apiId) {
                    submitObj.apiId = this.operatorItem.apiId;
                    await ApiAPI.updateApi(submitObj);
                    Util.toast('成功编辑api', 'notice', 1500);
                } else {
                    await ApiAPI.addApi(submitObj);
                    Util.toast('成功添加api', 'notice', 1500);
                }
                this.dialogFormShow = false;
                this.getAllApi();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 确认删除
        delConfirm(id) {
            const delApi = this.delApi;
            MessageBox.confirm('您确定要删除该api吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                delApi(id);
            }).catch(() => {});
        },
        // 根据api id 删除api
        async delApi(id) {
            try {
                await ApiAPI.deleteApiById({
                    apiId: id,
                });
                this.getAllApi();
                Util.toast('成功删除', 'notice', 1500);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        clearSearchBtn() {
            this.searchForm.author = '';
            this.searchForm.system = '';
            this.searchForm.url = '';
            this.pagination.currentPage = 1;
        },
    },
    computed: {
    },
};
</script>
<style scoped>
@import '../../assets/common';
</style>