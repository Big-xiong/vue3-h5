import request from '@/utils/request';

const agentBaseUrl = import.meta.env.VITE_APP_AGENT_API_URL;
// 游戏平台
export async function allplatform(params) {
  return request('/allplatform', {
    params,
    method: 'get',
  });
}

export async function agentcommissionstatus(params) {
  return request({
    url: `${agentBaseUrl}agentcommissionstatus`,
    method: 'get',
    params,
  });
}

// 获取所有游戏分类的游戏平台
export async function platformgameidsv2(params) {
  return request('/platformgameidsv2', {
    params,
    method: 'get',
  });
}
export function contactTypeList(data) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}/contact_type_list`,
    data,
  });
}

// 会员等级
export async function memberlevellist(params) {
  return request('/memberlevellist', {
    params,
    method: 'get',
  });
}

// 变更类型
export async function agentaccountchangetype(params) {
  return request(`${agentBaseUrl}agentaccountchangetype`, {
    params,
    method: 'get',
  });
}

// 银行列表
export async function allbanklist(params) {
  return request('/allbanklist', {
    params,
    method: 'get',
  });
}

// 获取手机区号列表
export async function phoneareav3(params) {
  return request('/phoneareav3', {
    params,
    method: 'get',
  });
}

// 获取站点配置信息
export async function siteinfo(params) {
  return request('/siteinfo', {
    params,
    method: 'get',
  });
}

// 取款状态
export async function allwithdrawstatus(params) {
  return request('/allwithdrawstatus', {
    method: 'get',
    params,
  });
}

// 会员等级列表
export async function agentmemberlevellist(params) {
  return request({
    url: `${agentBaseUrl}memberlevellist`,
    method: 'get',
    params,
  });
}

// 盈利榜
export async function newtoplist(params) {
  return request('/newtoplist', {
    method: 'get',
    params,
  });
}

// 遗漏申请:审核状态列表
export function auditstatuslist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}audit_status_list`,
    params,
  });
}

// 遗漏申请:推广设备
export function devtypelist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}dev_type_list`,
    params,
  });
}

// 代理所有银行列表
export function agentallbanklist(params) {
  return request({
    url: `${agentBaseUrl}allbanklist`,
    method: 'get',
    params,
  });
}

// 地区列表
export async function regionlist(params) {
  return request('/regionlist', {
    params,
    method: 'get',
  });
}

// 忘记密码密保问题
export async function passquestion(params) {
  return request('/passquestion', {
    method: 'get',
    params,
  });
}

// 全部站内信消息
export async function messagetypelist(params) {
  return request('/messagetypelist', {
    method: 'get',
    params,
  });
}

// 推广素材尺寸列表
export function promotionsourcesizelist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}promotion_source_size_list`,
    params,
  });
}

// 推广素材类型列表
export function promotionsourcetypelist(params) {
  return request({
    method: 'get',
    url: `${agentBaseUrl}promotion_source_type_list`,
    params,
  });
}
