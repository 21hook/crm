/*
* @Author: huxiaofeng
* @Date:   2017-08-17 16:33:24
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-18 15:21:05
*/

import HTTP from './HTTP';

const getCreative = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/activityCreative/queryCreativeByShopId', {
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

const getActivityList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/activity/queryActivityListByDevice', {
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
    getCreative,
    getActivityList,
};
