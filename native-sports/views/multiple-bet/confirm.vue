<template>
  <van-popup
    :show="show"
    @click-overlay="emit('update:show', false)"
    round
  >
    <div class="confirm-wrap">
      <img
        :src="$getSrc('/src/assets/native-sports/images/confirm_icon.png')"
        alt=""
      >

      <div class="text">{{ $t('确定删除全部串关？') }}</div>

      <div class="btn-wrap">
        <van-button @click="emit('update:show', false)">{{ $t('取消') }}</van-button>
        <van-button @click="emit('confirm')">{{ $t('确定删除') }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
const emit = defineEmits(['update:show', 'confirm']);

const props = defineProps({
  show: Boolean,
});
</script>

<style lang="less">
.confirm-wrap {
  background-color: var(--card-bg-color, var(--bg-color-fff));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 630px;
  align-items: center;
  box-sizing: border-box;
  padding-top: 40px;
  padding-bottom: 46px;
  padding-left: 30px;
  padding-right: 30px;

  img {
    width: 68px;
    height: 68px;
  }

  .text {
    font-size: 28px;
    margin-top: 28px;
    color: var(--dark-fff, var(--font-color-0A0A0A));
  }

  .btn-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 42px;
    width: 100%;

    .van-button {
      width: 270px;
      height: 80px;
      padding: 0;
      border-radius: 8px;
      border: solid 2px var(--card-bg-color, var(--border-color-e2e2e2));

      &:nth-child(2) {
        margin-left: auto;
        border: none;
        background: var(--gradient-bg-color);
        color: var(--font-color-fff);
      }
    }
  }
}
</style>
