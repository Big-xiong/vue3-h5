import request from '@/utils/request';

// 商户游戏列表接口
export async function gamelist(params) {
  return request('/gamelist', {
    params,
    method: 'get',
  });
}

// banner
export async function indexbanner(params) {
  return request('/indexbanner', {
    params,
    method: 'get',
  });
}

const config = {
  'zh-TW': 'zh-TW',
  zh: 'zh-CN',
  en: 'en',
  th: 'th',
  vi: 'vi',
};

// 服务端获取IP语言
export async function getRegionLang(params = {}) {
  // return new Promise((resolve) => resolve('zh'));
  return request('/iplocale', {
    method: 'get',
    params,
  }).then((data) => data.locale);
}

// 打开游戏接口
export async function openGame(params) {
  return request('/open', {
    params,
    method: 'get',
  });
}

// 获取推荐码货币
export async function spreadcodecurrency(params) {
  return request('/spread_code_currency', {
    params,
    method: 'get',
  });
}

export async function getHeaders(store) {
  const locale = await getRegionLang({ check: 1 });
  const list = await request('/regionlist', {
    method: 'get',
  });

  async function getPhoneAreaByRegion(region) {
    await store.dispatch('app/getDict', 'phoneareav3');
    let areaCode = '';

    store.state.app.dicts.phoneareav3.forEach((item) => {
      if (item.includes(region)) {
        const splited = item.split('-');
        areaCode = splited[splited.length - 1];
      }
    });
    return areaCode;
  }

  const langMatchingItem = list.find((item) => navigator.language.includes(item.lang.toLowerCase()));
  if (!store.state?.user?.isLogin) {
    const ipItem = list.find((item) => item.lang.toLowerCase() === locale.toLowerCase());
    if (langMatchingItem) {
      store.commit('app/SET_HEADERS', {
        regionId: langMatchingItem.id,
        currencyId: langMatchingItem.currency_conf.default.id,
        matchingAreaCode: await getPhoneAreaByRegion(langMatchingItem.name),
        isLangMatching: true,
      });

      return {
        locale, isMatching: !!ipItem,
      };
    }

    const item = list.find((_item) => _item.is_default === 1);
    store.commit('app/SET_HEADERS', {
      regionId: item.id,
      currencyId: item.currency_conf.default.id,
      matchingAreaCode: await getPhoneAreaByRegion(item.name),
      isLangMatching: false,
    });

    return {
      locale, isMatching: !!ipItem,
    };
  }
}
