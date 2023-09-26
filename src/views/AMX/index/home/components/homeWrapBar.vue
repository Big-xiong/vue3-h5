<template>
  <div class="home-wrap-bar">
    <div class="home-wrap-bar-member">
      <div class="home-wrap-bar-member-title">{{ $t('欢迎来到') + subConfig.title }}!</div>
      <div class="home-wrap-bar-member-net" v-clipboard:copy="domain" v-clipboard:success="onCopy"
        v-clipboard:error="onError" :data-net="domain">{{ domain }}</div>
    </div>

    <div class="home-wrap-bar-info">
      <div class="home-wrap-bar-money">
        <van-loading size="24" v-if="user.loginLoading" />
        <template v-else>
          <template v-if="user.isLogin">
            <div class="user-info">
              <div class="username">
                <span @click="$router.push('/user')">{{ user?.userInfo.username }} </span>
                <SvgIcon :class="`vip login-vip ${lang === 'vi' ? 'login-vip-vi' : ''}`"
                  :name="`login-vip-${user?.userInfo?.level}`" @click="$router.push('/vip')" />
              </div>
              <div class="balance" @click="$router.push('/user')">{{ $t('余额') }}：<span v-show="!user.walletLoading"
                  class="money" v-if="user?.isLogin" v-money="user.walletInfo?.money || '0.00'" /> <i
                  class="refresh-btn" :class="{ active: user.uploadWalletLoading }"
                  :style="{ background: `url(${$getSrc('/src/assets/images/home/refresh.png')})` }"
                  @click.stop="$store.dispatch('user/getWalletInfo')" /></div>
            </div>
          </template>
          <template v-else>
            <div class="reg" @click="$router.push('/register')">{{ $t('注册') }}</div>
            <div class="login" @click="$router.push('/login')">{{ $t('登录') }}</div>
          </template>
        </template>
      </div>

      <div class="home-wrap-bar-right">
        <div class="home-wrap-bar-right-btn cz" v-login="() => $router.push({ name: 'centerDeposit' })">
          <span>{{ $t('充值') }}</span>
        </div>
        <div class="home-wrap-bar-right-btn tk" v-login="() => handleWithdraw()">
          <span>{{ $t('取款') }}</span>
        </div>
        <div class="home-wrap-bar-right-btn xm" v-login="() => $router.push({ name: 'centerRebate' })">
          <span>{{ $t('洗码') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import SvgIcon from '@/components/SvgIcon.vue';
import { useWithdraw } from '@/utils/hooks';

const global = inject('global');
const store = inject('store');
const subConfig = inject('subConfig');

const $router = useRouter();
const { user } = store.state;
const { handleWithdraw } = useWithdraw();
const domain = window.location.host;

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
  margin: 0 28px 25px;
  box-shadow: 0px -1px 10px 0px var(--amx-home-info-card-shadow-rgb, rgba(152, 166, 189, 0.5));
  background: var(--amx-home-info-card-bg, #0C161E);
  border-radius: 24px;

  &-member {
    height: 64px;
    border-radius: 6px 6px 0px 0px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    line-height: 64px;
    color: var(--amx-user-info-title-color, var(--font-color-fff));
    overflow: hidden;
    font-size: 24px;
    border-bottom: 1px solid var(--amx-home-info-card-border, #232C34);

    &-net {
      position: relative;
      background: none;
      color: var(--amx-user-info-card-net-color, var(--theme-color));
    }
  }

  &-info {
    display: flex;
    padding-bottom: 5px;
  }

  &-money {
    height: 80px;
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    padding: 25px 20px 15px;
    background-color: transparent !important;

    span {
      font-size: 28px;
      color: var(--amx-user-info-color, var(--theme-color));
      font-weight: 100;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      color: var(--amx-user-info-color, var(--font-color-fff)) !important;
      font-size: 26px;
      padding-left: 15px;

      .username {
        color: var(--font-color-fff);
        padding-bottom: 15px;
        display: flex;
        align-items: center;

        .vip {
          width: 82px;
          height: 28px;
          font-size: 14px;
          font-weight: 100;
          background-size: contain !important;
          margin-left: 15px;
        }
      }

      .balance {
        display: flex;
        align-items: center;
      }

      :deep(.money) {
        font-size: 26px;
        font-family: var(--font-family-helvetica);
        font-weight: 400;

        i,
        span {
          color: var(--amx-user-info-color, var(--font-color-fff)) !important;
        }
      }
    }

    .reg,
    .login {
      width: 144px;
      height: 66px;
      line-height: 60px;
      text-align: center;
      border-radius: 24px;
      font-size: 28px;
      background: url("@img/home/reg.png") no-repeat;
      background-size: cover;
      color: var(--amx-home-info-card-font-color, #333);

      &.login {
        background: url("@img/home/login.png") no-repeat;
        background-size: cover;
        margin-left: 20px;
      }
    }

  }

  &-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    margin-left: 30px;
    margin-right: 10px;
    max-width: 280px;

    &-btn {
      width: 100%;
      padding-top: 56px;
      margin-top: 15px;
      box-sizing: border-box;
      font-size: 24px;
      font-weight: 400;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;

      &:after {
        content: "";
        width: 56px;
        height: 56px;
        position: absolute;
        top: 0;
      }

      &.cz:after {
        background: url("@img/home/cz.png") no-repeat;
        background-size: contain;
      }

      &.tk:after {
        background: url("@img/home/tk.png") no-repeat;
        background-size: contain;
      }

      &.xm:after {
        background: url("@img/home/xm.png") no-repeat;
        background-size: contain;
      }

      span {
        color: var(--amx-user-info-color, var(--font-color-000));
      }

      .svg-icon-swap {
        width: 34px;
        min-height: 34px;
        fill: var(--theme-color);
        margin-right: 10px;
      }

      &:nth-child(1),
      &:nth-child(2) {
        border-right: none;
      }

      &:nth-child(1) {
        border-radius: 0 0 0 6px;
      }

      &:nth-child(3) {
        border-radius: 0 0 6px 0;
      }
    }
  }
}
</style>
