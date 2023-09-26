<template>
  <Popup
    :show="show"
    :title="$t('验证手机号')"
    close-icon-position="top-right"
    closeIcon="cross"
    position="bottom"
    @close="onClose"
  >
    <div class="mobile-verify-wrap">
      <Form ref="mobileRef" :columns="mobileColumns">
        <template #phoneArea>
          <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
            <span>+{{ areaCode }}</span>
            <van-icon name="arrow-down" />
            <!-- <img
              :src="$getSrc(`/src/assets/images/down-caret.png`)"
              alt=""
            />-->
          </div>
        </template>
        <template #mobileIcon>
          <SvgIcon name="icon_shouji" />
        </template>
        <template #buttonSlot>
          <van-button
            :disabled="isCounting"
            @click="sendCode"
            :loading="sendCodeLoading"
          >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
        </template>
      </Form>

      <div class="button-wrap">
        <van-button type="gray" @click="emit('close')">
          {{
            $t("残忍拒绝")
          }}
        </van-button>
        <van-button type="primary" @click="submit">{{ $t("确定") }}</van-button>
      </div>

      <div class="footer-tips" @click="$openKefu">
        <p>
          {{ $t("遇到问题联系") }}
          <span>{{ $t("专属客服") }}</span>
        </p>
      </div>
    </div>
  </Popup>

  <PhonePopup
    :show="isShowAreaPopup"
    @confirm="onAreaCodeConfirm($event)"
    @close="isShowAreaPopup = false"
  />
</template>

<script setup>
import {
  defineProps, inject, ref, defineEmits, reactive, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Popup from '@/components/Popup/index.vue';
import PhonePopup from '@/components/Popup/PhoneAreaPopup.vue';
import Form from '@/components/Form/index.vue';
import { smscode } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const isShowAreaPopup = ref(false);
const { user } = $store.state;
const areaCode = ref(user?.userInfo?.phone_area_code || '86');
const emit = defineEmits(['close']);
const props = defineProps({
  show: Boolean,
  isRegisterCode: Number,
  registerType: Number,
});
const isRegisterCode = computed(() => props.isRegisterCode);
const registerType = computed(() => props.registerType);

const mobileColumns = computed(() => {
  const base = [
    {
      type: 'input',
      placeholder: global.$t('请填写您的手机号码'),
      prop: 'mobile',
      leftIconSlot: 'mobileIcon',
      block: true,
      labelSlot: 'phoneArea',
    },
  ];
  if (isRegisterCode.value === 4) {
    base.push({
      type: 'number',
      placeholder: global.$t('请输入验证码'),
      prop: 'code',
      buttonSlot: 'buttonSlot',
      block: true,
    });
  }
  return base;
});

function onClose() {
  emit('close');
}

const { run: postSendSmsCode, loading: sendCodeLoading } = useRequest(smscode, {
  manual: true,
});
const isCounting = ref(false);
const seconds = ref(60);
const mobileRef = ref({});

function onAreaCodeConfirm(event) {
  areaCode.value = event;
  isShowAreaPopup.value = false;
}

async function sendCode() {
  if (isCounting.value) {
    return;
  }
  const { data } = mobileRef.value;
  if (!/^1[3456789]\d{9}$/.test(data.mobile)) {
    Toast.fail(global.$t('手机格式有误'));
    return;
  }
  postSendSmsCode({
    mobile: mobileRef.value.data.mobile,
    phone_area_code: areaCode.value,
  });

  isCounting.value = true;
  seconds.value = 60;
  const interval = setInterval(() => {
    seconds.value -= 1;
    if (seconds.value === 0) {
      clearInterval(interval);
      isCounting.value = false;
      seconds.value = 60;
    }
  }, 1000);
}

function submit() {
  const { data } = mobileRef.value;
  if ((isRegisterCode.value === 3 || isRegisterCode.value === 4) && !/^1[3456789]\d{9}$/.test(data.mobile)) {
    Toast.fail(global.$t('手机格式有误'));
    return;
  }
  if (isRegisterCode.value === 4 && !data.code) {
    Toast.fail(global.$t('验证码输入有误'));
    return;
  }

  const registerInfo = {
    name: 'quick',
    data: {
      ...mobileRef.value.data,
      phone_area_code: areaCode.value,
    },
  };
  emit('close');
  if (registerType.value === 1) {
    $store.dispatch('user/register', registerInfo).then((result) => {
      emit('doRegisterAfter');
    });
  } else {
    emit('doRegisterAccount', {
      ...mobileRef.value.data,
      phone_area_code: areaCode.value,
    });
  }
}
</script>
<style scoped lang="less">
.footer-tips {
  width: 100%;
  height: 40px;
  font-size: 28px;
  font-weight: 400;
  line-height: 40px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--font-color-8C8C8C);

  p {
    margin: 0;
  }

  span {
    color: var(--theme-color);
    text-decoration: underline;
  }
}

.mobile-verify-wrap {
  box-sizing: border-box;
  padding: 30px;
  .phone-area {
    .van-icon-arrow-down {
      margin-left: 10px;
    }
  }
  :deep(.van-form) {
    .van-cell {
      border: 0;
      border-bottom: 2px solid var(--border-color-323232);
      text-align: left;
      height: 96px;
      margin-bottom: 0;
      padding: 0 !important;
      border-radius: 0;

      img {
        width: 50px;
        vertical-align: middle;
        margin-right: 20px;
      }

      .van-field__error-message {
        bottom: -35px;
      }
    }
    .svg-icon-wrap {
      width: 40px;
      height: 40px;
      margin-top: 10px;
    }
    .van-button {
      margin: 0;
      min-width: 240px;
      height: 70px !important;
      background-color: var(--theme-color);
      border-color: var(--theme-color);
      color: var(--font-color-fff);
    }

    [labelslot="phoneArea"] {
      .van-field__label {
        width: 140px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span,
        i {
          color: var(--font-color-000);
          flex: 1;
        }

        img {
          height: 24px;
          width: 30px;
          margin-left: 15px;
        }
      }
    }
  }

  .button-wrap {
    display: flex;
    margin: 30px 0;
    justify-content: space-between;

    :deep(.van-button) {
      width: 340px;
    }
  }
}
</style>
