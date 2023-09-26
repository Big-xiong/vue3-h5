<template>
  <div class="commission-withdraw-wrap">
    <div class="tabs-wrap">
      <van-tabs v-model:active="activeKey" :before-change="onBeforeChange" class="title-nav-tabs" :swipe-threshold="2">
        <van-tab name="bank" :title="$t('提款至银行卡')" />
        <van-tab name="wallet" :title="$t('提款至钱包')" />
        <van-tab name="charge" :title="$t('钱包充值')" />
      </van-tabs>
    </div>

    <div class="tips-wrap" v-show="activeKey === 'bank'">
      <van-icon name="info-o"></van-icon>
      <div>
        {{ $t('请仔细核对银行卡信息，信息错误将导致提款失败。有疑问请联系') }}
        <span class="serve" @click="$openKefu">{{ $t('在线客服') }}</span>
      </div>
    </div>

    <div class="form-wrap">
      <Form :columns="columns" ref="FormRef" inputAlign="right" :border="true" :borderBottom="true" :padding="false">
        <template #currency>
          <div class="dev-type-slot">
            {{ $t("推广设备") }}
            <em class="required">*</em>
          </div>
        </template>
        <template v-if="activeKey !== 'wallet'" #getCode>
          <van-button :disabled="isCounting" :loading="smsCodeLoading" class="get-code-btn" :loading-text="$t('发送中')"
            @click="getCode" type="plain">{{ isCounting ? `${$t('重新获取')}(${num})` : $t('获取验证码') }}</van-button>
        </template>
      </Form>
    </div>

    <van-button @click="submit" class="submit-btn" type="primary">{{ $t('确认提款') }}</van-button>
  </div>
</template>

<script setup>
import {
  computed, h, inject, ref, watch, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Dialog, Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import { smscode } from '@/api/center';
import { bankcardlist, withdraw, commissiontrans } from '@/api/agent';
import SvgIcon from '@/components/SvgIcon.vue';

const isShowBankCard = ref(false);
const global = inject('global');
const activeKey = ref('bank');
const userBankList = ref([]);
const selectedBank = ref({});
const FormRef = ref({});
const store = inject('store');
const { agent } = store.state;
const currencySymbol = computed(() => agent.userInfo?.currency?.symbol ?? '');

function onBeforeChange(event) {
  if (event === 'charge') {
    activeKey.value = 'bank';
    global.$dialog({
      tpl: 'AgentWalletTips',
    });
    return false;
  }

  return true;
}

const {
  run: getUserBank,
  loading: getUserBankLoading,
} = useRequest(() => bankcardlist(), {
  onSuccess(result) {
    userBankList.value = result.map((item) => ({
      ...item,
      name: item.bank_name,
    }));
  },
});

const baseColumns = [
  {
    type: 'input',
    prop: 'bank',
    label: global.$t('银行卡'),
    placeholder: global.$t('添加银行卡'),
    readonly: true,
    clickable: true,
    inputAlign: 'right',
    rightIcon: 'arrow',
    leftIconSlot: () => h(SvgIcon, {
      name: 'bank-card', class: 'icon',
    }),
    onClick() {
      agent.userInfo?.agent_bank?.length
        ? global.$popup({
          tpl: 'BankList',
          title: '选择银行卡',
          bankList: userBankList.value,
          defaultBank: selectedBank.value,
          onSelect(data) {
            selectedBank.value = data;
            if (activeKey.value === 'bank') {
              FormRef.value.data.bank = data.name;
            }
          },
        }) : global.$router.push({ name: 'agentAddCard' });
    },
  },
  {
    type: 'input',
    label: global.$t('提款金额'),
    inputAlign: 'right',
    prop: 'withdraw_money',
    leftIconSlot: () => h(SvgIcon, {
      name: 'transfer', class: 'icon',
    }),
    placeholder: `${global.$t('单次提款金额需≥')} ${currencySymbol.value} 100`,
  },
  {
    type: 'input',
    prop: 'rechargeNumber',
    readonly: true,
    defaultValue: 0,
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'money', class: 'icon',
    }),
    label: global.$t('可提款余额'),
  },
  {
    type: 'input',
    prop: 'mobile',
    readonly: true,
    label: global.$t('手机号'),
    placeholder: global.$t('手机号'),
    defaultValue: '',
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'mobile', class: 'icon',
    }),
  },
  {
    type: 'number',
    prop: 'code',
    placeholder: global.$t('请输入手机验证码'),
    leftIconSlot: () => h(SvgIcon, {
      name: 'code', class: 'icon',
    }),
    inputAlign: 'right',
    buttonSlot: 'getCode',
  },
];

let interval = 0;
const isCounting = ref(false);
const num = ref(60);

watch(
  () => activeKey.value,
  () => {
    isCounting.value = false;
    clearInterval(interval);
    num.value = 60;
  },
);

const columns = computed(() => {
  if (activeKey.value === 'wallet') {
    const columnsHolder = [...baseColumns];
    columnsHolder.pop();
    columnsHolder.pop();
    columnsHolder.shift();
    return columnsHolder;
  }
  return baseColumns;
});

