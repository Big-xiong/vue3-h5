import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

export default async (store) => {
  await store.dispatch('user/getAccessToken');

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '',
        redirect: { name: 'sport-home' },
        name: 'home',
        component: () => import('/native-sports/components/Layout/index.vue'),
        children: [
          {
            path: '/home',
            component: () => import('/native-sports/views/index/home/index.vue'),
            name: 'sport-home',
            meta: {
              title: '首页',
            },
          },
          {
            path: '/focus',
            component: () => import('/native-sports/views/index/focus/index.vue'),
            name: 'sport-focus',
            meta: {
              title: '关注',
            },
          },
          {
            path: '/bet',
            component: () => import('/native-sports/views/index/bet/index.vue'),
            name: 'sport-bet',
            meta: {
              title: '注单',
            },
          },
          {
            path: '/search',
            component: () => import('/native-sports/views/index/search/index.vue'),
            name: 'sport-search',
            meta: {
              title: '搜索',
            },
          },
        ],
      },
      {
        path: '/rules',
        component: () => import('/native-sports/views/rules/index.vue'),
        name: 'sport-rules',
        meta: {
          title: '规则说明',
        },
      },
      {
        path: '/notice',
        component: () => import('/native-sports/views/notice/index.vue'),
        name: 'sport-notice',
        meta: {
          title: '公告',
        },
      },
      {
        path: '/notice/:id',
        component: () => import('/native-sports/views/notice/detail.vue'),
        name: 'sport-notice-detail',
        meta: {
          title: '公告详情',
        },
      },
      {
        path: '/multi-bet',
        component: () => import('/native-sports/views/multiple-bet/index.vue'),
        name: 'sport-muti-bet',
      },
      {
        component: () => import('/native-sports/views/sport-detail/index.vue'),
        name: 'sportDetail',
        path: '/sport-detail',
      },
      {
        component: () => import('/native-sports/views/sport-detail-filter/index.vue'),
        name: 'sportDetailFilter',
        path: '/sport-detail-filter',
      },
    ],
    scrollBehavior(to, from, save) {
      return save || {
        x: 0,
        y: 0,
        behavior: 'smooth',
      };
    },
  });

  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });
  router.afterEach((to, from) => {
    NProgress.done();
  });

  return {
    router,
  };
};
