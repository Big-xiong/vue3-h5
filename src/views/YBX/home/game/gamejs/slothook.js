import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import {
  inject, ref, computed, watch,
} from 'vue';
import {
  getGameLists,
  getHotGameLists,
  getNewGameLists,
  getFavoriteGameLists,
  getBonusGameLists,
  favorite,
} from '@/api/game';
import { getGameSlotPlatform } from '@/utils/utils';

export default function (cateId, navs, slotsType, payforline, changeSlotsType) {
  const $store = inject('store');
  const global = inject('global');
  const { game } = $store.state.game;
  $store.dispatch('game/getPlatformGameIdsv3');

  const nav = ref(null);
  const active = ref(0);
  const platforms = ref([]);
  const platform = ref(null);
  const lists = ref([]);
  const pageNo = ref(0);
  const loading = ref(true);
  const finished = ref(false);

  const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3);
  const gameSearch = computed(() => game?.gameSearch);
  const keyword = computed(() => gameSearch.value?.keyword);
  const platformGameIds = computed(() => platformgameidsv3.value);

  watch(() => platforms.value, () => {
    pageNo.value = 0;
    loadData();
  });
  watch(() => platformGameIds.value, (val) => {
    if (val ?? false) {
      platforms.value = getGameSlotPlatform(cateId, val);
    }
  });
  watch(() => active.value, () => {
    pageNo.value = 0;
    loadData(true);
  });
  watch(() => keyword.value, () => {
    pageNo.value = 0;
    if (gameSearch.value.category === cateId) {
      showResult(true);
    }
  });
  function init() {
    nav.value = navs[active.value];
  }
  function onLoad() {
    loadData();
  }
  function loadData(reload) {
    pageNo.value++;
    if (slotsType) {
      const _platform = platforms.value.filter((item) => item.name === slotsType.toUpperCase() || item.name === slotsType);
      platform.value = _platform[0];
    }
    const params = {
      game_cate_id: cateId,
      platform_id: platform.value && platform.value.id || null,
      page: pageNo.value,
      name: keyword.value,
    };

    if (payforline) {
      Object.assign(params, {
        is_payfor: payforline,
      });
    }
    let request;
    if (nav.value.name === 'fav') {
      request = getFavoriteGameLists(params);
    } else if (nav.value.name === 'latest') {
      request = getNewGameLists(params);
    } else if (nav.value.name === 'hot') {
      request = getHotGameLists(params);
    } else if (nav.value.name === 'reward') {
      request = getBonusGameLists(params);
    } else {
      request = getGameLists(params);
    }
    request.then((res) => {
      if (nav.value.name === 'fav') {
        res.data.map((item) => {
          item.is_favorite = 1;
        });
      }
      lists.value = reload ? res.data : lists.value.concat(res.data);
      loading.value = false;
      if (pageNo.value > res.last_page) {
        finished.value = true;
      }
      typeof (changeSlotsType) === 'function' && changeSlotsType();
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
  function onTabChange(index, title) {
    active.value = index;
    nav.value = navs[index];
  }
  function onPlatformClick(val) {
    platform.value = val;
    slotsType = null;
    loadData(true);
  }
  function onGameTypeClick(val) {
    gametype.value = val;
  }
  function showResult(keyword) {
    pageNo.value = 0;
    loadData(true);
  }
  function clearSearch() {
    $store.dispatch('game/setGameSearch', {
      keyword: '',
    });
  }
  return {
    pageNo,
    active,
    finished,
    lists,
    nav,
    loading,
    platform,
    platforms,
    init,
    loadData,
    onLoad,
    doFavorite,
    onTabChange,
    getPlatformNameById,
    onPlatformClick,
  };
}
