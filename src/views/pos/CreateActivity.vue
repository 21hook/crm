<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title"><a href="planList.html" class="link">计划管理</a> >新建计划</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <div class="el-form-item">
                    <label class="el-form-label">活动名称：</label>
                    <input autocomplete="off" maxlength="12" type="text" class="el-form-input"
                        v-model="activityName">
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">活动开始时间：</label>
                    <el-date-picker placeholder="选择日期时间"
                        v-model="startTime"
                        type="datetime"></el-date-picker>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">活动结束时间：</label>
                    <el-date-picker placeholder="选择日期时间"
                        v-model="endTime"
                        type="datetime"></el-date-picker>
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">归属广告商：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="advertiserName">
                </div>
                <div class="el-form-item">
                    <label class="el-form-label">活动商品条码：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="barcode">
                    <el-button size="small" type="primary"
                        @click.prevent="addItem">添加活动商品</el-button>
                </div>
                <div class="el-form-item clearfix">
                    <label class="el-form-label">已添加商品：</label>
                    <div class="item-panel"
                        v-if="adScanActivityItemDOs.length>0">
                        <span v-for="(item, index) in adScanActivityItemDOs" :key="item.barcode">{{ item.barcode }} {{ item.itemName }} {{ item.property }}/{{ item.unit }} <i class="del" @click.prevent="delItem(index)">x</i></span>
                    </div>
                </div>
            </div>
            <div class="cr-panel">
                <div class="el-form-item el-form-inner">
                    <label class="el-form-label">红包总金额：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="hongbaoTotalPrice">
                </div>
                <div class="el-form-item el-form-inner">
                    <label class="el-form-label">每笔红包金额：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="maxHongbaoPrice">
                </div>
                <!--<div class="el-form-item el-form-inner">-->
                    <!--<label class="el-form-label">最低红包金额：</label>-->
                    <!--<input autocomplete="off" v-model="minHongbaoPrice" type="text" class="el-form-input">-->
                <!--</div>-->
                <div class="el-form-item el-form-inner">
                    <label class="el-form-label">商户每笔返佣：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="shopCommissionIncome">
                </div>
                <div class="el-form-item el-form-inner">
                    <label class="el-form-label">单机每天限制：</label>
                    <input autocomplete="off" type="text" class="el-form-input"
                        v-model="limitCountForDevice">
                    <span class="tip-gray">0 表示无限制</span>
                </div>
            </div>
            <div class="cr-panel">
                <div class="el-form-item el-form-inner">
                    <label class="el-form-label">投放区域：</label>
                    <input type="radio" class="radio-el" id="one" value="type_all"
                        v-model="picked">
                    <label for="one">全部投放</label>
                    <input type="radio" class="radio-el" id="two" value="type_id"
                        v-model="picked">
                    <label for="two">根据店铺id投放</label>
                </div>
                <div class="el-form-item el-form-inner"
                    v-if="picked === 'type_id'">
                    <label class="el-form-label">投放店铺：</label>
                    <textarea placeholder="多个店铺请用','隔开" class="cr-textarea"
                        v-model="shopids"></textarea>
                </div>
                <div class="el-form-item el-form-inner">
                    <el-button size="small" type="primary"
                        @click.prevent="onSubmit">保存</el-button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    DatePicker,
    Button,
    Table,
    TableColumn,
} from 'element-ui';

import Util from '@/libs/util';
import SpuAPI from '@/api/Spu';
import AdActivityAPI from '@/api/AdActivity';

Vue.use(DatePicker);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);

