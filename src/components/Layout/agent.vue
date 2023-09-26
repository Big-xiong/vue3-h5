<template>
  <SubHeader v-if="layout"/>
  <div class="agent-layout">
    <router-view></router-view>
  </div>
  <TabBar :tabData="agentChildRoutes" v-if="isDisplayTabBar"/>
</template>

<script setup>
import {
  inject, computed, ref, watchEffect,
} from 'vue';
import { useRoute } from 'vue-router';
import AgentRoutes from '@/router/modules/agent';
import SubHeader from './header/subHeader.vue';
import TabBar from './footer/TabBar.vue';

const global = inject('global');

const agentChildRoutes = AgentRoutes[0].children.filter((item) => item.meta?.tabName);

const route = useRoute();
const isDisplayTabBar = computed(() => {
  const target = agentChildRoutes.find(({ name }) => route.name === name);
  return target?.meta?.tabName;
});
const layout = ref(true);

watchEffect(() => {
  const { meta } = route;
  layout.value = typeof meta.layout === 'boolean' ? meta.layout : true;
});

</script>

<style lang="less" scoped>
.agent-layout {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
