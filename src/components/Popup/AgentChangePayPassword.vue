<template>
  <Popup v-model:show="isShowPopup" position="center" @clickCloseIcon="isShowPopup = false" :showCancelBtn="true"
    :class="{ 'show-keyboard': showKeyboard }" :noDefaultWidth="false" :title="title">
    <template v-if="(userInfo?.is_valid_mobile === 2 || userInfo?.is_valid_email === 2 || userInfo?.is_pass_answer !== 1) && route.name === 'centerWithdraw' && step < 3">
      <div class="pay-password-step">
        <VerifyStep :userSafeInfo="userSafeInfo" v-model:step="step" />
      </div>
    </template>
    <template v-else>
      <div class="change-pay-password-wrap">
        <template
          v-if="(userInfo?.is_pay_password !== 1 && ((route.name === 'centerWithdraw' && step < 3) || route.name !== 'centerWithdraw') && !isVerifyOld) || (type === 'agent' && !noOldPass)">
          <p>{{ $t('请输入旧资金密码') }}</p>
          <van-password-input :value="password.old_password" :focused="inputIndex === 'old_password'" :gutter="10"
            @focus="handleShowKeyboard('old_password')" />
        </template>

        <template
          v-if="userInfo?.is_pay_password === 1 || isVerifyOld || (userInfo?.is_pay_password === 2 && route.name === 'centerWithdraw') || type === 'agent'">
          <p>{{ $t('请输入新资金密码') }}</p>
          <van-password-input :value="password.password" :focused="inputIndex === 'password'" :gutter="10"
            @focus="handleShowKeyboard('password')" />
          <p>{{ $t('确认新资金密码') }}</p>
          <van-password-input :value="password.repassword" :focused="inputIndex === 'repassword'" :gutter="10"
            @focus="handleShowKeyboard('repassword')" />
        </template>
      </div>
    </template>

    <FooterService :type="2" @toKefu="isShowPopup = false" v-show="hasFooter" />

    <van-number-keyboard v-model="password[inputIndex]" :show="showKeyboard" :maxlength="6" z-index="2100"
      @blur="showKeyboard = false" @hide="hideKeyboard" teleport="body" />
  </Popup>
</template>

<script setup>
// userInfo?.is_pay_password != 1 ? $t('验证旧资金密码') : $t('设置资金密码')
import {
  inject, reactive, ref, defineProps, computed, watch, onBeforeMount,
} from 'vue';
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { setpaypass as centerSetPay, forgetpass, checkpayoldpass as centerCheck } from '@/api/center';
import { setpaypass as agentSetPay, checkpayoldpass as agentCheck } from '@/api/agent';
import Popup from '@/components/Popup/index.vue';
import VerifyStep from '../../views/login/components/VerifyStep.vue';
import FooterService from '@/components/FooterService/index.vue';

const isShowPopup = ref(false);
const validateOld = ref(false);
const route = useRoute();
const step = ref(3);
const userSafeInfo = ref({});
const isVerifyOld = ref(false);

// setTimeout(() => {
//   isShowPopup.value = true;
// }, 100);

const password = reactive({
  password: '',
  old_password: '',
  repassword: '',
});

const props = defineProps({
  forget: {
    type: Boolean,
    default: false,
  },
  hasFooter: {
    type: Boolean,
    default: true,
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    default: 'user',
  },
  title: {
    type: String,
    default: '',
  },
  noOldPass: {
    type: Boolean,
    default: false,
  },
});

const global = inject('global');
const showKeyboard = ref(false);
const inputIndex = ref(false);
const $store = inject('store');
// const { user } = $store.state;

const title = computed(() => {
  if (props.userInfo?.is_pay_password !== 1 && !isVerifyOld.value && route.name !== 'centerWithdraw') {
    return global.$t('验证旧资金密码');
  }
  if (props.userInfo?.is_pay_password !== 1 && route.name === 'centerWithdraw' && step.value < 3) {
    return global.$t('身份验证');
  }
  if (props.title) {
    return global.$t('设置支付密码');
  }
  return global.$t('设置资金密码');
});

