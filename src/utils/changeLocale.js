const language = [];
// 默认加载的语言
const loadedLanguages = ['en', 'zh-CN'];
const Langs = import.meta.glob(`/public/language/*.mjs`);
const CurrentLangs = import.meta.glob(`/src/current_project/i18n/*.mjs`);
const VantLangs = import.meta.glob(`/public/language/vant/*.mjs`);

const loadedVantLanguages = ['en', 'zh-CN'];

export function loadLanguageAsync(i18n, lang) {
  // console.log('loadLanguageAsync', lang);
  if (loadedLanguages.includes(lang) || lang.includes('zh')) {
    i18n.locale = lang;
    return;
  }

  const getLangs = [Langs[`/public/language/${lang}.mjs`]()];

  if (CurrentLangs[`/src/current_project/i18n/${lang}.mjs`]) {
    getLangs.push(CurrentLangs[`/src/current_project/i18n/${lang}.mjs`]());
  }

  return Promise.all(getLangs).then((messages) => {
    const message = {
      ...messages[0].default
    };
    if (messages.length > 1) {
      Object.assign(message, messages[1].default);
    }
    i18n.setLocaleMessage(lang, message);
    i18n.locale = lang;
    loadedLanguages.push(lang);
  });
}

export function loadVantLocale(locale, lang) {
  if (loadedVantLanguages.includes(lang) || lang.includes('zh')) {
    locale.use(lang);
    return;
  }

  return VantLangs[`/public/language/vant/${lang}.mjs`]().then((messages) => {
    locale.use(lang, messages.default);
    loadedVantLanguages.push(lang);
  });
}
