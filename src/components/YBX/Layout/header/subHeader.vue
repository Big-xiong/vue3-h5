<template>
  <van-nav-bar class="m-header" :title="title" left-arrow @click-left="handleClick">
    <template #right>
      <SvgIcon @click="$openKefu" v-if="showKefu" name="kefu" />
      <span @click="$router.push(meta.rightGo)" v-else-if="meta.rightGo">{{ $t(meta.rightTitle) }}</span>
    </template>
    <template #title v-if="meta.tips">
      <span @click="openTips" class="tips-title">
        {{ $t(meta.title || '') }}
        <van-icon name="question-o" />
      </span>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { Dialog } from 'vant';
import {
  inject, reactive, ref, watch, watchEffect, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const route = useRouter();
const meta = ref(route.currentRoute.value?.meta ?? {});
const title = ref(global.$t(meta.value.title) || '');
const showKefu = ref(true);

watch(() => route.currentRoute, () => {
  meta.value = route.currentRoute.value.meta;
  // 电子内页如果从平台进入则显示平台名称
  if (route.currentRoute.value.meta.title === '电子' && route.currentRoute.value.query.plat) {
    title.value = route.currentRoute.value.query.plat;
  }
}, { deep: true, immediate: true });

watchEffect(() => {
  title.value = global.$t(meta.value.title);
  showKefu.value = typeof meta.value.rightStatus === 'boolean' ? meta.value.rightStatus : false;
});

function handleClick() {
  if (meta.value.go) {
    global.$router.push({ name: meta.value?.go });
  } else {
    global.$router.go(-1);
  }
}

function openTips() {
  global.$dialog({ tpl: 'AgentChargeTips' });
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
  font-size: 32px;
}

:deep(.van-icon-arrow-left:before) {
  color: var(--font-color-ffffff);
}

.m-header {
  .svg-icon-wrap {
    width: 40px;
    height: 34px;
    fill: var(--bg-color-ffffff);
    margin-right: 6px;
  }
}

.tips-title {
  font-size: 32px;
  display: flex;
  align-items: center;
}

.van-icon {
  font-size: 32px;
  color: var(--font-color-ffffff);
  margin-left: 10px;
}
</style>
