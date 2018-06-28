/*
* @Author: liyanfang
* @Date:   2017-09-25 13:50:08
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-25 13:57:48
*/
import HTTP from './HTTP';

/**
 * [获取所有的用户组]
 * @return {[object]}
 * {
  "id":null,
  "name":null,
  "platform":null,
  "pageNo":1,
  "pageSize":10
}
 */
const getUserGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuserGroup/query.do', data)
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
 * [增加新的用户组]
 * @param  {[object]}
 * {
  "name":"红牛浙43北",
  "platform":1,
  "roleIds":[1,2]
}
 * @return {[object]}      [description]
 */
const addUserGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuserGroup/add.do', data)
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
 * 更新一个用户组
 * @param  {[object]}
 * {
  "id":"4",
  "name":"1",
  "platform":4,
  "roleIds":[1234]
}
 * @return {[object]}      [description]
 */
const updataUserGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/cuserGroup/update.do', data)
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
 * 删除指定用户组
 * @param  {[object]}
 * cuserGroupId=3
 * @return {[object]}      [description]
 */
const deleteUserGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/cuserGroup/delete.do', {
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

export default {
    getUserGroup,
    addUserGroup,
    updataUserGroup,
    deleteUserGroup,
};
