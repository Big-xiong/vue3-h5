<template>
  <Popup
    :showCancelBtn="true"
    :show="isShowPopup"
    :title="$t('绑定手机号')"
    position="center"
    @onClose="isShowPopup = false"
  >
    <div class="bind-mobile-wrap">
      <div class="header">{{ $t('为了保障你的资金安全，请绑定手机号') }}</div>
      <Form :columns="columns" ref="FormRef">
        <template #phoneArea>
          <div class="phone-area" @click="isShowAreaPopup = true">
            <span>+{{ areaCode }}</span>
            <van-icon name="arrow-down" />
          </div>
        </template>
        <template #mobileCode>
          <div>{{$t('验证码')}}</div>
        </template>
        <template #code>
          <van-button
            class="code-btn"
            type="plain"
            :disabled="isCounting"
            @click="sendCode"
            :loading="sendCodeLoading"
            :loading-text="$t('获取中')"
          >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
        </template>
      </Form>
      <!-- <div class="code-wrap">
        <input v-model="code" :placeholder="$t('请输入验证码')" />
        <van-button
          :disabled="isCounting"
          @click="sendCode"
          type="plain"
          :loading="sendCodeLoading"
        >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
      </div> -->

      <div class="btn-wrap">
        <van-button type="gray" @click="handleCancel">{{ $t('暂不绑定') }}</van-button>
        <van-button type="primary" @click="submit">{{ $t('确定') }}</van-button>
      </div>
    </div>

    <div class="tips">
      {{ $t('遇到问题') }} {{ $t('联系') }}
      <span @click="openKefu">{{ $t('专属客服') }}</span>
    </div>

    <phone-area-popup
      :areaCode="areaCode"
      v-model:show="isShowAreaPopup"
      @confirm="handleAreaConfirm($event)"
    />
  </Popup>
</template>

<script setup>
// @todo 确认输入验证码输入框
import {
  inject, reactive, ref, watch, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
// import { bindmobile } from '@/api/center';
import * as centerApis from '@/api/center';
// import { bindmobile as agentbindmobile, bindsmscode } from '@/api/agent';
import * as agentApis from '@/api/agent';

import PhoneAreaPopup from './PhoneAreaPopup.vue';
import Popup from './index.vue';

const isShowPopup = ref(true);
const isShowAreaPopup = ref(false);

const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const props = defineProps({
  type: {
    default: 'user',
    type: String,
  },
  userInfo: {
    default: () => { },
    type: Object,
  },
  onClose: {
    type: Function,
    default: () => { },
  },
});

const { userInfo } = $store.state[props.type];
const areaCode = ref(userInfo?.phone_area_code ?? '86');
const apis = props.type === 'user' ? centerApis : agentApis;
const code = ref('');

function handleAreaConfirm(val) {
  areaCode.value = val;
  isShowAreaPopup.value = false;
}

function openKefu() {
  isShowPopup.value = false;
  global.$openKefu();
}

const columns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请填写你的手机号'),
    prop: 'mobile',
    block: true,
    labelSlot: 'phoneArea',
    defaultValue: agent?.userInfo?.mobile ?? '',
    rule: [
      {
        message: global.$t('手机号格式有误'),
        required: true,
        trigger: 'blur',
        validator: (value) => /^1[3456789]\d{9}$/.test(value),
      },
    ],
  },
   {
    type: 'input',
    extraSlot: 'code',
    prop: 'code',
    block: true,
    labelSlot: 'mobileCode',
    placeholder: global.$t('请输入验证码'),
    rule: [
      {
        message: global.$t('验证码不能为空'),
        required: true,
        trigger: 'blur',
      },
    ],
  },
]);

// columns[0].defaultValue = props.userInfo?.mobile;

const FormRef = ref(null);
const route = useRoute();
const { run: postBindMobile, loading: bindLoadind } = useRequest(
  (params) => apis.bindmobile(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('绑定成功'));
      $store.dispatch(`${props.type}/getUserInfo`);
      isShowPopup.value = false;
      props.onClose?.();
    },
  },
);

