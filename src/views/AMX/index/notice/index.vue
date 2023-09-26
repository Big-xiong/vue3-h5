<template>
  <div class="notify-wrap">
    <van-nav-bar :title="$t('消息通知')" @click-left="$router.go(-1)" left-arrow></van-nav-bar>
    <div class="notify-wrap-body">
      <div class="notify-wrap-header">
        <div class="toggler">
          <div :class="{ active: tab === 'message' }" @click="tab = 'message'">
            <span>
              {{ $t('站内信') }}
              <em
                v-show="user.isLogin && messageUnReadNum > 0"
              >{{ messageUnReadNum }}</em>
            </span>
          </div>
          <div :class="{ active: tab === 'notice' }" @click="tab = 'notice'">
            <span>
              {{ $t('公告') }}
              <em v-show="user.isLogin && noticeUnReadNum > 0">{{ noticeUnReadNum }}</em>
            </span>
          </div>
        </div>
      </div>
      <div class="notify-wrap-content">
        <div class="item" v-if="data[tab + 'List']?.length">
          <van-list v-model="loading" :finished="data[`${tab}Finished`]" :immediate-check="false">
            <van-cell v-for="item in data[tab + 'List']" :key="item.id" @click="gotoDetail(item)">
              <template #title>
                <div class="notify-left">
                  <van-badge
                    :dot="(item.is_read * 1 === 0 && tab === 'notice') || (item.is_read * 1 === 1 && tab === 'message')"
                  >
                    <SvgIcon :name="`notice-${tab === 'message' ? 'mail' : 'annouce'}`" />
                  </van-badge>
                  <div class="info">
                    <div class="layout-flex-between">
                      <div>
                        <span v-if="tab === 'message'">
                          <SvgIcon name="notice-important" v-show="item.is_important === 1"></SvgIcon>
                          <span class="info-title">{{ globalAlertMaps[item.type] }}</span>
                        </span>
                        <span v-else>
                          <SvgIcon name="notice-important" v-show="item.is_important === 1"></SvgIcon>
                          <span class="info-title">{{ item.title }}</span>
                        </span>
                      </div>
                      <div class="notify-right">{{ item.updated_at.replace(/\ .+/, '') }}</div>
                    </div>

                    <div class="info-content">{{ item.content }}</div>
                  </div>
                </div>
              </template>
              <!-- <template #extra>
                <div class="notify-right">{{ item.updated_at.replace(/\ .+/, '') }}</div>
              </template>-->
            </van-cell>
          </van-list>
        </div>
        <div class="loading-wrap" v-else-if="tab === 'notice' ? noticeLoading : messageLoading">
          <van-loading></van-loading>
        </div>
        <div class="empty layout-flex-column" v-else>
          <!--        <van-image fit="cover" class="notice-img" :src="$getSrc(`/src/assets/images/icon/xiaoxi.png`)" />-->
          <SvgIcon name="notice-empty" />
          <p>{{ tab === 'notice' ? $t('还没有公告') : $t('您还没有收到任何站内信') }}</p>
        </div>
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

// const globalAlertMaps = inject('getNoticeMessageType');
const globalAlertMaps = computed(() => $store.state.app.dicts.messagetypelist);
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
  height: 100%;

  &-body {
    padding-bottom: 30px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &-header {
    display: flex;
    justify-content: center;
    overflow: visible;
    background-color: var(--theme-color);

    .toggler {
      width: 686px;
      height: 80px;
      background: var(--bg-color-ffffff);
      // border: solid 4px var(--bg-color-ffffff);
      border-radius: 32px;
      box-sizing: border-box;
      display: flex;

      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        border-radius: 32px;
        position: relative;
        overflow: visible;
        color: var(--font-color-ffffff);
        font-size: 28px;
        padding-bottom: 20px;
        box-sizing: border-box;

        &.active {
          background-color: var(--theme-color);
          color: var(--font-color-ffffff);
          font-size: 36px;

          &::after {
            content: "";
            position: absolute;
            width: 80px;
            height: 8px;
            background: var(--font-color-ffffff);
            bottom: 0 !important;
          }
        }

        span {
          position: relative;
        }

        em {
          position: absolute;
          background-color: var(
            --cur-color-notice-tag,
            var(--font-color-white)
          );
          color: var(--theme-color);
          display: flex;
          align-items: center;
          border-radius: 30px;
          justify-content: center;
          font-size: 20px;
          font-style: normal;
          left: calc(100% + 4px);
          min-width: 30px;
          height: 30px;
          padding: 0 10px;
          top: -0px;
          box-sizing: border-box;
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
        font-size: 28px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-000000));
        line-height: 48px;
      }
    }

    .notify-right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: var(--dark-fff);
      position: absolute;
      top: 28px;
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
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          display: inline;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--dark-fff);
          align-items: center;
        }
        .info-content {
          font-size: 24px;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-title {
          font-size: 28px;
          font-weight: 500;
          line-height: 40px;
          display: flex;
          span {
            max-width: 450px;
          }
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
            max-width: 450px;
          }
        }

        span:nth-child(2) {
          font-size: 24px;
          font-weight: 400;
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
