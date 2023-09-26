<template>
  <div class="home-wrap">
    <Home />
    <Notify />
    <DaliyDuty />
  </div>
</template>

<script setup>
import Home from './components/home.vue';
import Notify from './components/Notify.vue';
import DaliyDuty from '@/components/DaliyDuty.vue';
</script>

<style lang="less">
.home-wrap {
  width: 100vw;
  flex: 1;
  overflow-y: auto;
  height: 100%;
  transform: translateZ(0);

  &::-webkit-scrollbar {
    display: none;
  }

  .banner-wrap {

    .van-image__error,
    .van-image__img,
    .van-image__loading {
      border-radius: 12px;
    }
  }

  .home-wrap-bar-right {
    --bg-color-09111c: transparent;
  }
}

.index-footer-wrap {
  position: relative;
  box-shadow: 0px -5px 20px -5px rgba(var(--amx-footer-shadow-rgb, 216, 216, 216), 0.4);

}
</style>
