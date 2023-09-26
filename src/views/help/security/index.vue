<template>
  <div class="security-wrap">
    <van-image class="license" :src="$getSrc(`/src/assets/images/help/pz@2x.png`)"></van-image>
    <p
      class="introduce"
    >{{ $t("{0}持有菲律宾（PAGCOR）合法博彩执照。该执照由菲律宾娱乐及博彩公（PAGCOR）所核发和监管，刹车提供网上扑克服务。（PAGCOR）是一家拥有合法经营权的公司。", [subConfig.title]) }}</p>
    <van-grid :border="true" :column-num="2">
      <van-grid-item>
        <div class="img-out">
          <van-image :src="$getSrc(`/src/assets/images/help/3.png`)"></van-image>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div class="img-out">
          <van-image :src="$getSrc(`/src/assets/images/help/1.png`)"></van-image>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div class="img-out">
          <van-image :src="$getSrc(`/src/assets/images/help/2.png`)"></van-image>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div class="img-out">
          <van-image :src="$getSrc(`/src/assets/images/help/4.png`)"></van-image>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const subConfig = inject('subConfig');
const global = inject('global'); </script>

<style lang="less" scoped>
.security-wrap {
  font-size: 32px;
  font-weight: 400;
  line-height: 44px;
  text-align: center;
  padding-bottom: 75px;
  box-sizing: border-box;

  .license {
    width: 439px;
    margin-top: 78px;
    margin-bottom: 60px;
  }

  .introduce {
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    color: var(--dark-fff, var(--font-color-333333));
    line-height: 48px;
    margin-bottom: 40px;
  }
  .bdt {
    border-top: 2px solid var(--border-color-18703);
  }

  :deep(.van-grid) {
    border: 2px solid var(--cur-color-2d2e2f);
    box-sizing: border-box;
    border-radius: 8px;
    &::after {
      display: none;
    }

    .van-grid-item {
      border: solid 2px var(--dark-333, var(--border-color-e7e7e7));
      &:nth-child(1) {
        border: none;
      }
      &:nth-child(2) {
        border-top: none;
        border-right: none;
        border-bottom: none;
      }
      &:nth-child(3) {
        border-right: none;
        border-left: none;
        border-bottom: none;
      }
      &:nth-child(4) {
        border-right: none;
        border-bottom: none;
      }
    }
    .van-grid-item__content {
      padding: 15px 20px;
      background-color: var(--dark-transparent) !important;
      box-sizing: border-box;
      .img-out {
        height: 100%;
        // border: 1px dashed var(--border-color-ccc);
        display: flex;
        align-items: center;
      }
      &::after {
        display: none;
      }
    }
  }
}
</style>
