<template>
  <van-swipe
    class="profit-swipe"
    :loop="false"
    :width="220"
    :autoplay="4000"
    :show-indicators="false"
  >
    <van-swipe-item
      v-for="(item, index) in rankData"
      :key="index"
      class="swipe-rank-item"
    >
      <div class="box">
        <div class="info">
          <p class="login-name">{{ $t('会员') }} {{ $hideUsername(item.username) }}</p>
          <p>{{ $t('投注') }} {{ item.valid_bet | currency('¥') }}，{{ $t('盈利') }}</p>
          <h3>{{ item.num | currency('¥') }}</h3>
        </div>
        <span class="tag">{{ $platformName(item.platform_id, allPlatforms) }}{{ allCates[item.game_cate_id] }}</span>
        <div
          class="action"
          @click="goGame(item)"
        >
          <img :src="$imgs['home/icon-fudai@2x']" />
          <span>{{ $t('沾沾喜气') }}</span>
        </div>
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script setup>
import {
  inject,
  computed,
} from 'vue';
const $store = inject('store');
const global = inject('global')
$store.dispatch('game/getAllPlatforms');
$store.dispatch('game/getAllCates');
$store.dispatch('game/getAllGameCatesPlatforms');
const { game } = $store.state.game;
const allPlatforms = computed(() => game?.allPlatforms)
const allCates = computed(() => game?.allCates)
const gameCatesPlatforms = computed(() => game?.gameCatesPlatforms)
function goGame(val) {
  gameCatesPlatforms.value.forEach(item => {
    if (val.game_cate_id == item.game_cate_id) {
      item.platform_list.forEach(a => {
        if (a.game_platform_id == val.platform_id) {
          const obj = {
            default_game_id: a.default_game_id,
            platform_id: val.platform_id
          }
          global.$playGame(obj)
        }
      })
    }
  })
}
</script>

<style lang="less" scoped>
.profit-swipe {
  // margin-left: -30px;
  margin-right: -30px;
  :deep(.van-swipe-item) {
    padding-right: 30px;
    // margin-right: 30px;
    color: var(--cur-font-color-ccc);
    .box {
      position: relative;
      background-color: var(--bg-card-color);
      border-radius: 8px;
    }
    .info {
      padding: 30px;
      p {
        line-height: 1.5;
        margin-bottom: 15px;
      }
      .login-name {
        color: var(--font-color-666666);
      }
      h3 {
        color: var(--font-color-white);
        font-size: 30px;
        font-weight: 500;
        margin: 0;
        dfn {
          font-style: normal;
        }
      }
    }
    .tag {
      position: absolute;
      right: 0;
      top: 30px;
      background-color: var(--bg-color-353435);
      border-radius: 22px 0 0 22px;
      line-height: 44px;
      font-size: 20px;
      color: var(--cur-font-color-ccc);
      padding-left: 20px;
      padding-right: 15px;
    }
    .action {
      border-top: 1px solid var(--bg-color-353435);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--cur-color-FF6666);
      font-size: 24px;
      font-weight: 500;
      padding: 20px 0;
      img {
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 15px;
      }
    }
  }
}
</style>
