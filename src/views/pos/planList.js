/*
* @Author: huxiaofeng
* @Date:   2017-08-24 15:19:43
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-24 15:20:29
*/

import Vue from 'vue';
import PlanList from './PlanList.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<PlanList/>',
    components: { PlanList },
});
