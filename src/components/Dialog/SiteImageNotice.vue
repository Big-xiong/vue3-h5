<template>
  <div class="site-image-notice-wrap">
    <Dialog :show-confirm-button="false" :show-cancel-button="false" :show="true">
      <div class="dialog-content-wrap">
        <van-image fit="cover" :src="imageUrl" @click="go" v-if="imageUrl" />

        <van-icon name="close" @click="handleClose" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  defineEmits, inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

// const dialogRef = ref();

const global = inject('global');
const props = defineProps({
  notice: {
    default: () => ({}),
    type: Object,
  },
  callback: Function,
  unmount: Function,
});

const imageUrl = computed(() => {
  try {
    const content = JSON.parse(props.notice.content);
    return content.h5_pic;
  } catch (e) {
    return '';
  }
});

// const notice = ref([
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
// ]);

const isShowPopup = ref(true);
const $router = useRouter();

const emit = defineEmits(['update:modelValue', 'onClose']);

function handleClose() {
  // emit('onClose');
  // emit('update:modelValue', false);
  // isShowPopup.value = false;
  props.callback?.();
  props.unmount?.();
  // dialogRef.value.handleCancel();
}

function go() {
  /* if (!user?.isLogin) { */
  /*   Toast.fail(global.$t('请登录后查看')); */
  /*   return; */
  /* } */

  if (props.notice.pic_url_type === 1) {
    $router.push({ path: props.notice.pic_url });
  } else if (props.notice.pic_url_type === 2) {
    window.open(props.notice.pic_url, '_blank');
  }

  props.callback?.();
  props.unmount();
}
</script>

<style lang="less" scoped>
.site-image-notice-wrap {
  :deep(.van-dialog__header) {
    display: none;
  }

  :deep(.van-hairline--top) {
    display: none;
  }

  :deep(.van-image) {
    width: 100%;
    min-height: 200px;
    .van-icon {
      display: none;
    }
  }

  :deep(.van-popup) {
    background-color: transparent;
  }

  :deep(.dialog-content-wrap) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  :deep(.van-icon) {
    color: var(--font-color-ffffff);
    font-size: 60px;
    font-weight: normal;
    margin: 30px auto 0;
    display: block;
    text-align: center;
  }
}
</style>
