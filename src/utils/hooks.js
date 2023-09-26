/* eslint-disable import/prefer-default-export */
import { Toast, Dialog } from 'vant';
import {
  h,
  ref,
  watch,
  inject,
  toRaw,
  reactive,
  nextTick,
  computed,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
  onBeforeUnmount,
  onMounted,
  withDirectives,
  resolveDirective,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { getactivityaward } from '@/api/active.js';
import { canwithdraw, rechargeflow } from '@/api/center';
import { withdrawcheckemail } from '@/api/user';

const ImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png',
};

const subFavicon = import.meta.glob('/src/current_project/assets/favico.ico');

// const favicon = Object.values(subFavicon)?.[0]?.default;
export const useFavicon = async () => {
  let href = '';
  if (subFavicon['/src/current_project/assets/favico.ico']) {
    href = (await subFavicon['/src/current_project/assets/favico.ico']()).default;
  } else {
    href = '/favicon.ico';
  }
  if (!href) return;

  const cutUrl = href.split('.');
  const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase();

  const link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');

  link.type = ImgTypeMap[imgSuffix];
  link.href = href;
  link.rel = 'shortcut icon';

  document.getElementsByTagName('head')[0].appendChild(link);
};

export function useExpose(apis) {
  const instance = getCurrentInstance();

  if (instance) {
    Object.assign(instance.proxy, apis);
  }
}

/**
 * @description: 返回refresh刷新变量，解决场景：语言切换、注册页select错误渲染
 * @param {Boolean} enterRefresh 是否进入刷新，默认true
 * @return {Object} 返回refresh状态值
 */
export function useRefresh(enterRefresh = true) {
  const refresh = ref(true);
  const updateRefresh = () => {
    refresh.value = false;
    nextTick(() => {
      refresh.value = true;
    });
  };
  onMounted(() => {
    if (enterRefresh) updateRefresh();
  });
  return {
    refresh,
    updateRefresh,
  };
}

/**
 * @description: timeout定时器
 * @param {Function} fn 回调方法
 * @param {Number} time 执行间隔
 * @param {Object} options 配置项
 * @param {Boolean} options.manual 是否手动执行，默认false
 * @return {Function} 返回可终止定时器方法
 */
export const useTimeout = (fn, time, options = { manual: false }) => {
  let timer = null;
  const stop = () => clearTimeout(timer);
  const run = (...args) => {
    stop();
    timer = setTimeout(() => fn.call(null, ...args), time);
  };
  if (!options.manual) run();
  onBeforeUnmount(stop);
  return {
    run,
    stop,
  };
};

export function usePopupState() {
  const state = reactive({
    show: false,
  });

  const toggle = (show) => {
    state.show = show;
  };

  const open = (props) => {
    Object.assign(state, props);
    nextTick(() => toggle(true));
  };

  const close = () => toggle(false);

  useExpose({
    open,
    close,
    toggle,
  });
  return {
    open,
    close,
    state,
    toggle,
  };
}

/**
 * @description: interval定时器
 * @param {Function} fn 回调方法
 * @param {Number} time 执行间隔
 * @param {Object} options 配置项
 * @param {Boolean} options.manual 是否手动执行，默认false
 * @param {Boolean} options.immediate 是否初始执行，默认false
 * @return {Function} 返回可终止定时器方法
 */
export const useInterval = (fn, time, options = { manual: false, immediate: false }) => {
  if (options.immediate) fn.call(null);
  let timer = null;
  const running = ref(false);
  const run = (...args) => {
    running.value = true;
    timer = setInterval(() => fn.call(null, ...args), time);
  };
  if (!options.manual) run();
  const stop = () => {
    running.value = false;
    return clearInterval(timer);
  };
  onBeforeUnmount(stop);
  return {
    run,
    stop,
    running,
  };
};

/**
 * @description: 字典方法
 * @param {string} type 字典名
 * @param {Function} callback 执行间隔
 * @param {opts} options 配置项, 与watch函数保持一致
 */
export function useDicts(type, callback, opts = {}) {
  const $store = inject('store');
  const { dicts } = $store.state.app;
  if (!dicts[type] && !dicts[`${type}Loading`]) {
    $store.dispatch('app/getDict', [type]);
  }
  const data = ref({});

  watch(
    () => $store.state.app.lang,
    () => {
      $store.dispatch('app/getDict', [type]);
    },
  );

  watch(
    dicts,
    () => {
      if (callback && dicts[type]) {
        callback(dicts[type]);
      }
      data.value = dicts[type];
    },
    opts,
  );

  return {
    data,
  };
}

