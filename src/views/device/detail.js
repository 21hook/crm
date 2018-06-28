/*
* @Author: 94078
* @Date:   2017-03-18 22:05:35
* @Last Modified by:   94078
* @Last Modified time: 2017-08-15 11:48:17
*/

import Vue from 'vue';
import Detail from './Detail.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Detail/>',
    components: { Detail },
});
