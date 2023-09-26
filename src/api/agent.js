import request from '@/utils/request';

const baseUrl = import.meta.env.VITE_APP_AGENT_API_URL;

// 用户所有银行卡接口
export function bankcardlist(params) {
  return request({
    url: `${baseUrl}bankcardlist`,
    method: 'get',
    params,
  });
}

// 代理注册和推荐码配置
export function auditsetting(params) {
  return request({
    url: `${baseUrl}audit_setting`,
    method: 'get',
    params,
  });
}

export function commisionsheet(params) {
  return request({
    url: `${baseUrl}commisionsheet`,
    method: 'get',
    params,
  });
}

// 绑定类型
export function bindtype(data) {
  return request({
    method: 'post',
    url: `${baseUrl}advertise_contact_switch`,
    data,
  });
}

// 代理首页数据
export function agentrelation(params) {
  return request({
    method: 'get',
    url: `${baseUrl}relation_data`,
    params,
  });
}

// 代理首页banner
export function indexbanner(data) {
  return request({
    method: 'get',
    url: `${baseUrl}indexbanner`,
    data,
  });
}

export function bindemail(params) {
  return request({
    method: 'post',
    url: `${baseUrl}/bindemail`,
    params,
  });
}

// 代理注册接口
export function register(data) {
  return request({
    method: 'post',
    url: `${baseUrl}register`,
    data,
  });
}

// 绑定联系方式
export function bindcontact(data) {
  return request({
    url: `${baseUrl}/bind_contact`,
    method: 'post',
    data,
  });
}

// 优秀代理列表(目前在user环境)
export function excellentagent() {
  return request({
    url: `/excellentagent`,
    method: 'get',
  });
}

// 代理存取款折线图
export function agentdwtrend(params) {
  return request({
    url: `${baseUrl}agentdwtrend`,
    method: 'get',
    params,
  });
}

// 代理会员变化折线图
export function agentmemberstrend(params) {
  return request({
    url: `${baseUrl}agentmemberstrend`,
    method: 'get',
    params,
  });
}

// 代理总览饼图
export function agentbetstat(params) {
  return request({
    url: `${baseUrl}agentbetstat`,
    method: 'get',
    params,
  });
}

// 遗漏申请:推广设备
export function devtypelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}dev_type_list`,
    params,
  });
}

// 遗漏申请:提出申请
export function askomit(data) {
  return request({
    method: 'post',
    url: `${baseUrl}ask_omit`,
    data,
  });
}

// 调整佣金比例
export function update_commission(data) {
  return request({
    method: 'post',
    url: `${baseUrl}update_commission`,
    data,
  });
}

// 代理下级转账
export function membertrans(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/membertrans`,
    data,
  });
}

// 代理下级转账获取验证码
export function membertranssmscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/membertranssmscode`,
    data,
  });
}

// 佣金转钱包余额
export function commissiontrans(data) {
  return request({
    method: 'post',
    url: `${baseUrl}/commissiontrans`,
    data,
  });
}

// 佣金转钱包余额
export function agentuserbetrank(params) {
  return request({
    method: 'get',
    url: `${baseUrl}/agentuserbetrank`,
    params,
  });
}

// 代理提现接口
export function withdraw(data) {
  return request({
    url: `${baseUrl}withdraw`,
    method: 'post',
    data,
  });
}

// 新增绑定银行卡接口
export function addbankcard(data) {
  return request({
    url: `${baseUrl}addbankcard`,
    method: 'post',
    data,
  });
}

// 代理所有银行列表
export function allbanklist(params) {
  return request({
    url: `${baseUrl}allbanklist`,
    method: 'get',
    params,
  });
}

// 代理:发送忘记密码:验证码
export function forgetpasssmscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}forgetpasssmscode`,
    data,
  });
}
// 代理:发送忘记密码:验证
export function forgetpasscode(data) {
  return request({
    method: 'post',
    url: `${baseUrl}forgetpasscode`,
    data,
  });
}

// 代理:重置密码
export function resetpass(data) {
  return request({
    method: 'post',
    url: `${baseUrl}resetpass`,
    data,
  });
}
// 更新代理资料接口
export function updatedetail(data) {
  return request({
    method: 'post',
    url: `${baseUrl}updatedetail`,
    data,
  });
}

// 代理转账
export function smscode(data) {
  return request({
    url: `${baseUrl}sms_code`,
    method: 'post',
    data,
  });
}

