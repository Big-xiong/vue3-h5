import Cookies from 'js-cookie';
import { open } from '../../../src/api/game';
import { balance, refresh_saba_token, saba_token } from '../../api/user';

export default () => ({
  namespaced: true,
  state: {
    access_token: '',
    member_id: 'newboy123',
    balance: '',
  },
  getters: {},
  mutations: {
    SET_ACCESS_TOKEN(state, data) {
      state.access_token = data;
    },
    SET_BALANCE(state, data) {
      state.balance = data;
    },
  },
  actions: {
    async getBalance({ commit }) {
      const balanceRes = await balance({ LOADING: true });
      commit('SET_BALANCE', balanceRes.balance);
    },
    async getAccessToken({ commit, dispatch }, params) {
      localStorage.removeItem('sport_access_token');
      const searchParam = new URLSearchParams(location.href.replace(location.hash, '').split('?')[1] || '');

      if (searchParam.get('token')) {
        Cookies.set('sport_access_token', searchParam.get('token'));
      } else {
        const res = await open({
          access_token: Cookies.get('access_token'),
          game_id: 10562,
        });
        const url = res.saba_url;
        localStorage.setItem('sport_access_token', url.split('?token=')[1]);
      }

      const res = await saba_token();

      localStorage.setItem('saba_token', res.token);

      await dispatch('getBalance');

      setInterval(() => {
        refresh_saba_token().then((sabaRes) => {
          localStorage.setItem('saba_token', sabaRes.token);
        });
      }, 10 * 3600);
      return true;
    },
  },
});
