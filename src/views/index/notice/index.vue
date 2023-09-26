<template>
  <div class="notify-wrap">
    <div class="notify-wrap-header">
      <div class="toggler">
        <span
          :class="{ active: tab === 'message' }"
          @click="tab = 'message'"
        >
          {{ $t('站内信') }}
          <em v-show="user.isLogin && messageUnReadNum > 0">{{ messageUnReadNum }}</em>
        </span>
        <span
          :class="{ active: tab === 'notice' }"
          @click="tab = 'notice'"
        >
          {{ $t('公告') }}
          <em v-show="user.isLogin && noticeUnReadNum > 0">{{ noticeUnReadNum }}</em>
        </span>
      </div>
    </div>
    <div class="notify-wrap-content">
      <div
        class="item"
        v-if="data[tab + 'List']?.length"
      >
        <van-list
          v-model="loading"
          :finished="data[`${tab}Finished`]"
          :immediate-check="false"
        >
          <van-cell
            v-for="item in data[tab + 'List']"
            :key="item.id"
            @click="gotoDetail(item)"
          >
            <template #title>
              <div class="notify-left">
                <van-badge :dot="(item.is_read * 1 === 0 && tab === 'notice') || (item.is_read * 1 === 1 && tab === 'message')">
                  <SvgIcon :name="`notice-${tab === 'message' ? 'mail' : 'annouce'}`" />
                </van-badge>
                <div class="info">
                  <span v-if="tab === 'message'">
                    <SvgIcon
                      name="notice-important"
                      v-show="item.is_important === 1"
                    ></SvgIcon>
                    <span>{{ globalAlertMaps[item.type] }}</span>
                  </span>
                  <span v-else>
                    <SvgIcon
                      name="notice-important"
                      v-show="item.is_important === 1"
                    ></SvgIcon>
                    <span>{{ item.title }}</span>
                  </span>
                  <span>{{ item.content }}</span>
                </div>
              </div>
            </template>
            <template #extra>
              <div class="notify-right">{{ item.updated_at.replace(/\ .+/, '') }}</div>
            </template>
          </van-cell>
        </van-list>
      </div>
      <div
        class="loading-wrap"
        v-else-if="tab === 'notice' ? noticeLoading : messageLoading"
      >
        <van-loading></van-loading>
      </div>
      <div
        class="empty layout-flex-column"
        v-else
      >
        <!--        <van-image fit="cover" class="notice-img" :src="$getSrc(`/src/assets/images/icon/xiaoxi.png`)" />-->
        <SvgIcon name="notice-empty" />
        <p>{{ tab === 'notice' ? $t('还没有公告') : $t('您还没有收到任何站内信') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, onUnmounted, ref, computed, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import {
  sitenotice, message,
} from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { app, user } = $store.state;

const tab = ref('notice');

// 已登录进入站内信  未登录进入公告 #12053
if (user.isLogin) {
  tab.value = app.lastNoticeType || 'message';
}

const data = reactive({
  messageList: [],
  noticeList: [],
  noticePage: 1,
  noticeTotal: 10,
  messageTotal: 10,
  messagePage: 1,
  noticeFinished: false,
  messageFinished: false,
});

function gotoDetail(detailData) {
  // 12416 产品需求未登录状态也记录已读公告状态，使用localStorage实现
  if (tab.value === 'notice' && !user.isLogin) {
    let ids = window.localStorage.getItem('haveReadNoticeIds') || '';
    ids = ids.length > 0 ? `${ids},` : '';
    window.localStorage.setItem('haveReadNoticeIds', ids + detailData.id);
  }
  $store.commit('app/SET_NOTICE_DATA', detailData);
  global.$router.push({
    path: '/details',
    query: {
      type: tab.value,
      messageType: detailData.type,
      is_read: detailData.is_read,
      id: detailData.id,
    },
  });
}

const messageUnReadNum = computed(() => data.messageList?.filter((item) => item.is_read === 1).length);
const noticeUnReadNum = computed(() => data.noticeList?.filter((item) => item.is_read === 0).length);
const globalAlertMaps = computed(() => $store.state.app.dicts.messagetypelist);
const { run: getMessage, loading: messageLoading } = useRequest(
  () => message({
    page: data.messagePage,
    uid: user?.userInfo?.id,
    is_pic: 0,
  }),
  {
    onSuccess(res) {
      data.messageList = res.data;
      data.messagePage = res.currentPage;
      data.messageTotal = res.total;
      data.messageFinished = true;
    },
  },
);

const { run: getNotice, loading: noticeLoading } = useRequest(
  () => sitenotice({
    uid: user?.userInfo?.id,
  }),
  {
    onSuccess(res) {
      data.noticeList = res.data.filter((item) => item.title.toLowerCase() !== 'image-type');
      data.noticeFinished = true;
      data.noticeList.sort((a, b) => dayjs(b.publish_time) - dayjs(a.publish_time));
      $store.dispatch('app/updateSiteNotice', data.noticeList);
    },
  },
);

watch(
  () => tab.value,
  (val) => {
    if (val === 'message') {
      getMessage();
    }
    // 记录最后点击tab页类型，其他界面返回时切换到对应tab
    $store.commit('app/LAST_NOTICE_TYPE', tab.value);
  },
);

watch(
  () => $store.state.app.noticeList,
  (val) => {
    if (user.isLogin) {
      data.noticeList = [].concat(val).sort((a, b) => a.is_important - b.is_important);
    } else {
      // 12416 产品需求未登录状态也记录已读公告状态，使用localStorage实现
      let ids = window.localStorage.getItem('haveReadNoticeIds') || '';
      let _noticeList = JSON.parse(JSON.stringify(val));
      _noticeList = _noticeList.sort((a, b) => a.is_important - b.is_important);
      if (ids.length > 0) {
        ids = ids.split(',');
        ids.forEach((id) => {
          _noticeList.map((item) => {
            if (item.id === Number(id)) {
              item.is_read = 1;
            }
          });
        });
      }
      data.noticeList = _noticeList.filter((item) => item.title.toLowerCase() !== 'image-type');
    }
  },
  { immediate: true },
);
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}

:deep(.van-badge--dot) {
  top: 10px;
  right: 15px;
  border: none;
}

.notify-wrap {
  display: flex;
  flex-direction: column;
  height: calc(100% - 92px);
  overflow: visible;

  &-header {
    display: flex;
    justify-content: center;
    padding: 0 0 32px 0;
    overflow: visible;
    background-color: var(--theme-color);

    .toggler {
      width: 686px;
      height: 64px;
      background: var(--bg-color-ffffff);
      border: solid 4px var(--bg-color-ffffff);
      border-radius: 32px;
      box-sizing: border-box;
      display: flex;

      span {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        border-radius: 32px;
        opacity: 0.6;
        position: relative;
        overflow: visible;

        &.active {
          opacity: 1;
          background-color: var(--theme-color);
          color: var(--font-color-ffffff);
        }

        em {
          position: absolute;
          background-color: var(--bg-color-c55055);
          color: var(--font-color-ffffff);
          display: flex;
          align-items: center;
          border-radius: 50%;
          justify-content: center;
          font-size: 20px;
          font-style: normal;
          left: 87%;
          width: 30px;
          height: 30px;
          top: 23%;
        }
      }
    }
  }

  &-content {
    height: calc(100% - 96px);
    overflow-y: auto;
    color: var(--dark-fff, var(--font-color-333333));
    > .item {
      height: 100%;
    }

    .empty {
      .svg-icon-wrap {
        width: 108px;
        height: 120px;
        margin-bottom: 40px;
        margin-top: 370px;
      }

      p {
        opacity: 0.6;
        font-size: 28px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-000000));
        line-height: 48px;
      }
    }

    .notify-right {
      opacity: 0.4;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: var(--dark-fff);
      position: absolute;
      top: 35px;
      right: 30px;
    }

    .notify-left {
      display: flex;
      align-items: center;

      .svg-icon-wrap {
        width: 64px;
        height: 64px;
        margin-right: 20px;
      }

      .info {
        display: inline-flex;
        flex-direction: column;
        width: calc(100% - 195px);

        span {
          display: inline;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dark-fff);
          align-items: center;
        }

        .svg-icon-wrap {
          width: 27px;
          height: 26px;
          margin-right: 5px;
          display: block;
          flex-shrink: 0;
        }

        span:nth-child(1) {
          font-size: 28px;
          font-weight: 500;
          line-height: 40px;
          display: flex;
          span {
            max-width: 400px;
          }
        }

        span:nth-child(2) {
          opacity: 0.6;
          font-size: 24px;
          font-weight: 400;
          width: 600px;
        }
      }
    }
  }
}

:deep(.van-cell) {
  padding-bottom: 0;
  padding-top: 0;
  .van-cell__title {
    border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7)) !important;
    padding-top: 28px;
    padding-bottom: 28px;
    width: 100%;
  }
}

.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  :deep(.van-loading) {
    display: flex;
    flex: 1;
    justify-content: center;
  }
}

:deep(.van-loading__circular) {
  color: var(--theme-color);
}
</style>
