<template>
  <Dialog
    :title="$t('钱包充值')"
    v-model:show="isShow"
    @cancel="isShow = false"
    @close="isShow = false"
    :showFooter="false"
    closeIcon
  >
    <div class="agent-wallet-tips-wrap">
      <van-icon name="warning" />
      <div class="p-text">{{ $t('代理钱包充值请联系') }}</div>
      <div class="server" @click="openKefu">{{ $t('在线客服') }}</div>
    </div>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import Dialog from './index.vue';

const isShow = ref(true);
const global = inject('global');

function openKefu() {
  isShow.value = false;
  global.$openKefu();
}
</script>

<style lang="less" scoped>
.agent-wallet-tips-wrap {
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 60px;

  .van-icon {
    font-size: 80px;
    color: var(--bg-color-c55055);
  }

  .p-text {
    color: var(--dark-fff, var(--font-color-222930));
    font-size: 28px;
    margin: 15px 0;
  }

  .server {
    color: var(--theme-color);
  }
}
</style>
