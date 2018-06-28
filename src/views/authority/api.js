/*
* @Author: liyanfang
* @Date:   2017-09-12 15:09:09
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-12 15:11:38
*/

import Vue from 'vue';
import Api from './Api.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Api/>',
    components: { Api },
});
