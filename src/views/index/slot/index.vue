<template>
  <van-list class="electron-wrap" :loading="data.gameListLoading" :finished="data.finished" :immediate-check="false"
            :finished-text="$t('没有更多了')" :loading-text="$t('努力加载中')" @load="loadMore">
    <Banner :id="2"/>
    <div class="electron-wrap-content">
      <div class="tool-bar layout-flex-center-between">
        <van-button type="primary" @click="data.isShowFilter = true">{{ $t('筛选与排序') }}</van-button>
        <span>{{ data.totalCount }}{{lang === 'en' ? ' ' : ''}}{{ $t('个游戏') }}</span>
      </div>
      <div class="border-line"></div>
      <div class="recomm layout-flex-center-between">
        <span class="title">{{ types[data.activeNav] }}</span>
        <span @click="chooseNav(0)" v-show="data.activeNav !== 0">{{ $t('查看全部') }}</span>
      </div>

      <Slots :gameList="data.gameList" :noData="data.noData" :navType="data.activeNav" @like="onLike($event)"
             @load="loadMore"/>
    </div>
  </van-list>

  <van-popup lock-scroll left-arrow class="filter-sort-wrap" v-model:show="data.isShowFilter" teleport="body">
    <filter-sort :platList="data.platList" :lineList="data.lineList" v-model:activeNav="data.activeNav"
                 v-model:activeLine="data.activeLine" v-model:activePlat="data.activePlat"
                 v-model:keyword="data.keyword" @search="onSearch" @filter="filterGame" @clear="clear"
                 @close="data.isShowFilter = false"/>
  </van-popup>
</template>

<script setup>
import {
  inject, reactive, ref, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getpayforline,
  allgamesubcate,
  gamelist,
  hotgame,
  newgame,
  bonusgame,
  historylist,
  favoritelist,
} from '@/api/electron';
import Slots from './components/SlotsList.vue';
import Banner from '@/components/Banner/index.vue';
import FilterSort from './filter-sort.vue';

const route = useRoute();
const data = reactive({
  platList: [],
  keyword: '',
  lineList: [],
  activeNav: 1,
  activePlat: null,
  activeLine: null,
  cateID: 0, // 游戏cateID
  sonList: [], // 二级分类
  isShowFilter: false,
  currentPage: 1, // 当前页
  gameList: [], // 游戏列表
  finished: false, // 是否有更多
  total: 1, // 总页数
  totalCount: 0,
  noData: false,
  gameListLoading: false, // 游戏列表加载状态
});

const global = inject('global');
const $store = inject('store');
// $store.dispatch('app/getDict', ['allplatform', 'platformgameidsv2']);
const { dicts } = $store.state.app;

const lang = computed(() => $store.state?.app.lang);

function onLike(index) {
  if (data.gameList[index].is_favorite === 1) {
    data.gameList[index].is_favorite = 2;
  } else if (data.gameList[index].is_favorite === 2) {
    data.gameList[index].is_favorite = 1;
  }
}

const isEmpty = computed(() => !data?.gameList?.length);

const {
  run: allGamesUbcateRun,
  loading: allGamesUbcateLoading,
} = useRequest(
    () => allgamesubcate({ LOADING: true }),
    {
      manual: true,
      onSuccess(res) {
        data.sonList = [global.$t('全部'), ...Object.values(res)];
      },
    },
);

const { loading: getPayForLineLoading } = useRequest(
    () => getpayforline({ LOADING: true }),
    {
      onSuccess(res) {
        data.lineList = [...Object.values(res)];
      },
    },
);

function filterGame() {
  data.gameList = [];
  data.currentPage = 1;
  data.noData = false;
  getGame();
  data.isShowFilter = false;
}

const types = ref([
  global.$t('全部游戏'),
  global.$t('最新游戏'),
  global.$t('我的最爱'),
  global.$t('推荐游戏'),
  global.$t('最后游玩游戏'),
]);

