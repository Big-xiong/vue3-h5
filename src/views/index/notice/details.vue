<template>
  <div class="notify-wrap">
    <div class="notify-wrap-content">
      <div class="item">
        <van-cell>
          <template #title>
            <div class="notify-left">
              <SvgIcon :name="`notice-${route.query?.type === 'notice' ? 'annouce' : 'mail'}`" />
              <div class="info">
                <span v-if="type === 'notice'">{{ noticeData?.title }}</span>
                <span v-else>{{ globalAlertMaps[messageType] }}</span>
                <span>{{ noticeData?.updated_at?.replace(/\ .+/, '') }}</span>
              </div>
            </div>
          </template>
        </van-cell>
      </div>
      <p>{{ noticeData?.content }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, ref, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { readnotice, readmessage } from '@/api/news';
// import { getNoticeMessageType } from '@/utils';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const route = useRoute();
const $store = inject('store');
const { noticeData } = $store.state.app;
const globalAlertMaps = computed(() => $store.state.app.dicts.messagetypelist);

const type = ref('');
const messageType = ref(null);

const { run: noticeRun } = useRequest((params) => readnotice(params), {
  manual: true,
  onSuccess() {
    $store.dispatch('user/getUserInfo');
  },
});
const { run: messageRun } = useRequest((params) => readmessage(params), {
  manual: true,
  onSuccess() {
    $store.dispatch('user/getUserInfo');
  },
});

onMounted(() => {
  if ($store.state?.user?.isLogin) {
    type.value = route.query.type;
    messageType.value = route.query.messageType;
    if (route.query.type === 'notice' && route.query.is_read * 1 === 0) {
      const site_notice_id = route.query.id;
      // 本地更新公告已读状态，不依赖轮询接口
      $store.dispatch('app/updateSiteNoticeRead', site_notice_id);
      noticeRun({ site_notice_id });
    } else if (route.query.type === 'message' && route.query.is_read * 1 === 1) {
      const id = route.query.id;
      messageRun({ id });
    }
  }
});

</script>

<style lang="less" scoped>
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}
.notify-wrap {
  width: 100%;
  overflow: hidden;
  &-content {
    color: var(--dark-fff, var(--font-color-333333));
    .item {
      margin: 35px 0 0 10px;
    }
    p {
      word-break: break-all;
      white-space: pre-wrap;
      padding: 0 44px;
      box-sizing: border-box;
      width: 100%;
      text-align: left;
      font-size: 28px;
      font-weight: 400;
      line-height: 48px;
      overflow: hidden;
    }
    .notify-left {
      display: flex;
      align-items: center;
      .svg-icon-wrap {
        align-self: flex-start;
        width: 64px;
        height: 64px;
        margin-right: 20px;
      }
      .info {
        display: flex;
        flex-direction: column;
        color: var(--dark-fff, var(--dark-333));
        span:nth-child(1) {
          font-size: 28px;
          font-weight: 500;
          line-height: 40px;
        }
        span:nth-child(2) {
          font-size: 20px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
