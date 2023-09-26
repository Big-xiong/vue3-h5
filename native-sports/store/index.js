import { createStore, useStore as vuexUseStore } from 'vuex';
import game from './modules/game';
import user from './modules/user';

import mainUser from '@/store/modules/user';
import app from './modules/app';

export default () => createStore({
  strict: true,
  modules: {
    app: app(),
    user: user(),
    game: game(),
    mainUser: mainUser(),
  },
});

export const useStore = () => vuexUseStore();
