<template>
    <div class="panel">
        <h3 class="title">商户登录</h3>
        <input placeholder="username" maxlength="11" autocomplete="off" class="panel-ipt" type="text"  v-model="userName" @input="userValidate" />
        <input placeholder="password" maxlength="32" autocomplete="new-password" class="panel-ipt" type="password" v-model="password" />
        <p class="link-box clearfix">
            <a href="getPassword.html" class="to-link fl-r">找回密码</a>
        </p>
        <a href="javascript:void(0);" class="panel-button" @click="login">登录</a>
    </div>
</template>
<script>

    import Util from '@/libs/util';
    import UserlAPI from '@/api/BusinessUser';

    export default {
        data() {
            return {
                userName: '',
                password: '',
            };
        },
        methods: {
            userValidate() {
                const phoneValidate = /^1(2|3|4|5|7|8)\d{9}$/;
                if (phoneValidate.test(this.userName)) {
                    return true;
                }
                return false;
            },
            async login() {
                if (!this.userValidate()) {
                    Util.toast('请输入正确的手机号', 'notice', 1500);
                    return false;
                }
                if (this.password.length <= 0) {
                    Util.toast('密码不能为空', 'notice', 1500);
                    return false;
                }
                try {
                    const message = await UserlAPI.login({
                        mobile: this.userName,
                        password: this.password,
                    });
                    Util.setStorage('crm_userInfo', {
                        name: this.userName,
                        pwd: this.password,
                    });
                    if (!message) {
                        Util.toast('登录成功', 'notice', 1500);
                    } else {
                        Util.toast(message, 'notice', 1500);
                    }
                    let redirectUrl = Util.getUrlParam('redirectUrl') && decodeURIComponent(Util.getUrlParam('redirectUrl'));
                    if (!redirectUrl) {
                        redirectUrl = '../page/market/ideaList.html';
                    }
                    location.href = redirectUrl;
                } catch (e) {
                    Util.toast(e, 'notice', 2000);
                }
                return false;
            },
        },
        mounted() {
            const userInfo = Util.getStorage('crm_userInfo');
            this.userName = userInfo.name;
            this.password = userInfo.pwd;
        },
    };
</script>

<style>
    @import '../../assets/common';
    .panel{
        width: 425px;
        border-radius: 5px;
        margin: 180px auto;
        padding: 35px 35px 55px;
        background: #fff;
        border: 1px solid #eaeaea;
        text-align: center;
    }

    .panel .title {
        font-size: 20px;
        font-weight: 100;
        margin: 0 auto 40px;
        text-align: center;
        color: #505458;
    }

    .panel .panel-ipt {
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        color: #1f2d3d;
        display: inline-block;
        height: 36px;
        outline: 0;
        padding: 3px 10px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 90%;
        font-size: 16px;
        margin-bottom: 20px;
    }
    .panel .panel-button {
        width: 90%;
        height: 36px;
        line-height: 36px;
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        border-radius: 4px;
        outline: 0;
        margin: 0;
        display: inline-block;
        cursor: pointer;
        padding: 5px 10px;
        font-size: 16px;
        letter-spacing: 2px;
        font-weight: 100;
    }

    .panel .panel-button:hover {
        background: #4db3ff;
        border-color: #4db3ff;
        color: #fff;
    }

    .panel .tips {
        text-align: left;
        padding: 0 20px;
    }
    .panel .link-box {
        margin-bottom: 20px;
        text-align: left;
        padding: 0 20px;
    }
    .panel .to-link {
        color: #1f2d3d;
        font-size: 14px;
    }

    .panel .to-link.fl-r {
        float: right;
    }

    .mb-20 {
        margin-bottom: 20px;
    }

</style>
