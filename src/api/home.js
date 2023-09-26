import request from '@/utils/request';

// 盈利榜
export async function newtoplist(params) {
  return request('/newtoplist', {
    params,
    method: 'get',
  });
}

// 获取公告列表
export async function noticeList(params) {
  return request('/sitenotice', {
    params,
    method: 'get',
  });
}

// 客户请求回电接口
export async function recall(data) {
  return request('/recall', {
    method: 'post',
    data,
  });
}

// 上传文件
export async function feedback(data) {
  return request('/feedback', {
    method: 'post',
    data,
  });
}

// 上传文件
export async function upload(data) {
  return request('/upload', {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
    data,
  });
}

// 获取每日任务接口
export async function dailytasks() {
  return request('/dailytasks', {
    method: 'get',
  });
}

// 领取每日任务
export async function getreward(params) {
  return request('/getreward', {
    params,
    method: 'get',
  });
}
