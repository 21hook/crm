<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">
            <a class="link" href="activityList.html" >活动管理</a> / {{pageTitle}}</h2>
        <div class="cr-panel">
            <el-form class="demo-ruleForm"
                ref="form"
                label-width="100px"
                :model="form">
                <el-form-item style="width:300px;position:relative"
                    label="活动名称" prop="activityName">
                    <el-input type="text"
                        v-model="form.activityName"
                        :maxlength="20"></el-input>
                    <span style="position:absolute;z-index:1;top:0;left:230px;">{{ form.activityName.length }}/20</span>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-col :span="5">
                        <el-date-picker placeholder="请选择日期范围" style="width: 100%"
                            v-model="form.dateArr"
                            type="daterange"
                            @change="getDateRange"
                            ></el-date-picker>
                    </el-col>
                    <el-col class="line"
                            :span="1"> &nbsp; </el-col>
                    <el-col :span="5">
                        <el-time-picker placeholder="请选择时间范围" style="width: 100%;"
                            v-model="form.timeArr"
                            is-range
                            @change="getTimeRange"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="活动店铺" prop="pass">
                    <el-button type="primary" size="small" icon="plus"
                               @click="addShops">添加店铺</el-button>
                    <el-button type="danger" size="small">已选中 {{ shopCheckedNum }} 个店铺</el-button>
                    <div class="shop-list">
                        <el-tag v-for="shopObj,index in shops" :key="index"
                            type="primary"
                            :closable="true"
                            @close="removeOneShop">{{ shopObj.id+' '+shopObj.shopName }}</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="创意关联" prop="pass">
                    <el-button type="primary" size="small" icon="plus"
                               @click="addIdeas">添加创意</el-button>
                    <el-button type="danger" size="small">已关联 {{ ideaCheckedNum }} 个创意</el-button>
                    <div class="shop-list">
                        <el-tag v-for="ideaObj,index in ideas" :key="index"
                            type="primary"
                            :closable="true"
                            @close="removeOneIdea">{{ ideaObj.name }}</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label-width="100px">
                    <el-button style="width:80px"
                        type="primary"
                        @click="submitForm">保存</el-button>
                </el-form-item>
            </el-form>
            <el-dialog title="请选择店铺添加方式" size="tiny"
                :visible.sync="dialog.d1" :close-on-click-modal="false">
                <div class="dialog1-buttons">
                   <!--  <el-button type="primary"
                        @click.native="importMethod1">批量导入店铺</el-button>
                    <br> -->
                    <el-button type="primary"
                        @click.native="importMethod2">筛选添加店铺</el-button>
                    <br>
                    <el-button type="primary"
                        @click.native="importMethod3">搜索添加店铺</el-button>
                    <br>
                </div>
            </el-dialog>
            <el-dialog title="批量导入" size="tiny"
                :visible.sync="dialog.d2" :close-on-click-modal="false">
                <div class="dialog2-buttons">
                    <el-upload accept=".xls,.xlsx"
                        :action="uploadFileUrl" :name="name" :with-credentials="true" :show-file-list="false" :on-progress="importProgress" :on-success="importSuccess">
                        <el-button type="primary"
                            @click.native="resetSuccessMessage"
                            :loading="importing">{{ importState }}</el-button>
                        <div class="import-success-msg"
                            slot="tip">{{ importSuccessMessage }}</div>
                    </el-upload>
                </div>
                <div class="dialog2-foot">
                    <el-button type="primary"
                               @click="returnLast">上一步</el-button>
                    <el-button type="primary"
                               :disabled="!hasImport"
                               @click.native="killAllDialog('import')">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="筛选添加店铺" size="large"
                :visible.sync="dialog.d3" :close-on-click-modal="false">
                <div class="dialog3-content">
                    <div class="dialog3-left">
                        <div class="item city">
                            <h3>省份／城市</h3>
                            <el-tree class="filter-tree"
                                ref="city"
                                show-checkbox accordion node-key="adcode" highlight-current
                                :data="cityDB" :props="cityProp"></el-tree>
                        </div>
                        <div class="item shop-group">
                            <h3>店铺分组</h3>
                            <el-tree class="filter-tree"
                                ref="group"
                                show-checkbox accordion node-key="id" highlight-current
                                :data="shopGroupDB" :props="shopGroupProp"></el-tree>
                        </div>
                        <div class="item business-scope">
                            <h3>店铺类型</h3>
                            <el-tree class="filter-tree"
                                ref="scope"
                                show-checkbox accordion node-key="label" highlight-current
                                :data="businessScopeDB" :props="businessScopeProp"></el-tree>
                        </div>
                    </div>
                    <div class="dialog3-right">
                        <div class="title" style="height:40px; line-height:40px;font-weight:bolder;">已选择 {{ shopFilterResult.length }} 个店铺</div>
                        <ul>
                            <li style="overflow-x:auto"
                                v-for="(shopObj,index) in shopFilterResult" :key="index">
                                <el-tag type="primary">{{ shopObj.id + '\u0020' + shopObj.shopName }}</el-tag>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="dialog3-foot">
                    <el-button class="dialog3-foot-left"
                        type="success"
                        @click="filterShop">筛选</el-button>
                    <div class="dialog3-foot-right">
                        <el-button type="info"
                            @click="returnLast">上一步</el-button>
                        <el-button :disabled="!hasImport"
                            type="primary"
                            @click.native="killAllDialog('filter')">确定</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="搜索添加店铺" size="large"
                :visible.sync="dialog.d4" :close-on-click-modal="false">
                <div class="dialog3-content">
                    <div class="dialog4-left">
                        <el-form class="search-shop-form"
                            :inline="true" :model="shop">
                            <el-form-item label="店铺ID" label-width="80px">
                                <el-input placeholder="请输入店铺 ID～"
                                    v-model="shop.id"></el-input>
                            </el-form-item>
                            <el-form-item label="店铺名称" label-width="80px">
                                <el-input placeholder="请输入店铺名称～"
                                    v-model="shop.shopName"></el-input>
                            </el-form-item>
                            <el-form-item label-width="80px">
                                <el-button type="success"
                                           @click="searchShop">搜索</el-button>
                            </el-form-item>
                            <el-form-item label-width="80px">
                                <el-button type="primary"
                                           @click="chooseShop">选定</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table class="shop-search-result"
                            v-loading.body="searchShopLoading" element-loading-text="拼命加载中" height="440" border
                            :data="shopSearchResult"
                            @selection-change="shopCheckedChange">
                            <el-table-column class="select"
                                type="selection" width="55"></el-table-column>
                            <el-table-column prop="id" width="361" label="店铺 ID"></el-table-column>
                            <el-table-column prop="shopName" width="361" label="店铺名称"></el-table-column>
                        </el-table>
                    </div>
                    <div class="dialog3-right">
                        <div class="title" style="height:40px; line-height:40px;font-weight:bolder;">已选择 {{ shopCheckedResult.length }} 个店铺</div>
                        <ul>
                            <li style="overflow-x:auto"
                                v-for="(shopObj,index) in shopCheckedResult" :key="index">
                                <el-tag type="primary"
                                    :closable="true"
                                    @close="removeOneSearchShop(index)">{{ shopObj.id+' | '+shopObj.shopName }}</el-tag>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="dialog4-foot">
                    <div class="dialog3-foot-right">
                        <el-button type="info"
                            @click="returnLast">上一步</el-button>
                        <el-button type="primary"
                            :disabled="!hasImport"
                            @click.native="killAllDialog('search_shop')">确定</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="添加创意" size="large"
                :visible.sync="dialog.d5" :close-on-click-modal="false">
                <div class="dialog3-content">
                    <div class="dialog4-left">
                        <el-form class="search-shop-form"
                            :inline="true" :model="idea">
                            <el-form-item>
                                <el-input placeholder="请输入创意名"
                                    v-model="idea.name"></el-input>
                            </el-form-item>
                            <el-select placeholder="请选择制作人"
                                v-model="idea.producer">
                                <el-option v-for="item, index in producerList" :key="item.value"
                                   :label="item.label"
                                   :value="item.label"></el-option>
                            </el-select>
                            <el-select placeholder="请选择创意类型"
                                v-model="idea.type">
                                <el-option v-for="item in ideaTypeList" :key="item.value"
                                    :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-form-item>
                                <el-button type="success"
                                           @click="searchIdeaBtn">搜索</el-button>
                            </el-form-item>
                            <el-form-item >
                                <el-button type="primary" @click="chooseBtn">选定</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table class="shop-search-result" ref="creatIdeaDialog"
                            v-loading.body="ideaLoading" element-loading-text="拼命加载中" height="440" border
                            :data="ideaSearchResult"
                            @selection-change="ideaCheckedChange">
                            <el-table-column class="select"
                                type="selection" width="55"></el-table-column>
                            <el-table-column prop="id" width="100" label="创意 ID"></el-table-column>
                            <el-table-column prop="name" width="" label="创意名"></el-table-column>
                            <el-table-column prop="type" width="" label="形式"></el-table-column>
                            <el-table-column prop="group" width="" label="设备分组"></el-table-column>
                            <el-table-column label="操作" width="80">
                                <template scope="scope">
                                    <el-button size="small" type="danger"
                                        @click="ideaPreview(scope.$index, scope.row)">预览</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="dialog3-right">
                        <div class="title" style="height:40px; line-height:40px;font-weight:bolder;">已选择 {{ ideaCheckedResult.length }} 个创意</div>
                        <ul>
                            <li style="overflow-x:auto"
                                v-for="(ideaObj,index) in ideaCheckedResult" :key="index">
                                <el-tag type="primary"
                                    :closable="true"
                                    @close="removeOneSearchIdea(index)">{{ideaObj.id}} | {{ ideaObj.name }}</el-tag>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="m-pagination-box" >
                    <el-pagination
                        v-if ="IdealDialogPagination.totalPagination"
                        layout="total, prev, pager, next"
                        :current-page.sync="IdealDialogPagination.currentPage" :page-size="IdealDialogPagination.pageSize" :total="IdealDialogPagination.totalPagination"
                        @current-change="searchIdea"></el-pagination>
                </div>
                <div class="dialog4-foot">
                    <div class="dialog3-foot-right">
                        <el-button class="idea-queding"
                            type="primary"
                            :disabled="!hasImport"
                            @click.native="killAllDialog('search_idea')">确定</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="创意预览" size="full"
                :visible.sync="dialog.d6" :close-on-click-modal="false">
                <div class="whichMachine">
                    <el-tag v-for="(item,index) in screenTypes" :key="index"
                        :type="item.type"
                        @click.native="changeScreen(item.ratio)">{{ item.name }}</el-tag>
                </div>
                <div class="preview-content">
                    <div id="preview-box"></div>
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
            <el-dialog v-if="videoDialog.show" v-model="videoDialog.show" :show-close="true" custom-class="ele-modal" top="30%" :close-on-click-modal="false">

                <div class="block">
                    <video class="pop-video" controls="controls" :src="videoDialog.src">
                    </video>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import {
    Button,
    Form,
    FormItem,
    Input,
    Col,
    TimePicker,
    DatePicker,
    Dialog,
    Upload,
    Loading,
    Tree,
    MessageBox,
    Table,
    TableColumn,
    Tag,
    Select,
    Option,
    Pagination,
} from 'element-ui';
import { baseURL } from '@/api/HTTP';
import cityCodeDB from '@/assets/cityCodeDB.json';
import Util from '@/libs/util';
import ShopAPI from '@/api/Shop';
import AuthorAPI from '@/api/Author';
import ActivityAPI from '@/api/Activity';

Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tree);
Vue.use(Loading);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Col);
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Pagination);

