/* eslint-disable no-unused-vars */
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

import { register, quickregister, mobileregister, login, member, wallet, mobileLogin } from '@/api/user';

export default () => ({
  namespaced: true,
  state: {
    isLogin: false,
    gottenUserInfo: false,
    userInfo: {},
    walletInfo: {},
    loginDialog: false,
    loginLoading: false,
    registerDialog: false,
    registerLoading: false,
    updateLoading: false,
    walletLoading: false,
    uploadWalletLoading: false,
    bindMobile: false
  },
  mutations: {
    SET_GOT_USERINFO(state, payload) {
      state.gottenUserInfo = payload;
    },
    SET_REGISTER_DIALOG(state, val) {
      state.registerDialog = val;
    },
    SET_LOGIN_DIALOG(state, val) {
      state.loginDialog = val;
    },
    SET_USER_INFO(state, val) {
      state.isLogin = !!Object.keys(val).length;
      state.userInfo = val;
    },
    SET_WALLET_INFO(state, val) {
      state.walletInfo = val;
    },
    SET_LOADING(state, { key, val }) {
      state[key] = val;
    },
    SET_BINDMOBILE_DIALOG(state, val) {
      state.bindMobile = val;
    }
  },
  actions: {
    register({ state, commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        const {
          name,
          data: { clause, ...registerInfo }
        } = data;
        commit('SET_LOADING', { key: 'registerLoading', val: true });
        const fn = { account: register, quick: quickregister, mobile: mobileregister };
        fn[name]({ ...registerInfo, domain: document.domain })
          .then((res) => {
            const { repassword, ...loginInfo } = registerInfo;
            const { username, password } = res;
            const loginParams = password ? { username, password } : loginInfo;
            resolve();
            return dispatch('login', loginParams).then(() => {
              Cookies.set('pwd', loginParams.password);
              return Promise.resolve('success');
            });
          })
          .catch((err) => {
            reject();
          })
          .finally(() => {
            commit('SET_LOADING', { key: 'registerLoading', val: false });
          });
      });
    },
    login({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        const router = useRouter();
        login(data)
          .then((res) => {
            const { access_token } = res;
            Cookies.set('access_token', access_token);
            dispatch('getWalletInfo');
            commit('SET_GOT_USERINFO', true);
            resolve();
            return dispatch('getUserInfo');
          })
          .catch((err) => {
            reject();
          });
      });
    },
    mobileLogin({ commit, dispatch }, data) {
      return mobileLogin(data).then((res) => {
        const { access_token } = res;
        Cookies.set('access_token', access_token);
        dispatch('getWalletInfo');
        return dispatch('getUserInfo');
      });
    },
    getUserInfo({ state, commit, dispatch }, fn) {
      if (!fn) commit('SET_LOADING', { key: 'loginLoading', val: true });
      return member()
        .then((res) => {
          dispatch('getWalletInfo');
          commit('SET_USER_INFO', res);
          commit(
            'app/SET_HEADERS',
            {
              regionId: res.inte_region_id,
              currencyId: res.inte_currency_id
            },
            { root: true }
          );
          return Promise.resolve('success');
        })
        .finally(() => {
          commit('SET_GOT_USERINFO', true);
          fn?.();
          if (!fn) commit('SET_LOADING', { key: 'loginLoading', val: false });
        });
    },
    updateUserInfo({ commit, dispatch }) {
      dispatch('getUserInfo');
    },
    getWalletInfo({ state, commit }) {
      const isRefresh = !!Object.keys(state.walletInfo).length;
      commit('SET_LOADING', { key: isRefresh ? 'uploadWalletLoading' : 'walletLoading', val: true });
      return wallet()
        .then((res) => {
          commit('SET_WALLET_INFO', res);
          return res;
        })
        .finally(() => {
          commit('SET_LOADING', { key: isRefresh ? 'uploadWalletLoading' : 'walletLoading', val: false });
        });
    },
    logout({ commit }) {
      Cookies.remove('access_token');
      Cookies.remove('pwd');
      commit('SET_USER_INFO', {});
      commit('SET_WALLET_INFO', {});
      return Promise.resolve();
    }
  }
});
