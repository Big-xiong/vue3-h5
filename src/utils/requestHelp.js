import Cookies from 'js-cookie';
import md5 from 'md5';

function getRegionInfo(store, isAgent) {
  const app = store?._state?.data?.app;
  const headers = app?.headers ?? {};
  const agentHeaders = app?.agentHeaders ?? {};
  // const { headers, agentHeaders } = store?._state?.data?.app;
  const _headers = isAgent ? agentHeaders : headers;
  return {
    headers: _headers,
    regionInfo: {
      inte_currency_id: _headers['X-Inte-Currency-Id'],
      inte_region_id: _headers['X-Inte-Region-Id'],
    },
  };
}

/*
config:{
  url,
  method,
  params,
} */

// 上行参数处理
export function resetParams({
  instance, url, params, store,
}) {
  let config = url;
  if (typeof url === 'string') {
    config = { url, ...params };
  }
  // const lang = Cookies.get('lang') === 'zh-CN' ? 'zh' : Cookies.get('lang') || 'zh';
  const language = localStorage.getItem('sport_lang');
  const type = config.method === 'get' ? 'params' : 'data';

  const {
    CACHE = false,
    ISAGENT,
  } = config[type] ?? {};

  const _url = config.baseURL || config.url;
  const _isAgent = ISAGENT || _url?.includes('agentapi');

  const {
    regionInfo,
    headers,
  } = getRegionInfo(store, _isAgent);

  if (CACHE) delete config[type].CACHE;
  if (ISAGENT) delete config[type].ISAGENT;

  let subConfig = import.meta.globEager('/src/current_project/config/index.js');
  subConfig = Object.values(subConfig)?.[0]?.default;

  if (!(config[type] instanceof FormData)) {
    config[type] = subConfig.isCurrency ? { ...regionInfo, ...config[type], language } : { ...config[type], language };

    if (config.url.includes('token')) {
      delete config[type].language;
    }
  }
  instance.defaults.headers = subConfig.isCurrency ? { ...instance.defaults.headers, ...headers } : { ...instance.defaults.headers };

  return {
    CACHE,
    key: md5(url + JSON.stringify(config[type])),
    config,
  };
}
