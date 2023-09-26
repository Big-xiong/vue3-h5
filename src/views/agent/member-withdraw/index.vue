<template>
  <van-nav-bar :title="$t('确认转账')" left-arrow @click-left="router.go(-1)"></van-nav-bar>

  <div class="member-withdraw-wrap">
    <div class="amount">
      <p>
        {{ $t("转账至") }}
        <span>{{ memberData.username }}</span>
      </p>
      <p>
        {{ $t("代理钱包余额") }}
        <span v-money:[memberData.cuurency?.symbol]="agent?.userInfo?.money"></span>
      </p>
      <div class="region-wrap" v-if="subConfig.isCurrency">
        <p>
          {{ $t('地区') }}:
          <span>{{ region }}</span>
        </p>
        <p>
          {{ $t('货币') }}:
          <span>{{ currency }}</span>
        </p>
      </div>
    </div>

    <Form :columns="columns" ref="FormRef" :borderBottom="true">
      <template #money>
        <span class="currency">{{ agent?.userInfo?.currency?.symbol }}</span>
      </template>
      <template #code>
        <van-button
          :loading="smsCodeLoading"
          :disabled="isCounting"
          @click="sendSmsCode"
        >{{ codeText }}</van-button>
      </template>
    </Form>

    <van-button type="primary" @click="submit">{{ $t("确认转账") }}</van-button>
  </div>
</template>

<script setup>
import {
  computed, inject, reactive, ref, watch, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Dialog, Toast } from 'vant';
import { useRouter } from 'vue-router';
import Form from '@/components/Form/index.vue';
import { smscode } from '@/api/center';
import { membertrans } from '@/api/agent';
import { useRegion } from '@/utils/hooks';

const store = inject('store');
const global = inject('global');
const { agent } = store.state;
const subConfig = inject('subConfig');

const isCounting = ref(false);
const isCounted = ref(false);
const countdown = ref(60);

const codeText = computed(() => {
  if (isCounting.value) {
    return `${global.$t('重新获取')}(${countdown.value})`;
  }
  if (isCounted.value) {
    return global.$t('重新获取验证码');
  }
  return global.$t('获取验证码');
});

const memberData = ref({});

if (sessionStorage.getItem('memberDetailData')) {
  try {
    memberData.value = JSON.parse(sessionStorage.getItem('memberDetailData'));
  } catch (e) {
    console.error('parse member detail data error');
  }
}

const region = ref('');
const currency = ref('');

const { regionList, changeRegionId, currencyList } = useRegion();

const AgentBindMobile = () => global.$popup({ tpl: 'AgentBindMobile' });

watchEffect(() => {
  const { userInfo } = agent;
  changeRegionId(userInfo.inte_region_id);
  region.value = regionList.value?.find?.((item) => item.value === userInfo.inte_region_id)?.label;
  currency.value = currencyList.value?.find?.((item) => item.value === userInfo.inte_currency_id)?.label;
});

const columns = reactive([
  {
    type: 'number',
    prop: 'money',
    block: true,
    label: global.$t('转账金额'),
    placeholder: global.$t('请输入转账金额'),
    leftIconSlot: 'money',
  },
  {
    type: 'input',
    prop: 'mobile',
    label: global.$t('验证手机号'),
    readonly: true,
    block: true,
    buttonSlot: 'code',
    defaultValue: agent.userInfo.mobile,
  },
  {
    type: 'number',
    prop: 'code',
    label: global.$t('验证码'),
    block: true,
    placeholder: global.$t('请输入验证码'),
  },
]);

const FormRef = ref({});
watch(
  () => agent.userInfo,
  (info) => {
    if (info && FormRef.value.data) {
      FormRef.value.data.mobile = info.mobile;
    }
  },
  { immediate: true },
);

let timer = 0;
const { run: sendSmsCode, loading: smsCodeLoading } = useRequest(
  () => smscode({
    mobile: agent.userInfo.mobile,
    phone_area_code: agent.userInfo.phone_area_code,
  }),
  {
    manual: true,
    onSuccess() {
      isCounting.value = true;
      countdown.value = 59;
      timer = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value === 0) {
          clearInterval(timer);
          isCounted.value = true;
          isCounting.value = false;
          countdown.value = 60;
        }
      }, 1000);
    },
  },
);

const router = useRouter();
const { run: postWithdraw, loading: submitLoading } = useRequest(
  (params) => membertrans(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('转账成功'));
      router.go(-1);
    },
  },
);

function submit() {
  if (!FormRef.value.data.money) {
    return Toast.fail(global.$t('转账金额不能为空'));
  }
  if (!agent.userInfo.mobile) {
    return Toast.fail(global.$t('请先绑定手机号'));
  }
  Dialog.confirm({
    title: global.$t('确定转账?'),
    // message: global.$t('确定转账?'),
  }).then(() => {
    const params = {
      username: memberData.value.username,
      code: FormRef.value.data.code,
      money: FormRef.value.data.money,
    };
    postWithdraw(params);
  });
}
</script>

<style lang="less" scoped>
.member-withdraw-wrap {
  padding: 30px;
  flex: 1;
  overflow-y: auto;

  :deep(.currency) {
    color: var(--dark-fff, var(--font-color-999999));
  }

  .amount {
    flex: 1;
    font-size: 28px;
    margin-bottom: 30px;
    color: var(--font-color-222930);
    border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    padding-bottom: 42px;

    p {
      margin: 0;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      color: var(--dark-fff, var(--font-color-222930));
    }
  }

  :deep(.van-form) {
    .block-label {
      margin-top: 30px;
    }

    .van-button {
      height: 67.5px !important;
      min-width: 240px;
    }

    .van-field {
      border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7)) !important;
      padding-left: 0;
      padding-right: 0;
    }
  }

  :deep(.van-button--primary) {
    margin-top: 80px;
    height: 90px;
    width: 100%;
  }
}

.region-wrap {
  display: flex;
  justify-content: space-between;
  span {
    margin-left: 5px;
  }
}
</style>
