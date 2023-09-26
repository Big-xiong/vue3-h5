<template>
  <Banner />

  <div class="home-wrap-bar">
    <div class="home-wrap-bar-money layout-flex-column" v-if="user?.isLogin">
      <span v-money="store.state.user.walletInfo?.money || '0.00'"></span>
      <!--        <span v-money="1230000000000"></span>-->
      <span>{{ $t('总余额') }}</span>
    </div>
    <div class="login" v-else @click="$router.push('/login')">{{ $t('未登录') }}</div>
    <div class="home-wrap-bar-right">
      <div
        class="home-wrap-bar-right-btn layout-flex-column"
        v-login="() => $router.push({ name: 'centerDeposit' })"
      >
        <SvgIcon name="deposit-btn" />
        {{ $t('存款') }}
      </div>
      <div
        class="home-wrap-bar-right-btn layout-flex-column"
        v-login="() => $router.push({ name: 'centerTransfer' })"
      >
        <SvgIcon name="transfer-btn" />
        {{ $t('转账') }}
      </div>
      <div class="home-wrap-bar-right-btn layout-flex-column" v-login="() => handleWithdraw()">
        <SvgIcon name="deposit-btn" style="transform: rotateZ(180deg)" />
        {{ $t('提款') }}
      </div>
    </div>
  </div>

  <div class="dark-title home-wrap-title">
    <SvgIcon name="thump-up" />
    {{ $t('推荐游戏') }}
  </div>

  <RecomGames />

  <div class="home-wrap-line"></div>
  <div class="home-wrap-title">
    <SvgIcon name="cup" />
    {{ $t('全部游戏') }}
  </div>

  <Tabs v-model:active="gameTab" />

  <AllGame :active="gameTab" :electronData="electronGames" />
  <Discount />
</template>

<script setup>
import {
  inject, reactive, ref, watch, computed, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Banner from '@/components/Banner/index.vue';
import { gamelist, indexbanner } from '@/api/app';
import RecomGames from './RecomGames.vue';
import Tabs from './Tabs.vue';
import AllGame from './AllGame.vue';
import Discount from './Discount.vue';
import gameData from './gameData';
import { useWithdraw } from '@/utils/hooks';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const gameTab = ref({
  name: '体育',
  type: 'sport',
  id: 4,
});

const store = inject('store');
const { user } = store.state;
const { walletInfo } = user;
const { app } = store.state;

const { handleWithdraw } = useWithdraw();

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

onMounted(() => {
  Object.values(gameData).forEach((item) => {
    item.forEach((subItem) => {
      const img = new Image();
      img.src = global.$getSrc(subItem.url);
    });
  });
});

function openLoading() { }

if (user.isLogin) {
  openLoading();
}
</script>

<style lang="less" scoped>
.login {
  font-size: 44px;
  flex: 1;
  text-align: center;
  color: var(--theme-color);
}

.home-wrap {
  background-color: var(--dark-111);
  flex: 1;

  &-bar {
    height: 100px;
    margin: 56px 0px 26px 0px;
    box-sizing: border-box;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-money {
      flex: 1;
      span {
        color: var(--dark-fff, var(--font-color-222930));
      }

      span:nth-child(1) {
        font-size: 42px;
        font-family: var(--font-family-helvetica);
        font-weight: 400;
        text-align: center;
        color: var(--theme-color);
        line-height: 50px;
      }
    }

    &-right {
      display: flex;

      &-btn {
        min-width: 100px;
        height: 100px;
        box-sizing: border-box;
        padding: 0 8px;
        border: 2px solid var(--dark-333, var(--border-color-c4c4c4));
        border-radius: 6px;
        margin-left: 24px;
        font-size: 22px;
        white-space: nowrap;
        font-weight: 500;
        color: var(--dark-fff, var(--font-color-434349));

        .svg-icon-wrap {
          width: 46px;
          margin-bottom: 8px;
          height: 46px;
          fill: var(--dark-fff, var(--font-color-222930));
        }
      }
    }
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 36px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-404040));
    line-height: 44px;
    padding: 30px 0 22px 32px;

    &.dark-title {
      background-color: var(--dark-000);
    }

    .svg-icon-wrap {
      width: 36px;
      height: 36px;
      margin-right: 16px;
    }

    &-right {
      font-size: 28px;
      font-weight: 500;
      color: var(--font-color-24c29a);
      line-height: 40px;

      img {
        width: 10px;
        height: 18px;
        margin: 0 25px 0 12px;
      }
    }
  }

  &-line {
    width: 100vw;
    height: 10px;
    background-color: var(--dark-000, var(--bg-color-ededed));
    margin-top: 40px;
  }

  .space-between {
    justify-content: space-between;
  }

  .center {
    display: flex;
    align-items: center;
  }
}
</style>
