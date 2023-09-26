<template>
  <div>
    <div class="search-trigger" @click="showGameSearch">
      <van-icon name="search" />
      <span>{{ (gameSearch && gameSearch.keyword) || $t('搜索') }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  computed,
  defineProps,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  category: {
    type: [String, Number],
  },
  nav: {
    type: [Object],
  },
  payforline: {
    type: [String, Number],
  },
  platform: {
    type: [Object],
  },
});
const $store = inject('store');
const { game } = $store?.state.game;
const gameSearch = computed(() => game?.gameSearch);
const $router = useRouter();

function showGameSearch() {
  const {
    category, nav, payforline, platform,
  } = props;
  const keyword = gameSearch.value ? gameSearch.value : '';
  $store.dispatch('game/setGameSearch', {
    visible: true,
    keyword,
    category,
    nav,
    payforline,
    platform,
  });
  $router.push({ name: 'GameSearch' });
}
</script>

<style lang="less" scoped>
.search-trigger {
  background-color: var(--bg-card-color);
  height: 56px;
  border-radius: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--bg-color-white);
  .van-icon {
    font-size: 40px;
    margin-right: 5px;
    color: var(--font-color-fff);
  }
}
</style>
