<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">
            <span class="shoplist"
                @click="toShopList">店铺管理 </span>> 店铺分组</h2>
        <div class="cr-panel">
            <el-button type="primary"
                @click="createGroup">创建分组</el-button>
        </div>
        <el-dialog title="创建分组" size="tiny"
           :visible.sync="showDialog" :close-on-click-modal="false">
            <el-form class="demo-ruleForm"
                ref="form"
                label-width="90px"
                :model="form" :rules="rules">
                <el-form-item label="分组名称" prop="name">
                    <el-input placeholder="请输入分组名称"
                        v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="groupType"
                    label="分组类型">
                    <el-select placeholder="请选择分组类型"
                        v-model="form.groupType">
                        <el-option label="一级分组" value="1"></el-option>
                        <el-option label="二级分组" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="showParentList"
                    label="选择上级" prop="temp_id">
                    <el-select placeholder="请选择分组的上级"
                        v-model="form.parent_id"
                        filterable>
                        <el-option v-for="item in options" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="display:flex;justify-content: center; align-items: center;"
                    label-width="0px">
                    <el-button type="success"
                        @click="submitForm('form')">确认创建</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div class="cr-panel">
            <el-table style="width: 100%"
                v-loading.fullscreen.lock="isLoading" element-loading-text="拼命加载中"
                :data="tableData" :default-expand-all="true"  class="z-expand-table">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-table style="width: 100%"
                            :data="props.row.list" :show-header="false">
                            <el-table-column prop="name" label="分组名称"></el-table-column>
                            <el-table-column prop="count" label="店铺数量"></el-table-column>
                            <el-table-column prop="groupOpe" label="操作">
                                <template scope="scope">
                                    <el-button type="success" size="small"
                                        @click.native.prevent="getShops(scope.$index, scope.row)"
                                        :disabled="!scope.row.canISeeShops">查看相关店铺</el-button>
                                    <el-button type="primary" size="small"
                                        @click.native.prevent="editGroup(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="danger" size="small"
                                    @click.native.prevent="deleteGroup(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="分组名称">
                </el-table-column>
                <el-table-column prop="count" label="店铺数量">
                </el-table-column>
                <el-table-column prop="groupOpe" label="操作">
                    <template scope="scope">
                        <el-button type="success" size="small"
                            :disabled="!scope.row.canISeeShops"
                            @click.native.prevent="getShops(scope.$index, scope.row)">查看相关店铺</el-button>
                        <el-button type="primary" size="small"
                            @click.native.prevent="editGroup(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small"
                            @click.native.prevent="deleteGroup(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    Loading,
    Button,
    MessageBox,
    Dialog,
    Select,
    Option,
} from 'element-ui';
import Util from '@/libs/util';
import ShopAPI from '@/api/Shop';

Vue.use(Button);
Vue.use(Loading);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);


export default {
    name: 'ShopGroup',
    data() {
        return {
            isLoading: true,
            tableData: [],
            showDialog: false,
            form: {
                name: '',
                groupType: '',
                parent_id: 0,
                temp_id: '',
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入分组名称',
                        trigger: 'blur',
                    },
                ],
                groupType: [
                    {
                        required: true,
                        message: '请选择分组类型',
                        trigger: 'change',
                    },
                ],
            },
            options: [],
            showParentList: false,
            groupIds: [],
        };
    },
    watch: {
        'form.parent_id': function () {
            this.form.temp_id = this.form.parent_id.toString();
        },
        'form.groupType': function () {
            if (this.form.groupType === '2') {
                this.showParentList = true;
                Object.assign(this.rules, {
                    temp_id: [
                        {
                            required: true,
                            message: '请选择一个上级分组',
                            trigger: 'change',
                        },
                    ],
                });
            } else {
                this.showParentList = false;
                this.form.parent_id = 0;
            }
        },
    },
    async mounted() {
        this.getStoreGroup();
    },
    methods: {
        // 获取店铺分组信息
        async getStoreGroup() {
            this.tableData = [];
            try {
                const entry = await ShopAPI.getShopGroup();
                // 表格数据
                entry.forEach((el) => {
                    const obj = {};
                    obj.name = el.name;
                    obj.list = el.list;
                    obj.count = el.count;
                    obj.id = el.id;
                    obj.canISeeShops = true;

                    const tempArr = [];
                    obj.list.forEach((ele) => {
                        obj.count += ele.count;

                        const o = ele;
                        o.canISeeShops = true;

                        if (ele.count === 0) {
                            o.canISeeShops = false;
                        }

                        tempArr.push(o);
                    });
                    obj.list = tempArr;

                    if (obj.count === 0 || obj.list.length) {
                        obj.canISeeShops = false;
                    }

                    this.tableData.push(obj);
                });

                // 一级分组数据
                entry.forEach((el) => {
                    const obj = {};
                    obj.label = el.name;
                    obj.value = el.id;

                    this.options.push(obj);
                });
            } catch (err) {
                Util.toast(err, 'failed', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        clearAddGroup() {
            this.form = {
                name: '',
                groupType: '',
                parent_id: 0,
                temp_id: '',
            };
        },
        toShopList() {
            window.location.href = 'list.html';
        },
        createGroup() {
            this.showDialog = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    try {
                        const message = await ShopAPI.createShopGroup({
                            name: this.form.name,
                            parentId: this.form.parent_id,
                        });
                        Util.toast(message, 'succeed', 1500);
                        this.getStoreGroup();
                    } catch (err) {
                        Util.toast(err, 'failed', 1500);
                    } finally {
                        this.$refs[formName].resetFields();
                        this.showDialog = false;
                    }
                }
            });
        },
        // 编辑分组
        editGroup(a, b) {
            MessageBox.prompt(' ', '编辑分组', {
                inputValue: b.name,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                try {
                    const message = await ShopAPI.updateShopGroup({
                        id: b.id,
                        name: value,
                        parentId: b.parentId,
                    });
                    Util.toast(message, 'succeed', 1500);
                    this.getStoreGroup();
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            }).catch(() => {
                Util.toast('已取消输入', 'notice', 1500);
            });
        },
        // 删除分组
        async deleteGroup(a, b) {
            const id = b.id;

            if (b.list && b.list.length > 0) {
                MessageBox.alert('当前分组下存在多个子分组, 无法进行删除操作！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
                return false;
            }

            try {
                const message = await ShopAPI.deleteShopGroup({ id });
                // 删除成功
                Util.toast(message, 'succeed', 1500);
                this.getStoreGroup();
            } catch (err) {
                Util.toast(err, 'failed', 1500);
            }
            return true;
        },
        getShops(a, b) {
            const targetId = b.id;
            this.groupIds = [];
            this.tableData.forEach((el) => {
                if (targetId === el.id) {
                    this.groupIds.push(el.id);
                } else {
                    el.list.forEach((aaa) => {
                        if (targetId === aaa.id) {
                            this.groupIds.push(el.id);
                            this.groupIds.push(aaa.id);
                        }
                    });
                }
                return true;
            });

            window.location.href = `list.html?groupIds=${JSON.stringify(this.groupIds)}`;
        },
    },
};
</script>

<style>
@import '../../assets/common';
.el-table__expanded-cell {
    padding: 0 0 0 48px !important;
}

.el-table__expanded-cell>div {
    border-left: none !important;
}

.el-message {
    z-index: 99998 !important;
}
.shoplist {
    cursor: pointer;
    color: #666;
}

.shoplist:hover {
    color: #333;
}
</style>