export default {
    data() {
        return {
            // 活动名称
            activityName: '',
            // 广告商名称
            advertiserName: '',
            // 开始时间
            startTime: '',
            // 结束时间
            endTime: '',
            // 商品条码
            barcode: '',
            // 活动商品列表
            adScanActivityItemDOs: [],
            // 红包总金额
            hongbaoTotalPrice: '',
            // 最高红包金额
            maxHongbaoPrice: '',
            // 最低红包金额
            minHongbaoPrice: '',
            // 商家每笔返佣
            shopCommissionIncome: '',
            // 单机台每天限制,0表示无限制
            limitCountForDevice: '',
            picked: 'type_all',
            shopids: '',
            ajaxRequest: false,
        };
    },
    methods: {
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        // 添加活动商品
        async addItem() {
            this.barcode = this.trim(this.barcode);
            try {
                if (!this.barcode) {
                    Util.toast('商品条码必填', 'failed', 2000);
                    return false;
                }
                const data = await SpuAPI.query({
                    barcode: this.barcode,
                });
                const obj = {
                    barcode: data.barcode,
                    itemName: data.name,
                    property: data.property ? data.property : '未知',
                    spuId: data.id,
                    unit: data.unit ? data.unit : '份',
                };
                for (let i = 0; i < this.adScanActivityItemDOs.length; i += 1) {
                    if (this.trim(this.adScanActivityItemDOs[i].barcode) === this.barcode) {
                        Util.toast('已经添加过了该活动商品', 'failed', 2000);
                        return false;
                    }
                }
                this.barcode = '';

                this.adScanActivityItemDOs.push(obj);
            } catch (e) {
                Util.toast(e, 'failed', 2000);
            }
            return true;
        },
        // 保存提交
        async onSubmit() {
            if (!this.validData()) {
                return false;
            }
            if (this.ajaxRequest) {
                return false;
            }
            try {
                this.ajaxRequest = true;
                await AdActivityAPI.insertAdScanActivity({
                    activityName: this.activityName,
                    adScanActivityItemDTOs: this.adScanActivityItemDOs,
                    advertiserName: this.advertiserName,
                    hongbaoAmount: this.hongbaoAmount(),
                    hongbaoTotalPrice: (parseFloat(this.hongbaoTotalPrice) * 100).toFixed(0) * 1,
                    limitCountForDevice: this.limitCountForDevice,
                    maxHongbaoPrice: (parseFloat(this.maxHongbaoPrice) * 100).toFixed(0) * 1,
                    minHongbaoPrice: (parseFloat(this.maxHongbaoPrice) * 100).toFixed(0) * 1,
                    putWhiteShopList: this.returnputWhiteShopList(),
                    shopCommissionIncome: (parseFloat(this.shopCommissionIncome) * 100).toFixed(0) * 1,
                    startTime: Util.formatDateNew(new Date(this.startTime), 'yyyy-MM-dd HH:mm:ss'),
                    endTime: Util.formatDateNew(new Date(this.endTime), 'yyyy-MM-dd HH:mm:ss'),
                });
                location.href = 'planList.html';
            } catch (e) {
                Util.toast(e, 'failed', 2000);
            } finally {
                this.ajaxRequest = false;
            }
            return true;
        },
        // 删除某个商品
        delItem(index) {
            this.adScanActivityItemDOs.splice(index, 1);
        },
        returnputWhiteShopList() {
            if (this.picked === 'type_id') {
                const str = Util.spliteByComma(this.shopids);
                return str;
            }
            return [];
        },
        hongbaoAmount() {
            const t = (parseFloat(this.hongbaoTotalPrice) * 100).toFixed(0) * 1;
            const m = (parseFloat(this.maxHongbaoPrice) * 100).toFixed(0) * 1;
            return Math.floor(t / m);
        },
        // 提交前验证信息
        validData() {
            // 活动名称
            if (!this.activityName) {
                Util.toast('请填写活动名称', 'failed', 1500);
                return false;
            }
            // 活动时间
            if (!this.startTime || !this.endTime) {
                Util.toast('请填写活动时间起止时间', 'failed', 1500);
                return false;
            }
            // 活动时间规则
            if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
                Util.toast('活动的结束时间应晚于开始时间', 'failed', 1500);
                return false;
            }
            // 归属广告商
            if (!this.advertiserName) {
                Util.toast('请填写归属广告商', 'failed', 1500);
                return false;
            }
            if (Util.returnStrLength(this.advertiserName) > 100) {
                Util.toast('广告商要50个汉字或者100个字符', 'failed', 1500);
                return false;
            }
            // 活动商品
            if (this.adScanActivityItemDOs.length === 0) {
                Util.toast('请选择参加活动的商品', 'failed', 1500);
                return false;
            }
            // 红包总金额
            if (!this.hongbaoTotalPrice || !Util.checkPointTwo(this.hongbaoTotalPrice) || parseFloat(this.hongbaoTotalPrice) < 0.01) {
                Util.toast('请设置合适的红包总金额', 'failed', 1500);
                return false;
            }
            // 每笔红包金额
            if (!this.maxHongbaoPrice || !Util.checkPointTwo(this.maxHongbaoPrice) || parseFloat(this.maxHongbaoPrice) < 0.01) {
                Util.toast('请设置合适的每笔红包金额', 'failed', 1500);
                return false;
            }
            // 商户每笔返佣
            if (!this.shopCommissionIncome || !Util.checkPointTwo(this.shopCommissionIncome)) {
                Util.toast('请设置合适的商户每笔返佣', 'failed', 1500);
                return false;
            }
            // 单机限制
            if (!this.limitCountForDevice || !Util.isValidBarcode(this.limitCountForDevice)) {
                Util.toast('请设置合适的单机每天限制', 'failed', 1500);
                return false;
            }
            // 投放区域
            if (this.picked === 'type_id' && this.shopids === '') {
                Util.toast('请填写店铺id', 'failed', 1500);
                return false;
            }
            return true;
        },
    },
    components: {},
};
</script>

<style>
@import '../../assets/common';
</style>
