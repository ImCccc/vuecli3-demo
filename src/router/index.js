import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/Index.vue';
Vue.use(Router);

const IndexRoute = {
  path: '/',
  component: Layout,
  // redirect: '/deviceMonitor', // 默认打开监控页面
  children: []
};

let routes = [
  IndexRoute,
  {
    path: '/404',
    meta: { title: '404' },
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
];

const routerContext = require.context('./', true, /index\.js$/);
routerContext.keys().forEach(route => {
  // 忽略 当前路径的index.js 和  > 3级目录
  if (route.startsWith('./index') || route.split('/').length > 3) return;
  const routerModule = routerContext(route);

  IndexRoute.children = [
    ...IndexRoute.children,
    ...routerModule.default
  ];
});

export default new Router({
  mode: 'hash',
  routes
});
