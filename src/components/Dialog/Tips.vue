
<template>
      <Dialog :title="$t('标题')" v-model:show="isShow" @onCancel="isShow = false" @onClose="isShow = false" :showFooter="false">
        <div class="agent-wallet-tips-wrap">
          <div class="p-text">{{$t('内容')}}</div>
          <div class="serve">{{$t('内容')}}</div>
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
</script>

<style lang="less" scoped>
.agent-wallet-tips-wrap {
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .img {
    text-align: center;
  }

  .p-text {
    color: var(--dark-fff, var(--font-color-222930));
    font-size: 28px;
    margin: 15px 0;
  }

  .serve {
    color: var(--theme-color);
  }
}
</style>
