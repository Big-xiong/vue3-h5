import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import dayjs from 'dayjs';
import { onMounted, onBeforeUnmount } from 'vue';
import { useDicts } from './hooks';

// const images = import.meta.globEager(`/src/assets/*/**/*.{png,svg,jpg,gif}`);

export const isMicro = qiankunWindow.__POWERED_BY_QIANKUN__;
const modulesFile = import.meta.globEager('../../../src/current_project/config/lang.js');
export function getLang() {
  const path = Object.keys(modulesFile);
  return modulesFile[path[0]]?.default?.lang;
}
const allDialog = import.meta.glob('/src/components/{Dialog,Popup}/*.vue');
export const loadModule = async (modulePath) => {
  try {
    return await allDialog[modulePath]();
  } catch (e) {
    throw new ImportError(`找不到模块路径 ${modulePath}`);
  }
};

export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

// 代理密码校验
export function testPassword(value, maxLength = 20) {
  const reg = new RegExp(`^[0-9a-zA-Z]{6,${maxLength}}$`);
  return reg.test(value);
}

export function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    // eslint-disable-next-line no-unexpected-multiline
    const current = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = current;
    // [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const priceFormat = (price) =>
  price.toString().indexOf('.') !== -1
    ? `${
        price
          .toString()
          .split('.')[0]
          .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') || 0
      }.${price.toString().split('.')[1]}`
    : `${price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') || 0}.00`;

export const timeFilter = (str) => str.substr(0, 10);

export const dateFormat = (format = 'YYYY-MM-DD HH:mm:ss', date = new Date()) => dayjs(date).format(format);

export const download = (url, name) => {
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = `${name || new Date().getTime()}.png`;
  a.href = url;
  a.dispatchEvent(event);
};

export const bankCodeData = [
  'ABC',
  'BCCB',
  'BOC',
  'BOCOM',
  'BOS',
  'CCB',
  'CEB',
  'CGB',
  'CIB',
  'CMB',
  'CMBC',
  'ECITIC',
  'HXB',
  'HZCBC',
  'ICBC',
  'NBCBC',
  'PAB',
  'PSBC',
  'SPDB'
];

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

export function getMonth(type, monthArg) {
  const d = new Date();
  let year = d.getFullYear();
  let months = monthArg;
  let month = d.getMonth() + 1;
  if (Math.abs(months) > 12) {
    months %= 12;
  }
  if (months !== 0) {
    if (month + months > 12) {
      year += 1;
      month = (month + months) % 12;
    } else if (month + months < 1) {
      year -= 1;
      month = 12 + month + months;
    } else {
      month += months;
    }
  }
  month = month < 10 ? `0${month}` : month;
  const firstDay = `${year}-${month}-01`;
  let lastDay = '';
  if (
    month === '01' ||
    month === '03' ||
    month === '05' ||
    month === '07' ||
    month === '08' ||
    month === '10' ||
    month === '12'
  ) {
    lastDay = `${year}-${month}-${31}`;
  } else if (month === '02') {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
      lastDay = `${year}-${month}-${29}`;
    } else {
      lastDay = `${year}-${month}-${28}`;
    }
  } else {
    lastDay = `${year}-${month}-${30}`;
  }
  let day = '';
  if (type === 's') {
    day = firstDay;
  } else {
    day = lastDay;
  }
  return day;
}

// 密码校验
export function checkPassword(value) {
  // var reg = /^[a-zA-Z0-9]{6,20}$/;
  const reg = /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,20}$/;
  if (!reg.test(value)) {
    return false;
  }
  return true;
}

// 账号名校验
export function checkUser(value) {
  const reg = /^[a-zA-Z0-9]{6,12}$/;
  if (!reg.test(value)) {
    return false;
  }
  return true;
}

const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
export const openUrl = async (fn = () => {}, payType) => {
  if (payType === 2 || payType === 6 || payType === 13 || payType === 12 || payType === 14) {
    fn();
    return false;
  }
  if (isSafari) {
    // 回调前打开一个新窗口
    const win = window.open('', '_blank');
    // 等待submit逻辑执行完成并返回URL
    const url = await fn();
    console.log(url);
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

export function moneyFormat(money) {
  const number = Number(money);
  if (Number.isNaN(number)) {
    return money;
  }
  return `${number < 0 ? '-' : ''}${Math.abs(number)}`;
}

export function getParams(name, url) {
  const { search } = location;
  const params = new URLSearchParams(search);
  if (name) {
    if (search.includes(name)) {
      return params.get(name);
    }
  } else {
    const result = {};
    params.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }
}

export function dateRange(date) {
  const now = new Date();
  const target = new Date(date);
  if (now.getFullYear() === target.getFullYear()) {
    return date.replace(/^\d.+?-/g, '');
  }
  return date;
}

export function priceUnitTransform(value, limit = 1000000) {
  let money = Number(value);
  let unit = '';

  if (money < limit) {
    return {
      money: priceFormat(money),
      unit
    };
  }

  const config = {
    3: {
      unit: '',
      divide: 1
    },
    6: {
      unit: 'K',
      divide: 10 ** 3
    },
    9: {
      unit: 'M',
      divide: 10 ** 6
    },
    12: {
      unit: 'B',
      divide: 10 ** 9
    },
    15: {
      unit: 'T',
      divide: 10 ** 12
    }
  };

  Object.keys(config).forEach((key) => {
    if (money.toFixed().length <= Number(key) && !unit) {
      money = Number((money / config[key].divide).toFixed(2));
      unit = config[key].unit;
    }
  });

  return {
    money,
    unit
  };
}

export function executeScript(html) {
  // eslint-disable-next-line no-control-regex
  // console.log(html);
  const reg = /src="(.+)(")/;
  // console.log(html.match(reg));
  const src = html.match(reg)?.[1];
  if (src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  }
}

export async function getAreaCodeFromRegion(store, regionId) {
  await store.dispatch('app/getDict', ['phoneareav3', 'regionlist']);

  let regionName = '';
  store.state.app.dicts.regionlist.forEach((item) => {
    if (item.id === regionId) {
      regionName = item.name;
    }
  });

  let areaCode = '';
  store.state.app.dicts.phoneareav3.forEach((item) => {
    if (item.includes(regionName)) {
      const splited = item.split('-');
      areaCode = splited[splited.length - 1];
    }
  });

  return areaCode;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}
export const formatCardNo = (num) =>
  `${num.substr(0, 4)} ${num
    .substr(4, num.length - 4)
    .replace(/\d/g, '*')
    .replace(/(.{4})/g, ' $1')} ${num.substr(num.length - 4)}`;

export const usePreventDefault = (element, type, isMultiple) => {
  function prevent(e) {
    e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
  }
  if (!isMultiple) {
    onMounted(() => {
      document.querySelector(element).addEventListener(type, prevent, { passive: false });
    });

    onBeforeUnmount(() => {
      document.querySelector(element).removeEventListener(type, prevent);
    });
  } else {
    onMounted(() => {
      document.querySelectorAll(element).forEach((item) => {
        item.addEventListener(type, prevent, { passive: true });
      });
    });
    onBeforeUnmount(() => {
      document.querySelectorAll(element).forEach((item) => {
        item.removeEventListener(type, prevent);
      });
    });
  }
};
