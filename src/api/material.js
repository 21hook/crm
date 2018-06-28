/*
 * @Author: liyanfang
 * @Date:   2017-08-17 16:33:24
 * @Last Modified by:   liyanfang
 * @Last Modified time: 2017-08-31 10:35:16
 */
import HTTP from './HTTP';

/*
    获取活动列表
*/
const selectActivityList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/material/selectActivityList', {
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
 * [获取素材列表]
 * @param  {[Object]} data [description]
 * @return {[Promise]}      [data]
 */
const selectMaterialList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/material/selectMaterialList', {
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
 * [description]
 * @param  {[object]} data [description]
 * {
 *     activityId: 素材id,
        endTime: 结束时间
 * }
 * @return {[type]}      [description]
 */
const updateAdScanActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/poscrm/api/adScanActivity/updateAdScanActivity', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(response.data.status);
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

/*
    通过素材id 删除素材
    data:
    {
        id:素材id
    }
*/
const deleteMaterialById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/material/deleteMaterialById', data)
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
 * [添加素材]
 * @param  {[object]} data [description]
 * {
 *     activityName: 素材名称,
 *     list: this.goodsCodeList,    商品code 列表
 *     matterUrl,       素材链接
 *     deviceIds,       店铺id
 * }
 * @return {[type]}      [description]
 */
const createMaterial = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/spu/createMaterial', data)
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
 * [编辑素材]
 * @param  {[object]} data [description]
 * {
 *     id: 素材id,
 *     activityName: 素材名称,
 *     list: this.goodsCodeList,    商品code 列表
 *     matterUrl,       素材链接
 *     deviceIds,       店铺id
 * }
 * @return {[type]}      [description]
 */
const updateMaterial = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/spu/updateMaterial', data)
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
    selectActivityList,
    updateAdScanActivity,
    deleteMaterialById,
    createMaterial,
    selectMaterialList,
    updateMaterial,
};
