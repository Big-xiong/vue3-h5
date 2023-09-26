<template>
  <Popup
    :showCancelBtn="true"
    :show="isShowPopup"
    @clickCloseIcon="isShowPopup = false"
    :title="$t('绑定邮箱')"
    position="center"
    @onClose="isShowPopup = false"
  >
    <div class="bind-mobile-wrap">
      <div class="header">{{ $t('为了保障你的账号安全，请绑定邮箱号') }}</div>

      <Form :columns="columns" ref="FormRef">
        <template #email>
          <div>{{$t('邮箱')}}</div>
        </template>
        <template #emailCode>
          <div>{{$t('验证码')}}</div>
        </template>
        <template #code>
          <van-button
            class="code-btn"
            @click="sendCode"
            :loading="sendCodeLoading"
            :loading-text="$t('获取中')"
          >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
        </template>
      </Form>

      <div class="btn-wrap" :class="{ 'no-cancel': !showCancel }">
        <van-button v-show="showCancel" type="default" @click="isShowPopup = false">{{ $t('暂不绑定') }}</van-button>
        <van-button type="success" @click="submit">{{ $t('确定提交') }}</van-button>
      </div>

      <div class="tips">
        {{ $t('遇到问题') }} {{ $t('联系') }}
        <span @click="openKefu">{{ $t('专属客服') }}</span>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import { bindemail, setemail } from '@/api/center';
import Popup from './index.vue';

const isShowPopup = ref(true);

const global = inject('global');
const $store = inject('store');

const props = defineProps({
  userInfo: {
    default: () => {
    },
    type: Object,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  onClose: Function,
});

// const { userInfo } = $store.state.agent;
const areaCode = ref(86);

function openKefu() {
  isShowPopup.value = false;
  global.$openKefu();
}

const columns = reactive([
  {
    type: 'input',
    prop: 'email',
    placeholder: global.$t('请填写您的邮箱地址'),
    defaultValue: props.userInfo?.email ?? '',
    block: true,
    labelSlot: 'email',
    rule: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    type: 'input',
    extraSlot: 'code',
    prop: 'code',
    block: true,
    labelSlot: 'emailCode',
    placeholder: global.$t('请输入验证码'),
    rule: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
]);

columns[0].defaultValue = props.userInfo?.email ?? '';

const FormRef = ref(null);
const route = useRoute();

const {
  run: postBindEmail,
  loading: bindLoadind,
} = useRequest(bindemail, {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('绑定成功'));
    isShowPopup.value = false;
    $store.dispatch('user/getUserInfo');
    props.onClose?.();
  },
});

function submit() {
  if (!FormRef.value.data.code) {
    Toast.fail(global.$t('验证码不能为空'));
    return;
  }

  postBindEmail({
    ...FormRef.value.data,
    phone_area_code: areaCode.value,
  });
}

const isCounting = ref(false);
const seconds = ref(60);

const interval = ref(null);

const {
  run: postSendEmailCode,
  loading: sendCodeLoading,
} = useRequest(
  setemail,
  {
    manual: true,
    onSuccess() {
      isCounting.value = true;
      seconds.value = 60;
      interval.value = setInterval(() => {
        seconds.value -= 1;
        if (seconds.value === 0) {
          clearInterval(interval.value);
          isCounting.value = false;
          seconds.value = 60;
        }
      }, 1000);
    },
  },
);
async function sendCode() {
  if (isCounting.value) {
    return;
  }

  if (!FormRef.value.data.email) {
    Toast.fail(global.$t('邮箱号不能为空'));
    return;
  }

  const result = await postSendEmailCode({
    uid: props.userInfo.id,
    ...FormRef.value.data,
  });
}
</script>

<style lang="less" scoped>
:deep(.van-cell::after) {
  border: none;
}

.bind-mobile-wrap {
  box-sizing: border-box;
  padding: 0 30px;

  .btn-wrap {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;

    .van-button {
      width: 320px;
    }

    &.no-cancel {
      .van-button {
        width: 100%;
        margin-left: 0;
      }
    }
  }

  .header {
    text-align: center;
    font-size: 28px;
    font-weight: 400;
    color: var(--font-color-666666);
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .tips {
    height: 40px;
    line-height: 40px;
    font-size: 26px;
    text-align: center;
    color: var(--font-color-525152);
    padding-bottom: 30px;

    span {
      text-decoration: underline;
      color: var(--font-color-24c29a);
    }
  }
}

:deep(.config-form-wrap) {
  .van-field {
    background-color: var(--bg-color-191919);
    height: 88px;
    border: 2px solid var(--dark-666, var(--border-color-00001));
    border-radius: 8px;

    input {
      text-align: right;
      /* padding-left: 20px; */
    }
  }

  .van-field__label {
    display: none;
  }

  .block-label {
    border: none;
  }

  [extraslot="code"] {
    padding-left: 30px !important;
    margin-top: 24px;

    .van-button {
      height: 68px;
      margin-right: 4px;
      color: var(--theme-color);
      border: none;
      font-size: 26.5px;
      font-weight: normal;
      padding: 0;
      width: auto;
    }
  }
}

.van-button {
  width: 310px;
  height: 80px;
  border-radius: 8px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}

.van-button--success {
  background-color: var(--bg-color-24c29a);
  margin-left: 30px;
  border: none;
}

.van-button--default {
  color: var(--font-color-bbbbbb);
  border: 2px solid var(--dark-666, var(--border-color-cccccc));
  opacity: 1;
}
:deep(.config-form-wrap){
  [labelslot="email"],[labelslot="emailCode"] {
    .van-field__label {
      width: auto !important;
      display: flex;
      align-items: center;
    }
  }
  [extraslot="code"] .van-button{
    margin-right: 0;
    margin-left: 40px;
    position: relative;
    &::after{
      content: '';
      width: 1px;
      height: 100%;
      position: absolute;
      left: -20px;
      top: 0;
      background: var(--dark-666, var(--border-color-00001));
    }
  }
}
</style>
