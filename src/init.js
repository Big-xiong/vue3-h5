/* eslint-disable import/no-mutable-exports */
import Cookies from 'js-cookie';
import { createI18n } from 'vue-i18n/index';
import VueClipboard from 'vue3-clipboard';
import { createApp } from 'vue';
import { isMicro } from './utils';
import { useFavicon } from './utils/hooks';
import { $getSrc } from '@/utils/getSrc';
import dialog from '@/plugins/dialog';
import popup from '@/plugins/popup';
import globalFunc from '@/utils/globalFunc';
import directives from '@/directives';
import createRouter from './router';
import createStore from './store';
import localeEn from '/public/language/en';
import currentEn from '/src/current_project/i18n/en';
import { mountVant } from '@/utils/mountVant';
import { requestInit } from './utils/request';
import App from './App.vue';

import './assets/root.less';
import './assets/dark.less';
import '@/current_project/config/style.less';
// import 'nprogress/nprogress.css';
// import '@/assets/style/global.less';

// import 'normalize.css';

const styles = import.meta.glob('../../src/current_project/config/style.less');

(async () => {
  import('nprogress/nprogress.css');
  import('@/assets/style/global.less');
  const vals = Object.values(styles);
  if (vals?.length) {
    await vals[0]();
  }
})();

// vant locale

let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default;

Cookies.set('showEnterLoading', subConfig.showEnterLoading);

if (!isMicro) useFavicon();

// 多语言插件设置
export const i18n = createI18n({
  locale: 'en',
  fallback: 'en',
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  missingWarn: false,
  messages: {
    'zh-CN': {
      ...Object.keys(localeEn).reduce((curr, next) => ((curr[next] = next), curr), {}),
      ...Object.keys(currentEn).reduce((curr, next) => ((curr[next] = next), curr), {})
    },
    en: {
      ...localeEn,
      ...currentEn
    }
    // th: {
    //   ...localeTh,
    //   ...currentTh,
    // },
    // vi: {
    //   ...localeVi,
    //   ...currentVi,
    // },
    // 'zh-TW': {
    //   ...localeTw,
    // },
  }
});

let router;
let store;

export default async (instance) => {
  const app = instance || createApp(App);
  window._GLOBAL_APP = app;
  if (!instance) {
    store = createStore();
    const { router: _router } = await createRouter(store);
    router = _router;
    requestInit(router, store);
  }

  mountVant(app, subConfig);
  // app.use(Vant);
  app.use(router);
  app.use(store);
  app.use(dialog);
  app.use(popup);

  globalFunc(app, store, router);
  app.use(i18n);
  const global = Object.assign(app.config.globalProperties, { $t: i18n.global.t });
  app.provide('global', global);
  app.provide('store', global.$store);
  app.provide('getRootStyle', (value, dom) =>
    getComputedStyle(
      dom ? document.querySelector(dom) : document[global.$store.state.app.darkTheme ? 'body' : 'documentElement']
    ).getPropertyValue(value)
  );
  app.provide('$t', global.$t);

  // 子分支配置
  app.provide('subConfig', subConfig);
  window.subConfig = subConfig;

  app.config.globalProperties.$getSrc = (path, defaultPath) => $getSrc(store, path, defaultPath);

  window.$t = i18n.global.t;
  // 剪切板引入
  app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true
  });
  // 注册自定义指令
  directives(app, store);

  return {
    app,
    store,
    router
  };
};
