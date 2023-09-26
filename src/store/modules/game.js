import {
  getPlatformGameIdsv2, getPlatformgameidsv3, profitRank, getAllPlatforms, getAllGameCatesPlatforms,
} from '@/api/game';
import { trans, backtransall } from '@/api/center';

const getInitGameSearch = () => ({
  visible: false,
  keyword: '',
  category: '',
  nav: null,
  payforline: 0,
  platform: null,
});

export default () => ({
  namespaced: true,
  state: {
    allPlatforms: {},
    allCates: {},
    gameCatesPlatforms: [],
    platformGameIds: [],
    // 游戏搜索
    gameSearch: getInitGameSearch(),
    dataProfitsRankOriginal: [],
    gameCatePlatforms: [],
    platformCateMap: {},
    platformGameIdsv3: [],
  },
  getters: {
    getTargetGameIdsv3: (state) => (pageType, cateId) => state.platformGameIdsv3
      ?.find((item) => item.game_cate_id === cateId)
      ?.list_data.filter((item) => item.page_type === pageType),
  },
  actions: {
    trans(_, params) {
      return trans(params);
    },
    backTransAll() {
      return backtransall({ LOADING: true });
    },
    getAllPlatforms({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllPlatforms(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_PLATFORMS', data);
            // const { code, data, msg } = res.data;
            // if (code === 0) {
            //   resolve(data);
            //   commit('SET_ALL_PLATFORMS', data);
            // } else {
            //   reject(msg);
            // }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllCates({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllGameCates(params)
          .then((res) => {
            const { code, data, msg } = res.data;
            if (code === 0) {
              resolve(data);
              commit('SET_ALL_CATES', data);
            } else {
              reject(msg);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllGameCatesPlatforms({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAllGameCatesPlatforms(params)
          .then((data) => {
            data.map((item) => {
              item.game_cate_name = item.name;
              item.platform_list = item.list_data;
              const platform = [];
              item.platform_list.map((m, index) => {
                m.game_platform_name = m.name;
                m.game_platform_id = m.id;
                if (m.status !== 2) {
                  platform.push(m);
                }
              });
              item.platform_list = platform;
            });
            resolve(data);
            commit('SET_GAMECATES_PLATFORMS', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getPlatformGameIdsv3({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPlatformgameidsv3(params)
          .then((data) => {
            resolve(data);
            commit('SET_ALL_GAME_IDS_V3', data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getPlatformGameIds({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPlatformGameIdsv2(params)
          .then((res) => {
            resolve(res);
            commit('SET_ALL_GAME_IDS', res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getProfitsRank({ commit }, params) {
      return new Promise((resolve, reject) => {
        profitRank(params)
          .then((res) => {
            const { code, data, msg } = res.data;
            if (code === 0) {
              resolve(data);
              commit('SET_PROFITS_RANK_DATA', data);
            } else {
              reject(msg);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    setGameSearch({ commit }, data) {
      commit('SET_GAME_SEARCH', data);
    },
    getAllGameCatePlatforms({ commit }) {
      return getPlatformGameIdsv2().then((data) => {
        data.forEach((item) => {
          item.game_cate_name = item.name;
          item.platform_list = item.list_data;

          const platform = [];
          item.platform_list.forEach((listItem) => {
            const listData = { ...listItem };
            listData.game_platform_name = listItem.name;
            listData.game_platform_id = listItem.id;

            if (listItem.status !== 2) {
              platform.push(listData);
            }
          });
          item.platform_list = platform;
        });
        commit('SET_GAME_CATE_PLATFORMS', data);
        return data;
      });
    },
  },
  mutations: {
    SET_ALL_PLATFORMS(state, data) {
      if (data) {
        state.allPlatforms = data;
      } else {
        state.allPlatforms = {};
      }
    },
    SET_GAMECATES_PLATFORMS(state, data) {
      if (data) {
        state.gameCatesPlatforms = data;
      } else {
        state.gameCatesPlatforms = [];
      }
    },
    SET_ALL_CATES(state, data) {
      if (data) {
        state.allCates = data;
      } else {
        state.allCates = [];
      }
    },
    SET_ALL_GAME_IDS_V3(state, data) {
      if (data) {
        state.platformGameIdsv3 = data;
        state.platformGameIdsv3.format = data.reduce((curr, next) => ((curr[next.game_cate_id] = next.list_data), curr), []);
      } else {
        state.platformGameIdsv3 = [];
      }
    },
    SET_ALL_GAME_IDS(state, data) {
      if (data) {
        state.platformGameIds = data;
      } else {
        state.platformGameIds = [];
      }
    },
    SET_PROFITS_RANK_DATA(state, datas) {
      state.dataProfitsRankOriginal = datas || [];
      let lists = [];
      datas.forEach((data) => {
        lists = lists.concat(data.list || []);
      });
      state.dataProfitsRank = lists;
    },
    SET_GAME_SEARCH(state, data) {
      if (!data) {
        state.gameSearch = getInitGameSearch();
      } else {
        const {
          visible, keyword, category, nav, payforline, platform,
        } = data;
        Object.assign(state.gameSearch, {
          visible,
          keyword,
          category,
          nav,
          payforline,
          platform,
        });
      }
    },
    SET_GAME_CATE_PLATFORMS(state, data) {
      if (data) {
        state.gameCatePlatforms = data;
        const ret = {};
        data.forEach((item) => {
          ret[item.game_cate_id] = item;
        });
        state.platformCateMap = ret;
      } else {
        state.gameCatePlatforms = [];
        state.platformCateMap = {};
      }
    },
  },
});
