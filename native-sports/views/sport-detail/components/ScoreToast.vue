<template>
  <div class="score-toast-wrap">
    <span>{{ teamInfo.homeName }}-{{ teamInfo.awayName }} {{ $t('进一球') }}</span>
  </div>
</template>

<script setup>
defineProps({
  teamInfo: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="less" scope>
.score-toast-wrap {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  padding: 0 32px;
  display: flex;
  height: 64px;
  position: absolute;
  top: 90px;
  align-items: center;
  min-width: 400px;
  justify-content: center;
  text-align: center;
  left: 50%;
  font-size: 24px;
  color: var(--font-color-fff);
  transform: translateX(-50%);
}
</style>
