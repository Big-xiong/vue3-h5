import request from '@/utils/request';

// 体育
export async function sports(params) {
  return request('/sports', {
    params,
    method: 'get',
  });
}