function submit() {
  FormRef.value.form.validate()
    .then(() => {
      postBindMobile({
        ...FormRef.value.data,
        phone_area_code: areaCode.value,
        // code: code.value,
      });
    })
    .catch((error) => {
      Toast.fail(error[0]?.message);
    });
}

function handleCancel() {
  isShowPopup.value = false;
  props.onClose();
}

const { run: postSendSmsCode, loading: sendCodeLoading } = useRequest(
  (params) => apis.smscode(params),
  {
    manual: true,
  },
);

const isCounting = ref(false);
const seconds = ref(60);

const interval = ref(null);
async function sendCode() {
  if (isCounting.value) {
    return;
  }

  FormRef.value.form.validate('mobile').then(async () => {
    await postSendSmsCode({
      uid: userInfo.id,
      mobile: FormRef.value.data.mobile,
      phone_area_code: areaCode.value,
    });

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
  })
    .catch((error) => {
      Toast.fail(global.$t('手机号格式有误'));
    });
}
</script>

<style lang="less" scoped>
:deep(.van-cell::after) {
  border: none;
}
.bind-mobile-wrap {
  padding: 0 40px;
  width: 590px;

  .btn-wrap {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 30px;

    .van-button {
      width: 280px;
      height: 90px;
    }
  }

  .header {
    text-align: center;
    font-size: 28px;
    font-weight: 400;
    color: var(--font-color-666666);
    margin: 30px 0 10px;
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
    padding: 0 10px;
    input {
      text-align: left;
      /* padding-left: 20px; */
    }
  }
  .block-label {
    border: none;
  }

  [extraslot="code"] {
    padding-left: 30px !important;
  }

  [labelslot="phoneArea"] {
    .van-field__label {
      width: 140px !important;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: solid 2px var(--dark-333, var(--border-color-e7e7e7));

      .van-icon {
        height: 24px;
        font-size: 24px;
        margin-left: 15px;
      }
    }

    input {
      text-align: right;
      padding: 0 15px;
      color: var(--dark-fff, var(--font-color-222930));
    }
  }
  [labelslot="getCode"] {
    .van-field__label {
      width: 137px !important;
      font-size: 24px;
      display: flex;
      align-items: center;
      span {
        color: var(--font-color-fff);
      }
    }
  }

  [buttonslot="buttonSlot"] {
    margin-top: 24px;
    .van-button {
      border: 0;
      color: var(--theme-color);
      padding: 0;
      width: auto;
    }
    .van-field__label {
      width: auto;
    }
  }
  [extraslot="code"] {
    margin-top: 24px;
    .van-field__value input{
      text-align: right;
    }
    .van-button {
      width: auto;
      height: 70px;
      border: 0;
      width: auto;
      padding: 0 15px 0 40px;
      position: relative;
      &::after{
        content: '';
        width: 1px;
        height: 100%;
        position: absolute;
        left: 20px;
        top: 0;
        background: var(--dark-666, var(--border-color-00001));
      }
    }
    .van-field__label{
      width: auto !important;
      flex: 0 1 auto;
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

.code-wrap {
  display: flex;
  margin-top: 24px;
  input {
    width: 320px;
    box-sizing: border-box;
    height: 84px;
    border: 2px solid var(--dark-666, var(--border-color-00001));
    border-radius: 8px;
    font-size: 28px;
    padding-left: 20px;
    background-color: transparent;
    color: var(--dark-fff, var(--font-color-222930));
    &::placeholder {
      color: var(--dark-666, var(--font-color-999999));
    }
  }
  :deep(.van-button) {
    height: 84px;
    width: 240px;
    margin-left: 30px;
    .van-button__content {
      white-space: nowrap !important;
    }
  }
}
.van-button--default {
  color: var(--font-color-bbbbbb);
  border: 2px solid var(--dark-666, var(--border-color-cccccc));
}
:deep(.van-field__error-message) {
  display: none;
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
</style>
