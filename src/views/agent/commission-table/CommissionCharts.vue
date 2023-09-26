<template>
  <div id="commission-chart" ref="chartDom" v-if="sheetData && sheetData?.list && sheetData?.list?.length"></div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
 inject, ref, watch, defineProps, nextTick,
} from 'vue';
import { commisionsheet } from '@/api/agent';

const global = inject('global');
let echarts = null;

const getRootStyle = inject('getRootStyle');
const chartDom = ref(null);

const props = defineProps({
  dateRange: {
    type: Object,
    default: () => ({}),
  },
});

const { run: getCommissionData, loading: isLoading, data: sheetData } = useRequest(
  () => commisionsheet({
    ...props.dateRange,
    LOADING: true,
  }),
  {
    onSuccess(result) {
      nextTick(() => {
        initDat(result.list?.reverse());
      });
    },
  },
);

watch(
  props.dateRange,
  () => {
    getCommissionData();
  },
  { deep: true },
);

function initDat(chartData) {
  const xAxis = [];
  const data = [];

  chartData.forEach((item) => {
    xAxis.push(item.month.replace(global.$t('年'), '-').replace(global.$t('月'), ''));
    // xAxis.push(item.date);
    // 修改字段
    data.push(Number(item.month_fee));
  });

  chartData?.length ? drawChart(xAxis, data) : null;
}
let loadEcharts = null;
if (!import.meta.env.SSR) {
  loadEcharts = import.meta.glob('/src/utils/loadEcharts.js');
}

const store = inject('store');

async function drawChart(xAxis, data) {
  if (!loadEcharts) {
    return;
  }
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }
  // 初始化echarts实例
  const myChart = echarts.init(chartDom.value);
  const { agent } = store.state;
  const symbol = agent?.userInfo?.currency?.symbol ?? '';

  // 绘制图表
  myChart.setOption({
    color: [getRootStyle('--theme-color', '#app')],
    grid: { top: '5%', left: '15%', bottom: '15%' },
    tooltip: {
      // formatter: `${global.$t('已派发佣金')} <br /> ${symbol} {c}`,
      formatter: (params) => `${symbol} ${Number(params.value).toFixed(2)}`,
      backgroundColor: getRootStyle('--theme-color', '#app'),
      borderRadius: 10,
      textStyle: {
        color: getRootStyle('--font-color-fff', '#app'),
      },
      padding: [0, 10],
      position: (point) => [point[0], 0],
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitLine: {
        show: true,
        lineStyle: {
          color: getRootStyle('--border-color-e7e7e7', '#app'),
        },
      },
      axisLine: {
        lineStyle: {
          color: getRootStyle('--border-color-e7e7e7', '#app'),
        },
      },
      axisLabel: {
        show: true,
        left: '10%',
        textStyle: {
          color: getRootStyle('--font-color-999999', '#app'),
          fontSize: 14,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      axisLine: {
        onZero: true,
        lineStyle: {
          color: getRootStyle('--border-color-e7e7e7', '#app'),
          width: 1,
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: getRootStyle('--font-color-999999', '#app'),
          fontSize: 14,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: getRootStyle('--border-color-cccccc', '#app'),
        },
      },
    },
    series: [
      {
        name: '',
        type: 'bar',
        data,
      },
    ],
  });
}
</script>

<style lang="less" scoped>
#commission-chart {
  width: 100%;
  height: 396px;
  margin-top: 30px;
}
</style>
