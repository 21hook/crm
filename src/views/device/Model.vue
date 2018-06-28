<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">设备型号管理</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <el-select placeholder="品牌"
                    v-model="devicebrands"
                    @change="handlechange">
                    <el-option v-for="(item,index) in devicebrand" :key="devicebrand[index]"
                        :label="devicebrand[index]" :value="devicebrand[index]">
                    </el-option>
                </el-select>
                <el-select placeholder="型号"
                    v-model="devicetypes">
                    <el-option v-for="(item,index) in devicetype" :key="devicetype[index]"
                        :label="devicetype[index]" :value="devicetype[index]">
                    </el-option>
                </el-select>
                <el-select placeholder="操作系统"
                    v-model="devicesystems">
                    <el-option v-for="(item,index) in devicesystem" :key="devicesystem[index]"
                        :label="devicesystem[index]" :value="devicesystem[index]">
                    </el-option>
                </el-select>
                <el-select placeholder="屏幕大小"
                    v-model="devicesizes">
                    <el-option v-for="(item,index) in devicesize" :key="devicesize[index]"
                        :label="devicesize[index]" :value="devicesize[index]">
                    </el-option>
                </el-select>
                <el-button type="primary"
                    @click.prevent="searchBtn">搜索</el-button>
                <el-button type="primary"
                    @click.prevent="addtype">新增设备型号</el-button>
            </div>
        </form>
        <div class="cr-panel">
            <el-table class="cr-table" style="width:100%" v-loading.body="isLoading"
                :data="typeList">
                <el-table-column width="70px" prop="id" label="主键" align="center" header-align="center"></el-table-column>
                <el-table-column width="85px" prop="deviceTypeId" label="类型ID" align="center" header-align="center"></el-table-column>
                <el-table-column prop="model" label="型号" align="center" header-align="center"></el-table-column>
                <el-table-column prop="name" label="设备名称" align="center" header-align="center"></el-table-column>
                <el-table-column prop="brand" label="品牌" align="center" header-align="center"></el-table-column>
                <el-table-column prop="cpu" label="cpu配置" align="center" header-align="center"></el-table-column>
                <el-table-column prop="screenSize" label="屏幕大小" align="center" header-align="center"></el-table-column>
                <el-table-column prop="operationSystem" label="操作系统" align="center" header-align="center"></el-table-column>
                <el-table-column  width="70px" prop="ram" label="内存" align="center" header-align="center"></el-table-column>
                <el-table-column prop="deviceTypeName" label="设备类型" align="center" header-align="center"></el-table-column>
                <el-table-column label="操作" width="160px" align="center" header-align="center">
                    <template scope="item">
                        <p class="f-mg5"><el-button size="small"
                            @click.prevent="showeeditdevice(item.row.id,item.$index)">编辑</el-button></p>
                        <p class="f-mg5"><el-button type="danger" size="small"
                            @click.prevent="showdelpopup(item.row.id,item.$index)">删除</el-button></p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination v-if="totalCount > 10"
                    layout="prev, pager, next"
                    :total="totalCount" :current-page.sync="pageNo"
                    @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>

        <el-dialog v-if="editdevice" v-model="editdevice"
            custom-class="ele-modal" top="10%"
            :title="title" :show-close="false" :close-on-click-modal="false">
            <el-form label-width="150px" ref="modelDialog" :model="modelTypeDialog"  :rules= "modalRules">
                <el-form-item label="设备型号：" prop="model">
                    <el-input v-model="modelTypeDialog.model"></el-input>
                </el-form-item>
                <el-form-item label="设备名称：" prop="name">
                    <el-input v-model="modelTypeDialog.name"></el-input>
                </el-form-item>
                <el-form-item label="设备类型：" prop="type">
                    <el-select placeholder="设备类型"
                        v-model="modelTypeDialog.adddevicemodels">
                        <el-option v-for="item in adddevicemodel" :key="item.id"
                            :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌：" prop="brand">
                    <el-input v-model="modelTypeDialog.brand"></el-input>
                </el-form-item>
                <el-form-item label="cpu配置：">
                    <el-input v-model="modelTypeDialog.cpu"></el-input>
                </el-form-item>
                <el-form-item label="屏幕大小：">
                    <el-input v-model="modelTypeDialog.screenSize"></el-input>
                </el-form-item>
                <el-form-item label="操作系统：">
                    <el-input v-model="modelTypeDialog.operationSystem"></el-input>
                </el-form-item>
                <el-form-item label="操作系统版本：">
                    <el-input v-model="modelTypeDialog.operationSystemVersion"></el-input>
                </el-form-item>
                <el-form-item label="内存：">
                    <el-input v-model="modelTypeDialog.ram"></el-input>
                </el-form-item>
            </el-form>
            <span class="dialog-footer"
                slot="footer" v-if="isedit">
                <el-button type="info"
                    @click="onSubmit">保存</el-button>
                <el-button @click="deleditdevice">取消</el-button>
            </span>
            <span class="dialog-footer"
                slot="footer" v-else>
                <el-button type="info"
                    @click="onSubmit">保存编辑</el-button>
                <el-button @click="deleditdevice">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Pagination,
    Dialog,
    Button,
    Switch,
    Select,
    Checkbox,
    Option,
    CheckboxGroup,
    Slider,
    Table,
    TableColumn,
    Loading,
    Form,
    FormItem,
    Input,
    MessageBox,
} from 'element-ui';

