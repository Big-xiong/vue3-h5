<template>
  <div class="home-wrap-content">
    <Banner />
    <Notice />
    <HomeWrapBar />
    <tabStyle />
  </div>
</template>
<script setup>
import { useRequest } from 'ahooks-vue';
import Banner from '@/components/Banner/index.vue';
import { gamelist } from '@/api/app';
import HomeWrapBar from './homeWrapBar.vue';
import tabStyle from './tabStyle.vue';
import Notice from './notice.vue';

const store = inject('store');
const global = inject('global');
const { user } = store.state;
const { walletInfo } = user;
store.dispatch('game/getPlatformGameIdsv3');
store.dispatch('app/getDict', ['platformgameidsv2']);

watch(
  () => user.isLogin,
  (val) => {
    if (val && !walletInfo.money) {
      store.dispatch('user/getWalletInfo');
    }
  },
  { immediate: true },
);

const { data: electronGames } = useRequest(
  () => gamelist({
    per_page: 10,
    page: 1,
  }),
  {
    formatResult(res) {
      return res.data.slice(0, 10);
    },
  },
);
</script>

<style lang="less" scoped>
:deep(.notice) .action {
  display: none;
}
</style>
