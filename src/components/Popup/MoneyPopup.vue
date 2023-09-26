<template>
  <Popup
    :show="isShow"
    class="transfer-popup-wrap"
    close-icon-position="top-right"
    position="center"
    @clickCloseIcon="isShowPopup = false"
    @onClose="isShow = false"
    :title="tips.title"
  >
    <h4>{{ tips.desc }}</h4>
    <div class="table-wrap">
      <div class="cells cells-1">
        <div class="div">{{ $t('中心钱包') }}</div>
        <div class="border"></div>
        <div class="div">{{ $t('游戏额度') }}</div>
        <!--          <div class="border"></div>-->
        <!--          <div class="div">{{$t("理财钱包")}}</div>-->
      </div>
      <div class="cells cells-2">
        <div
          class="div"
          v-money="0"
        ></div>
        <div class="border"></div>
        <div
          class="div"
          v-money="0"
        ></div>
        <!--          <div class="border"></div>-->
        <!--          <div class="div">{{ 0 }}</div>-->
      </div>
    </div>
    <div class="btn-wrap">
      <van-button
        type="default"
        @click="goPlay"
      >{{ tips.cancelButtonText }}</van-button>
      <van-button
        type="success"
        @click="action('confirm')"
      >{{ tips.confirmButtonText }}</van-button>
    </div>
    <!--    <div class="tips-text">-->
    <!--      {{ $t('请您继续游戏完成要求流水即可取款！') }}-->
    <!--    </div>-->
  </Popup>
</template>

<script setup>
import {
  inject, ref, defineProps, reactive, watchEffect,
} from 'vue';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import Popup from './index.vue';
import { createSocket, onCloseWS } from '@/plugins/socket';

const store = inject('store');
const { user } = store.state;
const walletInfo = ref({});
const allMoney = ref(0);
const props = defineProps({
  type: {
    type: Number,
    default: 0,
  },
  confirm: {
    type: Function,
    default: () => {
    },
  },
  cancel: {
    type: Function,
    default: () => {
    },
  },
  gameId: String,
  platformId: String,
  cateId: String,
  gameData: {
    type: Object,
    default: () => ({}),
  },
});

watchEffect(() => {
  walletInfo.value = user.walletInfo;
});

const gamePlayWin = ref({});

const isShow = ref(false);
const wallet = ref({});

setTimeout(() => {
  isShow.value = true;
}, 100);

function newWin(url) {
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  gamePlayWin.value.win = window.open(url);
  setInterval(() => {
    console.log('closed', gamePlayWin.value.win);
  }, 1000);
  // 创建A标签
  // const a = document.createElement('a');
  // // 给创建好的a标签赋值
  // a.setAttribute('href', url);
  // // 设置css 隐藏属性
  // a.setAttribute('style', 'display:none');
  // // 设置 a标签为新窗口打开
  // a.setAttribute('target', '_blank');
  // // 将设置好的a标签，添加到 body 内
  // document.body.appendChild(a);
  // // 模拟点击
  // a.click();
  // // 移除a标签
  // a.parentNode.removeChild(a);
  // }
}

function action(type) {
  if (type === 'cancel') {
    props.cancel?.();
  } else {
    props.confirm?.();
  }
  isShow.value = false;
}

const router = useRouter();
function goPlay() {
  isShow.value = false;
  // gamePlayWin = window.open('', 'gamePlayWin')
  if (walletInfo.value.open_mode === 2) {
    newWin(props.gameData.url);
    return false;
  }
  // const routeUrl = router.resolve({
  //   path: '/play',
  //   query: {
  //     game_id: props.gameId || '',
  //     platform_id: props.platformId,
  //     cate_id: props.cateId,
  //     at: props.token,
  //   },
  // });
  const token = Cookies.get('access_token');
  const url = `//${location.host}/play.html?at=${token}&game_id=${props.gameId || ''}&cate_id=${props.cateId}&platform_id=${props.platformId}`;
  newWin(url);
  // gameCheck();
}

const global = inject('global');

const tips = reactive({
  title: global.$t('余额不足'),
  desc: global.$t('您的账户余额不足，是否进入旁观'),
  confirmButtonText: global.$t('立即存款'),
  cancelButtonText: global.$t('进入旁观'),
});
</script>

<style lang="less" scoped>
.transfer-popup-wrap {
  h4 {
    padding: 0 20px;
    text-align: center;
    font-size: 28px;
    font-weight: normal;
    color: var(--dark-fff, var(--font-color-666666));
  }

  .btn-wrap {
    display: flex;
    box-sizing: border-box;
    padding: 0 30px 40px 30px;
    justify-content: space-between;
    width: 100%;
  }

  .cells {
    height: 200px;
    border-radius: 4px;
    display: flex;
    color: var(--font-color-333333);
    border: 2px solid var(--border-color-c4c4c4);

    .div {
      text-align: center;
      flex: 1;
      line-height: 100px;
    }

    .border {
      width: 2px;
    }
  }

  .cells-1 {
    margin: 40px auto 0;
    height: 100px;
    background-color: var(--theme-color);
    color: var(--font-color-ffffff);
    border-bottom: none;
    border-radius: 8px 8px 0 0;

    .div {
      color: var(--dark-fff, var(--font-color-fff));
      font-size: 28px;
      font-weight: 400;
    }

    .border {
      background-color: var(--border-color-c4c4c4);
    }
  }

  .cells-2 {
    margin: 0 auto 40px;
    box-sizing: border-box;
    height: 100px;
    border-radius: 0 0 8px 8px;
    border-top: 0;

    .div {
      color: var(--dark-fff, var(--font-color-e8e8e8));
      font-size: 32px;
      font-weight: bold;
    }

    .border {
      background-color: var(--border-color-c4c4c4);
    }
  }
}

.van-button {
  width: 310px;
  height: 80px;
  border-radius: 8px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}

.van-button--success {
  background-color: var(--bg-color-24c29a);
  margin-left: 30px;
  border: none;
}

.van-button--default {
  color: var(--font-color-bbbbbb);
  border: 2px solid var(--font-color-bbbbbb);
}

.table-wrap {
  padding: 0 30px;
  box-sizing: border-box;
}

.tips-text {
  font-size: 28px;
  text-align: center;
  margin: 0px 0 38px;
  color: var(--dark-fff, var(--font-color-333333));
}
</style>
