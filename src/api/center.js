import request from '@/utils/request';

const getBaseUrl = (isAgent) => (isAgent ? import.meta.env.VITE_APP_AGENT_API_URL : import.meta.env.VITE_APP_WEB_API_URL);

// 商户游戏列表接口
export async function mybetstat(params) {
  return request('/mybetstat', {
    params,
    method: 'get',
  });
}

// 获取审核中的存款和取款列表
export async function getdepositandwithdrawlist(params) {
  return request('/getdepositandwithdrawlist', {
    method: 'get',
    params,
  });
}

// 取款周排行榜接口
export async function withdrawtopinfo(params) {
  return request('/withdrawtopinfo', {
    method: 'get',
    params,
  });
}

// 支付类型
export async function allordertype(params) {
  return request('/allordertype', {
    method: 'get',
    params,
  });
}

// 获取支付渠道
export async function paytype(params, isAgent) {
  const url = isAgent ? `/pay_type` : `/paytype`;
  return request(url, {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
    params,
  });
}

// 获取支付金额选项
export async function paymethodinfo({ pay_method_id }, isAgent) {
  const url = isAgent ? `/pay_method_info?pay_method_id=${pay_method_id}` : `/paymethodinfo/${pay_method_id}`;
  return request(url, {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
  });
}

// 存款状态
export async function allorderstatus(params) {
  return request('/allorderstatus', {
    method: 'get',
    params,
  });
}

// 获取数字货币协议
export async function getprotocol(params, isAgent) {
  return request('/getprotocol', {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
    params,
  });
}

// 存款记录
export async function orderlist(params) {
  return request('/orderlist', {
    method: 'get',
    params,
  });
}

// 平台转账
export async function trans(data) {
  return request('/trans', {
    method: 'post',
    data,
  });
}

// 获取数字货币汇率
export async function getticker(params, isAgent) {
  return request('/getticker', {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
    params,
  });
}

// 账变记录类型
export async function walletrecordtype(params) {
  return request('/walletrecordtype', {
    method: 'get',
    params,
  });
}

// 取款信息
export async function withdrawlistinfo(params) {
  return request('/withdrawlistinfo', {
    method: 'get',
    params,
  });
}

// 取款列表
export async function withdrawlist(params) {
  return request('/withdrawlist', {
    method: 'get',
    params,
  });
}

// 取款状态
export async function allwithdrawstatus(params) {
  return request('/allwithdrawstatus', {
    method: 'get',
    params,
  });
}

// 转账列表
export async function translog(params) {
  return request('/translog', {
    method: 'get',
    params,
  });
}

// 红利记录
export async function benefitlist(params) {
  return request('/benefitlist', {
    method: 'get',
    params,
  });
}

// 投注记录
export async function betlog(params) {
  return request('/betlog', {
    method: 'get',
    params,
  });
}

// 账变记录
export async function walletrecord(params) {
  return request('/walletrecord', {
    method: 'get',
    params,
  });
}

// 账变信息
export async function walletrecordinfo(params) {
  return request('/walletrecordinfo', {
    method: 'get',
    params,
  });
}

// vip信息
export async function vipprivilegeinfo(params) {
  return request('/vipprivilegeinfo', {
    method: 'get',
    params,
  });
}

// 服务订阅
export async function getsubscribemsg(params) {
  return request('/getsubscribemsg', {
    method: 'get',
    params,
  });
}

// 取款信息
export async function subscribemsg(data) {
  return request('/subscribemsg', {
    method: 'post',
    data,
  });
}

// 站内信接口
export async function message(params) {
  return request('/message', {
    method: 'get',
    params,
  });
}

// // 全部站内信消息
// export async function messagetypelist(params) {
//   return request('/messagetypelist', {
//     method: 'get',
//     params,
//   });
// }

// 站内信全部已读
export async function readallmessage(data) {
  return request('/readallmessage', {
    method: 'post',
    data,
  });
}

