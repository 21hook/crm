<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">用户权限 > 用户管理</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-input  placeholder="用户ID" v-model="searchForm.userId" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-input  placeholder="用户名称" v-model="searchForm.userName" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-input  placeholder="用户组id" v-model="searchForm.cuserGroupId" type="text"></el-input>
                </div>
                <div class="el-form-item">
                    <el-input  placeholder="手机号" v-model="searchForm.phone" type="text"></el-input>
                </div>
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
                    <el-button type="primary" @click.prevent="addUserBtn">新增用户</el-button>
                </div>
               <!--  <div class="el-form-item">
                    <el-button type="primary" @click.prevent="upLoadUserBtn">批量导入</el-button>
                </div> -->
            </div>
        </form>
        <div class="cr-panel">
            <el-table style="width: 100%" v-loading.body="isLoading"
                :data="userList">
                <el-table-column label="用户id" prop="cUserDetailDTO.id"></el-table-column>
                <el-table-column label="用户名" prop="cUserDetailDTO.realName"></el-table-column>
                <el-table-column label="所属平台" prop="cUserDetailDTO.author">
                    <template scope="item">
                        <span v-if="(item.row.cUserDetailDTO.platform > 4 && item.row.cUserDetailDTO.platform < 8) || (item.row.cUserDetailDTO.platform > 12 && item.row.cUserDetailDTO.platform < 16)">{{ allPlatformData[item.row.cUserDetailDTO.platform] }}</span>
                        <span v-else>{{ platformData[item.row.cUserDetailDTO.platform] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户组" prop="cuserGroupNames">
                    <template scope="item">
                        <div v-for="list in item.row.cuserGroupDTOS">{{list.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" prop="cUserDetailDTO.mobile"></el-table-column>
                <el-table-column label="创建时间">
                    <template scope="item">{{item.row.cUserDetailDTO.gmtCreate}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="item">
                        <div class="btn-box" v-if="item.row.cUserDetailDTO.platform != 16">
                            <el-button size="small" type="primary" @click.prevent="editUserBtn(item.row.cUserDetailDTO.id, item.$index)">编辑</el-button>
                            <template v-if="item.row.cUserDetailDTO.isDelete">
                                <el-button size="small" type="danger" @click.prevent="enableUser(item.row.cUserDetailDTO.id, item.$index)">启用</el-button>
                            </template>
                            <template v-else>
                                <el-button size="small" type="danger" @click.prevent="disableUser(item.row.cUserDetailDTO.id, item.$index)">禁用</el-button>
                            </template>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination
                    v-if ="pagination.totalPagination > 10"
                    layout="total, prev, pager, next"
                    :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="getUser"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="userFrom.show" v-model="userFrom.show"  :title="userFrom.title"
            :show-close="true" :close-on-click-modal="false"  size="tiny" >
            <el-form label-width="100px" :model="userFrom" ref="userFrom">
                <el-form-item label="手机号" prop="mobile" :rules="rules.phones">
                    <el-input v-model="userFrom.mobile" @input="inputMobile" type="text" class="ipt-wt200"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="realName" :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' }]">
                    <el-autocomplete class="ipt-wt200" v-model="userFrom.realName" :fetch-suggestions="querySearch" @select="handleSelect">
                        <template scope="props">
                            <div>{{ props.item.value }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="所属平台" prop="platform" :rules="[{ required: true, message: '请选择用户所属平台', trigger: 'change' }]">
                    <el-select v-model="userFrom.platform"  :disabled="userFrom.platformChange">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in creatPlatformData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="userFrom.platform == 4 || userFrom.platform == 12" prop="sonPlatform" label="所属子平台" :rules="[{ required: true, message: '请选择用户所属子平台', trigger: 'change' }]">
                    <el-select v-model="userFrom.sonPlatform" :disabled="userFrom.platformChange">
                      <el-option :label="item" :value="index" :key="index" v-for="item,index in sonPlatformData[userFrom.platform]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="userFrom.sonPlatform > 4 && userFrom.sonPlatform < 8" label="所属店铺">
                    <el-select :disabled="true" v-model="userFrom.shopList">
                        <el-option label="蓝马店铺" value="5"></el-option>
                        <el-option label="憨货店铺" value="6"></el-option>
                        <el-option label="好衣库店铺" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <template>
                    <el-form-item label="用户组" prop="cuserGroupIds">
                        <el-checkbox-group v-model="userFrom.cuserGroupIds">
                            <el-checkbox :label="item.id" :key="index" v-for="item,index in userFrom.cuserGroupList" :disabled="item.defaultGroup == 2">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </template>
                <template v-if="userFrom.cuserGroupIds && userFrom.cuserGroupIds.length">
                    <el-form-item label="角色列表" prop="roleIds" >
                        <el-checkbox-group v-model="userFrom.roleIds">
                            <el-checkbox :label=" item.roleId" :key="index" v-for="item,index in userFrom.roleList" :disabled="item.defaultRole == 2">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </template>
                <template v-if="operatorItem.index == -1">
                    <el-form-item label="密码" prop="password" v-if="!userIsExist" :rules="[{ required: true, message: '请输入用户密码', trigger: 'blur' }]">
                        <el-input v-model="userFrom.password" class="ipt-wt200"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="userIsExist">
                        <el-input v-model="userFrom.password" class="ipt-wt200"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="更改密码" prop="password" >
                        <el-input v-model="userFrom.password" class="ipt-wt200"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer">
                <el-button @click="userFrom.show= false">取 消</el-button>
                <el-button type="primary" @click="submitUserBtn">确 认</el-button>
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
    Autocomplete,
} from 'element-ui';

import Util from '@/libs/util';

import CuserAPI from '@/api/cuser.js';
import RoleAPI from '@/api/Role.js';
import CuserGroupAPI from '@/api/cuserGroup.js';
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
Vue.use(Autocomplete);
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
                userId: null,
                userName: '',
                cuserGroupId: '',
                cuserGroupIds: [],
                groupPlatform: null,
                phone: '',
                platform: [],
            },
            platformData: PlatformData.platformData,
            sonPlatformData: PlatformData.sonPlatformData,
            allPlatformData: Object.assign({}, PlatformData.alonePlatformData, PlatformData.sonPlatformData[4], PlatformData.sonPlatformData[12]),
            // creatPlatformData: PlatformData.creatPlatformData,
            creatPlatformData: {
                1: '运营操作平台',
                2: '商家操作平台',
                3: '机器人操作平台',
                4: '群店操作平台',
                8: '脉货供应商平台',
                11: '脉货运营平台',
                12: '吸粉运营平台',
            },
            userList: [],
            isLoading: true,
            userIsExist: false,
            userNameList: [],
            userFrom: {
                show: false,
                title: '',
                realName: '',
                mobile: '',
                platform: null,
                cuserGroupIds: [],
                platformChange: false,
                cuserGroupNames: [],
                roleIds: [],
                roleList: [],
                password: '',
                cuserGroupList: [],
                sonPlatform: null,
                shopList: null,
            },
            operatorItem: {
                id: null,
                index: -1,
            },
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            rules: {
                phones: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            return callback(new Error('号码不能为空'));
                        } else if (!/^1[34578]\d{9}$/.test(value)) {
                            return callback(new Error('号码格式错误'));
                        }
                        return callback();
                    },
                    trigger: 'blur',
                },
                ],
            },
        };
    },
    mounted() {
        this.getUser();
    },
    methods: {
        querySearch(queryString, cb) {
            const restaurants = this.userNameList;
            const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据,
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(val) {
            this.userFrom.realName = val.value;
        },
        // 点击搜索按钮
        searchBtn() {
            this.pagination.currentPage = 1;
            this.getUser();
        },
        // 确认删除
        disableUser(id, index) {
            const disableUserFn = this.disableUserFn;
            MessageBox.confirm('您确定要禁用该用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                disableUserFn(id, index);
            }).catch(() => {});
        },
        // 删除用户组
        async disableUserFn(id, index) {
            try {
                await CuserAPI.disableUser({
                    cuserId: id,
                });
                Util.toast('成功禁用该用户', 'notice', 1500);
                this.userList[index].cUserDetailDTO.isDelete = 1;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 确认删除
        enableUser(id, index) {
            const enableUserFn = this.enableUserFn;
            MessageBox.confirm('您确定要启用该用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                enableUserFn(id, index);
            }).catch(() => {});
        },
        // 删除用户组
        async enableUserFn(id, index) {
            try {
                await CuserAPI.enableUser({
                    cuserId: id,
                });
                Util.toast('成功启用该用户', 'notice', 1500);
                this.userList[index].cUserDetailDTO.isDelete = null;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 输入手机号
        inputMobile() {
            if (this.userFrom.mobile.length === 11) {
                this.getUserNameByMobile();
            } else {
                this.userIsExist = false;
                this.userNameList = [];
            }
        },
        // 点击添加用户组
        addUserBtn() {
            this.userIsExist = false;
            this.userNameList = [];
            this.operatorItem = {
                id: null,
                index: -1,
            };
            this.userFrom.title = '添加用户';
            this.userFrom.realName = '';
            this.userFrom.mobile = '';
            this.userFrom.password = '';
            this.userFrom.platform = null;
            this.userFrom.sonPlatform = null;
            this.userFrom.cuserGroupIds = [];
            this.userFrom.platformChange = false;
            this.userFrom.cuserGroupList = [];
            this.userFrom.roleIds = [];
            this.userFrom.roleList = [];
            this.userFrom.show = true;
        },
        // 通过手机号得到用户
        async getUserNameByMobile() {
            try {
                const data = await CuserAPI.getUserNameByMobile({
                    mobile: this.userFrom.mobile,
                });
                if (data.status && data.entry.length) {
                    const obj = {};
                    for (let i = 0; i < data.entry.length; i++) {
                        if (!obj[data.entry[i].realName]) {
                            obj[data.entry[i].realName] = 1;
                            const userNameObj = {
                                value: data.entry[i].realName,
                            };
                            this.userNameList.push(userNameObj);
                        }
                    }
                    this.userIsExist = true;
                } else {
                    this.userIsExist = false;
                }
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        //  编辑按钮点击时，将数据回填
        async editUserBtn(id, index) {
            let platform;
            this.userIsExist = false;
            const item1 = this.userList[index].cUserDetailDTO;
            const item2 = this.userList[index].cuserGroupDTOS;
            this.operatorItem = {
                id: item1.id,
                index,
            };
            this.userFrom.title = '编辑用户';
            this.userFrom.realName = item1.realName;
            this.userFrom.mobile = item1.mobile.toString();
            this.userFrom.password = item1.password;
            if (item1.platform > 4 && item1.platform < 8) {
                platform = '4';
            } else if (item1.platform > 12 && item1.platform < 16) {
                platform = '12';
            } else {
                platform = item1.platform.toString();
            }
            this.userFrom.platform = platform;
            // this.userFrom.platform = item1.platform > 4 && item1.platform < 8 ? '4' : item1.platform.toString();
            this.userFrom.sonPlatform = (item1.platform > 4 && item1.platform < 8) || (item1.platform > 12 && item1.platform < 16) ? item1.platform.toString() : null;
            this.userFrom.platformChange = true;
            setTimeout(() => {
                for (let i = 0; i < item2.length; i += 1) {
                    this.userFrom.cuserGroupIds.push(item2[i].id);
                }
            }, 0);
            await this.queryRoleByCUserId(item1.id);
            this.userFrom.show = true;
        },
        // 添加权限组的验证
        submitUserBtn() {
            const addEditUserFn = this.addEditUserFn;
            this.$refs.userFrom.validate((valid) => {
                if (valid) {
                    addEditUserFn();
                }
            });
        },
        // 添加、更新用户组
        async addEditUserFn() {
            const item = {
                cUserDetailDTO: {
                    realName: this.userFrom.realName,
                    mobile: this.userFrom.mobile,
                    password: this.userFrom.password,
                },
                roleIds: this.userFrom.roleIds,
                userGroupIds: this.userFrom.cuserGroupIds,
            };
            try {
                if (this.operatorItem.id) {
                    item.cUserDetailDTO.id = this.operatorItem.id;
                    await CuserAPI.updateUser(item);
                    Util.toast('成功更新用户', 'notice', 1500);
                    this.userFrom.show = false;
                } else {
                    item.cUserDetailDTO.platform = this.userFrom.sonPlatform || this.userFrom.platform;
                    await CuserAPI.addUser(item);
                    Util.toast('成功添加用户', 'notice', 1500);
                    this.userFrom.show = false;
                }
                this.getUser();
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 获取所有用户
        async getUser() {
            try {
                const { entry, count } = await CuserAPI.getUser({
                    mobile: this.searchForm.phone,
                    id: this.searchForm.userId,
                    cuserGroupIds: this.searchForm.cuserGroupId ? this.searchForm.cuserGroupId.toString().split(',') : [],
                    platform: this.searchForm.groupPlatform,
                    realName: this.searchForm.userName,
                    pageNo: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                });
                this.userList = entry;
                this.pagination.totalPagination = count;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 根据所属平台，查获取所有用户组
        async getUserGroup() {
            const that = this;
            this.userFrom.cuserGroupIds = [];
            try {
                const entry = await CuserGroupAPI.getUserGroup({
                    platform: this.userFrom.sonPlatform || this.userFrom.platform,
                    pageNo: 1,
                    pageSize: 100,
                });
                this.userFrom.cuserGroupList = entry;
                // 新建时，默认用户组默认选中
                entry && entry.forEach((item) => {
                    if (item.defaultGroup == 2) {
                        for(let i = 0 ; i < that.userFrom.cuserGroupIds.length; i++) {
                            if (item.id == that.userFrom.cuserGroupIds[i]) {
                                return;
                            }
                        }
                        that.userFrom.cuserGroupIds.push(item.id);
                    }
                });
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        resetBtn() {
            this.searchForm.cuserGroupId = null;
            this.searchForm.cuserGroupIds = [];
            this.searchForm.groupPlatform = null;
            this.searchForm.platform = [];
            this.searchForm.phone = null;
            this.searchForm.userId = null;
            this.searchForm.userName = null;
            this.searchForm.platform = [];
        },
        // 根据用户组查角色列表
        async getRoleByName(cUserGroupIds) {
            const that = this;
            try {
                const { entry } = await RoleAPI.queryRoleByCUserGroupId(cUserGroupIds);
                this.userFrom.roleList = entry;
                // 新建时，默认的角色默认选中
                entry && entry.forEach((item) => {
                    if (item.defaultRole == 2) {
                        for(let i = 0 ; i < that.userFrom.roleIds.length; i++) {
                            if (item.roleId == that.userFrom.roleIds[i]) {
                                return;
                            }
                        }
                        that.userFrom.roleIds.push(item.roleId);
                    }
                });
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        // 根据用户id查角色列表
        async queryRoleByCUserId(cUserId) {
            try {
                const { entry } = await RoleAPI.queryByCUserId({
                    cUserId,
                });
                this.userFrom.roleIds = entry.map(item => item.roleId);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
        },
        dialogDisapper() {
            this.userFrom.platform = null;
            this.userFrom.cuserGroupId = null;
            this.userFrom.cuserGroupIds = [];
            this.userFrom.cuserGroupList = [];
            this.userFrom.roleIds = [];
            this.userFrom.roleList = [];
        },
    },
    watch: {
        'searchForm.platform': function (val) {
            if (val.length === 2) {
                this.searchForm.groupPlatform = val[1];
            } else {
                this.searchForm.groupPlatform = val[0];
            }
        },
        'userFrom.platform': function (val) {
            console.log('platform' + val);
            if (this.operatorItem.id) {
                if (val && ((val > 0 && val < 4) || (val > 7  && val < 12))) {
                    this.userFrom.sonPlatform = null;
                    this.getUserGroup();
                    // this.userFrom.cuserGroupIds = [];
                    this.userFrom.roleIds = [];
                    this.userFrom.roleList = [];
                    this.userFrom.roleIds = [];
                } else {
                    this.getUserGroup();
                    // this.userFrom.cuserGroupList = [];
                }
            } else {
                this.userFrom.sonPlatform = null;
                this.getUserGroup();
                // this.userFrom.cuserGroupIds = [];
                this.userFrom.roleIds = [];
                this.userFrom.roleList = [];
                this.userFrom.roleIds = [];
                this.userFrom.cuserGroupList = [];
            }
        },
        'userFrom.sonPlatform': function (val) {
            console.log('sonPlatform' + val);
            if (val) {
                this.getUserGroup();
                // this.userFrom.cuserGroupIds = [];
                this.userFrom.roleIds = [];
                this.userFrom.roleList = [];
                this.userFrom.shopList = val;
            }
        },
        'userFrom.cuserGroupIds': function (val) {
            console.log(val);
            if (val && val.length) {
                this.userFrom.roleIds = [];
                this.userFrom.roleList = [];
                this.getRoleByName(val);
            }
        },
        'userFrom.show': function (val) {
            if (val === false) {
                this.dialogDisapper();
            }
        },
        'userFrom.realName': function (val) {
            this.userIsExist = this.userNameList.length ? true : false;
        },
    },
    mixins: [Util.localTime],
};
</script>
<style scoped>
@import '../../assets/common';
.ipt-wt200{
    width: 194px;
}
</style>