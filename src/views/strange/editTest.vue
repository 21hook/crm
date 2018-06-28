<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">{{title}}</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <el-form ref="testInfo" :model="testInfo" :rules="testRules">
                    <el-form-item class="form-item" label="测试题类型" prop="type" label-width="100px">
                        <el-radio v-model="type" label="1">积分题</el-radio>
                        <el-radio v-model="type" label="2">结果题</el-radio>
                    </el-form-item>
                    <el-form-item class="form-item" label="测试题名称" prop="name" label-width="100px">
                        <el-input type="textarea" v-model="testInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item" label="测试题描述" prop="description" label-width="100px">
                        <el-input type="textarea" v-model="testInfo.description"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item" label="上传测试头像" prop="picture" label-width="100px">
                        <img class="fl test-pic" :src="imgCdnPath + testInfo.picture" alt="" width="50" height="50" v-if="testInfo.picture">
                        <el-upload class="fl"  accept="image/*" name="fileUpload"
                                :action="uploadBannerUrl" :on-success="handleTestPicSuccess" :show-file-list="false" :multiple="false" :with-credentials="true">
                                <el-button class="add-test-pic-btn" type="primary" size="small">{{ testInfo.picture ? '更换图片' : '添加图片'}}</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="form-item" label="问题分享文案" prop="shareQuestionTitle" label-width="100px">
                        <el-input type="textarea" v-model="testInfo.shareQuestionTitle"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item" label="选项分享文案" prop="shareResultTitle" label-width="100px">
                        <el-input type="textarea" v-model="testInfo.shareResultTitle"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </form>
        <div class="cr-panel">
            <el-table :data="questionList" v-loading.body="isLoading" :default-expand-all="true">
                <el-table-column prop="id" label="题目id" width="80px" v-if="disabled == true"></el-table-column>
                <el-table-column prop="id" label="题目序号" width="80px" v-if="disabled == false">
                    <template scope="item">{{item.$index + 1}}</template>
                </el-table-column>
                <el-table-column prop="picture" label="题目配图">
                    <template scope="item">
                        <img v-if="item.row.picture" class="img" :src="imgCdnPath + item.row.picture" width="210px" height="90px"></img>
                        <div style="width:100%;">
                            <el-upload  accept="image/*" name="fileUpload"
                                    :action="uploadBannerUrl" :on-success="handleQuestionPicSuccess" :show-file-list="false" :multiple="false" :with-credentials="true">
                                    <el-button class="add-question-pic-btn" @click="getCurrentIndex(item.$index)" type="primary" size="small">{{ item.row.picture ? '更换配图' : '添加配图'}}</el-button>
                            </el-upload>
                            <el-button class="del-question-pic-btn" @click="delQuestionPic(item.$index)" type="danger" size="small" v-if="item.row.picture">删除配图</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="题目名">
                    <template scope="item">
                        <el-input type="textarea" v-model="item.row.content" :rows="5"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center">
                    <template scope="item">
                        <el-button class="operate-btn" size="small" type="danger" @click="showdeleteQuestionDialog(item.$index)">删除问题</el-button>
                        <el-button class="operate-btn" size="small" type="primary" @click="topMove(item.$index)">上移</el-button>
                        <el-button class="operate-btn" size="small" type="primary" @click="bottomMove(item.$index)">下移</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template scope="itemDad">
                        <div class="el-form-item">
                            <el-button type="primary" @click="addOption(itemDad.$index)" v-if="disabled == false">添加选项</el-button>
                        </div>
                        <el-table :data="itemDad.row.funTestOptionDTOList">
                            <el-table-column prop="id" label="选项id" width="80px" v-if="disabled == true"></el-table-column>
                            <el-table-column prop="id" label="选项序号" width="80px" v-if="disabled == false">
                                <template scope="itemSon">
                                    {{itemSon.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="content" label="选项内容">
                                <template scope="itemSon">
                                    <el-input type="textarea" v-model="itemSon.row.content" :rows="2" placeholder="最多16个汉字"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="score" label="题目分值" width="100px">
                                <template scope="itemSon">
                                    <el-input class="ipt60" v-model="itemSon.row.score" :disabled="type == 2"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="next" label="下一题序号" width="150px" v-if="disabled == false">
                                <template scope="itemSon">
                                    <el-input v-model="itemSon.row.next" placeholder="最后一题不填"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="next" label="下一题id" width="150px" v-if="disabled == true">
                                <template scope="itemSon">
                                    <el-input v-model="itemSon.row.next" placeholder="最后一题不填"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="next" label="最终结果选项" width="150px">
                                <template scope="itemSon">
                                    <el-input v-model="itemSon.row.resultFlag" placeholder="非最后一题不填" :disabled="type == 1"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="next" label="选项操作" header-align="center">
                                <template scope="itemSon">
                                    <el-button class="operate-btn" size="small" type="danger" @click="delOption(itemDad.$index, itemSon.$index)">删除选项</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
            <div class="form-btn" v-if="disabled == false">
                <el-button type="success" @click="addQuestion()">添加题目</el-button>
            </div>
        </div>
        <div class="cr-panel">
            <el-table :data="resultList" v-loading.body="isLoading">
                <el-table-column prop="id" label="结果id" width="80px" v-if="disabled == true"></el-table-column>
                <el-table-column prop="id" label="结果序号" width="80px" v-if="disabled == false">
                    <template scope="item">
                        {{item.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="flag" label="结果类型">
                    <template scope="item">
                        <el-input v-model="item.row.flag" placeholder="输入结果名" :disabled="type == 1"></el-input>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column prop="score" label="分值区间">
                    <template scope="item">
                        <el-input v-model="item.row.minScore" placeholder="最小分值" :disabled="type == 2"></el-input>
                        <el-input v-model="item.row.maxScore" placeholder="最大分值，但不包括" :disabled="type == 2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="picture" label="结果配图">
                    <template scope="item">
                        <img v-if="item.row.picture" class="img" :src="imgCdnPath + item.row.picture" width="105px" height="80px"></img>
                        <div style="width:100%;">
                            <el-upload  accept="image/*" name="fileUpload"
                                    :action="uploadBannerUrl" :on-success="handleResultPicSuccess" :show-file-list="false" :multiple="false" :with-credentials="true">
                                    <el-button class="add-question-pic-btn" @click="getCurrentIndex(item.$index)" type="primary" size="small">{{ item.row.picture ? '更换结果配图' : '添加结果配图'}}</el-button>
                            </el-upload>
                            <el-button class="del-question-pic-btn" @click="delResultPic(item.$index)" type="danger" size="small" v-if="item.row.picture">删除结果配图</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="guide" label="结果标题">
                    <template scope="item">
                        <el-input v-model="item.row.guide"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="结果描述">
                    <template scope="item">
                        <el-input type="textarea" v-model="item.row.description" :rows="5"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center">
                    <template scope="item">
                        <el-button class="operate-btn" size="small" type="danger" @click="showdeleteResultDialog(item.$index)">删除结果</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="form-btn" v-if="disabled == false">
                <el-button type="success" @click="addResult()">添加结果</el-button>
            </div>
        </div>
        <div class="el-form-item">
            <el-button type="success" @click="checkForm()">保存</el-button>
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
        Pagination,
        Button,
        Loading,
        Dialog,
        Upload,
        MessageBox,
        Radio,
        Checkbox,
    } from 'element-ui';

    import Util from '@/libs/util';
    import { baseURL } from '@/api/HTTP';
    import EditTestApi from '@/api/EditTest';

    Vue.use(Loading);
    Vue.use(Form);
    Vue.use(Input);
    Vue.use(FormItem);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Button);
    Vue.use(Dialog);
    Vue.use(Upload);
    Vue.use(Radio);
    Vue.use(Checkbox);
    export default {
        data() {
            return {
                title: null, // 题目标题
                uploadBannerUrl: 'http://daily.elephtribe.com/message/oss/imgUpload',
                imgCdnPath: 'http://cdn.elephtribe.com/',
                testId: null,
                disabled: false, // 是否展示添加按钮／禁用删除按钮
                testInfo: {},
                type: '1',
                questionList: [],
                resultList: [],
                isLoading: false,
                currnetIndex: null, // 得到当前上传图片的问题是哪一个
                questionObj: {
                    content: '',
                    funTestOptionDTOList: [
                        {
                            content: '',
                            next: null,
                            resultFlag: '',
                            score: null,
                        },
                    ],
                    isFinal: false,
                    picture: '',
                },
                optionObj: {
                    content: '',
                    next: null,
                    resultFlag: '',
                    score: null,
                },
                resultObj: {
                    flag: null, // 结果类型A/B/C/D
                    picture: '',
                    minScore: null,
                    maxScore: null,
                    guide: '',
                    description: '',
                },
                testRules: {
                    name: [
                        {
                            required: true,
                            message: '测试题名称必填',
                            trigger: 'blur',
                        },
                    ],
                    shareQuestionTitle: [
                        {
                            required: true,
                            message: '问题分享文案',
                            trigger: 'blur',
                        },
                    ],
                    shareResultTitle: [
                        {
                            required: true,
                            message: '选项分享文案',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.testId = Util.getUrlParam('testId') || null;
                if (this.testId) {
                    this.title = '测试详情';
                    this.disabled = true;
                    this.getTestInfo();
                } else {
                    this.title = '添加测试';
                    this.disabled = false;
                    this.testInfo = {
                        type: '1',
                        name: null,
                        description: null,
                        picture: null,
                        shareQuestionTitle: null,
                        shareResultTitle: null,
                    };
                    this.questionList.push(JSON.parse(JSON.stringify(this.questionObj)));
                    this.resultList.push(JSON.parse(JSON.stringify(this.resultObj)));
                }
            },
            // 获取测试列表
            async getTestInfo() {
                this.isLoading = true;
                try {
                    const params = {
                        funTestId: this.testId,
                    };
                    const data = await EditTestApi.getTestInfoByTestId(params);
                    this.isLoading = false;
                    this.testInfo = data;
                    this.type = data.type.toString();
                    this.questionList = data.funTestQuestionDTOS;
                    this.resultList = data.funTestResultDTOS;
                    this.isLoading = false;
                } catch (err) {
                    Util.toast(err, 'failed', 2500);
                }
            },
            // 修改测试题
            async editTest(params) {
                try {
                    console.log(params)
                    const data = await EditTestApi.updateFunTestById(params);
                    console.log(data)
                    Util.toast('更新成功', 'succeed', 1500);
                    setTimeout(() => {
                        location.href = './testList.html';
                    }, 1000);
                } catch (err) {
                    Util.toast(err, 'failed', 2500);
                }
            },
            // 添加测试题
            async addTest(params) {
                try {
                    console.log(params)
                    const data = await EditTestApi.addFunTest(params);
                    console.log(data)
                    Util.toast('添加成功', 'succeed', 1500);
                    setTimeout(() => {
                        location.href = './testList.html';
                    }, 1000);
                } catch (err) {
                    Util.toast(err, 'failed', 2500);
                }
            },
            // 大保存
            save() {
                this.testInfo.type = this.type;
                for (let i = 0; i < this.questionList.length; i++) {
                    this.questionList[i].sort = i + 1;
                }
                const params = {
                    funTest: this.testInfo,
                    funTestQuestion: this.questionList,
                    funTestResult: this.resultList,
                };
                if (this.testId) {
                    params.funTest.id = this.testId;
                    this.editTest(params);
                } else {
                    this.addTest(params);
                }
            },
            // 判断对象是否是空
            objIsNull(obj) {
                if (obj === null || obj === '') {
                    return true;
                }
            },
            // 检验表单
            checkForm() {
                this.$refs.testInfo.validate(async (valid) => {
                    const questionStatus = this.checkQuestionForm();
                    const resultStatus = this.checkResultForm();
                    if (valid && questionStatus && resultStatus) {
                        this.save();
                    } else {
                        Util.toast('测试题信息请填写完整', 'failed', 4000);
                        return false;
                    }
                });
            },
            // 检验问题以及选项表单
            checkQuestionForm() {
                if (!this.testInfo.picture) {
                    Util.toast('测试头像必须上传', 'failed', 4000);
                    return false;
                }
                for (let i = 0; i < this.questionList.length; i++) {
                    if (this.objIsNull(this.questionList[i].content)) {
                        if (!this.testId) {
                            Util.toast(`序号为${i + 1}的题目名不能为空`, 'failed', 4000);
                        } else {
                            Util.toast(`题目id为${this.questionList[i].id}的题目名不能为空`, 'failed', 4000);
                        }
                        return false;
                    }
                    if (this.questionList[i].funTestOptionDTOList.length == 0) {
                        if (!this.testId) {
                            Util.toast(`序号为${i + 1}的选项不能为空`, 'failed', 4000);
                        } else {
                            Util.toast(`题目id为${this.questionList[i].id}的选项不能为空`, 'failed', 4000);
                        }
                        return false;
                    }
                    for (let j = 0; j < this.questionList[i].funTestOptionDTOList.length; j++) {
                        const content = this.questionList[i].funTestOptionDTOList[j].content;
                        if (this.objIsNull(content)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的问题的第${j + 1}个选项:内容不能为空`, 'failed', 4000);
                            } else {
                                Util.toast(`题目id为${this.questionList[i].id}的问题的第${j + 1}个选项:内容不能为空`, 'failed', 4000);
                            }
                            return false;
                        }
                        if (this.type == 1) {
                            const score = this.questionList[i].funTestOptionDTOList[j].score;
                            if (this.objIsNull(score)) {
                                if (!this.testId) {
                                    Util.toast(`序号为${i + 1}的问题的第${j + 1}个选项:分值不能为空`, 'failed', 4000);
                                } else {
                                    Util.toast(`题目id为${this.questionList[i].id}的问题的第${j + 1}个选项:分值不能为空`, 'failed', 4000);
                                }
                                return false;
                            }
                            if (isNaN(score)) {
                                if (!this.testId) {
                                    Util.toast(`序号为${i + 1}的问题的第${j + 1}个选项:分值必须为数字`, 'failed', 4000);
                                } else {
                                    Util.toast(`题目id为${this.questionList[i].id}的问题的第${j + 1}个选项:分值必须为数字`, 'failed', 4000);
                                }
                                return false;
                            }
                        }
                    }
                }
                return true;
            },
            // 检查结果表单
            checkResultForm() {
                for (let i = 0; i < this.resultList.length; i++) {
                    if (this.type == 1) {
                        const minScore = this.resultList[i].minScore;
                        const maxScore = this.resultList[i].maxScore;
                        if (this.objIsNull(minScore)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的结果最小分值不能为空`, 'failed', 4000);
                            } else {
                                Util.toast(`结果id为${this.resultList[i].id}的结果最小分值不能为空`, 'failed', 4000);
                            }
                            return false;
                        }
                        if (isNaN(minScore)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的结果最小分值必须为数字`, 'failed', 4000);
                            } else {
                                Util.toast(`结果id为${this.resultList[i].id}的结果最小分值必须为数字`, 'failed', 4000);
                            }
                            return false;
                        }
                        if (this.objIsNull(maxScore)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的结果最大分值不能为空`, 'failed', 4000);
                            } else {
                                Util.toast(`结果id为${this.resultList[i].id}的结果最大分值不能为空`, 'failed', 4000);
                            }
                            return false;
                        }
                        if (isNaN(maxScore)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的结果最大分值必须为数字`, 'failed', 4000);
                            } else {
                                Util.toast(`结果id为${this.resultList[i].id}的结果最大分值必须为数字`, 'failed', 4000);
                            }
                            return false;
                        }
                    } else {
                        const flag = this.resultList[i].flag;
                        if (this.objIsNull(flag)) {
                            if (!this.testId) {
                                Util.toast(`序号为${i + 1}的结果类型不能为空`, 'failed', 4000);
                            } else {
                                Util.toast(`结果id为${this.resultList[i].id}的结果类型不能为空`, 'failed', 4000);
                            }
                            return false;
                        }
                    }
                    const picture = this.resultList[i].picture;
                    const guide = this.resultList[i].guide;
                    const description = this.resultList[i].description;
                    if (this.objIsNull(picture)) {
                        if (!this.testId) {
                            Util.toast(`序号为${i + 1}的结果配图不能为空`, 'failed', 4000);
                        } else {
                            Util.toast(`结果id为${this.resultList[i].id}的结果配图不能为空`, 'failed', 4000);
                        }
                        return false;
                    }
                    if (this.objIsNull(guide)) {
                        if (!this.testId) {
                            Util.toast(`结果序号为${i + 1}的标题不能为空`, 'failed', 4000);
                        } else {
                            Util.toast(`结果id为${this.resultList[i].id}的结果标题不能为空`, 'failed', 4000);
                        }
                        return false;
                    }
                    if (this.objIsNull(description)) {
                        if (!this.testId) {
                            Util.toast(`结果序号为${i + 1}的描述不能为空`, 'failed', 4000);
                        } else {
                            Util.toast(`结果id为${this.resultList[i].id}的结果描述不能为空`, 'failed', 4000);
                        }
                        return false;
                    }
                }
                return true;
            },
            // 上传测试题头像
            handleTestPicSuccess(data) {
                this.testInfo.picture = data.entry[0];
            },
            // 得到当前操作的问题是哪一个
            getCurrentIndex(index) {
                this.currnetIndex = index;
                console.log(this.currnetIndex)
            },
            // 添加测试题的问题
            addQuestion() {
                this.questionList.push(JSON.parse(JSON.stringify(this.questionObj)));
            },
            // 上传问题配图
            handleQuestionPicSuccess(data) {
                this.questionList[this.currnetIndex].picture = data.entry[0];
            },
            // 删除问题配图
            delQuestionPic(index) {
                this.questionList[index].picture = '';
            },
            // 上移
            topMove(index) {
                if (index == 0) {
                    Util.toast('不能再上移了', 'notice', 4000);
                } else {
                    const oldData = this.questionList[index];
                    this.questionList.splice(index, 1);
                    this.questionList.splice(index - 1, 0, oldData);
                }
            },
            // 下移
            bottomMove(index) {
                if (index == (this.questionList.length - 1)) {
                    Util.toast('不能再下移了', 'notice', 4000);
                } else {
                    const oldData = this.questionList[index];
                    this.questionList.splice(index, 1);
                    this.questionList.splice(index + 1, 0, oldData);
                }
            },
            // 删除测试题弹窗
            showdeleteQuestionDialog(index) {
                const that = this;
                MessageBox.confirm('您确定要删除该测试题吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    that.questionList.splice(index, 1);
                }).catch(() => {});
            },
            // 添加问题的选项
            addOption(dadIndex) {
                this.questionList[dadIndex].funTestOptionDTOList.push(JSON.parse(JSON.stringify(this.optionObj)));
            },
            // 删除选项
            delOption(dadIndex, sonIndex) {
                this.questionList[dadIndex].funTestOptionDTOList.splice(sonIndex, 1);
            },
            // 删除结果
            showdeleteResultDialog(index) {
                const that = this;
                MessageBox.confirm('您确定要删除该结果吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    that.resultList.splice(index, 1);
                }).catch(() => {});
            },
            // 添加测试题的选项
            addResult() {
                this.resultList.push(JSON.parse(JSON.stringify(this.resultObj)));
            },
            // 上传结果配图
            handleResultPicSuccess(data) {
                this.resultList[this.currnetIndex].picture = data.entry[0];
            },
            // 删除结果配图
            delResultPic(index) {
                this.resultList[index].picture = '';
            },
        },
    };
</script>
<style>
@import '../../assets/common';
.operate-btn{
    display: block;
    margin: 2px auto;
}
.el-button+.el-button{
    margin: 2px auto;
}
.form-item{
    float: none !important;
}
.form-btn{
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
.p-item{
    text-align: center;
}
.img{
    border: 1px solid #cccccc;
}
.ipt60{
    width: 60px !important;
}
.test-pic{
    border-radius: 50%;
}
.add-test-pic-btn{
    margin-left: 30px;
    position: relative;
    top: 8px;
}
.add-question-pic-btn{
    display: block;
}
.del-question-pic-btn{
    display: block;
    margin: 5px 0px;
}
.el-table__expanded-cell{
    background-color: #cde !important;
}
</style>