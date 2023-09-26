import Cookies from 'js-cookie';

// 方便后期更换存储方式
const DATA_PROXY = {
  set(key, val) {
    Cookies.set(key, val);
  },
  get(key) { return Cookies.get(key); },
};

// 获取会员中心header设置所需内容
async function getProtocolId(baseUrl, instance) {
  let inte_region_id = DATA_PROXY.get('inte_region_id');
  let inte_currency_id = DATA_PROXY.get('inte_currency_id');

  const inte_type = DATA_PROXY.get('inte_type');
  const isLogin = DATA_PROXY.get('isLogin'); // store.getters['user/isLogin'];
  const type = isLogin ? 'member' : 'regionlist';
  const lang = Cookies.get('lang') === 'zh-CN' ? 'zh' : Cookies.get('lang') || 'zh';

  if (inte_type === type && inte_region_id && inte_currency_id) return { inte_region_id, inte_currency_id };

  // @todo 待多语言支持后接入语言状态
  const url = `${baseUrl}${type}`;
  const data = await instance.get(url);

  if (isLogin) {
    inte_region_id = data.inte_region_id;
    inte_currency_id = data.inte_currency_id;
  } else {
    const item = data.filter((v) => v.lang === lang)[0];
    inte_region_id = item.id;
    inte_currency_id = item.currency_conf.default.id;
  }

  DATA_PROXY.set('inte_type', type);
  DATA_PROXY.set('inte_region_id', inte_region_id);
  DATA_PROXY.set('inte_currency_id', inte_currency_id);
  return { inte_region_id, inte_currency_id };
}

// 获取代理中心header设置所需内容
async function getAgentProtocolId(baseUrl, instance) {
  if (!DATA_PROXY.get('isLogin')) {
    return { inte_region_id: null, inte_currency_id: null };
  }
  let inte_region_id = DATA_PROXY.get('agent_inte_region_id');
  let inte_currency_id = DATA_PROXY.get('agent_inte_currency_id');

  if (inte_region_id && inte_currency_id) return { inte_region_id, inte_currency_id };

  // @todo 待多语言支持后接入语言状态
  const url = `${baseUrl}userinfo`;
  const data = await instance.get(url);

  inte_region_id = data.inte_region_id;
  inte_currency_id = data.inte_currency_id;

  DATA_PROXY.set('agent_inte_region_id', inte_region_id);
  DATA_PROXY.set('agent_inte_currency_id', inte_currency_id);
  return { inte_region_id, inte_currency_id };
}

// 根据请求到的信息设置headers
export async function setHeaders(instance) {
  const baseUrl = import.meta.env.VITE_APP_AGENT_API_URL;
  const getPId = baseUrl.includes('agentapi') ? getAgentProtocolId : getProtocolId;
  const { inte_region_id, inte_currency_id } = await getPId(baseUrl, instance);

  if (inte_region_id && inte_currency_id) {
    const headers = {
      // 地区id
      'X-Inte-Region-Id': inte_region_id,
      // 货币id
      'X-Inte-Currency-Id': inte_currency_id,
    };

    // eslint-disable-next-line no-param-reassign
    instance.defaults.headers = { ...instance.defaults.headers, ...headers };
  }
}
