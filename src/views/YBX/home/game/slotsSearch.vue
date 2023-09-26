<template>
  <div class="slots">
    <div class="slot-banner">
      <van-image
        :src="bannerPic ?? $getSrc('/src/current_project/assets/images/home/slots/banner.png')"
        class="banner"
      ></van-image>
    </div>
    <!-- 最新爆奖 -->
    <div class="jackpot">
      <img
        :src="$getSrc('/src/current_project/assets/images/home/slots/light@2x.png')"
        class="light"
      />
      <img
        :src="$getSrc('/src/current_project/assets/images/home/slots/light2@2x.png')"
        class="light2"
      />
      <div class="jackpot-text" v-if="state.jackpotSettings?.startVal">
        <h3>
          <dfn>
            CNY
            <span></span>
          </dfn>
          <count-to
            :duration="state.jackpotSettings?.duration"
            :decimals="state.jackpotSettings?.decimals"
            :startVal="state.jackpotSettings?.startVal"
            :endVal="state.jackpotSettings?.endVal"
          />
        </h3>
        <p>{{ $t("奖金池数值") }}</p>
      </div>
    </div>

    <van-sticky :offset-top="0" class="header-sticky">
      <nav class="filter-nav">
        <van-tabs
          v-model="active"
          line-height="2px"
          :ellipsis="false"
          @click="onTabChange"
          swipeable
        >
          <van-tab v-for="item in navs" :title="$t(item.title)" :key="item.name" />
        </van-tabs>
        <div class="search">
          <SearchTrigger
            class="seach-icon"
            :category="state.cateId"
            :nav="nav"
            :payforline="state.payforline"
            :platform="platform"
          />
          <span>{{ $t('搜索') }}</span>
        </div>
      </nav>

      <div class="filters" v-show="active !== 4">
        <div class="labels platform">
          <div>
            <label
              class="labels-all"
              :class="{ active: !platform }"
              @click="onPlatformClick(null)"
            >{{ $t('全部平台') }}</label>
            <template v-for="(item, index) in platformsSlot">
              <label
                v-if="['ALLBET'].indexOf(item.name) === -1"
                :key="index"
                :class="{ active: platform && platform.id === item.id }"
                @click="onPlatformClick(item)"
              >{{ item?.code ? item.code.toUpperCase() : item.name }}</label>
            </template>
          </div>
        </div>
        <div class="labels">
          <label
            :class="{ active: !state.payforline }"
            @click="onPayforlineClick(null)"
          >{{ $t('全部赔付线') }}</label>
          <label
            v-for="(val, key) in state.payforlineData"
            :key="key"
            :class="{ active: key === state.payforline }"
            @click="onPayforlineClick(key)"
          >{{ val.replace("线", "") }}</label>
        </div>
      </div>
    </van-sticky>
    <van-list
      class="games"
      :class="active === 4 ? 'mysave' : ''"
      v-model="loading"
      :finished="finished"
      :finished-text="lists?.length ? $t('不要滑了，已经到底了！') : ''"
      @load="onLoad"
      :immediate-check="false"
    >
      <template v-if="lists?.length">
        <van-cell v-for="(item, index) in lists" :key="index">
          <div class="game-item" slot="default">
            <van-image :src="item.pic" fit="cover" lazy @click="$playGame(item)" />
            <template v-if="nav && nav.name === 'latest'">
              <span v-if="item.is_new" :class="['tag', 'new']">new</span>
              <span v-else-if="item.is_hot" :class="['tag', 'hot']">hot</span>
            </template>
            <template v-else>
              <span v-if="item.is_hot" :class="['tag', 'hot']">hot</span>
              <span v-else-if="item.is_new" :class="['tag', 'new']">new</span>
            </template>
            <div class="info">
              <h3>
                <span v-if="getPlatformNameById(item.game_platform_id)">
                  {{
                    getPlatformNameById(item.game_platform_id)
                  }}
                </span>
                {{ item.name }}
              </h3>
            </div>
            <span class="action">
              <van-icon
                @click="doFavorite(item.id, index)"
                :name="
                  item.is_favorite === 2 ? 'like-o' : token ? 'like' : 'like-o'
                "
              />
            </span>
          </div>
        </van-cell>
      </template>
      <template v-else>
        <div class="empty-game">
          <!-- <img
            :src="$getSrc('/src/current_project/assets/images/home/error/kong@2x.png')"
            alt
          />-->
          <SvgIcon name="empty" />
          <div>{{ $t('暂无数据') }}</div>
        </div>
      </template>
    </van-list>
  </div>
