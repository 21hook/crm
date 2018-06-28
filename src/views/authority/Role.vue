<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">用户权限 > 角色管理</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="addRoleClearForm">添加角色</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <div class="m-two-column z-table-box">
                <el-table style="width: 100%" class="left-column" v-loading.body="isLoading"
                    :data="roleTable">
                    <el-table-column label="角色id" prop="roleId"></el-table-column>
                    <el-table-column label="角色名称" prop="name"></el-table-column>
                    <el-table-column label="所属平台">
                        <template scope="item">
                            <span v-if="(item.row.platform > 4 && item.row.platform < 8) || (item.row.platform > 12 && item.row.platform < 16)">{{allPlatformData[item.row.platform]}}</span>
                            <span v-else>{{platformData[item.row.platform]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align= "center" width="220">
                        <template scope="item">
                            <el-button size="small" @click.prevent="editRoleForm(item.row.roleId, item.$index)">编辑</el-button>
                            <el-button size="small" type="danger" @click.prevent="delConfirm(item.row.roleId)">删除</el-button>
                             <el-button size="small" @click.prevent="showAuthoritysFn(item.$index)">查看权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="right-column">
                    <p class="right-title">角色 <span class="name" >{{ showAuthoritys.name }}</span> 关联的权限</p>
                    <div>
                        <el-tree class="z-right-tree" :data="showAuthoritys.authoritys" :props="rightTree.props" :default-expand-all="true"></el-tree>
                    </div>
                </div>
            </div>
            <div class="m-pagination-box">
                <el-pagination
                    v-if ="pagination.totalPagination > 10"
                    layout="total, prev, pager, next"
                    :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="getAllAuthorityRole"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="addRoleDialog.show" v-model="addRoleDialog.show"  :title="addRoleDialog.title"
            :show-close="true" :close-on-click-modal="false" >
            <el-form label-width="100px" ref="addEidtForm" :rules="addRoleDialogRule" :model="addRoleDialog">
                <el-form-item label="角色名称" prop="name" >
                    <el-input v-model="addRoleDialog.name" class="ipt-wt200"></el-input>
                </el-form-item>
                <el-form-item label="角色类型" prop="defaultRole" :rules="[{ required: true, message: '请选择角色类型', trigger: 'change' }]">
                    <el-select v-model="addRoleDialog.defaultRole">
                      <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item,index in userRoleTypeList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属平台" prop="platform" :rules="[{ required: true, message: '请选择用户所属平台', trigger: 'change' }]">
                    <el-select v-model="addRoleDialog.platform" :disabled="addRoleDialog.platformChange">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in creatPlatformData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addRoleDialog.platform == 4 || addRoleDialog.platform == 12" prop="sonPlatform" label="所属子平台" :rules="[{ required: true, message: '请选择用户所属子平台', trigger: 'change' }]">
                    <el-select v-model="addRoleDialog.sonPlatform" :disabled="addRoleDialog.platformChange">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in sonPlatformData[addRoleDialog.platform]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联权限">
                    <el-button type="primary" @click="showAuthorityBox">+添加权限</el-button>
                    <div class="role-list-box">
                        <ul>
                            <li style="overflow-x:auto"
                                v-for="(item,index) in addRoleDialog.authorityList" :key="index">
                                <el-tag type="primary"
                                    :closable="true"
                                    @close="removeOneAuthority(index)">{{item.authorityId}} | {{ item.name }} | {{ item.description }}</el-tag>
                            </li>
                        </ul>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addRoleDialog.show= false">取 消</el-button>
                <el-button type="primary" @click="validateAddEdit">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="AuthorityListDialog.show" v-model="AuthorityListDialog.show"  title="关联权限"
            :show-close="true" :close-on-click-modal="false" >
            <el-form label-width="100px" >
                <el-form-item label="搜索权限">
                    <el-input v-model="AuthorityListDialog.name" placeholder="输入权限组名称" class="ipt-wt200"></el-input>
                    <el-button @click.prevent="getAuthorityByName">搜 索</el-button>
                    <el-button  type="primary" @click.prevent="chooseAuthority">选 定</el-button>
                </el-form-item>
                <div class="m-two-column z-tree-box">
                    <div class="left-column">
                        <el-tree ref="authorityGroupTree" :data="AuthorityListDialog.authorityGroups" :props="AuthorityListDialog.props" show-checkbox class="e-tree-noborder">
                        </el-tree>

                    </div>
                    <div class="right-column">
                         <div class="right-title">已选择 {{ AuthorityListDialog.chooseAuthoritys.length }} 个权限</div>
                         <div  class="z-dialog-tree">
                             <ul>
                                <li style="overflow-x:auto"
                                    v-for="(item,index) in AuthorityListDialog.chooseAuthoritys" :key="index">
                                    <el-tag type="primary"
                                        :closable="true"
                                        @close="removeOneSearchAuthority(index)">{{item.authorityId}} | {{ item.name }} | {{ item.description }}</el-tag>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click="AuthorityListDialog.show= false">取 消</el-button>
                <el-button type="primary" @click="chooseAuthoritySubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue';
import {
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
    Tree,
    Select,
    Option,
} from 'element-ui';

import Util from '@/libs/util';

import RoleAPI from '@/api/Role.js';
import AuthorityAPI from '@/api/Authority.js';
import PlatformData from '@/assets/platform.js';

Vue.use(Loading);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
export default {
    data() {
        return {
            allAuthorityList: [],
            roleTable: [],
            rightTree: {
                props: {
                    children: 'secondAuthority',
                    label: 'name',
                },
            },
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            isLoading: true,
            addRoleDialog: {
                show: false,
                title: '',
                name: '',
                defaultRole: null,
                platform: null,
                authorityList: [],
                operatorId: null,
                operatorIdx: -1,
                platformChange: false,
                sonPlatform: null,
            },
            platformData: PlatformData.platformData,
            sonPlatformData: PlatformData.sonPlatformData,
            allPlatformData: Object.assign({}, PlatformData.alonePlatformData, PlatformData.sonPlatformData[4], PlatformData.sonPlatformData[12]),
            creatPlatformData: PlatformData.creatPlatformData,
            AuthorityListDialog: {
                show: false,
                name: '',
                authorityGroups: [],
                chooseAuthoritys: [],
                props: {
                    children: 'secondAuthority',
                    label: 'label',
                },
            },
            // 当前展示的权限，默认是第一条
            showAuthoritys: [],
            addRoleDialogRule: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('角色名称必填'));
                            } else if (value.length > 64) {
                                callback(new Error('角色名称不能超过64个字符'));
                            }
                            callback();
                        },
                    },
                ],
                defaultRole: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '角色类型必选',
                    },
                ],
                platform: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '所属平台必选',
                    },
                ],
                sonPlatform: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '所属子平台必选',
                    },
                ],
            },
            // 角色类型，普通和默认，默认会自动勾选
            userRoleTypeList: [
                {
                    value: '1',
                    label: '普通',
                },
                {
                    value: '2',
                    label: '默认',
                },
            ],
        };
    },
    mounted() {
        this.getAllAuthorityRole();
    },
    methods: {
        // 获取所有api
        async getAllAuthorityRole() {
            try {
                const { count, entry } = await RoleAPI.getAllAuthorityRole({
                    pageNow: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                });
                this.pagination.totalPagination = count;
                this.roleTable = entry;
                this.showAuthoritys = this.addDescription(entry[0] || []);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 添加api按钮，把数据清空
        addRoleClearForm() {
            this.addRoleDialog.operatorIdx = -1;
            this.addRoleDialog.operatorId = null;
            this.addRoleDialog.show = true;
            this.addRoleDialog.name = '';
            this.addRoleDialog.defaultRole = null;
            this.addRoleDialog.platform = null;
            this.addRoleDialog.platformChange = false;
            this.addRoleDialog.authorityList = [];
            this.addRoleDialog.sonPlatform = null;
        },
        // 点击编辑按钮，将数据填了form 表单
        editRoleForm(id, index) {
            let platform;
            this.addRoleDialog.operatorIdx = index;
            this.addRoleDialog.operatorId = id;
            this.addRoleDialog.show = true;
            this.addRoleDialog.name = this.roleTable[index].name;
            this.addRoleDialog.defaultRole = this.roleTable[index].defaultRole;
            if (this.addRoleDialog.defaultRole) {
                this.addRoleDialog.defaultRole = this.addRoleDialog.defaultRole.toString();
            }
            if (this.roleTable[index].platform > 4 && this.roleTable[index].platform < 8) {
                platform = '4';
            } else if (this.roleTable[index].platform > 12 && this.roleTable[index].platform < 16) {
                platform = '12';
            } else {
                platform = this.roleTable[index].platform.toString();
            }
            this.addRoleDialog.platform = platform;
            // this.addRoleDialog.platform = this.roleTable[index].platform > 4 && this.roleTable[index].platform < 8 ? '4' : this.roleTable[index].platform.toString();
            this.addRoleDialog.platformChange = true;
            this.addRoleDialog.sonPlatform = (this.roleTable[index].platform > 4 && this.roleTable[index].platform < 8) || (this.roleTable[index].platform > 12 && this.roleTable[index].platform < 16) ? this.roleTable[index].platform.toString() : null;
            let authorityList = [];
            this.roleTable[index].authoritys.forEach((item) => {
                authorityList = authorityList.concat(item.secondAuthority);
            });
            this.addRoleDialog.authorityList = authorityList;
        },
        // 点击确认按钮，提交新增或编辑的按钮
        async validateAddEdit() {
            this.$refs.addEidtForm.validate((valid) => {
                if (valid) {
                    this.addEditSubmit();
                }
            });
        },
        // 从角色中移除某个权限
        removeOneAuthority(index) {
            this.addRoleDialog.authorityList.splice(index, 1);
        },
        // 编辑新增角色
        async addEditSubmit() {
            const authorityIds = this.addRoleDialog.authorityList.map(item => item.authorityId);
            const submitObj = {};
            submitObj.name = this.addRoleDialog.name;
            submitObj.defaultRole = this.addRoleDialog.defaultRole;
            submitObj.authorityIds = authorityIds;
            submitObj.platform = this.addRoleDialog.sonPlatform || this.addRoleDialog.platform;
            try {
                if (this.addRoleDialog.operatorId) {
                    submitObj.roleId = this.addRoleDialog.operatorId;
                    await RoleAPI.updateAuthorityRoleById(submitObj);
                    Util.toast('成功编辑角色', 'succeed', 1500);
                } else {
                    await RoleAPI.addAuthorityRole(submitObj);
                    Util.toast('成功添加角色', 'succeed', 1500);
                }
                this.addRoleDialog.show = false;
                this.getAllAuthorityRole();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 通过权限组名字查权限
        async getAuthorityByName() {
            try {
                const { entry } = await AuthorityAPI.getAuthorityByName({
                    name: this.AuthorityListDialog.name,
                });
                const objData = [];
                entry.forEach((item) => {
                    if (item.secondAuthority.length > 0) {
                        objData.push(item);
                    }
                });
                this.allAuthorityList = objData;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 展示用户组
        showAuthorityBox() {
            this.AuthorityListDialog.show = true;
            this.AuthorityListDialog.name = '';
            this.AuthorityListDialog.chooseAuthoritys = [];
            this.getAuthorityByName();
        },
        // 选定权限
        chooseAuthority() {
            this.AuthorityListDialog.chooseAuthoritys = this.$refs.authorityGroupTree.getCheckedNodes(true);
        },
        // 确认删除
        delConfirm(id) {
            const delRole = this.delRole;
            MessageBox.confirm('您确定要删除该角色吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                delRole(id);
            }).catch(() => {});
        },
        // 根据api id 删除api
        async delRole(id) {
            try {
                await RoleAPI.deleteAuthorityRoleById({
                    roleId: id,
                });
                this.getAllAuthorityRole();
                Util.toast('成功删除', 'succeed', 1500);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 选择角色
        chooseAuthoritySubmit() {
            Util.mergeObjToArray(this.addRoleDialog.authorityList, this.AuthorityListDialog.chooseAuthoritys, 'authorityId');
            this.AuthorityListDialog.show = false;
        },
        // 展示权限
        showAuthoritysFn(idx) {
            this.showAuthoritys = this.addDescription(this.roleTable[idx]);
        },
        // 添加描述
        addDescription(obj) {
            const temp = JSON.parse(JSON.stringify(obj));
            temp.authoritys && temp.authoritys.forEach((item) => {
                if (item.description) {
                    item.name = item.name + '|' + item.description;
                }
                item.secondAuthority && item.secondAuthority.forEach((item1) => {
                    if (item1.description) {
                        item1.name = item1.name + '|' + item1.description;
                    }
                });
            });
            console.log(temp);
            return temp;
        },
        // 删除暂选的权限
        removeOneSearchAuthority(index) {
            this.AuthorityListDialog.chooseAuthoritys.splice(index, 1);
        },
    },
    computed: {
        getSonPlatfrom() {
            return this.addRoleDialog.platform;
        },
    },
    watch: {
        getSonPlatfrom() {
            if (!this.addRoleDialog.operatorId) {
                this.addRoleDialog.sonPlatform = '';
            }
        },
        allAuthorityList(val) {
            this.AuthorityListDialog.authorityGroups = val;
            for (let i = 0; i < val.length; i += 1) {
                if (this.AuthorityListDialog.authorityGroups[i].description) {
                    this.AuthorityListDialog.authorityGroups[i].label = this.AuthorityListDialog.authorityGroups[i].name + '|' + this.AuthorityListDialog.authorityGroups[i].description;
                } else {
                    this.AuthorityListDialog.authorityGroups[i].label = this.AuthorityListDialog.authorityGroups[i].name;
                }
                for (let j = 0; j < val[i].secondAuthority.length; j += 1) {
                    if (this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].description) {
                        this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].label = this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].authorityId + ' | '  + this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].name + ' | '  + this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].description;
                    } else {
                        this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].label = this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].authorityId + ' | '  + this.AuthorityListDialog.authorityGroups[i].secondAuthority[j].name;
                    }
                }
            }
        },
    },
};
</script>
<style scoped>
@import '../../assets/common';
.ipt-wt200{
    width: 194px;
}
.z-table-box{
    max-height: 470px;
    .name{
        color: #20a0ff;
    }
}
.ipt-inline{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
}
.z-tree-box{
    height: 400px;
}
.e-tree-noborder{
    border:none;
}
.z-right-tree{
    border:none;
    max-height: 415px;
    overflow: scroll;
}
.z-dialog-tree{
    border:none;
    max-height: 355px;
    overflow: scroll;
}
</style>