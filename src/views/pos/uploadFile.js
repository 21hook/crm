/*
* @Author: liyanfang
* @Date:   2017-08-30
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-30 10:24:14
*/

import Vue from 'vue';
import UploadFile from './UploadFile.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<UploadFile/>',
    components: { UploadFile },
});
