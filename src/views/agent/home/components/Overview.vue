<template>
  <section-wrap :title="$t('数据概览')">
    <van-tabs v-model:active="activeKey">
      <van-tab :title="$t('今天')" name="today" />
      <van-tab :title="$t('昨天')" name="yesterday" />
      <van-tab :title="$t('本周')" name="week" />
      <van-tab :title="$t('本月')" name="month" />
    </van-tabs>

    <ul class="agent-statistics">
      <li v-for="(item, i) in overviewData" :key="i" @click="overviewTipsClick(item.tips)">
        <div class="amount" v-if="i > 2" :class="{ danger: i > 2 && Number(item.text) < 0 }">
          <span v-money="stateData[item.key]"></span>
          <!-- <span v-else>-</span> -->
        </div>
        <div class="amount" v-else>{{ stateData[item.key] ?? '-' }}</div>
        <div class="text">
          <span>{{ item.text }}</span>
          <van-icon name="question-o" v-show="item.tips" />
        </div>
      </li>
    </ul>
  </section-wrap>
</template>

<script setup>
import {
  reactive, inject, ref, watchEffect, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Dialog, Toast } from 'vant';
import { agentrelation } from '@/api/agent';
import SectionWrap from '../../components/SectionWrap.vue';

const global = inject('global');

const activeKey = ref('today');

function overviewTipsClick(tips) {
  if (tips) {
    global.$dialog({ tpl: 'AgentTips', message: tips });
  }
}

const timeSelected = ref('今天');

const stateData = ref({});

const { run: getData } = useRequest(() => agentrelation({ date_type: activeKey.value, LOADING: true }), {
  onSuccess(result) {
    stateData.value = result;
  },
});

watch(() => activeKey.value, () => {
  switch (activeKey.value) {
    case 'today': timeSelected.value = global.$t('今天'); break;
    case 'yesterday': timeSelected.value = global.$t('昨日'); break;
    case 'week': timeSelected.value = global.$t('本周'); break;
    case 'month': timeSelected.value = global.$t('本月'); break;
    default:
  }
  getData();
});

const overviewData = computed(() => [
  {
    text: global.$t('新增下级(人)'),
    key: 'new_members',
  },
  {
    text: global.$t('投注人数(人)'),
    key: 'bet_number_count',
  },
  {
    text: global.$t('首存人数(人)'),
    key: 'first_deposit_count',
  },
  {
    text: global.$t('总存款(元)'),
    key: 'total_deposit',
  },
  {
    text: global.$t(timeSelected.value) + global.$t('纯利(元)'),
    tips: global.$t(`为${timeSelected.value}下级总亏损金额减去红利等，为最后计算佣金的金额`),
    key: 'profit',
  },
  {
    text: global.$t(timeSelected.value) + global.$t('佣金(元)'),
    tips: global.$t(`为${timeSelected.value}未结算的佣金金额，需要等待结算日结算之后到佣金钱包才能进行提款<br />注：佣金为累计历史盈亏，如果上月盈利前月必须补齐之前的盈利部分才会有分红`),
    key: 'commission',
  },
]);
</script>

<style lang="less" scoped>
.agent-statistics {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
  box-sizing: border-box;
  padding: 0 30px;

  li {
    width: 32%;
    height: 112px;
    background: var(--dark-bg-color-191919, var(--bg-color-f3f3f3));
    box-sizing: border-box;
    border-radius: 4px;
    padding: 0 15px;
    margin-top: 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .amount {
    font-size: 32px;
    letter-spacing: 2px;
    height: 32px;
    color: var(--dark-fff, var(--font-color-2d2e2f));
  }

  .text {
    font-size: 26px;
    margin-top: 9px;
    color: var(--dark-fff, var(--font-color-999999));
    display: flex;
    align-items: center;
    line-height: 28px;
    .van-icon {
      margin-left: 6px;
      color: var(--theme-color);
    }
  }
}

:deep(.van-tabs__wrap) {
  margin-bottom: 28px;
  box-sizing: border-box;
  padding: 0 30px;
  border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
  .van-tab--active {
    color: var(--cur-font-color-fff, var(--dark-fff));
  }
  .van-tabs__nav {
    background-color: transparent;
  }
}
</style>
