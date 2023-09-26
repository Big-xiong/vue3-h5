<template>
  <Popup
    v-model:show="isShow"
    close-icon-position="top-right"
    position="bottom"
    :title="$t('流水稽核')"
    @onClose="closePop"
    teleport="body"
  >
    <div class="pop-body list-cells">
      <div>
        <van-list :finished="finished" :finished-text="$t('没有更多了')" :immediate-check="false">
          <template v-if="!nodata">
            <table>
              <thead>
                <tr>
                  <th>{{ $t('时间') }}</th>
                  <th>{{ $t('存款/红利金额') }}</th>
                  <th>{{ $t('已达到流水') }}</th>
                  <th>{{ $t('需完成流水') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in recordList" :key="i">
                  <td>{{ item.created_at }}</td>
                  <td v-money="item.money" />
                  <td v-money="item.finish_flow_require" />
                  <td v-money="item.unfinish_flow_require" />
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <p style="text-align: center;">{{ $t('暂无数据') }}</p>
          </template>
        </van-list>
      </div>
    </div>
    <!-- <transfer
      :type="show"
      v-if="
          wallet && wallet.all_platform_money > 10 && wallet.is_auto_trans !== 1'
        "
    />-->

    <Transfer v-show="showTransfer" :isFlowType="true" v-model:isShow="isShow" />

    <div class="recharge-bottom" v-show="!showTransfer">
      <div class="btn-group">
        <van-button type="default" @click="closePop">{{ $t('暂不取款') }}</van-button>
        <van-button
          type="success"
          @click="() => {
            closePop();
            $router.push({ name: 'centerWithdraw' });
          }
          "
        >{{ $t('继续取款') }}</van-button>
      </div>
      <p class="tips">{{ $t('未达到流水强制提款将扣除一定行政费用！') }}</p>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, defineEmits, ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { rechargeflow } from '@/api/center';
import Popup from '@/components/Popup/index.vue';
import Transfer from '@/components/Transfer.vue';

const global = inject('global');
const store = inject('store');
const { user } = store.state;
const nodata = ref(false);
const isShow = ref(false);

setTimeout(() => {
  isShow.value = true;
}, 200);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const {
  run: flowRun,
  data: recordList,
  loading: recordLoading,
} = useRequest(rechargeflow, {
  manual: true,
  formatResult: (res) => res.data,
  onSuccess(res) {
    nodata.value = !res.length;
    const {
      done_flow,
      undone_flow,
    } = res;
    if (undone_flow > 0) {
      const { $t } = global;
      global.$dialog({
        tpl: 'AgentTips',
        message: `${$t('当前已经完成')}${done_flow}${$t('有效投注')},${$t('还差')}${undone_flow}${$t('提款')}`,
      });
    }
  },
});
const showTransfer = computed(() => {
  if (user?.walletInfo?.all_platform_money > 10 && user?.walletInfo?.is_auto_trans !== 1) {
    return true;
  }
  return false;
});

const emit = defineEmits(['update:show']);

watch(() => isShow.value, (val) => {
  if (val && user.isLogin) {
    flowRun();
  }
});

function closePop() {
  emit('update:show', false);
  isShow.value = false;
}

// onMounted(() => {
//   if (user.isLogin) {
//     run();
//   }
// });

</script>

<style lang="less" scoped>
.list-cells {
  padding: 0 30px;
  max-height: 35vh;
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    border-radius: 8px;
    margin-bottom: 30px;

    th {
      color: var(--dark-fff, var(--font-color-333333));
      border-bottom: 2px solid var(--border-color-18703);
      font-size: 24px;
      line-height: 60px;
      padding: 20px 0;
      background-color: var(--dark-333, var(--bg-color-e8e8e8));
    }

    td {
      font-size: 24px;
      color: var(--dark-fff, var(--font-color-000-6));
      border-bottom: 2px solid var(--border-color-18703);
      text-align: center;
      padding: 20px 0;
      white-space: normal;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
  }
}

.recharge-bottom {
  margin-top: -2px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 30px;

  .btn-group {
    width: 100%;
    display: flex;

    button {
      width: 48%;
      display: block;
      margin-top: 30px;
    }

    .van-button--success {
      color: var(--font-color-ffffff);
    }

    .van-button--default {
      border: 2px solid var(--border-color-666);
      color: var(--font-color-999999);
    }
  }

  :deep(.van-button--success) {
    background-color: var(--bg-color-24c29a);
    margin-left: 30px;
    border: none;
    margin-left: 4%;
  }

  :deep(.van-button--default) {
    color: var(--font-color-bbbbbb);
    border: 2px solid var(--font-color-bbbbbb);
  }

  .tips {
    margin: 40px 0;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-000-6));
  }
}
</style>
