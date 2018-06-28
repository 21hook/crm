/*
* @Author: 94078
* @Date:   2017-03-18 22:05:35
* @Last Modified by:   94078
* @Last Modified time: 2017-08-16 15:47:13
*/

import Vue from 'vue';
import ActivityList from './ActivityList.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<ActivityList/>',
    components: { ActivityList },
});
