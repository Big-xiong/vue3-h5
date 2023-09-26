<template>
  <div class="transferRecord-wrap">
    <ListItem
      :loading="loading"
      :finished="date.finished"
      :recordList="date.recordList"
      :noData="date.noData"
      @onLoad="onLoad"
    >
      <!-- <img :src="$getSrc('/src/assets/images/icon/transfer.png')" class="withdraw-icon" alt /> -->
      <SvgIcon class="withdraw-icon" name="transfer-icon" />
      <template #header="{ item }">
        <span>
          {{ item.from_platform_id ? dicts?.allplatform[item.from_platform_id] : $t('中心钱包') }}
          <!-- <img
            class="icon-arrow-right"
            :src="$getSrc('/src/assets/images/icon/arrow-right.png')"
            alt
          />-->
          <SvgIcon class="svg-arrow-right" name="arrow-right" />
          {{ item.to_platform_id ? dicts?.allplatform[item.to_platform_id] : $t('中心钱包') }}
        </span>
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
  inject, reactive, watch, ref, defineProps, defineEmits,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { translog } from '@/api/center';
import FilterPopup from '@/components/Popup/FilterPopup.vue';
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
  allPlat: [],
  inte_currency_id: '',
  last_page: 1,

});

const $store = inject('store');
$store.dispatch('app/getDict', ['allplatform']);
const { dicts } = $store.state.app;

watch(
  () => dicts.allplatform,
  () => {
    date.allPlat.push({
      id: 0,
      name: global.$t('中心钱包'),
    });
    Object.keys(dicts.allplatform).forEach((item) => {
      date.allPlat.push({
        id: item * 1,
        name: dicts.allplatform[item],
      });
    });
  },
);

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
  () => translog({
    LOADING: true,
    page: date.current,
    start_time: date.startTime || '',
    data_type: 2,
    end_time: date.endTime || '',
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
.transferRecord-wrap {
  .tab-top {
    border-bottom: 2px solid var(--border-color-323232);
    padding: 30px;
    margin-top: 30px;

    > div {
      flex: 1;
      text-align: center;

      p {
        margin: 0;
        font-size: 22px;
        opacity: 0.6;
        color: var(--font-color-333333);

        &:first-child {
          font-size: 28px;
          color: var(--font-color-24c29a);
          line-height: 50px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.form-wrap {
  :deep(.van-form) {
    display: flex;
    .van-cell {
      padding-left: 0;
    }
    .van-cell__title {
      display: none;
    }
    .van-field__body {
      padding: 0 20px;
    }
  }
}
.list-item-wrap .van-list li span {
  display: flex;
  align-items: center;
  img.icon-arrow-right {
    height: auto;
    display: inline-block;
    margin: 0 0 0 3px;
    transform: scale(0.8);
    background: var(--bg-wallet-operation);
  }
  .svg-arrow-right {
    width: 35px;
    margin: 0;
  }
}
</style>
