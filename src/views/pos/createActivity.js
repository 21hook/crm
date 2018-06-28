/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:18:46
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:19:30
*/

import Vue from 'vue';
import CreateActivity from './CreateActivity.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<CreateActivity/>',
    components: { CreateActivity },
});
