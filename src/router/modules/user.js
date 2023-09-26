export default [
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/forget-password',
    name: 'forgetPassword',
    component: () => import('@/views/login/forget-password.vue'),
  },
];
