<template>
  <div class="banner-wrap" :style="{ backgroundImage: `url(${$getSrc('/src/assets/images/home/error/error.png')})` }">
    <van-swipe lazy-render :autoplay="4000">
      <van-swipe-item v-for="image in bannerList" :key="image" @click="goPage(image, global)">
        <van-image lazy-load :src="image.h5_pic" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { indexbanner } from '@/api/app';
import { goPage } from '@/utils/hooks';

const global = inject('global');

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
});

const {
  data: bannerList,
  run,
} = useRequest(() => indexbanner({ game_cate_id: props.id }));

</script>

<style lang="less" scoped>
.banner-wrap {
  margin: 0 20px;
  height: var(--amx-home-banner-height,280px) !important;
  margin-top: var(--amx-home-banner-margin-top);
  background-size: var(--amx-home-game-loading-bg-size, 35% auto) !important;
  background-color: var(--amx-home-game-loading-bg-color, var(--dark-666, var(--bg-color-1f2d40))) !important;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;

  .van-swipe {
    .van-image {
      width: 100%;
      height: 100%;
      // width: 100vw;
      // height: 380px;
      object-fit: cover;
    }
  }
}
</style>
