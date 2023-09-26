export const getPlatformByGameCate = (cateId, datas) => {
  let ret = [];
  if (datas && datas.length) {
    datas.forEach((item) => {
      if (item.game_cate_id === cateId) {
        ret = item.platform_list || [];
        return false;
      }
    });
  }
  return ret;
};

export const getGameSlotPlatform = (cateId, datas) => {
  let ret = [];
  if (datas && datas.length) {
    datas.forEach((item) => {
      if (item.game_cate_id === cateId) {
        ret = item.list_data.filter((item) => item.status === 1) || [];
        return false;
      }
    });
  }
  return ret;
};

export const getGameCatePlatform = (cateId, datas) => {
  let ret = null;
  if (datas && datas.length) {
    datas.forEach((item) => {
      if (item.game_cate_id === cateId) {
        ret = item;
        return false;
      }
    });
  }
  return ret;
};

export const getProvinceCity = (data) => {
  const province = data.province_list;
  const city = data.city_list;
  const ret = {};
  const province2 = {};
  for (const p in province) {
    if (province.hasOwnProperty(p)) {
      ret[province[p]] = [];
      province2[p.slice(0, 2)] = province[p];
    }
  }
  for (const c in city) {
    if (city.hasOwnProperty(c)) {
      const code = c.slice(0, 2);
      if (province2.hasOwnProperty(code)) {
        ret[province2[code]].push(city[c]);
      }
    }
  }
  return ret;
};

export const executeScript = (html) => {
  if (!html) return;
  const reg = /<script[^>]*>([^\x00]+)$/i;
  // 对整段HTML片段按<\/script>拆分
  const htmlBlock = html.split('<\/script>');
  for (const i in htmlBlock) {
    var blocks;// 匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
    if (blocks = htmlBlock[i].match(reg)) {
      // 全部清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作
      const code = blocks[1].replace(/<!--/, '');
      try {
        eval(code); // 执行脚本
      } catch (e) {

      }
    }
  }
};

export function getDate(dates) {
  const dd = new Date();
  const n = dates || 0;
  dd.setDate(dd.getDate() + n);
  const y = dd.getFullYear();
  let m = dd.getMonth() + 1;
  let d = dd.getDate();
  m = m < 10 ? `0${m}` : m;
  d = d < 10 ? `0${d}` : d;
  const day = `${y}-${m}-${d}`;
  return day;
}

/*
 *getMonth(type,months)  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
 *getMonth("s",1)  //得到下月第一天的yyyy-mm-dd格式日期
 *getMonth("e",1)  //得到下月最后一天的yyyy-mm-dd格式日期
*/

export function getMonth(type, months) {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  if (Math.abs(months) > 12) {
    months %= 12;
  }
  if (months != 0) {
    if (month + months > 12) {
      year++;
      month = (month + months) % 12;
    } else if (month + months < 1) {
      year--;
      month = 12 + month + months;
    } else {
      month += months;
    }
  }
  month = month < 10 ? `0${month}` : month;
  const date = d.getDate();
  const firstday = `${year}-${month}-` + `01`;
  let lastday = '';
  if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
    lastday = `${year}-${month}-${31}`;
  } else if (month == '02') {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
      lastday = `${year}-${month}-${29}`;
    } else {
      lastday = `${year}-${month}-${28}`;
    }
  } else {
    lastday = `${year}-${month}-${30}`;
  }
  let day = '';
  if (type == 's') {
    day = firstday;
  } else {
    day = lastday;
  }
  return day;
}

const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

export const openUrl = async (fn = () => { }, payType) => {
  if (
    payType === 2
    || payType === 6
    || payType === 13
    || payType === 12
    || payType === 14
  ) {
    fn(() => { });
    return false;
  }
  if (isSafari) {
    // 回调前打开一个新窗口
    const win = window.open('', '_blank');
    // 等待submit逻辑执行完成并返回URL
    const url = await fn(() => { });
    // 打开新窗口
    win.location = url;
  } else {
    fn((url) => {
      // 创建A标签
      const a = document.createElement('a');
      // 给创建好的a标签赋值
      a.setAttribute('href', url);
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none');
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank');
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    });
  }
};
