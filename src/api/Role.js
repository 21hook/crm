/*
* @Author: liyanfang
* @Date:   2017-09-12 15:02:19
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-26 12:26:30
*/

import HTTP from './HTTP';

/**
 * 获取所有的权限角色（带分页）
 * @param  {[object]}
 * {
 *     pageNow:1,
 *     pageSize:10,
 * }
 *   [description]
 * @return {[type]}      [description]
 */
const getAllAuthorityRole = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authorityRole/getAllAuthorityRole.do', {
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
 * 通过roleId删除角色
 * @param  {[object]}
 * {roleId:1}
 *  [description]
 * @return {[type]}      [description]
 */
const deleteAuthorityRoleById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authorityRole/deleteAuthorityRoleById.do', data)
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
 * [新增角色]
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
const addAuthorityRole = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authorityRole/addAuthorityRole.do', data)
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
const updateAuthorityRoleById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authorityRole/updateAuthorityRoleById.do', data)
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
 * 根据平台或名称查角色
 * @param  {[object]}
 * {
 * platform:1,
 * name:2
 * }
 * @return {[type]}      [description]
 */
const getRoleByPlatformName = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authorityRole/query.do', {
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
 * 根据用户组的id查角色
 * @param  {[object]}
 * {cUserGroupId:1}
 * @return {[type]}      [description]
 */
const queryRoleByCUserGroupId = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/member/authorityRole/queryByCUserGroupIds.do', data)
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
 * 根据用户id查角色
 * @param  {[object]}
 * {cUserId:10}
 * @return {[type]}      [description]
 */
const queryByCUserId = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/member/authorityRole/queryByCUserId.do', {
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
    getAllAuthorityRole,
    deleteAuthorityRoleById,
    addAuthorityRole,
    updateAuthorityRoleById,
    getRoleByPlatformName,
    queryRoleByCUserGroupId,
    queryByCUserId,
};
