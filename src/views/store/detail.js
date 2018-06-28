/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:20:47
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:21:07
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
