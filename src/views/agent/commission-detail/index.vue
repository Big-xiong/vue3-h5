<template>
  <div class="commission-detail-wrap">
    <p class="text-p">
      {{ $t('佣金状态') }}
      <span class="status-text">{{ status ? status[item.status] : '' }}</span>
    </p>
    <div class="desc">
      <div class="border">
        <div class="p1">
          <div class="t1">{{ $t('释放时间') }}</div>
          <div class="t2">{{ item.send_time }}</div>
        </div>
        <div class="p1">
          <div class="t1">{{ $t('活跃用户') }}</div>
          <div class="t2">{{ item.active_members || 0 }}{{ $t('人') }}</div>
        </div>
        <div class="p1">
          <div class="t1">{{ $t('总投注') }}</div>
          <div class="t2">{{ item.bet || 0.0 }}</div>
        </div>
        <div class="p1">
          <div class="t1" @click="showTips($t('下级玩家总参与游戏的有效投注额'))">
            {{ $t('总有效投注') }}
            <van-icon name="question-o" />
          </div>
          <div class="t2" v-money="item.valid_bet || 0.0"></div>
        </div>
        <div class="p1">
          <div class="t1" @click="showTips($t('下级玩家总有效投注所产生的派奖金额'))">
            {{ $t('总派奖金额') }}
            <van-icon name="question-o" />
          </div>
          <div class="t2" v-money="item.win || 0.0"></div>
        </div>
        <div class="p1">
          <div class="win">
            {{ $t('用户输赢小计') }}
            <div :class="{ danger: (item.bet - item.win) < 0 }" v-money="(item.bet - item.win).toFixed(2)" />
          </div>
        </div>
      </div>
      <div class="border">
        <div class="p1">
          <div class="t1">{{ $t('总红利') }}</div>
          <div class="t2" v-money="item.bonus"></div>
        </div>
        <div class="p1">
          <div class="t1" @click="
            showTips($t('三方游戏抽成费用+三方充值抽成费用+平台服务费等'))
          ">
            {{ $t('总平台费') }}
            <van-icon name="question-o" />
          </div>
          <div class="t2" v-money="item.platform_fee"></div>
        </div>
        <div class="p1">
          <div class="win">
            {{ $t('纯利小计') }}
            <div :class="{ danger: (profit) < 0 }" v-money="(profit).toFixed(1)" />
          </div>
        </div>
      </div>
      <div class="border">
        <div class="p1">
          <div class="t1">{{ $t('佣金比例') }}</div>
          <div class="t2">{{ item.rate * 100 }}%</div>
        </div>
        <div class="p1">
          <div class="t1">{{ $t('佣金补发') }}</div>
          <div class="t2" v-money="item.commission_replenish || 0"></div>
        </div>
        <div class="p1">
          <div class="t1">{{ $t('佣金扣减') }}</div>
          <div class="t2" v-money="item.commission_deducted || 0"></div>
        </div>
        <div class="p1">
          <div class="win">
            {{ $t('佣金') }}
            <span :class="{ danger: Number(item.commission) < 0 }" v-money="item.commission" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { useDicts } from '@/utils/hooks';
import { agentcommissionstatus } from '@/api/agent';

const global = inject('global');
const item = ref({});
const status = ref([]);

try {
  item.value = JSON.parse(sessionStorage.getItem('agent_commission_detail') || '{}');
} catch (e) {
}

const profit = computed(() => item.value.bet - item.value.win - item.value.bonus - item.value.platform_fee);

// const { data: status } = useRequest(agentcommissionstatus);

useDicts('agentcommissionstatus', (result) => {
  status.value = result;
}, { immediate: true });

function showTips(message) {
  global.$dialog({
    tpl: 'AgentTips',
    message,
  });
  // Dialog({
  //   title: global.$t('温馨提示'),
  //   message,
  //   width: 690,
  //   showConfirmButton: true,
  //   showCancelButton: false,
  // });
}

function priceFilter(price) {
  return Number(price) < 0 ? `<span class="price-text">-¥${price}</span>` : price;
}
</script>

<style scoped lang="less">
.commission-detail-wrap {
  font-size: 24px;
  box-sizing: border-box;
  padding: 30px;
  color: var(--dark-fff, var(--font-color-222930));
  flex: 1;
  overflow-y: auto;

  .price-text {
    color: var(--font-color-ff000b);
  }

  .status-text {
    color: var(--font-color-695338);
  }

  .text-p {
    font-size: 32px;
    display: flex;
    justify-content: space-between;
  }

  .van-icon-question-o {
    font-size: 24px;
  }

  .desc {
    margin: 0 auto;

    .p1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 30px 0;
      color: var(--dark-fff, var(--font-color-999999));

      .t1 {
        color: var(--cur-font-color-fff, var(--font-color-606060));
        display: flex;
        align-items: center;
        font-size: 24px;

        .van-icon {
          margin-left: 7.5px;
          color: var(--theme-color);
        }
      }

      .t2 {
        color: var(--cur-font-color-fff);
        text-align: right;
        font-size: 28px;
      }

      .win {
        color: var(--dark-fff, var(--font-color-2d2e2f));
      }

      .win,
      .num {
        width: 100%;
        font-size: 32.25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: normal;

        div,
        span {
          font-size: 40px;
          color: var(--theme-color);
        }
      }
    }
  }

  .border {
    border-bottom: 2px solid var(--dark-333, var(--border-color-e7e7e7));

    .t1,
    .t2 {
      font-size: 32px;
    }
  }
}
</style>