const tagTypes = ['gray', 'primary', 'success', 'warning', 'danger'];

const scopeDB = [
    {
        label: '普通店铺',
        value: 1,
    },
    {
        label: '品牌店铺',
        value: 2,
    },
];

export default {
    name: 'new_activity',
    data() {
        return {
            pageTitle: '新建活动',
            activityId: '',
            form: {
                activityName: '',
                // 假设 2017-01-01 - 2017-02-21
                dateRange: '',
                // 假设 09:30:00 - 16:59:99
                timeRange: '',
                // 缓存数据
                dateArr: [],
                // 缓存数据
                timeArr: [],
                // 实际提交到数据库的时间
                // 为 '2017-01-01 09:30:00'
                startDate: '',
                // 为 '2017-02-21 16:59:99'
                endDate: '',
                status: '',
            },
            // 4 个弹出框
            dialog: {
                d1: false, // 是否显示添加店铺的 dialog
                d2: false, // 是否显示导入店铺的 dialog
                d3: false, // 是否显示筛选店铺的 dialog
                d4: false, // 是否显示搜索添加店铺的 dialog
                d5: false, // 是否显示添加创意的 dialog
                d6: false, // 创意预览的 dialog
            },

            // 视频图片的预览
            imgDialog: {
                show: false,
                src: '',
            },
            videoDialog: {
                show: false,
                src: '',
            },
            // 店铺数组
            shops: [],
            // 导入店铺
            // 根据是否导入成功来禁用确定按钮
            hasImport: false,
            name: 'fileUpload',
            // 文件上传的地址
            uploadFileUrl: `${baseURL}shop/addShops/uploadXlsx`,
            importing: false,
            importState: '导入 Excel',
            importSuccessMessage: '',
            // 导入的店铺信息
            shopImportResult: [],
            // 筛选添加店铺 城市数据
            cityDB: cityCodeDB,
            cityProp: {
                label: 'name',
                adcode: 'adcode',
                children: 'districts',
            },
            // 店铺分组数据
            shopGroupDB: [],
            shopGroupProp: {
                label: 'name',
                children: 'list',
            },
            // 经营范围数据
            businessScopeDB: scopeDB,
            businessScopeProp: {
                label: 'label',
                value: 'value',
            },
            shopFilterResult: [],
            // 搜索添加店铺
            shop: {
                id: '',
                shopName: '',
            },
            shopSearchResult: [],
            // 从搜索的店铺里选中的店铺
            shopCheckedResult: [],
            searchShopLoading: false,
            // 创意数组
            ideas: [],
            // 添加创意
            idea: {
                // 创意名
                name: '',
                // 制作人
                producer: '',
                // 创意类型
                type: '',
            },
            producerList: [
                {
                    label: '全部',
                    value: null,
                },
            ],
            // 创意类型列表
            ideaTypeList: [
                {
                    label: '全部',
                    value: null,
                },
                {
                    label: '图片',
                    value: 1,
                },
                {
                    label: '音频',
                    value: 2,
                },
                {
                    label: '视频',
                    value: 3,
                },
                {
                    label: '链接',
                    value: 4,
                },
            ],
            ideaLoading: false,
            ideaSearchResult: [],
            // 从搜索的店铺里选中的店铺
            ideaCheckedResult: [],
            screenTypes: [
                {
                    // 广告机名称
                    name: '10寸广告机',
                    // 屏幕比例
                    ratio: '16:9',
                    type: tagTypes[Math.floor(Math.random() * 5)],
                },
                {
                    name: '15寸广告机',
                    ratio: '16:12',
                    type: tagTypes[Math.floor(Math.random() * 5)],
                },
                {
                    name: '5寸广告机',
                    ratio: '2:3',
                    type: tagTypes[Math.floor(Math.random() * 5)],
                },
                {
                    name: '22寸广告机',
                    ratio: '16:13',
                    type: tagTypes[Math.floor(Math.random() * 5)],
                },
            ],
            IdealDialogPagination: {
                currentPage: 1,
                pageSize: 10,
                totalPagination: 0,
            },
            // 当前 选择的创意暂存
            selectIdeaListTemp: [],
            // 当前 选择的店铺暂存
            selectShopListTemp: [],
        };
    },
    computed: {
        // 统计选中的店铺的数量
        shopCheckedNum() {
            return this.shops.length;
        },
        // 统计选中的创意的数量
        ideaCheckedNum() {
            return this.ideas.length;
        },
    },
    watch: {
        // 每次窗口发生变化时，自动去重（创意和店铺）
        dialog: {
            handler() {
                this.shops = this.removeRepeat(this.shops, 'shopName');
                this.ideas = this.removeRepeat(this.ideas, 'name');
            },
            deep: true,
        },
        shopCheckedResult() {
            if (this.shopCheckedResult.length) {
                this.hasImport = true;
            }
        },
        ideaCheckedResult() {
            if (this.ideaCheckedResult.length) {
                this.hasImport = true;
            }
        },
        shopFilterResult() {
            if (this.shopFilterResult.length) {
                this.hasImport = true;
            }
        },
    },
    async mounted() {
        // 根据query判断当前页面是编辑活动还是新建活动
        this.activityId = Util.getUrlParam('id');
        if (this.activityId) {
            this.pageTitle = '编辑活动';

            const activityObj = JSON.parse(localStorage.getItem('activityObj'));

            this.form.activityName = activityObj.name;

            this.form.status = activityObj.status;

            // 按要求计算出后端要求的实际的时间格式
            const range = activityObj.timeRange;
            const arr1 = range.match(/\d{4}-\d{2}-\d{2}/g);
            const arr2 = range.match(/\d{2}:\d{2}:\d{2}/g);

            this.form.dateArr = [new Date(arr1[0]), new Date(arr1[1])];
            this.form.timeArr = [new Date(`2017-08-04T${arr2[0]}`), new Date(`2017-08-04T${arr2[1]}`)];

            this.shops = activityObj.shops;
            this.ideas = activityObj.ideas;
        }

        try {
            const shopGroupEntry = await ShopAPI.getShopGroup();
            const authorListEntry = await AuthorAPI.getIdeaAuthor();
            this.shopGroupDB = shopGroupEntry;
            authorListEntry.forEach((el) => {
                const obj = {};
                obj.label = el.author;
                obj.value = el.userId;
                this.producerList.push(obj);
            });
        } catch (err) {
            Util.toast(err, 'notice', 1500);
        }
    },
    methods: {
        getDateRange(range) {
            this.form.dateRange = range;
        },
        getTimeRange(range) {
            this.form.timeRange = range;
        },
        async submitForm() {
            // 验证活动名是否为空
            if (!this.form.activityName) {
                Util.toast('请输入活动名称～', 'notice', 1500);
                return false;
            }
            // 手动验证日期范围和时间范围是否选择
            if (!this.form.dateRange) {
                Util.toast('请选择日期范围～', 'notice', 1500);
                return false;
            }
            if (!this.form.dateRange.match(/\d{4}-\d{2}-\d{2}\u0020-\u0020\d{4}-\d{2}-\d{2}/)) {
                Util.toast('请选择日期范围～', 'notice', 1500);
                return false;
            }
            if (!this.form.timeRange) {
                Util.toast('请选择时间范围～', 'notice', 1500);
                return false;
            }
            if (!this.form.timeRange.match(/\d{2}:\d{2}:\d{2}\u0020-\u0020\d{2}:\d{2}:\d{2}/)) {
                Util.toast('请选择时间范围～', 'notice', 1500);
                return false;
            }

            // 检测添加的活动和创意是否为空
            if (!this.shops.length) {
                Util.toast('请至少添加一个店铺～', 'notice', 1500);
                return false;
            }
            // if (!this.ideas.length) {
            //     Util.toast('请至少关联一个创意～', 'notice', 1500);
            //     return false;
            // }

            // 按要求计算出后端要求的实际的时间格式
            const arr1 = this.form.dateRange.split('\u0020-\u0020');
            const arr2 = this.form.timeRange.split('\u0020-\u0020');
            this.form.startDate = `${arr1[0]}\u0020${arr2[0]}`;
            this.form.endDate = `${arr1[1]}\u0020${arr2[1]}`;

            // 店铺和创意只传 id
            const shopIds = [];
            const ideaIds = [];
            this.shops.forEach((el) => {
                shopIds.push(el.id);
            });
            this.ideas.forEach((el) => {
                ideaIds.push(el.id);
            });

            // 根据 query 是否有 id 来判断是调用创建接口还是更新接口
            let activityData;
            const param = {
                id: this.activityId ? this.activityId : '',
                name: this.form.activityName,
                startDate: this.form.startDate,
                endDate: this.form.endDate,
                activityCreativeIds: ideaIds,
                shopIds,
                status: this.form.status,
            };

            try {
                if (this.activityId) {
                    activityData = await ActivityAPI.updateActivity(param);
                } else {
                    activityData = await ActivityAPI.createActivity(param);
                }
                Util.toast(activityData.message, 'notice', 1500);
                location.href = 'activityList.html';
            } catch (e) {
                Util.toast(e, 'notice', 1500);
            }
            return true;
        },
        // 选定选择的创意
        chooseBtn() {
            this.mergeObjToArray(this.ideaCheckedResult, this.selectIdeaListTemp);
        },
        chooseShop() {
            this.mergeObjToArray(this.shopCheckedResult, this.selectShopListTemp);
        },
        //  将source 合并到targe去重 id为合并的索引对比项
        mergeObjToArray(target = [], source = [], id = 'id') {
            for (let i = 0; i < source.length; i += 1) {
                if (!target.length) {
                    target.push(source[i]);
                } else {
                    for (let k = 0; k < target.length; k += 1) {
                        if (source[i][id] === target[k][id]) {
                            break;
                        } else if (k === (target.length -1) && source[i][id] !== target[k][id]) {
                            target.push(source[i]);
                        }
                    }
                }
            }
        },
        resetSuccessMessage() {
            this.importSuccessMessage = '';
        },
        // 点击添加店铺按钮
        addShops() {
            this.dialog.d1 = true;

            // 初始化导入店铺
            this.importState = '导入 Excel';
            this.importSuccessMessage = '';
            this.hasImport = false;

            // 初始化筛选店铺
            if (this.$refs.city) {
                this.$refs.city.setCheckedKeys([]);
            }
            if (this.$refs.group) {
                this.$refs.group.setCheckedKeys([]);
            }
            if (this.$refs.scope) {
                this.$refs.scope.setCheckedKeys([]);
            }
            this.shopFilterResult = [];

            // 初始化搜索店铺
            this.shop = {
                id: '',
                shopName: '',
            };
            this.shopSearchResult = [];
            this.shopCheckedResult = [];
        },
        // 添加店铺，上一步按钮
        returnLast() {
            Object.keys(this.dialog).forEach((el) => {
                this.dialog[el] = false;
            });
            this.dialog.d1 = true;
        },
        importMethod1() {
            MessageBox({
                title: '注意',
                type: 'warning',
                message: '该功能暂未开放！',
            });
            this.dialog.d1 = false;
            this.dialog.d2 = true;
            return false;
        },
        importMethod2() {
            this.dialog.d1 = false;
            this.dialog.d3 = true;
        },
        importMethod3() {
            this.dialog.d1 = false;
            this.dialog.d4 = true;

            // 首次进入时搜索店铺
            this.searchShop();
        },
        // 点击确定按钮，关闭所有 dialog，并且更新添加的店铺信息和创意信息
        killAllDialog(tag) {
            // 关闭所有的 dialog
            Object.keys(this.dialog).forEach((el) => {
                this.dialog[el] = false;
            });

            if (tag === 'import') {
                // 将导入的店铺添加到总的店铺
                this.shops = this.shops.concat(this.shopImportResult);
            } else if (tag === 'filter') {
                // 将筛选的店铺添加到总的店铺
                this.shops = this.shops.concat(this.shopFilterResult);
            } else if (tag === 'search_shop') {
                // 将搜索的店铺添加到总的店铺
                this.shops = this.shops.concat(this.shopCheckedResult);
            } else if (tag === 'search_idea') {
                // 将搜索的创意添加到总的创意数组
                this.ideas = this.ideas.concat(this.ideaCheckedResult);
            }
        },
        importProgress(e) {
            this.importing = true;
            this.importState = `导入中\u0020${Number.parseInt(e.percent, 10)}%`;
        },
        // 店铺导入成功后
        importSuccess() {
            // TODO 将后端返回的店铺列表存入数组
            this.shopImportResult = [
                {
                    shopName: '导入的店铺 💩',
                    id: 1000,
                },
                {
                    shopName: '导入的店铺 😢',
                    id: 1001,
                },
                {
                    shopName: '导入的店铺 😊',
                    id: 1002,
                },
                {
                    shopName: '导入的店铺 😄',
                    id: 1003,
                },
            ];

            this.hasImport = true;
            this.importing = false;
            this.importState = '继续导入';
            this.importSuccessMessage = `导入完成，已成功导入\u0020${this.shopImportResult.length}\u0020个店铺`;
        },
        // 主界面删除一个店铺
        removeOneShop(e) {
            const shop = e.target.parentElement.innerText.trim();
            const index = this.shops.findIndex(el => `${el.id} ${el.shopName.trim()}` === shop);
            if (index >= 0) {
                this.shops.splice(index, 1);
            }
        },
        // 点击筛选店铺
        async filterShop() {
            const cityCodes = [];
            const shopGroupIds = [];
            const types = [];

            const selectedCity = this.$refs.city.getCheckedNodes(true);
            const selectedGroup = this.$refs.group.getCheckedNodes(true);
            const selectedScope = this.$refs.scope.getCheckedNodes(true);

            selectedCity.forEach((el) => {
                cityCodes.push(el.adcode);
            });
            selectedGroup.forEach((el) => {
                shopGroupIds.push(el.id);
            });
            selectedScope.forEach((el) => {
                types.push(el.value);
            });

            try {
                const entry = await ShopAPI.queryShopByFilterKeys({
                    cityCodes,
                    shopGroupIds,
                    types,
                });
                this.shopFilterResult = entry;
            } catch (err) {
                Util.toast(err, 'notice', 1500);
            }
        },
        // 搜索店铺
        async searchShop() {
            this.searchShopLoading = true;
            try {
                const entry = await ShopAPI.selectShopByIdAndName({
                    shopName: this.shop.shopName,
                    id: this.shop.id,
                });
                this.shopSearchResult = entry;
                this.searchShopLoading = false;
            } catch (err) {
                this.searchShopLoading = false;
                Util.toast(err, 'notice', 1500);
            }
        },
        shopCheckedChange(selection) {
            // selection 数组，选中的行的对象数组
            this.selectShopListTemp = selection;
        },
        // 搜索店铺界面，删除一个店铺
        removeOneSearchShop(index) {
            this.shopCheckedResult.splice(index, 1);
        },
        // 添加创意
        addIdeas() {
            this.dialog.d5 = true;
            this.hasImport = false;
            // 初始化
            this.idea = {
                name: '', // 创意名
                producer: '', // 制作人
                type: '', // 创意类型
            };
            this.ideaSearchResult = [];
            // 从搜索的店铺里选中的店铺
            this.ideaCheckedResult = [];
            // 首次进入自动加载所有创意
            this.searchIdea();
        },
        searchIdeaBtn() {
            this.IdealDialogPagination.currentPage = 1;
            this.searchIdea();
        },
        // 搜索创意
        async searchIdea() {
            this.ideaLoading = true;
            this.selectIdeaListTemp = [];
            this.ideaSearchResult = [];
            const author = this.idea.producer === '全部' ? '' : this.idea.producer;
            // 获取创意信息
            try {
                const data = await ActivityAPI.query({
                    name: this.idea.name,
                    activityCreativeAuthor: author,
                    activityMaterialType: this.idea.type,
                    pageNo: this.IdealDialogPagination.currentPage,
                    pageSize: 10,
                });
                const entry = data.entry;
                this.IdealDialogPagination.totalPagination = data.count;
                this.ideaLoading = false;

                this.$refs.creatIdeaDialog.clearSelection();
                if (entry.length) {
                    entry.forEach((el) => {
                        const obj = {};

                        obj.id = el.activityCreativeDetailDTO.id;
                        obj.previewLink = el.activityCreativeDetailDTO.activityMaterialUrl;
                        obj.name = el.activityCreativeDetailDTO.name;
                        obj.typeId = el.activityCreativeDetailDTO.activityMaterialType;
                        const mType = el.activityCreativeDetailDTO.activityMaterialType;

                        this.ideaTypeList.forEach((el) => {
                            if (mType === el.value) {
                                obj.type = el.label;
                            }
                        });

                        let tempGroup = '';
                        el.deviceGroups.forEach((el) => {
                            tempGroup += `${el.name} , `;
                        });
                        obj.group = tempGroup.slice(0, -3);
                        this.ideaSearchResult.push(obj);
                    });
                }
            } catch (err) {
                this.ideaLoading = false;
                Util.toast(err, 'notice', 1500);
            }
        },
        ideaCheckedChange(selection) {
            // selection 数组，选中的行的对象数组
            this.selectIdeaListTemp = selection;
        },
        // 搜索创意界面，删除一个创意
        removeOneSearchIdea(index) {
            this.ideaCheckedResult.splice(index, 1);
        },
        // 主界面删除一个创意
        removeOneIdea(e) {
            const idea = e.target.parentElement.innerText.trim();
            const index = this.ideas.findIndex(el => el.name.trim() === idea);

            if (index >= 0) {
                this.ideas.splice(index, 1);
            }
        },
        // 创意预览
        ideaPreview(a, b) {
            this.showPicVideo(b.previewLink, b.typeId);
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
        // 切换屏幕
        changeScreen(ratio) {
            const [width, height] = ratio.split(':');
            const previewBox = document.querySelector('#preview-box');
            previewBox.style.width = `${(550 * width) / height}px`;
        },
        // 工具函数，去除元素都为对象的数组的重复值（可以指定是对象的某个键进行去重）
        removeRepeat(originalArray, prop) {
            // type checker
            if (originalArray && (originalArray instanceof Array)) {
                if (originalArray.length <= 1) {
                    return originalArray;
                }

                let newArray = [];

                // type checker
                if (prop && (typeof prop === 'string')) {
                    // check if the prop is vaild
                    if (Object.keys(originalArray[0]).includes(prop)) {
                        const repeatKiller = {};

                        // use the feature of Object[no repeat key] to remove repeat array element
                        originalArray.forEach((el) => {
                            repeatKiller[el[prop]] = el;
                        });

                        // put the values of repeatKiller Object to the newArray
                        Object.keys(repeatKiller).forEach((el) => {
                            newArray.push(repeatKiller[el]);
                        });
                    } else {
                        newArray = [...new Set(originalArray.map(JSON.stringify))].map(JSON.parse);
                    }
                } else {
                    newArray = [...new Set(originalArray.map(JSON.stringify))].map(JSON.parse);
                }
                return newArray;
            }
            return false;
        },
    },
};
</script>

<style scoped>
    @import '../../assets/common';

    .activity-list {
    cursor: pointer;
    color: #666;
}

.pop-video {
    display:block;
    max-width:100%;
    max-height:100%;
}
.cr-img img {
    max-width:100%;
    max-height:100%;
}
.activity-list:hover {
    color: #333;
}

.line {
    text-align: center;
}

.dialog1-buttons {
    text-align: center;
}

.dialog1-buttons button {
    display: inline-block;
    margin: 10px 0;
}

.dialog2-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0 50px;
    text-align: center;
}

