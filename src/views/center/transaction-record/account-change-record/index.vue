<template>
  <div class="accountChangeRecord-wrap">
    <div class="layout-flex-center record-tab-top">
      <div>
        <p v-money="walletInfo?.profit_money ?? '0.00'"></p>
        <p>{{ $t('总盈亏') }}</p>
      </div>
      <div>
        <p v-money="walletInfo?.recharge_money ?? '0.00'"></p>
        <p>{{ $t('总存款') }}</p>
      </div>
      <div>
        <p v-money="walletInfo?.withdraw_money ?? '0.00'"></p>
        <p>{{ $t('总取款') }}</p>
      </div>
    </div>
    <ListItem
      :loading="loading"
      :finished="date.finished"
      :noData="date.noData"
      @onLoad="onLoad"
      :record-list="date.recordList"
    >
      <template #header="{ item }">
        <div>
          <span
            class="type"
          >{{ item.type ? statusArr?.find((child) => child.id === item.type)?.name + ' ' ?? ' ' : ' ' }}</span>
          <span class="money" v-money="item.money"></span>
        </div>
      </template>
      <template #money="{ item }">
        <span v-money="item.after_money"></span>
      </template>
      <template #status-left="{ item }">
        <span>{{ item.created_at }}</span>
      </template>
      <template #status-right="{ item }">
        <span v-money="item.before_money"></span>
      </template>
    </ListItem>

    <teleport :to="$store.state.app.teleportContainer">
      <FilterPopup
        :isShow="isShow"
        :hasStatus="hasStatus"
        type="date"
        @confirm="startFilter"
        @close="closePop"
      >
        <template #input>
          <div class="select">
            <p class="title">{{ $t('选择状态') }}</p>
            <div class="day-list">
              <div
                class="day-item"
                :class="{ active: val.id === date.chooseStatus }"
                v-for="(val, index) in statusArr"
                :key="index"
              >
                <div class="day" @click="date.chooseStatus = val.id">{{ val.name }}</div>
              </div>
            </div>
          </div>
          <div class="select" v-show="currency.length && subConfig.isCurrency">
            <p class="title">{{ $t('选择货币') }}</p>
            <div class="form-wrap">
              <Form ref="FormRef" :columns="columns" />
            </div>
          </div>
        </template>
      </FilterPopup>
    </teleport>
  </div>
</template>

<script setup>
import {
  inject, reactive, defineProps, defineEmits, watch, ref, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRegion } from '@/utils/hooks.js';
import {
  walletrecordtype, walletrecord, walletrecordinfo,
} from '@/api/center';
import FilterPopup from '@/components/Popup/FilterPopup.vue';
import Form from '@/components/Form/index.vue';
import { dateRange } from '@/utils/index';
import ListItem from '../components/ListItem.vue';

const global = inject('global');
const date = reactive({
  noData: false,
  startTime: '',
  endTime: '',
  current: 1,
  chooseStatus: 0,
  recordList: [],
  total: 0,
  stat: {},
  finished: false,
  statusArr: [],
  last_page: 1,

});
const isShow = ref(false);
const props = defineProps({
  isFilter: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: Array,
    default: () => [],
  },
});

const subConfig = inject('subConfig');

const FormRef = ref({});
const columns = reactive([]);
if (subConfig.isCurrency) {
  columns.push({
    type: 'picker',
    prop: 'inte_currency_id',
    rightIcon: 'arrow-down',
    placeholder: global.$t('请选择货币'),
    defaultValue: '',
    list: [],
  });
  watch(() => props.currency, () => {
    columns[0].list = props.currency;
    columns[0].defaultValue = props.currency?.[0].value;
  });
}

const { data: statusArr } = useRequest(walletrecordtype, {
  formatResult: (data) => {
    const arr = [];
    Object.keys(data).forEach((item) => {
      arr.push({
        id: item * 1,
        name: data[item],
      });
    });
    return [...[{ id: 0, name: global.$t('所有类型') }], ...arr];
  },
});
const { data: walletInfo } = useRequest(walletrecordinfo);

const { run: recordRun, loading } = useRequest(
  () => walletrecord({
    LOADING: true,
    page: date.current,
    type: date.chooseStatus || '',
    start_time: date.startTime || '',
    data_type: 2,
    end_time: date.endTime || '',
    ...FormRef.value.data,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.recordList = params?.length && params[0] ? date.recordList.concat(res.data) : res.data;
      date.total = res.total;
      date.stat = res.stat;
      date.noData = !date.recordList.length;
      date.last_page = res.last_page;
      if (date.current >= res.last_page) {
        date.finished = true;
      }
    },
  },
);

watch(props, () => {
  isShow.value = props.isFilter;
});

function onLoad() {
  if (date.current < date.last_page) {
    date.current += 1;
    recordRun(true);
  }
}
const emit = defineEmits(['close']);
function closePop() {
  isShow.value = false;
  emit('close', false);
}
function startFilter(filterData) {
  date.endTime = filterData.end_date;
  date.startTime = filterData.start_date;
  closePop();
  date.current = 1;
  date.last_page = 1;
  date.finished = false;
  date.recordList = [];
  recordRun();
}
</script>

<style lang="less" scoped>
.select {
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
    border: 2px solid var(--border-color-cccccc);
    border-radius: 8px;
    margin-bottom: 20px;
    height: 88px;

    .van-icon {
      line-height: 0;
      color: var(--font-color-cccccc);
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
      color: var(--font-color-cccccc);
      border: 2px solid var(--border-color-666666);
    }

    i {
      display: inline-block;
      margin-left: 18px;
      width: 0;
      height: 0;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 16px solid var(--border-color-666);
    }
  }

  .day-list {
    display: flex;
    flex-wrap: wrap;

    .day-item {
      margin-top: 20px;
      margin-right: 30px;
      box-sizing: border-box;
      flex-grow: 0;
      width: auto;
      height: 80px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      border-radius: 8px;
      // border: 2px solid var(--border-color-cccccc);
      font-size: 28px;
      font-weight: 400;
      width: 210px;
      color: var(--font-color-999999);
      text-align: center;
      padding: 0;
      &:nth-child(3n) {
        margin-right: 0px;
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

  .form-wrap {
    :deep(.van-form) {
      display: flex;
      .van-cell {
        padding-left: 0;
        padding-right: 0;
      }
      .van-cell__title {
        display: none;
      }
      .van-field__body {
        padding: 0 20px;
      }
    }
  }
}

.money {
  margin-left: 15px;
  font-weight: 600;
  color: var(--theme-color);
  font-size: 32px;
}

.type {
  color: var(--cur-font-color-fff);
}
</style>
