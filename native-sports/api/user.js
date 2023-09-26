import request from '@/utils/request';

// 用户注册
export async function balance() {
  return request('/sport/balance', {
    method: 'get',
  });
}

// 用户注册
export async function sportregister(data) {
  return request('/sport/register', {
    method: 'post',
    data,
  });
}

// 获取当前商户的token
export async function get_access_token(params) {
  return request('/sport/get_access_token', {
    method: 'get',
    params,
  });
}

// 获取当前商户的token
export async function saba_token() {
  return request('/sport/saba_token', {
    method: 'get',
  });
}

export async function refresh_saba_token() {
  return request('/sport/refresh_token', {
    method: 'get',
  });
}
