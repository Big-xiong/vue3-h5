import Cookies from 'js-cookie';
import { agentsettingdetail, commisionsheet, userinfo } from '@/api/agent';

export default () => ({
  namespaced: true,
  state: {
    userInfo: {},
    isLogin: false,
  },
  actions: {
    async getUserInfo({ dispatch, commit }, params) {
      const result = await userinfo({ ...params });
      if (result) {
        commit('SET_AGENT_IS_LOGIN', true);
        dispatch('getSettingDetail', result);
        // commit('app/SET_HEADERS',
        //   {
        //     regionId: result.inte_region_id,
        //     currencyId: result.inte_currency_id,
        //   },
        //   { root: true });
        return true;
      }
      return false;
    },
    async logout({ commit }) {
      Cookies.remove('agent_access_token');
      commit('SET_AGENT_USER_INFO', {});
      commit('SET_AGENT_IS_LOGIN', false);
    },
    async getSettingDetail({ commit }, params) {
      const loginData = { ...params };
      const settingResult = await agentsettingdetail({
        access_token: loginData.access_token,
      });
      if (settingResult.deposit_config && !loginData.deposit_switch) {
        loginData.deposit_switch = settingResult.deposit_config;
      }
      if (settingResult.unlimited_level_config && !loginData.spread_switch) {
        loginData.spread_switch = settingResult.unlimited_level_config;
      }
      commit('SET_AGENT_USER_INFO', loginData);
      commit('app/SET_HEADERS',
        {
          regionId: loginData.inte_region_id,
          currencyId: loginData.inte_currency_id,
          isAgent: true,
        },
        { root: true });
    },
  },
  mutations: {
    SET_AGENT_USER_INFO(state, data) {
      state.userInfo = data;
      state.isLogin = !!Object.values(data).length;
    },
    SET_AGENT_IS_LOGIN(state, isLogin) {
      state.isLogin = isLogin;
    },
  },
});
