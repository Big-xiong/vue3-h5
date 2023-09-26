<template>
  <div class="agent-register-wrap">
    <Form :columns="columns" ref="FormRef" :padding="false" :inputPadding="true" />

    <van-button
      :loading="registerLoading"
      type="primary"
      :disabled="!isFieldFillIn"
      @click="doRegister"
    >{{ $t("确定") }}</van-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Dialog, Toast } from 'vant';
import {
  computed, inject, reactive, ref, watch, watchEffect, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { addmember } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import { testPassword } from '@/utils';
import { useRegion, useScrollToTop } from '@/utils/hooks';

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    prop: 'username',
    block: true,
    label: global.$t('会员账号'),
    placeholder: global.$t('请输入会员账号'),
  },
  {
    type: 'password',
    prop: 'password',
    block: true,
    label: global.$t('密码'),
    placeholder: global.$t('请输入密码'),
  },
  {
    type: 'password',
    prop: 'repassword',
    block: true,
    label: global.$t('确认密码'),
    placeholder: global.$t('再次输入登陆密码'),
  },
  // {
  //   type: 'number',
  //   prop: 'rate',
  //   block: true,
  //   label: global.$t('佣金比例'),
  //   placeholder: global.$t('请输入佣金比例'),
  // },

]);

const FormRef = ref({});

const {
  regionList, currencyList, changeRegionId, defaultCurrency, defaultRegion,
} = useRegion(FormRef.value);

const subConfig = inject('subConfig');
if (subConfig.isCurrency) {
  columns.push({
    type: 'picker',
    label: global.$t('地区'),
    block: true,
    placeholder: global.$t('请选择地区'),
    rightIcon: 'arrow',
    prop: 'inte_region_id',
    list: [],
  });
  columns.push({
    type: 'picker',
    label: global.$t('货币'),
    block: true,
    placeholder: global.$t('请选择货币'),
    rightIcon: 'arrow',
    prop: 'inte_currency_id',
    disabledMessage: global.$t('请先选择地区'),
    disabled: true,
    list: [],
  });

  watchEffect(() => {
    const regionId = FormRef.value?.data?.inte_region_id;
    if (regionId) {
      changeRegionId(regionId);
      columns[columns.length - 1].list = currencyList.value;
      columns[columns.length - 1].disabled = false;
      columns[columns.length - 1].defaultValue = defaultCurrency.value;
    }
  });

  watchEffect(() => {
    columns[columns.length - 2].list = regionList.value;
    columns[columns.length - 2].defaultValue = defaultRegion.value.id;
  });
}

onMounted(() => {
  useScrollToTop('.agent-layout');
});

const router = useRouter();
const { run: register, loading: registerLoading } = useRequest(
  () => addmember(FormRef.value.data),
  {
    manual: true,
    onSuccess() {
      global.$dialog({ tpl: 'AgentTips', message: global.$t('会员开户成功') });
      router.push('/affiliate/home');
    },
  },
);

function doRegister() {
  const { data } = FormRef.value;
  if (!data.username) {
    Toast.fail(global.$t('请输入会员账户'));
    return;
  }
  if (!data.password) {
    Toast.fail(global.$t('请输入登录密码'));
    return;
  }
  if (!data.repassword) {
    Toast.fail(global.$t('请输入确认密码'));
    return;
  }
  if (data.username && !testPassword(data.username)) {
    Toast.fail(global.$t('账号由6-20位英文字母或数字组成'));
    return;
  }
  if (data.password && !testPassword(data.password)) {
    Toast.fail(global.$t('密码由6-20位数字+字母组成'));
    return;
  }
  if (data.password !== data.repassword) {
    Toast.fail(global.$t('两次输入密码不一致'));
    return;
  }
  if (subConfig.isCurrency) {
    if (!data.inte_region_id) {
      Toast.fail(global.$t('请选择区域'));
      return;
    }

    if (!data.inte_currency_id) {
      Toast.fail(global.$t('请选择货币'));
      return;
    }
  }

  register();
}

const isFieldFillIn = computed(() => {
  if (FormRef.value.data) {
    const { data } = FormRef.value;
    return (
      Object.keys(data)
        .map((key) => !!data[key])
        .filter((item) => item).length === columns.length
    );
  }
  return false;
});
</script>

<style lang="less" scoped>
.agent-register-wrap {
  box-sizing: box-sizing;
  padding: 0 30px 30px 30px;

  :deep(.van-button) {
    font-size: 32px;
    margin: 0 auto;
    width: 690px;
    display: block;
    height: 90px;
    background-color: var(--bg-color-24c29a);
    border: none;
  }
  :deep(.config-form-wrap) {
    padding: 30px 0;
    input {
      padding: 22px 30px;
    }
    .van-field {
      border: 2px solid var(--dark-666, var(--border-color-00001));
      margin-bottom: 40px;
    }
    .van-cell::after {
      border: none;
    }
    .van-cell {
      padding: var(--van-cell-vertical-padding) 0;
    }
    .van-field__right-icon {
      padding-left: 0;
      transform: translateX(-30px) rotate(90deg);
    }
  }
}
</style>