</template>

<script setup>
import {
  inject,
  reactive,
  computed,
  onMounted,
  watch,
} from 'vue';

import { useRequest } from 'ahooks-vue';
import { CountTo } from 'vue3-count-to';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { indexbanner } from '@/api/app.js';
import { GAME_CATE_ID_SLOTS } from './gamejs/gameId';
import { jackpots, getpayforline } from '@/api/game';
import slothook from './gamejs/slothook';
import SearchTrigger from './search/trigger.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const $store = inject('store');
const global = inject('global');
const $route = useRoute();
const $router = useRouter();
const token = Cookies.get('access_token');

const navs = [
  {
    title: global.$t('全部'),
    name: '',
  },
  {
    title: global.$t('最热'),
    name: 'hot',
  },
  {
    title: global.$t('最新'),
    name: 'latest',
  },
  {
    title: global.$t('我的收藏'),
    name: 'fav',
  },
];

const state = reactive({
  payforlineData: null,
  payforline: 0,
  cateId: GAME_CATE_ID_SLOTS,
  jackpotSettings: {},
  decimals: 2,
  duration: 10000000000,
  slotsType: '',
  projectName: import.meta.env.VITE_APP_MERCHANT_NO,
});

state.slotsType = $route.query.platform;
const {
  pageNo,
  active,
  finished,
  lists,
  loading,
  nav,
  platform,
  init,
  loadData,
  onLoad,
  doFavorite,
  onTabChange,
  getPlatformNameById,
  onPlatformClick,
} = slothook(
  GAME_CATE_ID_SLOTS,
  navs,
  state.slotsType,
  state.payforline,
);

const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3);
const platformsSlot = computed(() => {
  if (!platformgameidsv3.value) return [];
  return platformgameidsv3.value.find((item) => item.game_cate_id === 2).list_data.filter((item) => item.status === 1 && item.page_type === 2);
});

const {
  data: bannerPic,
} = useRequest(() => indexbanner({ game_cate_id: 2 }), {
  formatResult: (data) => data[0]?.h5_pic,
});

