<template>
    <div class="cr-page-content"
        v-loading.fullscreen.lock="isLoading"
        :element-loading-text="loadingMessage">
        <h2 class="cr-page-title">
            <span class="shoplist"
                @click="toShopList">店铺管理 </span>> 店铺详情</h2>
        <div class="cr-panel">
            <el-form ref="form"
                label-width="140px"
                :model="form" :rules="rules">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="店铺信息" name="1">
                        <el-form-item prop="shopName"
                            label="店铺名称">
                            <el-input class="style-input" placeholder="请输入店铺名称"
                                v-model="form.shopName"></el-input>
                        </el-form-item>
                        <el-form-item prop="cityCode"
                            label="所在城市">
                            <el-cascader placeholder="请选择所在城市"
                                v-model="form.cityNumber"
                                expand-trigger="hover"
                                :options="cityCodeData" :props="cityCodeProps"></el-cascader>
                        </el-form-item>
                        <el-form-item prop="address"
                            label="店铺地址">
                            <el-input class="style-input" placeholder="请输入店铺地址"
                                v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="店铺类型">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.shopType"></el-input>
                        </el-form-item>
                        <el-form-item label="店铺分组">
                            <el-cascader class="style-input" placeholder="店铺分组"
                                v-model="form.shopGroupNumber"
                                expand-trigger="hover"
                                :options="shopGroups" :change-on-select="true"
                                @change="changeShopGroup"></el-cascader>
                        </el-form-item>
                        <el-form-item label="经营范围">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.businessScope"></el-input>
                        </el-form-item>
                        <el-form-item label="经度，纬度">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.location"></el-input>
                        </el-form-item>
                        <el-form-item label="店铺面积">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.shopArea"></el-input>
                        </el-form-item>
                        <el-form-item label="看店人数">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.shopMemberCount"></el-input>
                        </el-form-item>
                        <el-form-item label="收银台数">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.shopCashierCount"></el-input>
                        </el-form-item>
                        <el-form-item label="店铺开通的功能">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.shopFunction"></el-input>
                        </el-form-item>
                        <el-form-item label="OM">
                            <el-input class="style-input" placeholder="暂无信息" disabled
                                v-model="form.OM"></el-input>
                        </el-form-item>
                        <el-form-item label="营业执照">
                            <el-upload class="upload-img" :disabled="upload.businessLicenseImage.disable"
                                :multiple="true" :action="uploadUrl" :name="fileUploadName" :accept="fileType" :with-credentials="true" :on-success="uploadSuccess1">
                                <el-button slot="trigger"
                                    size="small" type="primary">上传图片</el-button>
                            </el-upload>
                            <div class="image-preview">
                                <div class="img-container"
                                     v-for="(url,index) in upload.businessLicenseImage.urlArr" :key="url"
                                     @click="deleteImage(index,'businessLicenseImage')">
                                    <img :src="url">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="门头图">
                            <el-upload class="upload-img" :disabled="upload.shopOutsideImage.disable"
                                :multiple="true" :action="uploadUrl" :name="fileUploadName" :accept="fileType" :with-credentials="true" :on-success="uploadSuccess2">
                                <el-button slot="trigger"
                                    size="small" type="primary">上传图片</el-button>
                            </el-upload>
                            <div class="image-preview">
                                <div class="img-container"
                                     v-for="(url,index) in upload.shopOutsideImage.urlArr" :key="url"
                                     @click="deleteImage(index,'shopOutsideImage')">
                                    <img :src="url">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="室内图">
                            <el-upload class="upload-img" :disabled="upload.shopInsideImage.disable"
                                :multiple="true" :action="uploadUrl" :name="fileUploadName" :accept="fileType" :with-credentials="true" :on-success="uploadSuccess3">
                                <el-button slot="trigger"
                                    size="small" type="primary">上传图片</el-button>
                            </el-upload>
                            <div class="image-preview">
                                <div class="img-container"
                                    v-for="(url,index) in upload.shopInsideImage.urlArr" :key="url"
                                    @click="deleteImage(index,'shopInsideImage')">
                                    <img :src="url">
                                </div>
                            </div>
                        </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="支付信息" name="2">
                        <el-form-item style="font-weight:bolder;"
                            label="支付宝绑定">
                            <mark>{{ form.hasAliPay }}</mark>
                        </el-form-item>
                        <el-form-item style="font-weight:bolder;"
                            label="南粤银行">
                            <mark>{{ form.hasNanYue }}</mark>
                        </el-form-item>
                        <el-form-item style="font-weight:bolder;"
                            label="微信">
                            <el-button type="warning" :disabled="form.disableWeChatPayButton"
                                @click="openUpWeChatPay"
                                >{{form.weChatPayState}}</el-button>
                        </el-form-item>
                        <el-form-item v-if="!form.disableWeChatPay" prop="bankCardNo"
                            label="银行账号">
                            <el-input class="style-input" placeholder="请输入银行账号"
                                v-model="form.bankCardNo"
                                :maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item v-if="!form.disableWeChatPay"
                            label="开户银行" prop="bankName">
                            <el-autocomplete class="style-input" placeholder="请选择开户银行"
                                v-model="form.bankName"
                                :fetch-suggestions="querySearchBank"></el-autocomplete>
                        </el-form-item>
                        <el-form-item v-if="!form.disableWeChatPay"
                            label="开户城市" prop="cityName">
                            <el-cascader placeholder="请选择开户城市"
                                v-model="form.placeFullName"
                                expand-trigger="hover"
                                :options="placeData" :props="placeProps"></el-cascader>
                        </el-form-item>
                        <el-form-item v-if="!form.disableWeChatPay"
                            label="开户支行" prop="bankBranchName">
                            <el-input class="style-input" placeholder="请输入开户支行"
                                v-model="form.bankBranchName"
                                :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item v-if="!form.disableWeChatPay"
                            label="微信支付子商户号">
                            <el-input class="style-input" placeholder="请输入微信支付子商户号"
                                v-model="form.subInfo"></el-input>
                        </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="店主信息" name="3">
                        <el-form-item label="店主姓名" prop="ownerName">
                            <el-input class="style-input" placeholder="请输入店主姓名" :disabled="true"
                                v-model="form.ownerName"></el-input>
                        </el-form-item>
                        <el-form-item label="店主手机号">
                            <el-input class="style-input" :disabled="true" :placeholder="form.mobile?form.mobile:'未填手机号'"></el-input>
                        </el-form-item>
                        <el-form-item label="店主身份证号" prop="ownerSocialId">
                            <el-input class="style-input" placeholder="请输入店主身份证号" :disabled="true"
                                v-model="form.ownerSocialId"
                                :maxlength="18"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证正面图">
                            <el-upload class="upload-img" :disabled="upload.idCardFrontImage.disable"
                                :action="uploadUrl" :name="fileUploadName" :accept="fileType" :with-credentials="true" :on-success="uploadSuccess4">
                                <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
                            </el-upload>
                            <div class="image-preview">
                                <div class="img-container"
                                    v-for="(url,index) in upload.idCardFrontImage.urlArr" :key="url"
                                    @click="deleteImage(index,'idCardFrontImage')">
                                    <img :src="url">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="身份证反面图">
                            <el-upload class="upload-img" :disabled="upload.idCardBackImage.disable"
                                :action="uploadUrl" :name="fileUploadName" :accept="fileType" :with-credentials="true" :on-success="uploadSuccess5" :show-file-list="false">
                                <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
                            </el-upload>
                            <div class="image-preview">
                                <div class="img-container"
                                    v-for="(url,index) in upload.idCardBackImage.urlArr" :key="url"
                                    @click="deleteImage(index,'idCardBackImage')">
                                    <img :src="url">
                                </div>
                            </div>
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
                <el-form-item class="submit">
                    <el-button class="save"
                        type="primary"
                        @click="onSubmit('form')">保存</el-button>
                    <el-button class="cancel"
                        @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Form,
    Button,
    FormItem,
    Input,
    Upload,
    Loading,
    Cascader,
    Autocomplete,
    Collapse,
    CollapseItem,
    Message,
} from 'element-ui';

