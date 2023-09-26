import { dateFormat } from '@/utils';

// 获取已读消息
function getReadedID() {
  let ids = [];
  if (window.localStorage.getItem('red_notice_ids')) {
    ids = window.localStorage.getItem('red_notice_ids').split(',');
    ids = ids.map((id) => Number(id));
  }
  return ids;
}

// 设置已读消息
function setReadedID(ids) {
  if (ids.length) {
    window.localStorage.setItem('red_notice_ids', ids);
  }
}

// 是否当天已经弹出过公告
function isPoped() {
  const currentTime = dateFormat('YYYY-MM-DD', (new Date()).getTime());
  const popTime = window.localStorage.getItem('pop_day_time');
  return currentTime === popTime;
}

// 设置公告已弹出过
function setPoped() {
  const currentTime = dateFormat('YYYY-MM-DD', (new Date()).getTime());
  window.localStorage.setItem('pop_day_time', currentTime);
}

// 获取查看是否有新消息
function getNewMsg(data) {
  const readedIds = getReadedID();
  const newMsg = [];
  const ids = [];
  if (Array.isArray(data)) {
    data.forEach((item) => {
      ids.push(item.id);
      if (item.is_important === 1 && !readedIds.includes(item.id)) {
        newMsg.push(item);
      }
    });
  }
  return newMsg;
}

export function runPop(data, callback) {
  const _isPoped = isPoped();
  const newMsg = getNewMsg(data);
  const readedIds = getReadedID();
  if (!_isPoped || (_isPoped && !!newMsg.length)) {
    setPoped();
    callback?.(newMsg);
    setReadedID(readedIds.concat(
      newMsg.filter((item) => !readedIds.includes(item.id)).map((item) => item.id),
    ));
  }
}
