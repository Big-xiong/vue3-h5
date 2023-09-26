<template>
  <div class="header-wrap layout-flex-between">
    <div class="inner-wrap">
      <div class="header-wrap-nav">
        <img class="header-wrap-logo" :src="dicts?.siteinfo?.h5_logo ?? ''" />
        <img class="header-wrap-logo" @click="openCallBack" src="@img/home/header/bet_icon_me_message@2x.png" />
        <!-- <SvgIcon @click="openCallBack" name="kefu" /> -->
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
function openCallBack() {
  // global.$dialog({ tpl: 'HeaderCall' });
  global.$router.push({ name: 'notice' });
}
</script>

<style lang="less" scoped>
.header-wrap {
  // order: -1;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2100;
  position: relative;
  height: 88px;

  &-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 30px 22px 42px;
    width: 100%;
    height: 88px;
    box-sizing: border-box;
    font-size: 28px;
    color: var(--font-color-ffffff);
    z-index: 2;
    background: var(--bg-color-fff);

    .svg-icon-wrap {
      width: 48px;
      height: 48px;
      margin-right: 12px;
      fill: var(--theme-color);
    }
  }

  &-logo {
    max-height: 52px;
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

.inner-wrap {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1110;
}
</style>
