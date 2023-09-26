import request from '@/utils/request';

// 所有游戏分类接口
export async function readnotice(data) {
  return request('/readnotice', {
    data,
    method: 'post',
  });
}

// 活动详情
export async function readmessage(data) {
  return request('/readmessage', {
    data,
    method: 'post',
  });
}

// 首页弹窗接口
export async function indexpop(params) {
  return request('/indexpop', {
    method: 'get',
    params,
  });
}
// 网站公告列表接口
export function sitenotice(params) {
  return request('/sitenotice', {
    method: 'get',
    params
  })
}
