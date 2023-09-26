import request from '@/utils/request';

// 获取token
export async function getToken(data) {
  return request('/token', {
    data,
    method: 'post',
  });
}

// 账号注册
export async function register(data) {
  return request('/register', {
    data,
    method: 'post',
  });
}

// 账号注册
export async function firstchange(data) {
  return request('/firstchange', {
    data,
    method: 'post',
  });
}

// 账号注册
export async function quickregister(data) {
  return request('/quickregister', {
    data,
    method: 'post',
  });
}

// 账号登录
export async function login(data) {
  return request('/login', {
    data,
    method: 'post',
  });
}

// 获取用户详情
export async function member(data) {
  return request('/member', {
    data,
    method: 'get',
  });
}

// 会员平台钱包余额接口
export async function wallet(params) {
  return request('/wallet', {
    method: 'get',
    params,
  });
}

// 手机登录
export async function withdrawcheckemail() {
  return request('/withdraw_checkemail', {
    method: 'get',
  });
}

// 手机登录
export async function mobileLogin(data) {
  return request('/mobilelogin', {
    data,
    method: 'post',
  });
}
// 手机注册
export async function mobileregister(data) {
  return request('/mobileregister', {
    data,
    method: 'post',
  });
}