const {
  run,
  loading,
} = useRequest(
  (params) => (props.type === 'agent' ? agentSetPay : centerSetPay)(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('您的资金密码设置成功'));
      if (props.type === 'agent') {
        $store.dispatch('agent/getUserInfo');
      } else {
        $store.dispatch('user/getUserInfo');
      }
      isShowPopup.value = false;
    },
  },
);

const { run: checkPass } = useRequest(
  (params) => (props.type === 'agent' ? agentCheck : centerCheck)(params),
  {
    manual: true,
    onSuccess() {
      isVerifyOld.value = true;
    },
  },
);

watch(() => password.password, (val) => {
  if (val.length === 6) {
    handleShowKeyboard('repassword');
  }
});
watch(() => password.old_password, (val) => {
  if (val.length === 6) {
    // showKeyboard.value = false;
    if (props.type !== 'agent')checkPass({ old_password: val });
    handleShowKeyboard('password');
  }
});
watch(() => password.repassword, (val) => {
  if (val.length === 6) {
    showKeyboard.value = false;
  }
});

const { run: getSafeInfo } = useRequest(
  () => forgetpass({
    username: props.userInfo.username,
    LOADING: true,
  }),
  {
    manual: true,
    onSuccess(result) {
      userSafeInfo.value = result;
      if (props.forget) {
        step.value = 1;
      } else if (result.is_pass_answer === 1) {
        // step.value = 3;
        step.value = 1;
      } else {
        step.value = 1;
      }
      isShowPopup.value = true;
    },
  },
);

onBeforeMount(() => {
  if (props.type !== 'agent') {
    getSafeInfo();
  } else {
    isVerifyOld.value = true;
    setTimeout(() => {
      isShowPopup.value = true;
    }, 100);
  }
});

function handleShowKeyboard(index) {
  showKeyboard.value = true;
  inputIndex.value = index;
}

function hideKeyboard() {
  // 验证旧密码不做任何事
  if (props.userInfo?.is_pay_password !== 1 && step.value < 3 && !isVerifyOld.value && route.name !== 'centerWithdraw') {
    return;
  }

  if (
    password.password.length < 6
    || password.repassword.length < 6
    || (password.old_password.length < 6
      && password.old_password)
  ) {
    Toast.fail(global.$t('资金密码由6个数字组成'));
    return false;
  }
  if (password.password !== password.repassword) {
    Toast.fail(global.$t('您两次输入资金密码不同'));
    return false;
  }
  if (props.userInfo?.is_pay_password !== 1) {
    password.is_reset = 1;
  }
  run(password);
}
</script>

<style lang="less" scoped>
.pay-password-step {
  padding: 30px;

  :deep(.verify-step-wrap) {
    .bind-info {
      font-size: 30px;
    }

    p {
      font-size: 36px;
    }

    .code {
      input {
        background: transparent;
      }
    }

    .next {
      width: 100% !important;
    }

    .verification-wrap {
      border: 2px solid var(--dark-666, var(--border-color-e7e7e7));
      border-radius: 8px;
      margin-bottom: 24px;
      padding: 0 36px;

      input {
        display: block;
        min-width: 60px;
      }

      .van-icon {
        color: var(--dark-fff, var(--font-color-000000));
      }
    }
  }
}

.change-pay-password-wrap {
  width: 630px;
  margin: 22.5px auto 0;
  padding: 0 30px 30px;
  box-sizing: border-box;

  p {
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-222930));
    margin: 0;
    line-height: 80px;
  }

  .title {
    color: var(-font-color-f5f5f5);
    font-size: 36;
    text-align: center;
    border-bottom: 2px solid var(--font-color-343434);
  }
}
</style>
<style>
.show-keyboard {
  transform: translate(-50%, -500px) !important;
}
</style>
