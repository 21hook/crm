<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">设备管理</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <el-select size="11%" placeholder="设备类型"
                    v-model="types"
                    @change="handleChange">
                    <el-option v-for="item in type" :key="item.id"
                        :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select size="11%" placeholder="设备分组"
                    v-model="deviceteams" :disabled="types==''">
                    <el-option v-for="item in deviceteam" :key="item.id"
                        :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select size="11%" placeholder="设备状态"
                    v-model="dStatus">
                    <el-option v-for="item in devicestatus" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select size="11%" placeholder="app状态"
                    v-model="aStatus">
                    <el-option v-for="item in applicationStatus" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-cascader size="11%" placeholder="店铺分组"
                    v-model="shoptypes"
                    expand-trigger="hover"
                    :clearable="true" :change-on-select="true" :options="shoptype" :props="props"></el-cascader>
                <el-input  placeholder="搜索设备ID" v-model="id" type="text" class="ipt-inline"></el-input>
                 <el-input  placeholder="店铺名称" v-model="shopName" type="text" class="ipt-inline"></el-input>
                <el-button type="primary"
                    @click.prevent="searchBtn">搜索</el-button>
            </div>
        </form>
        <div class="cr-panel">
            <div class="cr-mar-div">
                <el-button class="cr-optacity">远程安装</el-button>
                <el-button class="cr-optacity">远程卸载</el-button>
                <el-button class="cr-m-button"
                    @click="operateDeviceBtn(2)">重启</el-button>
                <!-- <el-button class="cr-m-button"
                    @click="operateDeviceBtn(1)">关机</el-button> -->
                <el-button class="cr-m-button"
                    @click="closeOpenTime">定时开关机</el-button>
                <el-button class="cr-m-button"
                    @click="controlDeviceVoiceBtn">音量</el-button>
                <el-button class="cr-optacity">版本更新</el-button>
            </div>
            <el-table class="manage-table" style="width:100%" v-loading.body="isLoading"
                ref="multipleTable"
                :data="deviceInfo"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40px"></el-table-column>
                <el-table-column label="设备ID" prop="deviceDTO.deviceId" min-width="80"></el-table-column>
                <el-table-column label="设备信息" min-width="140">
                    <template scope="item">
                        <p v-if="item.row.deviceDTO.model"><span class="span">型号 : </span>{{ item.row.deviceDTO.model }}</p>
                        <p v-if="item.row.deviceDTO.name"><span class="span">名称 : </span>{{ item.row.deviceDTO.name }}</p>
                        <p v-if="item.row.deviceDTO.deviceTypeName"><span class="span">类型 : </span>{{ item.row.deviceDTO.deviceTypeName }}</p>
                        <p v-if="item.row.deviceDTO.groupName"><span class="span">分组 : </span>{{item.row.deviceDTO.groupName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="时间" min-width="180">
                    <template scope="item">
                        <p v-if="item.row.deviceDTO.gmtCreate"><span class="span">注册 : </span>{{item.row.deviceDTO.gmtCreate | deviceTimeUpdate}}</p>
                        <p v-if="item.row.deviceDTO.gmtActivate"><span class="span">激活 : </span>{{item.row.deviceDTO.gmtActivate | deviceTimeUpdate}}</p>
                        <p v-if="item.row.deviceDTO.gmtLastHeartbeat"><span class="span">活跃 : </span>{{item.row.deviceDTO.gmtLastHeartbeat | deviceTimeUpdate}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="开关机设置" min-width="116">
                    <template scope="item">
                        <template v-if="item.row.deviceDTO.attributes.length">
                            <p><span class="span">开机 : </span>{{JSON.parse(item.row.deviceDTO.attributes).startup_time}}</p>
                            <p><span class="span">关机 : </span>{{JSON.parse(item.row.deviceDTO.attributes).shutdown_time}}</p>
                        </template>
                        <template v-else>
                            <p><span class="span">全天开机</span></p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="所在店铺">
                    <template scope="item">{{ item.row.deviceDTO.shopName }}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="115">
                    <template scope="item">
                        <p><span class="span">设备:</span>
                        <span v-if="item.row.deviceDTO.status == 2">未激活</span>
                        <span v-else-if="item.row.deviceDTO.status == 3 && item.row.deviceDTO.onlineStatus == 1">上线</span>
                        <span v-else>下线</span></p>
                        <p v-if="item.row.monitors.length > 0"><span class="span">app:</span>
                            <span v-if="item.row.monitors[0].appStatus == 0">未播放</span>
                            <span v-else-if="item.row.monitors[0].appStatus == 1 && item.row.monitors[0].playStatus == 1 ">播放中</span>
                            <span v-else>抄底播放</span>
                        </p>
                        <p v-else><span class="span">app:</span>
                            <span>未播放</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="65">
                    <template scope="item">
                        <el-button class="scan-btn" href="javascript:void(0);" size="small"
                            @click.prevent="showdetail(item.row.deviceDTO)">详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand" min-width="20">
                    <template scope="item">
                        <template v-if="item.row.activityDTOS.length > 0" >
                            <div class="tag-block">
                                <div class="tag-list-title"><span class="span">关联的活动</span></div>
                                <div class="tag-list" v-for="(item, index) in item.row.activityDTOS" :key="index">
                                    <span class="activity-name">{{item.name}}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="tag-block">
                                <div class="tag-list-title"><span class="span">关联的活动</span></div>
                                <div class="tag-list">
                                    <span class="">无</span>
                                </div>
                            </div>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination class="pagination"
                    v-if="totalCount > 10"
                    layout="prev, pager, next" :current-page.sync="pageNo"
                    :total="totalCount"
                    @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <el-dialog v-if="clockSetting.showClockSetting" v-model="clockSetting.showClockSetting"
            custom-class="ele-modal" title="设置定时开关机" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <el-form>
                <el-form-item label="整天开机">
                    <el-switch
                        v-model="clockSetting.clockOpenDay"
                        on-color="#13ce66"
                        off-color="#ff4949"></el-switch>
                </el-form-item>
                <template v-if="!clockSetting.clockOpenDay">
                    <el-form-item label="开机时间">
                        <el-time-picker v-model="clockSetting.startTime"
                            popper-class="pop-time" value="TimePicker"
                            :picker-options="{ format: 'HH:mm:ss' }">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="关机时间">
                        <el-time-picker v-model="clockSetting.closeTime"
                            popper-class="pop-time" value="TimePicker"
                            :picker-options="{ format: 'HH:mm:ss' }">
                        </el-time-picker>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clockSetting.showClockSetting = false">取 消</el-button>
                <el-button type="primary"
                    @click="deviceClockTimeSetting">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="operateSetting.showClockSetting" v-model="operateSetting.showClockSetting"
            custom-class="ele-modal" top="30%"
            :title="operateSetting.operateTitle" :show-close="true" :close-on-click-modal="false">
            <div>对设备id为 {{ deviceIdToStr }} 进行{{ operateSetting.operateTitle }}设置</div>
            <div class="dialog-footer"
                slot="footer">
                <el-button @click="operateSetting.showClockSetting = false">取 消</el-button>
                <el-button type="primary"
                    @click="deviceOperateSetting">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="voiceSetting.showClockSetting" v-model="voiceSetting.showClockSetting"
            title="批量设置声音" custom-class="ele-modal" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <span>设置声音大小：{{ voiceSetting.value }}</span>
            <el-slider v-model="voiceSetting.value"
                :step="1" :max="100" :min="0"></el-slider>
            <div class="dialog-footer"
                slot="footer">
                <el-button @click="voiceSetting.showClockSetting = false">取 消</el-button>
                <el-button type="primary" @click="deviceVoiceSetting">确 定</el-button>
            </div>
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
    Cascader,
    Table,
    TableColumn,
    Form,
    TimePicker,
    FormItem,
    Loading,
    Input,
} from 'element-ui';

import Util from '@/libs/util';
import DeviceAPI from '@/api/Device';
import ShopAPI from '@/api/Shop';

Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Option);
Vue.use(CheckboxGroup);
Vue.use(Slider);
Vue.use(Cascader);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(Loading);
Vue.use(TimePicker);
Vue.use(Switch);
Vue.use(FormItem);
Vue.use(Input);

export default {
    data() {
        return {
            // 是否正在加载
            isLoading: false,
            types: null,
            type: [
                {
                    name: '全部',
                    id: '',
                },
            ],
            devicestatus: [
                {
                    label: '全部',
                    value: null,
                },
                {
                    label: '未激活',
                    value: '2',
                },
                {
                    label: '下线',
                    value: '30',
                },
                {
                    label: '上线',
                    value: '31',
                },
            ],
            applicationStatus: [
                {
                    label: '全部',
                    value: null,
                },
                {
                    label: '未播放',
                    value: '0',
                },
                {
                    label: '播放中',
                    value: '11',
                },
                {
                    label: '抄底播放',
                    value: '10',
                },
            ],
            shoptypes: null,
            shoptype: [],
            props: {
                label: 'name',
                value: 'id',
                children: 'list',
                disabled: 'disabled',
            },
            disable: false,
            dStatus: '',
            status: '',
            onlineStatus: '',
            aStatus: '',
            appStatus: '',
            playStatus: '',
            deviceteams: '',
            deviceteam: [
                {
                    name: '全部',
                    id: null,
                    list: [],
                },
            ],
            isIndeterminate: true,
            deviceInfo: [],
            deviceid: [],
            deviceActivityDto: [],
            deviceMonitors: [],
            name: '',
            id: '',
            shopName: '',
            totalCount: '',
            secondshop: null,
            secondshoparr: [],
            pageNo: 1,
            multipleSelectedDevice: [],
            clockSetting: {
                showClockSetting: false,
                clockOpenDay: true,
                startTime: '',
                closeTime: '',
            },
            // 设置开关机和重启 type:1 为关机 2 为重启
            operateSetting: {
                showClockSetting: false,
                operateTitle: '',
                type: 0,
            },
            voiceSetting: {
                showClockSetting: false,
                value: 0,
            },
        };
    },
    mounted() {
        this.search();
        this.getDeviceTypes();
        this.getShopGroup();
    },
    methods: {
        // 获取设备类型列表
        async getDeviceTypes() {
            try {
                const { entry } = await DeviceAPI.getAllDeviceType();
                this.type = this.type.concat(entry);
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        // 根据设备类型选择设备分组
        async handleChange() {
            if (this.types === '') {
                return false;
            }
            this.deviceteams = null;
            this.deviceteam = [
                {
                    name: '全部',
                    id: '',
                    list: [],
                },
            ];
            try {
                const entry = await DeviceAPI.getDeviceGroupByType({
                    deviceTypeId: this.types,
                });
                this.deviceteam = this.deviceteam.concat(entry);
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
            return true;
        },
        // 获取店铺类型
        async getShopGroup() {
            try {
                this.shoptype = await ShopAPI.getShopGroup();
                this.shoptype.forEach((item) => {
                    if (item.list.length === 0) {
                        delete item.list;
                    } else {
                        item.list.forEach((obj) => {
                            if (obj.list.length === 0) {
                                delete obj.list;
                            }
                        });
                    }
                });
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        checklist() {
            if (this.shoptypes !== null && this.shoptypes.length === 1) {
                const arr = [];
                this.shoptype.forEach((item) => {
                    arr.push(item.id);
                });
                const num = arr.indexOf(Number(this.shoptypes));
                const secondarr = [];

                if (Object.prototype.hasOwnProperty.call(this.shoptype[num], 'list') === false) {
                    this.secondshoparr = this.shoptypes;
                } else if (this.shoptype[num].list.length === 0) {
                    this.secondshoparr = this.shoptypes;
                } else {
                    this.shoptype[num].list.forEach((item) => {
                        secondarr.push(item.id);
                    });
                    this.secondshoparr = secondarr;
                }
            } else if (this.shoptypes !== null && this.shoptypes.length === 2) {
                this.secondshoparr = this.shoptypes[1];
            } else {
                this.secondshoparr = this.shoptypes;
            }
        },
        searchBtn() {
            this.pageNo = 1;
            this.search();
        },
        // 根据key值获取设备
        async search() {
            this.checklist();
            this.deviceInfo = [];
            this.isLoading = true;
            try {
                const { entry, total } = await DeviceAPI.getDeviceByKey({
                    deviceTypeId: this.types,
                    deviceGroupIds: this.deviceteams,
                    status: this.status,
                    onlineStatus: this.onlineStatus,
                    appStatus: this.appStatus,
                    playStatus: this.playStatus,
                    shopGroupIds: this.secondshoparr,
                    pageNo: this.pageNo,
                    pageSize: 10,
                    shopName: this.shopName,
                    deviceId: this.id.trim(),
                });
                this.deviceInfo = entry;
                this.totalCount = total;
                if (entry.length === 0) {
                    Util.toast('没有匹配的设备', 'succeed', 2000);
                }
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 点击关机按钮
        operateDeviceBtn(index) {
            if (!this.multipleSelectedDevice.length) {
                Util.toast('先勾选设备', 'notice', 2000);
                return false;
            }
            if (index === 1) {
                this.operateSetting.operateTitle = '批量关机';
                this.operateSetting.type = 1;
            } else {
                this.operateSetting.operateTitle = '批量重启';
                this.operateSetting.type = 2;
            }
            this.operateSetting.showClockSetting = true;
            return false;
        },
        // 点击重启按钮
        resetDeviceBtn() {
            if (!this.multipleSelectedDevice.length) {
                Util.toast('先勾选设备', 'notice', 2000);
                return false;
            }
            this.operateSetting.operateTitle = '批量重启';
            this.operateSetting.showClockSetting = true;
            return false;
        },
        // 定时开挂机
        closeOpenTime() {
            if (!this.multipleSelectedDevice.length) {
                Util.toast('先勾选设备', 'notice', 2000);
                return false;
            }
            this.clockSetting.showClockSetting = true;
            return false;
        },
        // 调节声音
        controlDeviceVoiceBtn() {
            if (!this.multipleSelectedDevice.length) {
                Util.toast('先勾选设备', 'notice', 2000);
                return false;
            }
            this.voiceSetting.showClockSetting = true;
            return false;
        },
        handleCurrentChange(pageNum) {
            this.checkAll = false;
            this.deviceInfo = [];
            this.pageNo = pageNum;
            this.search();
        },
        // 跳转设备详情
        showdetail(item) {
            location.href = `detail.html?id=${item.deviceId}&shopid=${item.shopId}&groupid=${item.deviceGroupId}&status=${item.status}`;
        },
        // 选中某项时，将deviceid 和 index 存储起来，
        handleSelectionChange(val) {
            const objData = [];
            val.forEach((item, index) => {
                const deviceId = item.deviceDTO.deviceId;
                objData[index] = {};

                this.deviceInfo.forEach((oneDevice, deviceIndex) => {
                    if (deviceId === oneDevice.deviceDTO.deviceId) {
                        objData[index].deviceId = deviceId;
                        objData[index].index = deviceIndex;
                    }
                });
            });
            this.multipleSelectedDevice = objData;
        },
        // 批量设置定时开关机
        async deviceClockTimeSetting() {
            let startTime;
            let endTime;
            if (this.clockSetting.clockOpenDay) {
                startTime = '00:00:00';
                endTime = '00:00:00';
            } else {
                if (!this.clockSetting.startTime || !this.clockSetting.startTime) {
                    Util.toast('开关机时间必选', 'notice', 1500);
                    return false;
                }
                startTime = Util.formatDateNew(this.clockSetting.startTime, 'HH:mm:ss');
                endTime = Util.formatDateNew(this.clockSetting.closeTime, 'HH:mm:ss');
            }
            const deviceIds = this.multipleSelectedDevice.map(item => item.deviceId);
            try {
                const message = await DeviceAPI.switchRunTime({
                    deviceIds,
                    shutdown: endTime,
                    startup: startTime,
                });
                this.resetClockSetting(message);
            } catch (err) {
                this.resetClockSetting(err);
                // console.log(err);
            } finally {
                this.search();
            }
            return false;
        },
        // 定时开关机的之后的重置
        resetClockSetting(message) {
            this.clockSetting.startTime = '';
            this.clockSetting.closeTime = '';
            this.clockSetting.clockOpenDay = false;
            this.clockSetting.showClockSetting = false;
            Util.toast(message, 'notice', 1500);
            this.$refs.multipleTable.clearSelection();
        },
        // 批量关机与重启
        async deviceOperateSetting() {
            const deviceIds = this.multipleSelectedDevice.map(item => item.deviceId);
            let message = '';
            try {
                if (this.operateSetting.type === 1) {
                    message = await DeviceAPI.shutDown({ deviceIds });
                } else {
                    message = await DeviceAPI.reboot({ deviceIds });
                }
            } finally {
                this.operateSetting.showClockSetting = false;
                Util.toast(message, 'notice', 1500);
                this.$refs.multipleTable.clearSelection();
                this.search();
            }
        },
        // 批量设置声音
        async deviceVoiceSetting() {
            let deviceIds = [];
            deviceIds = this.multipleSelectedDevice.map(item => item.deviceId);
            let message = '';
            try {
                message = await DeviceAPI.controlVoice({
                    deviceIds,
                    percent: this.voiceSetting.value,
                });
            } finally {
                this.voiceSetting.showClockSetting = false;
                Util.toast(message, 'notice', 1500);
                this.$refs.multipleTable.clearSelection();
            }
        },
    },
    computed: {
        deviceIdToStr() {
            const data = this.multipleSelectedDevice.map(item => item.deviceId);
            return data.join(', ');
        },
    },
    filters: {
        deviceTimeUpdate(data) {
            if (data) {
                const time = data.split(':');
                return `${time[0]}:${time[1]}`;
            }
            return '';
        },
    },
    watch: {
        dStatus(val) {
            if (val == null) {
                this.status = null;
                this.onlineStatus = null;
            } else if (val === 0) {
                this.status = 2;
                this.onlineStatus = null;
            } else {
                this.status = val.split('')[0];
                this.onlineStatus = val.split('')[1];
            }
        },
        aStatus(val) {
            if (val == null) {
                this.appStatus = null;
                this.playStatus = null;
            } else if (val === 0) {
                this.appStatus = 0;
                this.playStatus = null;
            } else {
                this.appStatus = val.split('')[0];
                this.playStatus = val.split('')[1];
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
.pop-time {
    z-index:2002 !important;
}
.cr-m-button:hover {
    color: white !important;
}
.cr-mar-span {
    font-size:medium;
    margin-right:10px;
}
.cr-mar-div {
    margin-bottom:20px;
}
.cr-optacity {
    opacity:0.5;
}
.cr-m-button {
    background-color:#20a0ff;
    color:white;
}
.activity-name{
    background-color: rgba(32,160,255,.1);
    border-color: rgba(32,160,255,.2);
    color: #20a0ff;
    padding: 5px;
    margin: 5px 5px 5px 0px;
    border-radius: 5px;
}
span.span {
    color:#c4c4c4;
    font-size: 12px;
}
.el-input.ipt-inline{
    width: 11% !important;
}
.tag-list{
    display: inline !important;
}
</style>