// 清除站内信
export async function clearmessage(data) {
  return request('/clearmessage', {
    method: 'post',
    data,
  });
}

// 获取公告列表
export async function sitenotice(params) {
  return request('/sitenotice', {
    method: 'get',
    params,
  });
}

// 阅读全部公告接口
export async function readallnotice(data) {
  return request('/readallnotice', {
    method: 'post',
    data,
  });
}

// 修改密码
export async function setpass(data) {
  return request('/setpass', {
    method: 'post',
    data,
  });
}

// 添加银行卡
export async function addbankcard(data) {
  return request('/addbankcard', {
    method: 'post',
    data,
  });
}

// 修改支付密码
export async function setpaypass(data) {
  return request('/setpaypass', {
    method: 'post',
    data,
  });
}

// 删除虚拟币钱包
export async function deldigwallet(data) {
  return request('/deldigwallet', {
    method: 'post',
    data,
  });
}

// 自动免转钱包
export async function autotrans(data) {
  return request('/autotrans', {
    method: 'post',
    data,
  });
}

// 忘记密码密保问题
export async function passquestion(params) {
  return request('/passquestion', {
    method: 'get',
    params,
  });
}

// 设置密保
export async function setpassquestion(data) {
  return request('/setpassquestion', {
    method: 'post',
    data,
  });
}

// 更新个人信息
export async function updateProfile(data) {
  return request('/updateprofile', {
    method: 'post',
    data,
  });
}

// 更新个人信息
export async function forgetpass(data) {
  return request('/forgetpass', {
    method: 'post',
    data,
  });
}

// 重制密码
export async function forgetpassreset(data) {
  return request('/forgetpassreset', {
    method: 'post',
    data,
  });
}

// 忘记密码校验手机验证码
export async function forgetpasscode(data) {
  return request('/forgetpasscode', {
    method: 'post',
    data,
  });
}

// 忘记密码密保问题校验
export async function forgetsafequestion(data) {
  return request('/forgetsafequestion', {
    method: 'post',
    data,
  });
}

// 获取手机验证码
export async function smscode(data) {
  return request('/smscode', {
    method: 'post',
    data,
  });
}

// 获取手机验证码
export async function bindmobile(data) {
  return request('/bindmobile', {
    method: 'post',
    data,
  });
}

// 获取邮箱验证码
export async function setemail(data) {
  return request('/setemail', {
    method: 'post',
    data,
  });
}

// 绑定邮箱
export async function bindemail(data) {
  return request('/bindemail', {
    method: 'post',
    data,
  });
}

// 一键回收余额
export async function backtransall(data) {
  return request('/backtransall', {
    method: 'post',
    data,
  });
}

// 忘记密码手机验证码
export async function forgetpasssmscode(data) {
  return request('/forgetpasssmscode', {
    method: 'post',
    data,
  });
}

// 忘记密码校验邮箱验证码
export async function forgetpassemailcodecheck(data) {
  return request('/forgetpassemailcodecheck', {
    method: 'post',
    data,
  });
}

// 忘记密码邮箱验证码
export async function forgetpassemailcode(data) {
  return request('/forgetpassemailcode', {
    method: 'post',
    data,
  });
}

// 洗码记录
export async function washcoderecord(params) {
  return request('/washcoderecord', {
    method: 'get',
    params,
  });
}

// 一键洗码列表接口
export async function washcodelist(params) {
  return request('/washcodelist', {
    method: 'get',
    params,
  });
}

// 一键洗码接口
export async function dowashcode(data) {
  return request('/dowashcode', {
    method: 'post',
    data,
  });
}

// 理财钱包交易记录接口
// 参数名 必选 类型 说明
// start_time 否 date 开始日期如2019-10-10
// end_time 否 date 结束日期如2019-10-10
// type 否 int 交易类型
export async function transrecord(params) {
  return request('/transrecord', {
    method: 'get',
    params,
  });
}

// 理财钱包交易类型接口
export async function allmoneytranstype(params) {
  return request('/allmoneytranstype', {
    method: 'get',
    params,
  });
}

