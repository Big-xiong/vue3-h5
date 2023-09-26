import Cookies from 'js-cookie';
import { sitenotice } from '/native-sports/api/home';

export default () => ({
  namespaced: true,
  state: {
    siteNoticeList: [],
    sort: 1,
    pan: 'decimalPrice',
    rate: 1,
    lang: localStorage.getItem('sport_lang') || 'cs',
    darkTheme: 'normal',
    singleTicket: {},
    multipleOdds: [],
    singleOdds: {},
  },
  getters: {},
  mutations: {
    SET_MULTIPLE_ODDS(state, { odds }) {
      if (odds) { state.multipleOdds = odds; }
      localStorage.setItem('multiple-odds', JSON.stringify(state.multipleOdds));
    },
    CLEAR_PARLAY(state) {
      state.multipleOdds = [];
      state.TOGGLE_MULTIPLE_TICKETS = [];
      state.singleOdds = {};
      state.singleTicket = {};
    },
    TOGGLE_SINGLE_TICKET(state, ticket) {
      if (state.singleTicket.id === ticket.id) {
        state.singleTicket = {};
      } else {
        state.singleTicket = ticket;
      }
    },
    TOGGLE_SINGLE_ODDS(state, data) {
      if (state.singleOdds.marketId === data.odds.marketId) {
        state.singleOdds = {};
      } else {
        state.singleOdds = data;
      }
    },
    TOGGLE_MULTIPLE_ODDS(state, targetOdd) {
      const index = state.multipleOdds.findIndex((item) => item.eventId === targetOdd.eventId
        && item.odds.marketId === targetOdd.odds.marketId);

      if (index !== -1) {
        state.multipleOdds.splice(index, 1);
      } else {
        state.multipleOdds.push(targetOdd);
      }

      localStorage.setItem('multiple-odds', JSON.stringify(state.multipleOdds));
    },
    SET_DARK_THEME(state, theme) {
      state.darkTheme = theme;
      if (state.darkTheme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      Cookies.set('darkTheme', state.darkTheme === 'dark');
    },
    SET_SORT(state, sort) {
      state.sort = sort;
    },
    SET_PAN(state, pan) {
      state.pan = pan;
    },
    SET_RATE(state, rate) {
      state.rate = rate;
    },
    SET_LANG(state, lang) {
      state.lang = lang;
      localStorage.setItem('sport_lang', lang);
    },
    SET_SITE_NOTICE(state, data) {
      state.siteNoticeList = data;
    },
  },
  actions: {
    getSiteNotice({ commit }, params) {
      return new Promise((resolve, reject) => {
        sitenotice({ type: 5, ...params })
          .then((res) => {
            if (res) {
              commit('SET_SITE_NOTICE', res.data);
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