// 代理绑定手机号获取手机验证码
export function bindsmscode(data) {
  return request({
    url: `${baseUrl}bindsmscode`,
    method: 'post',
    data,
  });
}

// 修改代理绑定手机号
export function bindmobile(data) {
  return request({
    url: `${baseUrl}bindmobile`,
    method: 'post',
    data,
  });
}

// 代理修改密码接口
export function setpass(data) {
  return request({
    url: `${baseUrl}setpass`,
    method: 'post',
    data,
  });
}

// 代理修改资金密码接口
export function setpaypass(data) {
  return request({
    url: `${baseUrl}setpaypass`,
    method: 'post',
    data,
  });
}

// 绑定邮箱
export function getEmailcode(params) {
  return request({
    method: 'post',
    url: `${baseUrl}/bindemailcode`,
    params,
  });
}

// 遗漏申请:审核状态列表
export function auditstatuslist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}audit_status_list`,
    params,
  });
}

// 遗漏申请列表
export function omitlist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}omit_list`,
    params,
  });
}

// 遗漏申请:添加会员
export function omitadduser(data) {
  return request({
    method: 'post',
    url: `${baseUrl}omit_add_user`,
    data,
  });
}

//  推广素材
export function promotionsource(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source`,
    params,
  });
}

// 推广素材尺寸列表
export function promotionsourcesizelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source_size_list`,
    params,
  });
}

