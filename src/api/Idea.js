/*
 * @Author: liyanfang
 * @Date:   2017-08-17 16:33:24
 * @Last Modified by:   huxiaofeng
 * @Last Modified time: 2017-08-30 11:15:53
 */
import HTTP from './HTTP';

// 获取创意列表
const getIdeaList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activityCreative/query', data)
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

// 新建创意
const addIdea = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activityCreative/create', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(true);
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
// 更新创意
const updateIdea = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activityCreative/update', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(true);
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

// 删除创意
const deleteIdea = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activityCreative/delete', data)
            .then((response) => {
                if (response.data.status) {
                    resolve(true);
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
    getIdeaList,
    addIdea,
    updateIdea,
    deleteIdea,
};
