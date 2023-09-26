<template>
  <div class="user-name-wrap">
    <div class="input username">
      <SvgIcon name="icon_user" />
      <input
        type="text"
        v-model="username"
        :placeholder="`${$t('请输入您的')}${subConfig.title + $t('娱乐')}${$t('账号')}`"
      />
    </div>
  </div>
  <div class="step-one">
    <van-button
      :type="username.length ? 'primary' : 'gray'"
      :loading="checkLoading"
      :loading-text="$t('提交中...')"
      @click="checkUserInfo"
    >{{ $t("下一步") }}</van-button>
  </div>
</template>

<script setup>
import {
  inject, ref, defineProps, defineEmits,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { forgetpass } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const subConfig = inject('subConfig');
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

<style scoped lang="less">
.user-name-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 0;
  box-sizing: border-box;
  margin-bottom: 60px;

  .username {
    background-color: var(--font-color-191919);
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;

    .svg-icon-wrap {
      width: 34px;
      height: 34px;
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  input {
    padding: 0 20px;
    height: 88px;
    border-radius: 8px;
    background-color: var(--bg-color-191919);
    text-indent: 60px;
    border: 1px solid var(--border-color-cccccc);

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
