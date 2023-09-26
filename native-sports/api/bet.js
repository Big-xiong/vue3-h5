import request from '@/utils/request';

// 获取用户历史注单
export async function bet_details(params) {
  return request('/sport/bet_details', {
    method: 'get',
    params,
  });
}

// 串关投注
export async function place_parlay(params) {
  return request('/sport/place_parlay', {
    method: 'post',
    data: params,
  });
}

// 单注投注
export async function place_bet(params) {
  return request('/sport/place_bet', {
    method: 'post',
    data: params,
  });
}

// 获取串关注单的信息
export async function parlay_tickets(params) {
  return request('/sport/parlayTickets', {
    method: 'post',
    data: params,
  });
}

// 获取单注单的信息
export async function single_ticket(data) {
  return request('/sport/singleticket', {
    method: 'post',
    data,
  });
}

export async function GetParlayTickets(data) {
  return request('https://sabadirect-test.binanlyst.com/betting/v1/GetParlayTickets', {
    data,
    method: 'post',
  });
}