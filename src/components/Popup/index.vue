<template>
  <van-popup
    :show="show"
    :closeable="showCancelBtn"
    :position="position"
    :closeIcon="closeIcon"
    :round="round"
    close-on-click-overlay
    close-on-popstate
    @close="handleClose"
    @click-overlay="handleClose"
    @click-close-icon="emit('clickCloseIcon')"
    :class="{ 'no-default-width': noDefaultWidth, 'custom-close': customClose, 'theme-title': themeTitle, 'no-title-border': noTitleBorder }"
    class="popups-wrap"
    :close-icon-position="closeIconPosition"
  >
    <div class="popup-title-wrap" v-if="title">{{ title }}</div>
    <slot />
  </van-popup>
</template>

<script setup>
import { inject, defineEmits, defineProps } from 'vue';

const global = inject('global');

defineProps({
  customClose: {
    type: Boolean,
    default: false,
  },
  themeTitle: {
    type: Boolean,
    default: false,
  },
  noDefaultWidth: {
    type: Boolean,
    default: false,
  },
  noTitleBorder: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  round: {
    type: Boolean,
    default: true,
  },
  closeIcon: {
    type: String,
    default: 'cross',
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
    default: true,
  },
  closeIconPosition: {
    type: String,
    default: 'top-right',
  },
  position: {
    type: String,
    default: 'bottom',
  },
});

const emit = defineEmits(['update:show', 'onClose', 'clickCloseIcon']);

function closeDialog() {
  emit('update:show', false);
}

function handleClose() {
  closeDialog();
  emit('onClose');
}
</script>

<style lang="less">
.popup-title-wrap {
  width: 100%;
  color: var(--dark-fff, var(--font-color-333333));
  font-size: 32px;
  text-align: center;
  // border-bottom: 2px solid var(--dark-333, var(--bg-color-f1f1f1));
  height: 100px;
  line-height: 100px;
}

.theme-title {
  .popup-title-wrap {
    background: var(--theme-color);
    color: var(--font-color-ffffff);
  }

  .van-popup__close-icon {
    color: var(--font-color-ffffff) !important;
  }
}

.van-popup--center {
  &.no-default-width {
    width: unset;
  }
}

.van-popup__close-icon {
  color: var(--dark-9a9a9a, var(--font-color-666666)) !important;
}

.no-title-border {
  .popup-title-wrap {
    border: 0;
  }
}
</style>
