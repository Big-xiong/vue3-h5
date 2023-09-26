/* eslint-disable no-param-reassign */
import { createMount } from './index';

async function Dialog(opts) {
  await createMount(
    Object.assign(opts, {
      tpl: `Dialog/${opts.tpl}`,
    }),
  );
}

export default {
  // 组件祖册
  install(app) {
    app.config.globalProperties.$dialog = Dialog;
  },
};
