<template>
  <div class="date-range-wrap">
    <div class="date-select">
      <img :src="$getSrc('/src/assets/images/agent/calendar-gray.png')" alt />
      <span @click="showStartDate = true" class="select-item">
        {{ startText || $t('开始时间') }}
        <van-icon name="play" class="arrow" />
      </span>
      <van-icon name="minus"></van-icon>
      <span @click="showEndDate = true" class="select-item">
        {{ endText || $t('结束时间') }}
        <van-icon name="play" class="arrow" />
      </span>
    </div>

    <van-popup v-model:show="showStartDate" position="bottom" round>
      <van-datetime-picker
        v-model="startDate"
        @confirm="onStartDateConfirm"
        @cancel="showStartDate = false"
        :min-date="minDate"
        :max-date="maxDate"
        :type="type"
      />
    </van-popup>

    <van-popup v-model:show="showEndDate" position="bottom" round>
      <van-datetime-picker
        v-model="endDate"
        @confirm="onEndDateConfirm"
        @cancel="showEndDate = false"
        :min-date="minDate"
        :max-date="maxDate"
        :type="type"
      />
    </van-popup>
  </div>
</template>

<script setup>
import {
  inject, ref, watch, watchEffect,
} from 'vue';
import { dateFormat } from '@/utils';

const global = inject('global');

const props = defineProps({
  type: {
    type: String,
    default: 'year-month',
  },
  dateRange: {
    type: Object,
    default: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
  },
  minDate: {
    type: Date,
    default: new Date(2017, 0),
  },
  maxDate: {
    type: Date,
    default: new Date(),
  },
  cateDown: {
    type: Boolean,
    default: true,
  },
});

const startText = ref('');
const endText = ref('');
const showStartDate = ref(false);
const showEndDate = ref(false);
const startDate = ref();
const endDate = ref();

const emit = defineEmits(['change']);

watch(
  props,
  () => {
    startDate.value = new Date(props.dateRange.startDate);
    endDate.value = new Date(props.dateRange.endDate);
  },
  { deep: true, immediate: true },
);

function emitChange() {
  emit('change', {
    startDate: startDate.value,
    endDate: endDate.value,
    startText: startText.value,
    endText: endText.value,
  });
}

function onEndDateConfirm() {
  endText.value = dateFormat(
    props.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-mm',
    endDate.value,
  );
  showEndDate.value = false;
  emitChange();
}

function onStartDateConfirm() {
  startText.value = dateFormat(
    props.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-mm',
    startDate.value,
  );
  showStartDate.value = false;
  emitChange();
}
</script>

<style lang="less" scoped>
.date-range-wrap {
  display: flex;
  margin-top: 30px;

  img {
    width: 28px;
    height: 28px;
    padding-left: 28px;
  }

  .select-item {
    flex: 1;
    text-align: center;
  }

  .date-select {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88px;
    border-radius: 8px;
    border: 2px solid var(--dark-666, var(--border-color-cccccc));
    color: var(--font-color-999999);
    padding-right: 50px;
    font-size: 28px;

    .arrow {
      transform: rotate(90deg);
      color: var(--font-color-2d2e2f);
    }

    .date-select-separator {
      height: 2px;
      width: 20px;
      background-color: var(--bg-color-999);
    }
  }
}
</style>
