/*
* @Author: 94078
* @Date:   2017-08-16 14:10:50
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-04 17:46:03
*/
import HTTP from './HTTP';

/**
 * [获取设备类型信息]
 * @param  {[Object]} data [查询信息]
 * @return {[Promise]}
 */
const getAllDeviceType = (data = {}) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/getAllDeviceType', {
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
 * [获取设备分组信息]
 * @param  {
 * pageNo=1,
 * pageSize=10
 * } data [description]
 * @return {[type]}      [description]
 */
const getDeviceGroup = (data = {}) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/getDeviceGroup', {
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
 * [通过keys查询设备]
 * @param  {[Object]} data [查询信息]
 * @return {[Promise]}
 */
const getDeviceGroupByType = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/getDeviceGroupByDeviceTypeId', {
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

const getDeviceByKey = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/device/queryDeviceByKeys', data)
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
 * [控制设备运行时间]
 * @param  {[Object]} data [设备]
 * @return {[Promise]}
 */
const switchRunTime = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/control/switchRunTime', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/**
 * [控制设备关闭]
 * @param  {[Object]} data [设备]
 * @return {[Promise]}
 */
const shutDown = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/control/shutdown', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/**
 * [设备重启]
 * @param  {[Object]} data [设备]
 * @return {[Promise]}
 */
const reboot = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/control/reboot', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/**
 * [控制设备音量]
 * @param  {[Object]} data [设备]
 * @return {[Promise]}
 */
const controlVoice = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/control/voice', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/**
 * [添加设备分组]
 * @param  {[Object]} data [设备分组信息]
 * @return {[Promise]}
 */
const createDeviceGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/deviceGroup/addDeviceGroup', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};

/**
 * [删除设备分组]
 * @param  {[Object]} data [设备]
 * @return {[Promise]}
 */

const deleteDeviceGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/deleteDeviceGroup', {
            params: data,
        })
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

/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const deviceDeactivate = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/device/deactivate', {
            params: data,
        })
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};
/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const uploadLog = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/procurement/client/inputEvent', data)
            .then((response) => {
                resolve(response.data.message);
            })
            .catch(() => {
                reject('网络不稳定请刷新重试！');
            });
    });
    return promise;
};
/**
 * [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const getDeviceActivateInfo = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/device/getDeviceActivateInfo', {
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

/**
 * [获取品牌下拉框内容]
 * @return {[Promise]} [description]
 */
const getBrandList = () => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/getBrandList')
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

/**
 * [获取型号列表]
 * @param  {[Object]} data
 * @return {[Promise]}      [description]
 */
const getModelByBrand = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/getModelByBrand', {
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

/**
 * [获取操作系统列表]
 * @return {[Promise]}      [description]
 */
const getOperationSystemList = () => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/getOperationSystemList')
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

/**
 * [获取屏幕大小列表]
 * @return {[Promise]} [description]
 */
const getScreenSizeList = () => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/getScreenSizeList')
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

/**
 * [设备查询]
 * @return {[Promise]} [description]
 */
const query = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/deviceModel/query', data)
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
 * [删除设备]
 * @param  {[Object]} data
 * @return {[Promise]}
 */
const deleteDevice = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/delete', {
            params: data,
        })
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

/**
 * [添加设备]
 * @param  {[Object]} data
 * @return {[Promise]}      [description]
 */
const createDevice = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/deviceModel/add', data)
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

/**
 * [更新设备信息]
 * @param  {[Object]} data
 * @return {[Promise]}      [description]
 */
const update = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/deviceModel/update', data)
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

/**
 * [添加设备类型]
 * @param  {[Object]} data
 * {
 *     name: 设备名
 * }
 * @return {[Promise]}      [description]
 */
const addDeviceType = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/deviceGroup/addDeviceType', data)
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

/**
 * [删除设备类型]
 * @param  {[Object]} data
 * @return {[Promise]}      [description]
 */
const deleteDeviceType = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceModel/deleteDeviceType', {
            params: data,
        })
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

/**
 * [删除设备类型]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const deviceGroup = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/deleteDeviceType', {
            params: data,
        })
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

/**
 * [获取设备类型]
 * @param  {[Object]} data [description]
 * @return {[Promise]}      [description]
 */
const getDeviceType = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/deviceGroup/getDeviceType', {
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

const queryList = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/toolUpgrade/queryList', {
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

const deleteById = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.get('/dacq/toolUpgrade/deleteById', {
            params: data,
        })
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

const updateToolUpgrade = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/toolUpgrade/updateToolUpgrade', data)
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

const insertToolUpgrade = (data) => {
    const promise = new Promise((resolve, reject) => {
        HTTP.post('/dacq/toolUpgrade/insertToolUpgrade', data)
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
    getDeviceGroup,
    getDeviceByKey,
    switchRunTime,
    shutDown,
    reboot,
    controlVoice,
    createDeviceGroup,
    deleteDeviceGroup,
    deviceDeactivate,
    uploadLog,
    getDeviceGroupByType,
    getDeviceActivateInfo,
    getBrandList,
    getModelByBrand,
    getOperationSystemList,
    getScreenSizeList,
    query,
    deleteDevice,
    createDevice,
    update,
    addDeviceType,
    deleteDeviceType,
    getDeviceType,
    queryList,
    deleteById,
    insertToolUpgrade,
    updateToolUpgrade,
    getAllDeviceType,
    deviceGroup,
};
