export default [
  {
    path: '/menu1',
    name: 'menu1',
    component: () => import(/* webpackChunkName: "menu1" */ '@/views/menu1/Index.vue')
  }
];
