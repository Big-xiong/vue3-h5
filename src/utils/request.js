/* eslint-disable no-param-reassign */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios';
import Cookies from 'js-cookie';
// import store from '@/store';
import { Toast } from 'vant';
import { isMicro } from '@/utils';
import { resetParams } from '@/utils/requestHelp.js';
import ToastLoading from '@/utils/loading.js';
import { getParams } from '.';

let router = null;
let store = null;

// 处理原生体育的request
const isNativeSport = window.location.href.includes('/native-sports/');

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_WEB_API_URL,
  method: 'post',
  timeout: 30000,
  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // 默认的
});

// 拦截器错误信息队列
const CancelToken = axios.CancelToken;
const requestQueue = new Map();
const loadingQueue = new Set();

// 请求拦截器配置
instance.interceptors.request.use(
  (config) => {
    const source = getParams('source');
    let token = Cookies.get('access_token');

    if (source === 'app') {
      token = getParams('token') ?? '';
      Cookies.set('access_token', token);
      Cookies.set('source', 'app');
    } else if (config.url.includes('agentapi')) {
      token = Cookies.get('agent_access_token');
    }

    let query = {};
    if (config.url.includes('sabadirect')) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem('saba_token')}`,
      };
    } else {
      query = {
        merchant_no: import.meta.env.VITE_APP_MERCHANT_NO,
        access_token: token,
        token: Cookies.get('sport_access_token'),
        language: localStorage.getItem('sport_lang'),
      };
    }

    if (config.url.includes('token')) {
      query.language = '';
    }

    config.LOADING = config?.params?.LOADING || config?.data?.LOADING;
    config.NO_ROUTE = config?.params?.NO_ROUTE || config?.data?.NO_ROUTE;

    if (config.params?.LOADING) {
      delete config.params.LOADING;
    }

    if (requestQueue.has(config.url)) {
      requestQueue.get(config.url)('cancel');
      requestQueue.delete(config.url);
    } else {
      if (!config.params?.NO_FILTER && !config.data?.NO_FILTER) {
        config.cancelToken = new CancelToken((cancel) => {
          requestQueue.set(config.url, cancel);
        });
      }
      if (config.LOADING) {
        loadingQueue.add(config.url);
        ToastLoading.loading({
          duration: 0,
        });
      }

      if (config.params?.NO_FILTER) {
        delete config.params.NO_FILTER;
      }
      if (config.params?.LOADING) {
        delete config.params.LOADING;
      }
      if (config.data?.NO_FILTER) {
        delete config.data.NO_FILTER;
      }
      if (config.data?.LOADING) {
        delete config.data.LOADING;
      }
    }

    if (typeof FormData !== 'undefined') {
      const key = config.method === 'get' ? 'params' : 'data';
      if (config[key] instanceof FormData) {
        Object.keys(query).map((index) => config[key].append(index, query[index]));
      } else {
        config[key] = { ...query, ...config[key] };
      }
    }

    return config;
  },
  (error) => Promise.error(error),
);

let isLogout = 0;
let clearLoadingTimer = null;
// 响应拦截器配置
instance.interceptors.response.use(
  (response) => {
    requestQueue.delete(response.config.url);
    loadingQueue.delete(response.config.url);

    if (clearLoadingTimer) clearTimeout(clearLoadingTimer);
    clearLoadingTimer = setTimeout(() => {
      if (!loadingQueue.size) {
        ToastLoading.clear();
      }
    }, 300);

    const source = getParams('source');
    // if (source === 'app') {
    //   return response.data.data;
    // }

    let errorFlag = false;
    let clearFlag = false;
    if (!response.config.url.includes('sabadirect')) {
      switch (response.data.code) {
        case 0:
          break;
        case -5:
        case -6:
        case -4:
          errorFlag = true;
          break;
        case -990:
        case -998:
          clearFlag = true;
          errorFlag = true;
          isLogout += 1;
          break;
        case -1:
          errorFlag = true;
          isLogout += 1;
          break;
        case -999:
          clearFlag = true;
          errorFlag = true;
          isLogout += 1;
          break;
        default:
          errorFlag = true;
      }
    } else if (response.data.errorCode) {
      errorFlag = true;
    }

    if (clearFlag) {
      if (source === 'app') {
        window.location.href = 'blizzwin://login';
      } else if (isMicro) {
        window.location.pathname = '/login';
      } else {
        const { url } = response.config;
        // 原生体育token过期逻辑
        if (isNativeSport) {
          location.href = `//${location.host}/login`;
        } else {
          router?.push({
            path: url.includes('agentapi') ? '/affiliate?isLogin' : '/login',
          });
        }
      }
    }

    if (errorFlag) {
      Toast.clear();
      if (isLogout <= 1) {
        Toast.fail({
          message: response.data.msg || response.data.message,
          duration: 2500,
          onClose() {
            isLogout = 0;
          },
        });
      }

      return Promise.reject(response.data);
    }

    if (response.config.url.includes('sabadirect')) {
      return response.data;
    }

    return response.data.data;
  },
  (error, resp) => {
    Toast.clear();
    console.log(error);
    // Toast.fail({
    //   message: response.data.msg || response.data.message,
    //   duration: 2500,
    //   onClose() {
    //     isLogout = 0;
    //   },
    // });
    Promise.reject(error);
  },
);

export default function request(url, params) {
  const { config } = resetParams({
    instance,
    url,
    params,
    store,
  });
  // instance.defaults.headers = { ...instance.defaults.headers, ...headers };
  return instance(config);
}

export function requestInit(_router, _store) {
  if (!store) { store = _store; }
  if (!router) {
    router = _router;
    ToastLoading.setRouter(_router);
  }
}
