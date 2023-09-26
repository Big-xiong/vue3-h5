<template>
  <div class="subordinates-recharge-wrap" :key="updateKey">
    <Form
      @onChange="handleFomChange"
      :columns="columns"
      ref="FormRef"
      inputAlign="right"
      :borderBottom="true"
      :padding="false"
    >
      <template #rate>
        <span>{{ $t('倍') }}</span>
      </template>
      <template #getCode>
        <van-button
          :loading="smsCodeLoading"
          class="get-code-btn"
          @click="getCode"
        >{{ isCounting ? `${$t('重新获取')}(${num})` : $t('获取验证码') }}</van-button>
      </template>
      <template #condition>
        <div class="tip">
          <van-icon name="info-o"></van-icon>
          <div>
            <div>
              {{ $t('代充金额单次需满足') }}
              <span>{{ $t('100≤单次代充量≤10,000') }}</span>
            </div>
            <div
              v-if="chargeRate?.currency && subConfig.isCurrency"
            >{{ $t('默认') }}:{{ chargeRate?.region }},{{ chargeRate?.currency }},{{ $t('汇率') }}:{{ chargeRate?.rate }}</div>
          </div>
        </div>
      </template>
      <template #note>
        <div class="tip">
          <van-icon name="info-o"></van-icon>
          {{ $t('备注可用通过系统消息发送到会员端') }}
        </div>
      </template>
    </Form>

    <van-button @click="submit" class="submit-btn" type="primary">{{ $t('确认代充') }}</van-button>

    <WidthdrawPass
      v-model:show="isShowPassword"
      type="agent"
      @finish="handlePasswordClose($event)"
    />

    <!-- <teleport :to="$store.state.app.teleportContainer">
      <password
        @close="handlePasswordClose($event)"
        :isShow="isShowPassword"
      />
    </teleport>-->
  </div>
</template>

<script setup>
import { Dialog, Toast } from 'vant';
import {
  computed, h, inject, onMounted, reactive, ref, watch, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { agentdeposite, innerrechargerate, smscode } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import { useRegion } from '@/utils/hooks';
import Password from './PasswordAction.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import WidthdrawPass from '@/views/center/fund-management/withdraw/components/WidthdrawPass.vue';

const FormRef = ref();
const global = inject('global');
const subConfig = inject('subConfig');

const store = inject('store');
const { agent } = store.state;
const currencySymbol = computed(() => agent.userInfo?.currency?.symbol ?? '');

const isCounting = ref(false);
const num = ref(60);
let baseColumns = [
  {
    type: 'picker',
    prop: 'chartType',
    label: global.$t('代充类型'),
    placeholder: global.$t('请选择代充类型'),
    inputAlign: 'right',
    rightIcon: 'arrow',
    leftIconSlot: () => h(SvgIcon, {
      name: 'charge-type',
      class: 'icon',
    }),
    list: [
      {
        label: global.$t('佣金代充'),
        value: 'commission',
      },
      {
        label: global.$t('钱包代充'),
        value: 'wallet',
      },
    ],
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
    label: global.$t('可代充金额'),
  },
  {
    type: 'picker',
    prop: 'userType',
    label: global.$t('账号类型'),
    placeholder: global.$t('选择账号类型'),
    leftIconSlot: () => h(SvgIcon, {
      name: 'verify-ways', class: 'icon',
    }),
    inputAlign: 'right',
    rightIcon: 'arrow',
    list: [
      {
        label: global.$t('代理账号'),
        value: 'agent',
      },
      {
        label: global.$t('会员账号'),
        value: 'member',
      },
    ],
  },
  {
    type: 'input',
    prop: 'username',
    label: global.$t('下级账号'),
    placeholder: global.$t('请输入下级账号'),
    slot: 'region',
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'account2', class: 'icon',
    }),
  },
  {
    type: 'number',
    prop: 'money',
    label: global.$t('代充金额'),
    placeholder: global.$t('请输入代充金额'),
    slot: 'condition',
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'charge-money', class: 'icon',
    }),
  },
  {
    type: 'number',
    prop: 'flow',
    label: global.$t('提款流水倍数'),
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'rate', class: 'icon',
    }),
    defaultValue: 0,
    rightIconSlot: 'rate',
    class: 'flow-rate-field',
  },
  {
    type: 'picker',
    prop: 'verifyType',
    label: global.$t('验证方式'),
    placeholder: global.$t('请选择验证方式'),
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'verify-ways', class: 'icon',
    }),
    defaultValue: 'phone',
    rightIcon: 'arrow',
    list: [
      {
        label: global.$t('手机短信'),
        value: 'phone',
      },
      {
        label: global.$t('支付密码'),
        value: 'payPassword',
      },
    ],
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
    leftIcon: ' iconfont icon-bianzu72',
    inputAlign: 'right',
    buttonSlot: 'getCode',
    class: 'get-code-field',
    leftIconSlot: () => h(SvgIcon, {
      name: 'code', class: 'icon',
    }),
  },
  {
    type: 'input',
    prop: 'mark',
    maxlength: '100',
    label: global.$t('备注'),
    placeholder: global.$t('请输入备注，100字以内'),
    inputAlign: 'right',
    leftIconSlot: () => h(SvgIcon, {
      name: 'remark', class: 'icon',
    }),
    slot: 'note',
  },
];

