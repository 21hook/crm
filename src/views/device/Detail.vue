<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">设备详情</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <div class="cr-float cr-margin">
                    <div class="el-form-item">
                        <label class="el-form-label">激活状态：</label>
                        <span>{{ status }}</span>
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">设备ID：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="devid">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">设备型号：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="devicesize">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">设备名称：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="devicename">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">设备类型：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="devicetype">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">设备分组：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="devicegroup">
                    </div>
                </div>
                <div class="cr-float cr-margin">
                    <div class="el-form-item">
                        <label class="el-form-label">在线状态：</label>
                        <span>{{ onlineStatus }}</span>
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">操作系统</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="systemoper">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">操作系统版本号</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="systemversion">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">rom版本：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="rom">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">MAC地址：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="mac">
                    </div>
                    <div class="el-form-item">
                        <label class="el-form-label">CPU配置：</label>
                        <input autocomplete="off" type="text" class="el-form-input" disabled
                            v-model="cpu">
                    </div>
                </div>
                <div class="cr-float-parent">
                    <div class="cr-float cr-margin">
                        <div class="el-form-item">
                            <label class="el-form-label">设备音量：</label>
                            <span>{{ voiceSize }}</span>
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">屏幕分辨率：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="resolution">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">屏幕尺寸：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="screensize">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">内存：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="ram">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">闪存：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="flashmemory">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">处理速度：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="processorspeed">
                        </div>
                    </div>
                    <div class="cr-float-children cr-margin">
                        <div class="el-form-item">
                            <label class="el-form-label">创建时间：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="getcreate">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">所在店铺名称：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="deviceshop">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">店铺ID：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="deviceshopID">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">店铺地址：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="address">
                        </div>
                        <div class="el-form-item">
                            <label class="el-form-label">城市名称：</label>
                            <input autocomplete="off" type="text" class="el-form-input" disabled
                                v-model="cityname">
                        </div>
                    </div>
                </div>
            </div>
            <div class="cr-panel">
                <h2 class="cr-page-title">设备投放活动：</h2>
                <el-table style="width: 100%"
                    element-loading-text="拼命加载中"
                    :data="activeList" :default-sort="{prop:'id',order: 'descending'}">
                    <el-table-column width="50"
                        type="expand">
                        <template scope="props">
                            <div class="tag-block">
                                <div class="tag-list-title">关联的创意</div>
                                <div class="tag-list">
                                    <el-tag v-for="(item,index) in props.row.activityCreativeIds" :key="index"
                                        type="primary" >{{item.id}} | {{ item.name }}</el-tag>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动ID" prop="id"></el-table-column>
                    <el-table-column label="日期" prop="date"></el-table-column>
                    <el-table-column label="时段" prop="time"></el-table-column>
                    <el-table-column label="活动" prop="name"></el-table-column>
                    <el-table-column label="状态" prop="status"></el-table-column>
                </el-table>
                <div class="el-form-item el-form-inner">
                    <el-button class="m-button"
                        v-if="this.devstatus === 2"
                        type="primary"
                        @click.prevent="">设备未激活</el-button>
                    <el-button class="m-button-opticity"
                        v-else-if="this.devstatus === 1"
                        type="primary"
                        @click.prevent=""></el-button>
                    <el-button class="m-button-margin"
                        v-else
                        type="primary"
                        @click.prevent="onSubmit">解除设备激活</el-button>
                    <el-button class="m-button-margin"
                        type="primary"
                        @click.prevent="uploadDeviceLog">上传设备日志</el-button>
                </div>
            </div>
        </form>
    </div>
</template>
 
<script>
import Vue from 'vue';
import {
    Button,
    Pagination,
    Table,
    TableColumn,
    Checkbox,
    CheckboxGroup,
    Tag,
} from 'element-ui';

import Util from '@/libs/util';
import DeviceAPI from '@/api/Device';
import ProcurementAPI from '@/api/Procurement';

Vue.use(Button);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tag);

