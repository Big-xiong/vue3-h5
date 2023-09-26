<template>
  <div class="transactionRecord-wrap">
    <van-nav-bar
      class="m-header"
      :title="$t('交易记录')"
      left-arrow
      :right-text="$t('筛选')"
      @click-left="$router.push('/user')"
      @click-right="showPop"
    />
    <van-tabs v-model:active="active" @click="tabsClick" type="card" animated>
      <van-tab v-for="(route, index) in navRoute" :key="route.path" :title="$t(route.meta.title)">
        <component
          :currency="currency"
          :is="comps[index]"
          :isFilter="status[index]"
          :status="statusConfig[active]"
          @close="close"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import {
  inject, ref, watch, computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import { historycurrency, allorderstatus, allwithdrawstatus } from '@/api/center';

import DepositRecord from './deposit-record/index.vue';
import centerRouter from '@/router/modules/center';
import WithdrawRecord from './withdraw-record/index.vue';
import TransferRecord from './transfer-record/index.vue';
import BonusRecord from './bonus-record/index.vue';
import GameRecord from './game-record/index.vue';
import AccountChangeRecord from './account-change-record/index.vue';

const comps = [DepositRecord, WithdrawRecord, TransferRecord, BonusRecord, GameRecord, AccountChangeRecord];

const global = inject('global');
const route = useRoute();
const navRoute = centerRouter[0]?.children?.[2]?.children ?? [];
const active = ref(0);
const hasStatus = ref(true);
const status = ref([false, false, false, false, false, false]);
const filterData = ref(null);
const currency = ref([]);

const { run } = useRequest((params) => historycurrency(params), {
  manual: true,
  onSuccess(res) {
    currency.value = res?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  },
});

watch(() => route.name, () => {
  navRoute.forEach((item, index) => {
    if (route.name === item.name) {
      active.value = index;
      if ([2, 5].includes(index)) {
        run({ type: 3 });
      } else run({ type: index + 1 });
    }
  });
}, {
  immediate: true,
});

const { data: statusArr } = useRequest(allwithdrawstatus, {
  formatResult: (data) => {
    const arr = [];
    Object.keys(data).forEach((item) => {
      arr.push({
        id: item,
        name: data[item],
      });
    });
    return [{ id: 0, name: global.$t('全部') }, ...arr];
  },
});

const { data: depositStatusArr } = useRequest(allorderstatus, {
  formatResult: (data) => {
    const arr = [];
    Object.keys(data).forEach((item) => {
      arr.push({
        id: item,
        name: data[item],
      });
    });
    return [{ id: 0, name: global.$t('全部') }, ...arr];
  },
});

const statusConfig = computed(() => ({ 0: depositStatusArr.value, 1: statusArr.value }));

function tabsClick(index) {
  const path = navRoute[index]?.path;
  if (path) global.$router.push(path);
}
function showPop() {
  status.value = status.value.map((item, index) => index === active.value);
}

function close() {
  status.value = status.value.map(() => false);
}
</script>

<style lang="less" scoped>
.transactionRecord-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 30px;
  :deep(.van-tabs__nav) {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }
  :deep(.van-tabs__wrap) {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }
  .m-header {
    order: -1;
  }
  .van-tabs {
    flex-grow: 1;
    overflow-y: auto;
    :deep(.van-tabs__nav) {
      padding: 0;

      .van-tab {
        font-size: 24px;
        border-right: 0;
        padding: 2px 20px;
        box-sizing: border-box;
        background: var(--dark-333, var(--bg-color-f1f1f1));
        color: var(--dark-fff, var(--font-color-fff-4));
        margin-right: 20px;
        white-space: nowrap;
        border-radius: 100px;
        &--active {
          color: var(--font-color-ffffff);
          background: var(--bg-color-24c29a);
          border-radius: 28px;
        }
      }
      .van-tab:nth-last-of-type(1) {
        margin-right: 0;
      }
    }

    :deep(.van-tabs__wrap) {
      line-height: 56px;
      padding: 0 30px;
      padding-bottom: 10px;
      border-bottom: 0;
    }

    :deep(.van-tabs__nav--card) {
      margin: 20px 0;
      border: 0;
    }
  }
  :deep(.record-nodata) {
    img {
      width: 76px;
      margin-bottom: 28px;
    }
    p {
      color: var(--dark-fff, var(--font-color-333333));
      opacity: 0.6;
    }
  }
}
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}
:deep(.van-nav-bar__left, .van-nav-bar__right) {
  color: var(--font-color-ffffff);
}
:deep(.van-nav-bar__text) {
  color: var(--font-color-ffffff);
}
:deep(.van-tabs--card > .van-tabs__wrap) {
  height: 80px;
}
</style>