/**
 * @description: 处理区域hooks
 * @param {string} defaultId 默认的区域id
 */
export function useRegion(defaultId) {
  const regionList = ref([]);
  const currencyList = ref([]);
  const defaultCurrency = ref(null);
  const defaultRegion = ref({});
  const $store = inject('store');
  const { dicts } = $store.state.app;

  useDicts(
    'regionlist',
    (list) => {
      regionList.value = list.map((item) => ({
        key: item.id,
        label: item.name,
        value: item.id,
      }));
      defaultRegion.value = list.find((item) => item.is_default === 1);
    },
    { immediate: true },
  );

  function changeRegionId(regionId) {
    const selectedRegion = dicts?.regionlist?.find((item) => item.id === regionId)?.currency_conf;
    defaultCurrency.value = selectedRegion?.default.id;
    currencyList.value = selectedRegion?.list
      .filter((item) => item.status === 1)
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }

  if (defaultId) {
    changeRegionId(defaultId);
  }

  return {
    regionList,
    currencyList,
    changeRegionId,
    defaultRegion,
    defaultCurrency,
  };
}

// 优惠帮助hooks
export function useDiscount() {
  const global = inject('global');
  const router = global.$router;
  const store = inject('store');
  const { app, user } = store.state;

  const signedText = computed(() => ({
    1: user?.isLogin ? global.$t('立即存款') : global.$t('登录/注册'),
    2: user?.isLogin ? global.$t('领取福利') : global.$t('登录/注册'),
    3: user?.isLogin ? global.$t('立即存款') : global.$t('登录/注册'),
  }));

  const unSignedText = ref({
    1: global.$t('更多详情'),
    2: null,
  });

  function handleSign(option, type = 'blizzwin') {
    if (!store.state?.user?.isLogin) {
      app.source === 'app' ? (window.location.href = `${type}://login`) : router.push('login');
      return;
    }

    if (Number(option.signed_option === 2)) {
      getactivityaward({ id: option.id }).then((res) => {
        Toast.success(global.$t('领取成功'));
      });
      return false;
    }
    if (app.source === 'app') {
      window.location.href = `${type}://pay`;
    } else {
      router.push('/center/fund-management/deposit');
    }

    return true;
  }

  function handleUnSign(item) {
    if (item.unsigned_option === 2 && !store.state?.user?.isLogin) {
      global.$dialog({
        tpl: 'LoginDialog',
      });
      return false;
    }
    global.$popup({
      tpl: 'DiscountDetail',
      id: item.id,
      discount: item,
    });
    return true;
    // router.push({ name: 'discountDetail', query: { id: item.id } });
  }

  return {
    signedText,
    unSignedText,
    handleSign,
    handleUnSign,
  };
}

