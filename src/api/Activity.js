import HTTP from './HTTP'

//  获取活动列表
const getActivityList = (data = {
    pageSize: 10,
    pageNow: 1,
}) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/procurement/activity/queryActivityList', {
            params: data,
        })
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}
// 删除活动
const deleteActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activity/deleteActivity', data)
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}
// 更新活动状态
const updateActivityStatus = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activity/updateActivityStatus', data)
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}
// 查询活动列表
const query = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activityCreative/query', data)
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}

// 创建活动
const createActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activity/createActivity', data)
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}
// 更新活动
const updateActivity = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/activity/updateActivity', data)
            .then((response) => {
                if (response.data && response.data.status) {
                    resolve(response.data)
                } else {
                    reject(response.data.message)
                }
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！')
            })
    })
    return promise
}

export default {
    getActivityList,
    deleteActivity,
    updateActivity,
    query,
    createActivity,
    updateActivityStatus,
}
