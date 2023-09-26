import Cookies from 'js-cookie';
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import init from './init';
import 'virtual:svg-icons-register';
import { getHeaders } from './api/app';
import actions from '@/shared/actions';
import { isMicro } from '@/utils';

let instance;
if (import.meta.env.MODE === 'production' && window.location.href.includes('//m.') && !window.location.href.includes('.wq-test.')) {
  const sUserAgent = navigator.userAgent.toLowerCase();
  const bIsIpad = /ipad/i.test(sUserAgent);
  const bIsIphone = /iphone os/i.test(sUserAgent);
  const bIsMidp = /midp/i.test(sUserAgent);
  const bIsUc7 = /rv:1.2.3.4/i.test(sUserAgent);
  const bIsUc = /ucweb/i.test(sUserAgent);
  const bIsCE = /windows ce/i.test(sUserAgent);
  const bIsWM = /windows mobile/i.test(sUserAgent);
  const bIsAndroid = /android/i.test(sUserAgent);
  if (!bIsIpad && !bIsIphone && !bIsMidp && !bIsUc7 && !bIsUc && !bIsCE && !bIsWM && !bIsAndroid) {
    window.location.href = window.location.href.replace('//m.', '//');
  }
}

function render(props) {
  init().then((res) => {
    const { app, store, router } = res;
    instance = app;

    const { name, container } = props;
    router.isReady().then(async () => {
      // await getHeaders(store);
      app.mount(container ? container.querySelector('#app') : '#app', true);
    });
    if (name) {
      // 注入 actions 实例
      actions.setActions(props);
      console.log('子应用render的参数', props);
      props.onGlobalStateChange((state, prevState) => {
        // state: 变更后的状态; prev 变更前的状态
        console.log('通信状态发生改变：', state, prevState);
        if (state.globalToken) {
          Cookies.set('access_token', state.globalToken);
          store.dispatch('user/getUserInfo');
          store.commit('app/SET_IS_MICRO', true, { root: true });
          // store.commit('app/SET_LANG', 'zh', { root: true });
          store.commit('app/SET_TELEPORT_CONTAINER', container, { root: true });
        }
      }, true);
    }
  });
}

renderWithQiankun({
  mount(props) {
    console.log('vue mount');
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props) {
    console.log('vue unmount', props);
    props.singleSpa.unregisterApplication(props.name);
  },
});

if (!isMicro) {
  render({});
}
