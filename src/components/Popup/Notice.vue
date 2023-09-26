<template>
  <van-popup position="top" :show="show" teleport="body" class="notice-popup">
    <div class="notice-wrap" :class="[`notice-wrap-${type}`]">
      <div class="title">{{ title }}</div>
      <div class="message">{{ message }}</div>
      <van-icon name="cross" @click="emit('update:show', false)"></van-icon>
    </div>
  </van-popup>
</template>

<script setup>
import { defineProps, defineEmits, inject } from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { readmessage } from '@/api/center';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:show']);
const global = inject('global');

function closeNotice() {
  if (props.id) {
    readNotice({ id: props.id });
  }
}
</script>

<style lang="less" scoped>
.notice-wrap {
  width: 690px;
  margin: 60px auto;
  border-radius: 8px;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.3);
  padding: 16px 16px 16px 20px;
  box-sizing: border-box;
  background-color: var(--bg-color-ffffff);
  position: relative;

  &-success {
    background-color: var(--theme-color);
    color: var(--font-color-ffffff);
  }

  &-error {
    background-color: var(--bg-color-c55055);
    color: var(--font-color-ffffff);
  }

  .title {
    font-size: 28px;
    font-weight: bold;
  }
  .message {
    font-size: 20px;
    margin-top: 6px;
  }

  .van-icon {
    font-size: 38px;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

<style>
.notice-popup {
  background-color: transparent !important;
}
</style>
