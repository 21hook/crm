/*
* @Author: liyanfang
* @Date:   2017-09-01 10:59:12
* @Last Modified by:   liyanfang
* @Last Modified time: 2017-09-01 11:00:23
*/

import Vue from 'vue';
import InvitedUser from './InvitedUser.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<InvitedUser/>',
    components: { InvitedUser },
});
