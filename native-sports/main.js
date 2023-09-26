import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import Vant from 'vant';
// import ZHCN from './i18n/zh-CN.mjs';
import EN from './i18n/en.mjs';
import VI from './i18n/vi.mjs';
import TH from './i18n/th.mjs';
import App from './App.vue';
import createRouter from './router';
import createStore from './store/index.js';
import 'virtual:svg-icons-register';
import './styles/main.less';
import './styles/videojs.css';
// import 'video.js/dist/video-js.css';
import { requestInit } from '@/utils/request';
import { $getSrc } from './utils/getSrc';

const app = createApp(App);

export const i18n = createI18n({
  locale: localStorage.getItem('sport_lang') || 'cs',
  fallbackLocale: 'cs',
  silentTranslationWarn: true,
  legacy: false,
  messages: {
    cs: {
      ...Object.keys(EN).reduce((curr, next) => ((curr[next] = next), curr), {}),
    },
    en: EN,
    vn: VI,
    th: TH,
  },
});
localStorage.setItem('sport_lang', i18n.global.locale.value);

async function init() {
  const store = createStore();
  const global = Object.assign(
    app.config.globalProperties,
    {
      $t: i18n.global.t,
      i18n,
      $getSrc: (path, defaultPath) => $getSrc(store, path, defaultPath),
    },
  );
  const { router } = await createRouter(store, app);

  requestInit(router, store);

  app.use(i18n);
  app.use(Vant);
  app.use(store);
  app.use(router);

  app.provide('global', global);
  app.provide('store', global.$store);

  app.mount('#app');
}

init();
