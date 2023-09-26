<template>
  <div class="discount-wrap">
    <van-nav-bar v-if="!meta?.hideOriginalHead" :safe-area-inset-top="true" :border="false" fixed>
      <template #title>
        <span>优惠</span>
      </template>
      <template #right>
        <SvgIcon @click="$openKefu()" name="kefu" />
      </template>
    </van-nav-bar>

    <div class="discount-wrap-order">
      <i ref="prevFilterRef"></i>
      <van-tabs v-model:active="tabActive" @change="handlerTab" offset-top="45px" :sticky="!isInViewport" swipeable :swipe-threshold="4">
        <van-tab v-for="(item, index) in tabList" :key="index" :title="item.title">
          <div class="discount-wrap-order-line"></div>
          <div class="discount-wrap-content">
            <van-list v-if="discountData?.length">
              <van-cell v-for="(item) in discountData" :key="item.id" @click="goDetail(item)">
                <van-image lazy-load fit="cover" class="img" :class="{ dark: isDark }" :key="item.h5_index_pic"
                  :src="item.h5_index_pic" />
                <div class="discount-wrap-title">
                  <span :class="getbType(item.b_type * 1, 'className')">{{ getbType(item.b_type * 1, 'text') }}</span>
                  <p>{{ item.name }}</p>
                </div>
                <div class="layout-flex-between subinfo">
                  <p>{{ item.h5_sub_title }}</p>
                  <div class="action">
                    <span>{{ $t("查看详情") }}</span>
                    <van-icon name="arrow" />
                  </div>
                </div>
              </van-cell>
            </van-list>
            <van-empty v-else-if="discountData" :description="$t('暂无红利')" class="empty">
              <template #image>
                <SvgIcon name="discount-empty" />
              </template>
            </van-empty>
            <div class="loading-wrap" v-else>
              <van-loading />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup>
import {
  inject, ref, watch,
} from 'vue';
import { useRequest, useInViewport } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { useDiscount, useLang } from '@/utils/hooks.js';

import { allbenefit } from '@/api/active';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const route = useRouter();
const { meta } = route.currentRoute.value;

const prevFilterRef = ref(null);
const isInViewport = useInViewport(prevFilterRef);
const tabList = [
  {
    title: global.$t('全部'),
    id: 0,
  },
  {
    title: global.$t('VIP红利'),
    id: 5,
  },
  {
    title: global.$t('新手红利'),
    id: 1,
  },
  {
    title: global.$t('专题红利'),
    id: 3,
  },
  {
    title: global.$t('常规红利'),
    id: 2,
  },
  {
    title: global.$t('限时红利'),
    id: 4,
  },
];
const allType = [
  { className: 'vip', text: 'VIP', type: 5 },
  { className: 'newbie', text: '新手', type: 1 },
  { className: 'topic', text: '专题', type: 3 },
  { className: 'time-limited', text: '限时', type: 4 },
  { className: 'regular', text: '常规', type: 2 },
];

const bType = ref(0);
const { getLangForImage } = useLang();

const tabActive = ref(0);

// const { handleUnSign } = useDiscount();
function getbType(type, name) {
  if (bType.value !== 0) return allType.find((item) => item.type === bType.value)?.[name];
  return allType.find((item) => item.type === type)?.[name];
}
function openCallBack() {
  global.$dialog({ tpl: 'HeaderCall' });
}

function handlerTab(index) {
  bType.value = tabList[index].id;
  tabActive.value = index;
}
function goDetail(item, bool) {
  const {
    id, url, type, name,
  } = item;

  const activityMaps = {
    // 玩趣聚宝盆
    52: 'interestRate',
    // 对冲基金
    53: 'fund',
    // vip多重礼金
    // 54: '',
    // 好友推荐
    55: 'invitation',
    // 签到活动
    56: 'sign',
    // 顶级模特、美女派送
    57: 'welfare',
    // 六重奖
    61: 'sixGift',
    // 借贷宝
    69: 'loanTreasure',
    // VIP专享福利
    70: global.$t('VIP专享福利'),
    // 新手注册
    // /activity/seminar
  };
  // 后台配置了url的
  if (url) {
    // 第三方链接url
    if (url.startsWith('http') || url.startsWith('//')) {
      window.open(url, 'thirdActivity');
    } else if (url.startsWith('/')) {
      global.$router.push({
        path: url,
        query: {
          id,
        },
      });
    } else {
      global.$router.push({
        path: url,
      });
    }
    return;
  }

  // 后台没有配置url
  if (id in activityMaps) {
    global.$router.push({
      name: activityMaps[id],
      query: {
        id,
      },
    });
    return;
  }
  if (type === 23) {
    global.$router.push({
      name: 'euroCup',
      query: {
        id,
      },
    });
    return;
  }

  global.$router.push({
    path: '/discount-detail',
    query: {
      id,
      title: name,
    },
  });
}
const {
  run,
  data: discountData,
  loading,
} = useRequest(
  () => allbenefit({ b_type: bType.value }),
  {
    formatResult(res) {
      return res.data;
    },
  },
);

