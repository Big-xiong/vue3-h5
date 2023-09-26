<template>
  <div class="bankIcon">
    <van-image :src="bankIconUrl" />
  </div>
</template>

<script setup>
import { computed, defineProps, inject } from 'vue';
import { bankCodeData } from '@/utils';

const props = defineProps({
  bankCode: {
    default: 'ABC',
    type: String,
  },
});


const global = inject('global');
const { $getSrc } = global;
const store = inject('store');

const bankIconUrl = computed(() => $getSrc(`/src/assets/images/bank/bank_${props.bankCode}_logo.png`) || $getSrc(`/src/assets/images/bank/bank_ty_logo.png`));
</script>

<style lang="less" scoped>
.bankIcon {
  top: 0 !important;
  margin-right: 20px;
  height: 60px;
  width: 60px;
  background-color: var(--cur-bg-color-ffffff, var(--bg-color-ffffff));
  border-radius: 50%;

  :deep(.van-image) {
    height: 60px;
    width: 60px;
    background-color: var(--card-bg-color, var(--bg-color-fff));
    padding: 6px;
    border-radius: 50%;
    box-sizing: border-box;
  }
}
</style>
