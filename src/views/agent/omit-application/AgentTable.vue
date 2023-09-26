<template>
  <table class="agent-table" border="0">
    <tr class="bordered">
      <th>{{ $t('会员帐号') }}</th>
      <!-- <th>{{ $t('地区') }}</th>
      <th>{{ $t('货币') }}</th>-->
      <th>{{ $t('审核状态') }}</th>
      <th>{{ $t('备注') }}</th>
      <th>{{ $t('新增时间') }}</th>
      <th>{{ $t('审核时间') }}</th>
      <th>{{ $t('操作') }}</th>
    </tr>
    <tr class="list-item" v-for="(item, i) in dataList" :key="i">
      <td>{{ item.username }}</td>
      <!-- <td>{{ item.region_name }}</td>
      <td>{{ item.currency_name }}</td>-->
      <td>{{ omitStatus[item.audit_status] }}</td>
      <td>{{ item.remark }}</td>
      <td>{{ item.created_at ? item.created_at.substring(0, 10) : '' }}</td>
      <td>{{ item.audit_time ? item.audit_time.substring(0, 10) : '' }}</td>
      <td v-if="item.audit_status === 2">
        <div class="commission-adjust" @click="openApply(item)">{{ $t('申请') }}</div>
      </td>
      <td v-if="item.audit_status !== 2">
        <div class="commission-adjust" @click="handleDetail(item)">{{ $t('查看') }}</div>
      </td>
    </tr>
  </table>
  <van-empty
    v-if="requested && dataList.length === 0"
    :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
    :description="$t('暂无数据')"
  />
</template>

<script setup>
import {
  defineProps, ref, inject, defineEmits,
} from 'vue';
import { useDicts } from '@/utils/hooks';

const props = defineProps({
  requested: Boolean,
  dataList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits([
  'update',
]);

const omitStatus = ref({});

useDicts('auditstatuslist', (val) => {
  omitStatus.value = val;
}, { immediate: true });

const global = inject('global');

function handleDetail(data) {
  global.$popup({
    tpl: 'AgentOmitApply',
    isApplying: false,
    target: data,
  });
}

function openApply(data) {
  global.$popup({
    tpl: 'AgentOmitApply',
    isApplying: true,
    target: data,
    onClose() {
      emit('update');
    },
  });
}
</script>

<style lang="less" scoped>
th {
  font-weight: normal;
  color: var(--theme-color);
}

td {
  color: var(--dark-fff, var(--font-color-222930));
  background: var(--dark-transparent, var(--bg-color-f5f5f5));
  border-top: none !important;
  border-right: none !important;
  max-width: 152px;
  overflow: hidden;
  text-overflow: ellipsis;
}
td,
th {
  border-collapse: collapse;
  white-space: nowrap;
  text-align: center;
  font-size: 26px;
  vertical-align: middle;
  height: 90px;
  border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
  padding-right: 69px;

  &:first-of-type {
    padding-left: 30px;
  }
}

table {
  border-collapse: collapse;
}

.no-data-tip {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 28px;
  text-align: center;
  color: var(--font-color-525152);
  margin-top: 60px;
}

.commission-adjust {
  border: 2px solid var(--theme-color);
  border-radius: 8px;
  color: var(--theme-color);
  padding: 10px;
  margin: 0 15px;
}
</style>
