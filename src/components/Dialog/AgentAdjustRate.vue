<template>
  <div class="agent-adjust-rate-wrap">
    <Dialog
      v-model:show="isShow"
      :showCancelBtn="true"
      @onCancel="isShow = false"
      @onConfirm="handleConfirm"
      :title="$t('佣金调整')"
    >
      <div class="adjust-info">
        <div>
          {{ $t("当前佣金比例") }}：
          <span>{{ detailData.rate }}%</span>
        </div>
        <div>
          {{ $t("可分配佣金比例") }}：
          <span>{{ (Number(userInfo?.config?.commission?.rate) - detailData.rate) || 0 }}%</span>
        </div>
      </div>
      <div class="adjust-rate">
        <div>{{ $t("新佣金比例") }}:</div>
        <input
          class="ipt-a"
          v-model="rate"
          type="text"
          :placeholder="$t('请输入新佣金比例')"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { defineProps, inject, ref } from 'vue';
import { Toast } from 'vant';
import { update_commission } from '@/api/agent';
import Dialog from './index.vue';

const global = inject('global');

const isShow = ref(true);

const store = inject('store');
const { userInfo } = store.state.agent;
const rate = ref(null);

const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
  onClose: {
    type: Function,
    default: () => { },
  },
});

const { run: doAdjust, loading: adjustLoading } = useRequest(
  () => update_commission({
    rate: rate.value,
    agent_id: props.detailData.id,
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('调整成功'));
      props.onClose();
      isShow.value = false;
    },
  },
);

function handleConfirm() {
  if (!/^-?[1-9]\d*$/.test(rate.value)) {
    Toast.fail(global.$t('佣金比例仅支持整数'));
    return;
  }
  doAdjust();
}
</script>

<style lang="less" scoped>
.agent-adjust-rate-wrap {
  padding: 30px;
  box-sizing: border-box;
  input {
    flex: 1;
    background: none;
    padding-left: 30px;
    color: var(--dark-fff, var(--font-color-222930));
    height: 88px;
    font-size: 28px;
    font-weight: 400;
    line-height: 88px;
    border: 2px solid var(--dark-333, var(--border-color-e7e7e7));
    border-radius: 8px;
    width: 50%;
  }

  :deep(.van-dialog__confirm) {
    :deep(.van-button__text) {
      color: var(--font-color-fff);
    }
  }

  :deep(.van-dialog__cancel) {
    :deep(.van-button__text) {
      color: var(--font-color-fff);
    }
  }

  .adjust-info {
    display: flex;
    justify-content: space-between;
    margin: 37.5px 0 0;
    font-size: 30px;
    flex-wrap: wrap;
    div {
      white-space: nowrap;
    }
    span {
      color: var(--dark-fff, var(--font-color-333333));
    }
  }

  .input-wrap {
    border: 2px solid var(--font-color-ad9982) !important;
    border-radius: 8px;
    width: 50%;
    height: 75px !important;
    margin: 30px 0;
  }
}

.adjust-info,
.adjust-rate {
  padding: 0 40px;
  color: var(--dark-fff, var(--font-color-222930));
  div {
    color: var(--dark-fff, var(--font-color-222930));
  }
}

.adjust-rate {
  padding-bottom: 80px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  div {
    margin-top: 37.5px;
    margin-right: 30px;
  }
  input {
    margin-top: 37.5px;
    width: 300px !important;
    display: block;
    flex: 1;
    flex-shrink: 0;
  }
}
</style>
