/*
* @Author: liyanfang
* @Date:   2017-09-25 10:14:19
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-26 15:39:44
*/
import Vue from 'vue';
import Cuser from './Cuser.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<Cuser/>',
    components: { Cuser },
});
