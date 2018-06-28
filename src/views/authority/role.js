/*
* @Author: liyanfang
* @Date:   2017-09-12 15:09:09
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-12 15:12:28
*/

import Vue from 'vue';
import Role from './Role.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Role/>',
    components: { Role },
});