if (subConfig.isCurrency) {
  baseColumns.push({
    type: 'input',
    prop: 'region',
    readonly: true,
    maxlength: '100',
    label: global.$t('地区'),
    placeholder: '',
    leftIconSlot: () => h(SvgIcon, {
      name: 'region', class: 'icon',
    }),
    inputAlign: 'right',
  });
  baseColumns.push({
    type: 'input',
    prop: 'region',
    readonly: true,
    maxlength: '100',
    label: global.$t('货币'),
    leftIconSlot: () => h(SvgIcon, {
      name: 'currency', class: 'icon',
    }),
    inputAlign: 'right',
  });
}

const {
  regionList,
  changeRegionId,
  currencyList,
} = useRegion();

const AgentBindMobile = () => global.$popup({ tpl: 'AgentBindMobile', type: 'agent' });

const {
  data: chargeRate,
  run: getChargeRate,
} = useRequest((params) => innerrechargerate(params), {
  debounceInterval: 1000,
  manual: true,
});

function getRate() {
  const { userType, username } = FormRef.value?.data;
  if (username && userType) {
    getChargeRate({ type: userType === 'agent' ? 2 : 1, username });
  }
}

watch(() => FormRef.value?.data.userType, (name) => {
  getRate();
});

watch(() => FormRef.value?.data.username, (name) => {
  getRate();
});

watchEffect(() => {
  const { userInfo } = agent;
  changeRegionId(userInfo.inte_region_id);
  if (subConfig.isCurrency) {
    baseColumns[baseColumns.length - 2].defaultValue = regionList.value?.find?.((item) => item.value === userInfo.inte_region_id)?.label;
    baseColumns[baseColumns.length - 1].defaultValue = currencyList.value?.find?.((item) => item.value === userInfo.inte_currency_id)?.label;
  }
  if (userInfo.mobile && FormRef.value?.data) {
    FormRef.value.data.mobile = userInfo.mobile;
    baseColumns[7].rightIcon = null;
    baseColumns[7].clickable = false;
    baseColumns[7].onClick = () => {
    };
  } else {
    baseColumns[7].placeholder = global.$t('立即绑定');
    baseColumns[7].rightIcon = ' iconfont icon-dayuhao';
    baseColumns[7].clickable = true;
    baseColumns[7].onClick = (event) => {
      AgentBindMobile();
    };
  }

  if (FormRef.value?.data?.chartType === 'wallet') {
    FormRef.value.data.rechargeNumber = `${currencySymbol.value} ${(+userInfo?.money).toFixed(2) || '0.00'}`;
  } else if (FormRef.value?.data) {
    FormRef.value.data.rechargeNumber = `${currencySymbol.value} ${(+userInfo?.commission_money).toFixed(2) || '0.00'}`;
  }

  if (FormRef.value?.data?.verifyType === 'payPassword') {
    console.log('password');
  } else {
    console.log('mobile');
  }

  baseColumns = reactive([...baseColumns]);
});

const columns = computed(() => {
  const columnsHolder = [...baseColumns];
  if (FormRef.value?.data?.userType === 'agent') {
    columnsHolder.splice(5, 1);
  }
  if (FormRef.value?.data?.verifyType === 'payPassword') {
    columnsHolder.splice((columnsHolder.findIndex((item) => item.prop === 'verifyType') + 1), 2);
  }
  return columnsHolder;
});

