export default [
  {
    path: '/help',
    name: 'helpLayout',
    redirect: '/help/index',
    component: () => import('@/components/Layout/help.vue'),
    children: [
      {
        meta: {
          title: '新手教程',
          index: 'index',
        },
        path: 'index',
        name: 'helpIndex',
        component: () => import('@/views/help/index.vue'),
      },
      // 常见问题
      {
        meta: {
          title: '常见问题',
          index: 'question',
        },
        path: 'question',
        name: 'helpQuestion',
        component: () => import('@/views/help/question/index.vue'),
      },
      // 品牌实力
      {
        meta: {
          title: '品牌实力',
          index: 'helpBrand',
        },
        path: 'brand',
        name: 'helpBrand',
        component: () => import('@/views/help/brand/index.vue'),
      },
      // 游戏手册
      {
        meta: {
          title: '游戏手册',
          index: 'helpManual',
        },
        path: 'manual',
        name: 'helpManual',
        component: () => import('@/views/help/manual/index.vue'),
      },
      // 安全保障
      {
        meta: {
          title: '安全保障',
          index: 'helpSecurity',
        },
        path: 'security',
        name: 'helpSecurity',
        component: () => import('@/views/help/security/index.vue'),
      },
      {
        meta: {
          title: '帮助详情',
          layout: false,
        },
        path: 'detail/:type',
        name: 'helpDetail',
        component: () => import('@/views/help/detail/index.vue'),
      },
    ],
  },
];
