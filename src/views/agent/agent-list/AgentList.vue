<template>
  <div class="table-list-wrap">
    <AgentTable
      @update="emit('update')"
      :dataList="dataList"
    />
    <div
      v-if="dataList.length === 0"
      class="no-data"
    >
      <span>{{$t('暂无数据')}}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject, ref } from 'vue';
import AgentTable from './AgentTable.vue';

const prop = defineProps({
  dataList: {
    type: Array,
    default: () => [],
  },
});

const global = inject('global');
const emit = defineEmits(['update']);

</script>

<style lang="less" scoped>
.table-list-wrap {
  width: 100%;
  overflow-x: scroll;

  .no-data {
    margin-top: 60px;
    text-align: center;
    color: var(--font-color-fff-4, var(--font-color-525152));
  }
}
</style>
