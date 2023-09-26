/* eslint-disable no-param-reassign */
import { watch, createApp, watchEffect, computed } from 'vue';
import { Loading } from 'vant';
import Cookies from 'js-cookie';
import { vi } from 'google-translate-api/languages';
import { priceFormat, priceUnitTransform } from '@/utils/index';
import { regionlist } from '../api/dicts';

import BlockLoading from '@/components/BlockLoading.vue';

function pxToRem(_s) {
  // 匹配:20px或: 20px不区分大小写
  const reg = /(\:|: )+(\d)+(px)/gi;
  const newStr = _s.replace(reg, (_x) => {
    _x = _x.replace(/(\:|: )/, '').replace(/px/i, '');
    return `:${parseFloat(_x) / 75}rem`;
  });
  return newStr;
}

function createLoading(el) {
  const node = document.createElement('div');
  node.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      background: rgba(0,0,0,0.4);
      justifyContent: center;
      alignItems: center;
    `;
  el.style.position = 'relative';
  return node;
}

export default (app, store) => {
  const { $t } = app.config.globalProperties;
  const $projectName = import.meta.env.VITE_APP_PROJECT_NAME;

  // 需要登录才能操作
  const showLoginDialog = () =>
    app.config.globalProperties.$dialog({
      tpl: 'LoginDialog'
    });

  app.directive('login', {
    mounted(el, binding) {
      const target = binding.arg || 'game';

      const elPosition = el.style.position;
      const {
        app: { dicts },
        user
      } = store.state;

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!user.isLogin) {
          showLoginDialog();
        } else if (target === 'game' && dicts.platformgameidsv2Loading) {
          const node = document.createElement('div');
          node.style = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            justifyContent: center;
            alignItems: center;
          `;
          el.style.position = 'relative';
          el.appendChild(node);
          const loadingApp = createApp(Loading);
          loadingApp.mount(node);
          watch(
            () => dicts.platformgameidsv2Loading,
            (loading) => {
              if (!loading) {
                el.style.position = elPosition;
                loadingApp.unmount();
                binding.value?.();
              }
            },
            {
              immediate: true,
              deep: true
            }
          );
        } else {
          binding.value?.();
        }
      });
    }
  });

  app.directive('gameStatus', (e, config) => {
    const {
      value,
      modifiers: { img }
    } = config;
    if (!value) return;

    if (e.tagName === 'BUTTON') {
      e.style.display = 'none';
    }

    const parent = e.parentNode;
    if (!parent.__not_play_game && img) {
      parent.__not_play_game = true;
      if (['10029', '10064'].includes($projectName)) {
        if (!parent.classList.contains('gray-scal')) {
          parent.classList.add('gray-scal');
          const dom = document.createElement('h3');
          dom.innerText = $t('维护中');
          parent.querySelector('.game-info').appendChild(dom);
        }
      } else {
        parent.style.position = 'relative';
        parent.classList.add('maintain-parent');
        const dom = document.createElement('maintain');
        dom.innerText = $t('维护中');
        dom.className = 'maintain';
        parent.appendChild(dom);
        const w = parent.clientHeight * 0.6;
        let timer = setInterval(() => {
          const targetImg = parent.querySelector('img');
          if (targetImg?.complete) {
            dom.style.cssText = `width: ${w}px; height: ${w}px; font-size: ${w * 0.23}px;`;
            clearInterval(timer);
            timer = null;
          }
        }, 200);
      }
    }
  });

  app.directive('loading', {
    mounted(el, binding) {
      const loadingApp = createApp(BlockLoading);
      const node = createLoading(el, loadingApp);
      el.loadingObject = {
        loadingApp,
        node,
        mounted: false
      };
      if (binding.value) {
        el.loadingObject.mounted = true;
        el.appendChild(node);
        loadingApp.mount(node);
      }
    },
    updated(el, binding) {
      const { loadingApp, node, mounted } = el.loadingObject;
      if (binding.value !== binding.oldValue && !mounted) {
        el.appendChild(node);
        loadingApp.mount(node);
        el.loadingObject.mounted = true;
      } else if (el.loadingObject?.mounted && !binding.value) {
        // console.log('remove', el.loadingObject.mounted);
        loadingApp.unmount();
        el.removeChild(node);
        el.loadingObject.mounted = false;
      }
    }
  });

  function moneyInit(currency, { el, binding }) {
    let limit;
    if (typeof binding.arg === 'number') {
      limit = binding.arg;
    }
    const { money, unit } = priceUnitTransform(binding.value, limit);
    const [integer, decimal] = money.toString().split('.');

    // 创建
    let tempNode = document.createElement('div');
    const iNode = document.createElement('i');
    const wrapNode = document.createElement('span');
    const childNode = document.createElement('em');
    const unitNode = document.createElement('span');
    const textNode = document.createTextNode(decimal ? ` ${integer}.` : integer);
    // 赋值
    childNode.innerText = decimal ?? '';
    iNode.innerText = currency;
    iNode.className = 'wrap-money-currency';
    wrapNode.className = 'wrap-money-integer';
    childNode.className = 'wrap-money-decimal';
    childNode.style.fontSize = `0.7em`;
    childNode.style.fontStyle = `normal`;
    el.classList.add('wrap-money');
    el.style.whiteSpace = 'nowrap';

    // 组装
    wrapNode.appendChild(textNode);
    wrapNode.appendChild(childNode);
    unitNode.innerText = unit;
    wrapNode.appendChild(unitNode);

    tempNode.appendChild(iNode);
    tempNode.appendChild(wrapNode);
    el.innerHTML = tempNode.innerHTML;
    tempNode = null;
  }

  // 货币符号
  app.directive('money', (el, binding) => {
    const { user, agent, app: appStore } = store.state;

    watchEffect(
      async () => {
        // moneyInit(agent.currencySymbol || user.currencySymbol, { el, binding });
        let symbol = '';
        if (typeof binding.arg === 'string') {
          symbol = binding.arg;
        } else {
          symbol = agent?.userInfo?.currency?.symbol || user?.userInfo?.currency_detail?.symbol;
        }

        if (!symbol) {
          symbol = appStore.dicts?.regionlist?.find((item) => item.is_default === 1)?.currency_conf?.default.symbol ?? '';
        }

        moneyInit(symbol || '', {
          el,
          binding
        });
      },
      {
        immediate: true
      }
    );
  });

  // 货币符号
  // app.directive('money', (el, binding) => {
  //   const { user, agent } = store.state;
  //   const money = binding.value;
  //   function init(currency) {
  //     const number = Number(money);
  //     const text = Number.isNaN(number) ? '' : `${number < 0 ? '-' : ''}${currency || ''} ${Math.abs(number).toFixed(2)}`;
  //     el.innerHTML = text;
  //   }
  //   watchEffect(() => {
  //     init(agent?.userInfo?.currency?.symbol || user?.userInfo?.currency_detail?.symbol);
  //   }, { immediate: true });
  // });

  // 多语言样式定制
  // v-lang:xx 其中xx为语种， v-lang:xx|xx，中划线分割传多语种
  app.directive('lang', (el, binding) => {
    const { arg, value } = binding;
    const styleArr = value.split(';');
    const temp = [];
    styleArr.forEach((item) => {
      if (item.includes('px')) {
        temp.push(pxToRem(item));
      } else {
        temp.push(item);
      }
    });

    let { lang } = store.state.app;
    lang = lang || Cookies.get('lang');
    watch(
      lang,
      () => {
        if (lang === arg || arg.split('|').includes(lang)) {
          el.style = temp.join(';');
        }
      },
      {
        immediate: true
      }
    );
  });

  // 指定元素区域外点击
  app.directive('clickOutside', {
    mounted(el, binding) {
      const { value, modifiers } = binding;
      function eventHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }
        // 如果绑定的参数是函数，正常情况也应该是函数，执行
        value?.(e);
      }
      // 用于销毁前注销事件监听
      el.__click_outside__ = eventHandler;
      el.__click_outside_fn__ = Object.keys(modifiers)?.[0] ?? 'click';
      // 添加事件监听
      document.addEventListener(el.__click_outside_fn__, eventHandler);
    },
    beforeUnmount(el) {
      // 移除事件监听
      document.removeEventListener(el.__click_outside_fn__, el.__click_outside__);
      // 删除无用属性
      delete el.__click_outside__;
    }
  });
};
