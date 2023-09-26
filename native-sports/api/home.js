import request from '@/utils/request';

// 首页:赛事统计
export async function sport_static(params) {
  return request('/sport/sport_static', {
    method: 'get',
    params,
  });
}

// 所有赛事类型
export async function sport_typelist(params) {
  return request('/sport/sport_typelist', {
    method: 'get',
    params,
  });
}

// 赛事列表
export async function events_list(params) {
  return request('/sport/events_list', {
    method: 'get',
    params,
  });
}

// 获取赛事关注列表
export async function notice_list(params) {
  return request('/sport/notice_list', {
    method: 'get',
    params,
  });
}

// 添加赛事关注
export async function add_notice(data) {
  return request('/sport/add_notice', {
    method: 'post',
    data,
  });
}

// 获取用户联赛列表
export async function user_leagues(params) {
  return request('/sport/user_leagues', {
    method: 'get',
    params,
  });
}

// 保存用户联赛列表
export async function leagues_save(data) {
  return request('/sport/leagues_save', {
    method: 'post',
    data,
  });
}

// 获取所有联赛列表
export async function leagues_list(params) {
  return request('/sport/leagues_list', {
    method: 'get',
    params,
  });
}

// 获取游戏详情
export async function event_detail(params) {
  return request('/sport/event_detail', {
    method: 'get',
    params,
  });
}

// 获取赛果
export async function event_result(params) {
  return request('/sport/event_result', {
    method: 'get',
    params,
  });
}

// 发送弹幕
export async function postMessage(params) {
  return request('/sport_barrage_send', {
    method: 'POST',
    data: params,
  });
}

// 发送弹幕
export async function getMessage(params) {
  return request('/barrage_list', {
    method: 'get',
    params,
  });
}

// 获取公告
export async function sitenotice(params) {
  return request('/sitenotice', {
    method: 'get',
    params,
  });
}

// 阅读公告
export async function readnotice(data) {
  return request('/readnotice', {
    data,
    method: 'post',
  });
}

// 已读所有公告
export async function readallnotice(data) {
  return request('/readallnotice', {
    data,
    method: 'post',
  });
}

export async function pinying_group(data) {
  return request('/pinyin_group', {
    data,
    method: 'post',
  });
}

export async function GetLeagues(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetLeagues', {
    params,
    method: 'get',
  });
}


export async function GetSports(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetSports', {
    params,
    method: 'get',
  });
}

export async function GetEventResults(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetEventResults', {
    params,
    method: 'get',
  });
}

export async function GetMarkets(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetMarkets', {
    params,
    method: 'get',
  });
}

export async function GetEvents(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetEvents', {
    params,
    method: 'get',
  });
}

export async function GetStreaming(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetStreaming', {
    params,
    method: 'get',
  });
}

export async function getPromotions(params) {
  return request('https://sabadirect-test.binanlyst.com/sports/v1/GetPromotions', {
    params,
    method: 'get',
  });
}