import Util from '@/libs/util';
import cityCodeDB from '@/assets/cityCodeDB';
import bankDB from '@/assets/bankDB';

import { baseURL } from '@/api/HTTP';
import ShopAPI from '@/api/Shop';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Autocomplete);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Cascader);

Vue.prototype.$message = Message;

export default {
    data() {
        return {
            activeNames: ['1'],
            shopGroups: [],
            isLoading: true,
            loadingMessage: '拼命加载中',
            cityCodeData: cityCodeDB,
            cityCodeProps: {
                value: 'adcode',
                label: 'name',
                children: 'districts',
            },
            placeData: cityCodeDB,
            placeProps: {
                value: 'adcode',
                label: 'name',
                children: 'districts',
            },
            bankData: bankDB,
            form: {
                userId: '',
                // 店铺相关
                shopName: '', // 店铺名称
                cityNumber: [], // 缓存店铺所在城市编码
                provinceCode: '', // 省的编码
                cityCode: '', // 城市的编码
                city: '',
                address: '', // 店铺具体地址
                businessLicenseUrl: '', // 营业执照图
                gateUrl: '', // 门头图
                indoorUrl: '', // 室内图
                // 店铺相关，静态信息
                shopType: '', // 店铺类型
                shopTypeId: '', // type id
                shopGroup: '', // 店铺分组
                businessScope: '', // 店铺经营范围
                location: '', // 店铺经纬度
                shopArea: '', // 店铺面积
                shopMemberCount: '', // 店铺工作人员数目
                shopCashierCount: '', // 店铺收银台数目
                shopFunction: '', // 店铺开通的功能
                OM: '', // 店铺负责人（公司内部人） OM 是运营经理
                shopGroupNumber: [],
                shopGroupId: '',
                // 支付相关
                hasAliPay: '暂未绑定', // 是否已经绑定支付宝
                hasNanYue: '暂未绑定', // 是否绑定南粤银行
                disableWeChatPay: false, // 是否禁用微信支付相关选项框
                disableWeChatPayButton: false, // 是否禁用微信支付按钮
                weChatPayState: '开通微信支付',
                readyToUseWeChat: false,
                bankName: '', // 银行名称
                bankCardNo: '', // 银行卡号
                placeFullName: [], // 缓存开户城市编码
                proName: '', // 开户银行所在省份 - 编码
                cityName: '', // 开户银行所在城市 - 编码
                bankBranchName: '', // 银行支行名称
                subInfo: '', // 子商户号
                // 店主相关
                ownerName: '', // 店主姓名
                mobile: '', // 店主手机号
                ownerSocialId: '', // 店主身份证号
                socialImage: '', // 身份证正面照
                socialImageBack: '', // 身份证反面照
            },
            rules: {
                shopName: [
                    {
                        required: true,
                        message: '店铺名称不能为空',
                        trigger: 'blur',
                    },
                ],
                cityCode: [
                    {
                        required: true,
                        message: '所在城市不能为空',
                        trigger: 'blur',
                    },
                ],
                address: [
                    {
                        required: true,
                        message: '店铺地址不能为空',
                        trigger: 'blur',
                    },
                ],
                ownerName: [
                    {
                        required: false,
                        message: '店主姓名不能为空',
                        trigger: 'blur',
                    },
                ],
                ownerSocialId: [
                    {
                        required: false,
                        message: '身份证号不能为空',
                        trigger: 'blur',
                    },
                    {
                        min: 18,
                        max: 18,
                        message: '请输入有效的18位身份证号～',
                        trigger: 'blur',
                    },
                ],
            },
            file: '',
            cdnUrl: 'http://cdn.elephtribe.com/',
            fileUploadName: 'fileUpload',
            fileType: '.png,.jpg,.jpeg',
            upload: {
                businessLicenseImage: {
                    disable: false,
                    urlArr: [],
                },
                shopOutsideImage: {
                    disable: false,
                    urlArr: [],
                },
                shopInsideImage: {
                    disable: false,
                    urlArr: [],
                },
                idCardFrontImage: {
                    disable: false,
                    urlArr: [],
                },
                idCardBackImage: {
                    disable: false,
                    urlArr: [],
                },
            },
            uploadUrl: `${baseURL}/message/oss/imgUpload`,
        };
    },
    async mounted() {
        // 获取店铺分组信息
        try {
            const entry = await ShopAPI.getShopGroup();
            entry.forEach((el) => {
                const obj = {};
                obj.label = el.name;
                obj.value = el.id;
                obj.children = [];

                el.list.forEach((ele) => {
                    const o = {};

                    o.label = ele.name;
                    o.value = ele.id;
                    obj.children.push(o);
                });

                if (obj.children.length === 0) {
                    delete obj.children;
                }

                this.shopGroups.push(obj);
            });
        } catch (err) {
            Message.error({
                message: err,
                duration: 2000,
            });
        } finally {
            this.isLoading = false;
        }

        if (Util.getUrlParam('id')) {
            this.getShopDetail(Util.getUrlParam('id'));
        } else {
            Util.toast('出错了', 'failed', 1000);
            this.isLoading = false;
            setTimeout(() => {
                window.history.go(-1);
            }, 1000);
        }
    },
    methods: {
        deleteImage(index, type) {
            if (window.confirm('确认删除这张图片吗？')) {
                this.upload[type].urlArr.splice(index, 1);
            }
        },
        toShopList() {
            window.location.href = './list.html';
        },
        changeShopGroup(argument) {
            if (argument.length === 1) {
                this.form.shopGroupId = argument[0];
            }
            if (argument.length === 2) {
                this.form.shopGroupId = argument[1];
            }
        },
        // 获取店铺详情
        async getShopDetail(shopID) {
            let entry = {};
            try {
                entry = await ShopAPI.queryShopByShopId({
                    id: shopID,
                });
            } catch (err) {
                Util.toast(err, 'failed', 2000);
            } finally {
                this.isLoading = false;
            }
            // 将店铺信息展示到当前页面
            const [userData, payData, [imgData]] = entry;

            this.form.userId = userData.userId;
            this.form.shopId = userData.id;
            this.form.shopName = userData.shopName;
            this.form.cityNumber = [userData.provinceCode.toString(), userData.cityCode.toString()];
            this.form.address = userData.address;
            this.form.ownerName = userData.ownerName;
            this.form.mobile = userData.mobile;
            this.form.ownerSocialId = userData.ownerSocialId;
            // 获取店铺的静态信息
            this.form.shopTypeId = userData.type;
            if (userData.type === 1) {
                this.form.shopType = '普通店铺';
            } else if (userData.type === 2) {
                this.form.shopType = '品牌店铺';
            } else {
                this.form.shopType = '暂无';
            }

            this.form.shopGroup = userData.shopGroupName;

            this.shopGroups.find((el) => {
                if (el.label === this.form.shopGroup) {
                    this.form.shopGroupNumber.push(el.value);
                    this.form.shopGroupId = el.value;
                    return true;
                }
                if (el.children) {
                    el.children.find((ell) => {
                        if (ell.label === this.form.shopGroup) {
                            this.form.shopGroupNumber.push(el.value, ell.value);
                            this.form.shopGroupId = ell.value;
                            return true;
                        }
                        return false;
                    });
                }
                return false;
            });

            if (userData.businessScope === 1) {
                this.form.businessScope = '便利店';
            } else if (userData.businessScope === 2) {
                this.form.businessScope = '餐饮';
            } else {
                this.form.businessScope = '暂无';
            }

            this.form.location = `[ ${userData.longitudeGD} , ${userData.latitudeGD} ]`;
            this.form.shopArea = userData.shopAcreage;
            this.form.shopMemberCount = userData.guardNum;
            this.form.shopCashierCount = userData.checkoutCounterNum;

            const bit = (num, index) => {
                const key = 1 << index;
                return key === (num && key);
            };
            const arrStr = ['', '有UI', ',有pos插件', ',支持广告', ',有POS监控'];

            arrStr.forEach((item, key) => {
                if (bit(userData.bitFate, key + 1)) {
                    this.form.shopFunction += item;
                }
            });

            if (!this.form.shopFunction.length) {
                this.form.shopFunction = '暂无';
            }
            this.form.OM = userData.xiaoerName; // 暂时为空
            // 支付宝是否已绑定
            if (payData.bankAlipayBindDTO) {
                this.form.hasAliPay = '已绑定';
            }
            // 南粤银行是否已绑定
            if (payData.nyAccountDTO) {
                this.form.hasNanYue = '已绑定';
            }
            // 是否有微信支付相关信息
            if (payData.weChatPayDTO) {
                this.form.readyToUseWeChat = true;
                this.form.weChatPayState = '开通中';
                this.regRules.call(this);
                if (payData.subInfo) {
                    this.form.weChatPayState = '已开通';
                    this.form.subInfo = payData.subInfo;
                }
                this.form.disableWeChatPayButton = true;
                this.form.disableWeChatPay = false;
                this.form.bankCardNo = payData.weChatPayDTO.bankCardNo;
                this.form.bankName = payData.weChatPayDTO.bankName;
                this.form.placeFullName = [payData.weChatPayDTO.proName.toString(), payData.weChatPayDTO.cityName.toString()];
                this.form.bankBranchName = payData.bankBranch;
            } else {
                this.form.disableWeChatPay = true;
            }
            if (imgData) {
                // 接受图片信息
                this.form.businessLicenseUrl = imgData.businessLicenseUrl;
                this.form.gateUrl = imgData.gateUrl;
                this.form.indoorUrl = imgData.indoorUrl;
                this.form.socialImage = imgData.socialImage;
                this.form.socialImageBack = imgData.socialImageBack;
                // 针对身份证图片有无决定是否禁用上传按钮
                if (imgData.socialImage) {
                    this.upload.idCardFrontImage.disable = true;
                }
                if (imgData.socialImageBack) {
                    this.upload.idCardBackImage.disable = true;
                }
                // 将图片信息传入渲染数组，显示在页面上
                const pushImage = (type, uploadType) => {
                    imgData[type].split(',').forEach((el) => {
                        if (el) {
                            const url = this.cdnUrl + el;
                            this.upload[uploadType].urlArr.push(url);
                        }
                    });
                };
                pushImage('businessLicenseUrl', 'businessLicenseImage');
                pushImage('gateUrl', 'shopOutsideImage');
                pushImage('indoorUrl', 'shopInsideImage');
                pushImage('socialImage', 'idCardFrontImage');
                pushImage('socialImageBack', 'idCardBackImage');
            }
        },
        querySearchBank(queryString, cb) {
            const bankList = this.bankData;
            const results = queryString ? bankList.filter(this.createFilter(queryString)) : bankList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return a => a.value.indexOf(queryString.toLowerCase()) === 0;
        },
        openUpWeChatPay() {
            this.form.weChatPayState = '开通中';
            this.form.disableWeChatPayButton = true;
            this.form.disableWeChatPay = false;
            this.form.readyToUseWeChat = true;

            this.regRules.call(this);
        },
        regRules() {
            // 注册开通微信支付时的那四项的验证规则
            this.$set(this.rules, 'bankCardNo', [
                {
                    required: true,
                    message: '银行账号不能为空',
                    trigger: 'blur',
                },
            ]);
            this.$set(this.rules, 'bankName', [
                {
                    required: true,
                    message: '银行名称不能为空',
                    trigger: 'blur',
                },
            ]);
            this.$set(this.rules, 'cityName', [
                {
                    required: true,
                    message: '开户城市不能为空',
                    trigger: 'blur',
                },
            ]);
            this.$set(this.rules, 'bankBranchName', [
                {
                    required: true,
                    message: '开户支行不能为空',
                    trigger: 'blur',
                },
            ]);
        },
        uploadSuccess1(response) {
            const current = this.upload.businessLicenseImage;
            const url = this.cdnUrl + response.entry[0];

            current.urlArr.push(url);

            if (this.businessLicenseUrl) {
                this.businessLicenseUrl += `,${response.entry[0]}`;
            } else {
                this.businessLicenseUrl = response.entry[0];
            }
        },
        uploadSuccess2(response) {
            const current = this.upload.shopOutsideImage;
            const url = this.cdnUrl + response.entry[0];

            current.urlArr.push(url);

            if (this.gateUrl) {
                this.gateUrl += `,${response.entry[0]}`;
            } else {
                this.gateUrl = response.entry[0];
            }
        },
        uploadSuccess3(response) {
            const current = this.upload.shopInsideImage;
            const url = this.cdnUrl + response.entry[0];

            current.urlArr.push(url);

            if (this.indoorUrl) {
                this.indoorUrl += `,${response.entry[0]}`;
            } else {
                this.indoorUrl = response.entry[0];
            }
        },
        uploadSuccess4(response) {
            const current = this.upload.idCardFrontImage;
            const url = this.cdnUrl + response.entry[0];

            current.disable = true;
            current.urlArr.push(url);

            this.socialImage = response.entry[0];
        },
        uploadSuccess5(response) {
            const current = this.upload.idCardBackImage;
            const url = this.cdnUrl + response.entry[0];

            current.disable = true;
            current.urlArr.push(url);

            this.socialImageBack = response.entry[0];
        },
        // 提交所有数据
        onSubmit(formName) {
            // 室内图必须有3张以上
            if (this.form.indoorUrl) {
                if (this.form.indoorUrl.split(',').length > 9) {
                    Util.toast('室内图要求 8 张以下～', 'failed', 2000);
                    return false;
                } else if (this.form.indoorUrl.split(',').length < 4) {
                    Util.toast('室内图要求 3 张以上～', 'failed', 2000);
                    return false;
                }
            }
            this.$refs[formName].validate(async (valid) => {
                if (!valid) {
                    Util.toast('请完善表单～', 'failed', 2000);
                    return false;
                }
                this.isLoading = true;
                this.loadingMessage = '表单提交中～';

                try {
                    const message = await ShopAPI.updateShopByKeys({
                        type: this.form.shopTypeId,
                        userId: this.form.userId,
                        // 店铺相关
                        id: this.form.shopId,
                        shopName: this.form.shopName,
                        provinceCode: this.form.provinceCode,
                        cityCode: this.form.cityCode,
                        city: this.form.city,
                        address: this.form.address,
                        businessLicenseUrl: this.form.businessLicenseUrl,
                        gateUrl: this.form.gateUrl,
                        indoorUrl: this.form.indoorUrl,
                        shopGroupId: this.form.shopGroupId,
                        // 支付相关
                        bankCardNo: this.form.bankCardNo,
                        bankName: this.form.bankName,
                        proName: this.form.proName,
                        cityName: this.form.cityName,
                        bankBranch: this.form.bankBranchName,
                        subInfo: this.form.subInfo,
                        // 店主相关
                        ownerName: this.form.ownerName,
                        mobile: this.form.mobile,
                        ownerSocialId: this.form.ownerSocialId,
                        socialImage: this.form.socialImage,
                        socialImageBack: this.form.socialImageBack,
                    });
                    Util.toast(message, 'succeed', 2000);
                } catch (err) {
                    Util.toast(err, 'failed', 2000);
                } finally {
                    this.isLoading = false;
                }
                return true;
            });
            return true;
        },
        onCancel() {
            window.history.go(-1);
        },
    },

    watch: {
        'form.cityNumber': function () {
            this.form.provinceCode = (this.form.cityNumber && this.form.cityNumber[0]) || '';
            this.form.cityCode = (this.form.cityNumber && this.form.cityNumber[1]) || '';
            cityCodeDB.forEach((el) => {
                if (el.adcode === this.form.provinceCode) {
                    el.districts.forEach((item) => {
                        if (item.adcode === this.form.cityCode) {
                            this.form.city = item.name;
                        }
                    });
                }
            });
        },
        'form.placeFullName': function () {
            this.form.proName = this.form.placeFullName[0];
            this.form.cityName = this.form.placeFullName[1];
        },
        upload: {
            handler() {
                // 针对身份证图片有无决定是否禁用上传按钮
                if (this.upload.idCardFrontImage.urlArr.length) {
                    this.upload.idCardFrontImage.disable = true;
                } else {
                    this.upload.idCardFrontImage.disable = false;
                }
                if (this.upload.idCardBackImage.urlArr.length) {
                    this.upload.idCardBackImage.disable = true;
                } else {
                    this.upload.idCardBackImage.disable = false;
                }
                // 更新 form 中保存的图片信息
                const pushImage = (type, uploadType) => {
                    let temp = '';
                    this.upload[uploadType].urlArr.forEach((el) => {
                        temp += `${el.replace(this.cdnUrl, '')},`;
                    });
                    this.form[type] = temp;
                };
                pushImage('businessLicenseUrl', 'businessLicenseImage');
                pushImage('gateUrl', 'shopOutsideImage');
                pushImage('indoorUrl', 'shopInsideImage');
                pushImage('socialImage', 'idCardFrontImage');
                pushImage('socialImageBack', 'idCardBackImage');
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
@import '../../assets/common';

.submit .el-form-item__content {
    margin: 0 !important;
    width: auto !important;
}

.shoplist {
    cursor: pointer;
    color: #666;
}

.shoplist:hover {
    color: #333;
}

.submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
}

.style-input {
    width: 400px;
}

.image-preview {
    width: 100%;
}

.img-container {
    position: relative;
    display: inline-block;
    margin: 20px;
    width: 300px;
    height: 230px;
}

.img-container img {
    width: 100%
}

.img-container:hover img {

    opacity: 0.3;
}

.img-container:hover {
    cursor: pointer;
}

.img-container:hover::before {
    content: '点击删除图片';
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
    color: #FFF;
    font-size: 1.4em;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-collapse-item__wrap {
    padding: 30px 0 0;
    background: #DADCDB;
}

.el-collapse-item__header {
    font-weight: bold;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
}
</style>
