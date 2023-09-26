import request from '@/utils/request';
// 所有游戏分类接口
export async function getAllGameCates(params) {
  return request('/allgamecate', {
    params,
    method: 'get',
  });
}

// 获取游戏平台默认游戏ID接口
export async function getPlatformGameIds(params) {
  return request('/platformgameids', {
    params,
    method: 'get',
  });
}

// 游戏试玩
export async function fun(params) {
  return request('/fun', {
    params,
    method: 'get',
  });
}

// 打开游戏接口
export async function open(params) {
  return request('/open', {
    method: 'get',
    params,
  });
}

// merchant_no => 商户号
// game_cate_id => 游戏分类id
// platform_id => 游戏平台id
// is_accumulate => 是否累积 1=是，2=否
// is_payfor => 赔付线 [ 1=1-5线，2=5-20线，3=20-50线，4=50线以上（默认不传） ]
// name => 游戏名字
// 游戏列表（查询
export async function getGameLists(params) {
  return request('/gamelist', {
    method: 'get',
    params,
  });
}
// 参数名 必选 类型 说明
// merchant_no 是 int 商户号
// game_cate_id 是 int 游戏分类id
// platform_id 否 int 游戏平台id
// name 否 string 游戏名字
export async function getHotGameLists(params) {
  return request('/hotgame', {
    method: 'get',
    params,
  });
}
// 参数名 必选 类型 说明
// merchant_no 是 int 商户号
// game_cate_id 是 int 游戏分类id
// platform_id 否 int 游戏平台id
// name 否 string 游戏名字
export async function getNewGameLists(params) {
  return request('/newgame', {
    method: 'get',
    params,
  });
}
// 参数名 必选 类型 说明
// game_cate_id 是 int 游戏分类id
// platform_id 否 int 游戏平台id
// name 否 string 游戏名字
export async function getFavoriteGameLists(params) {
  return request('/favoritelist', {
    method: 'get',
    params,
  });
}

// 收藏/取消收藏游戏接口
// 参数名 必选 类型 说明
// game_id 是 int 游戏id
export async function favorite(data) {
  return request('/favorite', {
    method: 'post',
    data,
  });
}

// 游戏在线心跳检测
export async function onlinecheck(data) {
  return request('/onlinecheck', {
    method: 'post',
    data,
  });
}

// 奖金池（获取所有平台金额后统计）
export async function jackpots(params) {
  return request('/platformpot', {
    method: 'get',
    params,
  });
}

// 老虎机赔付线
export async function getpayforline(params) {
  return request('/getpayforline', {
    method: 'get',
    params,
  });
}

// 体育比赛数据
export async function sports(params) {
  return request('/sports', {
    method: 'get',
    params,
  });
}

// 电竞比赛数据
export async function esports(params) {
  return request('/gaming', {
    method: 'get',
    params,
  });
}

// 游戏分类接口
// merchant_no 是 int 商户号
// pid 否 int 游戏分类id
export async function getAllGameSubcate(params) {
  return request('/allgamesubcate', {
    method: 'get',
    params,
  });
}

export async function recommendgame(params) {
  return request('/recommendgame', {
    method: 'get',
    params,
  });
}

// 热门彩种
// merchant_no 是 int 商户号
export async function hotLottery(params) {
  return request('/hotlottery', {
    method: 'get',
    params,
  });
}

// 游戏关闭自动转回余额
export async function backtrans(data) {
  return request('/backtrans', {
    method: 'post',
    data,
  });
}

// 电子游戏平台排序
export async function getPlatformGameIdsv2(params) {
  return request('/platformgameidsv2', {
    method: 'get',
    params,
  });
}

export async function getroulettedeposite(params) {
  return request('/roulettedeposite', {
    method: 'get',
    params,
  });
}

// 新排行榜接口
// 参数名	必选	类型	说明
// merchant_no	是	int	商户号
export async function profitRank(params) {
  return request({
    url: '/newtoplist',
    params,
    method: 'get',
  });
}
// 奖金池游戏列表
export const getBonusGameLists = (params) => request({
  url: '/bonusgame',
  params,
});
// 首页排行棒（简化数据版）
// 参数名	必选	类型	说明
// merchant_no	是	int	商户号
export const profitRankIndex = (params) => request({
  url: '/indexprofitlist',
  params,
});

// 所有游戏平台接口
export const getAllPlatforms = (params) => request({
  url: '/allplatform',
  params,
  method: 'get',
});

// 获取所有游戏分类的游戏平台
export const getAllGameCatesPlatforms = (params) =>
  // const newParams = Object.assign({
  //   merchant_no: process.env.VUE_APP_MERCHANT_NO
  // }, params)
  request({
    url: '/platformgameidsv2',
    params,
    method: 'get',
  });
// 获取所有游戏分类的游戏平台
export async function getPlatformgameidsv3(params) {
  return request('/platformgameidsv3', {
    params: {
      ...params,
      dev_type: 2,
    },
    method: 'get',
  });
}
