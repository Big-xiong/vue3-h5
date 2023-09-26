<template>
  <div class="user-name-wrap step-wrap">
    <div :class="['input', 'username', focus ? 'focused' : 'un-focus']">
      <input
        type="text"
        @focus="focus = true"
        @blur="focus = false"
        v-model="username"
        :placeholder="`${$t('请输入您的{0}账号', [subConfig.title])}`"
      />
    </div>
  </div>
  <div class="step-one">
    <van-button
      :disabled="!username.length"
      type="success"
      :loading="checkLoading"
      :loading-text="$t('提交中...')"
      @click="checkUserInfo"
    >{{ $t("下一步") }}</van-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, ref, defineProps, defineEmits,
} from 'vue';
import { forgetpass } from '@/api/center';

const global = inject('global');
const subConfig = inject('subConfig');
const focus = ref(false);

defineProps({
  step: Number,
});

const username = ref('');
const emit = defineEmits(['update:userSafeInfo', 'update:step']);

const { run: checkUserInfo, loading: checkLoading } = useRequest(
  () => forgetpass({
    username: username.value,
  }),
  {
    manual: true,
    onSuccess(result) {
      emit('update:userSafeInfo', result);
      if (!result.email && !result.mobile && result.is_pass_answer === 1) {
        emit('update:step', 1);
      } else emit('update:step', 2);
    },
  },
);
</script>

<style lang="less" scoped>
.user-name-wrap {
  position: relative;
  display: flex;
  width: 100%;
  border: 0;
  box-sizing: border-box;
  margin-bottom: 60px;

  .username {
    background-color: var(--font-color-191919);
    width: 100%;
    height: auto;
    border-bottom: 2px solid var(--border-color-00001);
  }

  :deep(input) {
    height: 100px;
    background-color: var(--bg-color-191919);
    border: 0;
    width: 100%;
    font-size: 28px;
    &::after {
      display: none;
    }
  }

  .img {
    width: 40px;
    height: 40px;
  }
}
.step-one {
  width: 690px;
  .van-button {
    font-size: 32px;
  }
  :deep(.van-loading__circular) {
    color: var(--font-color-fff);
  }
}
</style>
