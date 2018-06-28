import HTTP from './HTTP';

// 通过testId获取测试信息
const getTestInfoByTestId = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/funTest/getInfoByFunTestId', {
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
// 编辑测试题
const updateFunTestById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/funTest/updateFunTest', data)
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
// 添加测试题
const addFunTest = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/funTest/uploadFunTest', data)
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
    getTestInfoByTestId,
    updateFunTestById,
    addFunTest,
};