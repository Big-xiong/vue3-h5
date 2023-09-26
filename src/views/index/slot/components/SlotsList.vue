<template>
  <div class="slots-wrap">
    <van-list class="games" :offset="200" :immediate-check="false" v-if="gameList.length">
      <van-cell v-for="(item, index) in gameList" :key="index">
        <div class="game-item">
          <div class="game-section" @click="$playGame(item)">
            <van-image class="game-image" :src="item.pic"></van-image>
            <div class="hot" v-if="item.is_hot === 1">HOT</div>
            <div class="hot" v-else-if="item.is_new === 1">NEW</div>
            <template v-if="iosVersion >= 14">
              <img
                v-if="navType !== 2"
                v-login="() => doFavorite(item.id, index)"
                :src="$getSrc(`/src/assets/images/icon/fav${item.is_favorite === 1 ? '' : '_n'}.webp`)"
                alt
              />
            </template>
            <template v-else>
              <van-icon
                v-if="navType !== 2"
                v-login="() => doFavorite(item.id, index)"
                :name="item.is_favorite === 1 ? 'like' : 'like-o'"
                :class="{ active: item.is_favorite === 1 }"
              ></van-icon>
            </template>
          </div>
          <div class="tag-section">
            <span class="tag">{{ getPlatformName(item.game_platform_id) }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </van-cell>
    </van-list>
    <van-empty
      class="empty"
      v-else-if="noData"
      :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
      :description="$t('暂无数据')"
    />
  </div>
</template>

<script setup>
import {
  inject, onMounted, ref,
} from 'vue';
import { Toast } from 'vant';
import { favorite } from '@/api/game';

const global = inject('global');

defineProps({
  navType: {
    type: Number,
    default: 0,
  },
  gameList: {
    type: Array,
    default: () => [],
  },
  noData: {
    type: Boolean,
    default: true,
  },
});

const $store = inject('store');
const iosVersion = ref(0);
const { dicts } = $store.state.app;

onMounted(() => {
  if (!dicts.allplatform) {
    global.$store.dispatch('app/getDict', ['allplatform']);
  }
  const matcher = navigator.userAgent.match(/iPhone OS (.+?) /);
  if (matcher && matcher.length > 1) {
    let version = matcher[1].split('_');
    if (version.length > 2) {
      version = version.slice(0, 2);
    }
    iosVersion.value = Number(version.join('.'));
  }
});

function getPlatformName(id) {
  return dicts.allplatform?.[id] ?? '';
}

// const listRef = ref({});

// function loadMore() {
//   console.log('load more');
// }

// onMounted(() => {
//   if (listRef) {
//     setInterval(() => {
//       console.log('============= check');
//       listRef.value.check();
//     }, 2000);
//   }
// });

const emit = defineEmits(['like']);

function doFavorite(gameId, i) {
  favorite({
    game_id: gameId,
  }).then((res) => {
    Toast.success(global.$t('成功收藏游戏'));
    emit('like', i);
  });
}
</script>

<style lang="less" scoped>
.slots-wrap {
  width: 100%;
  overflow-y: visible;
  .games {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0;
    overflow: visible;

    .van-cell {
      overflow: visible;
      position: relative;
      margin-bottom: 42px;
      width: 332px;
      padding: 0;
      border-bottom: none;
      border-radius: 8px;
      &::after {
        border-bottom: 0;
      }
    }

    .game-section {
      position: relative;
      display: flex;
      margin-top: 16px;
      width: 332px;
      height: 192px;
      overflow: visible;
      box-sizing: border-box;
      padding: 10px 16px;

      .van-image {
        width: 332px;
        height: 192px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .van-icon {
        color: var(--font-color-ffffff);
        font-size: 30px;
        margin-left: auto;
        &.active {
          color: var(--theme-color);
        }
      }

      .hot {
        z-index: 2;
        width: 40px;
        height: 40px;
        line-height: 44px;
        border-radius: 50%;
        text-align: center;
        font-size: 18px;
        color: var(--font-color-ffffff);
        background-color: var(--theme-color);
      }
    }

    img {
      z-index: 2;
      width: 68px;
      height: 68px;
      position: absolute;
      right: -6px;
      top: -6px;
    }

    .name {
      font-size: 28px;
      font-weight: 500;
      color: var(--dark-fff, var(--font-color-333333));
    }
  }

  .tag-section {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .tag {
      color: var(--font-color-ffffff);
      background-color: var(--theme-color);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 34px;
      border-radius: 4px;
      margin-right: 10px;
    }
    .name {
      font-size: 28px;
      font-weight: 500;
      white-space: nowrap;
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--dark-fff, var(--them-color-333333));
    }
  }
}
</style>
