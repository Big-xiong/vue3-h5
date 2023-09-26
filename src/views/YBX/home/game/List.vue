<template>
  <div class="game-list-wrap">
    <div class="games-wrap float-wrap">
      <div class="game-item large" v-for="(item, index) in games" :key="item.code ?? index" @click="gameCheck(item)">
        <van-image :src="item?.imgs?.[0]">
          <template v-slot:loading>
            <van-image src="/src/current_project/assets/images/home/error/error.png" />
          </template>
        </van-image>
        <div class="game-info" v-game-status|img="item.status === 2">
          <div v-if="item?.imgs?.[0] && tipShow && item.name !== '更多'" class="flow-wrapper">
            <div class="flow" v-if="rateShow">{{ $t('最高返水') }}{{ item.wash_rate }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTimeout } from '@/utils/hooks';

const props = defineProps({
  cateId: {
    type: Number,
    default: 1,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  rateShow: {
    type: Boolean,
    default: true,
  },
});

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');

const gameConfig = [[1, 'bbin'], [4, 'ibc'], [8, 'imesb']];

const tipShow = ref(false);
const { run } = useTimeout(() => {
  tipShow.value = true;
}, 500, { manual: true });

watch(() => props.loading, () => {
  if (!props.loading) {
    run();
  }
}, { immediate: true });

const games = computed(() => {
  if (props.cateId === 10) {
    const gameIds = $store.state.game.platformGameIdsv3;
    return gameConfig.reduce((curr, [cateId, code]) => {
      const { list_data = [] } = gameIds.find((item) => item.game_cate_id === cateId) ?? {};
      const target = { ...list_data.find((item) => item.code === code) };
      if (target) {
        console.log('target', target)
        target.nav_pic = global.$getSrc(`/src/assets/images/home/recommend/${subConfig.series ?? 'AMX'}/${code}.png`);
        curr.push(target);
      }
      return curr ?? Array.from({ length: 3 }, () => ({}));
    }, []);
  }
  console.log('props.cateId', props.cateId);
  return $store.getters['game/getTargetGameIdsv3'](1, props.cateId) ?? Array.from({ length: 3 }, () => ({}));
});

function gameCheck(item) {
  if (item.game_cate_id === 2 && item.status === 1) {
    global.$router.push({ path: '/slot', query: item?.name === '更多' ? {} : { platform: item.name } });
  } else {
    global.$playGame(item);
  }
}

</script>

<style lang="less" scoped>
.game-list-wrap {
  .float-wrap {
    .game-item.large {
      display: flex;
      border-radius: var(--border-radius-8);
      margin-bottom: var(--home-game-item-bottom, 16px);

      &.gray-scal {
        filter: grayscale(100%);
      }
    }
  }

  :deep(.van-image__loading) {
    position: relative;
    background: transparent !important;
    margin-left: var(--home-game-item-loading-left, 0);

    .van-image {
      width: 100%;
      display: flex;
      margin-bottom: var(--home-game-item-loading-bottom);
      align-items: center;
      background-color: var(
        --amx-home-game-loading-bg-color,
        var(--dark-666, var(--bg-color-1f2d40))
      ) !important;

      .van-image__error {
        position: relative !important;
        background-color: transparent !important;
      }

      img {
        margin: 0 auto;
        border-radius: 15px;
        width: var(--amx-home-game-loading-bg-size, 35%) !important;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
