<template>
  <div class="outline-wrap">
    <div class="card-wrap">
      <ul class="card">
        <li v-for="(item, index) in allInfo" :key="index">
          <p class="number">{{ agentRelation?.[item.key] || 0 }}</p>
          <p class="card_text">{{ item.text }}</p>
        </li>
      </ul>
    </div>

    <van-tabs @click="onTabClick" :swipe-threshold="2">
      <van-tab :title="$t('今日活跃')">
        <Echarts v-if="chartTitle === $t('今日活跃')" :middleText="$t(chartTitle)" :targetDate="$t('今日')"></Echarts>
      </van-tab>
      <van-tab :title="$t('昨日活跃')">
        <Echarts v-if="chartTitle === $t('昨日活跃')" :middleText="$t(chartTitle)" :targetDate="$t('昨日')"></Echarts>
      </van-tab>
      <van-tab :title="$t('本月活跃')">
        <Echarts v-if="chartTitle == $t('本月活跃')" :middleText="$t(chartTitle)" :targetDate="$t('本月')"></Echarts>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import {
  defineProps, inject, ref, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { agentrelation } from '@/api/agent';
import { getMonth } from '@/utils';
import SectionWrap from '../components/SectionWrap.vue';
import Echarts from './components/MemberCharts.vue';

const global = inject('global');
const chartTitle = ref(global.$t('今日活跃'));
const params = {
  start_date: getMonth('s', 0),
  end_date: getMonth('e', 0),
};

const allInfo = ref([
  {
    key: 'members',
    text: global.$t('下级成员总计(人)'),
  },
  {
    key: 'new_members',
    text: global.$t('本月新增(人)'),
  },
  {
    key: 'active_members',
    text: global.$t('本月活跃成员(人)'),
  },
  {
    key: 'valid_members',
    text: global.$t('本月新增有效(人)'),
  },
]);

const props = defineProps({
  allInfo: {
    type: Array,
    default: () => [],
  },
});

const { data: agentRelation } = useRequest(() => agentrelation({ date_type: 'month' }));

function onTabClick(name, title) {
  chartTitle.value = title;
}
</script>

<style lang="less" scoped>
.outline-wrap {
  :deep(.van-tabs) {
    .van-tab {
      flex: 0;
      display: flex;
      align-items: center;
      width: 300px;
      padding: 0 15px;

      span {
        display: block;
        white-space: nowrap;
      }
    }

    .van-tabs__nav {
      background-color: transparent;
    }

    .van-tabs__wrap {
      border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    }

    .van-tab--active {
      color: var(--cur-font-color-fff, var(--dark-fff));
    }

    .van-tabs__line {
      width: 120px;
    }
  }

  .card-wrap {
    box-sizing: border-box;
    padding: 20px 30px 0;
  }

  .card {
    display: flex;
    background-color: var(--dark-bg-color-191919, var(--bg-color-f3f3f3));
    flex-wrap: wrap;
    align-items: center;
    padding: 0 0 54px;
    margin: 20px 0;
    border-radius: 8px;

    li {
      width: 50%;
      padding-left: 50px;
      padding-top: 54px;
      box-sizing: border-box;

      p {
        margin: 0;
      }

      .number {
        font-size: 32px;
        margin-bottom: 10px;
        line-height: 38px;
        font-weight: 700;
        color: var(--dark-fff, var(--font-color-2d2e2f));
      }

      .card_text {
        font-size: 24px;
        color: var(--font-color-999999);
      }
    }
  }
}
</style>
