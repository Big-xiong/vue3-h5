<template>
  <TabStyle :nav="navList" />
</template>

<script setup>
import {
  computed, inject, ref, watch,
} from 'vue';
import TabStyle from '@/views/YBX/home/tabStyle.vue';

const global = inject('global');
const $store = inject('store');
const navList = ref(Array.from({ length: 7 }, () => ({})));
const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3);

watch(() => platformgameidsv3.value, (val) => {
  const temp = val.reduce?.((curr, next) => (curr.push({ name: next.name, id: next.game_cate_id }), curr), [{
    name: global.$t('推荐'),
    id: 10,
  }]);
  navList.value = temp;
});
</script>

<style lang="less">
.avaswipe {
  --amx-home-game-left-bg: transparent;

  .swiper-pagination-bullet {

    i {
      background-repeat: no-repeat;
      width: 68px !important;
      height: 68px !important;
      background-size: contain !important;
      box-sizing: border-box;
      background-position: -12px center !important;
    }

    span {
      margin-left: -15px;
    }
  }

  .flow-wrapper {
    top: 100px !important;
    left: 20px !important;

    .flow {
      background: var(--amx-game-list-tips-bg, rgba(255, 255, 255, .2));
      color: var(--amx-game-list-tips-color, var(--font-color-fff)) !important;
    }
  }
}
</style>
