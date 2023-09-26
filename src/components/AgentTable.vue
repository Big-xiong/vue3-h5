<template>
    <table class="agent-table" border="0">
      <tr class="bordered">
        <th>{{$t("代理账号")}}</th>
        <th>{{$t("注册时间")}}</th>
        <th>{{$t("总注册人数")}}</th>
        <th>{{$t("总存款人数")}}</th>
        <th>{{$t("总存款")}}</th>
        <th>{{$t("总取款")}}</th>
        <th>{{$t("总投注")}}</th>
        <th>{{$t("总盈亏")}}</th>
        <th>{{$t("佣金比例")}}</th>
        <th>{{$t("操作")}}</th>
      </tr>
      <tr class="list-item" v-for="(item, i) in dataList" :key="i">
        <td>{{item.username}}</td>
        <td>{{item.created_at || 0}}</td>
        <td>{{item.member_counts || 0}}</td>
        <td>{{item.deposit_money_member_counts || 0}}</td>
        <td>{{item.deposit_money || 0}}</td>
        <td>{{item.draw_money || 0}}</td>
        <td>{{item.total_bet || 0}}</td>
        <td>{{item.win || 0}}</td>
        <td>{{item.rate || 0}}</td>
        <td @click="openAdjustPopup(item)">
          <div class="commission-adjust">{{$t("佣金调整")}}</div>
        </td>
      </tr>
    </table>
</template>

<script setup>
import { defineProps, ref, inject } from 'vue';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => [],
  },
});

const global = inject('global');
const detailData = ref({});
const AdjustPopup = (params) => global.$dialog({ tpl: 'AgentAdjustRate', ...params });

function openAdjustPopup(data) {
  detailData.value = data;
  AdjustPopup({
    detailData: data,
  });
}
</script>

<style lang="less" scoped>
th {
  font-weight: normal;
  color: var(--theme-color);
}

td {
  color: var(--font-color-222930);
  background: var(--bg-color-f5f5f5);
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
  &:first-of-type {
    padding-left: 30px;
  }
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
