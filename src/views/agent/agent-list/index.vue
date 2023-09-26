<template>
  <div class="agent-list-wrap">
    <div class="form-wrap">
      <Form
        :columns="columns"
        :borderBottom="true"
        inputAlign="right"
        :padding="false"
        ref="AgentFormRef"
      />

      <van-button
        :loading="agentListLoading"
        :loading-text="$t('查询中')"
        type="primary"
        class="search-btn"
        @click="doSearch"
      >{{ $t("查询") }}</van-button>
    </div>
    <data-list @update="doSearch" :dataList="dataList" />
  </div>
</template>

<script setup>
import {
  h, inject, reactive, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { dateFormat } from '@/utils';
import { agentlist } from '@/api/agent';
import DataList from './AgentList.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    label: global.$t('代理账号'),
    prop: 'username',
    placeholder: global.$t('请输入代理账号'),
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'account-agent', class: 'icon-wrap',
    }),
  },
  {
    type: 'number',
    label: global.$t('存款金额'),
    inputAlign: 'right',
    pair: true,
    prop: ['deposit_money_min', 'deposit_money_max'],
    placeholder: [global.$t('最小金额'), global.$t('最大金额')],
    leftIconSlot: () => h(SvgIcon, {
      name: 'money-bag', class: 'icon-wrap',
    }),
  },
  {
    type: 'number',
    label: global.$t('注册人数'),
    prop: 'member_counts',
    placeholder: global.$t('最小人数'),
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'mobile', class: 'icon-wrap',
    }),
  },
  {
    type: 'number',
    label: global.$t('存款人数'),
    prop: ' deposit_money_member_counts',
    placeholder: global.$t('最小人数'),
    inputAlign: 'right',
    class: 'bordered',
    leftIconSlot: () => h(SvgIcon, {
      name: 'deposit', class: 'icon-wrap',
    }),
  },
  {
    type: 'number',
    label: global.$t('活跃人数'),
    prop: 'activity_number',
    placeholder: global.$t('最小人数'),
    class: 'bordered',
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'active', class: 'icon-wrap',
    }),
  },
  {
    type: 'datetime-picker',
    pair: true,
    prop: ['register_time_start', 'register_time_end'],
    subType: 'date',
    leftIconSlot: () => h(SvgIcon, {
      name: 'calendar', class: 'icon-wrap',
    }),
    format(date) {
      if (date) {
        return dateFormat('YYYY-MM-DD', date);
      }
      return '';
    },
    placeholder: [global.$t('开始时间'), global.$t('结束时间')],
    label: global.$t('注册时间'),
    inputAlign: 'right',
  },
  {
    type: 'datetime-picker',
    pair: true,
    prop: ['statistical_time_start', 'statistical_time_end'],
    subType: 'date',
    leftIconSlot: () => h(SvgIcon, {
      name: 'calendar', class: 'icon-wrap',
    }),
    format(date) {
      if (date) {
        return dateFormat('YYYY-MM-DD', date);
      }
      return '';
    },
    placeholder: [global.$t('开始时间'), global.$t('结束时间')],
    label: global.$t('统计时间'),
    inputAlign: 'right',
  },
]);

const dataList = ref([]);

const { run: searchReq, loading: agentListLoading } = useRequest((params) => agentlist(params), {
  manual: true,
  onSuccess(result) {
    dataList.value = result.map((item) => ({
      ...item,
      currency_name: item.currency.name,
      region_name: item.region.name,
    }));
  },
});

searchReq({ LOADING: true });

const AgentFormRef = ref({});

const doSearch = () => {
  const params = {
    ...AgentFormRef.value.data,
  };

  Object.keys(params).map(
    (key) => params[key] instanceof Date
      && (params[key] = dateFormat('YYYY-MM-DD', params[key])),
  );

  searchReq(params);
};
</script>

<style lang="less" scoped>
.agent-list-wrap {
  .form-wrap {
    box-sizing: border-box;
    padding: 20px 40px 0;
  }

  :deep(.van-field) {
    input {
      padding: 30px 0 !important;
    }
  }

  :deep(.van-cell::after) {
    border: none !important;
  }
  .search-btn {
    font-size: 32px;
    width: 90%;
    margin: 60px auto;
    display: block;
    color: var(--font-color-fff);
  }
  :deep(.van-field) {
    border-bottom: solid 2px var(--dark-666, var(--border-color-e7e7e7)) !important;

    .van-field {
      border-bottom: 0 !important;
    }
  }

  :deep(.van-field__left-icon) {
    display: flex;
    align-items: center;
    margin-right: 16px;

    .icon-wrap {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
