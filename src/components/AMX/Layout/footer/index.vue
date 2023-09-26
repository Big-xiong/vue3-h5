<template>
  <Footer :iconList="iconList" />
</template>

<script setup>
import Footer from '@/components/Layout/footer/index.vue';

const iconList = {
  home: 'home-tab1',
  promos: 'yinghangka',
  brand: 'brand',
  user: 'center-tab',
};

</script>

<style lang="less">
.index-footer-wrap {
  .van-tabbar {
    --van-tabbar-background-color: var(--cur-color-000);
  }

  .van-tabbar-item {
    color: var(--cur-color-666666);

    .icon-img {
      fill: var(--cur-color-666666);
    }
  }

  .van-tabbar-item--active {
    color: var(--theme-color);
    background: var(--cur-color-000);
  }
}
</style>
