export default [
  {
    path: '/activity/sixGift',
    name: 'sixGift',
    meta: {
      title: '六重礼金',
    },
    component: () => import('@/views/activity/sixGift/index.vue'),
  },
  {
    path: '/activity/invitation',
    name: 'invitation',
    meta: {
      title: '推荐好友',
    },
    component: () => import('@/views/activity/referFriend/index.vue'),
  },
  {
    path: '/activity/loanTreasure',
    name: 'loanTreasure',
    meta: {
      title: '借贷宝',
    },
    component: () => import('@/views/activity/loanTreasure/index.vue'),
  },
  {
    path: '/activity/interestRate',
    name: 'interestRate',
    meta: {
      title: '聚宝盆',
    },
    component: () => import('@/views/activity/interestRate/index.vue'),
  },
  {
    path: '/activity/welfare',
    name: 'welfare',
    meta: {
      title: '美女派送',
    },
    component: () => import('@/views/activity/welfare/index.vue'),
  },
  {
    path: '/activity/usdtInfo',
    name: 'usdtInfo',
    meta: {
      title: '新时代新支付新起点',
    },
    component: () => import('@/views/activity/usdtDetail/index.vue'),
  },
  {
    path: '/activity/usdt',
    name: 'usdt',
    meta: {
      title: 'USDT40%大让利',
    },
    component: () => import('@/views/activity/usdtDetail/usdt.vue'),
  },
  {
    path: '/activity/huobiInfo',
    name: 'huobiInfo',
    meta: {
      title: '了解虚拟币',
    },
    component: () => import('@/views/activity/htDetail/index.vue'),
  },
  {
    path: '/activity/bianInfo',
    name: 'bianInfo',
    meta: {
      title: '了解虚拟币',
    },
    component: () => import('@/views/activity/bianDetail/index.vue'),
  },
  {
    path: '/wallet',
    name: 'wallet',
    meta: {
      title: '理财小金库',
      layout: false,
    },
    component: () => import('@/views/center/fund-management/financial/index.vue'),
  },
];
