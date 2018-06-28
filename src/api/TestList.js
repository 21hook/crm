import HTTP from './HTTP';
// 获取测试题列表
const getTestList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/funTest/getTestGameList', {
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
// 改变测试题 上／下线状态
const changeTestStatusById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/funTest/changeFunTestStatus', {
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
// 删除题目
const delTestById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/funTest/removeFunTest', {
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
// 发送模版消息
const sendMessageById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/funTest/sendMessage', {
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
    getTestList,
    changeTestStatusById,
    delTestById,
    sendMessageById,
};