import request from '@/utils/request';

// 平台彩池
export async function platformpot(params) {
  return request('/platformpot', {
    params,
    method: 'get',
  });
}

// 商户游戏列表接口
export async function gamelist(params) {
  return request('/gamelist', {
    params,
    method: 'get',
  });
}

// 获取赔付线
export async function getpayforline(params) {
  return request('/getpayforline', {
    params,
    method: 'get',
  });
}

// 获取二级分类
export async function allgamesubcate(params) {
  return request('/allgamesubcate', {
    params,
    method: 'get',
  });
}

// 最近游玩游戏
export async function historylist(params) {
  return request('/historylist', {
    params,
    method: 'get',
  });
}

// 热门游戏
export async function hotgame(params) {
  return request('/hotgame', {
    params,
    method: 'get',
  });
}

// 最新游戏
export async function newgame(params) {
  return request('/newgame', {
    params,
    method: 'get',
  });
}

// 收藏游戏列表
export async function favoritelist(params) {
  return request('/favoritelist', {
    params,
    method: 'get',
  });
}

// 电子累积奖金
export async function bonusgame(params) {
  return request('/bonusgame', {
    params,
    method: 'get',
  });
}