function onSearch() {
  filterGame();
  getGame(true);
}

function clear() {
  data.activePlat = null;
  data.activeNav = 0;
  data.keyword = '';
  data.activeLine = null;
  filterGame();
}

// 游戏列表
function getGame(isSearch = false) {
  if (data.gameListLoading) return;
  data.gameListLoading = true;
  if (isSearch) {
    data.gameList = [];
    data.currentPage = 1;
  }

  const obj = {
    game_cate_id: data.cateID,
    platform_id: data.activePlat,
    is_payfor: data.activeLine ?? undefined,
    sub_game_cate_id: data.activeSon ?? undefined,
    name: data.keyword,
    page: data.currentPage,
  };

  const config = {
    0: gamelist,
    1: newgame,
    2: favoritelist,
    // @todo 增加最近游玩游戏
    3: historylist,
    other: gamelist,
  };
  const fn = config[data.activeNav] ?? config.other;

  fn(obj)
      .then((res) => {
        data.total = res.last_page;
        data.totalCount = res.total;
        if (Array.isArray(res)) {
          data.gameList = res;
        } else {
          res.data.forEach((item) => {
            item.default_game_id = item.id;
          });
          data.gameList = data.gameList.concat(res.data);
        }
        data.noData = !!data.gameList.length;
        /* data.finished = res.current_page === res.last_page; */
        data.gameListLoading = false;
      });
}

function loadMore() {
  data.currentPage += 1;
  getGame(false);
}

watch(
    () => dicts.platformgameidsv2,
    () => {
      const {
        game_cate_id,
        list_data,
      } = dicts.platformgameidsv2?.find((item) => item.game_cate_id === 2) ?? {};
      data.platList = list_data?.map((item) => ({
        id: item.id,
        name: item.name,
      })) ?? [];

      if (route.query.plat) {
        data.activePlat = data.platList.find((item) => item.name === route.query.plat)?.id ?? '';
      }

      if (game_cate_id) {
        data.cateID = game_cate_id;
        allGamesUbcateRun({ pid: game_cate_id });
        getGame();
      }
    },
    { immediate: true },
);

const store = inject('store');
const { user } = store.state;

function chooseNav(index) {
  data.noData = false;
  data.activeNav = index;
  data.gameList = [];
  data.currentPage = 1;
  data.activePlat = null;
  data.activeLine = null;
  data.activeSon = 0;
  getGame();
  return true;
}

function choosePlat(index) {
  data.activePlat = index;
  data.gameList = [];
  data.currentPage = 1;
  getGame();
}

// 选择平台
function chooseLine(index) {
  data.activeLine = index;
  data.gameList = [];
  data.currentPage = 1;
  getGame();
}
</script>

<style lang="less">
.electron-wrap {
  flex: 1;
  overflow-y: auto;

  > div {
    flex: 1;
  }

  :deep(.van-button) {
    width: 250px;
    font-size: 24px;
    height: 54px;
  }

  .logo {
    width: 100%;
    height: 552px;
  }

  &-content {
    width: 100vw;
    box-sizing: border-box;
    padding: 32px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .recomm {
      width: 100%;
      padding: 29px 0 42px 0;
      font-weight: 600;

      span:nth-child(1) {
        font-size: 32px;
        font-weight: 600;
        color: var(--dark-fff, var(--font-color-222930));
      }

      span:nth-child(2) {
        color: var(--font-color-24c29a);
      }
    }

    .tool-bar {
      width: 100%;
      font-size: 28px;
      font-weight: 600;
      color: var(--dark-fff, var(--font-color-222930));
      padding-bottom: 29px;
    }

    .border-line {
      width: 100%;
      height: 1px;
      background-color: var(--dar-333, var(--border-color-cacaca));
    }
  }
}

.filter-sort-wrap {
  height: 100%;
  width: 100% !important;
}
</style>
