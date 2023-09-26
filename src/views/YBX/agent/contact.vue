<template>
  <div class="contact-wrap">
    <div class="contact-wrap-title">
      <p class="title-top">{{ $t('致力于为合营伙伴提供') }}</p>
      <p class="title-top">{{ $t('最全最顶尖的服务') }}</p>
    </div>
    <van-image :src="$getSrc('/src/assets/images/agent/affiliate/join_us_image@2x.png')" />
    <div class="contact-wrap-item">
      <div class="item" v-for="(i, index) in contracts" :key="index">
        <van-image :src="i.icon" alt="‘2’" />
        <div class="info_detail">
          <a :href="i.url" target="_blank">
            <p>{{ i.name }}</p>
            <h3>{{ i.contact }}</h3>
          </a>
        </div>
        <a
          href="javascript:;"
          class="btn"
          v-clipboard:copy="`${i.contact}`"
          v-clipboard:success="() => Toast.success('复制成功')"
          v-clipboard:error="() => Toast.fail('复制失败')"
        >{{ $t('复制') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  inject,
} from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useDicts } from '@/utils/hooks';

const contracts = ref([]);

useDicts('siteinfo', (info) => {
  if (info && 'business_cooperation' in info) {
    contracts.value = info.business_cooperation;
  }
}, { immediate: true });
</script>

<style lang='less' scoped>
.contact-wrap {
  position: relative;
  &-title {
    font-size: 48px;
    text-align: center;
    color: var(--font-color-5D6476);
    font-weight: 600;
    padding-top: 40px;
  }
  &-item {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 430px;
    padding: 0 28px;
    .item {
      width: 100%;
      padding: 15px 28px;
      box-sizing: border-box;
      background: var(--bg-color-white);
      margin-bottom: 20px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 1px 0 rgb(0 34 80 / 5%);
      .van-image {
        width: 80px;
        height: 80px;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 80px;
          right: -20px;
          top: 0;
          background: var(--border-color-51-01);
        }
      }
      .info_detail {
        flex: 1;
        padding-left: 40px;
        p,
        h3 {
          font-size: 28px;
          color: var(--font-color-000);
          font-weight: normal;
        }
        h3 {
          margin: 5px 0 0;
        }
      }
      .btn {
        display: block;
        width: 130px;
        line-height: 50px;
        border-radius: 8px;
        font-size: 24px;
        text-align: center;
        color: var(--theme-color);
        border: 1px solid var(--theme-color);
      }
    }
  }
}
</style>
