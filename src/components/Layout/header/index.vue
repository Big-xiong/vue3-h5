<template>
  <div class="header-wrap layout-flex-between" :class="{ 'no-download': !app.showDownload }">
    <teleport :to="$store.state.app.teleportContainer">
      <div class="inner-wrap">
        <div
          class="download-wrap"
          v-if="app.showDownload"
          @click="$router.push({ name: 'downApp' })"
        >
          <van-icon name="cross" @click.stop="closeDownload"></van-icon>
          <SvgIcon name="download-icon" />
          <span class="text">{{ $t('更多精彩游戏，请下载手机APP') }}</span>
          <span>{{ $t('立即下载') }}>></span>
        </div>
        <div class="header-wrap-nav">
          <SvgIcon @click="$openKefu" name="kefu" />
          <img class="header-wrap-logo" :src="$getSrc(`/src/assets/images/logo.png`)" />
          <div class="header-wrap-lang" @click="toggleLang">
            <img
                class="header-wrap-lang-logo"
                :src="$getSrc(`/src/assets/images/lang-flag/${logo}.png`)"
            />
            <van-icon name="play" color="#fff" size="0.3rem" />
          </div>
        </div>
      </div>
    </teleport>
  </div>

  <Lang v-model:visible="visible" @onConfirm="onConfirm" />
</template>

<script setup>
import {
  inject,
  ref,
  watch,
  onMounted,
} from 'vue';
import Cookies from 'js-cookie';
import Lang from './lang/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const store = inject('store');
const { app } = store.state;
const logo = ref(Cookies.get('lang') || 'zh-CN');
const visible = ref(false);
const zIndex = ref(10);

function onConfirm(p) {
  logo.value = p;
  visible.value = false;
  setTimeout(() => {
    zIndex.value = 10;
  }, 500);
}

function toggleLang() {
  visible.value = !visible.value;
}

function closeDownload() {
  store.commit('app/SET_SHOW_DOWNLOAD', false);
}
</script>

<style lang="less" scoped>
.header-wrap {
  order: -1;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2100;
  position: relative;
  min-height: 176px;

  &.no-download {
    min-height: 88px;
  }

  &-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 12px 22px 42px;
    width: 100%;
    height: 88px;
    box-sizing: border-box;
    font-size: 28px;
    color: var(--font-color-ffffff);
    background-color: var(--bg-color-24c29a);
    z-index: 2;

    .svg-icon-wrap {
      width: 48px;
      height: 48px;
      margin-right: 12px;
      fill: var(--bg-color-ffffff);
    }
  }

  &-logo {
    width: 214px;
    height: 32px;
  }

  &-lang {
    display: flex;
    align-items: center;

    &-logo {
      width: 50px;
      height: 32px;
      margin-right: 16px;
    }

    .van-icon {
      transform: rotate(90deg);
    }
  }
}

.download-wrap {
  display: flex;
  align-items: center;
  background-color: var(--theme-color);
  height: 88px;
  padding: 0 36px;
  box-sizing: border-box;
  width: 100%;
  color: var(--font-color-ffffff);
  font-size: 24px;

  .van-icon {
    font-size: 36px;
    margin-right: 16px;
  }

  .svg-icon-wrap {
    width: 40px;
    height: 34px;
    fill: var(--bg-color-ffffff);
    flex-shrink: 1;
    margin-right: 6px;
  }

  span {
    white-space: nowrap;
  }

  .text {
    white-space: pre-wrap;
    margin-right: auto;
  }
}

.inner-wrap {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1110;
}
</style>