export default{
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            getcreate: null,
            deviceshopID: null,
            address: null,
            cityname: null,
            resolution: null,
            ram: null,
            screensize: null,
            flashmemory: null,
            processorspeed: null,
            rom: null,
            mac: null,
            cpu: null,
            systemversion: null,
            systemoper: null,
            devicedetail: [],
            activeList: [],
            status: '',
            onlineStatus: '不在线',
            devid: null,
            devicesize: '',
            devicename: '',
            devicetype: '',
            devicegroup: '',
            deviceshop: '',
            app: '',
            detailId: '',
            shopId: '',
            deviceGroupId: '',
            devstatus: '',
            tableData: [],
            voiceSize: null,
        };
    },
    mounted() {
        if (Util.getUrlParam('id')) {
            this.detailId = Util.getUrlParam('id');
            this.shopId = Util.getUrlParam('shopid');
            this.groupId = Util.getUrlParam('groupid');
            this.status = Util.getUrlParam('status');
            this.search();
            this.searchlist();
        }
    },
    methods: {
        // 获取设备详情信息
        async search() {
            if (this.IS_LOADING) {
                return false;
            }
            this.IS_LOADING = true;

            try {
                const entry = await DeviceAPI.getDeviceActivateInfo({
                    deviceId: this.detailId,
                });
                if (entry) {
                    this.IS_LOADING = false;
                    if (entry.device) {
                        this.systemoper = entry.device.operationSystem;
                        this.systemversion = entry.device.operationSystemVersion;
                        this.devid = entry.device.deviceId;
                        this.devicesize = entry.device.model;
                        this.devicename = entry.device.name;
                        this.rom = entry.device.rom;
                        this.mac = entry.device.mac;
                        this.cpu = entry.device.cpu;
                        this.getcreate = entry.device.gmtCreate;
                        this.screensize = entry.device.screenSize;
                        this.resolution = entry.device.resolution;
                        this.ram = entry.device.ram;
                        this.flashmemory = entry.device.flashMemory;
                        this.processorspeed = entry.device.processorSpeed;
                        this.address = entry.device.address;
                        this.cityname = entry.device.cityName;
                        this.onlineStatus = entry.device.onlineStatus === 1 ? '在线' : '下线';
                        this.voiceSize = entry.device.voice;
                        if (entry.device.status === 2) {
                            this.status = '未激活';
                        } else {
                            this.status = '激活';
                        }
                    }
                    if (entry.deviceType) {
                        this.devicetype = entry.deviceType.name;
                    } else {
                        this.devicetype = entry.deviceType;
                    }
                    if (entry.deviceGroup) {
                        this.devicegroup = entry.deviceGroup.name;
                    } else {
                        this.devicegroup = entry.deviceGroup;
                    }
                    if (entry.shopDTO) {
                        this.deviceshop = entry.shopDTO.shopName;
                        this.deviceshopID = entry.shopDTO.id;
                    } else {
                        this.deviceshop = entry.shopDTO;
                    }
                } else {
                    this.devid = null;
                }
            } catch (err) {
                this.IS_LOADING = false;
            }
            return false;
        },
        async searchlist() {
            this.IS_LOADING = true;
            if (this.shopId === undefined || this.deviceGroupId === undefined) {
                this.IS_LOADING = false;
                return false;
            } else if (this.shopId !== undefined && this.deviceGroupId !== undefined) {
                try {
                    this.activeList = await ProcurementAPI.getActivityList({
                        shopId: this.shopId,
                        deviceGroupId: this.groupId,
                    });
                    this.IS_LOADING = false;
                    this.activeList.forEach((item) => {
                        item.startdate = item.startDate.split(/\s+/)[0];
                        item.enddate = item.endDate.split(/\s+/)[0];
                        item.satrttime = item.startDate.split(/\s+/)[1];
                        item.endtime = item.endDate.split(/\s+/)[1];
                        item.date = `${item.startdate} ~ ${item.enddate}`;
                        item.time = `${item.satrttime} ~ ${item.endtime}`;
                        if (item.status === 0) {
                            item.status = '失效';
                        } else {
                            item.status = '生效';
                        }
                    });
                } catch (err) {
                    this.IS_LOADING = false;
                }
            }
            return false;
        },
        // 解除设备
        async onSubmit() {
            try {
                const message = await DeviceAPI.deviceDeactivate({
                    deviceId: this.detailId,
                });
                this.IS_LOADING = false;
                Util.toast(message, 'succeed', 2000);
                this.status = 2;
                this.searchlist();
            } catch (err) {
                this.IS_LOADING = false;
                Util.toast(err, 'failed', 2000);
            }
        },
        async uploadDeviceLog() {
            try {
                const message = await DeviceAPI.uploadLog({
                    deviceId: this.detailId,
                    // deviceType: this.deviceType,
                    eventType: 'control_device',
                    gmtEvent: this.getcreate,
                    eventContent: {
                        controlType: 'upload_log',
                        content: {
                            u: 'studiolog',
                            p: 'GBo>fRKf&5hLc])',
                            port: 2121,
                        },
                    },
                });
                if (message) {
                    Util.toast(message, 'succeed', 2000);
                } else {
                    Util.toast('上传日志成功', 'succeed', 2000);
                }
            } catch (err) {
                this.IS_LOADING = false;
                Util.toast(err, 'failed', 2000);
            }
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

.cr-float-parent:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.cr-float-children {
    float: left;
    margin-top: 3%;
}
.cr-float {
    float: left;
}
.m-button {
    opacity: 0.5;
    margin-top: 20px !important;
}
.m-button-opticity {
    opacity: 0;
    margin-top: 20px !important;
}
.cr-margin {
    margin-right: 5%;
}
.m-button-margin {
    margin-top: 20px !important;
}
</style>
