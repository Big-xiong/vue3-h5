<template>
  <div class="commission-table-wrap">
    <header class="agent-subodinate-header">
      <van-image :src="$getSrc(`/src/assets/images/agent/sub-title.png`)" />
      <span>{{ $t('下级概览') }}</span>
    </header>
    <div class="commission-body">
      <CommissionOutline />
      <CommissionChart :dateRange="searchParams" />
      <DateRange :dateRange="dateRange" @change="handleDateChange($event)" :cateDown="false" type="date" />
      <CommissionList :params="searchParams" />
    </div>
  </div>
</template>

<script setup>
import {
  inject, computed, reactive, ref,
} from 'vue';
import DateRange from '@/components/DateRange.vue';
import Form from '@/components/Form/index.vue';
import { dateFormat, getMonth } from '@/utils';
import CommissionOutline from './CommissionOutline.vue';
import CommissionChart from './CommissionCharts.vue';
import CommissionList from './CommissionList.vue';

const global = inject('global');

const searchParams = reactive({
  page: 1,
  size: 200,
  start_date: dateFormat('YYYY-MM-DD', new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  end_date: dateFormat('YYYY-MM-DD', new Date()),
});

const dateRange = computed(() => ({
  startDate: searchParams.start_date,
  endDate: searchParams.end_date,
}));

function handleDateChange({ startDate, endDate }) {
  searchParams.start_date = dateFormat('YYYY-MM-DD', startDate);
  searchParams.end_date = dateFormat('YYYY-MM-DD', endDate);
}
</script>

<style lang="less" scoped>
.commission-table-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  .commission-body {
    box-sizing: border-box;
    padding: 15px 30px;
    height: 100%;
    overflow-y: auto;
    flex: 1;
  }
}
</style>