// 理财钱包余额以及收益接口
export async function moneywallet(params) {
  return request('/moneywallet', {
    method: 'get',
    params,
  });
}

// 所有理财钱包方式接口
export async function allmoneytype(params) {
  return request('/allmoneytype', {
    method: 'get',
    params,
  });
}

// 理财钱包转账接口
export async function moneytrans(data) {
  return request('/moneytrans', {
    method: 'post',
    data,
  });
}

// 用户取款接流水稽查（流水是否达标，可以取款？
export async function canwithdraw(params) {
  return request('/canwithdraw', {
    method: 'get',
    params,
  });
}

// 取款稽查列表接口
export async function rechargeflow(params) {
  return request('/rechargeflow', {
    method: 'get',
    params,
  });
}

// 虚拟币支付类型与协议列表
export async function staticprotocol(params) {
  return request('/staticprotocol', {
    method: 'GET',
    params,
  });
}

// 虚拟币钱包列表
export async function digwalletlist(params) {
  return request('/digwalletlist', {
    method: 'GET',
    params,
  });
}

// 添加修改虚拟币钱包
export async function adddigwallet(data) {
  return request('/adddigwallet', {
    method: 'post',
    data,
  });
}

// 获取用户取款未达到流水和需扣除红利金额
// "data": {
//   "draw_limit_amount": 300, // 未到达流水金额部分
//   "deduction_money": 0 // 取款计算金额需扣除红利金额
// }
export async function withdrawlimitinfo(params) {
  return request('/withdrawlimitinfo', {
    method: 'get',
    params,
  });
}

// 用户取款接口
export async function withdraw(data) {
  return request('/withdraw', {
    method: 'post',
    data,
  });
}

// 获取服务订阅接口
export async function getsubscribe(params) {
  return request('/getsubscribe', {
    method: 'get',
    params,
  });
}

// 服务订阅接口
export async function subscribe(data) {
  return request('/subscribe', {
    method: 'post',
    data,
  });
}

// 获取所有游戏分类
export async function allgamecate(params) {
  return request('/allgamecate', {
    method: 'get',
    params,
  });
}

// 获取所有游戏余额
export async function gamecateplatform(params) {
  return request('/gamecateplatform', {
    method: 'get',
    params,
  });
}

// 所有活动记录状态接口
export async function preferentialactivity(params) {
  return request('/preferentialactivity', {
    method: 'get',
    params,
  });
}

// 用户存款接口
export async function order(data, isAgent) {
  return request('/order', {
    baseURL: getBaseUrl(isAgent),
    method: 'post',
    data,
  });
}

// 用户平台间转账接口
export async function merchantbank(params, isAgent) {
  return request('/merchantbank', {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
    params,
  });
}

// 商户收款银行信息接口
export async function checkorder(params) {
  return request('/checkorder', {
    method: 'get',
    params,
  });
}

// 所有银行列表接口
export async function allbanklist(isAgent) {
  return request('/allbanklist', {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
  });
}

// 用户所有银行卡接口
export async function banklist(params, isAgent) {
  return request('/banklist', {
    baseURL: getBaseUrl(isAgent),
    method: 'get',
    params,
  });
}

// 历史货币
export async function historycurrency(params) {
  return request('/history_currency', {
    method: 'get',
    params,
  });
}

// 检查旧资金密码
export async function checkpayoldpass(data) {
  return request({
    url: '/checkpayoldpass',
    method: 'post',
    data,
  });
}

// 会员升级提示接口
export async function memberupdatetips(params) {
  return request('/memberupdatetips', {
    method: 'get',
    params,
  });
}

// 阅读一条站内信接口
export async function readmessage(data) {
  return request('/readmessage', {
    method: 'post',
    data,
  });
}

// 根据存款金额和参与的优惠活动计算流水要求
export async function activity_require(params) {
  return request('/activity_require', {
    method: 'get',
    params,
  });
}
