<template>
    <Popup :show="isShow" class="photos-popup-wrap" close-icon-position="top-right" position="bottom" @onClose="isShow = false" :title="$t('修改头像')">
      <div class="photos-popup-wrap-content">
        <van-grid :border="false" :column-num="4">
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
        </van-grid>
        <van-grid :border="false" :column-num="4">
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
          <van-grid-item>
            <van-image :src="$getSrc(`/src/assets/images/home/ty_im@2x.png`)"/>
          </van-grid-item>
        </van-grid>
        <div class="item item1 layout-flex-center">{{ $t('从相册中选择') }}</div>
        <div class="item item2 layout-flex-center">{{ $t('拍照') }}</div>
      </div>
    </Popup>
</template>

<script setup>
import {
  inject, ref, defineProps, reactive, watchEffect,
} from 'vue';
import Popup from './index.vue';

const global = inject('global');

const isShow = ref(false);
setTimeout(() => {
  isShow.value = true;
}, 100);
</script>

<style lang="less" scoped>
:deep(.van-image) {
  width: 128px;
  height: 128px;
  img {
    border-radius: 50%;
  }
}
.photos-popup-wrap {
  &-content {
    padding: 30px;
    .item {
      width: 100%;
      height: 100px;
      font-size: 32px;
      font-weight: 400;
      color: var(--font-color-333333);
      line-height: 44px;
      border-top: 2px solid var(--border-color-00001);
    }
    .item1 {
      margin-top: 20px;
    }
    .item2 {
      border-bottom: 2px solid var(--border-color-00001);
      margin-bottom: 60px;
    }
  }
}
</style>
