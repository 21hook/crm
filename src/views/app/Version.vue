<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">app管理 > 设备app版本</h2>
        <div class="cr-panel">
            <el-select placeholder="请选择"
                v-model="exeName"
                @change="queryUpgradeList(true)">
                <el-option v-for="item in options" :key="item.value"
                    :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary"
                @click.prevent="addeditpopup">新增</el-button>
        </div>
        <div class="cr-panel">
            <table class="cr-table">
                <thead>
                    <tr>
                        <th style="width: 10%;">版本</th>
                        <th style="width: 20%;">版本描述</th>
                        <th style="width: 20%;">创建时间</th>
                        <th style="width: 20%;">md5</th>
                        <th style="width: 10%;">强制升级</th>
                        <th style="width: 10%;">城市范围</th>
                        <th style="width: 10%;">店铺限制</th>
                        <th style="width: 10%;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in upgradeList" :key="item.upgradeList">
                        <td>{{ item.version }}</td>
                        <td>{{ item.remark }}</td>
                        <td>{{ item.gmtCreate }}</td>
                        <td>{{ item.md5 }}</td>
                        <td>{{ item.forceUpgrade ? '是' : '否' }}</td>
                        <td>
                            <span v-if="item.whiteCityCodes === '' || item.whiteCityCodes === null">全部城市</span>
                        </td>
                        <td>
                            <span v-if="item.whiteShopIds">是</span>
                            <span v-else>否</span>
                        </td>
                        <td>
                            <a href=""
                                @click.prevent="showeditpopup(item.id)">编辑</a>
                            <a href=""
                                @click.prevent="showdelpopup(item.id)">删除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 删除 -->
        <el-dialog v-if="deldialog" v-model="deldialog"
            custom-class="ele-modal" top="30%"
            :show-close="false">
            <div class="no-top-border">确定删除吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger"
                    @click="delupdate">确定[enter]</el-button>
                <el-button @click="deldialog=false">取消[ESC]</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog v-if="editdialog" v-model="editdialog"
            custom-class="ele-modal"
            :show-close="false">
            <div class="no-top-border">
                <div class="el-form-item">
                    <label class="el-form-label">程序名称：</label>
                    <template v-if="isEdit">
                        <input class="el-form-input" autocomplete="off" type="text" disabled
                            v-model="curExeNameText">
                    </template>
                    <template v-else>
                        <el-select placeholder="请选择"
                            v-model="curExeName">
                            <el-option v-for="item in options" :key="item.value"
                                :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">版本号：</label>
                    <input autocomplete="off" type="text" class="el-form-input" disabled
                        v-model="version" v-if="isEdit">
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="version" v-else>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">MD5：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="md5" v-if="isEdit">
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="md5" v-else>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">是否强制升级：</label>
                    <el-switch
                        v-model="forceUpgrade"
                        on-text=""
                        off-text="">
                    </el-switch>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">有效类型：</label>
                    <el-select placeholder="请选择"
                        v-model="type">
                        <el-option v-for="item in typeList" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div class="el-form-item"
                    v-if="type === 'whitelist'">
                    <label class="el-form-label">店铺白名单：</label>
                    <textarea placeholder="请输入店铺id','隔开" class="cr-textarea"
                        v-model="whiteShopIds"></textarea>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">描述信息：</label>
                    <textarea placeholder="请输入描述信息" class="cr-textarea"
                        v-model="remark"></textarea>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                    @click.prevent="editupdate(true)">确定[enter]</el-button>
                <el-button @click.prevent="cancel">取消[ESC]</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import {
    Select,
    Option,
    Button,
    Dialog,
    Switch,
} from 'element-ui'

import Util from '@/libs/util'
import DeviceAPI from '@/api/Device'

Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Switch)

