<template>
  <van-dialog
    v-model:show="show"
    :title="title"
    @close="handleClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    :class="{
      'cancel-btn-style': cancelBtnStyle === 'other',
      'center-confirm-btn': centerConfirmBtn,
      'no-footer': !showFooter,
      'tips-dialog': tipsDialog,
      'no-title-bottom-border': !titleBottomBorder,
      'btn-group': btnGroup
    }"
    class="dialog-wrap"
    :beforeClose="onBeforeClose"
    close-on-click-overlay
    :show-confirm-button="showConfirmBtn"
    :confirm-button-text="confirmBtnText"
    :show-cancel-button="showCancelBtn"
    :cancel-button-text="cancelBtnText"
  >
    <div class="dialog-body" :style="{ padding: $attrs.contentPadding }">
      <van-icon class="close-icon" @click="closeDialog" v-if="closeIcon" name="cross"></van-icon>
      <slot />
    </div>
  </van-dialog>
</template>

<script setup>
import { inject, useAttrs } from 'vue';

const global = inject('global');

defineProps({
  closeIcon: Boolean,
  titleBottomBorder: {
    type: Boolean,
    default: true,
  },
  // 提示型弹窗，body的paddingBottom展示在弹窗底部
  tipsDialog: {
    type: Boolean,
    default: false,
  },
  // 以750为基准
  width: {
    type: Number,
    default: 640,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: () => inject('$t')('标题'),
  },
  showConfirmBtn: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showCancelBtn: {
    type: Boolean,
    default: false,
  },
  confirmBtnText: {
    type: String,
    default: () => inject('$t')('确定'),
  },
  cancelBtnText: {
    type: String,
    default: () => inject('$t')('取消'),
  },
  cancelBtnStyle: {
    type: String,
    default: 'cancel', // cancel | other
  },
  centerConfirmBtn: {
    type: Boolean,
    default: false,
  },
  btnGroup: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show', 'onCancel', 'onClose', 'onConfirm']);
const attrs = useAttrs();

function onBeforeClose() {
}

function closeDialog() {
  emit('update:show', false);
}

function handleCancel() {
  // emit('onCancel', closeDialog);
  closeDialog();
  if (!attrs?.unmount) emit('onClose', () => { });
}

function handleClose() {
  emit('onClose', closeDialog);
}

function handleConfirm() {
  emit('onConfirm', closeDialog);
}

defineExpose({
  handleCancel,
});
</script>

<style lang="less">
.no-footer {
  .van-dialog__footer {
    display: none !important;
  }
}

.dialog-wrap {
  width: 670px !important;
}
.btn-group {
  .van-dialog__footer {
    .van-button {
      width: 270px !important;
    }
  }
}

.van-dialog__footer {
  padding: 0 40px 50px;
  justify-content: space-between;
  // margin-top: 70px;

  &.van-hairline--top {
    .van-button {
      width: 270px;
    }
  }
  .van-button {
    // width: 280px;
    height: 90px;
    flex-grow: 0;
    flex-shrink: 0;
    flex: unset;
  }
  .van-dialog__cancel {
    // color: var(--theme-color);
    // border: solid 2px var(--theme-color);
    color: var(--font-color-bbbbbb);
    border: solid 2px var(---border-color-51-01,var(--font-color-bbbbbb));
  }
  .van-dialog__confirm {
    color: var(--font-color-ffffff);
    background-color: var(--theme-color);
  }
}

.van-dialog__header {
  padding-top: 0;
  height: 120px;
  line-height: 120px;
  font-size: 36px;
  color: var(--font-color-333333);
}

.no-title-bottom-border {
  .van-dialog__header {
    border-bottom: none !important;
  }
}

.tips-dialog {
  .van-dialog__content {
    padding-bottom: 0 !important;
  }

  .van-dialog__footer {
    padding: 0 30px 40px;
  }
}

.center-confirm-btn {
  .van-dialog__footer {
    display: flex;
    justify-content: center !important;
    .van-button {
      width: 590px;
      flex: unset;
      background-color: var(--theme-color);
      flex-grow: 0;
      display: block;
      border-radius: 8px;
      flex-shrink: 0;
      color: var(--font-color-ffffff);
    }
  }
}

.dialog-body {
  // padding: 0 60px 30px;
  color: var(--dark-fff-04, --font-color-333333);
  .close-icon {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 40px;
    color: var(--font-color-cccccc);
  }
}
</style>
