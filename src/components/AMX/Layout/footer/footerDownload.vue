<template>
  <div class="download-wrap" v-if="app.showDownload">
    <van-icon name="cross" @click.stop="closeDownload"></van-icon>
    <img class="logo_insta" :src="$getSrc('/src/current_project/assets/images/home/logo_instal@2x.png')" />
    <span class="text">{{ $t('下载全新APP 享受更多优惠') }}</span>
    <div class="download-btn" @click="$router.push({ name: 'appDownload' })">{{ $t('点我下载') }}</div>
  </div>
</template>

<script setup>
import {
  inject,
} from 'vue';

const store = inject('store');
const { app } = store.state;
function closeDownload() {
  store.commit('app/SET_SHOW_DOWNLOAD', false);
}
</script>

<style lang="less" scoped>
.download-wrap {
  order: -1;
  display: flex;
  align-items: center;
  background-color: var(--amx-download-bg, var(--bg-color-0c0c0c));
  border-bottom: var(--amx-download-bottom-border, none);
  height: 92px;
  padding: 0 25px 0 36px;
  box-sizing: border-box;
  width: 100%;
  color: var(--font-color-fff);
  font-size: 24px;
  bottom: var(--van-tabbar-height);

  &::after {
    content: "";
    width: 100%;
    height: 4px;
    background-color: var(--border-color-d8d8d8);
    position: absolute;
    display: inline-block;
    bottom: -4px;
    left: 0;
  }

  // border-bottom: 4px solid var(--border-color-d8d8d8);

  .van-icon {
    font-size: 36px;
    margin-right: 16px;

    &:before {
      color: var(--amx-download-font-color, var(--font-color-fff-6));
    }
  }

  .logo_insta {
    width: 64px;
    margin-right: 20px;
  }

  span {
    white-space: nowrap;
  }

  .text {
    color: var(--amx-download-font-color, var(--font-color-white));
    white-space: pre-wrap;
    margin-right: auto;
    font-size: 28px;
  }

  .download-btn {
    width: 136px;
    height: 56px;
    line-height: 56px;
    font-size: 24px;
    text-align: center;
    border-radius: 14px;
    border: 2px solid var(--amx-download-btn-border-color, var(--amx-download-btn-color, var(--theme-color)));
    color: var(--amx-download-btn-color, var(--theme-color));
    background-color: var(--amx-download-btn-bg);
  }
}
</style>