let interval = 0;
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

function getCode() {
  if (isCounting.value) {
    return;
  }

  if (!agent.userInfo.mobile) {
    Toast.fail(global.$t('请先绑定手机号'));
    AgentBindMobile();
  } else {
    num.value = 60;
    getSmsCode();
  }
}

const router = useRouter();
const isShowPassword = ref(false);
const payPassword = ref('');

const {
  run: postDeposit,
  loading: postDepositLoading,
} = useRequest(
  () => {
    const formData = FormRef.value.data;
    const params = {
      money_type: formData.chartType === 'wallet' ? '1' : '2',
      user_type: formData.userType === 'member' ? '1' : '2',
      flow: formData.flow,
      money: formData.money,
      username: formData.username,
      mark: formData.mark,
      mobile: agent.userInfo.mobile,
      sms_code: formData.code,
      valid_type: formData.verifyType === 'phone' ? '1' : '2',
      phone_area_code: agent.userInfo.placeholder,
      pay_password: payPassword.value,
    };

    return agentdeposite(params);
  },
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('充值成功'));
      global.$router.go(-1);
    },
  },
);

function handlePasswordClose(event) {
  payPassword.value = event;
  isShowPassword.value = false;
  if (payPassword.value.length === 6) {
    postDeposit();
  }
}

function submit() {
  const { data } = FormRef.value;
  if (!data.chartType) {
    Toast.fail(global.$t('请选择代充类型'));
    return;
  }
  if (!data.userType) {
    Toast.fail(global.$t('请选择账号类型'));
    return;
  }
  if (!data.verifyType) {
    Toast.fail(global.$t('请选择验证方式'));
    return;
  }
  if (!data.username) {
    Toast.fail(global.$t('请输入下级账号'));
    return;
  }
  if (!data.money) {
    Toast.fail(global.$t('请输入代充金额'));
    return;
  }

  if (data.verifyType === 'payPassword') {
    if (agent.userInfo.pay_password) {
      isShowPassword.value = true;
      return;
    }
      Dialog({
        title: global.$t('温馨提示'),
        showConfirmButton: true,
        showCancelButton: true,
        message: global.$t('您还未设置支付密码，去设置？'),
      }).then(() => router.push({ name: 'agentCenter' }));
      return;
  } if (!data.code) {
    Toast.fail(global.$t('请输入验证码'));
    return;
  }

  postDeposit();
}

function handleFormChange() {
}
</script>

<style lang="less" scoped>
.subordinates-recharge-wrap {
  box-sizing: border-box;
  padding: 30px 30px 0;

  :deep(.van-field__left-icon) {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .icon {
      width: 40px;
      height: 40px;
    }
  }

  :deep(.van-field__right-icon) {
    padding: 0 !important;
    text-align: center;

    .van-icon {
      margin-right: 0 !important;
    }

    i::before {
      margin: 0;
    }
  }

  :deep(.tip) {
    color: var(--dark-fff, var(--font-color-515151));
    margin: 30px 0;
    display: flex;
    font-size: 28px;
    align-items: center;

    .van-icon {
      color: var(--dark-fff, var(--theme-color)) !important;
      margin-right: 14px;
      font-size: inherit;
      margin-top: 5px;
    }

    span {
      color: var(--dark-fff, var(--font-color-999999));
    }
  }

  :deep(.get-code-field) {
    .van-field__label {
      display: none;
    }

    input {
      text-align: left;
    }
  }

  :deep(.flow-rate-field) {
    .van-field__body {
      justify-content: flex-end;
    }

    input {
      width: 100px;
      text-align: left;
      border: solid 2px var(--dark-333, var(--border-color-e7e7e7));
      height: 52px;
      text-align: center;
      line-height: 52px;
      margin-right: 15px;
      box-sizing: border-box;
    }
  }

  :deep(.van-field) {
    box-sizing: content-box;
    padding: 3px 10px 3px 0 !important;
    margin-bottom: 0;
  }

  .submit-btn {
    width: 630px;
    height: 90px;
    margin: 50px auto 30px;
    display: block;
    border-radius: 8px;
    font-size: 32px;
  }

  .get-code-btn {
    height: 64px;
    min-width: 200px;
    font-size: 26px;
  }
}

.image-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 5px;
}
</style>
