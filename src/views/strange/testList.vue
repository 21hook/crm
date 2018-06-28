<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title">测试题列表</h2>
        <form class="cr-form cr-form-float">
            <div class="cr-panel clearfix">
                <el-button type="primary" @click="addTest()">添加测试题</el-button>
            </div>
        </form>
        <div class="cr-panel">
            <el-table :data="testList" v-loading.body="isLoading">
                <el-table-column prop="id" label="测试id"></el-table-column>
                <el-table-column prop="type" label="测试类型">
                    <template scope="item">
                        {{item.row.type == 2 ? '结果题' : '积分题'}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="测试名"></el-table-column>
                <el-table-column prop="description" label="测试描述" width="150px"></el-table-column>
                <el-table-column prop="picture" label="测试头像">
                    <template scope="item">
                        <img :src="imgCdnPath + item.row.picture" width="50px" height="50px"></img>
                    </template>
                </el-table-column>
                <el-table-column prop="shareQuestionTitle" label="问题分享文案"></el-table-column>
                <el-table-column prop="shareResultTitle" label="结果分享文案"></el-table-column>
                <el-table-column label="操作" header-align="center">
                    <template scope="item">
                        <el-button class="operate-btn" size="small" type="warning" @click="changeTestStatus(item.row.id, 0)" v-if="item.row.status == 1">下线</el-button>
                        <el-button class="operate-btn" size="small" type="success" @click="changeTestStatus(item.row.id, 1)" v-if="item.row.status == 0">上线</el-button>
                        <el-button class="operate-btn" size="small" type="primary" @click="editTest(item.row.id)">详情</el-button>
                        <el-button class="operate-btn" size="small" type="danger" @click="showdeleteDialog(item.row.id)">删除</el-button>
                        <el-button class="operate-btn" size="small" type="primary" @click="showSendMessageDialog(item.row.id)">发送模版消息</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    } from 'element-ui';

    import Util from '@/libs/util';
    import { baseURL } from '@/api/HTTP';
    import TestListApi from '@/api/TestList';

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
    export default {
        data() {
            return {
                imgCdnPath: 'http://cdn.elephtribe.com/',
                testList: [],
                isLoading: true,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getTestList();
            },
            // 获取测试列表
            async getTestList() {
                try {
                    const data = await TestListApi.getTestList();
                    this.testList = data;
                    this.isLoading = false;
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            },
            // 改变测试题 上、下架
            async changeTestStatus(id, status) {
                try {
                    const params = {
                        funTestId: id,
                        status,
                    };
                    await TestListApi.changeTestStatusById(params);
                    if (status) {
                        Util.toast('上线成功', 'succeed', 1500);
                    } else {
                        Util.toast('下线成功', 'succeed', 1500);
                    }
                    this.getTestList();
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            },
            // // 删除测试题
            async delTest(id) {
                try {
                    const params = {
                        funTestId: id,
                    };
                    await TestListApi.delTestById(params);
                    Util.toast('删除成功', 'succeed', 1500);
                    this.getTestList();
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            },
            showSendMessageDialog(id) {
                const sendMessage = this.sendMessage;
                MessageBox.confirm('您确定要发送模版消息吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    sendMessage(id);
                }).catch(() => {});
            },
            // 发送模版消息
            async sendMessage(id) {
                try {
                    const params = {
                        funTestId: id,
                    };
                    await TestListApi.sendMessageById(params);
                    Util.toast('发送成功', 'succeed', 1500);
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            },
            // // 删除测试题弹窗
            showdeleteDialog(id) {
                const delTest = this.delTest;
                MessageBox.confirm('您确定要删除该测试题吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    delTest(id);
                }).catch(() => {});
            },
            // 修改测试题
            editTest(id) {
                try {
                    location.href = `./editTest.html?testId=${id}`;
                } catch (err) {
                    Util.toast(err, 'failed', 1500);
                }
            },
            // 添加测试题
            addTest() {
                location.href = './editTest.html';
            },
        },
    };
</script>
<style scoped>
@import '../../assets/common';
.operate-btn{
    display: block;
    margin: 2px auto;
}
</style>