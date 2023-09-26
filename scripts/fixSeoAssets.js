const fs = require('fs');
const path = require('path');

const getPath = (dir) => path.resolve(__dirname, dir);

const html = fs.readFileSync(getPath('../dist/index.html')).toString();

// property

function removeDir(dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i += 1) {
    const newPath = path.join(dir, files[i]);
    const stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      // 如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      // 删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir); // 如果文件夹是空的，就将自己删除掉
}

const locale = ['zh-CN', 'en', 'th', 'vi'];
(async () => {
  for (let i = 0; i < locale.length; i += 1) {
    const lang = locale[i];
    const description = '体育、真人、老虎机、彩票专业诚信综合国际平台';

    let result = description;
    if (lang !== 'zh-CN') {
      result = fs.readFileSync(getPath(`../public/language/${lang}.mjs`)).toString();
      result = result.replace('export default {', '').replace('};', '');
      try {
        // eslint-disable-next-line no-eval
        result = eval(`({${result}})`)[description];
      } catch (error) {

      }
    }
    const seoMaps = {
      description: result,
      keywords: result,
    };
    const metaHTML = Object.entries(seoMaps).reduce(
      (curr, next) => ((curr += `<meta name='${next[0]}' content='${next[1]}' />`), curr),
      '',
    );
    const targetPath = getPath(`../dist/${lang}`);
    if (fs.existsSync(targetPath)) {
      removeDir(targetPath);
    }
    fs.mkdirSync(targetPath);
    const targetHTML = html.replace('<!--head-tags-->', metaHTML);
    fs.writeFileSync(getPath(`../dist/${lang}/index.html`), targetHTML);
  }
})();