import Util from '@/libs/util';
import DeviceAPI from '@/api/Device';

Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Option);
Vue.use(CheckboxGroup);
Vue.use(Slider);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
export default {
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            isLoading: true,
            typeList: [],
            totalCount: 0,
            devicebrands: null,
            devicebrand: ['全部'],
            devicetypes: null,
            devicetype: ['全部'],
            devicesystems: null,
            devicesystem: ['全部'],
            devicesizes: null,
            devicesize: ['全部'],
            adddevicemodel: [],
            adddevicegroups: null,
            adddevicegroup: [],
            deldialog: false,
            editdevice: false,
            isedit: true,
            id: '',
            title: '新建设备类型',
            devicedetail: '',
            pageNo: 1,
            deviceTypeId: null,
            devicegroup: null,
            processorSpeed: null,
            modelTypeDialog: {
                model: null,
                name: null,
                adddevicemodels: null,
                brand: null,
                cpu: null,
                screenSize: null,
                operationSystem: null,
                ram: null,
                operationSystemVersion: null,
            },
            modalRules: {
                model: [
                    { required: true, message: '请填写设备型号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请填写设备名字', trigger: 'blur' },
                ],
                type: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (!this.modelTypeDialog.adddevicemodels) {
                                return callback(new Error('请选择设备类型'));
                            }
                            return callback();
                        },
                    },
                ],
                brand: [
                    { required: true, message: '请填写设备品牌', trigger: 'blur' },
                ],
            },
        };
    },
    mounted() {
        this.getbrandlist();
        this.getsystem();
        this.getsize();
        this.search();
    },
    methods: {
        // 获取品牌下拉框内容
        async getbrandlist() {
            try {
                const entry = await DeviceAPI.getBrandList();
                this.devicebrand = this.devicebrand.concat(entry);
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        handlechange() {
            this.devicetypes = null;
            this.devicetype = ['全部'];
            this.gettypelist();
        },
        // 获取型号列表
        async gettypelist() {
            if (this.devicebrands === '全部') {
                return false;
            }
            try {
                const entry = await DeviceAPI.getModelByBrand({
                    brand: this.devicebrands,
                });
                this.devicetype = this.devicetype.concat(entry);
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            }
            return true;
        },
        // 获取操作系统列表
        async getsystem() {
            try {
                const entry = await DeviceAPI.getOperationSystemList();
                entry.forEach((item) => {
                    this.devicesystem.push(item);
                });
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        // 获取屏幕大小列表
        async getsize() {
            try {
                const entry = await DeviceAPI.getScreenSizeList();
                entry.forEach((item) => {
                    this.devicesize.push(item);
                });
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        searchBtn (){
            this.pageNo = 1;
            this.search();
        },
        async search() {
            let devicebrands = this.devicebrands;
            let devicetypes = this.devicetypes;
            let devicesystems = this.devicesystems;
            let devicesizes = this.devicesizes;

            if (this.devicebrands === '全部') {
                devicebrands = null;
            }
            if (this.devicetypes === '全部') {
                devicetypes = null;
            }
            if (this.devicesystems === '全部') {
                devicesystems = null;
            }
            if (this.devicesizes === '全部') {
                devicesizes = null;
            }
            this.IS_LOADING = true;
            try {
                this.isLoading = true;
                const { entry, total } = await DeviceAPI.query({
                    model: devicetypes,
                    brand: devicebrands,
                    screenSize: devicesizes,
                    operationSystem: devicesystems,
                    pageNo: this.pageNo,
                    pageSize: 10,
                });
                this.typeList = entry;
                this.totalCount = total;
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            } finally {
                this.isLoading = false;
            }
        },
        // 分页
        handleCurrentChange(pageNum) {
            this.pageNo = pageNum;
            this.search();
        },
        // 新增设备弹窗
        addtype() {
            this.editdevice = true;
            this.isedit = true;
            if (this.adddevicemodel.length <= 0) {
                this.getdevicetype();
            }
        },
        // 弹窗处请求设备类型接口
        async getdevicetype() {
            try {
                const { entry } = await DeviceAPI.getAllDeviceType();
                this.adddevicemodel = entry;
                this.IS_LOADING = false;
            } catch (err) {
                this.IS_LOADING = false;
            }
        },
        // 编辑弹窗
        showeeditdevice(id, index) {
            const item = this.typeList[index];
            this.id = id;
            this.modelTypeDialog.model = item.model;
            this.modelTypeDialog.name = item.name;
            this.modelTypeDialog.adddevicemodels = item.deviceTypeId;
            this.devicegroup = item.devicegroup;
            this.modelTypeDialog.brand = item.brand;
            this.modelTypeDialog.cpu = item.cpu;
            this.modelTypeDialog.screenSize = item.screenSize;
            this.modelTypeDialog.operationSystem = item.operationSystem;
            this.modelTypeDialog.ram = item.ram;
            this.modelTypeDialog.operationSystemVersion = item.operationSystemVersion;
            this.processorSpeed = item.processorSpeed;
            this.editdevice = true;
            this.isedit = false;
            this.title = '编辑设备类型';
            if (this.adddevicemodel.length <= 0) {
                this.getdevicetype();
            }
        },
        // 清空编辑的状态
        clearstatus() {
            this.editdevice = false;
            this.title = '新建设备类型';
            this.modelTypeDialog.model = null;
            this.modelTypeDialog.name = null;
            this.deviceTypeId = null;
            this.devicegroup = null;
            this.modelTypeDialog.brand = null;
            this.modelTypeDialog.cpu = null;
            this.modelTypeDialog.screenSize = null;
            this.modelTypeDialog.operationSystem = null;
            this.modelTypeDialog.ram = null;
            this.modelTypeDialog.operationSystemVersion = null;
            this.processorSpeed = null;
            this.modelTypeDialog.adddevicemodels = null;
            this.adddevicegroups = null;
            this.adddevicegroup = [];
        },
        // 取消编辑弹窗
        deleditdevice() {
            this.clearstatus();
        },
        // 删除弹窗
        showdelpopup(id, index) {
            this.deldialog = true;
            const deldevice = this.deldevice;
            MessageBox.confirm('您确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deldevice(id, index);
            }).catch(() => {});
        },

        // 删除设备
        async deldevice(id, index) {
            try {
                const message = await DeviceAPI.deleteDevice({
                    id,
                });
                this.deldialog = false;
                Util.toast(message, 'succeed', 1500);
                this.typeList.splice(index, 1);
            } catch (err) {
                this.deldialog = false;
                Util.toast(err, 'failed', 1500);
            }
        },
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        onSubmit() {
            const dialogSubmit = this.dialogSubmit;
            this.$refs.modelDialog.validate((valid) => {
                if (valid) {
                    dialogSubmit();
                }
            });
        },
        async dialogSubmit() {
            const prama = {
                model: this.modelTypeDialog.model,
                name: this.modelTypeDialog.name,
                deviceTypeId: this.modelTypeDialog.adddevicemodels,
                brand: this.modelTypeDialog.brand,
                cpu: this.modelTypeDialog.cpu,
                screenSize: this.modelTypeDialog.screenSize,
                operationSystem: this.modelTypeDialog.operationSystem,
                ram: this.modelTypeDialog.ram,
                operationSystemVersion: this.modelTypeDialog.operationSystemVersion,
                processorSpeed: this.processorSpeed,
            };
            let message = '';
            try {
                if (!this.isedit) {
                    prama.id = this.id;
                    message = await DeviceAPI.update(prama);
                } else {
                    message = await DeviceAPI.createDevice(prama);
                }
                this.IS_LOADING = false;
                this.editdevice = false;
                this.clearstatus();
                Util.toast(message, 'succeed', 1500);
                this.search();
            } catch (e) {
                this.IS_LOADING = false;
                Util.toast(e, 'failed', 1500);
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
.f-mg5{
    margin:5px 0 ;
}
.cr-require {
    color: red;
    display: inline-block;
    font-size: 5px;
    padding-right: 5px;
}
</style>
