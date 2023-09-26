import { createStore, useStore as vuexUseStore } from 'vuex';
import game from './modules/game';
import app from './modules/app';
import user from './modules/user';
import agent from './modules/agent';

export default () => createStore({
		strict: true,
		modules: {
			app: app(),
			user: user(),
			game: game(),
			agent: agent(),
		},
	});

export const useStore = () => vuexUseStore();
