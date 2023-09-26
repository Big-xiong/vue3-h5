<template>
  <div class="search-page">
    <form action="/" class="search-head">
      <van-search v-model="keyword" :placeholder="$t('请输入游戏名称')" show-action @search="onSearch" @input="onInput"
        @clear="onClear" @cancel="onCancel">
        <template v-slot:action>
          <div v-if="keyword" @click="onSearch">{{ $t('搜索') }}</div>
          <div v-else @click="onCancel">{{ $t('取消') }}</div>
        </template>
      </van-search>
    </form>
    <div class="search-body-out">
      <div class="search-body">
        <div class="action" v-if="!keyword && mywords?.length">
          <h2>{{ $t('搜索历史') }}</h2>
          <a @click="deleteHistory">{{ $t('清除') }}</a>
        </div>
        <ul class="lists" v-if="!keyword">
          <li v-for="(w, index) in mywords" :key="index" @click="onLabelClick(w)">{{ w }}</li>
        </ul>
        <div class="search-info" v-if="keyword && lists.length">
          <span>{{ keyword }}</span>
          {{ $t('的搜索结果') }}
          <span @click="clearSearch">{{ $t('清除') }}</span>
        </div>
        <template v-if="lists.length">
          <van-list class="games" v-model="loading" :finished="finished" :finished-text="$t('没有更多了')" @load="onLoad"
            :immediate-check="false">
            <van-cell v-for="(item, index) in lists" :key="index">
              <div class="game-item" slot="default">
                <van-image :src="item.pic" fit="cover" lazy @click="$playGame(item, 4)" />
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
                  <span class="action">
                    <van-icon @click="doFavorite(item.id, index)"
                      :name="item.is_favorite === 2 ? 'like-o' : $store.state.user.isLogin ? 'like' : 'like-o'" />
                  </span>
                </div>
              </div>
            </van-cell>
          </van-list>
        </template>
        <template v-else>
          <div class="empty-game">
            <!-- <img :src="$getSrc('/src/current_project/assets/images/home/error/kong@2x.png')" /> -->
            <SvgIcon name="empty" />
          </div>
          <div class="empty-text">{{ $t('抱歉，没有您搜索的游戏') }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
  computed,
  onMounted,
} from 'vue';

import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { getGameSlotPlatform } from '@/utils/utils';
import {
  getGameLists,
  getHotGameLists,
  getNewGameLists,
  getFavoriteGameLists,
  favorite,
} from '@/api/game';
import SvgIcon from '@/components/SvgIcon.vue';

let timer = null;
const $router = useRouter();
const $store = inject('store');
const global = inject('global');

$store.dispatch('game/getPlatformGameIdsv3');

const keyword = ref('');
const mywords = ref([]);
const pageNo = ref(1);
const lists = ref([]);
const loading = ref(false);
const finished = ref(false);
const nav = ref(null);
const platforms = ref([]);

const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3);
const gameSearch = computed(() => $store.state.game.gameSearch);
const platformGameIds = computed(() => platformgameidsv3.value);

const platformsSlot = computed(() => platformgameidsv3.value?.find?.((item) => item.game_cate_id === 2)?.list_data?.filter?.((item) => item.status === 1 && item.page_type === 2) ?? []);
const platformsIds = computed(() => platformsSlot.value?.reduce?.((curr, next) => (curr = `${curr}${next.platform_id},`, curr), '') ?? '');

