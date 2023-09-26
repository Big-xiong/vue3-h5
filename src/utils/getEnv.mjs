import fs from 'fs';
import path from 'path';
import request from 'request-promise';

function getSubConfig(target) {
  let subEnv = fs.readFileSync(path.resolve('./src/current_project/config/index.js')).toString();

  subEnv = subEnv.split('\n').filter(Boolean);
  subEnv.shift();
  subEnv.pop();
  subEnv = subEnv.map((item) => item.replace(/ /g, ''));
  subEnv = subEnv.map((item) => (item.includes('//') ? item.substr(0, item.indexOf('//')) : item));
  subEnv = subEnv.map((item) => (item.charAt(item.length - 1) === ',' ? item.substr(0, item.length - 1) : item));
  subEnv = subEnv.reduce((curr, next) => {
    const [key, value] = next.split(':');
    // eslint-disable-next-line no-eval
    curr[key] = eval(`(${value})`);
    return curr;
  }, {});
  return target ? subEnv[target] : subEnv;
}

export default async function getEnv(no, usePordInterface) {
  if (getSubConfig('testUseProdInterface') || usePordInterface) {
    const res = await request({
      url: `https://api.acebetsabo.com/frontend_env?xxt=RcvUKKAi31xJqsXx&no=${no}`,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    });
    if (res.code === 200) {
      const { VUE_APP_ASSET_PATH, VUE_APP_H5_API_URL, VUE_APP_ADMIN_API_URL, ...args } = res.data;
      const envInfo = Object.entries(args).reduce(
        (curr, next) => {
          curr[next[0].replace('VUE_', 'VITE_')] = `${next[1]?.replace?.('{jumptype}', 'm')}`;
          return curr;
        },
        { VITE_APP_PROJECT_NAME: no }
      );
      return {
        str: Object.entries(envInfo).reduce((curr, next) => ((curr += `${next[0]}=${next[1]} `), curr), ''),
        obj: envInfo
      };
    } else {
      console.log('Error: 获取线上地址失败');
    }
  }
  return {
    str: `VITE_APP_PROJECT_NAME=${no}`,
    obj: process.env
  };
}
