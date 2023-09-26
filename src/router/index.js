import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import { getParams, isMicro } from '@/utils';
// import defaultRouter from './modules';
// import userRouter from './modules/user';
// import centerRouter from './modules/center';
// import agentRouter from './modules/agent';
// import helpRouter from './modules/help';
import { getHeaders, getRegionLang } from '@/api/app';
import { getLang, langConfig } from '@/utils/hooks';
import { regionlist } from '@/api/dicts';

const defaultModules = import.meta.globEager('/src/router/modules/*.js');
const subModules = import.meta.globEager('/src/current_project/router/*.js');

let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default ?? { isI18n: true };

// 进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});

let restrited = false;

export default async (store) => {
  // let lang = window.location.pathname.substr(1)
  //   .split('/')[0];

  // const result = await getRegionLang({ check: 1 });
  // const region = await regionlist();
  if (subConfig.isCurrency) {
    const result = await getHeaders(store);
    restrited = !result.isMatching;
    if (location.host.includes('localhost') || location.host.includes('test')) {
      restrited = false;
    }
  }

  let lang = '';
  let defaultLang = '';

  if (subConfig.isI18n) {
    lang = window.location.pathname.substr(1).split('/')[0];
    if (!lang || !langConfig.includes(lang)) {
      await getRegionLang().then((result) => {
        const { language } = navigator;
        const localLang = getLang(language);
        if (localLang === result) {
          lang = result;
        } else {
          lang = 'en';
        }
      });
    }
    defaultLang = lang;
  } else {
    defaultLang = 'zh-CN';
  }
  Cookies.set('lang', defaultLang);
  store.commit('app/SET_LANG', defaultLang, { root: true });
  // const routerHistory = !isServer ? createWebHistory(lang) : createMemoryHistory();

  // 合并主从架构路由
  const diffRouterModules = Object.entries({ ...defaultModules, ...subModules }).reduce((curr, next) => {
    const key = next[0].split('/').pop().replace('.js', '');
    curr[key] = next[1].default;
    return curr;
  }, {});

  const { index, ...routerModules } = diffRouterModules;

  setTimeout(() => {
    try {
      window.eval(store._state.data.app?.dicts?.siteinfo?.h5_stat ?? '');
    } catch (e) {}
  }, 6000);
  const routes = [...index, ...[].concat(...Object.values(routerModules).map((fn) => fn))];
  // if (isMicro) {
  //    routes = routes.filter((item) => !item.path || item.path === '/notice' || item.path === '/center' || item.path === '/affiliate' || item.path === '/help' || item.name === '404').map((item) => {
  //      if (!item.path) {
  //       item.children = item.children.filter((i) => i.path === '/user');
  //      }
  //      return item;
  //    });
  // }
  const router = createRouter({
    history: createWebHistory(isMicro ? '/micro/' : lang),
    routes,
    scrollBehavior() {
      return {
        x: 0,
        y: 0,
        behavior: 'smooth'
      };
    }
  });

  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    // 微应用跳转判断
    // if (isMicro) {
    //   if (to.href === '/micro/' && from.path !== '/user') {
    //     next('/user');
    //     return;
    //   }
    // }
    // 落地页没有ip限制
    if (to.name === 'landing') {
      if (location.host === 'blizzwin.online') {
        return next();
      }
      return next({ name: 'home' });
    }

    // /agent/landing
    if (to.path === '/agent/landing') {
      return next({ name: 'agentLanding', query: { id: to.query.id } });
    }

    if (to.query.code) {
      sessionStorage.setItem('spread_code', to.query.code);
    }

    if (to.fullPath === '/auth/register' && !!sessionStorage.getItem('agentCode')) {
      next({
        name: 'agentRegister',
        replace: true,
        query: {
          id: sessionStorage.getItem('agentCode')
        }
      });
    }
    // 落地页没有ip限制
    if (to.name === 'landing') {
      return next();
    }

    if (restrited && to.name !== 'restricted') {
      NProgress.done();
      return next({ name: 'restricted' });
    }

    if (!restrited && to.name === 'restricted') {
      return next({ name: 'home' });
    }

    if (!store) {
      next();
      return;
    }

    if (to.name === 'downApp' && window.branch) {
      // 本地不进行跳转，_branch_match_id 是branch跳转之后带上的参数，如果存在就不继续进行跳转
      if (!location.href.includes('_branch_match_id')) {
        window.branch.link({}, (err, link) => {
          location.href = `${link}?id=${sessionStorage.getItem('agentCode')}`;
        });
        return next(false);
      }
      return next();
    }

    // 已登录状态不允许访问注册页面
    if (to.name === 'register' && Cookies.get('access_token')) {
      return next({ name: 'home' });
    }

    if (to.query.at) {
      Cookies.set('access_token', to.query.at);
      store.dispatch('user/getUserInfo');
      return next();
    }

    const token = Cookies.get('access_token');

    // 推广链接，无论进入哪个页面，都应该记录
    if (to.query.id) {
      isNaN(Number(to.query.id)) ? sessionStorage.setItem('agentCode', to.query.id) : '';
    }
    if (to.query.code) {
      sessionStorage.setItem('friendCode', to.query.code);
    }
    const agentToken = Cookies.get('agent_access_token');

    // 不验证登录，主要是app内嵌页
    const noValifyLogin = ['/aboutWe'];

    if (to.name === 'kefu') {
      next();
      return;
    }

    if (to.name?.includes('agent') && !to.fullPath.includes('forget-password')) {
      const { agent } = store.state;
      if (!agent.isLogin && agentToken) {
        await store.dispatch('agent/getUserInfo');
        if (!agent.isLogin) {
          Cookies.remove('agent_access_token');
          next({
            name: 'agentLanding#login',
            replace: true
          });
          return;
        }
      } else {
        next();
        return;
      }
    } else if ((token || to.path.startsWith('/center')) && !noValifyLogin.some((item) => to.path.endsWith(item))) {
      if (store.state.user.isLogin) return next();
      store.dispatch('user/getUserInfo');
      //   .then(() => {
      //   if (!store.state.user.isLogin) {
      //     Cookies.remove('access_token');
      //     if (source !== 'app') {
      //       Toast.fail({
      //         duration: 3000,
      //         message: window.$t('请先登录!'),
      //       });
      //     }
      //     return next({ name: 'login' });
      //   }
      // });
    } else {
      store.commit('user/SET_GOT_USERINFO', true);
    }
    next();
  });
  router.afterEach((to, from) => {
    NProgress.done();

    // SMO:Search Media Optimization(搜索媒体优化)，
    // 用户搜索行为与呈现位置、优质内容的完美匹配，以服务代替信息，深度融入用户生活。
    // SMO的方法包括添加RSS订阅、“Digg This”顶上去、博客写作及非合作形式的第三方社区功能
    // （如：Flickr图片幻灯片、YouTube的视频分享）。社会化媒体优化是网络营销的一种最新形式。

    document.querySelector('html').scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  });

  return {
    router
  };
};
