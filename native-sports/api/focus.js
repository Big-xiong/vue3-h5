import request from '@/utils/request';

// 首页:赛事统计
export async function notice_list(params) {
  return request('/sport/notice_list', {
    method: 'get',
    params,
  });
}
