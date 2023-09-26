<template>
  <div class="change-source" v-if="isDev">
    <van-switch v-model="sourceIsApp" size="24px" />
    <span>source={{ sourceIsApp }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  isDev: Boolean,
});
const router = useRouter();

const sourceIsApp = ref(false);

watch(sourceIsApp, () => {
  router.replace({ query: { source: sourceIsApp.value ? 'app' : '' } });
}, { immediate: true });
</script>

<style lang="less" scoped>
.change-source {
  position: fixed;
  right: 20px;
  bottom: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  >span {
    font-size: 12px;
  }
}
</style>