// 联系方式
export function useContact(contactConfig) {
  const global = inject('global');
  const store = inject('store');

  const { agent } = store.state;

  const contacts = computed(() => (contactConfig.length ? contactConfig : [agent.userInfo?.inte_region_id === 3 ? 'line' : 'zalo', 'facebook', 'skype', 'whatsapp']));

  const columns = ref([]);
  const contactInfo = ref({});

  const columnsFilter = (userInfo) => {
    const { inte_region_id: regionId, inte_contact, ...otherInfo } = userInfo;
    const info = inte_contact ? JSON.parse(inte_contact) : contacts.value.reduce((curr, next) => {
      curr[next] = {
        account: otherInfo[next] ?? '',
        is_bind: 2,
      };
      return curr;
    }, {});

    const baseColumns = [
      {
        type: 'input',
        prop: 'facebook',
        label: 'Facebook',
        block: true,
        placeholder: global.$t('请输入您的Facebook号'),
        defaultValue: info.facebook?.account ?? '',
      },
      {
        type: 'input',
        prop: 'whatsapp',
        label: 'WhatsApp',
        block: true,
        placeholder: global.$t('请输入您的WhatsApp号'),
        defaultValue: info.whatsapp?.account ?? '',
      },
      {
        type: 'input',
        prop: 'skype',
        label: 'Skype',
        block: true,
        placeholder: global.$t('请输入您的Skype号'),
        defaultValue: info.skype?.account ?? '',
      },
    ];
    const mainlandColumns = [
      {
        type: 'input',
        prop: 'wechat',
        label: global.$t('微信'),
        block: true,
        placeholder: global.$t('请输入您的微信号'),
        defaultValue: info?.wechat?.account ?? '',
      },
      {
        type: 'input',
        prop: 'qq',
        label: 'QQ',
        block: true,
        placeholder: global.$t('请输入您的QQ号'),
        defaultValue: info?.qq.account ?? '',
      },
      {
        type: 'input',
        prop: 'skype',
        label: 'Skype',
        block: true,
        placeholder: global.$t('请输入您的Skype号'),
        defaultValue: info?.skype.account ?? '',
      },
    ];

    // 泰国
    if (regionId === 3) {
      baseColumns.unshift({
        type: 'input',
        prop: 'zalo',
        label: 'Zalo',
        block: true,
        placeholder: global.$t('请输入您的Zalo号'),
        defaultValue: info.zalo?.account ?? '',
      });
    } else {
      baseColumns.unshift({
        type: 'input',
        prop: 'line',
        label: 'Line',
        block: true,
        placeholder: global.$t('请输入您的Line号'),
        defaultValue: info.line?.account ?? '',
      });
    }
    contactInfo.value = info;
    columns.value = contactConfig?.length ? mainlandColumns : baseColumns;
  };

  watch(
    () => agent.userInfo,
    (info) => {
      if (Object.keys(info).length) {
        columnsFilter(info);
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );

  return {
    columns,
    contactInfo,
  };
}

// 滚动到顶部
export function useScrollToTop(selector) {
  const target = document.querySelector(selector);
  if (target) {
    let timmer = requestAnimationFrame(function callback() {
      let sTop = target.scrollTop;
      if (sTop > 0) {
        sTop -= 50;
        target.scrollTop = sTop;
        timmer = requestAnimationFrame(callback);
      }
    });
    timmer = null;
  }
}

// 取款判断
export function useWithdraw() {
  const global = inject('global');
  const { data: siteInfo } = useDicts('siteinfo', () => { }, { immediate: true });
  const store = inject('store');
  const { user } = store.state;

  const { run: getRechargeFlow, data: flowData } = useRequest(rechargeflow, { manual: true });

  onBeforeMount(() => {
    if (user.isLogin) {
      getRechargeFlow();
    }
  });

  const { run: canwithdrawRun } = useRequest(canwithdraw, {
    manual: true,
    onSuccess() {
      global.$router.push({ name: 'centerWithdraw' });
    },
    onError() {
      global.$popup({ tpl: 'FlowPopup' });
    },
  });

  function handleFlowJuege() {
    const { withdraw_setting: setting } = siteInfo?.value ?? {};
    const { done_flow, undone_flow } = flowData.value;

    const moneyDirective = resolveDirective('money');

    if (undone_flow > 0) {
      Dialog.confirm({
        message: () => h('div', [
          h('span', global.$t('当前已经完成')),
          // withDirectives(h('span'), [[moneyDirective, done_flow]]),
          h('span', done_flow || 0),
          h('span', global.$t('有效投注, ')),
          h('span', global.$t('还差')),
          // withDirectives(h('span'), [[moneyDirective, undone_flow]]),
          h('span', undone_flow || 0),
          h('span', global.$t('提款')),
        ]),
        title: global.$t('温馨提示'),
        showCancelButton: false,
        confirmButtonText: global.$t('确认'),
        className: 'buttonWidth160',
      });
      return;
    }

    canwithdrawRun();
  }

  async function checkEmail() {
    const result = await withdrawcheckemail();
    if (result.need_bind && user.userInfo.is_valid_email === 1) {
      global.$popup({
        tpl: 'BindEmail',
        userInfo: user.userInfo,
        showCancel: false,
        onClose() {
          handleFlowJuege();
        },
      });
      return false;
    }

    return true;
  }

  async function handleWithdraw() {
    const { withdraw_setting: setting } = siteInfo?.value;
    // 未绑定银行卡
    if (!user?.userInfo?.user_bank?.length) {
      Dialog.confirm({
        message: () => h('div', [
          h('p', global.$t('您未绑定银行卡，我们无法为您打款到账户')),
          h('p', [
            h('span', global.$t('遇到问题')),
            h(
              'span',
              {
                class: ['kefu-wrap'],
                onClick() {
                  global.$openKefu();
                  Dialog.close();
                },
              },
              global.$t('联系专属客服'),
            ),
          ]),
        ]),
        className: 'withdraw-popup-tips',
        title: global.$t('银行卡绑定提示'),
        confirmButtonText: global.$t('立即绑定'),
        cancelButtonText: global.$t('暂不绑定'),
      }).then(() => {
        global.$router.push({
          name: 'centerBankCardAdd',
        });
      });
      return;
    }

    // 后台配置了需要绑定手机号并且用户没有绑定手机号
    if (setting.need_mobile === 1 && user?.userInfo.is_valid_mobile === 1) {
      // 绑定手机号
      global.$popup({
        tpl: 'AgentBindMobile',
        type: 'user',
        userInfo: user.userInfo,
        async onClose() {
          const result = await checkEmail();
          if (result) {
            handleFlowJuege();
          }
        },
      });
      return;
    }

    const result = await checkEmail();

    if (result) {
      handleFlowJuege();
    }
  }

  return {
    handleFlowJuege,
    handleWithdraw,
  };
}

export const langConfig = ['zh-CN', 'en', 'th', 'vi'];
export function getLang(lang) {
  if (lang.startsWith('en')) {
    return 'en';
  }
  if (lang.startsWith('vi') || lang === 'vn') {
    return 'vi';
  }
  if (lang.startsWith('th')) {
    return 'th';
  }
  return 'zh-CN';
}
// 获取浏览器语言处理成自用code
export function useLang() {
  const store = inject('store');
  const { app } = store.state;
  const { language } = import.meta.env?.SSR ? {} : navigator;
  const lang = ref('');

  watch(
    () => app.lang,
    () => {
      lang.value = app.lang;
    },
  );

  function getLangForImage(data) {
    const { lang: storeLang } = app;
    try {
      const json = JSON.parse(data.inte_h5pic);
      const inteLang = getLang(storeLang);
      return json[inteLang === 'vi' ? 'vn' : inteLang];
    } catch (e) {
      return '';
    }
  }

  return {
    lang,
    langConfig,
    getLang,
    getLangForImage,
  };
}

/**
 *
 * @description 数字filter 从Number 转String 在转Number
 * @params number 需要过滤的数字
 * @params n 需要截取多少位 默认截取2位
 */

export const useNumFilter = (number, n = 2) => computed(() => {
  const p = number.toString();
  let index = 0;
  let newP = '';
  for (let i = 0; i < p.length; i++) {
    if (p[i] > 0) {
      index++;
      if (index > n) {
        break;
      } else {
        newP += p[i];
      }
    }
  }
  return newP * 1;
});

function safeOnMounted(hook) {
  const instance = getCurrentInstance();
  if (instance?.isMounted) {
    hook();
  } else {
    nextTick(hook);
  }
}

function isInViewPort(el) {
  if (!el) {
    return false;
  }

  const viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const rect = el.getBoundingClientRect();

  if (rect) {
    const {
      top, bottom, left, right,
    } = rect;
    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
  }

  return false;
}

function observeTarget(target, state) {
  const targetElement = target;
  if (!targetElement) {
    return;
  }
  const defaultInViewport = isInViewPort(targetElement);
  state.value = defaultInViewport;

  const observer = new IntersectionObserver((entries) => {
    const isIntersecting = entries.every((i) => i.isIntersecting);
    state.value = isIntersecting;
  });

  observer.observe(targetElement);

  onUnmounted(() => {
    observer.disconnect();
  });
}

export function useInViewport(target) {
  const state = ref(false);
  const states = ref([]);

  const $store = inject('store');
  const { game } = $store.state;
  watch(
    () => game.platformGameIdsv3,
    () => {
      safeOnMounted(() => {
        if (Array.isArray(target.value)) {
          target.value.forEach((t) => {
            const _state = ref(false);
            observeTarget(t, _state);
            states.value.push(_state);
          });
        } else {
          observeTarget(target.value, state);
        }
      });
    },
  );

  return Array.isArray(target.value) ? states : state;
}
export function goPage(item, global) {
  let url = '';
  const {
    h5_link, title, id, type, name,
  } = item;
  if (item?.url) {
    url = item?.url;
  } else {
    url = h5_link;
  }
  if (type === 23) {
    return global?.$router.push({
      name: 'euroCup',
      query: {
        id,
      },
    });
  }
  if (url && isNaN(Number(url))) {
    if (url?.startsWith('http') || url?.startsWith('//')) {
      window.open(url, 'thirdActivity');
    } else {
      global?.$router.push(url);
    }
  } else {
    global?.$router.push({
      path: '/discount-detail',
      query: {
        id: url || id,
        title: title || name,
      },
    });
  }
}
