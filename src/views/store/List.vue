<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">店铺管理</h2>
        <div class="cr-panel">
            <el-form class="demo-form-inline" style="position:relative"
                ref="formInline"
                :inline="true" :model="formInline">
                <el-form-item label="店铺名称">
                    <el-input placeholder="店铺名称"
                        v-model="formInline.shopName" ></el-input>
                </el-form-item>
                <el-form-item label="城市">
                    <el-input placeholder="城市"
                        v-model="formInline.city"></el-input>
                </el-form-item>
                <el-form-item label="店主手机号">
                    <el-input placeholder="店主手机号"
                        v-model="formInline.mobile"
                        :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select placeholder="选择一级分组"
                        v-model="selectedGroup1"
                        width="100"
                        @change="getSecondGroup">
                        <el-option v-for="item in firstGroups" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select placeholder="选择二级分组"
                        v-model="selectedGroup2">
                        <el-option v-for="item in secondGroups" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-button type="primary"
                    @click="searchBtn">查询</el-button>
                <el-button @click="resetForm('formInline')">重置</el-button>

                <!--  导入店铺，可能以后要用  -->
                <!-- TODO  对接接口
                <el-upload style="position:absolute;right:20px;top:0;z-index:9;" :action="uploadFileUrl" :name="name" :with-credentials="true" accept=".xls,.xlsx" :on-change="handleChange">
                    <el-button size="small" type="primary">导入店铺</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传 excel 文件</div>
                </el-upload>
                -->

                </el-form-item>
            </el-form>
        </div>
        <div class="cr-panel"
            v-loading="isLoading">
            <el-table style="width: 100%"
                :data="tableData">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="shopName" label="店铺名称"></el-table-column>
                <el-table-column prop="city" label="所在城市"></el-table-column>
                <el-table-column prop="address" label="详细地址"></el-table-column>
                <el-table-column prop="ownerName" label="店主姓名"></el-table-column>
                <el-table-column prop="mobile" width="150" label="店主手机号"
                    :formatter="formatter"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination style="text-align: center;padding-top: 40px;"
                layout="prev, pager, next" :current-page.sync="pageNow"
                :page-size="pageSize" :total="totalNum"
                @current-change="linktopage"   v-if="totalNum > 10"></el-pagination>
            </div>
        </div>
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
    Loading,
    Select,
    Option,
    Message,
    Button,
} from 'element-ui';

import Util from '@/libs/util';
import ShopAPI from '@/api/Shop';

Vue.use(Select);
Vue.use(Option);
Vue.use(Loading);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Button);

Vue.prototype.$message = Message;

