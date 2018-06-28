/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:25:19
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:25:52
*/

import Vue from 'vue';
import RadioList from './RadioList.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<RadioList/>',
    components: { RadioList },
});