// 推广素材类型列表
export function promotionsourcetypelist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}promotion_source_type_list`,
    params,
  });
}

// 所有银行列表接口
export async function banklist(params) {
  return request({
    url: `${baseUrl}banklist`,
    method: 'get',
    params,
  });
}

// 推广链接:下级代理佣金比例
export async function setchildrate(data) {
  return request({
    method: 'post',
    url: `${baseUrl}setchildrate`,
    data,
  });
}

// 会员存款方式列表接口
export async function paytype(params) {
  return request({
    url: `${baseUrl}pay_type`,
    method: 'get',
    params,
  });
}

// 佣金结算状态
export async function agentcommissionstatus(params) {
  return request({
    url: `${baseUrl}agentcommissionstatus`,
    method: 'get',
    params,
  });
}

// 所有佣金领取状态接口
export async function allcommissionstatus(params) {
  return request({
    url: `${baseUrl}allcommissionstatus`,
    method: 'get',
    params,
  });
}

// 佣金记录
export async function agentcommissionlog(params) {
  return request({
    url: `${baseUrl}agentcommissionlog`,
    method: 'get',
    params,
  });
}

// 账变记录
export async function agentaccountchangelog(params) {
  return request({
    url: `${baseUrl}agentaccountchangelog`,
    method: 'get',
    params,
  });
}

// 账变类型
export async function agentaccountchangetype(params) {
  return request({
    url: `${baseUrl}agentaccountchangetype`,
    method: 'get',
    params,
  });
}

// 代理代充
export async function agentdeposite(data) {
  return request({
    method: 'post',
    url: `${baseUrl}agentdeposite`,
    data,
  });
}

// 添加代理
export async function addagent(data) {
  return request({
    url: `${baseUrl}addagent`,
    method: 'post',
    data,
  });
}

// 佣金概览
export function commissionOverview(data) {
  return request({
    url: `${baseUrl}/commission_overview`,
    method: 'get',
    data,
  });
}

// 会员概览
export function memberOverview(params) {
  return request({
    method: 'get',
    url: `${baseUrl}/member_overview`,
    params,
  });
}

// 添加下级
export async function addmember(data) {
  return request({
    url: `${baseUrl}addmember`,
    method: 'post',
    data,
  });
}

// //  代理列表
export async function agentlist(params) {
  return request({
    method: 'get',
    url: `${baseUrl}agentlist_v2`,
    params,
  });
}

// 会员等级列表
export async function memberlevellist(params) {
  return request({
    url: `${baseUrl}memberlevellist`,
    method: 'get',
    params,
  });
}

// 会员列表
// username 否 string 会员用户名
// start_date 否 string 注册开始日期
// end_date 否 string 注册结束日期
export async function memberlist(params) {
  return request({
    url: `${baseUrl}memberlist`,
    method: 'get',
    params,
  });
}

// 代理报表接口
export async function agentsheet(params) {
  return request({
    url: `${baseUrl}agentsheet`,
    method: 'get',
    params,
  });
}

// 代理数据汇总
export async function agentstatinfo(params) {
  return request({
    url: `${baseUrl}agentstatinfo`,
    method: 'get',
    params,
  });
}

export async function relationdata(params) {
  return request({
    method: 'get',
    url: `${baseUrl}relation_data`,
    params,
  });
}

export async function login(data) {
  return request({
    method: 'post',
    url: `${baseUrl}login`,
    data,
  });
}

// // 代理在线状态
export async function agentonlinecheck(data) {
  return request({
    url: `${baseUrl}agent_online_check`,
    method: 'post',
    data,
  });
}

// 代理默认配置
export async function agentsettingdetail(params) {
  return request({
    url: `${baseUrl}agent_settingdetail`,
    method: 'get',
    params,
  });
}

// 代理详细资料接口
export async function userinfo(params) {
  return request({
    url: `${baseUrl}/userinfo`,
    method: 'get',
    params,
  });
}

// // 代理首页统计接口
// // "data": {
// //   "id": 116,
// //   "money": "828.75",                //账户余额
// //   "merchant_no": 10001,
// //   "member_counts": 7,                // 会员总数
// //   "member_new_counts": 0,            // 当日新增会员总数
// //   "month_fee": 0,                    // 当月佣金
// //   "valid_invest": "0.00"            // 有效投注额
// // }
// export  const usercount = () => request({
//   url: '/usercount',
// });
//
// // 获取图形验证地址接口
// export  const getcaptcha = () => request({
//   url: '/getcaptcha',
// });
//
//
//
// // 登录
// export  const login = (data) => request({
//   method: 'post',
//   url: '/login',
//   data,
// });
//
//
//
//
//
//
//
//
// // 代理合作协议
// // 参数名 必选 类型 说明
// // merchant_no 是 int 商户号
// // code 是 string 页面代码
// // ========
// // code对应的关系：
// // 联系我们 ag_contact_us
// // 代理合作协议 agent_agreement
// export  const getStaticPageByCode = (params) => request({
//   url: '/staticpagebycode',
//   params,
// });
//
// // 代理报表接口
// export  const agentsheet = (params) => request({
//   url: '/agentsheet',
//   params,
// });
//
// // start_date 否 string 开始日期
// // end_date 否 string 结束日期
// // page 否 int 页码默认第一页为1
// // size 否 int 每页显示数量默认20
// // 佣金报表接口
//
//
// // 代理佣金提取接口
// export  const getcommission = (data) => request({
//   url: '/getcommission',
//   method: 'post',
//   data,
// });
//
// // 代理佣金提取接口
// export  const allbanklist = (params) => request({
//   url: '/allbanklist',
//   params,
// });
//
//
//
//
//
//
//
// // 代理数据汇总V2
// export  const agentstatinfoV2 = (params) => request({
//   url: '/agent_statinfo',
//   method: 'get',
//   params,
// });
//
//
//
//
//
// // 代理:重置密码
// export  const resetpass = (data) => request({
//   method: 'post',
//   url: '/resetpass',
//   data,
// });
//
//
//
//
//
//
//
//

// 用户存款接口
export const order = (data) => request({
  url: `${baseUrl}/agent_order`,
  method: 'post',
  data,
});

// pay_method_id 是 int 支付方法id
export const paymethodinfo = (params) => request({
  url: `${baseUrl}/pay_method_info`,
  method: 'get',
  params,
});

// 用户所有银行卡接口
export const merchantbank = (params) => request({
  url: `${baseUrl}/merchantbank`,
  method: 'get',
  params,
});

// 商户收款银行信息接口
export const checkorder = (params) => request({
  url: `${baseUrl}/agent_checkorder`,
  method: 'get',
  params,
});

// 获取虚拟币汇率
export const getticker = (params) => request({
  url: `${baseUrl}/getticker`,
  method: 'GET',
  params,
});

// 获取虚拟币支付协议列表
export const getprotocol = (params) => request({
  url: `${baseUrl}/getprotocol`,
  method: 'get',
  params,
});

// 检查旧资金密码
export async function checkpayoldpass(data) {
  return request({
    url: `${baseUrl}/checkpayoldpass`,
    method: 'post',
    data,
  });
}

// 下级代充汇率
export async function innerrechargerate(params) {
  return request({
    url: `${baseUrl}/inner_recharge_rate`,
    method: 'get',
    params,
  });
}

// 佣金计划
export async function commissionsummary() {
  return request({
    url: `${baseUrl}/commission_summary`,
    method: 'get',
  });
}
