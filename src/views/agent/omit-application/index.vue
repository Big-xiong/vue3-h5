<template>
  <div class="omit-application-wrap">
    <div class="application-wrap">
      <input type="text" v-model="username" :placeholder="$t('请输入会员账号')" />
      <van-button
        @click="apply"
        :loading="applyLoading"
        class="apply-btn"
        type="primary"
      >{{ $t('提交申请') }}</van-button>
    </div>

    <div class="form-wrap">
      <Form ref="FormRef" :borderBottom="true" :padding="false" :columns="columns" />
    </div>

    <van-button
      type="primary"
      :loading-text="$t('查询中')"
      :loading="omitListLoading"
      @click="getOmitList"
      class="submit-btn"
    >{{ $t('查询') }}</van-button>

    <div class="table-wrap">
      <AgentTable :dataList="omitData" :requested="requested" @update="getOmitList" />
    </div>
  </div>
</template>

<script setup>
import {
  computed, inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import { useDicts } from '@/utils/hooks';
import { dateFormat } from '@/utils';
import { omitadduser, omitlist } from '@/api/agent';
// import OmitList from './OmitList.vue';
import AgentTable from './AgentTable.vue';

const username = ref('');
const global = inject('global');

const askTimeChange = ref(false);
const auditTimeChange = ref(false);

const columns = computed(() => [
  {
    type: 'picker',
    label: global.$t('申请状态'),
    clickable: true,
    prop: 'audit_status',
    placeholder: global.$t('请选择申请状态'),
    rightIcon: 'arrow',
    inputAlign: 'right',
    list: [],
  },
  {
    type: 'datetime-picker',
    label: global.$t('新增时间'),
    subType: 'date',
    prop: 'ask_time',
    clickable: true,
    inputAlign: 'right',
    placeholder: global.$t('请选择新增时间'),
    rightIcon: 'arrow',
    format(date) {
      if (date) {
         askTimeChange.value = true;
        return dateFormat('YYYY-MM-DD', date);
      }
      return '';
    },
  },

  {
    type: 'datetime-picker',
    label: global.$t('审核时间'),
    subType: 'date',
    prop: 'audit_time',
    clickable: true,
    inputAlign: 'right',
    placeholder: global.$t('请选择审核时间'),
    rightIcon: 'arrow',
    format(date) {
      if (date) {
         auditTimeChange.value = true;
        return dateFormat('YYYY-MM-DD', date);
      }
      return '';
    },
  },
]);

useDicts('auditstatuslist', (val) => {
  columns.value[0].list = Object.keys(val)
    .map((key) => ({
      label: val[key],
      value: key,
    }));
}, { immediate: true });

const FormRef = ref({});
const omitData = ref([]);
const requested = ref(false);

const {
  run: getOmitList,
  loading: omitListLoading,
} = useRequest(
  () => {
    requested.value = false;
    if (FormRef.value.data) {
      const { data } = FormRef.value;
      // const params = {
      //   ...FormRef.value.data,
      // };

      // Object.keys(params).map(
      //   (key) => params[key] instanceof Date
      //     && (params[key] = dateFormat('YYYY-MM-DD', params[key])),
      // );
      const params = {
        audit_status: FormRef.value.data.audit_status,
        ask_time: askTimeChange.value ? dateFormat('YYYY-MM-DD', FormRef.value.data.ask_time) : '',
        audit_time: auditTimeChange.value ? dateFormat('YYYY-MM-DD', FormRef.value.data.audit_time) : '',
      };

      return omitlist(params);
    }
    return omitlist({
      audit_status: '',
      ask_time: '',
      audit_time: '',
    });
  },
  {
    onSuccess(result) {
      requested.value = true;
      omitData.value = Array.isArray(result.data) ? result.data.map((item) => ({
        ...item,
        currency_name: item.currency.name,
        region_name: item.region.name,
      })) : [];
    },
  },
);
const {
  run: apply,
  loading: applyLoading,
} = useRequest(
  () => omitadduser({
    username: username.value,
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('添加成功'));
      getOmitList();
    },
  },
);

</script>

<style lang="less" scoped>
.omit-application-wrap {
  .form-wrap {
    box-sizing: border-box;
    padding: 0 30px;
  }

  .application-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 30px;

    input {
      width: 452px;
      height: 88px;
      border-radius: 8px;
      border: 2px solid var(--dark-333, var(--border-color-e7e7e7));
      background-color: transparent;
      box-sizing: border-box;
      padding-left: 30px;
      color: var(--dark-fff, var(--font-color-222930));

      &::placeholder {
        color: var(--font-color-999999);
      }
    }

    .apply-btn {
      width: 208px;
      height: 88px;
      // color: var(--font-color-ffffff);
    }
  }

  .submit-btn {
    font-size: 32px;
    width: 630px;
    height: 90px;
    // color: var(--font-color-ffffff);
    margin: 30px auto;
    display: block;
  }

  :deep(.config-form-wrap) {
    input {
      padding: 30px 0;
    }
  }

  :deep(.van-cell::after) {
    border: none !important;
  }

  .table-wrap {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
