<template>
  <div class="widthdrawRecord-wrap">
    <div class="layout-flex-center record-tab-top">
      <div>
        <p v-money="date.stat[4] ?? '0.00'"></p>
        <p>{{ $t('取款成功') }}</p>
      </div>
      <div>
        <p v-money="date.stat[1] ?? '0.00'"></p>
        <p>{{ $t('待审核') }}</p>
      </div>
      <div>
        <p v-money="date.stat[3] ?? '0.00'"></p>
        <p>{{ $t('取款失败') }}</p>
      </div>
    </div>

    <ListItem :loading="loading" :finished="date.finished" :noData="date.noData" @onLoad="onLoad" :record-list="date.recordList"
      show-remark>
      <template #default>
        <SvgIcon class="withdraw-icon" name="withdraw" />
      </template>
      <template #header="{ item }">
        <span v-if="item.currency_type === 1">{{ $t('银行卡 ') }} {{ intercept(item.bank_card_no) }}</span>
        <span v-else>{{ $t('数字货币 ') }} {{ intercept(item.user_dig_wallet.address) }}</span>
      </template>
      <template #money="{ item }">
        <span v-if="item.currency_type === 1">
          -
          <i v-money="item.money" />
        </span>
        <span v-else>
          - {{ Number(item.expect_dig_number)?.toFixed(2) }} =
          <i v-money="item.money" />
        </span>
      </template>
      <template #status-left="{ item }">
        <span>{{ filterLevel(item.created_at) }} | {{ item.trade_no }}</span>
      </template>
      <template #status-right="{ item }">
        <span :class="[
          { green: item.status == 2 || item.status == 4 },
          { yellow: item.status == 1 || item.status == 5 },
          { red: item.status == 3 }
        ]" v-if="status && status.length">{{ status[item.status].name || '' }}</span>
      </template>
    </ListItem>

    <teleport :to="$store.state.app.teleportContainer">
      <FilterPopup :isShow="isShow" :hasStatus="hasStatus" type="date" @confirm="startFilter" @close="closePop">
        <template #input>
          <div class="select">
            <p class="title">{{ $t('选择状态') }}</p>
            <div class="day-list">
              <!-- <div
                class="day-item"
                :class="{ active: 0 === date.chooseStatus }"
                @click="date.chooseStatus = 0"
              >
                <div class="day">{{ $t('全部') }}</div>
              </div>-->
              <div class="day-item" :class="{ active: key === date.chooseStatus }" v-for="(val, key, index) in status"
                :key="index">
                <!-- dicts.allwithdrawstatus -->
                <div class="day" @click="date.chooseStatus = key">{{ val.name }}</div>
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
  inject, reactive, defineProps, defineEmits, watch, ref, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { withdrawlist, historycurrency } from '@/api/center';
import FilterPopup from '@/components/Popup/FilterPopup.vue';
import { dateRange } from '@/utils/index';
import Form from '@/components/Form/index.vue';
import ListItem from '../components/ListItem.vue';
import SvgIcon from '@/components/SvgIcon.vue';

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
  inte_currency_id: '',
  last_page: 1,

});
const isShow = ref(false);
const props = defineProps({
  isFilter: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Array,
    default: () => [],
  },
  currency: {
    type: Array,
    default: () => [],
  },
});

const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', ['allorderstatus']);
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

const { run: recordRun, loading } = useRequest(
  () => withdrawlist({
    LOADING: true,
    page: date.current,
    status: date.chooseStatus || '',
    start_time: date.startTime || '',
    end_time: date.endTime || '',
    data_type: 2,
    inte_currency_id: date.inte_currency_id || '',
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

function filterLevel(val) {
  return val.substr(5, val.length - 8);
}

function filterTime(val) {
  return val.substr(11, val.length - 14);
}

function intercept(val) {
  return global.$t(`尾号`) + (val ? val.slice(-4) : '');
}

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
</style>
