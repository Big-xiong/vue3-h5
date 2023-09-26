<template>
  <div class="app-header">
    <Header v-if="homeHeader && source !== 'app'" />
    <CommHeader v-if="commHeader && source !== 'app'" />
    <UserHeader v-if="userHeader && source !== 'app'" />
  </div>
  <div class="app-body">
    <div class="app-body-soroll">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </div>
  </div>
  <Footer v-if="source !== 'app'" />
</template>

<script setup>
import {
  inject, ref, watchEffect, onMounted, onBeforeUnmount,
} from 'vue';
import { useRouter } from 'vue-router';
import Header from './header/index.vue';
import CommHeader from './header/commHeader.vue';
import UserHeader from './header/userHeader.vue';
import Footer from './footer/index.vue';

const global = inject('global');

const store = inject('store');
const route = useRouter();
const homeHeader = ref(false);
const commHeader = ref(false);
const userHeader = ref(false);

const { source } = store.state.app;

watchEffect(() => {
  const { meta } = route.currentRoute.value;
  homeHeader.value = meta.homeHeader;
  commHeader.value = meta.commHeader;
  userHeader.value = meta.userHeader;
});

function scrollFix() {
  if (this.scrollTop === 0) {
    // 滚动到1
    this.scrollTop = 1;
  } else if (this.scrollTop === this.scrollHeight - this.clientHeight) {
    // 滚动到最低端-1
    this.scrollTop = this.scrollHeight - this.clientHeight - 1;
  }
}

onMounted(() => {
  document.querySelector('.app-body-soroll').addEventListener('touchstart', scrollFix, true);
});

onBeforeUnmount(() => {
  document.querySelector('.app-body-soroll').removeEventListener('touchstart', scrollFix);
});
</script>

<style lang="less" scoped>
.app-body {
  flex: 1;
  transform: translateZ(0);
  // overflow-y: hidden;
  display: flex;
  flex-direction: column;
  &-soroll {
    // overflow-y: auto;
    transform: translateZ(0);
    flex-grow: 1;
  }
}
</style>
