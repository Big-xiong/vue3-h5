<template>
  <div
    v-show="selectedOdds.length && display"
    class="parlay-wrapper"
    @click="router.push('/multi-bet')"
  >
    <img
      :src="$getSrc('/src/assets/native-sports/images/parlay-btn.png')"
      alt=""
    >
    <div class="red-dot">{{ selectedOdds.length }}</div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const route = useRoute();

const display = computed(() => {
  const path = ['/focus', '/home', '/sport-detail'];

  return path.includes(route.path);
});

const selectedOdds = computed(() => store.state?.app?.multipleOdds ?? []);
</script>

<style lang="less">
.parlay-wrapper {
  position: fixed;
  right: 0;
  bottom: 150px;
  width: 122px;
  height: 98px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
  background-color: var(--dark-393845, var(--bg-color-fff));

  img {
    width: 76px;
    height: 76px;
  }

  .red-dot {
    position: absolute;
    top: 10px;
    left: 68px;
    background-color: #D62726;
    width: 28px;
    height: 28px;
    border-radius: 100%;
    text-align: center;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: white;
  }
}
</style>
