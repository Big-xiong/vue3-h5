<template>
  <div class="input-item-list">
    <input-item @click="handleInputClick(item.action)" v-for="(item, index) in inputList" :key="index"
      :title="item.title" :icon="item.icon" :placeholder="item.placeholder" :readonly="item.readonly"
      :value="item.value" />
  </div>
</template>

<script setup>
import { useRegion } from '@/utils/hooks';
import InputItem from './components/InputItem.vue';

const global = inject('global');

const store = inject('store');
const { agent } = store.state;

const inputList = ref([]);
const subConfig = inject('subConfig');

function getInputList() {
  inputList.value = [
    {
      title: global.$t('联系方式'),
      icon: 'contact-info',
      value: '',
      action: 'goto:agentContactInfo',
      placeholder: '',
    },
    {
      title: global.$t('手机号码'),
      icon: 'mobile',
      value: agent.userInfo?.mobile
        ? `+${agent.userInfo?.phone_area_code} ${agent.userInfo.mobile?.substr(0, 3) || ''} **** ${agent.userInfo.mobile?.substr(7, 11) || ''
        }`
        : '',
      action: 'bindMobile',
      placeholder: agent.userInfo?.mobile
        ? global.$t('已绑定')
        : global.$t('未绑定'),
    },
    {
      title: global.$t('邮箱地址'),
      icon: 'email',
      value: '',
      action: 'bindEmail',
      placeholder: agent.userInfo?.email
        ? global.$t('已绑定')
        : global.$t('未绑定'),
    },
    {
      title: global.$t('在推广页展示'),
      icon: 'share',
      value: '',
      action: 'bindPopularize',
      placeholder: '',
    },
    // {
    //   title: global.$t('QQ号码'),
    //   icon: 'qq',
    //   value: '',
    //   action: 'bindInfo',
    //   placeholder: agent.userInfo?.qq ? global.$t('已绑定') : global.$t('未绑定'),
    // },
    // {
    //   title: global.$t('微信号码'),
    //   icon: 'wechat',
    //   value: '',
    //   action: 'bindInfo',
    //   placeholder: agent.userInfo?.wechat ? global.$t('已绑定') : global.$t('未绑定'),
    // },
    // {
    //   title: 'Skype',
    //   icon: 'skype',
    //   value: '',
    //   action: 'bindInfo',
    //   placeholder: agent.userInfo?.skype ? global.$t('已绑定') : global.$t('未绑定'),
    // },
    {
      title: global.$t('修改登录密码'),
      icon: 'lock',
      value: '',
      action: 'changePassword',
      placeholder: global.$t('已设置'),
    },
    {
      title: global.$t('支付密码'),
      icon: 'pay-password',
      value: '',
      action: 'changePayPassword',
      placeholder: agent.userInfo?.pay_password
        ? global.$t('已设置')
        : global.$t('未设置'),
    },
    {
      title: global.$t('添加银行卡'),
      icon: 'bank-card',
      value: '',
      action: 'goto:agentCardManagement',
      placeholder: agent.userInfo?.agent_bank?.length
        ? global.$t('已绑定')
        : global.$t('未绑定'),
    },

  ];

  if (subConfig.isCurrency) {
    inputList.value.push({
      title: global.$t('地区'),
      icon: 'region',
      value: '',
      action: '',
      readonly: true,
      placeholder: '',
    });
    inputList.value.push({
      title: global.$t('货币'),
      icon: 'currency',
      value: '',
      readonly: true,
      action: '',
      placeholder: '',
    });
  }
}
getInputList();

watch(
  () => agent.userInfo,
  () => {
    getInputList();
  },
  { immediate: true },
);

const { regionList, changeRegionId, currencyList } = useRegion();

watchEffect(() => {
  const { userInfo } = agent;
  changeRegionId(userInfo.inte_region_id);
  if (subConfig.isCurrency) {
    inputList.value[inputList.value.length - 2].placeholder = regionList.value?.find?.((item) => item.value === userInfo.inte_region_id)?.label;
    inputList.value[inputList.value.length - 1].placeholder = currencyList.value?.find?.((item) => item.value === userInfo.inte_currency_id)?.label;
  }
});

const router = useRouter();

const AgentContactInfo = () => global.$dialog({ tpl: 'AgentContactInfo' });
const AgentBindMobile = () => global.$popup({ tpl: 'AgentBindMobile', type: 'agent' });
const AgentBindEmail = () => global.$dialog({
  tpl: 'AgentBindEmail',
  type: 'agent',
  callback: () => {
    store.dispatch('agent/getUserInfo');
  },
});
const AgentResetPassword = () => global.$dialog({ tpl: 'AgentResetPassword' });
const AgentPopularize = () => global.$dialog({ tpl: 'AgentPopularize' });
const AgentChangePayPassword = () => global.$popup({
  tpl: 'AgentChangePayPassword',
  type: 'agent',
  userInfo: store.state?.agent?.userInfo ?? {},
  noOldPass: !agent.userInfo?.pay_password,
  title: '设置支付密码',
});

onMounted(() => {
  if (location.hash === '#login-password') {
    AgentResetPassword();
  } else if (location.hash === '#pay-password') {
    AgentChangePayPassword();
  } else if (location.hash === '#personal-information') {
    AgentContactInfo();
  }

  location.hash = '';
});

function handleInputClick(action) {
  if (action.indexOf('goto') === 0) {
    router.push({ name: action?.split(':')?.[1] });
  } else {
    switch (action) {
      case 'bindInfo':
        return AgentContactInfo();
      case 'bindMobile':
        return AgentBindMobile();
      case 'bindEmail':
        return AgentBindEmail();
      case 'changePassword':
        return AgentResetPassword();
      case 'bindPopularize':
        return AgentPopularize();
      case 'changePayPassword':
        return AgentChangePayPassword();
      default:
    }
  }
}
</script>

<style lang="less" scoped>
.input-item-list {
  background-color: var(--dark-000, var(--bg-color-f8f8f8));

  .input-item-wrap {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));

    &:nth-child(3),
    &:nth-child(6) {
      margin-bottom: 30px;

      :deep(.item-body-wrap) {
        border-bottom: none !important;
      }
    }
  }
}
</style>
