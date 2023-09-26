<template>
  <Popup
    :show="show"
    round
    :title="title"
    close-icon-position="top-left"
    @clickCloseIcon="onCloseIcon"
    @close="emit('close')"
    :closeIcon="step >= 2 ? 'arrow-left' : 'cross'"
  >
    <div class="forget-password-wrap">
      <Steps
        :step="step"
        v-if="step > 0"
      />

      <UserNameStep
        v-model:userSafeInfo="userSafeInfo"
        v-model:step="step"
        v-if="step === 1"
      />
      <!-- 没有绑定手机邮箱 -->
      <NoInfo
        :step="step"
        v-else-if="step === 0"
      />

      <VerifyStep
        :userSafeInfo="userSafeInfo"
        v-model:step="step"
        v-if="step === 2"
      />

      <ResetStep
        :step="step"
        v-show="step === 3"
        :userSafeInfo="userSafeInfo"
        @close="emit('close')"
      />
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, ref, defineProps, defineEmits,
} from 'vue';
import { Toast } from 'vant';
import Popup from '@/components/Popup/index.vue';
import Steps from './components/SecurityStep.vue';
import UserNameStep from './components/UserNameStep.vue';
import VerifyStep from './components/VerifyStep.vue';
import ResetStep from './components/ResetStep.vue';
import NoInfo from './components/NoInfo.vue';

defineProps({
  show: Boolean,
});

const global = inject('global');
const emit = defineEmits(['close']);

const step = ref(1);
const title = ref(global.$t('找回密码'));
const userSafeInfo = ref({});

function onCloseIcon() {
  if (step.value === 1) {
    emit('close');
  } else {
    step.value -= 1;
  }
}
</script>

<style scoped lang="less">
.forget-password-wrap {
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  padding: 30px 30px 100px 30px;

  :deep(.van-button) {
    display: block;
    width: 100%;
  }

  :deep(input) {
    height: 88px;
    line-height: 88px;
    border-radius: 8px;
    flex: 1;
    color: var(--font-color-ffffff);
    background-color: transparent;
    font-size: 32px;
  }

  :deep(.input) {
    padding: 0;
    height: 88px;
    border-radius: 8px;
    background-color: var(--bg-color-191919);
    display: flex;
    align-items: center;
    box-sizing: border-box;

    input {
      display: flex;
    }

    img {
      margin-left: 20px;
      width: 40px;
      height: 40px;
    }
  }
}
</style>
