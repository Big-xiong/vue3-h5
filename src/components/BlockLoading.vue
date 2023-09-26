<template>
  <div class="block-loading-wrap">
    <!-- <div class="spinner-wrap">
      <div class="spinner"></div>
    </div>
    <div class="logo" />-->
    <div class="van-loading van-loading--circular" data-v-77eda7a6>
      <span class="van-loading__spinner van-loading__spinner--circular">
        <svg class="van-loading__circular" viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" fill="none" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.block-loading-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .logo {
    width: 75px;
    height: 75px;
    background-image: url(/src/assets/images/common/loading-1.png);
    background-size: cover;
    border-radius: 50%;
  }

  > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
    transform: translate(-50%, -50%); /* 50%为自身尺寸的一半 */
  }

  .spinner-wrap {
    width: 115px;
    height: 115px;

    .spinner {
      width: 100%;
      height: 100%;
      animation: rotate 1s linear infinite;
      background-image: url(/src/assets/images/common/loading-2.png);
      background-size: cover;
      border-radius: 50%;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
