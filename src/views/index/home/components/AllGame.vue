<template>
  <div class="all-game-wrap no-scrollbar">
    <div class="inner-wrap">
      <div
        class="box"
        v-for="(item, index) in gameList"
        :key="index"
        :class="{ 'maintain-game': isMaintaining(item, index) }"
        @click="playGame(item)"
      >
        <van-image :src="$getSrc(item.url)" />
        <span class="name">{{ $t(item.name) }}</span>
        <em class="maintain-text" v-show="isMaintaining(item, index)">{{ $t('维护中') }}</em>
      </div>
      <div
        class="box electron-more"
        @click="$router.push('/slot')"
        v-if="active.type === 'electron'"
      >
        <van-image :src="$getSrc('/src/assets/images/games/electron/more.png')" />
        <div class="more-wrap">
          <span class="name">{{ $t('更多') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import {
  computed, inject, reactive, onMounted,
} from 'vue';
import gameData from './gameData';

const props = defineProps({
  active: {
    type: Object,
    default: () => ({}),
  },
  electronData: {
    type: Array,
    default: () => [],
  },
});

const store = inject('store');
const { dicts } = store.state.app;

const global = inject('global');

function getStatus(data, index) {
  const game = global.$getGameStatus(data, props.active.type, index);
  return game && game.status === 2;
}

function isMaintaining(data) {
  const targetGames = dicts.platformgameidsv2?.find((item) => item.game_cate_id === props.active.id)?.platform_list ?? [];
  return !targetGames?.find((item) => item.id === data.game_platform_id);
}

function playGame(data, name, index) {
  if (props.active.type === 'electron') {
    global.$router.push({
      path: '/slot',
      query: {
        plat: data.id,
      },
    });
  } else if (isMaintaining(data)) {
    Toast.fail(global.$t('该游戏维护中'));
  } else {
    const targetGames = dicts.platformgameidsv2
      ?.find((item) => item.game_cate_id === props.active.id)?.list_data ?? [];

    if (targetGames.length) {
      targetGames.forEach((item) => {
        if (item.id === data.game_platform_id) {
          global.$playGame(item, props.active.id);
        }
      });
    }
  }
}

const gameList = computed(() => gameData[props.active.type]);
</script>

<style lang="less" scoped>
.all-game-wrap {
  position: relative;
  padding: 12px 0 14px 0px;
  margin: 25px 0 18px 0;
  background: var(--background);
  height: 242px;
  overflow-x: scroll;
  overflow-y: hidden;

  .inner-wrap {
    box-sizing: border-box;
    display: inline-block;
    white-space: nowrap;
    position: absolute;
    padding: 0 32px;
  }

  .box {
    display: inline-block;
    position: relative;
    width: 240px;
    height: 242px;
    border-radius: 8px;
    margin-right: 18px;
    overflow: hidden;

    .van-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-size: 24px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 34px;
      display: block;
      position: absolute;
      top: 200px;
      left: 20px;
    }
  }

  .more-wrap {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    .name {
      position: unset;
      font-size: 32px;
      top: unset;
      left: unset;
    }
  }
}
</style>
