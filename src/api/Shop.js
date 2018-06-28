/*
* @Author: Hxf1996
* @Date:   2017-08-17 09:12:04
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-08-31 18:07:18
*/

import HTTP from './HTTP.js';

/**
 * [获取店铺分组]
 * @return {[Promise]}
 */
const getShopGroup = () => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/shopGroup/queryShopGroup')
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

const queryShopByFilterKeys = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/queryShopByFilterKeys', data)
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

const selectShopByIdAndName = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/selectShopByIdAndName', data)
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

const queryShopByShopId = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/queryShopByShopId', data)
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

const updateShopByKeys = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/updateShopByKeys', data)
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

const queryShopByKeys = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/queryShopByKeys', data)
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

const createShopGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/shopGroup/createShopGroup', data)
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

const updateShopGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/shopGroup/updateShopGroup', data)
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

const deleteShopGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/shop/shopGroup/deleteShopGroup', data)
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

export default {
    getShopGroup,
    queryShopByFilterKeys,
    selectShopByIdAndName,
    queryShopByShopId,
    updateShopByKeys,
    createShopGroup,
    updateShopGroup,
    deleteShopGroup,
    queryShopByKeys,
};
