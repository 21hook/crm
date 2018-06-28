<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">口播素材管理</h2>
        <form class="cr-form">
            <div class="cr-panel">
                <div class="el-form-item">
                    <el-button type="primary"
                        @click.prevent="clickAddMaterialBtn">新建素材</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <el-table element-loading-text="拼命加载中" v-loading.body="isLoading" :data="materialList" >
                <el-table-column label="素材ID" prop="id"></el-table-column>
                <el-table-column label="素材名称" prop="activityName"></el-table-column>
                <el-table-column label="操作">
                    <template scope="item">
                        <el-button size="small" @click.prevent="showEditPop(item.$index,item.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click.prevent="showDeleteDialog(item.$index,item.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination layout="total, prev, pager, next" v-if ="pagination.totalPagination >10" :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="selectActivityList"></el-pagination>
            </div>
        </div>
        <el-dialog :title="materialDialog.title" :visible.sync="materialDialog.show">
            <el-form class="dialog-input"  label-width="100px" >
                <el-form-item label="素材名称："
                   >
                    <el-input v-model="materialDialog.name"></el-input>
                </el-form-item>
                <el-form-item label="音频文件：">
                    <el-input v-model="materialDialog.radioUrl"></el-input>
                    <el-button type="primary" @click="openRadiaURL">打开音频地址链接</el-button>
                </el-form-item>
                <el-form-item label="设备白名单：">
                     <el-input type="textarea" v-model="materialDialog.whiteShopIds"  placeholder="请输入设备白名单id','隔开" ></el-input>
                </el-form-item>
                <el-form-item label="商品条码：">
                    <el-input v-model="materialDialog.barCode" ></el-input>
                    <el-button type="primary" @click="selectSpubyBarcode">添加活动商品</el-button>
                </el-form-item>
                <el-form-item
                    label="已添加商品：">
                    <div v-if="this.materialDialog.goods.length>0" class="goods-panel">
                        <span v-for="(item, index) in this.materialDialog.goods" :key="item.barcode" class="brand-block">{{item.barcode}} {{item.brand}} {{item.itemName}} {{item.property}}/{{item.unit}} <i class="del" @click.prevent="delGoods(index)">x</i></span>
                    </div>
                </el-form-item>
            </el-form>
            <div class="dialog-footer"
                slot="footer">
                <el-button @click="materialDialog.show = false">取 消</el-button>
                <el-button type="primary" @click="MaterialSubmitFn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Pagination,
    Button,
    Dialog,
    Switch,
    Table,
    TableColumn,
    Loading,
    MessageBox,
    Input,
    FormItem,
    Form,
} from 'element-ui';

import Util from '@/libs/util';
import MaterialAPI from '@/api/Material';
import SpuAPI from '@/api/Spu';

Vue.use(Pagination);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

