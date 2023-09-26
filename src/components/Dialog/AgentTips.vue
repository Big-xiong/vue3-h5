<template>
      <Dialog :title="title" v-model:show="isShow" @confirm="submit" centerConfirmBtn tipsDialog :confirm-btn-text="confirmText">
        <span class="tips-wrap" v-html="text"></span>
        <div class="message-wrap" v-html="message"></div>
      </Dialog>
</template>

<script setup>
import { inject, ref, defineProps } from 'vue';
import Dialog from './index.vue';

 const global = inject('global');

const props = defineProps({
  title: {
    type: String,
    default: () => window.$t('温馨提示'),
  },
  confirmText: {
    type: String,
    default: () => window.$t('确认'),
  },
  message: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  confirm: {
    type: Function,
    default: () => { },
  },
});

const isShow = ref(true);
function submit() {
  props.confirm?.();
  isShow.value = false;
}
</script>

<style lang="less" scoped>
.tips-wrap {
  padding: 0 40px;
  font-size: 28px;
  color: var(--font-color-fff);
  text-align: center;
}
.message-wrap {
  padding: 0 40px 40px 42px;
  font-size: 28px;
  color: var(--font-color-999999);
  text-align: center;
}
</style>
