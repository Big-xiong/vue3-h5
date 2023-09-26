<template>
  <div class="app-body">
    <component v-for="(item, index) in componentList" :key="index" :is="item" />
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
  <Footer v-if="app?.source !== 'app'" />
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Header from './header/index.vue';
import CommHeader from './header/commHeader.vue';
import UserHeader from './header/userHeader.vue';
import Footer from './footer/index.vue';
import FooterDownload from './footer/footerDownload.vue';

const global = inject('global');

const store = inject('store');
const route = useRouter();
const { app } = store.state;

const compConfig = {
  downLoadHeader: FooterDownload,
  homeHeader: Header,
  commHeader: CommHeader,
  userHeader: UserHeader,
};

const componentList = computed(() => (app.source !== 'app' ? Object.entries(compConfig).reduce((curr, [key, comp]) => {
  const { meta } = route.currentRoute.value;
  const arr = Array.isArray(comp) ? comp : [comp];
  if (meta[key]) curr.push(...arr);
  return curr;
}, []) : []));
</script>

<style lang="less" scoped>
.app-body {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
</style>
