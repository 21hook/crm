/*
* @Author: jikaiyang
* @Date:   2017-10-17 17:37:27
* @Last Modified by:   aifocus
* @Last Modified time: 2017-10-17 18:03:59
*/
import Vue from 'vue';
import EditTest from './EditTest.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<EditTest/>',
    components: { EditTest },
});
