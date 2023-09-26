<template>
  <div class="sport-notice-detail-wrap">
    <van-nav-bar
      :title="$t('公告详情')"
      :border="false"
      left-arrow
      @click="$router.back()"
    />
    <main>
      <h4>{{ route.query.title }}</h4>
      <content>
        {{ route.query.content }}
      </content>
      <date>{{ route.query.publish_time }}</date>
    </main>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';
import { readnotice } from '/native-sports/api/home';
import { useRequest } from 'ahooks-vue';

const route = useRoute();

if (route.query.is_read !== 1) useRequest(() => readnotice({ site_notice_id: route.query.id }));

</script>

<style lang="less" scoped>
.sport-notice-detail-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  .van-nav-bar {
    background: var(--dark-card-bg-color, var(--bg-color-fff)) !important;
  }

  main {
    padding: 20px 32px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 30px;
    margin-top: 20px;
    background: var(--dark-bg-color-18171D, var(--bg-color-fff));

    h4 {
      font-size: 32px;
      color: var(--dark-fff, --font-color-0A0A0A);
      margin-bottom: 10px;
    }

    content {
      font-size: 28px;
      color: var(--font-color-848A9B);
      margin-bottom: 48px;
      text-align: justify;
    }

    date {
      font-size: 24px;
      color: var(--font-color-848A9B);
      text-align: right;
    }
  }
}
</style>
