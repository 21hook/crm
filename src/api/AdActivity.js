/*
 * @Author: liyanfang
 * @Date:   2017-08-17 16:33:24
 * @Last Modified by:   liyanfang
 * @Last Modified time: 2017-08-30 16:12:59
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
const queryAllAdScanActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/poscrm/api/adScanActivity/queryAllAdScanActivity', {
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

/*
*   插入活动商品
*  data:

    {
        barcode: 条形码 string
    }
*
*/

const insertAdScanActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('poscrm/api/adScanActivity/insertAdScanActivity', data)
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

/*
*   插入活动商品
*  data:

    {
        id: 活动id
        isDelete : 1删除
    }
或
    {
        id: this.curActivityId,
        tartTime: Util.formatDateNew(new Date(self.startTime), 'yyyy-MM-dd HH:mm:ss'),
        endTime: Util.formatDateNew(new Date(self.endTime), 'yyyy-MM-dd HH:mm:ss')
    }

*
*/

const updateAdScanActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/poscrm/api/adScanActivity/updateAdScanActivity', data)
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
    queryAllAdScanActivity,
    insertAdScanActivity,
    updateAdScanActivity,
};
