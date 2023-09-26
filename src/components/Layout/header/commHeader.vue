<template>
  <van-nav-bar
    class="m-header"
    :title="$t(title)"
    @click-left="handleClick"
    :safe-area-inset-top="true"
    :border="false"
  >
    <template
      #right
      v-if="(meta.rightStatus ?? true)"
    >
      <SvgIcon
        @click="$openKefu"
        v-if="isDiscount"
        name="kefu"
      />
    </template>
  </van-nav-bar>
</template>

<script setup>
import { Dialog } from 'vant';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const route = useRouter();
const { meta } = route.currentRoute.value;
const title = ref(meta.title || '');
const isDiscount = ref(route.currentRoute.value.name?.includes('promos'));
watch(
  () => route.currentRoute,
  (currentRoute) => {
    title.value = currentRoute.value.meta.title;
    isDiscount.value = currentRoute.value.name?.includes('promos');
  },
  { deep: true },
);
function openTips() {
  global.$dialog(meta.tips);
}

function handleClick() {
  if (meta.go) {
    global.$router.push({ name: meta.go });
  } else {
    global.$router.go(-1);
  }
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}
:deep(.van-icon-arrow-left:before) {
  color: var(--font-color-ffffff);
}
.m-header {
  .svg-icon-wrap {
    width: 48px;
    height: 48px;
    fill: var(--bg-color-ffffff);
  }
}
.icon-wen {
  color: var(--theme-color);
  font-size: 30px;
}
</style>
