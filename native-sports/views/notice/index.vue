<template>
  <div class="sport-notice-wrap">
    <van-nav-bar
      :title="$t('公告')"
      :border="false"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <SvgIcon
          name="sport-clear"
          @click="handleReadAll"
        />
      </template>
    </van-nav-bar>
    <Empty
      :imgSrc="`/src/assets/native-sports/images/notice_empty.png`"
      :text="$t('暂无公告数据')"
      v-if="!siteNoticeList.length &&
      !loading"
    />
    <ul v-else>
      <li
        class="sport-card-wrap"
        v-for="(item, i) in siteNoticeList"
        :key="i"
        @click="router.push({ name: 'sport-notice-detail', params: { id: 1 }, query: item })"
      >
        <div class="notice-wrap-top">
          <i v-show="item.is_read !== 1" />
          <h4>
            {{ item.title }}
          </h4>
          <date>{{ item.publish_time }}</date>
        </div>
        <content>{{ item.content }}</content>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { inject, computed } from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';
import { readallnotice } from '/native-sports/api/home';
import Empty from '../../components/Empty.vue';

const global = inject('global');
global.$store.dispatch('app/getSiteNotice', { LOADING: true });

const siteNoticeList = computed(() => global.$store.state.app.siteNoticeList);

const router = useRouter();

const { t } = useI18n();

const { run: runAllRead, loading } = useRequest(readallnotice, {
  manual: true,
  onSuccess() {
    Toast(t('清除成功'));
    global.$store.dispatch('app/getSiteNotice');
  },
});

function handleReadAll() {
  runAllRead();
}

</script>

<style lang="less" scoped>
.sport-notice-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  .van-nav-bar {
    background: var(--dark-card-bg-color, var(--bg-color-fff)) !important;

    .sport-clear {
      width: 30px;
      height: 30px;
      fill: var(--dark-fff, var(--font-color-000));
    }
  }

  ul {
    padding: 20px 32px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

    li {
      margin-bottom: 20px;
    }
  }

  .sport-card-wrap {
    box-shadow: 0px 8px 22px 0px var(--card-shadow-color);
    background-color: var(--card-bg-color);
    border-radius: 12px;
    padding: 30px 32px 36px;
  }

  .notice-wrap-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    i {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: 18px;
      left: -16px;
      background: var(--message-dot-bg-color);
    }

    h4 {
      font-size: 32px;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      font-weight: bolder;
      text-overflow: ellipsis;
      max-width: 50%;

    }

    date {
      font-size: 24px;
      color: var(--font-color-848A9B);
    }
  }

  content {
    font-size: 28px;
    color: var(--font-color-848A9B);
    margin-top: 10px;
  }
}

:deep(.empty-wrap) {
  .van-image {
    width: 222px;
    margin-top: 190px;
  }
}
</style>
