import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { i18n } from '@/init';
import { getParams, isMicro } from '@/utils';
import * as dictsApi from '@/api/dicts';
import { langConfig } from '@/utils/hooks';

const socketHost = window.location.protocol === 'http' ? 'http://roadmap.9mbv.com:8080' : 'https://roadmap.9mbv.com:7070';
let socketInstance = {};

export default () => ({
  namespaced: true,
  state: {
    darkTheme: 'normal',
    appName: 19001,
    language: 'cs',
    dicts: {},
    caches: {},
    roadmapSocketType: '',
    roadmapSocketData: {},
    isSocketConnected: false,
    noticeData: {},
    showDownload: true,
    regionData: {},
    source: '',
    lang: '',
    isDark: true,
    isLangMatching: false,
    langMatchingAreaCode: '',
    appLang: Cookies.get('lang'),
    agentHeaders: {},
    headers: {
      'X-Inte-Region-Id': '',
      'X-Inte-Currency-Id': ''
    },
    noticeList: [], // siteNoticeBox组件轮询sitenotice接口得到的公告列表
    lastNoticeType: '', // 最后点击的tab类型 message站内信 notice公告
    isMicro: false,
    teleportContainer: 'body',
    root: isMicro ? document.querySelector('div[data-name="vue_micro_app"]')?.shadowRoot : document.body
  },
  getters: {},
  mutations: {
    SET_ROADMAP_SOCKET_MESSAGE(state, { data, type }) {
      state.roadmapSocketData = data;
      state.roadmapSocketType = type;
    },
    SET_SOCKET_CONNECT(state, { status }) {
      state.isSocketConnected = status;
    },
    SET_SOURCE(state) {
      const [lang, ...args] = window.location.pathname.substr(1).split('/');
      state.appLang = lang || '';
      state.source = getParams('source') || '';
      state.isDark = getParams('isDark') === '0';
      const regionId = getParams('inte_region_id') || '';
      const currencyId = getParams('inte_currency_id') || '';
      if (regionId && currencyId) {
        state.headers['X-Inte-Region-Id'] = regionId;
        state.headers['X-Inte-Currency-Id'] = currencyId;
        state.regionData = {
          inte_region_id: regionId,
          inte_currency_id: currencyId
        };
      }
    },
    SET_LANG(state, lang) {
      const [_, ...args] = window.location.pathname.substr(1).split('/');
      const params = location.href.split('?')[1];
      lang = langConfig.includes(lang) ? lang : 'en';
      if (Cookies.get('lang') !== lang) {
        Cookies.set('lang', lang);
        window.location = `/${lang}/${args.join('/')}${params ? `?${params}` : ''}`;
      } else {
        state.lang = lang;
        i18n.global.locale = lang;
      }
    },
    SET_NOTICE_DATA(state, payload) {
      state.noticeData = payload;
    },
    SET_HEADERS(state, { regionId, currencyId, isAgent, matchingAreaCode, isLangMatching }) {
      if (isAgent) {
        state.agentHeaders['X-Inte-Region-Id'] = regionId;
        state.agentHeaders['X-Inte-Currency-Id'] = currencyId;
      } else {
        state.headers['X-Inte-Region-Id'] = regionId;
        state.headers['X-Inte-Currency-Id'] = currencyId;
      }
      state.regionData = {
        inte_region_id: regionId,
        inte_currency_id: currencyId
      };

      state.langMatchingAreaCode = matchingAreaCode;
      state.isLangMatching = isLangMatching;
    },
    SET_DICTS(state, payload) {
      state.dicts = payload;
    },
    SET_SHOW_DOWNLOAD(state, payload) {
      state.showDownload = payload;
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
    SET_CONSTANT(state, { key, val }) {
      let values = val;
      if (key === 'platformgameidsv2') {
        values = values.map((item) => {
          item.platform_list = item.list_data.filter((child) => child.status !== 2);
          return item;
        });
      }
      state.dicts[key] = values;
    },
    UPDATE_SITE_NOTICE(state, values) {
      state.noticeList = values;
    },
    UPDATE_SITE_NOTICE_READ(state, id) {
      const idx = state.noticeList.findIndex((item) => item.id === Number(id));
      if (idx >= 0) state.noticeList[idx].is_read = 1;
    },
    LAST_NOTICE_TYPE(state, payload) {
      state.lastNoticeType = payload;
    },
    SET_IS_MICRO(state, val) {
      state.isMicro = val;
    },
    SET_TELEPORT_CONTAINER(state, val) {
      state.teleportContainer = val;
    }
  },
  actions: {
    connectSocket({ state, commit }) {
      if (state.isSocketConnected) {
        return;
      }
      const socket = io(socketHost, {
        transports: ['websocket'] // use WebSocket first, if available
      });
      socket.on('connect', () => {
        console.log('socket connected');
      });
      socket.on('connect_error', () => {
        console.error('connect');
      });
      socket.on('connect', () => {
        commit('SET_SOCKET_CONNECT', { status: true });
      });
      socket.on('connect_error', () => {});
      socket.on('result list', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'resultList'
        });
      });
      socket.on('new shoes', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'newShoes'
        });
      });
      socket.on('new round', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'newRound'
        });
      });
      socket.on('close round', (msg) => {
        commit('SET_ROADMAP_SOCKET_MESSAGE', {
          data: JSON.parse(msg),
          type: 'closeRound'
        });
      });
      socketInstance = socket;
      socket.on('disconnect', () => {
        commit('SET_SOCKET_CONNECT', { status: false });
      });
    },
    disconnectSocket({ commit }) {
      commit('SET_SOCKET_CONNECT', { status: false });
      const socket = socketInstance;
      socket.disconnect();
      socket.removeAllListeners('result list');
      socket.removeAllListeners('new shoes');
      socket.removeAllListeners('new round');
      socket.removeAllListeners('close round');
      socket.removeAllListeners('connect');
      socket.removeAllListeners('disconnect');
      socket.removeAllListeners('connect_error');
    },
    getDict({ state, commit }, type) {
      const fetchDict = (name) => {
        if (state.dicts[name]?.length || state.dicts[`${name}Loading`]) return Promise.resolve();
        // commit('SET_CONSTANT', { key: `${name}Loading`, val: true });
        return dictsApi[name]?.({ LOADING: true }).then((res) => {
          commit('SET_CONSTANT', {
            key: name,
            val: res
          });
          commit('SET_CONSTANT', {
            key: `${name}Loading`,
            val: false
          });
        });
      };
      if (Array.isArray(type)) {
        return Promise.all(type.map(fetchDict));
      }
      return fetchDict(type);
    },
    updateSiteNotice({ state, commit }, noticeArray) {
      commit('UPDATE_SITE_NOTICE', noticeArray);
    },
    updateSiteNoticeRead({ state, commit }, id) {
      commit('UPDATE_SITE_NOTICE_READ', id);
    }
  }
});
