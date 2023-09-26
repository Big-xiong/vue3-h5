import request from '@/utils/request';
// import { param } from '@/utils/utils'

// VIP权益与特享接口
// merchant_no	是	int	商户号
// type	是	int	1=权益，2=特享
export async function vipPrivilege(params) {
  return request('/vipindex', {
    method: 'get',
    params,
  });
}

// 会员中心福利活动接口
export function privilegeactivity(params) {
  return request('/privilegeactivity', {
    method: 'get',
    params,
  });
}

// 个人vip特权信息
// merchant_no	是	int	商户号
export async function vipprivilegeinfo(params) {
  return request('/vipprivilegeinfo', {
    method: 'get',
    params,
  });
}

// VIP特权等级与洗码比例对应接口
// merchant_no	是	int	商户号
// game_cate_id	是	int	游戏分类id
export async function activitybenefit(params) {
  return request('/activitybenefit', {
    method: 'get',
    params,
  });
}

// VIP权益与特享接口
// merchant_no	是	int	商户号
// type	是	int	1=权益，2=特享
export async function vipindex(params) {
  return request('/vipindex', {
    method: 'get',
    params,
  });
}

// 参与VIP活动接口
// merchant_no	是	int	商户号
// vip_act_id	是	int	活动id
// name	是	string	用户姓名
// mobile	是	string	手机号带区号如+86135667788
// join_time	是	datetime	参与时间如2019-10-10 00:00:00
export async function joininactivity(data) {
  return request('/joininactivity', {
    method: 'post',
    data,
  });
}

// VIP特权与尊享活动接口
// merchant_no	是	int	商户号
// type	是	int	1=特权，2=尊享活动
// status	是	int	1=未开始，2=进行中，3=已结束
export async function vipactivity(params) {
  return request('/vipactivity', {
    method: 'get',
    params,
  });
}

// VIP特权与尊享活动接口
// merchant_no	是	int	商户号
// days	是	int	查看天数，做多15天
export async function mybetstat(params) {
  return request('/mybetstat', {
    method: 'get',
    params,
  });
}

export async function activitySave(data) {
  return request('/activity_save', {
    method: 'post',
    data,
  });
}

export async function viptips(params) {
  return request('/viptips', {
    method: 'get',
    params,
  });
}

// 所有特权等级与洗码比例对应接口
export async function allactivitybenefit(params) {
  return request('/allactivitybenefit', {
    method: 'get',
    params,
  });
}

// 商户游戏列表接口
export async function activitylist(params) {
  return request('/activitylist', {
    method: 'get',
    params,
  });
}
