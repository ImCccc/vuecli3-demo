import Vue from 'vue';
const routerContext = require.context('./', true, /\.js$/);
routerContext.keys().forEach(route => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith('./index')) return;
  const Module = routerContext(route);
  Vue.use(Module.default);
});
