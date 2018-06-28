<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">用户权限 > 权限管理</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="showAuthorityGroupBtn">添加权限组</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <el-table style="width: 100%" v-loading.body="isLoading"
                :data="authorityTable">
                <el-table-column type="expand" default-expand-all="true">
                    <template scope="scope">
                        <div v-if="scope.row.secondAuthority.length >0">
                            <div class="table-row-box">
                                <p class="table-title">权限名称</p>
                                <p class="table-url">权限链接</p>
                                <p class="table-description">权限描述</p>
                                <p class="table-opreator">权限操作</p>
                            </div>
                            <div v-for="item,index in scope.row.secondAuthority" class="table-row-box">
                                <p class="table-title">{{item.name}}</p>
                                <p class="table-url">{{item.url}}</p>
                                <p class="table-description">{{item.description}}</p>
                                <p class="table-opreator">
                                    <el-button class="table-btn" @click.prevent="editAuthorityFn(scope.$index,item.authorityId,index)" size="small">编辑权限</el-button>
                                    <el-button class="table-link" type="danger" @click.prevent="unbindAuthorityRelation(scope.$index,item.authorityId,index)" size="small">解除绑定</el-button>
                                </p>
                            </div>
                        </div>
                        <p class="f-txtct" v-else>没有添加权限</p>
                    </template>
                </el-table-column>
                <el-table-column label="ID" prop="authorityId"></el-table-column>
                <el-table-column label="权限组" prop="name"></el-table-column>
                <el-table-column label="权限组类型">
                    <template scope="scope">{{authorityType[scope.row.type]}}</template>
                </el-table-column>
                <el-table-column label="最后操作人" prop="author"></el-table-column>
                <el-table-column label="权限组描述" prop="description"></el-table-column>
                <el-table-column label="操作" align="center" width="220">
                    <template scope="item">
                        <div class="btn-box">
                        <el-button size="small" @click.prevent="editAuthorityGroup(item.row.authorityId, item.$index)">编辑</el-button>
                         <el-button size="small" type="primary" @click.prevent="addAuthorityFn(item.row.authorityId, item.$index)">添加权限</el-button>
                        <el-button size="small" type="danger" @click.prevent="delConfirm(item.row.authorityId)">删除</el-button>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-if="addAuthorityGroup.show" v-model="addAuthorityGroup.show"  title="添加权限组"
            :show-close="true" :close-on-click-modal="false"  size="tiny" >
            <el-form label-width="100px" :model="addAuthorityGroup" ref="addAuthorityGroupForm">
                <el-form-item label="权限组名称" prop="name" :rules="[{ required: true, message: '请输入权限组名称', trigger: 'blur' }]" >
                    <el-input v-model="addAuthorityGroup.name" class="ipt-wt200"></el-input>
                </el-form-item>
                <el-form-item label="权限组类型" prop="type" :rules="[{ required: true, message: '请选择权限组类型', trigger: 'change' }]">
                    <el-select v-model="addAuthorityGroup.type">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in authorityType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限组描述">
                    <el-input class="ipt-wt200" v-model="addAuthorityGroup.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addAuthorityGroup.show= false">取 消</el-button>
                <el-button type="primary" @click="addAuthorityGroupBtn">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="addAuthority.show" v-model="addAuthority.show"  :title="addAuthority.title"
            :show-close="true" :close-on-click-modal="false"  size="tiny" >
            <el-form label-width="100px" :model="addAuthority" ref="addAuthorityForm"  :rules="addAuthorityForm">
                <el-form-item label="权限名称" prop="name" >
                    <el-input v-model="addAuthority.name" class="ipt-wt200"></el-input>
                </el-form-item>
                <div  v-if="authorityTable[addAuthority.authorityGroupIdx].type==0">
                    <el-form-item label="权限url"  prop="url">
                        <el-input v-model="addAuthority.url" class="ipt-wt200" placeholder="请输入权限url"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="权限描述">
                    <el-input v-model="addAuthority.description" class="ipt-wt200"></el-input>
                </el-form-item>
                <el-form-item label="关联API" prop="type">
                    <el-button @click="showApiDialog">+添加关联API</el-button>
                    <div class="api-list-box">
                        <ul>
                            <li style="overflow-x:auto"
                                v-for="(item,index) in addAuthority.apiList" :key="index">
                                <el-tag type="primary"
                                    :closable="true"
                                    @close="removeOneApi(index)">{{item.apiId}} | {{ item.name }}</el-tag>
                            </li>
                        </ul>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addAuthority.show= false">取 消</el-button>
                <el-button type="primary" @click="addEidtAuthorityValidater">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="API列表" size="large" v-if="apiListDialog.show" v-model="apiListDialog.show" :close-on-click-modal="false">
            <div class="dialog3-content">
                <div class="dialog4-left">
                    <el-form class="search-shop-form"
                        :inline="true" :model="apiListDialog.search">
                        <el-form-item>
                            <el-input placeholder="url"
                                v-model="apiListDialog.search.url"></el-input>
                        </el-form-item>
                         <el-select placeholder="系统" class="select"
                            v-model="apiListDialog.search.system">
                            <el-option label="member" value="1"></el-option>
                            <el-option label="dacq " value="2"></el-option>
                            <el-option label="shop" value="3"></el-option>
                            <el-option label="procurement" value="4"></el-option>
                            <el-option label="message" value="5"></el-option>
                        </el-select>
                        <el-form-item>
                            <el-input  placeholder="创建人" v-model="apiListDialog.search.author" type="text"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="searchApi">搜索</el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" @click="chooseApiBtn">选定</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table class="shop-search-result" ref="apiDialogTable"
                        v-loading.body="apiListDialog.Loading" element-loading-text="拼命加载中" height="440" border
                        :data="apiListDialog.apiList"
                        @selection-change="apiCheckedChange">
                         <el-table-column class="select" type="selection" width="55"></el-table-column>
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
                    </el-table>
                </div>
                <div class="dialog3-right">
                    <div class="title" style="height:40px; line-height:40px;font-weight:bolder;">已选择 {{ apiListDialog.choosedAPiList.length }} 个api</div>
                    <ul>
                        <li style="overflow-x:auto"
                            v-for="(apiObj,index) in apiListDialog.choosedAPiList" :key="index">
                            <el-tag type="primary"
                                :closable="true"
                                @close="removeOneSearchApi(index)">{{apiObj.apiId}} | {{ apiObj.name }}</el-tag>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="m-pagination-box" >
                <el-pagination
                    v-if ="apiListDialog.pagination.totalPagination"
                    layout="total, prev, pager, next"
                    :current-page.sync="apiListDialog.pagination.currentPage" :page-size="apiListDialog.pagination.pageSize" :total="apiListDialog.pagination.totalPagination"
                    @current-change="searchIdea"></el-pagination>
            </div>
            <div class="dialog4-foot">
                <div class="dialog3-foot-right">
                    <el-button class="idea-queding"
                        type="primary"
                        :disabled="apiListDialog.choosedAPiList.length <= 0"
                        @click.native="confrimAddApi">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue';
