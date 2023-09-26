<template>
  <div class="bonusRecord-wrap">
    <!-- <div class="tab-top">
        <p>{{ $t('已领取红利:') }}￥{{ date.stat[4] ?? '0.00' }}</p>
    </div>-->
    <div class="layout-flex-center record-tab-top">
      <div>
        <p v-money="date.stat[4] ?? '0.00'"></p>
        <p>{{ $t('领取成功') }}</p>
      </div>
      <div>
        <!-- <p v-money="date.stat[1] ?? '0.00'"></p> -->
        <!-- <p>{{ $t('待审核') }}</p> -->
      </div>
      <div>
        <!-- <p v-money="date.stat[3] ?? '0.00'"></p> -->
        <!-- <p>{{ $t('取款失败') }}</p> -->
      </div>
    </div>

    <ListItem
      :loading="loading"
      :finished="date.finished"
      :noData="date.noData"
      @onLoad="onLoad"
      :record-list="date.recordList"
      show-remark
    >
      <template #default>
        <!-- <img
          :src="$getSrc('/src/assets/images/icon/bonus.png')"
          class="withdraw-icon"
          alt
        />-->
        <SvgIcon name="hongli" class="withdraw-icon" />
      </template>
      <template #status-left="{ item }">
        <span>{{ item.created_at }}</span>
      </template>
      <template #status-right="{ item }">
        <span>{{ item.flow }}{{ $t('倍流水要求') }}</span>
      </template>
      <template #remark-note="{ item }">
        <span class="note">{{ item.username }}</span>
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
  inject, reactive, ref, watch, defineProps, defineEmits, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { benefitlist } from '@/api/center';
import FilterPopup from '@/components/Popup/FilterPopup.vue';
import { dateRange } from '@/utils/index';
import Form from '@/components/Form/index.vue';
import ListItem from '../components/ListItem.vue';
import SvgIcon from '@/components/SvgIcon.vue';

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

const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', ['allwithdrawstatus']);

// watch(() => dicts.allwithdrawstatus, () => {
//   if (dicts?.allwithdrawstatus) date.statusArr = [global.$t('所有状态'), ...Object.values(dicts?.allwithdrawstatus)];
// }, { immediate: true });

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
  () => benefitlist({
    LOADING: true,
    page: date.current,
    status: date.chooseStatus || '',
    start_time: date.startTime || '',
    end_time: date.endTime || '',
    data_type: 2,
    inte_currency_id: date.inte_currency_id || '',
    ...FormRef.value?.data,
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
  return global.$t('尾号');
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
</style>
