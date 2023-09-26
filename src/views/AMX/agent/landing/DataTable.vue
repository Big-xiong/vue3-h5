<template>
  <div class="agent-data-list">
    <div class="data-content">
      <div class="title">
        <div class="top">{{ $t("详细数据分析报表") }}</div>
        <div class="down">{{ $t("盈利数据、大数据报表等给合伙人精确分析盈利数据") }}</div>
      </div>
      <div class="table-content">
        <div class="list">
          <div class="list-inner">
            <p class="name">{{ $t("会员统计") }}</p>
            <p class="subtitle">{{ $t("注册会员和有效会员随时查看") }}</p>
            <div class="svg-wrap">
              <img
                :src="$getSrc(`/src/current_project/assets/images/agent/home/account_total.png`)"
                alt
              />
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list-inner">
            <p class="name">{{ $t("会员盈利数据") }}</p>
            <p class="subtitle">{{ $t("会员盈利情况一目了然") }}</p>
            <div class="svg-wrap">
              <img
                :src="$getSrc(`/src/current_project/assets/images/agent/home/account_profit.png`)"
                alt
              />
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list-inner">
            <p class="name">{{ $t("会员报表") }}</p>
            <p class="subtitle">{{ $t("会员动态一清二楚") }}</p>
            <div class="svg-wrap">
              <img
                :src="$getSrc(`/src/current_project/assets/images/agent/home/account_report.png`)"
                alt
              />
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list-inner">
            <p class="name">{{ $t("代理提现便捷") }}</p>
            <p class="subtitle">{{ $t("代理每月提现方便快捷") }}</p>
            <div class="svg-wrap">
              <img
                :src="$getSrc(`/src/current_project/assets/images/agent/home/account_withdraw.png`)"
                alt
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Vivus from 'vivus';
import { onMounted, onUpdated, ref } from 'vue';
import UserStat from './components/UserStat.vue';
import UserProfit from './components/UserProfit.vue';
import UserReport from './components/UserReport.vue';

</script>

<style scoped lang="less">
.agent-data-list {
  width: 100%;

  .table-content {
    display: flex;
    justify-content: space-between;
    margin-top: 54px;
    flex-wrap: wrap;
    padding: 0 15px;

    .list {
      display: inline-block;
      width: 50%;
      padding: 15px;
      box-sizing: border-box;
      font-size: 24px;

      p {
        margin: 0;
      }

      .svg-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        img {
          width: 100%;
        }
      }

      .list-inner {
        box-sizing: border-box;
        background: var(--bg-color-1d395d);
        display: flex;
        flex-direction: column;
        height: 432px;
        padding: 15px;
        border-radius: 8px;
      }

      .name {
        font-size: 28px;
        color: var(--font-color-ffffff);
        text-align: center;
        margin: 0;
      }

      .subtitle {
        text-align: center;
        color: var(--font-color-cccccc);
      }

      .chart {
        text-align: center;
      }
    }
  }
}

.agent-icon {
  width: 126px;
  display: block;
  margin: 49px auto 0;
}
</style>
