<template>
    <van-nav-bar :safe-area-inset-top="true" :border="false">
      <template #left>
        <img :src="$getSrc(`/src/assets/images/icon/shezhi.png`)" @click="$router.push('/more')"/>
      </template>
      <template #right>
        <SvgIcon @click="$openKefu" name="kefu" />
      </template>
    </van-nav-bar>
</template>

<script setup>
import { Dialog } from 'vant';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';

const global = inject('global');
const route = useRouter();
const { meta } = route.currentRoute.value;
</script>

<style lang="less" scoped>
img {
  width: 32px;
  height: 32px;
}
.notice {
  width: 40px;
  height: 40px;
}
:deep(.van-nav-bar__right) {
  top: 12px;
}
</style>
