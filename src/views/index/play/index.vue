<template>
  <div
    class="game-wrap game-wrap-play"
    :class="{ loading: !isLoaded }"
  >
    <iframe
      :onload="onLoad"
      :src="data.src"
      id="gameIFrame"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script setup>
import {
  inject, reactive, onUnmounted, ref,
} from 'vue';
import { Notify, Toast } from 'vant';
import { openGame } from '@/api/app';
import { useTimeout } from '@/utils/hooks';
import { createSocket, onCloseWS } from '@/plugins/socket';
import { loadPTGame } from '@/utils/game';

const global = inject('global');

const { dicts } = global.$store.state.app;

const { query } = global.$router.currentRoute.value;

const { run: timeoutRun } = useTimeout(
  () => {
    gameCheck();
  },
  3000,
  { manual: true },
);

Toast.loading({ duration: 0 });

const data = reactive({
  src: '',
  timer: null,
  result: false,
});
const isLoaded = ref(false);

function onLoad() {
  isLoaded.value = false;
  Toast.clear();
  // 真机进入会产生多个loading，暂未找到原因，手动清除loading
  const bodyDom = document.querySelector('body');
  document.querySelectorAll('.van-toast--loading').forEach((dom) => {
    bodyDom.removeChild(dom);
  });
}

global.$store.dispatch('app/getDict', 'allplatform').then(() => {
  play();
});

const game_id = +query.game_id;
const platform_id = +query.platform_id;
const cate_id = +query.cate_id;
function handleSetVar() {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// // 处理vr游戏
if (!import.meta.env.SSR) {
  if (
    ![121].includes(platform_id)
    || !([2].includes(cate_id) && [3].includes(platform_id))
  ) {
    // Notify({
    //   message: global.$t('请开启自动旋转屏幕能够横屏玩游戏'),
    //   duration: 5000,
    // });
    window.onbeforeunload = () => {
      if (
        (data.src.split(':')[0] === 'http'
          && document.domain === import.meta.env.VITE_APP_GAME_DOMAIN)
        || (data.src.split(':')[0] === 'https'
          && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
        || (document.domain === import.meta.env.VITE_APP_GAME_DOMAIN
          && dicts.allplatform[platform_id] === 'PT')
      ) {
        if (navigator.sendBeacon) {
          const params = {
            game_id,
            platform_id,
            access_token: self.token || query.at,
            merchant_no: import.meta.env.VITE_APP_MERCHANT_NO,
          };
          data.result = navigator.sendBeacon(
            `${import.meta.env.VITE_APP_WEB_API_URL}/backtrans`,
            params,
          );
          window.localStorage.setItem('backtrans-result', data.result);
        } else {
          // onCloseWS();
          // xhr({
          //   type: 'POST',
          //   url: import.meta.env.VITE_APP_WEB_API_URL + 'backtrans',
          //   data: {
          //     game_id,
          //     platform_id,
          //     access_token: self.token || query.at,
          //     merchant_no: import.meta.env.VITE_APP_MERCHANT_NO
          //   },
          //   async: false,
          //   success: res => {
          //     // clearInterval(self.timer)
          //     onCloseWS()
          //   }
          // })
        }
      }
    };
    // onCloseWS()
    // timeoutRun();
    gameCheck();
  }
  onUnmounted(() => {
    onCloseWS();
    handleSetVar();
    // We listen to the resize event
    window.addEventListener('resize', handleSetVar);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleSetVar);
  });
}

function play() {
  // Toast.loading({
  //   forbidClick: true,
  //   duration: 0,
  // });
  openGame({
    game_id,
    platform_id,
  }).then((res) => {
    if (platform_id === 142) {
      loadPTGame(res, 'zh-CN')
      return
    }

    if (res.open_mode && res.open_mode === 2) {
      window.location.href = res.url;
      return false;
    }

    if (
      (res.url.split(':')[0].toLowerCase() === 'http'
        && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
      || (dicts.allplatform[platform_id] === 'PT'
        && document.domain !== import.meta.env.VITE_APP_GAME_DOMAIN)
    ) {
      window.location.href = `http://${import.meta.env.VITE_APP_GAME_DOMAIN
        }/play?game_id=${game_id}&platform_id=${platform_id}&at=${query.at}`;
    } else if (
      [121].includes(platform_id)
      || ([2, 4].includes(cate_id) && [3].includes(platform_id))
      || dicts.allplatform[platform_id] === 'PT'
    ) {
      if ([121].includes(platform_id)) {
        window.location.href = res.url.toLowerCase().includes('http')
          ? res.url
          : `http://${res.url}`;
      } else {
        window.location.href = res.url;
      }
    } else {
      data.src = res.url.toLowerCase().includes('http') ? res.url : `http://${res.url}`;
    }
    // Toast.clear();
  });
}

function gameCheck() {
  // if (this.timer) {
  //   clearInterval(this.timer)
  // }
  // const game_id = query.game_id
  createSocket(
    `${import.meta.env.VITE_APP_WS_URL}connect?token=${query.at}&ctype=user`,
  );
  // this.timer = setInterval(() => {
  //   onlinecheck({ game_id, access_token })
  // }, 5000)
}
</script>

<style lang="less" scoped>
#gameIFrame {
  height: 100%;
  width: 100%;
}

.game-wrap {
  position: relative;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  overflow-y: auto;
  width: 100%;

  &.loading {
    background-image: url('/src/assets/images/play-loading.jpg');
    background-size: 100% auto;
    background-position: center;
  }
}
</style>