watch(() => tabActive.value, () => {
  run();
});

const store = inject('store');
</script>

<style lang="less" scoped>
.discount-wrap {
  width: 100%;
  overflow-y: auto;

  :deep(.van-nav-bar.van-nav-bar--fixed) {
    .van-nav-bar__content {
      background-color: var(--color-122339);
      font-size: 26px;

      .van-nav-bar__title span {
        color: var(--font-color-ffffff);
      }

      .van-nav-bar__right {
        width: 46px;
        height: 38px;
        top: 25px;

        .svg-icon-wrap {
          fill: var(--theme-color) !important;
          height: 100%;
        }
      }
    }
  }

  &-order {
    width: 100%;

    &-line {
      width: 100%;
      height: 20px;
      background-color: var(--bg-color-f7f7f7);
    }
  }

  &-content {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.loading-wrap {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }

  :deep(.van-tabs__line) {
    width: 64px;
  }

  :deep(.van-sticky--fixed) {
    z-index: 9999;
    background-color: var(--color-122339);
  }

  :deep(.van-tabs__wrap) {
    padding-left: 30px;
    border-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }

  :deep(.van-tabs__nav) {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }

  :deep(.van-tab) {
    color: var(--font-color-999999);

    &--active {
      color: var(--theme-color);
    }
  }

  :deep(.van-list) {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }

  :deep(.van-cell) {
    margin-bottom: 30px;
    padding: 0;
    width: 100%;
    border-radius: 8px;
    background-color: var(--bg-color-09111c);

    .van-image {
      width: 100%;
      height: 240px;
    }
  }

  .discount-wrap-title {
    padding: 28px 30px;
    display: flex;
    align-items: center;

    p {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 32px;
      color: var(--font-color-ffffff);
    }

    span {
      width: 88px;
      height: 44px;
      border-radius: 4px;
      font-size: 24px;
      line-height: 44px;
      text-align: center;
      margin-right: 20px;

      &.vip {
        background: linear-gradient(90deg,
            rgba(200, 167, 127, 1) 0%,
            rgba(171, 138, 97, 1) 99%);
      }

      &.newbie {
        background: linear-gradient(135deg,
            rgba(255, 154, 93, 1) 0%,
            rgba(255, 57, 55, 1) 100%);
      }

      &.topic {
        background: linear-gradient(135deg,
            rgba(123, 133, 232, 1) 0%,
            rgba(85, 96, 209, 1) 100%);
      }

      &.regular {
        background: linear-gradient(135deg,
            rgba(70, 70, 70, 1) 0%,
            rgba(56, 56, 56, 1) 100%);
      }

      &.time-limited {
        background: linear-gradient(130deg,
            rgba(215, 93, 255, 1) 0%,
            rgba(181, 67, 226, 1) 100%);
      }
    }
  }

  .subinfo {
    height: 44px;
    padding: 0 30px 30px;

    p {
      padding-right: 20px;
      margin: 0;
      line-height: 40px;
      color: var(--cur-color-666666);
    }

    .action {
      color: var(--font-color-b1b1b1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 160px;
      height: 44px;
      white-space: nowrap;
    }

    .van-icon {
      font-size: 36px;
      color: var(--cur-color-666666);
      margin-left: 6px;
    }
  }
}

:deep(.van-tab) {
  margin-right: 60px;
  padding: 0;
}

:deep(.van-loading__circular) {
  color: var(--theme-color);
}
</style>
