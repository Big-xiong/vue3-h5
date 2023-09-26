<template>
  <Dialog
    class="everyDayPopup"
    v-model:show="isShow"
    close-icon-position="top-right"
    position="center"
    @onClose="closePop"
    :show-confirm-button="false"
    :show-cancel-button="false"
    :title="false"
    closeIcon
  >
    <div class="gift">
      <img
        :src="$getSrc('/src/assets/images/daliy-duty/everyday-gift@2x.png', '/src/current_peoject/assets/images/daliy-duty/everyday-gift@2x.png',)"
      />
    </div>
    <div class="layout-flex-center item" v-for="(item, index) in everylist" :key="index">
      <div class="info">
        <p class="name">{{ $t(item.name) }}</p>
        <p
          v-if="item.name === '每日签到'"
        >{{ $t('每日存款') }}{{ item.recharge_amount }}{{ $t('元') }}{{ item.required_flow }}{{ $t('倍流水奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
        <p
          v-if="item.name === '任意投注'"
        >{{ $t('每日参与任意投注') }}{{ item.daily_bet_amount }}{{ $t('次，奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
        <p
          v-if="item.name === '累计投注金额' || item.name === '累计充值'"
        >{{ item.name }}{{ $t('到达') }}{{ item.cumulative_bet_amount || item.daily_cumulative_recharge }}{{ $t('元') }}{{ $t('奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
        <p
          v-if="item.name === '完成全部任务'"
        >{{ $t('完成每日任务，奖励') }}{{ item.reward_amount.min }}-{{ item.reward_amount.max }}{{ $t('元') }}</p>
      </div>
      <van-button
        type="primary"
        :disabled="item.status === 2"
        :class="{ 'un-finished': item.status === 0 }"
        class="btn"
        @click="dutyAction(item, index)"
      >{{ item.status === 1 ? '领取' : (item.msg || '已领取') }}</van-button>
    </div>
  </Dialog>

  <PhoneAreaPopup v-model:show="areaShow" @confirm="onAreaConfirm($event)" />
</template>

<script setup>
import {
  inject, defineEmits, ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Dialog from './index.vue';
import { dailytasks, getreward } from '@/api/home';

const global = inject('global');
const store = inject('store');
const { user } = store.state;
const isShow = ref(false);
const text = ref('');
const money = ref('');

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show']);
const { run: listRun, data: everylist, loading: listLoading } = useRequest(dailytasks, {
  manual: false,
  onSuccess() {
    setTimeout(() => {
      isShow.value = true;
    }, 200);
  },
});

const { run: drawRun } = useRequest(getreward, {
  manual: true,
  onSuccess(res, params) {
    text.value = `恭喜您获得“${everylist.value[params[0].step - 1].name}”红包`;
    global.$dialog({
      tpl: 'RewardDialog',
      text: text.value,
      money: res.money,
    });
    listRun();
  },
});

function closePop() {
  emit('update:show', false);
  isShow.value = false;
}

function dutyAction(item, index) {
  const { msg, status } = item;
  if (status === 0) {
    if (msg.indexOf(global.$t('充值')) !== -1) {
      global.$router.push({ name: 'centerDeposit' });
    } else if (msg.indexOf(global.$t('游戏')) !== -1) {
      global.$router.push('/');
    }
    closePop();
  } else if (status === 1) {
    drawRun({ step: index + 1 });
  }
}
</script>

<style lang="less">
.van-popup.everyDayPopup {
  display: flex;
  flex-direction: column;
  background: var(--bg-everyday);
  overflow: visible;
  top: 52%;
  .gift {
    width: 488px;
    height: 200px;
    position: relative;
    margin: 0 auto;
    margin-bottom: 30px;
    img {
      width: 100%;
      height: 274px;
      position: absolute;
      left: 0;
      bottom: 0;
      // transform: translateX(-50%);
    }
  }
  .item {
    background-color: var(--daliy-item-bg-color);
    border-radius: 2px;
    margin: 0 30px 20px 30px;
    padding: 10px 20px;

    .info {
      flex: 1;
    }

    p {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      color: var(--daliy-p-font-color);

      &.name {
        font-size: 28px;
        color: var(--bg-color);
        margin-bottom: 4px;
      }
    }

    .van-button {
      color: var(--font-color-fff);
      border-radius: 6px;
      border: 0;
      width: 160px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      &.un-finished {
        background-color: var(--theme-color);
      }
    }
  }
}
</style>
