<template>
  <div class="home-wrap-bar">
    <div class="home-wrap-bar-member">
      <div class="home-wrap-bar-member-title" v-if="user?.isLogin">
        <span>
          {{ `${user?.userInfo.username}` }}
          <van-image :src="$getSrc(`/src/current_project/assets/images/level/vip${user?.userInfo?.level}@2x.png`)" />
        </span>
        <span v-money="store.state.user.walletInfo?.money || '0.00'"></span>
      </div>
      <div class="home-wrap-bar-member-title" v-else @click="$router.push('/login')">
        <span>{{ $t('您还未登入') }}</span>
        <span>{{ $t('登录/注册后查看') }}</span>
      </div>
    </div>
    <div class="home-wrap-bar-right">
      <div class="home-wrap-bar-right-btn" v-login="() => $router.push({ name: 'centerDeposit' })">
        <van-image :src="$getSrc(`/src/assets/images/home/bar/bet_icon_me_top_charge@2x.png`)" />
        <span>{{ $t('充值') }}</span>
      </div>
      <div class="home-wrap-bar-right-btn" v-login="() => $router.push({ name: 'centerTransfer' })">
        <van-image :src="$getSrc(`/src/assets/images/home/bar/bet_icon_me_top_trans@2x.png`)" />
        <span>{{ $t('转账') }}</span>
      </div>
      <div class="home-wrap-bar-right-btn" v-login="() => handleWithdraw()">
        <van-image :src="$getSrc(`/src/assets/images/home/bar/bet_icon_me_top_withdraw@2x.png`)" />
        <span>{{ $t('取款') }}</span>
      </div>
      <div class="home-wrap-bar-right-btn" v-login="() => $router.push({ name: 'Vip' })">
        <van-image :src="$getSrc(`/src/assets/images/home/bar/bet_icon_me_top_vip@2x.png`)" />
        <span>{{ $t('VIP') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import SvgIcon from '@/components/SvgIcon.vue';
import { useWithdraw } from '@/utils/hooks';

const global = inject('global');
const $router = useRouter();
const store = inject('store');
const { user } = store.state;
const { handleWithdraw } = useWithdraw();
const domain = window.location.host;
const getTimeState = computed(() => {
  const hours = new Date().getHours();
  if (hours >= 0 && hours <= 10) {
    return global.$t('早上好');
  } if (hours > 10 && hours <= 14) {
    return global.$t('中午好');
  } if (hours > 14 && hours <= 18) {
    return global.$t('下午好');
  } if (hours > 18 && hours <= 24) {
    return global.$t('晚上好');
  }
  return '';
});
function onCopy(e) {
  Toast.success(global.$t('复制成功'));
}
function onError(e) {
  Toast.fail(global.$t('复制失败，请重试'));
}
</script>

<style lang="less" scoped>
.home-wrap-bar {
  box-sizing: border-box;
  padding: 0 28px;
  margin-top: 22px;
  display: flex;
  align-items: center;

  &-member {
    // background: var(--theme-color);
    border-radius: 6px 6px 0px 0px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px 0 0;
    line-height: 44px;
    color: var(--font-color-333);
    overflow: hidden;
    font-size: 24px;

    &-title {
      display: flex;
      flex-direction: column;

      span {
        font-size: 32px;

        &:first-child {
          display: flex;
          align-items: center;

          .van-image {
            width: 60px;
            margin-left: 10px;
          }
        }

        &:last-child {
          color: var(--cur-color-999);
          font-size: 24px;
        }
      }
    }
  }

  &-money {
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    padding: 0 20px;
    background-color: var(--bg-color-353435);
    border-left: 1px solid var(--border-color-fff-1);
    border-right: 1px solid var(--border-color-fff-1);

    span {
      font-size: 28px;
      font-weight: 500;
      color: var(--theme-color);
    }

    .money {
      font-size: 32px;
      font-family: var(--font-family-helvetica);
      font-weight: 400;
      text-align: center;
      color: var(--theme-color);
      line-height: 50px;
      margin-left: 20px;
    }

    .login {
      width: 130px;
      height: 44px;
      border: 1px solid var(--border-color-theme);
      border-radius: 22px;
      line-height: 44px;
      text-align: center;
      color: var(--cur-color-868686);
      font-size: 20px;
      margin-left: 20px;
    }
  }

  &-right {
    display: flex;
    flex: 1;
    background-color: var(--bg-color-353435);
    border-radius: 0 0 6px 6px;

    &-btn {
      width: 100%;
      // height: 60px;
      box-sizing: border-box;
      // border: 2px solid var(--border-color-fff-1);
      font-size: 24px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      .van-image {
        width: 80px;
        height: 78px;
      }

      span {
        color: var(--theme-color);
      }

      .svg-icon-swap {
        width: 34px;
        min-height: 34px;
        fill: var(--theme-color);
        margin-right: 10px;
      }
    }
  }
}
</style>
