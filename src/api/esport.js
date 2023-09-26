import request from '@/utils/request';

// 电竞
export async function gaming(params) {
  return request('/gaming', {
    params,
    method: 'get',
  });
}
