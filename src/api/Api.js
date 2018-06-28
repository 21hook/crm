/*
* @Author: liyanfang
* @Date:   2017-09-12 15:02:19
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-18 16:14:31
*/

import HTTP from './HTTP';

/**
 * 获取所有的api列表（带分页）
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const getAllApi = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/api/getAllApi.do', data)
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
/**
 * 通过id删除api
 * @param  {[object]} data [description]
 * {
  "apiId":"5"
}
 * @return {[type]}      [description]
 */
const deleteApiById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/api/deleteApiById.do', data)
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

/**
 * [新增api]
 * @param  {[object]}
 *  {
 *      "name":"访问控制api",
 *      "url":"{{url}}/api/addApi.do",
 *      "type":"3",
 *      "system":"1"
 * }
 *  [description]
 * @return {[object]}      [description]
 */
const addApi = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/api/addApi.do', data)
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
/**
 * [更新api]
 * @param  {[object]}
 *  {
 *      "apiId":"5",
 *      "name":"访问控制api",
 *      "url":"{{url}}/api/addApi.do",
 *      "type":"3",
 *      "system":"1"
 * }
 *  [description]
 * @return {[object]}
 */
const updateApi = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/api/updateApi.do', data)
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
    getAllApi,
    deleteApiById,
    addApi,
    updateApi,
};
