<template>
  <SubHeader v-if="route.meta.layout !== false && app?.source !== 'app'" />
  <div class="help-layout">
    <!-- <div class="help-type-wrap" v-if="route.name !== 'helpDetail'">
      <div
        class="item"
        v-for="(item, index) in list"
        :key="index"
        :class="{ active: item.name === route.name }"
        @click="$router.push({ name: item.name })"
      >
        {{ $t(item.meta.title) }}
      </div>
    </div>-->

    <div class="help-body" :class="{ detail: route.name === 'helpDetail', 'help-brand': route.name === 'helpBrand' }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HelpRoute from '@/router/modules/help';
import SubHeader from './header/subHeader.vue';

const store = inject('store');
const { app } = store.state;

const route = useRoute();

// const list = computed(() => HelpRoute[0].children.filter((item) => item.meta.layout !== false));
</script>

<style lang="less" scoped>
.help-layout {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.help-type-wrap {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px;

  .item {
    width: 156px;
    height: 88px;
    line-height: 88px;
    background-color: var(--bg-color-282828);
    border-radius: 8px;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-222930));
    text-align: center;

    &.active {
      background-color: var(--theme-color);
      color: var(--font-color-fff);
    }
  }
}

.help-body {
  box-sizing: border-box;
  padding: 30px;
  overflow-y: auto;
  transform: translateZ(0);

  .header-wrap {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  &.detail,
  &.help-brand {
    padding: 0;
    height: 100%;
  }
}
</style>
