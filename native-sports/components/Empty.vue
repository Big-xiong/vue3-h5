<template>
  <div class="empty-wrap">
    <img :src="$getSrc(imgSrc)" />
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无数据',
  },
  imgSrc: {
    type: String,
    default: '/src/assets/native-sports/images/focus-empty.png',
  },
});
</script>

<style lang="less" scoped>
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    color: var(--font-color-848A9A);
    font-size: 28px;
    margin-top: 34px;
  }
}
</style>
