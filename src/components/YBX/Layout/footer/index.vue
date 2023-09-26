<template>
  <Footer :iconList="iconList" isImg />
</template>

<script setup>
import Footer from '@/components/Layout/footer/index.vue';

const iconList = {
  home: 'home',
  promos: 'discount',
  brand: 'brand',
  kefu: 'service',
  user: 'me',
};
</script>

<style lang="less">
.index-footer-wrap {
  width: 100%;
  background-color: var(--cur-color-fff);
  z-index: 99;

  &-other {
    background-color: var(--bg-color-122339);
  }

  .van-tabbar-item {
    color: var(--cur-color-666666);
    img{
      height: auto;
    }
    .icon-img {
      fill: var(--cur-color-666666);
    }
  }

  .van-tabbar-item--active {
    color: var(--theme-color);
    // background: var(--van-tabbar-item-active-background);
    background: var(--cur-color-000);
  }

 .van-tabbar {
    --van-tabbar-background-color: transparent;
    --van-tabbar-item-text-color: #666;
  }
}

</style>
