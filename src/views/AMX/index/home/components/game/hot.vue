<template>
  <div class="hot">
    <ul class="hotlist" v-if="!loading">
      <li
        class="games-wrap float-wrap"
        v-show="index < 15"
        v-for="(item, index) in lists?.data"
        @click="$playGame(item)"
        :key="index"
      >
        <div class="cover">
          <van-image fit="cover" lazy-load :src="item.pic"></van-image>
          <span v-if="getPlatformNameById(item.game_platform_id)">
            {{
              getPlatformNameById(item.game_platform_id)
            }}
          </span>
        </div>
        <p>{{ item.name }}</p>
      </li>
    </ul>
    <!-- <div class="loading-wrap" v-else>
      <van-loading />
    </div>-->
  </div>
</template>

<script setup>
import {
  inject, ref, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { getHotGameLists } from '@/api/game';
import { GAME_CATE_ID_SLOTS } from './gamejs/gameId';
import { getGameSlotPlatform } from '@/utils/utils';

const $store = inject('store');
const { dicts } = $store.state.app;
const global = inject('global');
const platforms = computed(() => {
  if (dicts?.platformgameidsv2) {
    return getGameSlotPlatform(GAME_CATE_ID_SLOTS, dicts.platformgameidsv2);
  }
  return [];
});
const { data: lists, loading } = useRequest(
  () => getHotGameLists({
    game_cate_id: 2,
    page: 1,
    per_page: 15,
  }),
);
function getPlatformNameById(id) {
  let ret = '';
  platforms.value.forEach((platform) => {
    if (id === platform.id) {
      ret = platform.name;
      return false;
    }
  });
  return ret;
}
</script>

<style lang="less" scoped>
.hot {
  min-height: 100px;
  :deep(.van-loading) {
    display: flex;
    justify-content: center;
    color: var(--theme-color);
    padding-top: 20px;
  }
}
.hotlist {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    width: calc(100% / 3 - 20px);
    .cover {
      height: 162px;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      .van-image {
        width: 100%;
        height: 100%;
      }
      span {
        position: absolute;
        width: 96px;
        height: 28px;
        background: rgba(0, 0, 0, 0.48);
        border-radius: 14px;
        font-size: 20px;
        color: var(--bg-color-white);
        text-align: center;
        line-height: 28px;
        bottom: 10px;
        left: 50%;
        margin-left: -48px;
      }
    }
    p {
      text-align: center;
      font-size: 20px;
      color: var(--font-color-868686);
      line-height: 24px;
      margin: 16px 0 20px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
