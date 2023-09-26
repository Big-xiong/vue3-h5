const fs = require('fs');
const glob = require('glob');
const exec = require('child_process').execSync;

const EventEmitter = require('events');

const err = (msg) => new EventEmitter().emit('error', msg);

const projectName = process.argv.pop();

glob(`./subReplace/${projectName}/assets/images/home/tab-style/*.png`, async (err, files) => {
  const nameConfig = {
    真人: 1,
    电子: 2,
    捕鱼: 3,
    体育: 4,
    彩票: 5,
    棋牌: 7,
    电竞: 8,
    推荐: 10,
    矩形: 'active',
    矩形备份: 'normal'
  };
  const config = Object.entries(nameConfig);
  const fileNames = files.map((url) => {
    const names = url.split('/');
    let name = names.pop();
    config.forEach(([key, val]) => {
      if (name.includes(`${key}@`)) {
        name = name.replace(
          `${key}${typeof val !== 'number' ? '@3x' : ''}`,
          `${typeof val === 'number' ? 'home_icon_' : ''}${val}`
        );
        name = name.replace('@3x.', '_selected@3x.');
        name = name.replace('@3x(1).', '_normal@3x.');
      }
    });
    return `${names.join('/')}/${name}`;
  });
  files.forEach((url, index) => {
    fs.rename(url, fileNames[index], () => {});
  });
});

glob(`./subReplace/${projectName}/assets/images/home/vip/*.png`, async (err, files) => {
  const nameConfig = {
    '备份 2': 0,
    '备份 3': 1,
    '备份 4': 3,
    '备份 5': 2,
    '备份 6': 4,
    '备份 7': 9,
    '备份 8': 8,
    '备份 9': 7,
    '备份 10': 6,
    '备份 11': 5,
    '备份 12': 10
  };
  const config = Object.entries(nameConfig);
  const fileNames = files.map((url) => {
    const names = url.split('/');
    let name = names.pop();
    config.forEach(([key, val]) => {
      if (name.includes(key)) {
        name = name.replace(`编组 10${key}@3x`, val);
      }
    });
    return `${names.join('/')}/${name}`;
  });
  files.forEach((url, index) => {
    fs.rename(url, fileNames[index], () => {});
  });
});

glob(`./subReplace/${projectName}/assets/images/home/*.png`, async (err, files) => {
  const nameConfig = {
    '编组 46@3x (3)': 'xm',
    '编组 45@3x (3)': 'tk',
    '编组 44@3x (3)': 'cz',
    '公告@3x (3)': 'notice',
    '客服@3x (3)': 'kefu',
    '刷新@3x (3)': 'refresh',
    '编组 4@3x': 'reg',
    '编组 4备份@3x': 'login',
    'logo@3x (8)': 'logo_instal@2x'
  };
  const config = Object.entries(nameConfig);
  const fileNames = files.map((url) => {
    const names = url.split('/');
    let name = names.pop();
    config.forEach(([key, val]) => {
      if (name.includes(`${key}`)) {
        name = name.replace(key, val);
      }
    });
    return `${names.join('/')}/${name}`;
  });
  files.forEach((url, index) => {
    fs.rename(url, fileNames[index], () => {});
  });

  await exec(`node ./scripts/tinypng.js -f ./subReplace/${projectName}/assets/images/home -deep`);
});
