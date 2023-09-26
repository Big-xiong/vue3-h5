<template>
  <Popup v-model:show="isShow" :position="subConfig.popupPosition" :title="$t('身份验证')">
    <div class="verify-identity-wrap">
      <div class="label">{{ $t('验证方式') }}</div>
      <van-field v-model="selectWay.text" readonly clickable @click="showVerifyWaysPopup = true">
        <template #right-icon>
          <van-icon name="arrow-down"></van-icon>
        </template>
      </van-field>
      <div
        class="label"
        v-if="selectWay.type === 'mobile'"
      >{{ $t('已绑定手机') }}:{{ userSafeInfo.mobile }}</div>
      <div
        class="label"
        v-if="selectWay.type === 'email'"
      >{{ $t('已绑定邮箱') }}:{{ userSafeInfo.email }}</div>
      <div
        class="label"
        v-if="selectWay.type === 'question'"
      >{{ $t('密保问题') }}:{{ question?.name || '' }}</div>
      <div class="code-wrap" v-if="selectWay.type !== 'question'">
        <van-field class="van-field" :placeholder="$t('请输入验证码')" v-model="code">
          <!-- <template #left-icon>
            <SvgIcon name="icon_yzm" />
          </template>-->
        </van-field>
        <van-button
          type="primary"
          :loading-text="$t('发送中')"
          :loading="sendCodeLoading"
          @click="sendCode"
        >
          {{
          codeText
          }}
        </van-button>
      </div>

      <van-field v-else :placeholder="$t('请输入密保答案')" v-model="answer" />

      <van-button
        type="primary"
        block
        class="submit-btn"
        :loading="submitLoading"
        :loading-text="$t('提交中')"
        @click="doVerify"
      >{{ $t('验证') }}</van-button>
    </div>

    <van-popup teleport="body" v-model:show="showVerifyWaysPopup" position="bottom" round>
      <van-picker
        show-toolbar
        @confirm="onVerifyWaysConfirm"
        @cancel="showVerifyWaysPopup = false"
        :columns="verifyWays"
      />
    </van-popup>
  </Popup>
</template>

<script setup>
import {
  reactive, ref, h, inject,
} from 'vue';
import { useVerify } from '@/utils/veirfyHelp.js';
import Popup from './index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const isShow = ref(false);
const props = defineProps({
  userSafeInfo: {
    type: Object,
    default: () => ({}),
  },
  onSuccess: {
    type: Function,
    default: () => { },
  },
});

setTimeout(() => isShow.value = true, 100);

const global = inject('global');
const subConfig = inject('subConfig');

const {
  submit,
  submitLoading,
  codeText,
  selectWay,
  verifyWays,
  answer,
  sendCodeLoading,
  sendCode,
  code,
  showVerifyWaysPopup,
  onVerifyWaysConfirm,
  question,
} = useVerify(props.userSafeInfo);

function doVerify() {
  submit()
    .then(() => {
      props.onSuccess?.();
      isShow.value = false;
    });
}
</script>

<style lang="less" scoped>
.verify-identity-wrap {
  box-sizing: border-box;
  padding: 42px 30px 76px;

  .label {
    color: var(--dark-fff, var(--font-color-333333));
    font-size: 28px;
    margin-bottom: 30px;
  }

  :deep(.van-icon) {
    font-size: 36px;
  }

  :deep(.van-field) {
    border: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    margin-bottom: 40px;

    .van-field__left-icon {
      display: flex;
      align-items: center;
    }
  }
  :deep(.van-field__control) {
    color: var(--dark-fff, var(--font-color-333333));
    &::placeholder {
      color: var(--font-color-000-4) !important;
    }
  }

  .code-wrap {
    display: flex;
    justify-content: space-between;
    .svg-icon-wrap {
      width: 44px;
      height: 44px;
    }

    :deep(.van-field) {
      width: 440px;
    }

    .van-button {
      width: 220px;
    }
  }

  img {
    width: 34px;
  }

  .submit-btn {
    height: 100px;
  }
}
</style>