onMounted(() => {
  init();
  getJackpots();
  doPayforline();
});
watch(() => state.payforline, () => {
  pageNo.value = 1;
  loadData(true);
});
function onClickLeft() {
  $router.push({ name: 'home' });
}
function getJackpots() {
  jackpots().then((res) => {
    const jackpot = res[1].pot_money;
    state.jackpotSettings = {
      startVal: jackpot,
      endVal: jackpot * 2,
      duration: state.duration,
      decimals: state.decimals,
    };
  });
}
function doPayforline() {
  getpayforline().then((res) => {
    state.payforlineData = res;
  });
}
function onPayforlineClick(val) {
  state.payforline = val;
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  background-color: var(--bg-color-24c29a);
}
.slots {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}
.slot-banner {
  padding: 30px;
  :deep(.van-image__img) {
    border-radius: 8px;
  }
}
.jackpot {
  position: relative;
  margin: 30px auto;
  width: 688px;
  background: var(--theme-color)
    url("/src/assets/images/home/slots/jackpot-bg@2x.png") no-repeat;
  background-size: 100% auto;
  border-radius: 20px;
  flex: 0 0 156px;
  .bg {
    display: block;
    width: 100%;
  }
  .light,
  .light2 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .light2 {
    animation: fade 1s linear infinite forwards;
  }
  .jackpot-text {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    pointer-events: none;
    text-align: center;
    h3 {
      color: var(--font-color-fff);
      font-size: 44px;
      margin: 0 0 5px;
      dfn {
        font-style: normal;
      }
    }
    p {
      font-size: 24px;
      color: var(--font-color-fff);
    }
  }
}
:deep(.van-sticky--fixed) {
  height: 300px !important;
  background: var(--bg-color-122339);
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.winner-lists {
  width: 100%;
  margin-bottom: 30px;
}
.filter-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 0 30px;

  .van-tabs {
    width: 100%;
  }
  :deep(.van-tab) {
    flex: 1 0 auto;
    padding: 0 var(--van-padding-sm);
    margin-right: 0;
    color: var(--font-color-7b8bab);
  }
  :deep(.van-tab--active) {
    color: var(--font-color-000);
  }
  .van-tabs {
    border-bottom: none;
    .van-tab,
    .van-tabs__wrap,
    .van-tabs__nav {
      height: 80px;
      line-height: 80px;
      font-size: 28px;
    }
    :deep(.van-tabs__nav) {
      padding-left: 0;
    }
    :deep(.van-tabs__wrap) {
      border-bottom: none;
      padding-left: 0;
    }
  }
  .search {
    width: 188px;
    height: 56px;
    background: var(--theme-color);
    border-radius: 32px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    justify-content: center;
    span {
      color: var(--font-color-fff);
    }
  }
}
.filters {
  margin-top: 20px;
}
.labels {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 30px;
  padding: 0 30px;
  &.platform {
    display: block;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
    > div {
      display: flex;
      float: left;
      min-width: 100%;
      label {
        min-width: 40px;
        text-align: center;
      }
    }
  }
  label {
    width: auto;
    padding: 0 30px;
    line-height: 56px;
    color: var(--font-color-000-6);
    border-radius: 56px;
    font-size: 24px;
    // transition: all .45s ease-out;
    border: 2px solid transparent;
    &.active {
      color: var(--theme-color);
      font-weight: 500;
      border: 1px solid var(--theme-color);
    }
  }
  .labels-all {
    min-width: 100px !important;
  }
}

.search-info {
  margin-bottom: 30px;
  text-align: center;
  > span {
    color: var(--theme-color);
    margin-right: 10px;
  }
}
.van-list {
  &.games {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 30px;
    position: relative;
    z-index: 0;
    .empty-game {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .svg-icon-wrap {
        width: 120px;
        height: 108px;
        margin: 0 auto 20px;
      }
      div {
        text-align: center;
        color: var(--font-color-000-6);
      }
    }
    .van-cell {
      position: relative;
      width: 330px;
      margin-bottom: 30px;
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-color-1d395d);
      box-shadow: 0px 2px 10px 0px rgba(0, 34, 80, 0.05);
      &:after {
        border-bottom: none !important;
      }
      .game-item {
        color: var(--font-color-white);
        position: relative;
        .tag {
          width: 80px;
          height: 80px;
          position: absolute;
          left: -2px;
          top: -7px;
          text-align: center;
          line-height: 80px;
          font-size: 40px;
          transform: scale(0.5);
          border-radius: 50%;
          &.new,
          &.hot {
            background: var(--theme-color);
          }
        }
        .action {
          width: 40px;
          height: 40px;
          position: absolute;
          right: 18px;
          top: 10px;
          .van-icon {
            font-size: 40px;
            color: var(--font-color-white);
            &.van-icon-like {
              color: var(--theme-color);
            }
          }
        }
        .info {
          padding: 20px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      h3 {
        font-size: 28px;
        margin: 0;
        color: var(--font-color-000);
        line-height: 34px;
        span {
          background-color: var(--theme-color);
          color: var(--font-color-fff);
          font-size: 20px;
          padding: 2px 6px;
          font-weight: 300;
          margin-right: 6px;
          border-radius: 5px;
        }
      }
    }
    .van-image {
      width: 100%;
      height: 200px;
      background: var(--cur-color-000);
    }

    :deep(.van-list__loading),
    :deep(.van-list__finished-text) {
      width: 100%;
      padding-bottom: 30px;
      display: block;
      text-align: center;
    }
    :deep(.van-loading__text) {
      font-size: 24px;
    }
  }
}
:deep(.search-trigger) {
  background-color: transparent;

  span {
    display: none;
  }
}
</style>
