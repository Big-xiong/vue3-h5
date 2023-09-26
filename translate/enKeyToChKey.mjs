/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import glob from 'glob';
import en from './en.mjs';

glob('./*.mjs', async (err, files) => {
  files.forEach(async (file) => {
    if (file.includes('en_')) {
      const crtModule = await import(file);
      const total = Object.keys(crtModule.default).length;
      let count = 0;
      let temp = {};
      Object.keys(en).forEach((chKey) => {
        Object.keys(crtModule.default).forEach((enKey) => {
          if (en[chKey] === enKey) {
            count++; // 计数
            // 替换英文key为中文key
            Object.defineProperty(temp, chKey, {
              value: crtModule.default[enKey],
              enumerable: true,
              writable: true
            });
            // 删除英文key: value
            delete crtModule.default[enKey];
          }
        });
      });
      // 输出已处理key
      fs.writeFileSync(
        `${file.replace('./en_', './ch_')}`,
        `export default ${JSON.stringify({
          ...temp
        })};`
      );
      // 输出未处理key
      fs.writeFileSync(
        `${file.replace('./en_', './unchange_en_')}`,
        `export default ${JSON.stringify({
          ...crtModule.default,
        })};`
      );
      console.log(file, `总行数：${total}; 已处理行数：${count}; 待人工处理行数：${total - count}`);
    }
  });
});
