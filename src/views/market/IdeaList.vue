<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">营销管理 > 创意管理</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <div class="el-form-item">
                    <el-select placeholder="请选择制作人" class="select"
                        v-model="activityCreativeAuthor">
                        <el-option v-for="item in createAuthor" :key="item.userId"
                            :label="item.author" :value="item.author"></el-option>
                    </el-select>
                </div>
                <div class="el-form-item">
                    <el-select placeholder="请选择素材类型" class="select"
                        v-model="activityMaterialType">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="图片" value="1"></el-option>
                        <el-option label="链接" value="4"></el-option>
                        <el-option label="视频" value="3"></el-option>
                    </el-select>
                </div>
                <div class="el-form-item">
                    <input autocomplete="off" placeholder="搜索创意ID" v-model="activityCreativeId" type="text" class="el-form-input">
                </div>
                <div class="el-form-item">
                    <input autocomplete="off" placeholder="名称关键词" type="text" class="el-form-input"
                        v-model="name">
                </div>
                <div class="el-form-item">
                    <el-button type="primary"
                        @click.prevent="searchBtn">搜索</el-button>
                </div>
                <div class="el-form-item">
                    <el-button type="primary"
                        @click.prevent="clickAddIdealBtn">新建创意</el-button>
                </div>
            </div>
        </form>
        <div class="cr-panel">
            <el-table style="width: 100%" v-loading.body="isLoading"
                :data="idealList">
                <el-table-column type="expand">
                    <template scope="props">
                        <div class="tag-block">
                            <div class="tag-list-title">关联的活动</div>
                            <div class="tag-list">
                                <el-tag class="z-tag"
                                        v-for="item in props.row.activityDTOList" :key="item.id"
                                        type="primary" >{{item.id}} | {{ item.name }}</el-tag>
                            </div>
                        </div>
                        <div class="tag-block">
                            <div class="tag-list-title">关联设备分组</div>
                            <div class="tag-list">
                                <el-tag v-for="item in props.row.deviceGroups" :key="item.id"
                                    type="primary">{{item.id}} | {{item.name}}</el-tag>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创意id" prop="activityCreativeDetailDTO.id"></el-table-column>
                <el-table-column label="创意名称" prop="activityCreativeDetailDTO.name"></el-table-column>
                <el-table-column label="创意类型">
                    <template scope="item">
                        <p v-if="item.row.activityCreativeDetailDTO.activityMaterialType === 1">图片</p>
                        <p v-else-if="item.row.activityCreativeDetailDTO.activityMaterialType === 3">视频</p>
                        <p v-else-if="item.row.activityCreativeDetailDTO.activityMaterialType === 4">链接</p>
                    </template>
                </el-table-column>
                <el-table-column label="制作人" prop="activityCreativeDetailDTO.author"></el-table-column>
                <el-table-column label="触发类型" >
                    <template scope="prop">
                        <p v-for="item in prop.row.activityCreativeDetailDTO.triggerList" :key="prop.row.$index">{{item.triggerType==1 ? '正常轮播':item.triggerType==2?'商品条码触发':'营销活动触发'}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template scope="item">
                        <el-button class="scan-btn"
                            size="small"
                            @click.prevent.stop="scanSource(item.$index)">预览</el-button>
                        <el-button v-if="item.row.activityCreativeDetailDTO.editable"
                            size="small"
                            @click.prevent="editIdealFn(item.row.activityCreativeDetailDTO.id,item.$index)">编辑</el-button>
                        <el-button size="small" type="danger"
                            @click.prevent="showdeleteDialog(item.row.activityCreativeDetailDTO.id,item.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="m-pagination-box">
                <el-pagination
                    v-if ="pagination.totalPagination"
                    layout="total, prev, pager, next"
                    :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.totalPagination"
                    @current-change="getIdealList"></el-pagination>
            </div>
        </div>
        <el-dialog :title="ideaDiaglogTitle" :visible.sync="dialogFormVisible">
            <el-form label-width="80px">
                <el-form-item >
                    <template slot="label">
                        <span class="label-require">*</span>创意类型
                    </template>
                    <el-radio v-model="activityCreativeDTO.type"
                        :label="1">广告机广告</el-radio>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="label-require">*</span>创意名称
                    </template>
                    <el-input class="f-w80"
                        v-model="activityCreativeDTO.name"
                        :maxlength="20"></el-input>
                    <span>{{ activityCreativeDTO.name.length }}/20</span>
                </el-form-item>
                <el-form-item >
                    <template slot="label">
                        <span class="label-require">*</span>设备类型
                    </template>
                    <el-radio-group v-model="deviceTypeId"
                        @change="changeDeviceType(deviceTypeId)">
                        <el-radio class="f-mr20"
                            v-for="item in deviceTypeIds" :key="item.id"
                            :label="item.id">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="deviceTypeId">
                    <template slot="label">
                        <span class="label-require">*</span>设备分组
                    </template>
                    <el-checkbox-group v-model="deviceGroupIds" >
                        <el-checkbox v-for="item in deviceGroupList" :key="item.id"
                            :label="item.id">{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="label-require">*</span>创意配置
                    </template>
                    <el-radio-group v-model="activityMaterialDTO.type">
                        <el-radio :label="1">图片</el-radio>
                        <el-radio :label="4">链接</el-radio>
                        <el-radio :label="3">视频</el-radio>
                    </el-radio-group>
                    <div class="img-box"
                        v-if="activityMaterialDTO.type === 1">
                        <el-upload class="avatar-uploader"
                            name="fileUpload" accept="image/*"
                            :show-file-list="false" :action="picUploadUrl" :on-error="uploadPicError" :on-success="handlePicSuccess" :with-credentials="true">
                            <img class="avatar" :src="idealUrl.imageUrl"
                                v-if="idealUrl.imageUrl">
                            <i class="el-icon-plus avatar-uploader-icon"
                                v-else></i>
                        </el-upload>
                        <p class="img-tips">图片尺寸1280*800</p>
                    </div>
                    <div class="url-box"
                        v-else-if="activityMaterialDTO.type === 4">
                        <el-input placeholder="输入链接"
                            v-model="idealUrl.configUrl"></el-input>
                    </div>
                    <div v-else-if="activityMaterialDTO.type === 3">
                        <el-input placeholder="输入视频播放时长(s)" v-model="dialogTempData.vedioDuration" class="f-mb10"></el-input>
                        <el-upload class="upload-video"
                            accept="video/*" name="fileUpload"
                            :action="videoUploadUrl" :on-success="handleVideoSuccess" :on-error="uploadVideoError" :before-upload="beforeVideoUpload" :show-file-list="false" :multiple="false" :with-credentials="true" >
                            <p class="f-txt-lf"
                                v-if ="idealUrl.videoUrl">上传的视频地址： {{ idealUrl.videoUrl }}</p>
                            <p class="f-txt-lf"
                                v-if ="videoUploadStatus.videoUpload">{{ videoUploadStatus.videoTxt }}</p>
                            <el-button class="f-txt-lf">上传视频</el-button>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item v-if="showDuration">
                    <template slot="label">
                        <span class="label-require">*</span>播放时长
                    </template>
                    <el-radio-group v-model="activityCreativeDTO.duration">
                        <el-radio :label="6">6s</el-radio>
                        <el-radio :label="8">8s</el-radio>
                        <el-radio :label="10">10s</el-radio>
                        <el-radio :label="15">15s</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="label-require">*</span>触发条件
                    </template>
                    <div>
                        <el-checkbox v-model="dialogTempData.triggerNormal">正常轮播</el-checkbox>
                        <el-checkbox v-model="dialogTempData.triggerActivity">营销活动触发</el-checkbox>
                    </div>
                </el-form-item>
            </el-form>
            <div class="dialog-footer"
                slot="footer">
                <el-button @click="scanPicVideo">预 览</el-button>
                <el-button type="primary"
                    @click="submitIdealFn">确 定</el-button>
            </div>
        </el-dialog>
        <!--播放图片-->
        <el-dialog v-if="imgDialog.show" v-model="imgDialog.show"
            custom-class="ele-modal" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <div class="block">
                <div class="cr-img">
                    <img alt="广告" :src="imgDialog.src">
                </div>
            </div>
        </el-dialog>
        <!--播放视频-->
        <el-dialog v-if="videoDialog.show" v-model="videoDialog.show"
            custom-class="ele-modal" top="30%"
            :show-close="true" :close-on-click-modal="false">
            <div class="block">
                <video class="pop-video" controls="controls" :src="videoDialog.src">
                </video>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    DatePicker,
    Select,
    Option,
    Dialog,
    Button,
    Input,
    FormItem,
    Form,
    Radio,
    Checkbox,
    RadioGroup,
    CheckboxGroup,
    Upload,
    Pagination,
    MessageBox,
    Table,
    TableColumn,
    Tag,
    Loading,
} from 'element-ui';

import Util from '@/libs/util';

import { baseURL } from '@/api/HTTP';
import AuthorAPI from '@/api/Author';
import DeviceAPI from '@/api/Device';
import IdealAPI from '@/api/Idea';

Vue.use(Loading);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Tag);
Vue.use(CheckboxGroup);
Vue.use(Pagination);

