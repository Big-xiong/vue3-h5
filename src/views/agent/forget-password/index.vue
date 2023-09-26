<template>
    <div class="forget-password-wrap">
      <div class="forget-body">
        <Steps :step="step" v-if="step > 0"/>

        <div class="content-wrap">
          <UserNameStep v-model:userSafeInfo="userSafeInfo" v-model:step="step" v-if="step === 1"/>
          <!-- 没有绑定手机邮箱 -->
          <NoInfo :step="step" v-else-if="step === 0"/>

          <VerifyStep :userSafeInfo="userSafeInfo" @verifyType="verifyType = $event" v-model:step="step" v-if="step === 2"/>

          <ResetStep :step="step" v-show="step === 3" :type="verifyType" :userSafeInfo="userSafeInfo" @close="emit('close')"/>
        </div>
      </div>
    </div>
</template>

<script setup>
import {
  inject, ref, defineProps, defineEmits,
} from 'vue';
import { Toast } from 'vant';
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
const userSafeInfo = ref({});
const verifyType = ref(null);

</script>

<style lang="less" scoped>
.forget-password-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.forget-body {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0px 0px 100px 0px;

  :deep(.van-button--primary) {
    display: block;
    width: 690px;
    height: 90px;
    margin: 138px auto 0;
  }

  :deep(.van-field) {
    height: 100px;
    align-items: center;
    border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    background-color: var(--dark-transparent);

    .van-field__label {
      font-weight: bold;
      color: var(--dark-fff);
    }
    input {
      color: var(--dark-fff);
    }
  }
}
</style>
