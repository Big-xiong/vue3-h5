<template>
  <div class="my-outbox" ref="outbox">
    <div class="my-inbox" ref="movebox">
      <div class="my-listbox" v-for="(item,index) in sendVal" :key="index">
        <div class="my-title">
          {{ item.username }}
          <text class="my-utel" v-money="item.money"></text>
        </div>
      </div>
      <div
        class="my-listbox"
        v-for="(item,index) in sendVal"
        :key="(index + 1) * 100"
        v-if="isShow"
      >
        <div class="my-title">
          {{ item.username }}
          <text class="my-utel" v-money="item.money"></text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  watch, defineProps, inject, ref, onMounted,
} from 'vue';

const props = defineProps({
  sendVal: {
    type: Array,
    default: () => [],
  },
});
const isShow = ref(true);
const movebox = ref();
const outbox = ref();
const initTop = ref(0);
watch(() => props.sendVal, (val) => {
  if (val.length) {
    requestAnimationFrame(animateFn);
  }
}, { immediate: true });
onMounted(() => {
  // requestAnimationFrame(animateFn);
});
function animateFn() {
  initTop.value++;
  const moveTarget = movebox.value;
  const outboxs = outbox.value;
  if (outboxs.offsetHeight > (moveTarget.offsetHeight / 2)) {
    isShow.value = false;
    return;
  }
  if (initTop.value >= moveTarget.offsetHeight / 2) {
    initTop.value = 0;
  }
  moveTarget.style = `transform: translateY(-${initTop.value}px)`;
  requestAnimationFrame(animateFn);
}
</script>

<style lang="less" scoped>
.my-outbox {
  height: 250px;
  width: 350px;
  //margin: 20px;
  overflow: hidden;
  margin-left: 30px;
  .my-inbox {
    margin: 0 45px;
    .my-listbox {
      padding: 20px 0;
      font-size: 18px;
      .my-title {
        width: 210px;
        margin-bottom: 10px;
        clear: both;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .my-utel {
          font-size: 16px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
