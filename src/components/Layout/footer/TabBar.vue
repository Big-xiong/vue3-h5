<template>
  <div class="tab-bar-wrap">
    <div :class="{ active: currentRoute === item.meta.tabName }" class="tab-bar-item" v-for="(item, index) in tabData"
      :key="index" @click="router.push({ path: item.path })">
      <SvgIcon :name="item.meta.icon" class="icon" />
      <div>{{ $t(item.meta.tabName) }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { inject, computed, defineProps } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const router = useRouter();
const route = useRoute();

const props = defineProps({
  tabData: {
    type: Array,
    default: () => [],
  },
});

const currentRoute = computed(() => route.meta.tabName);
</script>

<style lang="less" scoped>
.tab-bar-wrap {
  border-top: solid 2px var(--dark-bg-color-191919, var(--bg-color-f1f1f1));
  position: sticky;
  bottom: 0;
  width: 100%;
  flex-shrink: 0;
  height: 120px;
  justify-content: space-around;
  display: flex;
  align-items: center;
  font-size: 15px;
  background-color: var(--bg-color-282828);
  color: var(--font-color-606060);

  .icon {
    height: 40px;
    width: 40px;
    fill: var(--font-color-9a9a9a);
  }

  .tab-bar-item {
    flex: 1;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    font-size: 24px;
    color: var(--font-color-9a9a9a);

    &.active .icon {
      fill: var(--theme-color) !important;
    }

    div {
      margin-top: 8px;
    }
  }

  .iconfont {
    font-size: 45px;
  }

  img {
    fill: var(--font-color-cdcdcd);
  }

  .active {
    color: var(--theme-color);

    .iconfont {
      color: var(--theme-color);
    }
  }
}
</style>
