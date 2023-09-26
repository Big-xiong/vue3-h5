export default [
  {
    path: '',
    redirect: { name: 'home' },
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          homeHeader: true,
          title: '首页',
        },
        component: () => import('@/views/index/home/index.vue'),
      },
      {
        path: '/promos',
        name: 'promos',
        meta: {
          title: '优惠',
          commHeader: true,
        },
        component: () => import('@/views/index/promos/index.vue'),
      },
      {
        path: '/notice',
        name: 'notice',
        meta: {
          title: '通知',
          commHeader: true,
        },
        component: () => import('@/views/index/notice/index.vue'),
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '我的',
        },
        component: () => import('@/views/center/home/index.vue'),
      },
    ],
  },
  // {
  //   path: '/play',
  //   name: 'play',
  //   meta: {
  //     title: '',
  //   },
  //   component: () => import('@/views/index/play/index.vue'),
  // },
  {
    path: '/discount-detail',
    name: 'discountDetail',
    meta: {
      title: '优惠详情',
    },
    component: () => import('@/views/index/discount-detail/index.vue'),
  },
  {
    path: '/restricted',
    name: 'restricted',
    meta: {
      title: '访问受限',
      commHeader: true,
    },
    component: () => import('@/views/index/restricted/index.vue'),
  },
  // {
  //   path: '/kefu',
  //   name: 'kefu',
  //   meta: {
  //     title: '客服',
  //   },
  //   component: () => import('@/views/index/kefu/index.vue'),
  // },
  {
    path: '/landing',
    name: 'landing',
    meta: {
      title: '落地页',
    },
    component: () => import('@/views/index/landing/index.vue'),
  },
  {
    path: '/appDownload',
    name: 'downApp',
    meta: {
      title: 'APP下载',
    },
    component: () => import('@/views/index/down-app/index.vue'),
  },
  {
    path: '/activity/redEnvelopeRain',
    name: 'redEnvelopeRain',
    meta: {
      title: '红包雨活动',
      showSubHeader: false,
    },
    component: () => import('@/views/index/activity/redEnvelopeRain/index.vue'),
  },
  {
    path: '/transRank',
    name: 'transRank',
    component: () => import('@/views/index/trans-rank/index.vue'),
  },
];
