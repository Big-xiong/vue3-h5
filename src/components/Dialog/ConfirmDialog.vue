
<template>
      <van-dialog close-on-popstate :confirmButtonText="confirmText" :cancelButtonText="cancelText" v-model:show="isShow" show-cancel-button :message="message" class="confirm-dialog-wrap" @confirm="onConfirm" @cancel="onCancel">
        <template #title>
          <div class="title-wrap">
            {{ title }}
            <van-icon v-if="showCloseIcon" name="cross" @click="isShow = false"/>
          </div>
        </template>
      </van-dialog>
</template>

<script setup>
import { inject, ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';

 const global = inject('global');

const props = defineProps({
  title: String,
  confirmText: String,
  cancelText: String,
  message: String,
  confirm: Function,
  cancel: Function,
  showCloseIcon: Boolean,
});

const isShow = ref(false);
const router = useRouter();

function onConfirm() {
  props.confirm?.();
  isShow.value = false;
}

function onCancel() {
  props.cancel?.();
  isShow.value = false;
}

setTimeout(() => (isShow.value = true), 100);
</script>

<style lang="less">
.confirm-dialog-wrap {
  width: 90%;
  border-radius: 30px;

  .van-dialog__header {
    border-bottom: none;
  }

  .van-dialog__content {
    padding-bottom: 0;
    padding-top: 10px;

    .van-dialog__message {
      color: var(--font-color-646566) !important;
    }
  }

  .van-dialog__footer {
    padding-bottom: 20px;
  }

  .van-dialog__cancel {
    color: var(--dark-fff, var(--font-color-222930)) !important;
    background-color: var(--bg-color-353435) !important;
    border: none !important;
  }

  .van-icon {
    position: absolute;
    right: 30px;
    top: 20px;
  }
}
</style>
