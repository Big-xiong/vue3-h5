/* eslint-disable no-param-reassign */
import { createApp, ref, getCurrentInstance } from 'vue';
import { loadModule, isMicro } from '@/utils';

let $inst;
let mountNode;

const root = isMicro ? document.querySelector('div[data-name="vue_micro_app"]')?.shadowRoot : document.body;

// 创建挂载实例
export const createMount = async (opts = {}) => {
  let moduleName = opts.tpl;

  if ($inst?._props?.tpl === moduleName && mountNode) {
    $inst.unmount();
    $inst = null;
    root.removeChild(mountNode);
    mountNode = null;
  }

  if (!moduleName?.endsWith('.vue')) {
    moduleName = `/src/components/${moduleName}.vue`;
  }

  const tpl = await loadModule(moduleName);

  function Component(app) {
    mountNode = document.createElement('div');

    root.appendChild(mountNode);

    const isShow = ref(true);
    const close = () => $inst.unmount();
    const instance = createApp(
      tpl.default,
      Object.assign(opts, {
        isShow,
        close,
        unmount() {
          instance.unmount();
          $inst = null;
          root.removeChild(mountNode);
        }
      })
    );
    Object.assign(instance._context, app._context);
    instance.mount(mountNode);
    $inst = instance;
  }

  Component(window._GLOBAL_APP);
};
