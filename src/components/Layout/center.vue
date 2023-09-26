<template>
  <VipHeader v-if="showVipHeader && source !== 'app'" />
  <SubHeader v-if="showSubHeader && source !== 'app'" />
  <div class="app-body">
    <router-view />
  </div>
</template>

<script setup>
import {
  inject, onMounted, ref, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import SubHeader from './header/subHeader.vue';
import VipHeader from './header/vipHeader.vue';

const global = inject('global');
const store = inject('store');
const { source } = store.state?.app;

const route = useRouter();
const showSubHeader = ref(false);
const showVipHeader = ref(false);

watchEffect(() => {
  const { meta } = route.currentRoute.value;
  showVipHeader.value = meta.showVipHeader;
  showSubHeader.value = meta.showSubHeader;
});

</script>

<style lang="less" scoped>
.app-body {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  > div {
    overflow-y: auto;
    flex: 1;
  }
}
</style>
