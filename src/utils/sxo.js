/* eslint-disable no-restricted-syntax */
import { inject, ref } from 'vue';

const key = Symbol('SEO/SMO');

export function useSXO() {
  return inject(key);
}

let I18N = {};
const KEYS = [
  'title',
  'description',
  'keywords',
];
function translation(options) {
  for (const k in options) {
    if (KEYS.includes(k)) {
      options[k] = I18N.global.t(options[k]);
    }
  }
  return options;
}

export function createSXO(app, i18n) {
  I18N = i18n;
  const SEO = ref({
    title: '',
    description: '',
    keywords: '',
  });
  // https://ogp.me/
  const SMO = ref({
    title: '',
    description: '',
    image: '',
    url: '',
  });
  function setSEO(options) {
    SEO.value = Object.assign(SEO.value, translation(options));
  }
  function setSMO(options) {
    SMO.value = Object.assign(SMO.value, translation(options));
  }

  const SXO = {
    SEO,
    SMO,
    setSEO,
    setSMO,
  };
  app.provide(key, SXO);
  return SXO;
}
