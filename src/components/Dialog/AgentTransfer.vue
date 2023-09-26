
<template>
    <Dialog :title="$t('代理钱包充值')" v-model:show="isShow" @confirm="submit" centerConfirmBtn confirmBlock closeIcon @clickCloseIcon="isShow = false" :confirm-btn-text="$t('确认')">
      <div class="agent-transfer-wrap">
        <div class="transfer-body">
          <div class="money">{{$t('可用余额')}}：<span v-money="agent.userInfo.commission_money || 0"></span>
          </div>
          <div class="input-wrap">
            <label>{{$t('内充金额')}}</label>
            <input type="number" v-model="money" :placeholder="$t('请输入金额')" class="input"/>
          </div>
          <div class="btn-wrap">
            <div class="line" :class="{ active: active === 1 }" @click="gotoDeposit">{{$t('在线充值')}}</div>
            <div class="line" :class="{ active: active === 2 }" @click="active = 2">{{$t('佣金钱包转移')}}</div>
          </div>
        </div>
      </div>
    </Dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { Toast } from 'vant';
import { commissiontrans } from '@/api/agent';
import Dialog from './index.vue';

const active = ref(2);
const isShow = ref(true);

const store = inject('store');
const { agent } = store.state;
const money = ref('');

const global = inject('global');

const { run: doTransfer, loading: transferLoading } = useRequest(() => commissiontrans({ money: money.value }), {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('转入成功'));
    store.dispatch('agent/getUserInfo');
    isShow.value = false;
  },
});

function gotoDeposit() {
  if (agent.userInfo.deposit_switch === 2) {
    isShow.value = false;
    global.$router.push({ name: 'agentDeposit' });
  } else {
    global.$dialog({ tpl: 'AgentWalletTips' });
  }
}

function submit() {
  if (!money.value) {
    Toast.fail(global.$t('请输入内充金额'));
    return;
  }
  doTransfer();
}
</script>

<style lang="less" scoped>
.agent-transfer-wrap {
  border-radius: 15px;
  position: relative;
  box-sizing: border-box;
  padding: 32px 40px 60px;
  .title {
    color: var(--dark-fff, var(--font-color-f5f5f5));
    font-size: 36px;
    text-align: center;
    border-bottom: 2px solid var(--border-color-343434);
    padding: 37.5px 0;
  }

  .transfer-body {
    margin: 22.5px auto 0;
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-222930));

    .money {
      text-align: left;
      margin: 22.5px 0 22.5px 0;
      span {
        font-weight: 700;
      }
    }
  }

  .input-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;

    label {
      white-space: nowrap;
    }

    input {
      width: 440px;
      height: 80px;
      border: 2px solid var(--dark-333, var(--border-color-e7e7e7));
      border-radius: 8px;
      padding-left: 30px;
      box-sizing: border-box;
      background-color: var(--dark-transparent);
    }

    input::placeholder {
      color: var(--font-color-999999);
    }
  }

  .btn-wrap {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .line {
      border: 2px solid var(--dark-333, var(--border-color-e7e7e7));
      color: var(--font-color-666666);
      font-size: 28px;
      height: 80px;
      width: 280px;
      display: flex;
      border-radius: 5px;
      text-align: center;
      align-items: center;
      justify-content: center;
    }

    .active {
      border: 2px solid var(--theme-color);
      color: var(--theme-color);
    }
  }
}
</style>