function loadData(reload) {
  if (!keyword.value) {
    return;
  }
  const {
    platform, category, nav, payforline,
  } = gameSearch.value;
  if (mywords.value.indexOf(keyword.value) === -1 && keyword.value) {
    mywords.value.push(keyword.value);
  }

  window.localStorage.setItem('mywords', JSON.stringify(mywords));
  const params = {
    game_cate_id: category,
    platform_id: platformsIds.value,
    page: pageNo.value,
    name: keyword.value,
  };
  if (payforline) {
    Object.assign(params, {
      is_payfor: payforline,
    });
  }
  let request;
  if (nav?.name === 'fav') {
    request = getFavoriteGameLists(params);
  } else if (nav?.name === 'latest') {
    request = getNewGameLists(params);
  } else if (nav?.name === 'hot') {
    request = getHotGameLists(params);
  } else {
    request = getGameLists(params);
  }
  request.then((res) => {
    lists.value = reload ? res.data : lists.value.concat(res.data);
    // total.value = res.total
    pageNo.value++;
    if (pageNo.value > res.last_page) {
      finished.value = true;
    }
    loading.value = false;
  });
}
function doFavorite(gameid, i) {
  favorite({
    game_id: gameid,
  }).then(() => {
    if (lists.value[i].is_favorite == 1) {
      lists.value[i].is_favorite = 2;
      Toast.success(global.$t('取消收藏成功'));
      if (nav.value.name === 'fav') {
        pageNo.value = 0;
        loadData(true);
      }
    } else if (lists.value[i].is_favorite == 2) {
      lists.value[i].is_favorite = 1;
      Toast.success(global.$t('收藏成功'));
    }
  });
}
function onSearch() {
  lists.value = [];
  pageNo.value = 1;
  loadData();
}
function onInput() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    lists.value = [];
    pageNo.value = 1;
    loadData();
  }, 1000);
}
function onLoad() {
  loadData();
}
function onCancel() {
  $store.dispatch('game/setGameSearch');
  $router.go(-1);
}
function onClear() {
  lists.value = [];
}
function deleteHistory() {
  window.localStorage.removeItem('mywords');
  mywords.value = [];
  lists.value = [];
}
function onLabelClick(val) {
  keyword.value = val;
  pageNo.value = 1;
  loadData();
}
function clearSearch() {
  keyword.value = '';
  lists.value = [];
  pageNo.value = 1;
}
function getPlatformNameById(id) {
  let ret = '';
  platforms.value.forEach((platform) => {
    if (id === platform.id) {
      ret = platform.code.toUpperCase();
      return false;
    }
  });
  return ret;
}
onMounted(() => {
  const mywords = JSON.parse(window.localStorage.getItem('mywords') || '[]');
  mywords.value = mywords;
  if (gameSearch.value) {
    const { category } = gameSearch.value;
    const _nav = gameSearch.value.nav;
    nav.value = _nav;
    category ? platforms.value = getGameSlotPlatform(category, platformGameIds.value) : null;
  }
});
</script>

