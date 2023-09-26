import request from '@/utils/request';

// 所有游戏分类接口
export async function allbenefit(params) {
  return request('/allbenefit', {
    params,
    method: 'get',
  });
}

// 活动详情
export async function activitydetail(params) {
  return request('/activitydetail', {
    params,
    method: 'get',
  });
}

// 专题活动详情接口
export async function specialdetail(params) {
  return request('/specialdetail', {
    method: 'get',
    params,
  });
}

// 优惠活动详情接口
export async function hedgetoplist(params) {
  return request('/hedgetoplist', {
    params,
    method: 'get',
  });
}

// 对冲基金购买接口
export async function joinhedge(data) {
  return request('/joinhedge', {
    method: 'post',
    data,
  });
}

// 对冲基金申请记录
export async function hedgejoinrecord(params) {
  return request('/hedgejoinrecord', {
    method: 'get',
    params,
  });
}

// 存款六重礼信息接口
export async function sixinfo(params) {
  return request('/sixinfo', {
    method: 'get',
    params,
  });
}

// 存款六重礼领取记录接口
export async function sixinforecord(params) {
  return request('/sixinforecord', {
    method: 'get',
    params,
  });
}

// 领取新手六重礼
export async function getsixinfoReward(params) {
  return request('/getsixinfoReward', {
    method: 'get',
    params,
  });
}

// 优惠活动详情接口
export async function spreadinfo(params) {
  return request('/spreadinfo', {
    method: 'get',
    params,
  });
}

// 优惠活动详情接口
export async function spreadrecord(params) {
  return request('/spreadrecord', {
    method: 'get',
    params,
  });
}

// 优惠活动详情接口
export async function getspreadmoney(params) {
  return request('/getspreadmoney', {
    method: 'post',
    params,
  });
}

// 优惠活动详情接口
export async function joinborrow(data) {
  return request('/joinborrow', {
    method: 'post',
    data,
  });
}

// 借贷宝破产申请
export async function brokeapply(data) {
  return request('/brokeapply', {
    method: 'post',
    data,
  });
}

// 借款申请记录
export async function borrowjoinrecord(params) {
  return request('/borrowjoinrecord', {
    method: 'get',
    params,
  });
}

// 欧洲杯活动-活动记录
export async function getEuroCupRecord(params) {
  return request('/euro_quiz_records', {
    method: 'get',
    params,
  });
}

// 欧洲杯活动-参与竞猜
export async function joinGuessEuroCup(data) {
  return request('/euro_quiz_answer', {
    method: 'post',
    data,
  });
}

// 欧洲杯活动-活动详情
export async function getEuroCupInfo(params) {
  return request('/specialdetail', {
    method: 'get',
    params,
  });
}

// 欧洲杯活动-轮次列表
export async function getEuroCupTurns(params) {
  return request('/euro_quiz_turns', {
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

// 领取活动
export async function getactivityaward(params) {
  return request('/getactivityaward', {
    method: 'get',
    params,
  });
}
