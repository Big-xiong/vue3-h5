<template>
  <div id="member-chart"></div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
/* import * as echarts from 'echarts'; */
import { computed, defineProps, inject } from 'vue';
import dayjs from 'dayjs';
import { memberOverview } from '@/api/agent';
import { getDate, getMonth } from '@/utils';

const props = defineProps({
  targetDate: String,
});

let loadEcharts = null;
if (!import.meta.env.SSR) {
  loadEcharts = import.meta.glob('/src/utils/loadEcharts.js');
}

const global = inject('global');

let params = {};
switch (props.targetDate) {
  case global.$t('今日'):
    params = {
      start_date: getDate(0),
      end_date: getDate(0),
    };
    break;
  case global.$t('昨日'):
    params = {
      start_date: getDate(-1),
      end_date: getDate(-1),
    };
    break;
  case global.$t('本月'):
    params = {
      start_date: getMonth('s', 0),
      end_date: getMonth('e', 0),
    };
    break;
  default:
}

const store = inject('store');
const isDark = computed(() => store.state.app?.darkTheme === 'dark');
const getRootStyle = inject('getRootStyle');
let echarts = null;

async function drawCharts(echartData) {
  if (!loadEcharts) {
    return;
  }
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }

  // 初始化echarts实例
  const memberChart = echarts.init(document.getElementById('member-chart'));
  // 绘制图表
  memberChart.setOption({
    color: ['#24c29a', '#eb9261', '#578fff'],
    title: [
      {
        text: `${props.targetDate}\n${global.$t('活跃')}`,
        top: 'middle',
        left: '18.5%',
        textAlign: 'center',
        textStyle: {
          fontSize: 16,
          color: '#999999',
        },
      },
    ],
    tooltip: {
      backgroundColor: isDark.value ? '#191919' : getRootStyle('--tooltip-bg-color-ffffff', '#app'),
      textStyle: {
        color: isDark.value ? '#fff' : getRootStyle('--var-color-00000', '#app'),
      },
      trigger: 'item',
      formatter: `${props.targetDate}{b}: {c} ({d}%)`,
    },
    legend: {
      orient: 'vertical',
      left: '45%',
      top: 30,
      formatter(name) {
        // @todo 修正为可以使用html
        switch (name) {
          case global.$t('新增  '):
            return `{title|${props.targetDate}${global.$t('新增')}} {number|${echartData.new_members}}`;
          case global.$t('活跃  '):
            return `{title|${props.targetDate}${global.$t('活跃')}} {number|${echartData.active_members}}`;
          case global.$t('新增有效  '):
            return `{title|${props.targetDate}${global.$t('新增有效')}} {number|${echartData.total_deposit_count}}`;
          default:
        }
      },
      textStyle: {
        color: isDark.value ? '#fff' : getRootStyle('--font-color-999999', '#app'),
        rich: {
          title: {
            fontSize: 14,
            color: '#999',
          },
          number: {
            fontSize: 14,
            color: isDark.value ? '#fff' : getRootStyle('--font-color-2d2e2f', '#app'),
          },
        },
      },
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '85%'],
        center: ['20%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderWidth: 7, // 设置border的宽度有多大
          borderColor: isDark.value ? '#000' : getRootStyle('--pie-border-color-ffffff', '#app'),
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: echartData.new_members, name: global.$t('新增  ') },
          { value: echartData.active_members, name: global.$t('活跃  ') },
          {
            value: echartData.total_deposit_count,
            name: global.$t('新增有效  '),
          },
        ],
      },
    ],
  });
}

useRequest(() => memberOverview(params), {
  onSuccess(result) {
    drawCharts(result);
  },
});
</script>

<style lang="less" scoped>
#member-chart {
  width: 690px;
  height: 300px;
  margin: 20px auto 30px;
  padding: 0 30x;
}
</style>
