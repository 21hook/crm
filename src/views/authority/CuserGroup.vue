<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">用户权限 > 用户组</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-input  placeholder="用户组ID" v-model="searchForm.groupId" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-input  placeholder="用户组名称" v-model="searchForm.groupName" type="text"></el-input>
                </div>
                <!-- <div class="el-form-item">
                    <el-select placeholder="所属平台" class="select"
                        v-model="searchForm.groupPlatform">
                        <el-option :label="item" :value="index" v-for="item ,index in allPlatformData" :key="index"></el-option>
                    </el-select>
                </div> -->
                <div class="el-form-item">
                    <el-cascader placeholder="所属平台" :options="options" v-model="searchForm.platform"></el-cascader>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="searchBtn">搜索</el-button>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="resetBtn">重置</el-button>
                </div>
                <div class="el-form-item">
                    <el-button type="primary" @click.prevent="showUserGroupBtn">新增用户组</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <el-table style="width: 100%" v-loading.body="isLoading"
                :data="userGroupList">
                <el-table-column label="用户组id" prop="id"></el-table-column>
                <el-table-column label="用户组名称" prop="name"></el-table-column>
                <el-table-column label="所属平台" prop="author">
                    <template scope="item">
                        <span v-if="(item.row.platform > 4 && item.row.platform < 8) || (item.row.platform > 12 && item.row.platform < 16)">{{allPlatformData[item.row.platform]}}</span>
                        <span v-else>{{platformData[item.row.platform]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="item">{{item.row.gmtCreate}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="item">
                        <div class="btn-box">
                        <el-button size="small" type="primary" @click.prevent="editUserGroupBtn(item.row.id, item.$index)">编辑</el-button>
                        <el-button size="small" type="danger" @click.prevent="delConfirm(item.row.id, item.$index)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-if="userGroupFrom.show" v-model="userGroupFrom.show"  :title="userGroupFrom.title"
            :show-close="true" :close-on-click-modal="false"  size="tiny" >
            <el-form label-width="100px" :model="userGroupFrom" ref="userGroupFrom">
                <el-form-item label="用户组名称" prop="name" :rules="[{ required: true, message: '请输入用户组名称名称', trigger: 'blur' }]" >
                    <el-input v-model="userGroupFrom.name" class="ipt-wt200"></el-input>
                </el-form-item>
                <el-form-item label="用户组类型" prop="defaultGroup" :rules="[{ required: true, message: '请选择用户组类型', trigger: 'change' }]" >
                    <el-select v-model="userGroupFrom.defaultGroup" >
                      <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item,index in userGroupTypeList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属平台" prop="platform" :rules="[{ required: true, message: '请选择用户组所属平台', trigger: 'change' }]">
                    <el-select v-model="userGroupFrom.platform" :disabled="userGroupFrom.platformDisable">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in creatPlatformData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="userGroupFrom.platform == 4 || userGroupFrom.platform == 12" prop="sonPlatform" label="所属子平台" :rules="[{ required: true, message: '请选择用户所属子平台', trigger: 'change' }]">
                    <el-select v-model="userGroupFrom.sonPlatform" :disabled="userGroupFrom.platformDisable">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in sonPlatformData[userGroupFrom.platform]"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="(userGroupFrom.platform >0 && userGroupFrom.platform < 4) || (userGroupFrom.platform >=8 && userGroupFrom.platform < 12) || ((userGroupFrom.platform==4 || userGroupFrom.platform==12) && userGroupFrom.sonPlatform) || (userGroupFrom.platform > 15)">
                    <el-form-item label="角色列表" prop="name">
                        <el-checkbox-group v-model="userGroupFrom.roleIds">
                            <el-checkbox :label="item.roleId" :key="index" v-for="item,index in userGroupFrom.roleList">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer">
                <el-button @click="userGroupFrom.show= false">取 消</el-button>
                <el-button type="primary" @click="submitUserGroupBtn">确 认</el-button>
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
    Loading,
    CheckboxGroup,
    Checkbox,
    Cascader,
} from 'element-ui';

import Util from '@/libs/util';

import CuserGroupAPI from '@/api/cuserGroup.js';
import RoleAPI from '@/api/Role.js';
import PlatformData from '@/assets/platform.js';

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
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Cascader);
export default {
    data() {
        return {
            options: [
                {
                    value: '1',
                    label: '运营操作平台',
                },
                {
                    value: '2',
                    label: '商家操作平台',
                },
                {
                    value: '3',
                    label: '机器人操作平台',
                },
                {
                    value: '4',
                    label: '群店操作平台',
                    children: [
                        {
                            value: '5',
                            label: '蓝马工作平台',
                        },
                        {
                            value: '6',
                            label: '憨货工作平台',
                        },
                        {
                            value: '7',
                            label: '好衣库工作平台',
                        },
                    ],
                },
                {
                    value: '8',
                    label: '脉货供应商平台',
                },
                {
                    value: '9',
                    label: '脉货分销商平台',
                },
                {
                    value: '11',
                    label: '脉货运营平台',
                },
                {
                    value: '12',
                    label: '吸粉运营平台',
                    children: [
                        {
                            value: '13',
                            label: '赞到爆工作平台',
                        },
                        {
                            value: '14',
                            label: '你好奇怪工作平台',
                        },
                        {
                            value: '15',
                            label: '有种来战工作平台',
                        },
                    ],
                },
                {
                    value: '16',
                    label: '好衣库供应商平台'
                }
            ],
            searchForm: {
                groupId: null,
                groupName: '',
                groupPlatform: null,
                platform: [],
            },
            platformData: PlatformData.platformData,
            sonPlatformData: PlatformData.sonPlatformData,
            allPlatformData: Object.assign({}, PlatformData.alonePlatformData, PlatformData.sonPlatformData[4], PlatformData.sonPlatformData[12]),
            creatPlatformData: PlatformData.creatPlatformData,
            userGroupList: [],
            isLoading: true,
            userGroupFrom: {
                show: false,
                title: '',
                name: '',
                defaultGroup: null,
                platform: null,
                roleIds: [],
                roleList: [],
                platformDisable: false,
                sonPlatform: null,
            },
            operatorItem: {
                id: null,
                index: -1,
            },
            // 用户组类型，普通和默认，默认会自动勾选
            userGroupTypeList: [
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
        this.getUserGroup();
    },
    methods: {
        // 点击搜索按钮
        searchBtn() {
            this.getUserGroup();
        },
        // 编辑用户组
        async editUserGroupBtn(id, index) {
            let platform;
            this.operatorItem = {
                id,
                index,
            };
            this.userGroupFrom.platformDisable = true;
            this.userGroupFrom.title = '编辑用户组';
            this.userGroupFrom.name = this.userGroupList[index].name;
            this.userGroupFrom.defaultGroup = this.userGroupList[index].defaultGroup;
            if (this.userGroupFrom.defaultGroup) {
                this.userGroupFrom.defaultGroup = this.userGroupFrom.defaultGroup.toString();
            }
            if (this.userGroupList[index].platform > 4 && this.userGroupList[index].platform < 8) {
                platform = '4';
            } else if (this.userGroupList[index].platform > 12 && this.userGroupList[index].platform < 16) {
                platform = '12';
            } else {
                platform = this.userGroupList[index].platform.toString();
            }
            this.userGroupFrom.platform = platform;
            // this.userGroupFrom.platform = this.userGroupList[index].platform > 4 && this.userGroupList[index].platform < 8 ? '4' : this.userGroupList[index].platform.toString();
            this.userGroupFrom.sonPlatform = (this.userGroupList[index].platform > 4 && this.userGroupList[index].platform < 8) || (this.userGroupList[index].platform > 12 && this.userGroupList[index].platform < 16) ? this.userGroupList[index].platform.toString() : null;
            await this.getRoleByPlatform();
            // 将id变成数组
            await this.getRoleByName((this.userGroupList[index].id).toString().split(','));
            this.userGroupFrom.show = true;
        },
        // 确认删除
        delConfirm(id) {
            const deleteUserGroup = this.deleteUserGroup;
            MessageBox.confirm('您确定要删除该权限组吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteUserGroup(id, () => {
                    this.getUserGroup();
                });
            }).catch(() => {});
        },
        // 删除用户组
        async deleteUserGroup(id) {
            try {
                await CuserGroupAPI.deleteUserGroup({
                    cuserGroupId: id,
                });
                Util.toast('成功删除用户组', 'notice', 1500);
                this.getUserGroup();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 点击添加用户组
        showUserGroupBtn() {
            this.operatorItem = {
                id: null,
                index: -1,
            };
            this.userGroupFrom.platformDisable = false;
            this.userGroupFrom.title = '添加用户组';
            this.userGroupFrom.platform = null;
            this.userGroupFrom.sonPlatform = null;
            this.userGroupFrom.name = '';
            this.userGroupFrom.defaultGroup = null;
            this.userGroupFrom.roleIds = [];
            this.userGroupFrom.roleList = [];
            this.userGroupFrom.show = true;
        },
        resetBtn() {
            this.searchForm.groupId = null;
            this.searchForm.groupName = null;
            this.searchForm.platform = [];
            this.searchForm.groupPlatform = null;
        },
        // 添加权限组的验证
        submitUserGroupBtn() {
            const addUserGroupFn = this.addUserGroupFn;
            this.$refs.userGroupFrom.validate((valid) => {
                if (valid) {
                    addUserGroupFn();
                }
            });
        },
        getAllPlatform() {
            const a = this.platform;
            const b = this.sonPlatform;
            this.allPlatform = Object.assign(a, b);
        },
        // 添加、更新用户组
        async addUserGroupFn() {
            const item = {
                name: this.userGroupFrom.name,
                defaultGroup: this.userGroupFrom.defaultGroup,
                platform: this.userGroupFrom.sonPlatform || this.userGroupFrom.platform,
                roleIds: this.userGroupFrom.roleIds,
            };
            try {
                if (this.operatorItem.id) {
                    item.id = this.operatorItem.id;
                    await CuserGroupAPI.updataUserGroup(item);
                    Util.toast('成功更新用户组', 'notice', 1500);
                    this.userGroupFrom.show = false;
                } else {
                    await CuserGroupAPI.addUserGroup(item);
                    Util.toast('成功添加用户组', 'notice', 1500);
                    this.userGroupFrom.show = false;
                }
                this.getUserGroup();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 获取所有用户组
        async getUserGroup() {
            try {
                const entry = await CuserGroupAPI.getUserGroup({
                    id: this.searchForm.groupId,
                    name: this.searchForm.groupName,
                    platform: this.searchForm.groupPlatform,
                    pageNo: 1,
                    pageSize: 100,
                });
                this.userGroupList = entry;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 根据所属平台，获取改平台下的角色列表
        async getRoleByPlatform() {
            if (!(this.userGroupFrom.sonPlatform || this.userGroupFrom.platform)) {
                return false;
            }
            try {
                const { entry } = await RoleAPI.getRoleByPlatformName({
                    platform: this.userGroupFrom.sonPlatform || this.userGroupFrom.platform,
                });
                this.userGroupFrom.roleList = entry;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 根据用户组查角色列表
        async getRoleByName(cUserGroupIds) {
            try {
                const { entry } = await RoleAPI.queryRoleByCUserGroupId(cUserGroupIds);
                const roleIds = entry.map(item => item.roleId);
                this.userGroupFrom.roleIds = roleIds;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
    },
    watch: {
        'searchForm.platform': function (val) {
            if (val.length === 2) {
                this.searchForm.groupPlatform = val[1];
            } else {
                console.log(val)
                this.searchForm.groupPlatform = val[0];
            }
        },
        'userGroupFrom.platform': function (val) {
            if (!this.operatorItem.id) {
                this.getRoleByPlatform();
                this.userGroupFrom.roleIds = [];
                this.userGroupFrom.sonPlatform = null;
            } else {
                if (val && ((val > 0 && val < 4) || (val > 7  && val < 12) || (val > 15))) {
                    this.getRoleByPlatform();
                    this.userGroupFrom.roleIds = [];
                    this.userGroupFrom.sonPlatform = null;
                }
            }
        },
        'userGroupFrom.sonPlatform': function (val) {
            if (val) {
                this.getRoleByPlatform();
                this.userGroupFrom.roleIds = [];
            }
        },
    },
    mixins: [Util.localTime],
};
</script>
<style scoped>
@import '../../assets/common';
</style>