export default {
    data() {
        return {
            materialList: [],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            isLoading: true,
            // 当前操作的素材的 idx
            operateMaterialIdx: null,
            operateMaterialId: null,
            materialDialog: {
                show: false,
                title: '新建素材',
                name: '',
                radioUrl: '',
                barCode: '',
                goods: [],
                whiteShopIds: [],
            },
        };
    },
    mounted() {
        this.selectActivityList();
    },
    methods: {
        // 查询素材列表
        async selectActivityList() {
            try {
                const activityListData = await MaterialAPI.selectActivityList({
                    pageNow: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                });
                this.materialList = activityListData.entry;
                this.pagination.totalPagination = activityListData.count;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        // 显示删除素材的dialog
        showDeleteDialog(index, id) {
            const deleteIMaterialFn = this.deleteIMaterialFn;
            this.operateMaterialIdx = index;
            this.operateMaterialId = id;
            MessageBox.confirm('您确定要删除该素材吗？', '删除素材', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteIMaterialFn(index, id);
            });
        },
        // 删除素材
        async deleteIMaterialFn(index, id) {
            try {
                await MaterialAPI.deleteMaterialById({
                    id,
                });
                Util.toast('删除成功', 'notice', 1500);
                this.materialList.splice(index, 1);
            } catch (e) {
                Util.toast('删除失败', 'notice', 1500);
            }
        },
        // 删除商品
        delGoods(index) {
            this.materialDialog.goods.splice(index, 1);
        },
        // 添加活动商品
        async selectSpubyBarcode() {
            try {
                const goodsInfo = await SpuAPI.selectSpubyBarcode({
                    barcode: this.materialDialog.barCode,
                });
                for (let k = 0; k < this.materialDialog.goods.length; k += 1) {
                    if (this.materialDialog.goods[k].barcode === goodsInfo.barcode) {
                        Util.toast('该商品已添加', 'notice', 1500);
                        return false;
                    }
                }
                this.materialDialog.barCode = '';
                this.materialDialog.goods.push(goodsInfo);
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
            return true;
        },
        // 线上编辑弹窗
        async showEditPop(idx, id) {
            const materialItem = this.materialList[idx];
            this.operateMaterialIdx = idx;
            this.operateMaterialId = id;
            this.materialDialog.show = true;
            this.materialDialog.title = '编辑素材';
            this.materialDialog.name = materialItem.activityName;
            this.materialDialog.radioUrl = Util.sourceURl + materialItem.matterUrl;
            this.materialDialog.barCode = '';
            try {
                const data = await SpuAPI.selectSpuById({
                    pageNow: 1,
                    pageSize: 10,
                    id,
                });
                this.materialDialog.goods = data.goods;
                this.materialDialog.whiteShopIds = data.deviceIds;
            } catch (e) {
                Util.toast('素材名必填', 'notice', 1500);
            }
        },
        // 点击新建素材按钮
        clickAddMaterialBtn() {
            this.materialDialog.show = true;
            this.materialDialog.title = '新建素材';
            this.materialDialog.name = '';
            this.materialDialog.radioUrl = '';
            this.materialDialog.barCode = '';
            this.materialDialog.goods = [];
            this.operateMaterialIdx = null;
            this.operateMaterialId = null;
            this.materialDialog.whiteShopIds = '';
        },
        // 添加和修改素材
        async MaterialSubmitFn() {
            let deviceIds = '';
            const radioRex = /\.(mp3)|(wma)|(wav)|(flac)|(aac)|(m4a)|(ogg)$/;
            if (!this.materialDialog.name) {
                Util.toast('素材名必填', 'notice', 1500);
                return false;
            }
            if (!radioRex.test(this.materialDialog.radioUrl)) {
                Util.toast('填写正确的音频链接', 'notice', 1500);
                return false;
            }
            deviceIds = Util.spliteByComma(this.materialDialog.whiteShopIds).map(item => parseInt(item, 10));
            if (this.materialDialog.goods.length <= 0) {
                Util.toast('添加活动商品', 'notice', 1500);
                return false;
            }
            const matterUrl = this.materialDialog.radioUrl.replace(Util.sourceURl, '').replace('http://cdn.elephtribe.com/', '');
            try {
                if (this.operateMaterialId) {
                    await MaterialAPI.updateMaterial({
                        id: this.operateMaterialId,
                        activityName: this.materialDialog.name,
                        list: this.goodsCodeList,
                        matterUrl,
                        deviceIds,
                    });
                } else {
                    await MaterialAPI.createMaterial({
                        activityName: this.materialDialog.name,
                        list: this.goodsCodeList,
                        matterUrl,
                        deviceIds,
                    });
                }
                this.selectActivityList();
                this.materialDialog.show = false;
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
            return true;
        },
        openRadiaURL() {
            window.open('uploadFile.html');
        },
    },
    computed: {
        goodsCodeList() {
            const goodsCodeList = this.materialDialog.goods.map(item => item.barcode);
            return goodsCodeList;
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';
.dialog-input .el-form-item .el-input,.dialog-input .el-form-item .el-textarea{
    width: 70%;
}
.goods-panel {
    padding: 5px;
    border: #ccc dashed 1px;
}
.goods-panel span {
    margin: 5px;
    padding: 5px;
    border: 1px solid #d3d3d3;
    background-color: #fff;
}
.brand-block {
    margin: 5px 10px !important;
    display: inline-block;
}
.goods-panel .del {
    font-style: normal;
    color: #20a0ff;
    cursor: pointer;
}
</style>
