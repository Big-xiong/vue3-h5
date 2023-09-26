<template>
    <div class="no-info-wrap">
      <div class="msg">{{$t("由于您未绑定手机号")}}</div>
      <div class="button-box">
        <van-button type="gray" @click="emit('update:step', 1)">{{$t("绑定资料")}}</van-button>
        <div class="px30"></div>
        <van-button type="gray" @click="$openKefu">{{$t("在线客服解决")}}</van-button>
      </div>
    </div>
</template>

<script setup>
import { inject, defineProps, defineEmits } from 'vue';

 const global = inject('global');

defineProps({
  step: Number,
});

const emit = defineEmits(['update:step']);
</script>

<style lang="less" scoped>
.no-info-wrap {
  .msg {
    margin: 60px auto;
    text-align: center;
    width: 670px;
    height: 80px;
    font-size: 28px;
    font-weight: 400;
    color: var(--theme-color);
    line-height: 40px;
  }

  .button-box {
    display: flex;

    :deep(.van-button:first-child) {
      margin-right: 15px;
    }
  }
}
</style>
