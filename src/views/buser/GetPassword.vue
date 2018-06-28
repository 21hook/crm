<template>
    <div class="panel">
        <h3 class="title">找回密码</h3>
        <input placeholder="手机号" maxlength="11" autocomplete="off" class="panel-ipt" type="text"  v-model="userName" />
        <div class="panel-item clearfix">
            <input type="text" class="panel-ipt panel-ipt-sm" maxlength="4" v-model="messageCode" placeholder="短信验证码">
            <a class="btn-sm panel-button" :class="{disable:disable}" href="javascript:;" @click="sendAuthCode(60)">{{codeMessage}}</a>
        </div>
        <input placeholder="6-32位字符密码" maxlength="32" autocomplete="new-password" class="panel-ipt" type="password" v-model="password" />
        <input placeholder="确认密码" maxlength="32" autocomplete="new-password" class="panel-ipt" type="password" v-model="confirmPassword" />
        <p class="link-box clearfix">
            <a href="login.html" class="to-link">返回登录</a>
        </p>
        <a href="javascript:void(0);" class="panel-button" @click="register">确认</a>
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
                messageCode: '',
                confirmPassword: '',
                sendMessageTime: 60,
                disable: false,
                codeMessage: '获取短信',
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
            async sendAuthCode(time) {
                if (!this.userValidate()) {
                    Util.toast('请先输入正确的手机号', 'notice', 1500);
                    return false;
                }
                if (this.sendMessageTime === time) {
                    this.disable = true;
                    let timer = setInterval(() => {
                        if (this.sendMessageTime > 0) {
                            this.codeMessage = `已发送(${this.sendMessageTime}s)`;
                            this.sendMessageTime = this.sendMessageTime - 1;
                        } else {
                            clearInterval(timer);
                            timer = null;
                            this.disable = false;
                            this.codeMessage = '获取短信';
                        }
                    }, 1000);
                }
                try {
                    await UserlAPI.sendAuthCode({
                        mobile: this.userName,
                    });
                    Util.toast('短信发送成功', 'succeed', 1500);
                } catch (e) {
                    Util.toast(e, 'notice', 1500);
                }
                return true;
            },
            async register() {
                if (!this.userValidate()) {
                    Util.toast('请输入正确的手机号', 'notice', 1500);
                    return false;
                }
                if (this.messageCode.length !== 4) {
                    Util.toast('请输入4为验证码', 'notice', 1500);
                    return false;
                }
                if (this.password.length < 6 || this.password.length > 32) {
                    Util.toast('请输入6~32位密码', 'notice', 1500);
                    return false;
                }
                if (this.password !== this.confirmPassword) {
                    Util.toast('两次输入密码不一致', 'notice', 1500);
                    return false;
                }
                try {
                    const { status } = await UserlAPI.resetPwd({
                        mobile: this.userName,
                        pwd: this.password,
                        repwd: this.confirmPassword,
                        code: this.messageCode,
                    });
                    if (status) {
                        Util.setStorage('crm_userInfo', {
                            name: this.userName,
                            pwd: this.password,
                        });
                        Util.toast('成功找回密码', 'notice', 2000, () => {
                            location.href = 'login.html';
                        });
                    }
                } catch (e) {
                    Util.toast(e, 'notice', 2000);
                }
                return false;
            },
        },
    };
</script>

<style scoped>
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
    .panel .panel-ipt.panel-ipt-sm {
        width: 50%;
        float: left;
    }
    .panel .panel-item{
        padding: 0 10px;
    }
    .panel .panel-item .btn-sm{
        width: 30%;
        float: right;
    }
    .panel .panel-button.disable{
        background:#ccc;
        border:1px solid #ccc;
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
