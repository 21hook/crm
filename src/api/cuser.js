/*
* @Author: liyanfang
* @Date:   2017-09-25 13:50:22
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-10-10 14:57:27
*/
/**
 * 禁用用户
 * @param  {[object]}
 * {
 * cuserId:11
 * }
 * @return {[type]}      [description]
 */
import HTTP from './HTTP';

const disableUser = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/cuser/disable.do', {
            params: data,
        })
            .then((response) => {
                if (response.data && response.data.status) {
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
/**
 * 启用用户
 * @param  {[object]}
 * {
 * cuserId:11
 * }
 * @return {[type]}      [description]
 */
const enableUser = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/cuser/enable.do', {
            params: data,
        })
            .then((response) => {
                if (response.data && response.data.status) {
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
/**
 * 通过手机得到用户是否存在
 * @param  {[object]}
 * {
  "mobile": mobile
}
 * @return {[type]}      [description]
 */
const getUserNameByMobile = (data) => {
    console.log(data)
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuser/queryBase.do', data)
            .then((response) => {
                if (response.data && response.data.status) {
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
/**
 * 增加用户
 * @param  {[object]}
 * {
  "cUserDetailDTO":{
    "realName":"abc",
    "mobile":12345678902,
    "platform":2,
    "cuserGroupId":2
   },
  "roleIds":[12,234]
}
 * @return {[type]}      [description]
 */
const addUser = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuser/add.do', data)
            .then((response) => {
                if (response.data && response.data.status) {
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

/**
 * 获取用户
 * @param  {[object]}
 * {
  "mobile":null,
  "id":null,
  "cuserGroupId":2,
  "platform":3,
  "realName":"a",
  "pageNo":1,
  "pageSize":10
}
 * @return {[type]}      [description]
 */
const getUser = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuser/query.do', data)
            .then((response) => {
                if (response.data && response.data.status) {
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

/**
 * 更改用户信息
 * @param  {[object]}
 * {
  "cUserDetailDTO":{
    "id":12,
    "realName":"abc",
    "mobile":12345678909
   },
  "roleIds":[1]
}
 * @return {[type]}      [description]
 */
const updateUser = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuser/update.do', data)
            .then((response) => {
                if (response.data && response.data.status) {
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
    disableUser,
    enableUser,
    getUserNameByMobile,
    addUser,
    getUser,
    updateUser,
};
