const fs = require('fs');
const path = require('path');
const got = require('got');
const { loadEnv } = require('vite');

const args = process.argv.slice(2);
const templateName = args[0];

const langConfig = ['zh-CN', 'en', 'th', 'vi'];

const getPath = (dir) => path.resolve(__dirname, dir);

if (fs.existsSync(getPath('../dist/index.html'))) {
  const baseHtml = fs.readFileSync(getPath('../dist/index.html')).toString();
  const kfHtml = fs.readFileSync(getPath('../dist/kefu/index.html')).toString();

  let currentConfig = {};
  try {
    fs.readFileSync(getPath(`../src/current_project/config/index.js`)).toString();
    currentConfig = currentConfig.replace('export default ', '').replace('{', '').replace('};', '');
    currentConfig = currentConfig.split('\n').filter(Boolean).reduce((curr, next) => {
      let [key, value] = next.trim().split(',')[0].split(':');
      value = value.trim().replace(/'|"/g, '');
      curr[key] = ['title', 'desktopFileName', 'contactConfig'].includes(key) ? value : JSON.parse(value);
      return curr;
    }, {});
  } catch (error) {

  }

  let navPageConfig = {
    __global: {},
  };
  try {
    navPageConfig = require(`../public/seo/title/${templateName}`);
  } catch (error) { }

  const { VITE_APP_WEB_API_URL, VITE_APP_MERCHANT_NO } = loadEnv('production', process.cwd());

  console.log(`build env: ${VITE_APP_WEB_API_URL} | ${VITE_APP_MERCHANT_NO}`);

  let seoResult;
  (async () => {
    seoResult = await got(
      `${VITE_APP_WEB_API_URL}seoinfo?merchant_no=${VITE_APP_MERCHANT_NO}`,
    ).then((res) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        return body.data;
      }
    }).catch((err) => {
      console.log(`获取seoinfo失败，${err}`);
    });
    const { title_trans = {}, keywords_trans = {}, description_trans = {} } = seoResult;

    translate({ title_trans, keywords_trans, description_trans }, { html: baseHtml });
    translate({ title_trans, keywords_trans, description_trans }, { dir: '/kefu', html: kfHtml });
  })();
}

function translate({ title_trans, keywords_trans, description_trans }, { dir = '', html }) {
  if (currentConfig.isI18n) {
    for (let i = 0; i < langConfig.length; i += 1) {
      const lang = langConfig[i];
      const key = lang === 'zh-CN' ? 'zh' : lang;
      const title = title_trans[key];
      const keywords = keywords_trans[key];
      const description = description_trans[key];

      const seoMaps = {
        title,
        keywords,
        description,
        ...navPageConfig.__global,
      };

      let metaHTML = Object.entries(seoMaps).reduce((curr, next) => {
        if (next[0] === 'title') {
          curr += `<${next[0]}>${next[1]}</${next[0]}>`;
        } else {
          curr += `<meta name='${next[0]}' content='${next[1]}' />`;
        }
        return curr;
      }, '');

      const targetPath = getPath(`../dist/${lang}${dir}`);
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }

      if (!dir && lang === 'vi') {
        for (const page in navPageConfig) {
          let pageHtml = Object.entries({ ...seoMaps, ...navPageConfig[page] }).reduce((curr, next) => {
            if (next[0] === 'title') {
              curr += `<${next[0]}>${next[1][lang]}</${next[0]}>`;
            } else {
              if (next[0] === 'og:url') seoMaps[next[0]] = `${seoMaps[next[0]]}${lang}`;
              curr += `<meta name='${next[0]}' content='${next[1][lang]}' />`;
            }
            return curr;
          }, '');

          pageHtml += `<link rel="canonical" href="https://m.blizzwin.com/${lang}/${page}" /><link rel="alternate" hreflang="${lang === 'vi' ? 'vi-vn' : lang
            }" href="https://m.blizzwin.com/${lang}/${page}">`;

          const pagePath = getPath(`../dist/${lang}/${page}`);
          fs.mkdirSync(pagePath);
          fs.writeFileSync(`${pagePath}/index.html`, html.replace('<!--head-tags-->', pageHtml));
        }
      }

      metaHTML += `<link rel="canonical" href="https://m.blizzwin.com/${lang}/" /><link rel="alternate" hreflang="${lang === 'vi' ? 'vi-vn' : lang
        }" href="https://m.blizzwin.com/${lang}/">`;

      const targetHTML = html.replace('<!--head-tags-->', metaHTML);
      // 写入根index.html，无后缀生效
      if (lang === 'en') {
        fs.writeFileSync(getPath(`../dist/${dir ? `${dir}/` : ''}index.html`), targetHTML);
      }
      fs.writeFileSync(getPath(`../dist/${lang}${dir}/index.html`), targetHTML);
    }
  } else if (!dir) {
    const { title, keywords, description } = seoResult;
    const seoMaps = {
      title,
      keywords,
      description,
      ...navPageConfig.__global,
    };

    const metaHTML = Object.entries(seoMaps).reduce((curr, next) => {
      if (next[0] === 'title') {
        curr += `<${next[0]}>${next[1]}</${next[0]}>`;
      } else {
        curr += `<meta name='${next[0]}' content='${next[1]}' />`;
      }
      return curr;
    }, '');
    const targetHTML = html.replace('<!--head-tags-->', metaHTML);
    fs.writeFileSync(getPath(`../dist/index.html`), targetHTML);
  }
}
