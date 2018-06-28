/*
 * @Author: liyanfang
 * @Date:   2017-08-17 16:33:24
 * @Last Modified by:   huxiaofeng
 * @Last Modified time: 2017-08-30 10:21:49
 */
import HTTP from './HTTP';

// 获取制造创意的作者
const getIdeaAuthor = () => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/activityCreative/authorList')
            .then((response) => {
                if (response.data && response.data.status) {
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
    getIdeaAuthor,
};
