import { Toast } from 'vant';

Toast.allowMultiple();

let toastInstance = null;

const openDelay = 100;
const closeDelay = 0;
const isLoadingOpen = false;
let openTimer = 0;
let closeTimer = 0;
let router = null;
const firstClassRoutes = [
  '/',
  '/promos',
  '/notice',
  '/user',
  '/agent/landing',
  '/agent/center',
  '/agent/commission-table',
  '/agent/popularize-link',
  '/agent/member-list',
  '/agent/home',
];
const whiteListRoutes = ['/play', '/discount-detail'];

export default {
  setRouter(_router) {
    router = _router;
  },
  loading() {
    if (openTimer) {
      return;
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = 0;
      return;
    }
    if (router) {
      const { currentRoute } = router;
      if (whiteListRoutes.some((item) => currentRoute.value.path.endsWith(item))) {
        return;
      }
      toastInstance = Toast.loading({ duration: 0 });
      openTimer = 1;
    }
  },
  clear() {
    if (closeTimer) {
      return;
    }
    closeTimer = setTimeout(() => {
      toastInstance?.clear?.();
      closeTimer = 0;
      openTimer = 0;
    }, closeDelay);
  },
};
