import Vue from 'vue';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import './assets/styles/index.scss'; // global css
import './permission'; // permission control
import EventBus from '@/utils/event-bus';

// 引入自定义组件库
import Components from '@/components'
Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

// 全局注册事件总线
Vue.prototype.$eventBus = EventBus;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app'); 