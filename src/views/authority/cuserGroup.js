/*
* @Author: liyanfang
* @Date:   2017-09-25 10:13:48
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-26 15:39:57
*/
import Vue from 'vue';
import CuserGroup from './CuserGroup.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<CuserGroup/>',
    components: { CuserGroup },
});
