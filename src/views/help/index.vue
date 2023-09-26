<template>
  <div class="help-wrap">
    <div class="item" @click="$router.push({ name: 'helpQuestion' })">
      <SvgIcon name="wenti" />
      <van-cell is-link :title="$t('常见问题')"></van-cell>
    </div>
    <div class="item" @click="$router.push({ name: 'helpManual' })">
      <SvgIcon name="youxi" />
      <van-cell is-link :title="$t('游戏手册')"></van-cell>
    </div>
    <div class="item" @click="$router.push({ name: 'helpSecurity' })">
      <SvgIcon name="anquan" />
      <van-cell is-link :title="$t('安全保障')"></van-cell>
    </div>
    <div class="item" @click="$router.push({ name: 'helpBrand' })">
      <SvgIcon name="pinp" />
      <van-cell is-link :title="$t('品牌实力')"></van-cell>
    </div>
    <div class="help-wrap-tip">
      {{ $t('没有找到解决办法') }}？{{ $t('联系') }}
      <span @click="$openKefu">{{ $t('专属客服') }}</span>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
</script>

<style lang="less" scoped>
.help-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-tip {
    font-size: 28px;
    font-weight: 400;
    text-align: center;
    color: var(--dark-fff, var(--font-color-666666));
    line-height: 40px;
    margin-top: 58px;
    span {
      text-decoration: underline;
      color: var(--theme-color);
      margin-left: -5px;
    }
  }
  .item {
    display: flex;
    align-items: center;
    .svg-icon-wrap {
      width: 58px;
      height: 58px;
    }
  }
}
:deep(.van-cell) {
  border-bottom: 2px solid var(--dark-333, var(--border-color-00001));
  color: var(--cur-font-color-fff, var(--dark-fff));
  padding: 40px 0;
  margin-left: 20px;
  font-weight: bold;
  .van-icon {
    color: var(--dark-fff);
  }
}
</style>
