export default [
  {
    path: '/menu21',
    name: 'menu21',
    component: () => import(/* webpackChunkName: "menu21" */ '@/views/menu2/menu21/Index.vue')
  },
  {
    path: '/menu22',
    name: 'menu22',
    component: () => import(/* webpackChunkName: "menu22" */ '@/views/menu2/menu22/Index.vue')
  },
];
