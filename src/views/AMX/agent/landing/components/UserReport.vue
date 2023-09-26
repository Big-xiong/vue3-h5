<template>
  <div class="user-report-wrap">
    <div
      class="list"
      v-for="(item, index) in lists"
      :key="index"
    >
      <label>{{ item.label }}</label>
      <el-progress
        :percentage="item.value"
        :color="customColor"
        :stroke-width="5"
      />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const getRootStyle = inject('getRootStyle');
const customColor = getRootStyle('--theme-color', '#app');
const lists = [{
  label: 'A',
  value: 55,
}, {
  label: 'B',
  value: 45,
}, {
  label: 'C',
  value: 15,
}, {
  label: 'D',
  value: 60,
}, {
  label: 'E',
  value: 80,
}];
</script>

<style scoped lang="less">
.user-report-wrap {
  position: relative;
  width: 320px;
  height: 180px;
  margin: 0 auto;

  .list {
    margin-top: 20px;
    display: flex;

    label {
      color: var(--font-color-ccc);
      font-size: 14px;
      margin-right: 20px;
    }

    .el-progress {
      flex-grow: 1;
    }
  }

  :deep(.el-progress-bar__outer) {
    background-color: var(--bg-color-282828);
  }

  :deep(.el-progress__text) {
    color: var(--cur-font-color-ccc);
  }
}
</style>
