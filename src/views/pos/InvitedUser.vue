<template>
    <div class="cr-page-content">
        <h2 class="cr-page-title"><a href="inviteCodeSetting.html" class="link">邀请码配置</a> > 被邀请用户</h2>
        <div class="cr-panel">
            <p class="plane-item">邀请码：{{inviteCode}}</p>
            <p class="plane-item">绑定用户：{{bindUser}}</p>
            <p class="plane-item">已邀请次数：{{inviteTime}}</p>
        </div>
        <div class="cr-panel">
            <el-table element-loading-text="拼命加载中" v-loading.body="isLoading" :data="codeUseList" >
                <el-table-column label="邀请id" prop="id"></el-table-column>
                <el-table-column label="被邀请人" prop="userNick"></el-table-column>
                <el-table-column label="被邀请人手机号" prop="mobile"></el-table-column>
                <el-table-column label="被邀请时间" prop="gmtCreate"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        Pagination,
        Button,
        Table,
        TableColumn,
        Loading,
    } from 'element-ui';
    import Util from '@/libs/util';
    import inviteCodeApi from '@/api/InvitationCode';

    Vue.use(Pagination);
    Vue.use(Button);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Loading);
    export default {
        data() {
            return {
                inviteCode: '',
                bindUser: '',
                inviteTime: 0,
                codeUseList: [],
                isLoading: true,
            };
        },
        mounted() {
            this.inviteCode = Util.getUrlParam('code');
            this.getInvitationCodeUsage();
        },
        methods: {
            async getInvitationCodeUsage() {
                try {
                    const entry = await inviteCodeApi.getInvitationCodeUsage({
                        code: this.inviteCode,
                        t: new Date().getTime(),
                    });
                    this.bindUser = entry.ownerName;
                    this.inviteTime = entry.useCount;
                    this.codeUseList = entry.codeUsage;
                } catch (e) {
                    Util.toast(e, 'notice', 1500);
                } finally {
                    this.isLoading = false;
                }
            },
        },
    };
</script>
<style type="text/css">
@import '../../assets/common';
</style>