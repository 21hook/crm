/*
* @Author: liyanfang
* @Date:   2017-10-10 13:56:43
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-10-10 13:59:53
*/
import HTTP from './HTTP';

// 模拟用户登陆，解决session问题
const login = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/blogin.do', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data.message);
                } else {
                    reject(response.data.message);
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/* 注册用户
    参数 mobile
*/
const sendAuthCode = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/sendAuthCode.do', {
            params: data,
        })
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data.message);
                } else {
                    reject(response.data.message);
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/* 注册用户
 参数
 mobile:,
 pwd: ,
 repwd:,
 code:
 */
const resetPwd = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/pos_reset_pwd.do', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data);
                } else {
                    reject(response.data.message);
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

export default {
    login,
    sendAuthCode,
    resetPwd,
};
