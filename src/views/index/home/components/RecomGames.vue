<template>
  <div class="recom-wrap no-scrollbar">
    <div class="inner-wrap">
      <div
        class="box"
        v-for="(item, index) in gameList"
        :key="index"
        @click="goGame(item)"
      >
        <van-image
          fit="cover"
          class="img"
          :class="{ dark: isDark }"
          :src="$getSrc(item.url)"
        />
        <span class="name">{{ $t(item.name) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed, inject, reactive, ref, toRaw,
} from 'vue';
import { useRouter } from 'vue-router';
import gameData from './gameData';
import { shuffle } from '@/utils';
import { useDicts } from '@/utils/hooks';

const gameList = ref([]);
const store = inject('store');
const global = inject('global');

useDicts('platformgameidsv2', (result) => {
  if (gameList.value.length) {
    return;
  }

  const games = Object.values(gameData).reduce((cur, next) => cur.concat(next), []);
  let listData = result.reduce((curren, next) => curren.concat(next.platform_list), [])
    .filter((item) => item.status === 1 && games.findIndex((subItem) => subItem.game_platform_id === item.id && subItem.game_cate_id === item.game_cate_id) > -1);
  listData = listData.map((item) => toRaw(item));
  const targetGames = shuffle(listData).slice(0, 5).map((item) => {
    const game = games.find((subItem) => subItem.game_platform_id === item.id && subItem.game_cate_id === item.game_cate_id);
    return {
      ...item,
      ...game,
    };
  });
  gameList.value = targetGames;
}, { immediate: true });

const isDark = computed(() => store.state.app?.darkTheme === 'dark');
const router = useRouter();

function goGame(data) {
  if (data.game_cate_id === 2) {
    router.push({
      name: 'slot',
      query: {
        plat: data.id,
      },
    });
  } else {
    global.$playGame(data);
  }
}
</script>

<style lang='less' scoped>
.recom-wrap {
  box-sizing: border-box;
  position: relative;
  margin-top: 30px;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 242px;

  .inner-wrap {
    position: absolute;
    box-sizing: border-box;
    height: 100%;
    white-space: nowrap;
    padding: 0 32px;
  }

  .box {
    position: relative;
    border-radius: 8px;
    margin-right: 32px;
    display: inline-block;
    height: 100%;
    &:last-of-type {
      margin-right: 0;
    }
    .img {
      height: 242px;
      width: 240px;
    }
    .name {
      font-size: 24px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 34px;
      display: block;
      position: absolute;
      left: 20px;
      bottom: 22px;
    }
  }
}
</style>
