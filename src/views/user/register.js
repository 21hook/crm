/*
 * @Author: liyanfang
 * @Date:   2017-03-18 22:05:35
 * @Last Modified by:   liyanfang
 * @Last Modified time: 2017-08-16 15:47:58
 */

import Vue from 'vue';
import Register from './Register.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Register/>',
    components: { Register },
});
