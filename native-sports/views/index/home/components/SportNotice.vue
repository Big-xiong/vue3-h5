<template>
  <div class="sport-notice-wrap" v-show="siteNoticeList.length">
    <van-notice-bar :scrollable="false">
      <template #left-icon>
        <SvgIcon name="sport-notice_index" />
      </template>
      <!-- {{ siteNoticeList }} -->
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="(item, i) in siteNoticeList" :key="i"
          @click="$router.push({ name: 'sport-notice-detail', params: { id: 1 }, query: item })">{{ item.content }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
global.$store.dispatch('app/getSiteNotice');

const siteNoticeList = computed(() => global.$store.state.app.siteNoticeList.filter((item) => item.is_important === 1));
</script>

<style lang="less" scoped>
.sport-notice-wrap {
  background-color: var(--notice-bg-color);
  width: 686px;
  height: 48px;
  margin-bottom: 28px;

  .van-notice-bar {
    height: 48px;
    line-height: 48px;
    background: transparent;
    color: var(--notice-font-color);
    font-size: 24px;
    padding: 0 14px;

    .sport-notice_index {
      width: 26px;
      height: 20px;
      margin-right: 20px;
    }

    .notice-swipe {
      height: 48px;
      line-height: 48px;
    }
  }
}
</style>
