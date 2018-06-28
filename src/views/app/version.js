/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:05:36
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:18:21
*/

import Vue from 'vue';
import Version from './Version.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Version/>',
    components: { Version },
});
