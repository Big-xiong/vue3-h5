<template>
  <van-nav-bar :safe-area-inset-top="true" left-arrow :border="false"
    @click-left="handleClick(navConfig[route.name].back)" v-if="app?.source !== 'app'">
    <template #title>
      <span>{{ navConfig[route.name].title }}</span>
    </template>
    <template #right>
      <span @click="$global.$router.push({ name: 'VipIntro' })" v-show="navConfig[route.name]?.right">{{
        navConfig[route.name]?.right
      }}</span>
    </template>
  </van-nav-bar>
  <component :is="navConfig[route.name].component" :levelData="app?.dicts?.memberlevellist" />
</template>

<script setup>
import { inject, reactive } from 'vue';
import { useRoute } from 'vue-router';
import VipPrivilege from './components/VipPrivilege.vue';
import VipDetail from './components/VipDetail.vue';

const $global = inject('global');
const $store = inject('store');
const route = useRoute();
$store.dispatch('app/getDict', ['memberlevellist']);
const {
  app,
} = $store.state;

const navConfig = reactive({
  Vip: {
    title: $global.$t('VIP特权'),
    right: $global.$t('VIP详情'),
    back: 'user',
    component: VipPrivilege,
  },
  VipIntro: {
    title: $global.$t('VIP特权详情'),
    back: 'Vip',
    component: VipDetail,
  },
});

function handleClick(val) {
  $global.$router.push({ name: val });
}

</script>
