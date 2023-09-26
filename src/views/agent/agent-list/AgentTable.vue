<template>
  <table class="agent-table" border="0">
    <tr class="bordered">
      <th>{{ $t('代理账号') }}</th>
      <th v-if="subConfig.isCurrency">{{ $t('地区') }}</th>
      <th v-if="subConfig.isCurrency">{{ $t('货币') }}</th>
      <th>{{ $t('注册时间') }}</th>
      <th>{{ $t('总注册人数') }}</th>
      <th>{{ $t('总存款人数') }}</th>
      <th>{{ $t('总存款') }}</th>
      <th>{{ $t('总取款') }}</th>
      <th>{{ $t('总投注') }}</th>
      <th>{{ $t('总盈亏') }}</th>
      <th>{{ $t('佣金比例') }}</th>
      <th>{{ $t('操作') }}</th>
    </tr>
    <tr class="list-item" v-for="(item, i) in dataList" :key="i">
      <td>{{ item.username }}</td>
      <td v-if="subConfig.isCurrency">{{ item.region?.name }}</td>
      <td v-if="subConfig.isCurrency">{{ item.currency?.name }}</td>
      <td>{{ item.created_at || 0 }}</td>
      <td>{{ item.member_counts || 0 }}</td>
      <td>{{ item.deposit_money_member_counts || 0 }}</td>
      <td v-money="(item.deposit_money && (item.deposit_money * 1).toFixed(2) ) || 0"></td>
      <td v-money="item.draw_money || 0"></td>
      <td v-money="item.total_bet || 0"></td>
      <td v-money="item.win || 0"></td>
      <td>{{ item.rate || 0 }}%</td>
      <td @click="openAdjustPopup(item)">
        <div class="commission-adjust">{{ $t('佣金调整') }}</div>
      </td>
    </tr>
  </table>
</template>

<script setup>
import { defineProps, ref, inject } from 'vue';

const subConfig = inject('subConfig');

const props = defineProps({
  dataList: {
    type: Array,
    default: () => [],
  },
});

const global = inject('global');
const detailData = ref({});
const emit = defineEmits(['update']);

const AdjustPopup = (params) => global.$dialog({
  tpl: 'AgentAdjustRate',
  ...params,
  onClose() {
    emit('update');
  },
});

function openAdjustPopup(data) {
  detailData.value = data;
  AdjustPopup({
    detailData: data,
  });
}
</script>

<style scoped lang="less">
td {
  color: var(--theme-color);
  background: var(--dark-transparent, var(--bg-color-f5f5f5));
  border-top: none !important;
  border-right: none !important;
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
  color: var(--cur-font-color-fff, vat(--dark-fff));

  &:first-of-type {
    padding-left: 30px;
  }
}

th {
  font-weight: normal;
  color: var(--theme-color);
}

table {
  border-collapse: collapse;
}

.commission-adjust {
  border: 2px solid var(--theme-color);
  border-radius: 8px;
  color: var(--theme-color);
  padding: 10px;
  margin: 0 15px;
}
</style>
