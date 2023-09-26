/* eslint-disable no-param-reassign */
import { createMount } from './index';

let $inst = null;

async function Popup(opts) {
  $inst = await createMount({
    ...opts,
    tpl: `Popup/${opts.tpl}`,
  }, $inst);
  return $inst;
}

export default {
  // 组件祖册
  install(app) {
    app.config.globalProperties.$popup = Popup;
  },
};
