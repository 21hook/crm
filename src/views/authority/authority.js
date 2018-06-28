/*
* @Author: liyanfang
* @Date:   2017-09-12 15:05:17
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-12 15:12:14
*/
import Vue from 'vue';
import Authority from './Authority.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Authority/>',
    components: { Authority },
});