let firstDeviceGroup = true;
export default {
    data() {
        return {
            isLoading: true,
            activityCreativeAuthor: null,
            createAuthor: [{
                author: '全部',
                userId: '',
            }],
            activityMaterialType: '',
            picUploadUrl: `${baseURL}/message/oss/imgUpload`,
            videoUploadUrl: `${baseURL}/message/oss/videoUpload`,
            name: '',
            // 创意的列表
            idealList: [],
            dialogFormVisible: false,
            activityCreativeId: '',
            // 创意
            activityCreativeDTO: {
                name: '',
                duration: 0,
                type: 1,
            },
            //  创意类型
            activityMaterialDTO: {
                type: 0,
                url: '',
            },
            // 视频图片的预览
            imgDialog: {
                show: false,
                src: '',
            },
            // 创意的图片，视频，素材地址
            idealUrl: {
                imageUrl: '',
                configUrl: '',
                videoUrl: '',
            },
            videoUploadStatus: {
                videoTxt: '视频上传中',
                videoUpload: false,
            },
            deviceTypeIds: [],
            deviceTypeId: 0,
            // 设备分组选中的值
            deviceGroupIds: [],
            deviceGroupList: [],
            // 编辑和添加创意的接口id，新建时为null
            operateIdealId: null,
            operateIdealIndex: null,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            videoDialog: {
                src: '',
                show: false,
            },
            ideaDiaglogTitle: '新建创意',
            firstEditBool: true,
            // 存form 表单的临时数据
            dialogTempData: {
                triggerCondition: '',
                vedioDuration: '',
                triggerActivity: false,
                triggerNormal: false,
            },
        };
    },
    mounted() {
        this.getAuthorFn();
        this.getIdealList();
    },
    methods: {
        async getAuthorFn() {
            try {
                const getIdeaAuthor = await AuthorAPI.getIdeaAuthor();
                this.createAuthor = this.createAuthor.concat(getIdeaAuthor);
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        // 改变设备类型id,获取设备分组列表
        async changeDeviceType(id) {
            if (this.operateIdealId && this.firstEditBool) {
                this.deviceGroupIds = this.idealList[this.operateIdealIndex].deviceGroups.map(item => item.id);
            } else {
                this.deviceGroupIds = [];
            }
            try {
                const DeviceGroup = await DeviceAPI.getDeviceGroupByType({
                    deviceTypeId: id,
                });

                this.deviceGroupList = DeviceGroup;
                this.firstEditBool = false;
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        searchBtn() {
            this.pagination.currentPage = 1;
            this.getIdealList();
        },
        //  获取创意的列表
        async getIdealList() {
            this.isLoading = true;
            const param = {
                activityCreativeAuthor: this.activityCreativeAuthor === '全部' ? '' : this.activityCreativeAuthor,
                activityMaterialType: this.activityMaterialType,
                name: this.name,
                pageSize: '10',
                pageNo: this.pagination.currentPage,
                activityCreativeId: this.activityCreativeId.trim(),
            };
            try {
                const ideaList = await IdealAPI.getIdeaList(param);
                this.idealList = ideaList.entry;
                this.pagination.totalPagination = ideaList.count;
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            } finally {
                this.isLoading = false;
            }
        },
        //  点击新建创意按钮
        clickAddIdealBtn() {
            this.dialogFormVisible = true;
            this.operateIdealId = null;
            this.operateIdealIndex = null;
            this.getDeviceType();
            this.dialogIdealClear();
        },
        //  获取设备类型
        async getDeviceType() {
            if (this.deviceTypeIds.length < 1) {
                try {
                    const deviceTypeIds = await DeviceAPI.getAllDeviceType();
                    this.deviceTypeIds = deviceTypeIds.entry;
                } catch (err) {
                    Util.toast(err, 'notice', 1500);
                }
            }
        },
        // 新建创意和编辑创意的公用代码
        dialogIdealOperater() {
            const activityCreativeDTO = this.activityCreativeDTO;
            const activityMaterialDTO = this.activityMaterialDTO;
            const deviceGroupIds = this.deviceGroupIds;
            const deviceTypeId = this.deviceTypeId;
            const triggerList = [];
            let materialUrl = '';
            if (this.activityMaterialDTO.type === 1) {
                materialUrl = this.idealUrl.imageUrl.replace(Util.sourceURl, '');
            } else if (this.activityMaterialDTO.type === 4) {
                materialUrl = this.idealUrl.configUrl;
            } else if (this.activityMaterialDTO.type === 3) {
                materialUrl = this.idealUrl.videoUrl.replace(Util.sourceURl, '');
                activityCreativeDTO.duration = this.dialogTempData.vedioDuration;
            }

            if (this.dialogTempData.triggerNormal) {
                triggerList.push({
                    triggerType: 1,
                    triggerCondition: '',
                });
            }
            if (this.dialogTempData.triggerActivity) {
                triggerList.push({
                    triggerType: 3,
                    triggerCondition: '',
                });
            }
            const addIdealItem = {
                activityCreativeDTO: {
                    name: activityCreativeDTO.name,
                    duration: activityCreativeDTO.duration * 1000,
                    type: 1,
                    triggerList,
                },
                activityMaterialDTO: {
                    type: activityMaterialDTO.type,
                    url: materialUrl,
                },
                deviceType: deviceTypeId,
                deviceGroupIds,
            };
            return addIdealItem;
        },
        // 新建创意时，将之前的数据清空
        dialogIdealClear() {
            this.ideaDiaglogTitle = '新建创意';
            this.activityMaterialDTO.type = '';
            this.idealUrl.imageUrl = '';
            this.idealUrl.configUrl = '';
            this.idealUrl.videoUrl = '';
            this.deviceGroupIds = [];
            this.deviceTypeId = 0;
            this.dialogTempData.vedioDuration = '';
            this.dialogTempData.triggerNormal = false;
            this.dialogTempData.triggerActivity = false;
            this.dialogTempData.triggerCondition = '';

            const addIdeaItem = {
                activityCreativeDTO: {
                    name: '',
                    duration: 0,
                    type: 1,
                },
                activityMaterialDTO: {
                    type: '',
                    url: '',
                },
                deviceGroupIds: [],
            };
            this.activityCreativeDTO = addIdeaItem.activityCreativeDTO;
            this.activityMaterialDTO = addIdeaItem.activityMaterialDTO;
        },
        //  新建创意
        async submitIdealFn() {
            let addIdealItem;
            let IdeaOperator = '';
            if (!this.activityCreativeDTO.name) {
                Util.toast('创意名字不能为空', 'notice', 1500);
                return false;
            }
            if (!this.deviceTypeId) {
                Util.toast('设备类型必选', 'notice', 1500);
                return false;
            }
            if (!this.deviceGroupIds.length) {
                Util.toast('设备分组必选', 'notice', 1500);
                return false;
            }
            if (!this.activityMaterialDTO.type) {
                Util.toast('创意配置必选', 'notice', 1500);
                return false;
            }
            if (this.activityMaterialDTO.type === 1 && !this.idealUrl.imageUrl) {
                Util.toast('请上传图片', 'notice', 1500);
                return false;
            } else if (this.activityMaterialDTO.type === 4) {
                if (!this.idealUrl.configUrl) {
                    Util.toast('请填写素材链接', 'notice', 1500);
                    return false;
                }
                const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
                if (!reg.test(this.idealUrl.configUrl)) {
                    Util.toast('请填写正确的素材链接', 'notice', 1500);
                    return false;
                }
            } else if (this.activityMaterialDTO.type === 3) {
                if (!this.dialogTempData.vedioDuration) {
                    Util.toast('请填写视频播放时长', 'notice', 1500);
                    return false;
                }
                if (!this.idealUrl.videoUrl) {
                    Util.toast('请上传视频', 'notice', 1500);
                    return false;
                }
            }
            if (!this.activityCreativeDTO.duration && this.showDuration) {
                Util.toast('播放时长必选', 'notice', 1500);
                return false;
            }

            if (!this.dialogTempData.triggerNormal  && !this.dialogTempData.triggerActivity) {
                Util.toast('触发条件至少选填一个', 'notice', 1500);
                return false;
            }

            try {
                if (this.operateIdealId) {
                    addIdealItem = this.dialogIdealOperater();
                    addIdealItem.activityCreativeDTO.id = this.operateIdealId;
                    IdeaOperator = await IdealAPI.updateIdea(addIdealItem);
                } else {
                    addIdealItem = this.dialogIdealOperater();
                    IdeaOperator = await IdealAPI.addIdea(addIdealItem);
                }
                if (IdeaOperator) {
                    this.getIdealList();
                    this.dialogFormVisible = false;
                }
            } catch (err) {
                this.dialogFormVisible = false;
                Util.toast(err, 'notice', 1500);
            }
            return false;
        },
        // 删除创意
        showdeleteDialog(id, index) {
            const deleteIDealFn = this.deleteIDealFn;
            MessageBox.confirm('您确定要删除该创意吗？', '提示', {
                confirmButtonText: '确定',
                cancelButactivityCreativeDetailDTOtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteIDealFn(id, index);
            }).catch(() => {});
        },
        // 删除创意
        async deleteIDealFn(id, index) {
            let deleteIdeal;
            try {
                deleteIdeal = await IdealAPI.deleteIdea({
                    activityCreativeId: id,
                });
                if (deleteIdeal) {
                    this.idealList.splice(index, 1);
                }
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        // 编辑创意
        editIdealFn(id, index) {
            this.ideaDiaglogTitle = '编辑创意';
            this.firstEditBool = true;
            this.operateIdealId = id;
            this.operateIdealIndex = index;
            const ideaItem = this.idealList[index];
            if (!this.deviceTypeId) {
                this.getDeviceType();
            }
            this.deviceTypeId = ideaItem.deviceType.id;
            if (firstDeviceGroup) {
                this.changeDeviceType(this.deviceTypeId);
                firstDeviceGroup = false;
            }

            this.activityCreativeDTO = Object.assign({}, ideaItem.activityCreativeDetailDTO);
            this.activityMaterialDTO.type = ideaItem.activityCreativeDetailDTO.activityMaterialType;
            const ideallMateryUrl = ideaItem.activityCreativeDetailDTO.activityMaterialUrl;

            if (this.activityMaterialDTO.type === 1) {
                this.idealUrl.imageUrl = Util.sourceURl + ideallMateryUrl || '';
                this.idealUrl.configUrl = '';
                this.idealUrl.videoUrl = '';
            } else if (this.activityMaterialDTO.type === 4) {
                this.idealUrl.configUrl = ideallMateryUrl || '';
                this.idealUrl.imageUrl = '';
                this.idealUrl.videoUrl = '';
            } else if (this.activityMaterialDTO.type === 3) {
                this.idealUrl.videoUrl = Util.sourceURl + ideallMateryUrl || '';
                this.idealUrl.imageUrl = '';
                this.idealUrl.configUrl = '';
                this.dialogTempData.vedioDuration = this.idealList[index].activityCreativeDetailDTO.duration / 1000;
            }
            this.activityCreativeDTO.duration = ideaItem.activityCreativeDetailDTO.duration / 1000;
            // 默认为都不填
            this.dialogTempData.triggerNormal = false;
            this.dialogTempData.triggerActivity = false;
            this.dialogTempData.triggerCondition = '';
            if (this.activityCreativeDTO.triggerList.length > 0) {
                for (let i = 0; i < this.activityCreativeDTO.triggerList.length; i += 1) {
                    if (this.activityCreativeDTO.triggerList[i].triggerType === 1) {
                        this.dialogTempData.triggerNormal = true;
                    }
                    if (this.activityCreativeDTO.triggerList[i].triggerType === 3) {
                        this.dialogTempData.triggerActivity = true;
                    }
                }
            }
            this.dialogFormVisible = true;
        },
        // 上传图片成功
        beforeVideoUpload() {
            this.videoUploadStatus.videoUpload = true;
            this.videoUploadStatus.videoTxt = '视频上传中';
        },
        handlePicSuccess(response) {
            if (response.status) {
                this.idealUrl.imageUrl = Util.sourceURl + response.entry[0];
            } else {
                Util.toast(response, 'notice', 1500);
            }
        },
        // 上传图片失败
        uploadPicError() {
            Util.toast('图片上传失败,请重试', 'notice', 1500);
        },
        // 上传视频成功
        handleVideoSuccess(response) {
            this.videoUploadStatus.videoUpload = false;
            this.idealUrl.videoUrl = Util.sourceURl + response.entry[0];
        },
        // 上传视频失败
        uploadVideoError() {
            this.videoUploadStatus.videoTxt = '视频上传失败';
            Util.toast('视频上传失败,请重试', 'notice', 1500);
        },
        // 查看图片,视频
        scanSource(idx) {
            this.operateIdealIndex = idx;
            const url = this.idealList[idx].activityCreativeDetailDTO.activityMaterialUrl;
            const type = this.idealList[idx].activityCreativeDetailDTO.activityMaterialType;
            this.showPicVideo(url, type);
        },
        // 把对图片和视频的播放在函数中
        showPicVideo(url, type) {
            const newurl = url.replace(Util.sourceURl, '');
            if (type === 1) {
                this.imgDialog.show = true;
                this.imgDialog.src = Util.sourceURl + newurl;
            } else if (type === 3) {
                this.videoDialog.src = Util.sourceURl + newurl;
                this.videoDialog.show = true;
            } else if (type === 4) {
                window.open(newurl);
            }
        },
        // 浏览图片和视频
        scanPicVideo() {
            let url = '';
            let type = 1;
            if (this.activityMaterialDTO.type === 1) {
                url = this.idealUrl.imageUrl;
                if (!url) {
                    Util.toast('请上传图片后预览', 'notice', 1500);
                    return false;
                }
                type = 1;
            } else if (this.activityMaterialDTO.type === 3) {
                url = this.idealUrl.videoUrl;
                if (!url) {
                    Util.toast('请上传视频后预览', 'notice', 1500);
                    return false;
                }
                type = 3;
            } else if (this.activityMaterialDTO.type === 4) {
                url = this.idealUrl.configUrl;
                if (!url) {
                    Util.toast('请先填写链接地址', 'notice', 1500);
                    return false;
                }
                type = 4;
            } else {
                Util.toast('请先选择创意配置', 'notice', 1500);
                return false;
            }
            this.showPicVideo(url, type);
            return true;
        },
    },
    computed: {
        showDuration() {
            const show = this.activityMaterialDTO.type === 3;
            if (show) {
                this.activityCreativeDTO.duration = 0;
            }
            return !show;
        },
        'activityCreativeDTO.triggerList': function () {
            const triggle = [];
            if (this.dialogTempData.triggerNormal) {
                triggle.push(1);
            }
            if (this.dialogTempData.triggerActivity) {
                triggle.push(3);
            }
            return triggle;
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

.pop-video {
    display:block;
    max-width:100%;
    max-height:100%;
}
.avatar-uploader .el-upload {
    border:1px dashed #d9d9d9;
    border-radius:6px;
    cursor:pointer;
    position:relative;
    overflow:hidden;
}
.avatar-uploader .el-upload:hover {
    border-color:#20a0ff;
}
.avatar-uploader-icon {
    font-size:28px;
    color:#8c939d;
    width:118px;
    height:118px;
    line-height:118px !important;
    text-align:center;
}
.label-require{
    color: #f00 !important;
}
.avatar {
    width:118px;
    height:118px;
    display:block;
}
.videoact {
    width:98%;
}
.ele-modal .el-dialog__body {
    padding-top:20px;
}
.cr-img img {
    max-width:100%;
    max-height:100%;
}
.z-tag {
    display: inline-block !important;
    margin: 5px 10px !important;
}
</style>
