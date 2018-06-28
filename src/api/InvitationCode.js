/*
* @Author: huxiaofeng
* @Date:   2017-08-30 14:14:32
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-01 13:52:23
*/

import HTTP from './HTTP';

// 获取邀请码列表
const getInvitationCodeList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/member/getInvitationCodeList.do', {
            params: data,
        })
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data.entry);
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

const addInvitationCode = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/member/addInvitationCode.do', data)
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

const getInvitationCode = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/member/getInvitationCode.do', {
            params: data,
        })
            .then((response) => {
                if (response.data.status) {
                    const result = response.data.entry;
                    const returnData = {
                        validDay: Math.ceil((new Date(result.expiryDate).getTime() - new Date().getTime()) / 1000 / 3600 / 24),
                        totalCount: result.totalCount,
                        id: result.id,
                        code: result.code,
                        useCount: result.useCount,
                    };
                    resolve(returnData);
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

const updateInvitationCode = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/member/updateInvitationCode.do', data)
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

/**
 * [通过code查询邀请码被使用次数]
 * @param  {[object]} data [description]
 * {
 *     code ：邀请码,
 *     t: 时间搓 毫秒
 * }
 * @return {[object]}      [description]
 */
const getInvitationCodeUsage = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/member/getInvitationCodeUsage.do', {
            params: data,
        })
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data.entry);
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
    getInvitationCodeList,
    addInvitationCode,
    getInvitationCode,
    updateInvitationCode,
    getInvitationCodeUsage,
};
