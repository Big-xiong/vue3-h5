<template>
  <div class="user-state-wrap">
    <div id="user-stat-chart"></div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import * as echarts from 'echarts';

const getRootStyle = inject('getRootStyle');
const chartOption = {
  color: getRootStyle('--theme-color', '#app'),
  legend: {
    show: false,
    textStyle: {
      color: getRootStyle('--font-color-ccc', '#app'),
    },
  },
  series: [
    {
      data: [5, 20, 15, 25, 5],
      type: 'line',
      smooth: true,
    },
  ],
  tooltip: {
    show: false,
  },
  yAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-353435', '#app'),
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-353435', '#app'),
      },
    },
    axisLabel: {
      // show: false,
      formatter: () => '',
      showMaxLabel: true,
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--font-color-666', '#app'),
    },
  },
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],
    axisLine: {
      lineStyle: {
        color: getRootStyle('--border-color-353435', '#app'),
      },
    },
    splitLine: {
      lineStyle: {
        color: getRootStyle('--border-color-353435', '#app'),
      },
    },
    z: 10,
    axisLabel: {
      formatter: (value) => value.slice(-5),
      showMaxLabel: true,
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--font-color-ccc', '#app'),
    },
  },
};

let myChart = null;

onMounted(() => {
  myChart = echarts.init(document.body.querySelector('#user-stat-chart'));
  myChart.setOption(chartOption);
});
</script>

<style scoped>
.user-state-wrap {
  width: 100%;
  height: 180px;
}

#user-stat-chart {
  margin: -40px auto 0;
  width: 280px;
  height: 260px;
}
</style>
