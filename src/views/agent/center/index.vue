<template>
  <div class="agent-my-center-wrap">
    <div class="my-info-wrap">
      <div class="member">
        <div class="avatar">
          <SvgIcon name="account" />
        </div>
        <div class="right">
          <div class="name">{{ userInfo.username }}</div>
          <div class="desc">
            {{ $t("这是您成为") }}{{ subConfig.title }}{{ $t("代理的第") }}{{
            day
            }}{{ $t("天") }}
          </div>
        </div>
      </div>

      <!-- :style="{'background-image': `url(${$getSrc('/src/assets/images/agent/agent-status-card.png')})`}" -->
      <div class="info-card">
        <!-- <SvgIcon name="agent-status-card" class="card-bg" /> -->
        <div class="flex">
          <div class="info-item">
            <SvgIcon name="agent-status-commission" />
            <div class="info-wrap">
              <span>{{ $t("我的佣金") }}</span>
              <span class="money" v-money="userInfo?.commission_money || '0.00'"></span>
            </div>
          </div>

          <div class="info-item">
            <SvgIcon name="agent-status-wallet" />
            <div class="info-wrap">
              <span>{{ $t("我的钱包") }}</span>
              <span class="money" v-money="userInfo?.money || '0.00'"></span>
            </div>
          </div>
        </div>
        <div class="buttonGroup">
          <van-button
            class="btn withdraw"
            @click="router.push({ name: 'agentCommissionWithdraw' })"
          >{{ $t("提款") }}</van-button>
          <van-button class="btn deposit" @click="deposit">
            {{
            $t("充值")
            }}
          </van-button>
          <van-button class="btn transfer" @click="transferIn">{{ $t("转入") }}</van-button>
        </div>
      </div>
    </div>

    <input-wrap />

    <van-button type="primary" @click="logout">{{ $t("退出登录") }}</van-button>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import {
  inject, onMounted, reactive, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import InputWrap from './InputWrap.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const store = inject('store');

store.dispatch('agent/getUserInfo');
const { agent } = store.state;
const subConfig = inject('subConfig');

const global = inject('global');
const userInfo = ref({});
const day = ref(0);
const router = useRouter();

const transferIn = () => global.$dialog({ tpl: 'AgentTransfer' });

watch(
  () => agent.userInfo,
  (info) => {
    userInfo.value = info;
    day.value = dayjs(new Date()).diff(info.created_at, 'days') + 1;
  },
  { immediate: true },
);

onMounted(() => {
  // Toast.loading({ duration: 0 });
});

function deposit() {
  if (agent.userInfo?.spread_switch === 2) {
    global.$router.push({ name: 'agentDeposit' });
  } else {
    // global.$dialog({ tpl: 'AgentTips', message: global.$t('充值请联系客服') });
    global.$dialog({ tpl: 'AgentWalletTips' });
  }
}

function logout() {
  store.dispatch('agent/logout');
  router.push({ name: 'agentLanding' });
  Toast.success(global.$t('退出成功'));
}
</script>

<style lang="less" scoped>
.agent-my-center-wrap {
  background-color: var(--dark-bg-color-191919);
  flex: 1;
  overflow-y: auto;

  .my-info-wrap {
    padding: 45px 30px;
  }

  .member {
    box-sizing: border-box;
    display: flex;

    .avatar .svg-icon-wrap {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-right: 26px;
      background-size: cover;
      background-position: center;
    }

    .right {
      flex: 1;
      color: var(--dark-fff, var(--font-color-222930));

      .name {
        height: 56px;
        font-size: 40px;
        font-weight: 500;
        line-height: 56px;
        margin-top: 10px;
      }

      .desc {
        margin-top: 10px;
        height: 34px;
        font-size: 24px;
        line-height: 34px;
      }
    }
  }
  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .info-card {
    width: 100%;
    height: 285px;
    background-size: 100% 100%;
    margin-top: 37.5px;
    color: var(--font-color-ffffff);
    position: relative;
    background-color: var(--bg-color-173253);
    position: relative;
    overflow: hidden;
    &::before {
      content: "";
      width: 285px;
      height: 285px;
      position: absolute;
      left: 0;
      top: 0;
      transform-origin: 0 0;
      transform: skew(-48deg);
      background-color: var(--bg-color-0c1d29);
    }
    &::after {
      content: "";
      width: 200px;
      height: 200px;
      position: absolute;
      left: 0;
      top: 0;
      transform-origin: 0 0;
      transform: skew(-48deg);
      background-color: var(--bg-color-12212d);
    }
    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 50px 30px 0;
      color: var(--font-color-fff7ec);
      font-size: 30px;
      position: relative;
      z-index: 2;

      .info-item {
        display: flex;
        min-width: 280px;
      }

      .info-wrap {
        display: flex;
        margin-left: 20px;
        flex-direction: column;

        span {
          font-size: 24px;
        }

        .money {
          font-size: 36px;
          font-weight: 700;
          white-space: nowrap;
          color: var(--cur-font-color-fff, var(--bg-color-f5f5f5));
          line-height: 60px;
        }
      }

      .svg-icon-wrap {
        width: 76px;
        height: 76px;
      }
    }

    .buttonGroup {
      width: 92%;
      margin: 30px auto;
      display: flex;

      .btn {
        width: 295px;
        height: 72px;
        background: var(--cur-font-color-fff, var(--bg-color-ffffff));
        white-space: nowrap;
        border: none;
        margin: 0 7.5px;
        color: var(--theme-color);
        font-size: 32.25px;
      }

      .empty {
        background: none;
        color: var(--font-color-ffecd1);
        border: 2px solid var(--bg-color-ffecd1);
        margin-left: 24px;
      }
    }

    .van-button {
      color: var(--font-color-956b3b);
      float: left;
    }
  }

  .van-button {
    width: 630px;
    height: 97.5px;
    border: none;
    border-radius: 10px;
    display: block;
    margin: 70px auto;
    font-size: 32px;
  }
}
</style>
