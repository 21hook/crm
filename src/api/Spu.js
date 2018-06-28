/*
 * @Author: liyanfang
 * @Date:   2017-08-17 16:33:24
 * @Last Modified by:   liyanfang
 * @Last Modified time: 2017-09-05 21:09:45
 * spu 为条形码的相关接口
 */

import HTTP from './HTTP';

/*
    获取素材列表
    data:
    {
        barcode: 商品条形码
    }
*/
const selectSpubyBarcode = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/spu/selectSpubyBarcode', data)
            .then((response) => {
                if (response.data.status) {
                    const data = response.data.entry;
                    const operatorData = {
                        barcode: data.barcode,
                        brand: data.brand,
                        itemName: data.name,
                        property: data.property,
                        unit: data.unit,
                    };
                    resolve(operatorData);
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
    获取spuid获取商品和设备列表
    data:
    {
        id: 商品条形码,
        pageNow:1,
        pageSize: 10,
    }
*/
const selectSpuById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/spu/selectSpuById', {
            params: data,
        })
            .then((response) => {
                if (response.data.status) {
                    const data = response.data.entry;
                    const returnData = {};
                    returnData.goods = [];
                    for (const k in data) {
                        if (k === 'deviceIds') {
                            returnData.deviceIds = data.deviceIds.toString();
                        } else {
                            const operatorData = {
                                barcode: data[k].barcode,
                                brand: data[k].brand,
                                itemName: data[k].name,
                                property: data[k].property,
                                unit: data[k].unit,
                            };
                            returnData.goods.push(operatorData);
                        }
                    }
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

/*
*   查询活动商品
*  data:

    {
        barcode: 条形码 string
    }
*
*/

const query = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/itemcenter/spu/query', {
            params: data,
        })
            .then((response) => {
                if (response.data.status && response.data.entry) {
                    resolve(response.data.entry);
                } else {
                    reject(response.data.message || '没有查询到对应的条码商品');
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

export default {
    selectSpubyBarcode,
    query,
    selectSpuById,
};
