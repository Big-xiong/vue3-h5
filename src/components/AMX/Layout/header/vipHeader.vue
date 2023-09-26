<template>
  <van-nav-bar
    :safe-area-inset-top="true"
    left-arrow
    :border="false"
    :title="$t(meta.title || '尊贵VIP')"
    @click-left="$router.go(-1)"
  ></van-nav-bar>
</template>

<script setup>
import { Dialog } from 'vant';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';

const global = inject('global');
const $store = inject('store');
const route = useRouter();
const { user } = $store.state;
const { meta } = route.currentRoute.value;
function onLoginClick() {
  global.$popup({
    tpl: 'AgentLogin',
    hasFooter: true,
  });
}
function onAgentRegisterClick() {
  global.$popup({
    tpl: 'AgentRegister',
  });
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  background-color: var(--theme-color);
  font-size: 26px;
}

:deep(.van-button--primary) {
  background-color: var(--bg-color-24c29a);
  height: 60px;
  margin-right: 20px;
}
:deep(.van-button--plain.van-button--primary) {
  color: var(--font-color-ffffff);
  background-color: var(--bg-color-10141f);
  border: 2px solid var(--border-color-fff);
  height: 60px;
}
:deep(.van-nav-bar) {
  order: -1;
}
img {
  width: 242px;
  height: 36pxj;
}
</style>
