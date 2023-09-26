export const bankcards = [
  {
    name: 'ICBC',
    title: '工商银行',
    theme: 'red',
  },
  {
    name: 'CITIC',
    title: '中信银行',
    theme: 'blue',
  },
  {
    name: 'CMB',
    title: '招商银行',
    theme: 'red',
  },
  {
    name: 'PSBC',
    title: '中国邮政储蓄',
    theme: 'green',
  },
  {
    name: 'ABC',
    title: '农业银行',
    theme: 'green',
  },
  {
    name: 'COMM',
    title: '交通银行',
    theme: 'blue',
  },
  {
    name: 'CCB',
    title: '建设银行',
    theme: 'blue',
  },
  {
    name: 'GDB',
    title: '广发银行',
    theme: 'red',
  },
  {
    name: 'BJ',
    title: '北京银行',
    theme: 'red',
  },
  {
    name: 'SH',
    title: '上海银行',
    theme: 'blue',
  },
  {
    name: 'HXB',
    title: '华夏银行',
    theme: 'red',
  },
  {
    name: 'SPDB',
    title: '浦发银行',
    theme: 'blue',
  },
  {
    name: 'SPDB',
    title: '银联扫码',
    theme: 'red',
  },
  {
    name: 'PA',
    title: '平安银行',
    theme: 'orange',
  },
  {
    name: 'CMBC',
    title: '民生银行',
    theme: 'green',
  },
  {
    name: 'CEB',
    title: '光大银行',
    theme: 'red',
  },
];

export const paymentsIcons = {
  // 网银在线
  1: 'online@3x.png',
  // 网银转账
  2: 'transfer@3x.png',
  // 微信
  3: 'weixin@3x.png',
  // QQ支付
  4: 'qq@3x.png',
  // 支付宝
  5: 'alipay@3x.png',
  // 支付宝转网银
  6: 'alipay@3x.png',
  // 云闪付
  7: 'ysf@2x.png',
  // 银联快捷
  // 8: 'ylzf@2x.png',
  8: 'btc@3x.png',
  // 客服
  9: 'kf@2x.png',
  // 京东
  10: 'jd@3x.png',
  // usdt
  11: 'usdt@3x.png',
  // 微信扫码
  12: 'weixin@3x.png',
  // 支付宝扫码
  13: 'alipay@3x.png',
  // 支付宝扫码
  14: 'alipay@3x.png',
  // btc
  15: 'btc@3x.png',
  // eth
  16: 'eth@3x.png',
  17: 'thai-qr-payment@2x.png',
  18: 'zalopay-wppas@2x.png',
  19: 'airpay@2x.png',
  20: 'clickpay@2x.png',
  21: 'momo-wppas@2x.png',
  22: 'vimo@2x.png',
  23: 'vnpt-pay@2x.png',
  24: 'viettelpay@2x.png',
};

export const getBankcard = (key, value) => bankcards.map((bankcard) => bankcard[key] === value);