<style lang="less" scoped>
.m-body {
  background: var(--bg-color-14223B);

  :deep(.sports) {
    .matches {
      background: rgba(0, 0, 0, 0.5) !important;

      .prev {
        background: rgba(0, 0, 0, 0.5) !important;
      }

      .next {
        background: rgba(0, 0, 0, 0.5) !important;
      }
    }
  }

  :deep(.slots) {
    .jackpot {
      background-image: url("/src/current_project/assets/images/home/slots/jackpot-bg_1@2x.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;

      .jackpot-text {
        h3 {
          color: var(--font-color-white) !important;
        }

        p {
          color: var(--font-color-white) !important;
        }
      }
    }
  }

  :deep(.van-tabs__content) {
    .van-tab__pane-wrapper {
      &:first-child {
        .featured {
          .app-index-3 {
            .groupInfo {
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  :deep(.van-tabs__content) {
    .van-tab__pane-wrapper {
      &:first-child {
        padding: 0 !important;

        #banner {
          margin: 0 auto 24px !important;
        }

        .van-tab__pane>.van-image {
          padding: 0 0.4rem;
        }

        .notice {
          margin: 0.4rem 0.4rem 0;
          width: auto;
          border-color: var(--border-color-fff-06) !important;

          >.van-icon {
            color: var(--font-color-fff-14) !important;
          }

          .van-swipe .van-swipe-item {
            color: var(--font-color-15308) !important;
          }

          .action {
            color: var(--font-color-15308) !important;

            &::before {
              background: var(--cur-color-fff-01) !important;
            }

            .van-icon {
              color: var(--cur-color-fff-01) !important;
            }
          }
        }

        .featured {
          .app-index-3 {
            .gameList {
              padding: 45px 0.4rem 25px;
            }

            .groupInfo {
              background: var(--bg-color-87705) !important;
            }

            .buss {
              padding-top: 40px;
            }
          }
        }
      }
    }
  }

  .slots {
    :deep(.profit-swipe) .van-swipe-item .box {
      background: var(--bg-color-0D1928) !important;
    }
  }

  :deep(.nav-center) .member-info {
    background: none !important;
    border: 3px solid var(--theme-color) !important;

    .deposit {
      height: 51px !important;
    }
  }

  :deep(.van-list.games) {
    justify-content: flex-start !important;
  }

  :deep(.van-tabs) .van-tabs__nav {
    background: var(--bg-color-14223B) !important;
  }
}

:deep(.profit-swipe) .van-swipe-item .tag {
  background-color: var(--theme-color) !important;
}

.search-page {
  background: var(--bg-card-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;

  .search-head {
    flex: 1 0 88px;
    background: var(--bg-card-color);
    height: 88px;
    display: flex;
    align-items: center;
    width: 100%;

    .van-search {
      flex: 1;
      padding: 0;
      padding-left: 30px;
      background-color: transparent !important;
      align-items: center;

      .van-search__action:active {
        background: none;
      }
    }

    :deep(.van-search__content) {
      background-color: var(--cur-bg-color-F1F1F1);
      padding: 16px 20px;
      border-radius: 8px;

      .van-field__left-icon {
        margin-right: 20px;
        color: var(--font-color-000-6);
      }

      .van-icon {
        font-size: 40px;
      }

      >.van-cell {
        padding: 0;
        line-height: 40px;
      }

      .van-field__control {
        line-height: 40px;
        color: var(--font-color-000);
        font-size: 28px;
      }
    }

    :deep(.van-search__action) {
      padding: 0 30px;
      font-size: 34px;
      color: var(--font-color-000);
    }

    :deep(.van-search__action:active) {
      background-color: var(--bg-color-122339) !important;
    }
  }
}

.search-body-out {
  flex: 0 0 calc(100vh - 88px);
  overflow-y: auto;
}

.search-body {
  padding: 30px;
  color: var(--cur-color-666666);
  min-height: 100%;
  box-sizing: border-box;

  :deep(.search-info) {
    margin-bottom: 30px;
    text-align: center;
    margin-top: 30px + 50;

    >span {
      color: var(--theme-color);
      margin-right: 10px;
    }
  }

  .empty-game {
    width: 100%;
    text-align: center;
    margin-top: 50%;

    .svg-icon-wrap {
      width: 120px;
      height: 108px;
      margin: 0 auto;
    }
  }

  .empty-text {
    text-align: center;
    margin: 30px 0;
    color: var(--font-color-000-6);
  }

  :deep(.van-list) {
    &.games {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 90px;
      justify-content: space-around;

      .van-cell {
        position: relative;
        width: calc(50% - 30px);
        // margin-left: 30px;
        margin-bottom: 30px;
        background: var(--bg-color-1d395d);
        padding: 0;
        border-radius: 8px;
        overflow: hidden;

        &:after {
          border-bottom: none !important;
        }

        .game-item {
          color: var(--font-color-000);
          position: relative;
          background: var(--bg-color-1d395d);

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
            color: var(--font-color-fff);

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
      }

      .van-list__loading,
      .van-list__finished-text {
        width: 100%;
        padding-bottom: 30px;
      }
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      font-size: 32px;
      margin: 0;
      line-height: 1.5;
    }

    a {
      color: var(--font-color-7c86e9);
      font-size: 28px;
    }
  }

  .lists {
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 30px;

    li {
      border: 2px solid var(--cur-color-666666);
      border-radius: 30px;
      padding: 10px 20px;
      float: left;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
