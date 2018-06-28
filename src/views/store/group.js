/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:21:16
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:21:35
*/

import Vue from 'vue';
import Group from './Group.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Group/>',
    components: { Group },
});
