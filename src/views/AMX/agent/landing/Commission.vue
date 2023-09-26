<template>
  <div class="agent-commission">
    <div class="title">
      <div class="top">{{ $t("佣金计划") }}</div>
    </div>
    <div class="commission-list">
      <table>
        <thead>
          <tr>
            <th>{{ $t("级别") }}</th>
            <th>{{ $t("公司本月盈利") }}</th>
            <th>{{ $t("活跃玩家数量最低要求") }}</th>
            <th>{{ $t("佣金百分之比") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, index) in commissionData" :key="index">
            <td>{{ list.lev }}</td>
            <td>{{ list.yl }}</td>
            <td>{{ list.hys }}</td>
            <td>{{ list.yjb }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tip">
      {{
        $t(
          "每月10号之前完成推广代理佣金结算，推广代理可在每月10号后，申请提取佣金。佣金将在三个工作日内自动转入取款账户。"
        )
      }}
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');

const commissionData = reactive([
  {
    lev: '1',
    yl: '1-50,000',
    hys: '3',
    yjb: '30.00%',
  },
  {
    lev: '2',
    yl: '50,001-200,000',
    hys: '10',
    yjb: '35.00%',
  },
  {
    lev: '3',
    yl: '200,001-600,000',
    hys: '30',
    yjb: '40.00%',
  },
  {
    lev: '4',
    yl: '600,001-1,000,000',
    hys: '60',
    yjb: '45.00%',
  },
  {
    lev: '5',
    yl: global.$t('1,000,001以上'),
    hys: '100',
    yjb: '50.00%',
  },
]);
</script>

<style scoped lang="less">
.agent-commission {
  .commission-list {
    padding: 30px;

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 24px;
      text-align: center;
      border-radius: 20px 20px 2px 2px;
      overflow: hidden;
      // background-color: var(--user-bg-color-191919);
      line-height: 70px;

      td,
      th {
        border: 1px solid var(--border-color-ececec);
      }

      th {
        color: var(--font-color-fff);
        background-color: var(--theme-color);
        border: none;
        font-weight: normal;
        line-height: 36px;
        padding: 20px 0;
        &:nth-child(3) {
          width: 30%;
        }
      }

      td {
        padding: 15px 0;
        font-weight: bold;
        color: var(--font-color-cccccc);
      }
    }
  }

  .tip {
    font-size: 24px;
    color: var(--font-color-000);
    text-align: center;
    width: 690px;
    margin: 0 auto;
  }
}
</style>