.dialog2-foot {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog2-foot button:first-child {
    margin-right: 80px;
}

.dialog2-foot button {
    opacity: 0.7;
}

.dialog3-content {
    display: flex;
    box-sizing: border-box;
    border-top: 1px solid #ddd;
    height: 500px;
}

.dialog3-left,
.dialog3-right {
    box-sizing: border-box;
}

.dialog3-left {
    box-sizing: border-box;
    display: flex;
    width: 70%;
}

.dialog3-left .item {
    width: 33.3%;
    margin: 10px 5px;
    border: 1px solid #d1dbe5;
    overflow: auto;
}

.dialog3-left .item h3 {
    height: 40px;
    line-height: 40px;
    font-weight: bolder;
    padding: 0 10px;
}

.dialog3-right {
    box-sizing: border-box;
    width: 30%;
    padding: 20px;
    background: #F5F5F5;
}

.dialog3-right>ul {
    height: 419px;
    overflow-y: auto;
}

.dialog3-foot {
    display: flex;
}

.dialog3-foot-left {
    width: 70%;
    margin: 10px;
}

.dialog3-foot-right {
    display: flex;
    width: 30%;
    margin: 10px 0;
}

.dialog3-foot-right button {
    width: 50%;
    margin: 0 5px;
}

.dialog4-left {
    box-sizing: border-box;
    width: 70%;
}

.dialog4-foot {
    display: flex;
    justify-content: flex-end;
}

.search-shop-form {
    height: 38px;
    border-bottom: 1px solid #d1dbe5;
    padding: 10px 0;
    overflow: hidden;
}

.import-success-msg {
    height: 35px;
    line-height: 35px;
    margin: 10px auto -35px;
    color: #FF3B1D;
}

.tag-list-title {
    font-weight: bold;
}

.tag-block {
    margin: 10px auto;
}

.shop-list {
    margin-top: 20px;
}

.shop-search-result {
    box-sizing: border-box;
}

.idea-queding {
    width: 100% !important;
}

.filter-tree {
    height: 439px;
    overflow-y: auto;
}

.whichMachine {
    padding: 10px 10px 20px;
}

.preview-content {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

#preview-box {
    width: 888px;
    height: 550px;
    background: deeppink;
}
.el-tag {
    display: inline-block !important;
    margin: 5px 10px !important;
    cursor: pointer !important;
}
.el-dialog__wrapper .el-dialog--full .el-dialog__body {
    padding: 0 !important;
}
.el-tree {
    border: none !important;
}
.business-scope .el-tree-node__expand-icon {
    margin: 0 !important;
}
.el-message {
    z-index: 99998 !important;
}
table {
    width: 100% !important;
}
.el-select {
    width: 150px !important;
}
</style>
