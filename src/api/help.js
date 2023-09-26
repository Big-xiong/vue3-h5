import request from '@/utils/request';

// 品牌实力
export async function strength() {
  return request('/strength', {
    method: 'get',
  });
}

// 常见问题
export async function aplist() {
  return request('/aqlist', {
    method: 'get',
  });
}
// 问题详情
export async function aqdetail(params) {
  return request('/aqdetail', {
    params,
    method: 'get',
  });
}
// 游戏手册
export async function gamemanual(params) {
  return request('/gamemanual', {
    params,
    method: 'get',
  });
}
// 游戏手册详情
export async function gamemanualdetail(params) {
  return request('/gamemanualdetail', {
    params,
    method: 'get',
  });
}
// 关于我们
export async function staticpage(params) {
  return request('/staticpage', {
    params,
    method: 'get',
  });
}
