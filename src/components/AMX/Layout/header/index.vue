<template>
  <div class="header-wrap layout-flex-between">
    <div class="inner-wrap">
      <div class="header-wrap-nav">
        <img class="header-wrap-logo" :src="dicts?.siteinfo?.h5_logo ?? ''" />
        <!--          $openKefu-->
        <div @click="openCallBack" class="kefu-btn"
          :style="{ background: `url(${$getSrc('/src/assets/images/home/kefu.png')})` }" />
      </div>
    </div>
  </div>
  <Lang v-model:visible="visible" @onConfirm="onConfirm" />
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';
import Cookies from 'js-cookie';
import Lang from './lang/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const store = inject('store');
const { dicts } = store.state.app;
const { app } = store.state;
const logo = ref(Cookies.get('lang') || 'zh-CN');
const visible = ref(false);
const zIndex = ref(10);
const global = inject('global');

function onConfirm(p) {
  logo.value = p;
  visible.value = false;
  setTimeout(() => {
    zIndex.value = 10;
  }, 500);
}
// function openCallBack() {
//   global.$dialog({ tpl: 'HeaderCall' });
// }
const openCallBack = () => global.$popup({ tpl: 'HeaderService' });
</script>

<style lang="less" scoped>
.header-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2100;
  position: relative;
  height: 88px;

  .kefu-btn {
    width: 44px;
    height: 44px;
    margin-right: 10px;
    background-size: cover !important;
  }

  .inner-wrap {
    width: 100%;
  }

  &-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 12px 22px 22px;
    width: 100%;
    height: 88px;
    box-sizing: border-box;
    font-size: 28px;
    color: var(--font-color-ffffff);
    background-color: var(--amx-header-nav-bg);
    z-index: 2;

    .svg-icon-wrap {
      width: 48px;
      height: 48px;
      margin-right: 12px;
      fill: var(--theme-color);
    }
  }

  &-logo {
    max-height: 80px;
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
</style>
