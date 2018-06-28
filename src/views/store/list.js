/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:21:42
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:22:07
*/

import Vue from 'vue';
import List from './List.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<List/>',
    components: { List },
});
