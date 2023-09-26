<template>
  <div class="kefu-wrap">
    <van-nav-bar
      class="m-header"
      :title="$t('专属客服')"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <iframe
      :src="link"
      v-show="link"
    ></iframe>
  </div>
</template>

<script setup>
import { inject, computed, onMounted, watch } from 'vue';
import { executeScript } from '@/utils';

const global = inject('global');

const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;

const link = computed(() => {
  const siteInfo = dicts?.siteinfo;
  if (siteInfo?.kf_online_type === 2) {
    return '';
  }
  const { userInfo } = user;
  let url = (siteInfo && siteInfo.h5_kf) || '';
  if (userInfo && userInfo.username) {
    if (url.indexOf('aichat') !== -1) {
      if (url.indexOf('referrer') !== -1) {
        url = `${url}?params={"username":"${userInfo.username}"}`;
      } else {
        url = `${url}&params={"username":"${userInfo.username}"}`;
      }
    }
  }
  return url;
});

onMounted(() => {
  watch(() => dicts.siteinfo, (siteInfo) => {
    if (siteInfo?.kf_online_type === 2) {
      setTimeout(() => {
        executeScript(siteInfo.h5_kf_js);
      }, 1000);
    }
  });
});

</script>

<style lang="less" scoped>
.kefu-wrap {
  flex-grow: 1;
  height: 100%;
  background-color: var(--bg-color-ffffff);

  iframe {
    border: 0;
    width: 100%;
    height: 90%;
  }
}
</style>
