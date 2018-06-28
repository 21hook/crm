/*
* @Author: 94078
* @Date:   2017-03-18 22:05:35
* @Last Modified by:   94078
* @Last Modified time: 2017-08-16 15:46:32
*/

import Vue from 'vue';
import Model from './Model.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Model/>',
    components: { Model },
});
