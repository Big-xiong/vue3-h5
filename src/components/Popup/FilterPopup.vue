<template>
  <div class="filter-wrap">
    <Popup
      :show="isShow"
      @close="emit('close')"
      @clickCloseIcon="emit('close')"
      :title="$t('筛选')"
      closeIconPosition="top-right"
      :teleport="myContainer"
    >
      <div class="list">
        <slot name="topInput" />
        <div class="select" v-if="hasTimeFilter">
          <p class="title">{{ $t('选择时间') }}</p>
          <div class="time-btn" v-if="isCalendar">
            <img :src="$getSrc('/src/assets/images/agent/calendar-gray.png')" alt />
            <div class="col-s" span="11.5" @click="showStartDate = true">
              {{ filterData.start_text || $t('开始时间') }}
              <!-- <van-icon name="play" class="tri"></van-icon> -->
              <img class="date-tri" :src="$getSrc('/src/assets/images/agent/date-tri.png')" alt />
            </div>
            <van-icon name="minus"></van-icon>
            <div class="col-e" span="11.5" @click="showEndDate = true">
              {{ filterData.end_text || $t('结束时间') }}
              <!-- <van-icon name="play" class="tri"></van-icon> -->
              <img class="date-tri" :src="$getSrc('/src/assets/images/agent/date-tri.png')" alt />
            </div>
          </div>
          <div class="time-btn" v-else>
            <!-- <img :src="$getSrc('/src/assets/images/agent/calendar.png')" alt /> -->
            <div class="col-s" span="11.5" @click="showStartDate = true">
              {{ filterData.start_text || $t('开始时间') }}
              <!-- <van-icon name="play" class="tri"></van-icon> -->
            </div>
            <span class="split" />
            <!-- <van-icon name="minus"></van-icon> -->
            <div class="col-e" span="11.5" @click="showEndDate = true">
              {{ filterData.end_text || $t('结束时间') }}
              <!-- <van-icon name="play" class="tri"></van-icon> -->
            </div>
          </div>
          <div class="day-list" v-if="type === 'date'">
            <div
              class="day-item"
              v-for="(i, index) in days"
              :key="index"
              :class="{ active: i.value == dayValue }"
              @click="onDay(i.value)"
            >{{ i.name }}</div>
          </div>
        </div>
        <slot name="input" />
      </div>

      <van-button type="primary" @click="onConfirm">{{ $t('确定') }}</van-button>
    </Popup>

    <popup v-model:show="showStartDate" position="bottom" :closeable="false">
      <van-datetime-picker
        v-model="start_time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmStartDate"
        @cancel="showStartDate = false"
        :type="type"
      />
    </popup>

    <!-- 结束时间 -->
    <popup v-model:show="showEndDate" position="bottom" :closeable="false">
      <van-datetime-picker
        v-model="end_time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmEndDate"
        @cancel="showEndDate = false"
        :type="type"
      />
    </popup>
  </div>
</template>

<script setup>
import {
  defineEmits, defineProps, inject, reactive, ref,
} from 'vue';
import dayjs from 'dayjs';
import Popup from './index.vue';

defineProps({
  isShow: Boolean,
  isCalendar: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'year-month',
  },
  myContainer: {
    type: String,
  },
  hasTimeFilter: {
    type: Boolean,
    default: true,
  },
});

const startDate = ref('');
const endDate = ref('');
const showStartDate = ref(false);
const showEndDate = ref(false);
const dayValue = ref('');

const end_time = ref(new Date());
const start_time = ref(new Date());
// const minDate = ref(new Date(2017, 0));
// const maxDate = ref(new Date());

const global = inject('global');

const filterData = ref({
  start_text: '',
  end_text: '',
  page: 1,
  size: 200,
  start_date: '',
  end_date: '',
});

const days = reactive([
  {
    name: global.$t('全部'),
    value: '',
  },
  {
    name: global.$t('一天'),
    value: '1',
  },
  {
    name: global.$t('三天'),
    value: '3',
  },
  {
    name: global.$t('十五天'),
    value: '15',
  },
  {
    name: global.$t('三十天'),
    value: '30',
  },
]);

function onConfirmEndDate(date) {
  filterData.value.end_date = dayjs(date).format('YYYY-MM-DD');
  filterData.value.end_text = dayjs(date).format('YYYY-MM-DD');
  showEndDate.value = false;
}
function onConfirmStartDate(date) {
  filterData.value.start_date = dayjs(date).format('YYYY-MM-DD');
  filterData.value.start_text = dayjs(date).format('YYYY-MM-DD');
  showStartDate.value = false;
}

const emit = defineEmits(['confirm', 'close']);

function onConfirm() {
  emit('confirm', filterData.value);
}

function onDay(value) {
  dayValue.value = value;
  if (value) {
    onConfirmStartDate(dayjs().subtract(value - 1, 'days'));
    onConfirmEndDate(new Date());
  } else {
    filterData.value = {
      start_text: '',
      end_text: '',
      start_date: '',
      end_date: '',
    };
  }
}
</script>

<style lang="less" scoped>
.filter-wrap {
  display: flex;
  flex-direction: column;

  :deep(.van-popup) {
    max-height: 80%;
    display: flex;
    flex-direction: column;
  }

  .list {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    height: calc(100% - 1600px);
    padding: 0 30px 30px 30px;
  }

  .van-button {
    width: 690px;
    margin: 0 auto 30px auto;
    height: 100px;
    flex-shrink: 0;
    display: block;
    font-size: 32px;
    border-radius: 8px;
  }

  :deep(.van-field__body) {
    border: solid 2px var(--dark-333, var(--border-color-cccccc));
    border-radius: 8px;
    height: 88px;
  }

  .line {
    width: 38px;
    height: 6px;
    opacity: 1;
    background: var(--bg-color-666666);
    margin-top: 45px;
  }
}

:deep(.select) {
  padding: 0 0 20px;
  font-size: 24px;

  .title {
    height: 44px;
    font-size: 32px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-333333));
    line-height: 44px;
    margin: 40px 20px 20px 0;
  }

  .time-btn {
    padding: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid var(--dark-666, var(--border-color-cccccc));
    border-radius: 8px;
    margin-bottom: 20px;
    height: 88px;

    .van-icon {
      line-height: 0;
      color: var(--dark-999, var(--font-color-cccccc));
    }

    img {
      width: 32px;
      height: 32px;
      margin-left: 28px;
    }

    .col-s,
    .col-e {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      width: 48%;
      font-weight: 400;
      flex-shrink: 1;
      border-radius: 6px;
      color: var(--dark-999, var(--font-color-cccccc));
      border: 2px solid var(--border-color-666666);
    }

    .date-tri {
      width: 22px;
      height: 12px;
    }

    .split {
      width: 38px;
      height: 6px;
      display: block;
      background-color: var(--bg-color-666666);
    }
  }

  .day-list {
    display: flex;
    flex-wrap: wrap;

    .day-item {
      margin-top: 20px;
      margin-right: 30px;
      box-sizing: border-box;
      height: 80px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      border-radius: 8px;
      border: 2px solid var(--dark-666, var(--border-color-cccccc));
      font-size: 28px;
      font-weight: 400;
      width: 210px;
      color: var(--font-color-999999);
      text-align: center;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(3) {
        margin-right: 0px;
      }
      .day {
        line-height: 30px;
      }
    }

    .active {
      border: none;
      background-color: var(--theme-color);
      padding: 0;
      font-weight: 600;
      color: var(--font-color-ffffff);
    }
  }

  .tri::before {
    transform: rotate(90deg);
  }
}
</style>
