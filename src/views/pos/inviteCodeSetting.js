/*
* @Author: huxiaofeng
* @Date:   2017-08-30 13:43:20
* @Last Modified by:   huxiaofeng
* @Last Modified time: 2017-08-30 13:44:12
*/

import Vue from 'vue';
import inviteCodeSetting from './inviteCodeSetting.vue';

// 生产模式时关闭
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    template: '<inviteCodeSetting/>',
    components: { inviteCodeSetting },
});
