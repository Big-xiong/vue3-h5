import path from 'path';
import { loadEnv } from 'vite';
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import visualizer from 'rollup-plugin-visualizer';
import qiankun from 'vite-plugin-qiankun';
import AutoImport from 'unplugin-auto-import/vite';

const request = require('request-promise');
const vueJsxPlugin = require('@vitejs/plugin-vue-jsx');
const vuePlugin = require('@vitejs/plugin-vue');

const useDevMode = true;
let seoInfo = {};

const htmlPlugin = ({
  VITE_APP_MERCHANT_NO, VITE_APP_WEB_API_URL, VITE_APP_WS_URL, VITE_APP_GAME_DOMAIN,
}, isDevelopment) => ({
  name: 'html-transform',
  async transformIndexHtml(html) {
    if (!Object.keys(seoInfo).length) {
      seoInfo = await request({
        url: `${VITE_APP_WEB_API_URL}/seoinfo?lang=zh&merchant_no=${VITE_APP_MERCHANT_NO}`,
        json: true,
        headers: {
          'User-Agent': 'Request-Promise',
        },
      });
      console.log(`当前后台配置站点信息为：\n`, seoInfo);
      html = html.replace(
        '/*--replace-play-constant--*/',
        `[
          {VITE_APP_MERCHANT_NO: '${VITE_APP_MERCHANT_NO}'},
          {VITE_APP_WEB_API_URL: '${VITE_APP_WEB_API_URL}'},
          {VITE_APP_WS_URL: '${VITE_APP_WS_URL}'},
          {VITE_APP_GAME_DOMAIN: '${VITE_APP_GAME_DOMAIN}'}
        ].forEach((item) => {
          const [key, val] = Object.entries(item)[0];
          localStorage?.setItem?.(key, val);
        });`,
      );
    }
    const { title, keywords = '', description = '' } = seoInfo?.data ?? {};
    html = html.replace(
      /<!--head-tags-->/,
      `<title>${title}</title><meta name='keywords' content='${keywords}' /><meta name='description' content='${description}' />`,
    );
    if (isDevelopment) {
      html = html.replace(
        /<!--favicon-link-->/,
        `<link rel="alternate icon" type="image/png" href='src/current_project/assets/favico.ico'>`,
      );
    }
    const devUseOnlineInterface = VITE_APP_MERCHANT_NO !== '19001' && isDevelopment;
    if (devUseOnlineInterface) {
      html = html.replace('<body>', '<body dev-use-online-interface>');
    }
    return html;
  },
});

function getPlugins(envInfo, isDevelopment) {
  const basePlugins = [
    htmlPlugin(envInfo, isDevelopment),
    AutoImport({
      imports: ['vue', 'vue-router'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      dts: 'src/auto-import.d.ts',
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      inject: 'body-first',
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    vuePlugin(),
    qiankun('vue_micro_app', {
      useDevMode,
    }),
    vueJsxPlugin(),
    createStyleImportPlugin({
      resolves: [VantResolve()],
    }),
  ];

  if (process.env.MODE === 'analyse') {
    basePlugins.push(
      visualizer({
        open: true,
      }),
    );
  }

  return basePlugins;
}

export default async ({ mode }) => {
  const isDevelopment = mode === 'development';
  const envInfo = loadEnv(mode, process.cwd());
  const { TARGET } = process.env;
  const { VITE_APP_PROJECT_NAME, VITE_APP_ASSET_PATH = '/' } = envInfo;

  if (!envInfo.VITE_APP_ASSET_PATH) {
    envInfo.VITE_APP_ASSET_PATH = VITE_APP_ASSET_PATH;
  }

  // 打印当前配置信息，请勿删除
  console.log(envInfo);

  console.log('isDevlopment', isDevelopment);
  console.log('asset path', VITE_APP_ASSET_PATH);

  const is50001 = VITE_APP_PROJECT_NAME === '50001';

  const prePath = is50001 ? '/src' : '/src/current_project';

  return {
    base: isDevelopment ? './' : VITE_APP_ASSET_PATH + (mode === 'micro' ? 'micro/' : ''),
    mode: 'production',
    plugins: getPlugins(envInfo, isDevelopment),
    server: {
      hmr: {
        overlay: false,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        $: path.join(__dirname, prePath),
        '@current': path.join(__dirname, 'src/current_project'),
        '@img': path.join(__dirname, `${prePath}/assets/images`),
        '~assets': path.join(__dirname, 'src/assets'),
      },
    },
    build: {
      outDir: TARGET === 'sport' ? 'dist/native-sports' : mode === 'micro' ? '../dist/micro' : 'dist',
      rollupOptions: {
        input: TARGET === 'sport' ? {
          sport: path.resolve(__dirname, 'native-sports/index.html'),
        } : {
          main: path.resolve(__dirname, 'index.html'),
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('postcss-px-to-viewport-update')({
            unitToConvert: 'px',
            viewportWidth: 750,
            unitPrecision: 3,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: ['ignore-'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules[\\/]vant[\\/]/],
          }),
        ],
      },
    },
  };
};
