<template>
  <van-popup
    :round="round"
    :show="showPopup"
    @close="emit('close')"
    @click-overlay="emit('close')"
    :teleport="teleport"
    :position="position"
  >
    <div class="popup-body">
      <div
        class="title-wrap"
        v-if="props.title"
      >
        <div class="title">{{ props.title }}</div>
        <div
          class="action"
          @click="emit('action')"
        >{{ props.action }}</div>
      </div>
      <slot />
    </div>
  </van-popup>
</template>

<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
  teleport: String,
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: 'bottom',
  },
  round: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['action', 'close']);

const showPopup = computed(() => props.show);
</script>

<style lang="less" scoped>
.popup-body {
  padding: 30px 32px;
}

.title-wrap {
  display: flex;
  padding-top: 12px;
  font-size: 32px;
  font-weight: 500;
  color: var(--dark-fff, var(--font-color-0A0A0A));
  justify-content: center;
  position: relative;

  .action {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 28px;
    font-weight: 400;
    color: var(--theme-color);
  }
}
</style>
