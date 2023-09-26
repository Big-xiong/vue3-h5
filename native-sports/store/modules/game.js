import dayjs from 'dayjs';
import { add_notice, GetEvents, notice_list } from '../../api/home';
import { sport_typelist } from '/native-sports/api/home';

export default () => ({
  namespaced: true,
  state: {
    allSportType: {},
    noticeList: [],
    noticeCategory: [],
    streamings: {},
  },
  getters: {},
  mutations: {
    SET_NOTICE_LIST(state, data) {
      console.log('notice list', data);
      state.noticeList = data;
    },
    SET_NOTICE_CATEGORY(state, data) {
      state.noticeCategory = data;
    },
    SET_ALL_SPORT_TYPE(state, data) {
      state.allSportType = data;
    },
    SET_STREAMING(state, { key, data }) {
      state.streamings[key] = data;
    },
  },
  actions: {
    async getAllSportType({ commit }) {
      sport_typelist()
        .then((res) => {
          commit('SET_ALL_SPORT_TYPE', res.data);
        });
    },
    async getNoticeList({ commit }) {
      const noticeRes = await notice_list({
        page: 1,
        pagesize: 999999,
        status: 1,
        merchant_no: '19001',
      });

      const noticeList = noticeRes.data.map((item) => item.event_id);

      if (!noticeList.length) {
        commit('SET_NOTICE_LIST', []);
        commit('SET_NOTICE_CATEGORY', []);
        return;
      }

      const eventRes = await GetEvents({
        query: noticeList.length ? `$filter=eventid in (${noticeList.join(',')})` : '',
        NO_FILTER: true,
      });

      const closeEvents = [];
      const runningEvents = [];

      eventRes.events.forEach((item) => {
        if (item.eventStatus === 'closed') {
          closeEvents.push(item.eventId);
          noticeList.splice(noticeList.findIndex((sub) => sub === item.eventId), 1);
        } else {
          runningEvents.push(item);
        }
      });

      noticeList.forEach((item) => {
        if (!eventRes.events.find((event) => event.eventId === item)) {
          closeEvents.push(item);
        }
      });

      commit('SET_NOTICE_LIST', noticeList);

      if (closeEvents.length) {
        add_notice({
          event_id: closeEvents.join(','),
          status: 2,
          NO_FILTER: true,
        });
      }

      const marketsFilter = eventRes.markets.filter((item) => item.selections?.length);
      const events = runningEvents?.map((item) => {
        const markets = marketsFilter.filter((market) => market.eventId === item.eventId && market.selections.length);
        return {
          ...item,
          markets,
        };
      });

      commit('SET_NOTICE_CATEGORY', events);
    },
  },
});
