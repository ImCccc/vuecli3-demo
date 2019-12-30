import Vue from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
import store from '@/store/index.js';

// 字体图标样式
import '@/assets/styles/iconfont/iconfont.css';

// 加载全局样式
import '@/assets/styles/index.scss';

// 加载全局过滤器
import './filters';

// 加载全局插件
import './plugins';

// ElementUI
import ElementUI from 'element-ui';
import '@/assets/styles/element-theme.scss';

// 弹窗可拖动
import ElDialog from '@/components/element-dialog/ElDialog.vue';

Vue.use(ElementUI, { size: 'medium' });
Vue.component('ElDialog', ElDialog);
Vue.config.productionTip = false;

// 路由权限拦截
router.beforeEach((to, from, next) => {
  const path = to.path;
  const { allMenu, authMenu } = store.getters;
  // 确保是左侧栏页面菜单的跳转， 并没有权限
  if (allMenu.find(item => item.path === path) && !authMenu.includes(path)) return next('/');
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