import {
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

import AuthorityAPI from '@/api/Authority.js';
import ApiAPI from '@/api/Api.js';

Vue.use(Loading);
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
            authorityTable: [],
            isLoading: true,
            authorityType: {
                1: '服务',
                0: '菜单',
            },
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
                3: '需要有权限／服务访问',
            },
            addAuthorityGroup: {
                name: '',
                type: '0',
                url: '',
                description: '',
                show: false,
            },
            operatorItem: {
                id: null,
                index: -1,
            },
            addAuthority: {
                show: false,
                title: '添加权限',
                name: '',
                apiList: [],
                type: null,
                url: '',
                authorityId: null,
                parentId: null,
                authorityGroupIdx: -1,
            },
            // 添加api的弹窗
            apiListDialog: {
                show: false,
                search: {
                    url: '',
                    system: '',
                    author: '',
                },
                apiList: [],
                Loading: true,
                choosedAPiList: [],
                pagination: {
                    totalPagination: 0,
                    currentPage: 1,
                    pageSize: 10,
                },
                choosedAPiTemp: [],
            },
            addAuthorityForm: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('权限名称必填'));
                            } else if (value.length > 64) {
                                callback(new Error('权限名称不能超过64个字符'));
                            }
                            callback();
                        },
                    },
                ],
                url: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('权限url必填'));
                            } else if (value.length > 256) {
                                callback(new Error('权限url不能超过256个字符'));
                            }
                            callback();
                        },
                    },
                ],
            },
        };
    },
    mounted() {
        this.getAllAuthority();
    },
    methods: {
        // 显示用户组的弹窗
        showAuthorityGroupBtn() {
            this.operatorItem.id = null;
            this.operatorItem.index = -1;
            this.addAuthorityGroup.show = true;
            this.addAuthorityGroup.name = '';
            this.addAuthorityGroup.type = '0';
            this.addAuthorityGroup.url = '';
            this.addAuthorityGroup.description = '';
        },
        // 添加权限组的验证
        addAuthorityGroupBtn() {
            const addAuthorityGroupFn = this.addAuthorityGroupFn;
            this.$refs.addAuthorityGroupForm.validate((valid) => {
                if (valid) {
                    addAuthorityGroupFn();
                }
            });
        },
        // 添加、更新权限组函数
        async addAuthorityGroupFn() {
            const addItem = {};
            addItem.name = this.addAuthorityGroup.name;
            addItem.type = this.addAuthorityGroup.type;
            addItem.description = this.addAuthorityGroup.description;
            addItem.parentId = 0;

            try {
                if (this.operatorItem.id) {
                    addItem.authorityId = this.operatorItem.id;
                    await AuthorityAPI.updateAuthorityById(addItem);
                    Util.toast('成功更新权限组', 'notice', 1500);
                    this.addAuthorityGroup.show = false;
                } else {
                    await AuthorityAPI.addAuthority(addItem);
                    Util.toast('成功添加权限组', 'notice', 1500);
                    this.addAuthorityGroup.show = false;
                }
                this.getAllAuthority();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 获取所有权限组
        async getAllAuthority() {
            try {
                const { entry } = await AuthorityAPI.getAllAuthority({
                    pageNow: 1,
                    pageSize: 100,
                    parentId: 0,
                });
                this.authorityTable = entry;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        async editAuthorityGroup(id, idx) {
            this.operatorItem.id = id;
            this.operatorItem.index = idx;
            this.addAuthorityGroup.show = true;
            this.addAuthorityGroup.name = this.authorityTable[idx].name;
            this.addAuthorityGroup.type = this.authorityTable[idx].type.toString();
            this.addAuthorityGroup.description = this.authorityTable[idx].description;
            this.addAuthorityGroup.url = this.authorityTable[idx].url;
        },
        // 确认删除
        delConfirm(id) {
            const deleteAuthorityById = this.deleteAuthorityById;
            MessageBox.confirm('您确定要删除该权限组吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteAuthorityById(id, () => {
                    this.getAllAuthority();
                });
            }).catch(() => {});
        },
        // 根据authorityId删除权限
        async deleteAuthorityById(id, call) {
            try {
                await AuthorityAPI.deleteAuthorityById({
                    authorityId: id,
                });
                call && call();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 添加权限
        addAuthorityFn(id, index) {
            this.addAuthority.show = true;
            this.addAuthority.title = '添加权限';
            this.addAuthority.name = '';
            this.addAuthority.apiList = [];
            this.addAuthority.authorityId = null;
            // 添加权限时，当前权限组的id为父id
            this.addAuthority.parentId = id;
            this.addAuthority.type = null;
            this.addAuthority.url = '';
            this.addAuthority.authorityGroupIdx = index;
        },
        // 编辑权限,将权限的信息回填到弹出框
        editAuthorityFn(parentIndex, id, index) {
            const parentObj = this.authorityTable[parentIndex];
            const itemObj = parentObj.secondAuthority[index];
            this.addAuthority.show = true;
            this.addAuthority.title = '编辑权限';
            this.addAuthority.name = itemObj.name;
            this.addAuthority.authorityId = id;
            this.addAuthority.type = itemObj.type.toString();
            this.addAuthority.description = itemObj.description;
            this.addAuthority.url = itemObj.url;
            this.addAuthority.authorityGroupIdx = parentIndex;
            this.getAuthorityDetail(id);
        },
        // 添加权限，编辑权限接口
        async getAuthorityDetail(id) {
            const params = {
                authorityId: id,
                pageSize: 100,
                pageNow: 1,
            };
            try {
                const { entry } = await AuthorityAPI.getAuthorityDetail(params);
                this.addAuthority.apiList = entry.apis;
                this.addAuthority.parentId = entry.parentId;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 通过authorityId 获取所有的api 列表
        async getApiByAuthorityId(id) {
            const params = {
                authorityId: id,
                pageSize: 100,
                pageNow: 1,
            };
            try {
                const { entry } = await AuthorityAPI.getApiByAuthorityId(params);
                this.addAuthority.apiList = entry;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 验证添加权限，编辑权限参数
        addEidtAuthorityValidater() {
            const addEidtAuthoritySubmit = this.addEidtAuthoritySubmit;
            this.$refs.addAuthorityForm.validate((valid) => {
                if (valid) {
                    addEidtAuthoritySubmit();
                }
            });
        },
        // 添加权限，编辑权限的的提交函数
        async addEidtAuthoritySubmit() {
            const apiIds = this.addAuthority.apiList.map(item => item.apiId);
            try {
                const params = {
                    name: this.addAuthority.name,
                    description: this.addAuthority.description,
                    url: this.addAuthority.url,
                    type: this.authorityTable[this.addAuthority.authorityGroupIdx].type,
                    parentId: this.addAuthority.parentId,
                    apiIds,
                };
                if (this.addAuthority.authorityId) {
                    params.authorityId = this.addAuthority.authorityId;
                    await AuthorityAPI.updateAuthorityById(params);
                    Util.toast('成功更新权限', 'notice', 1500);
                } else {
                    await AuthorityAPI.addAuthority(params);
                    Util.toast('成功添加权限', 'notice', 1500);
                }
                this.getAllAuthority();
                this.addAuthority.show = false;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 展示当前api列表
        showApiDialog() {
            this.apiListDialog.show = true;
            this.apiListDialog.Loading = true;
            this.apiListDialog.apiList = [];
            this.apiListDialog.choosedAPiList = [];
            this.apiListDialog.choosedAPiTemp = [];
            this.apiListDialog.pagination = {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            };
            this.apiListDialog.search = {
                author: '',
                system: '',
                url: '',
            };
            this.getAllApi();
        },
        // 获取所有api
        async getAllApi() {
            try {
                const { entry } = await ApiAPI.getAllApi({
                    pageNow: this.apiListDialog.pagination.currentPage,
                    pageSize: this.apiListDialog.pagination.pageSize,
                    author: this.apiListDialog.search.author,
                    system: this.apiListDialog.search.system,
                    url: this.apiListDialog.search.url,
                });
                this.apiListDialog.Loading = false;
                this.apiListDialog.apiList = entry;
                this.$refs.apiDialogTable.clearSelection();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // api被选中
        apiCheckedChange(selection) {
            this.apiListDialog.choosedAPiTemp = selection;
        },
        chooseApiBtn() {
            Util.mergeObjToArray(this.apiListDialog.choosedAPiList, this.apiListDialog.choosedAPiTemp, 'apiId');
        },
        // 点击确认按钮
        confrimAddApi() {
            this.apiListDialog.show = false;
            Util.mergeObjToArray(this.addAuthority.apiList, this.apiListDialog.choosedAPiList, 'apiId');
        },
        // 从权限中删除api
        removeOneApi(idx) {
            this.addAuthority.apiList.splice(idx, 1);
        },
        // 点击搜索按钮 搜索api
        searchApi() {
            this.apiListDialog.pagination.currentPage = 1;
            this.getAllApi();
        },
        // 解除权限的绑带关系
        unbindAuthorityRelation(parentIndex, id, index) {
            const deleteAuthorityById = this.deleteAuthorityById;
            MessageBox.confirm('您确定要删除该权限吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteAuthorityById(id, () => {
                    this.authorityTable[parentIndex].secondAuthority.splice(index, 1);
                });
            }).catch(() => {});
        },
        // 删除已选中的api
        removeOneSearchApi(idx) {
            this.apiListDialog.choosedAPiList.splice(idx, 1);
        },
    },
    computed: {
    },
};
</script>
<style scoped>
@import '../../assets/common';
.ipt-wt200{
    width: 194px;
}
.table-row-box{
    display: -webkit-flex;
    display: flex;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}
.table-title{
    -webkit-flex: 1;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.table-url{
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
.table-description{
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
.table-link{
    -webkit-flex: none;
    flex: none;
    margin:0 5px;
}

.table-btn{
    -webkit-flex: none;
    flex: none;
    margin:0 5px;
}


.dialog3-content {
    display: flex;
    box-sizing: border-box;
    border-top: 1px solid #ddd;
    height: 500px;
}


.dialog3-right {
    box-sizing: border-box;
}


.dialog3-right {
    box-sizing: border-box;
    width: 30%;
    padding: 20px;
    background: #F5F5F5;
}

.dialog3-right>ul {
    height: 419px;
    overflow-y: auto;
}

.dialog3-foot {
    display: flex;
}

.dialog3-foot-left {
    width: 70%;
    margin: 10px;
}

.dialog3-foot-right {
    display: flex;
    width: 30%;
    margin: 10px 0;
}

.dialog3-foot-right button {
    width: 50%;
    margin: 0 5px;
}

.dialog4-left {
    box-sizing: border-box;
    width: 70%;
}

.dialog4-foot {
    display: flex;
    justify-content: flex-end;
}

.search-shop-form {
    height: 38px;
    border-bottom: 1px solid #d1dbe5;
    padding: 10px 0;
    overflow: hidden;
}

.import-success-msg {
    height: 35px;
    line-height: 35px;
    margin: 10px auto -35px;
    color: #FF3B1D;
}

.tag-list-title {
    font-weight: bold;
}

.tag-block {
    margin: 10px auto;
}

.shop-list {
    margin-top: 20px;
}
.btn-box {
    text-align: center;
}
.btn-box .el-button{
    margin:3px 0;
}
.f-txtct{
    text-align: center;
}
.table-opreator{
    width: 200px;
    text-align: center;
}
</style>