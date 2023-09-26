<template>
  <div :class="user.isLogin ? 'login-wallet wallet' : 'wallet'">
    <div class="balance">
      <div class="item">
        <span v-login="() => delayPush('centerTransfer')">
          {{ $t('钱包') }}
          <SvgIcon class="arrow" name="arrow-circle" />
        </span>
        <SvgIcon name="refresh" v-if="user.isLogin"
          :class="['refresh', { active: user.walletLoading || user.uploadWalletLoading }]" @click="handleWallet" />
      </div>
      <h2 v-money="user.walletInfo.money || 0.0"></h2>
    </div>
    <div class="menu-wrap">
      <div class="menu layout-flex-column" v-login="() => delayPush('centerDeposit')">
        <RechargeBtn />
        <p>{{ $t('充值') }}</p>
      </div>
      <div class="menu layout-flex-column" v-login="() => delayPush('centerTransfer')">
        <ChipBtn />
        <p>{{ $t('转账') }}</p>
      </div>
      <div class="menu layout-flex-column" v-login="() => delayPush('centerWithdraw')">
        <WithdrawBtn />
        <p>{{ $t('取款') }}</p>
      </div>
      <div class="menu layout-flex-column" @click="delayPush('Vip')">
        <VipBtn />
        <p>VIP</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue';
import { useWithdraw, useTimeout } from '@/utils/hooks';
import SvgIcon from '@/components/SvgIcon.vue';
import RechargeBtn from './RechargeBtn.vue';
import ChipBtn from './ChipBtn.vue';
import VipBtn from './VipBtn.vue';
import WithdrawBtn from './WithdrawBtn.vue';

const { handleWithdraw } = useWithdraw();

const global = inject('global');
const $store = inject('store');
const {
  user,
} = $store.state;

const iconState = reactive({
  centerDeposit: false,
  Vip: false,
  centerTransfer: false,
  centerWithdraw: false,
});

function handleWallet() {
  $store.dispatch('user/getWalletInfo');
}

onMounted(() => {
  if (user.isLogin) {
    handleWallet();
  }
});

const { run: timerRun, stop: timerStop } = useTimeout((name) => {
  if (name === 'centerWithdraw') {
    handleWithdraw();
  } else {
    global.$router.push({ name });
  }
}, 500, { manual: true });

function delayPush(name) {
  timerStop();
  Object.keys(iconState).forEach((key) => {
    iconState[key] = key === name;
  });
  timerRun(name);
}

</script>

<style lang="less" scoped>
.wallet {
  width: 92%;
  background: var(--user-bg-color-191919, var(--bg-color-ffffff));
  color: var(--dark-fff, var(--font-color-2b2b2b));
  border-radius: 16px;
  box-shadow: 0px 2px 10px 0px rgba(0, 34, 80, 0.05);
  margin: auto;
  padding: 46px 18px 28px 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .balance {
    width: 36%;
    height: inherit;

    .item {
      display: flex;
      align-items: center;

      span {
        font-size: 24px;
        display: flex;
        align-items: center;
        white-space: nowrap;

        .svg-icon-wrap {
          margin-left: 8px;
        }
      }
    }

    h2 {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 12px;
      margin-bottom: 0px;
    }

    .svg-icon-wrap {
      width: 24px;
      height: 24px;
    }
  }

  .menu-wrap {
    width: 60%;
    display: flex;
    justify-content: space-between;
  }
}

.login-wallet {
  margin-top: 0;
}

.menu {
  p {
    font-size: 24px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-2b2b2b));
  }
}
</style>
