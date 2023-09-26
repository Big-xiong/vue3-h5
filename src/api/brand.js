import request from '@/utils/request';

// 所有游戏分类接口
export async function brandlist(params) {
  return request('/brandlist', {
    params,
    method: 'get',
  });
}

// 往期约会名单
export async function past_appointments(params) {
  return request('/past_appointments', {
    method: 'get',
    params,
  });
}
