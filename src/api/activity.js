import request from '@/utils/request';
// 红包雨活动
// 获取红包雨详情
export async function getRedRainInfo() {
  return request('/getredMoneyRain', {
    method: 'get',
  });
}

// 领取红包雨活动奖金
export async function claimRedRain() {
  return request('/takeRedRain', {
    method: 'get',
  });
}

// 领取红包雨活动奖金列表
export async function getRedRainWinList(params) {
  return request('/get_redMoneyRainWinList', {
    method: 'get',
    params,
  });
}

// 记录用户参与场次
export async function redMoneyRound(params) {
  return request('/red_money_round', {
    method: 'get',
    params,
  });
}
// 专题活动详情接口
export async function specialdetail(params) {
  return request('/specialdetail', {
    method: 'get',
    params,
  });
}

// 存款六重礼领取记录接口
export function sixinforecord(params) {
  return request({
    url: '/sixinforecord',
    method: 'get',
    params,
  });
}
// 存款六重礼信息接口
export function sixinfo(params) {
  return request({
    url: '/sixinfo',
    method: 'get',
    params,
  });
}
// 领取新手六重礼
export function getsixinfoReward(params) {
  return request({
    url: '/getsixinfoReward',
    method: 'get',
    params,
  });
}