export default {
    data() {
        return {
            isLoading: true,
            list: [],
            formInline: {
                shopname: '',
                city: '',
                mobile: '',
            },
            selectedGroup: [],
            selectedGroup1: '',
            selectedGroup2: '',
            shopGroups: [
                {
                    label: '全部',
                    value: '',
                },
            ], // 存储全部分组信息
            firstGroups: [], // 存储一级分组信息
            secondGroups: [], // 动态存放二级分组信息
            pageSize: 20,
            pageNow: 1,
            totalNum: 0,
            tableData: [],
            // uploadFileUrl: '',
            // name: '',
            groupIds: [],
            n: 1,
            // 判断是否点击了重置按钮
            hasReset: false,
        };
    },
    mounted() {
        this.getShopGroup();
    },
    methods: {
        getSecondGroup(id) {
            this.secondGroups = [];
            this.pageNow = 1;
            if (Util.getUrlParam('groupIds') && this.n === 1) {
                this.n += 1;
            } else {
                this.selectedGroup2 = '';
            }

            this.firstGroups.find((el) => {
                if (el.value === id) {
                    this.secondGroups = el.children;
                    return true;
                }
                return false;
            });

            return true;
        },
        formatter(row) {
            return row.mobile.replace(/(\d{3})(\d{4})/, '$1 $2 ');
        },
        async getShopGroup() {
            // 获取店铺分组信息
            try {
                const entry = await ShopAPI.getShopGroup();
                // 解析URL，回显店铺分组
                let firstGroup = '';
                let secondGroup = '';
                if (Util.getUrlParam('groupIds')) {
                    const groupIds = JSON.parse(Util.getUrlParam('groupIds'));
                    if (groupIds.length === 2) {
                        firstGroup = groupIds[0];
                        secondGroup = groupIds[1];
                    } else {
                        firstGroup = groupIds[0];
                    }
                }

                // 店铺分组信息
                entry.forEach((el) => {
                    const obj = {
                        value: el.id,
                        label: el.name,
                    };

                    const children = [];

                    if (firstGroup && firstGroup === el.id) {
                        this.selectedGroup1 = el.id;
                        this.selectedGroup2 = null;
                    }

                    el.list.forEach((ell) => {
                        const obj = {
                            value: ell.id,
                            label: ell.name,
                        };

                        if (secondGroup && secondGroup === ell.id) {
                            this.selectedGroup1 = el.id;
                            this.selectedGroup2 = ell.id;
                        }
                        children.push(obj);
                    });
                    obj.children = children;
                    this.shopGroups.push(obj);
                });

                this.firstGroups = this.shopGroups;
                this.getShopList();
            } catch (err) {
                Message.error({
                    message: err,
                    duration: 2000,
                });
            }
        },
        searchBtn() {
            this.pageNow = 1;
            this.getShopList();
        },
        async getShopList() {
            // 若手机号不为空，则手机号必须为 11 位
            if (this.formInline.mobile) {
                if (!this.formInline.mobile.match(/^[1-9]\d{10}$/g)) {
                    Util.toast('手机号必须为 11 位数字 ～', 'failed', 2000);
                    return false;
                }
            }
            // 获取 groupIds
            this.selectedGroup = [];
            if (this.selectedGroup1) {
                if (this.selectedGroup2) {
                    this.selectedGroup.push(this.selectedGroup2);
                } else {
                    this.selectedGroup.push(this.selectedGroup1);

                    this.firstGroups.find((el) => {
                        if (el.value === this.selectedGroup1) {
                            if (el.children.length) {
                                el.children.forEach((item) => {
                                    this.selectedGroup.push(item.value);
                                });
                            }
                        }
                        return true;
                    });
                }
            } else if (Util.getUrlParam('groupIds')) {
                this.selectedGroup = JSON.parse(Util.getUrlParam('groupIds'));
                if (this.hasReset) {
                    this.selectedGroup = [];
                }
            }

            this.isLoading = true;
            const groupIds = [];
            if (this.selectedGroup2) {
                groupIds.push(this.selectedGroup2);
            } else {
                if (this.selectedGroup1) {
                    groupIds.push(this.selectedGroup1);
                    this.secondGroups.forEach(item => groupIds.push(item.value));
                }
            }
            try {
                const { count, entry } = await ShopAPI.queryShopByKeys({
                    shopName: this.formInline.shopName,
                    city: this.formInline.city,
                    mobile: this.formInline.mobile,
                    pageSize: this.pageSize,
                    pageNow: this.pageNow,
                    groupIds,
                });
                this.totalNum = count;
                this.tableData = entry;
            } catch (err) {
                this.totalNum = 0;
                this.tableData = [];
            } finally {
                this.isLoading = false;
            }
            return true;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();

            this.selectedGroup1 = '';
            this.selectedGroup2 = '';

            Object.keys(this.formInline).forEach((el) => {
                this.formInline[el] = '';
            });

            this.hasReset = true;
        },
        linktopage(currentPage) {
            this.pageNow = currentPage;
            this.isLoading = true;
            this.getShopList();
        },
        handleEdit(row) {
            window.location.href = `detail.html?id=${row.id}`;
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
</style>
