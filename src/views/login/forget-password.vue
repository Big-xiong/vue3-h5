<template>
  <div class="forget-password-wrap">
    <div class="forget-password-wrap-navBar">
      <van-nav-bar :safe-area-inset-top="true" :border="false" :title="$t('忘记密码')">
        <template #left>
          <van-icon name="arrow-left" color="#fff" @click="router.go(-1)" />
        </template>
        <template #right>
          <SvgIcon @click="$openKefu" name="kefu" />
        </template>
      </van-nav-bar>
    </div>
    <div class="forget-password-wrap-content">
      <Steps :step="step" />

      <UserNameStep v-model:userSafeInfo="userSafeInfo" v-model:step="step" v-if="step === 1" />

      <!-- 没有绑定手机邮箱 -->
      <!-- <NoInfo :step="step" v-else-if="step === 0" /> -->
      <Dialog
        :title="$t('温馨提示')"
        v-model:show="show"
        @confirm="$openKefu"
        show-cancel-btn
        :btnGroup="true"
        closeIcon
        @cancel="show = false"
        @clickCloseIcon="show = false"
        :confirm-btn-text="$t('联系客服')"
        :contentPadding="`0 60px 30px`"
      >
        <p>{{ $t('由于您未绑定手机号、邮箱、未设置密保问题，无法验证修改密码，请尝试联系客服找回密码。') }}</p>
      </Dialog>

      <VerifyStep
        :userSafeInfo="userSafeInfo"
        @verifyData="verifyData = $event"
        @verifyType="verifyType = $event"
        v-model:step="step"
        v-if="step === 2"
      />

      <ResetStep
        :step="step"
        v-show="step === 3"
        :type="verifyType"
        :verifyData="verifyData"
        :userSafeInfo="userSafeInfo"
        @close="emit('close')"
      />
    </div>

    <FooterService />
  </div>
</template>

<script setup>
import {
  inject, ref, defineEmits, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import Steps from './components/SecurityStep.vue';
import UserNameStep from './components/UserNameStep.vue';
import VerifyStep from './components/VerifyStep.vue';
import ResetStep from './components/ResetStep.vue';
import Dialog from '@/components/Dialog/index.vue';
import FooterService from '@/components/FooterService/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const emit = defineEmits(['close']);

const step = ref(1);
const title = ref(global.$t('找回密码'));
const userSafeInfo = ref({});
const router = useRouter();
const show = ref(false);
const verifyType = ref(null);
const verifyData = ref({});

watch(() => userSafeInfo.value, (val) => {
  if (!val.email && !val.mobile && val.is_pass_answer === 1) {
    show.value = true;
  }
}, { immediate: true });

</script>

<style lang="less" scoped>
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}

:deep(.van-tab) {
  color: var(--font-color-ffffff);
  opacity: 0.5;
  font-size: 28px;
}

:deep(.van-tab--active) {
  opacity: 1;
}

:deep(.van-tabs__line) {
  background-color: var(--bg-color-ffffff);
  width: 104px;
}

:deep(.van-col--8) {
  text-align: center;
}

:deep(.van-checkbox__label) {
  color: var(--font-color-ffffff);
  font-size: 26px;
  font-weight: 500;
}

:deep(.van-checkbox__icon) {
  line-height: 45px;
}

:deep(.van-button--plain) {
  background: rgba(0, 0, 0, 0);
  color: var(--font-color-ffffff);
}

:deep(.van-button) {
  &:not(.send) {
    width: 100%;
  }
}

.forget-password-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* background-color: var(--dark-bg-color-000); */

  &-navBar {
    order: -1;

    .svg-icon-wrap {
      width: 48px;
      height: 48px;
      fill: var(--bg-color-ffffff);
    }
  }

  &-brand {
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 71px;
  }

  &-from {
    width: 100%;
    text-align: left;
    margin-top: 28px;

    &-lable {
      font-size: 36px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 50px;
    }

    &-item {
      p {
        color: var(--font-color-ffffff);
        font-size: 22px;
        text-align: right;
      }

      .phone {
        position: relative;

        :deep(.van-field__control) {
          padding-left: 120px;
        }

        &-line {
          width: 2px;
          height: 48px;
          background: var(--bg-color-d1d1d1);
          position: absolute;
          left: 120px;
          top: 88px;
        }

        .area-code {
          font-size: 32px;
          font-weight: 500;
          color: var(--font-color-404040);
          position: absolute;
          left: 30px;
          top: 60px;
        }
      }
    }

    .van-field {
      border-radius: 10px;
      height: 100px;
      margin-top: 8px;
    }

    .select {
      margin-top: 52px;
      position: relative;

      .arrow-icon {
        position: absolute;
        right: 40px;
        top: 90px;
      }
    }

    .password {
      margin-top: 52px;
      position: relative;

      img {
        width: 36px;
        height: 32px;
        position: absolute;
        right: 40px;
        top: 90px;
      }

      .get-area-code {
        position: absolute;
        right: 40px;
        top: 85px;
        font-size: 32px;
        font-weight: 500;
        color: var(--font-color-24c29a);
      }
    }

    .img-icon {
      width: 30px;
      height: 30px;
    }

    .remember-password {
      margin-top: 32px;
    }
  }

  &-content {
    width: 100vw;
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0 30px;
    /* padding: 0 36px 0 34px; */
    background: var(--dark-bg-color-000, var(--bg-color-ffffff));
    display: flex;
    flex-direction: column;
    align-items: center;

    :deep(.step-wrap) {
      background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
      color: var(--dark-fff, var(--font-color-000000));

      input {
        background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
        color: var(--dark-fff, var(--font-color-000000));
      }
    }
  }

  .login {
    margin: 70px 0 32px 0;
  }

  &-footer {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: var(--font-color-ffffff);
    line-height: 40px;
    margin: 32px 0 60px 0;

    .line {
      width: 2px;
      height: 58px;
      background: var(--bg-color-ffffff);
      margin: 0 66px 0 52px;
    }
  }

  :deep(.van-cell) {
    padding-top: 22px;
  }

  :deep(.bind-info) {
    margin-top: 30px;
  }

  :deep(.van-field__value) {
    display: flex;
    align-items: center;
  }
}
</style>