const AgentBindMobile = () => global.$popup({ tpl: 'AgentBindMobile', type: 'agent' });
watchEffect(() => {
  const { userInfo } = agent;
  if (userInfo.mobile && FormRef.value?.data) {
    FormRef.value.data.mobile = userInfo.mobile;
    baseColumns[3].rightIcon = null;
    baseColumns[3].clickable = false;
    baseColumns[3].onClick = () => {
    };
  } else {
    baseColumns[3].placeholder = global.$t('立即绑定');
    baseColumns[3].rightIcon = 'arrow';
    baseColumns[3].clickable = true;
    baseColumns[3].onClick = (event) => {
      AgentBindMobile();
    };
  }

  if (FormRef.value?.data?.chartType === 'wallet') {
    FormRef.value.data.rechargeNumber = `${currencySymbol.value} ${(+userInfo?.money).toFixed(2) || '0.00'}`;
  } else if (FormRef.value?.data) {
    FormRef.value.data.rechargeNumber = `${currencySymbol.value} ${(+userInfo?.commission_money).toFixed(2) || '0.00'}`;
  }
});

const {
  run: getSmsCode,
  loading: smsCodeLoading,
} = useRequest(
  () => smscode({
    mobile: agent.userInfo.mobile,
    phone_area_code: agent.userInfo.phone_area_code,
  }),
  {
    manual: true,
    onSuccess() {
      isCounting.value = true;
      num.value -= 1;
      interval = setInterval(() => {
        num.value -= 1;
        if (num.value === 0) {
          isCounting.value = false;
          clearInterval(interval);
        }
      }, 1000);
    },
  },
);

const {
  run: doWithdraw,
  loading: withdrawLoading,
} = useRequest((params) => withdraw(params), {
  manual: true,
  onSuccess(result) {
    Toast.success(global.$t('提现已发起审核中'));
    global.$router.go(-1);
  },
});

const {
  run: doCommission,
  loading: commissionLoading,
} = useRequest(commissiontrans, {
  manual: true,
  onSuccess(result) {
    Toast.success(global.$t('申请成功'));
    global.$router.go(-1);
  },
});

function submit() {
  const { userInfo } = agent;
  const { data } = FormRef.value;

  if (activeKey.value === 'bank' && !selectedBank.value.bank_id) {
    Toast.fail(global.$t('请选择银行'));
    return false;
  }
  if (Number(data.withdraw_money) < 100) {
    Toast.fail(`${global.$t('金额不能小于100')}`);// ${currencySymbol.value}
    return false;
  }
  if (activeKey.value !== 'wallet' && !data.code) {
    Toast.fail(global.$t('验证码不能为空'));
    return false;
  }
  if (userInfo.commission_money < data.withdraw_money) {
    Toast.fail(global.$t('提款金额大于可提款金额'));
    return false;
  }

  Dialog({
    title: global.$t('确认提款？'),
    showConfirmButton: true,
    showCancelButton: true,
  })
    .then(() => {
      let params = {
        sms_code: data.code,
        withdraw_money: data.withdraw_money,
        valid_type: 1,
        mobile: data.mobile,
      };

      if (activeKey.value === 'bank') {
        params.user_bank_id = selectedBank.value.id;
        doWithdraw(params);
      }

      if (activeKey.value === 'wallet') {
        params = {
          ...params, ...FormRef.value.data, money: FormRef.value.data.withdraw_money,
        };
        delete params.withdraw_money;
        doCommission(params);
      }
    });
}

function getCode() {
  if (isCounting.value) {
    return;
  }

  if (!agent.userInfo.mobile) {
    Toast.fail(global.$t('请先绑定手机号'));
  } else {
    num.value = 60;
    getSmsCode();
  }
}
</script>

<style lang="less" scoped>
.commission-withdraw-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  .tips-wrap {
    margin: 0 0 20px 0;
    display: flex;
    padding: 20px 40px;
    background: var(--bg-color-42535d);
    color: var(--font-color-ffffff);
    line-height: 45px;
    font-size: 28px;

    .van-icon {
      color: var(--theme-color);
      line-height: 40px;
      margin-right: 10px;
      font-size: 32px;
      position: relative;
      top: 2px;
    }

    .serve {
      color: var(--theme-color);
    }
  }

  .form-wrap {
    box-sizing: border-box;
    flex: 1;
    padding: 0 25px;
  }

  .get-code-btn {
    height: 60px;
    width: 205px;
    font-size: 26px;
    padding: 0;
  }

  .submit-btn {
    font-size: 32px;
    box-sizing: border-box;
    padding: 0 30px;
    width: 650px;
    margin: 0 auto 60px auto;
  }

  :deep(.van-field__left-icon) {
    display: flex;
    align-items: center;
    color: var(--theme-color);
    margin-right: 20px;

    .icon {
      width: 40px;
      height: 40px;
    }
  }

  :deep([buttonslot="getCode"]) {
    .van-field__label {
      display: none;
    }

    input {
      text-align: left;
    }
  }
}

.tabs-wrap {
  // border-bottom: 2px solid var(--dark-333, var(--border-color-e7e7e7));

  :deep([role="tablist"]) {
    .van-tab--active {
      color: var(--theme-color);
    }
  }
}
</style>
