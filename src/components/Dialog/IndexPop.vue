<template>
  <div>
    <Dialog
      :title="$t('重要公告')"
      ref="dialogRef"
      v-model:show="modelValue"
      :show-confirm-button="false"
      :show-cancel-button="false"
      class="notice-wrap"
      @close="close"
    >
      <van-image
        :src="popData.pc_pop_pic"
        style="width: 100%;height: 400px"
        fit="contain"
        @click="go(popData.url)"
      />
    </Dialog>
  </div>
</template>

<script setup>
import {
  defineEmits, inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

const global = inject('global');
const $router = useRouter();
const dialogRef = ref();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  popData: {
    type: Object,
    default: () => ({}),
  },
});

// const emit = defineEmits(['update:modelValue', 'onClose']);
// function handleClose() {
//   // emit('onClose');
//   emit('update:modelValue', false);
// }
function go(url) {
  dialogRef.value.handleCancel();
  if (url.startsWith('http') || url.startsWith('//')) {
    window.open(url, 'thirdActivity');
  } else {
    $router.push({
      path: url,
    });
  }
}
function close() {
  dialogRef.value.handleCancel();
  window.sessionStorage.setItem('pop_status', true);
}
</script>
