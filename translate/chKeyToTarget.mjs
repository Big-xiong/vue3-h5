/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import glob from 'glob';
import tagetTh from '../public/language/th.mjs';
import tagetVi from '../public/language/vi.mjs';

glob('./*.mjs', async (err, files) => {
  files.forEach(async (file) => {
    if (file.includes('ch_th')) {
      const crtModule = await import(file);
      const thTotal = Object.keys(tagetTh).length;
      let thCount = 0;
      Object.keys(tagetTh).forEach((chKey1) => {
        Object.keys(crtModule.default || {}).forEach((chKey) => {
          if (chKey1 === chKey) {
            thCount++; // 计数
            tagetTh[chKey1] = crtModule.default[chKey]
          }
        });
      });
      // 输出已处理key
      fs.writeFileSync(
        `./target_th.mjs`,
        `export default ${JSON.stringify({
          ...tagetTh
        })};`
      );
      console.log(file, `总行数：${thTotal}; 已处理行数：${thCount}; `);
    }
    if (file.includes('ch_vi')) {
      const crtModule = await import(file);
      const viTotal = Object.keys(tagetVi).length;
      let viCount = 0;
      Object.keys(tagetVi).forEach((chKey1) => {
        Object.keys(crtModule.default || {}).forEach((chKey) => {
          if (chKey1 === chKey) {
            viCount++; // 计数
            tagetVi[chKey1] = crtModule.default[chKey]
          }
        });
      });
      // 输出已处理key
      fs.writeFileSync(
        `./target_vi.mjs`,
        `export default ${JSON.stringify({
          ...tagetVi
        })};`
      );
      console.log(file, `总行数：${viTotal}; 已处理行数：${viCount}; `);
    }
  });
});
