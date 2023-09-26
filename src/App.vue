<template>
  <template v-if="refresh">
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
    <SiteNoticeBox />
  </template>
  <!-- <source-app :isDev="isDev" /> -->
  <div class="lang-switch" v-if="isDev && subConfig.isI18n">
    <Lang v-model:show="isShowLang" />
    <van-button type="primary" @click="isShowLang = true" size="mini">切换语言</van-button>
    <van-switch v-model="checked" @click="changeTheme" size="20px" />
  </div>
</template>

<script setup>
import Cookies from 'js-cookie';
import { useDocumentVisibility } from 'ahooks-vue';
import { useStore } from 'vuex';
import { Locale } from 'vant';
import { useRefresh } from '@/utils/hooks.js';
import { LANGS } from '@/constant';
import SiteNoticeBox from '@/views/siteNoticeBox.vue';
import { loadLanguageAsync, loadVantLocale } from '@/utils/changeLocale';

const $store = useStore();
const route = useRoute();
const subConfig = inject('subConfig');

const {
  ctx,
} = getCurrentInstance();

const global = inject('global');

const { isVisible, visibilityState } = useDocumentVisibility();
watch(visibilityState, () => {
  if (isVisible.value && $store.state.user.isLogin) {
    $store.dispatch('user/getWalletInfo');
  }
});

const checked = computed(() => $store.state?.app?.darkTheme === 'dark');

const isDev = process.env.NODE_ENV === 'development';
const isShowLang = ref(false);

function changeTheme() {
  $store.commit('app/SET_DARK_THEME', checked.value ? 'normal' : 'dark');
}

const {
  app,
  user,
} = global.$store.state;

if (user.isLogin) {
  global.$store.dispatch('user/getUserInfo');
}

// 根据系统颜色模式自动切换主题
function handleChange(mediaQueryListEvent) {
  global.$store.commit('app/SET_DARK_THEME', mediaQueryListEvent.matches ? 'dark' : 'normal');
}

const {
  refresh,
  updateRefresh,
} = useRefresh(subConfig.isI18n);

onMounted(async () => {
  global.$store.dispatch('app/getDict', ['platformgameidsv2', 'siteinfo', 'allplatform', 'regionlist', 'messagetypelist']);

  if (subConfig.isI18n) {
    loadLanguageAsync(ctx.$i18n, app.lang);
    loadVantLocale(Locale, app.lang);
  }

  global.$store.commit('app/SET_SOURCE');

  // 判断是不是app内嵌页
  // 添加app暗黑模式判断逻辑
  const {
    source,
    appLang,
    isDark,
  } = $store.state.app;
  // app 内嵌逻辑
  if (source === 'app') {
    if (subConfig.isI18n) {
      global.$store.commit('app/SET_LANG', appLang === 'zh' ? 'zh-CN' : appLang);
    }
    if (subConfig.isSwitchDark) global.$store.commit('app/SET_DARK_THEME', isDark ? 'dark' : 'normal');
  } else {
    if (subConfig.isSwitchDark) {
      const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');
      global.$store.commit('app/SET_DARK_THEME', mediaQueryListDark.matches ? 'dark' : 'normal');
      mediaQueryListDark.addListener(handleChange);
    } else {
      Cookies.set('darkTheme', false);
    }

    /* Cookies.remove('lang'); */
    if (route.params.lang && LANGS.some((lang) => route.params?.lang === lang)) {
      global.$store.commit('app/SET_LANG', route.params.lang);
    }

    watch(() => user.isLogin, () => {
      global.$store.dispatch('app/getDict', ['messagetypelist']);
      updateRefresh();
    });

    watch(() => app.headers, () => {
      updateRefresh();
    }, { deep: true });
  }
});

</script>

<style lang="less" scoped>
.lang-switch {
  position: fixed;
  z-index: 1000;
  bottom: 100px;
  display: flex;
  justify-content: space-between;
  width: 100vw;
}
</style>