export default {
    data() {
        return {
            // 是否正在加载
            IS_LOADING: false,
            options: [
                {
                    value: 'EleBarcodeScan',
                    label: '扫码监控',
                },
                {
                    value: 'EleReleaser',
                    label: '工具释放器',
                },
                {
                    value: 'eleph',
                    label: '小象掌柜',
                },
                {
                    value: 'elephSimple',
                    label: '小象掌柜简易版',
                },
                {
                    value: 'Arrival',
                    label: 'android广告触达者',
                },
                {
                    value: 'maihuo',
                    label: '脉货',
                },
                {
                    value: 'HYKiOS',
                    label: '好衣库ios-app',
                },
                {
                    value: 'HYK',
                    label: '好衣库android-app',
                },
                {
                    value: 'MaihuoiOS',
                    label: '脉货ios-app',
                },
            ],
            exeName: 'elephSimple',
            pageNo: 1,
            upgradeList: [],
            deldialog: false,
            curId: '',
            // 添加编辑
            editdialog: false,
            curExeName: '',
            curExeNameText: '',
            version: '',
            md5: '',
            forceUpgrade: false,
            remark: '',
            typeList: [
                {
                    value: 'all',
                    label: '全部有效',
                },
                {
                    value: 'whitelist',
                    label: '白名单有效',
                },
            ],
            type: 'all',
            whiteShopIds: '',
            isEdit: false,
        }
    },
    mounted() {
        // test 时间戳
        this.queryUpgradeList()
    },
    methods: {
        // 查询升级列表
        async queryUpgradeList(isfirstpage) {
            if (isfirstpage) {
                this.pageNo = 1
            }
            try {
                const entry = await DeviceAPI.queryList({
                    exeName: this.exeName,
                    pageNo: this.pageNo,
                    pageSize: 20,
                })
                this.upgradeList = entry
            } catch (err) {
                // console.log(err);
            }
        },
        // 删除升级
        showdelpopup(id) {
            this.curId = id
            this.deldialog = true
        },
        async delupdate() {
            this.deldialog = false
            try {
                const message = await DeviceAPI.deleteById({
                    id: this.curId,
                })
                Util.toast(message, 'succeed', 2000)
                this.queryUpgradeList()
            } catch (err) {
                Util.toast(err, 'failed', 2000)
            }
        },
        // 编辑升级
        addeditpopup() {
            this.isEdit = false
            this.editdialog = true
        },
        showeditpopup(id) {
            this.isEdit = true
            this.editdialog = true
            this.curId = id
            this.upgradeList.forEach((item) => {
                if (item.id === id) {
                    this.version = item.version
                    this.md5 = item.md5
                    this.remark = item.remark
                    this.curExeName = item.exeName
                    this.curExeNameText = this.returnCurExeNameText(item.exeName)
                    if (item.whiteShopIds !== '') {
                        this.type = 'whitelist'
                        this.whiteShopIds = this.formatArr(item.whiteShopIds)
                    }
                }
            })
        },
        returnCurExeNameText(exeName) {
            let name = ''
            this.options.forEach((item) => {
                if (item.value === exeName) {
                    name = item.label
                }
            })
            return name
        },
        formatArr(str) {
            const t = str && str.replace(/\[/ig, '').replace(/\]/ig, '')
            return t.split(',')
        },
        async editupdate() {
            try {
                const data = {
                    id: this.curId,
                    exeName: this.curExeName,
                    md5: this.md5,
                    forceUpgrade: this.forceUpgrade,
                    remark: this.remark,
                    version: this.version,
                    whiteCityCodes: '',
                    whiteShopIds: (this.type === 'all') ? '' : `[${this.whiteShopIds}]`,
                }
                const message = this.isEdit ? await DeviceAPI.updateToolUpgrade(data) : await DeviceAPI.insertToolUpgrade(data)
                Util.toast(message, 'succeed', 2000)
                this.queryUpgradeList()
            } catch (err) {
                Util.toast(err, 'failed', 2000)
            } finally {
                this.edaitdialog = false
                this.isEdit = false
                this.initData()
            }
        },
        initData() {
            this.version = ''
            this.md5 = ''
            this.remark = ''
            this.whiteShopIds = ''
            this.type = 'all'
        },
        cancel() {
            this.editdialog = false
            this.initData()
        },
    },
}
</script>

<style scoped>
@import '../../assets/common.css';

.el-form-label {
    width: 120px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
}

.el-form-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 193px;
    display: inline-block;
}

input[disabled], input:disabled {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #bbb;
    cursor: not-allowed;
}
</style>
