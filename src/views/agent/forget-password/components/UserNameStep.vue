<template>
    <div class="user-name-wrap">
      <van-field v-model="username" :label="$t('代理账号')" input-align="right" :placeholder="`${$t('请输入您的')}${$t('万趣娱乐')}${$t('账号')}`"></van-field>
    </div>
    <van-button type="primary" :loading="checkLoading" :loading-text="$t('提交中...')" @click="checkUserInfo">{{$t("下一步")}}</van-button>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
 inject, ref, defineProps, defineEmits,
} from 'vue';
import { forgetpass } from '@/api/center';

const global = inject('global');

defineProps({
  userSafeInfo: {
    type: Object,
    default: () => ({}),
  },
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
      emit('update:step', 2);
    },
  },
);
</script>

<style lang="less" scoped>
.user-name-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 0;
  box-sizing: border-box;
  margin-bottom: 60px;

  .username {
    padding-left: 36px;
    background-color: var(--font-color-191919);
    display: flex;
    align-items: center;
    width: 100%;
  }

  :deep(.van-field) {
    background-color: var(--dark-bg-color-191919);
    padding: 0 30px;
    box-sizing: border-box;
  }

  input {
    padding: 0 20px;
    height: 88px;
    border-radius: 8px;
    background-color: var(--bg-color-191919);

    &::after {
      display: none;
    }
  }

  .img {
    width: 40px;
    height: 40px;
  }
}
</style>
