/*
* @Author: liyanfang
* @Date:   2017-09-12 15:02:19
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-26 11:37:44
*/

import HTTP from './HTTP';

/**
 * 通过id获取所有的权限组
 * @param  {[object]}
 *  {
 *      pageNow:1,
 *      pageSize:10,
 *      parentId:0
 *  }
 * @return {[null]}
 */
const getAllAuthority = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authority/getAllAuthorityByParentId.do', {
            params: data,
        })
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
 * [添加权限，权限组]
 * @param  {[object]}
 * {
  "name":"nicai",
  "url":"{{url}}/authority/addAuthority.do",
  "parentId":"0",
  "type":"1"
}
 *  [description]
 * @return {[type]}      [description]
 */
const addAuthority = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authority/addAuthority.do', data)
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
 * [通过id更新权限]
 * @param  {[object]} data [description]
 * {
  "name":"nicai",
  "url":"{{url}}/authority/addAuthority.do",
  "parentId":"0",
  "type":"1",
  "authorityId":"1"
}
 * @return {[type]}      [description]
 */
const updateAuthorityById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authority/updateAuthorityById.do', data)
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
 * 通过id删除权限
 * @param  {[type]} data [description]
 * {
  "authorityId":"4"
}
 * @return {[type]}      [description]
 */
const deleteAuthorityById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authority/deleteAuthorityById.do', data)
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
 * 通过authorityId 获取所有的api
 * {authorityId:1,
 * pageSize:10,
 * pageNow:1
 * }
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const getApiByAuthorityId = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authorityApi/getApiByAuthorityId.do', {
            params: data,
        })
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
 * [通过authorityId 查询权限的信息]
 * @param  {[object]} data [description]
 * authorityId=3&pageSize=10&pageNow=1
 * @return {[type]}      [description]
 */
const getAuthorityDetail = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authority/getAuthorityDetail.do', {
            params: data,
        })
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
 * [通过权限组的名称获取所有的权限组]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const getAuthorityByName = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authority/getAuthorityByName.do', {
            params: data,
        })
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
    getAllAuthority,
    addAuthority,
    updateAuthorityById,
    deleteAuthorityById,
    getApiByAuthorityId,
    getAuthorityDetail,
    getAuthorityByName,
};
