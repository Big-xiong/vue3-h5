<template>
  <van-popup @closed="emit('close')" v-model:show="show" class="wallet-popup-wrap" @clickCloseIcon="emit('close')"
    position="top">
    <div class="account">
      {{ $t("账户") }}：{{ username }}
      <img v-clipboard:copy="username" v-clipboard:success="onCopy" v-clipboard:error="onError"
        :src="$getSrc(`/src/assets/images/copy_icon@2x.png`)" alt />
    </div>
    <div class="refresh" @click="refresh">
      {{ $t("点击刷新额度") }}
      <img :class="{ active: refreshing }" :src="$getSrc(`/src/assets/images/shuaxin_2@2x.png`)" alt />
    </div>
    <div class="amount">
      <div class="item">
        <div class="top">
          {{ $t("主钱包") }}
          <van-icon name="question-o" @click="help(0)" size="30" />
        </div>
        <div class="bottom" v-money="(walletInfo && walletInfo.money) * 1"></div>
      </div>
      <div class="divider"></div>
      <div class="item">
        <div class="top">
          {{ $t("游戏额度") }}
          <van-icon name="question-o" @click="help(1)" size="30" />
        </div>
        <div class="bottom" v-money="(walletInfo && walletInfo.all_platform_money) * 1"></div>
      </div>
      <div class="divider"></div>
      <!-- <div class="item">
        <div class="top">
          {{ $t("理财小金库") }}
          <van-icon name="question-o" @click="help(2)" size="30" />
        </div>
        <div class="bottom" v-money="(walletInfo && walletInfo.financing_money) * 1"></div>
      </div> -->
    </div>
    <div class="pullup" @click="show = false">
      <img :src="$getSrc(`/src/assets/images/fanla@2x.png`)" alt />
      {{ $t("额度详情展开，点击收起") }}
    </div>
  </van-popup>
</template>

<script setup>

import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import {
  inject, ref, defineProps, watchEffect, defineEmits,
} from 'vue';
import { wallet } from '@/api/user';
import Popup from './index.vue';

const props = defineProps({
  isShow: Boolean,
  wallet: {
    type: Object,
    default: () => ({}),
  },
  username: String,
});

const show = ref(false);
const global = inject('global');
const store = inject('store');
const { user } = store.state;
const walletInfo = ref({});

watchEffect(() => {
  walletInfo.value = user.walletInfo;
  show.value = props.isShow;
});

const emit = defineEmits(['close']);

function onCopy() {
  Toast.success({
    message: global.$t('复制成功'),
  });
}

const { run: refresh, loading: refreshing } = useRequest(() => wallet(), {
  manual: true,
  onSuccess(res) {
    store.commit('user/SET_WALLET_INFO', res);
  },
});

function help(index) {
  const type = [
    {
      title: global.$t('主钱包'),
      message: global.$t(
        '万趣平台余额，可以取款和转入游戏厅，也可转入理财小金库进行收益！',
      ),
    },
    {
      title: global.$t('游戏额度'),
      message: global.$t(
        '汇总所有游戏厅余额，详细游戏额度可以在额度转账页面查看！',
      ),
    },
    {
      title: global.$t('理财小金库'),
      message: global.$t('您理财小金库的本金+利息，可以随意使用哦！！'),
    },
  ];

  global.$dialog({
    tpl: 'AgentTips',
    ...type[index],
    confirmText: global.$t('我知道了'),
  });
}

</script>

<style scoped lang="less">
.wallet-popup-wrap {
  height: 518px;
  top: 0;
  border-radius: 0;
  overflow: hidden;

  .c {
    font-size: 28px;
    font-weight: 400;
    color: var(--font-color-999);
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      margin-left: 20px;
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }

  .account {
    .c;

    height: 60px;
    margin-top: 128px;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .refresh {
    .c;

    height: 90px;
    font-size: 26px;
    font-weight: 500;
    color: var(--font-color-525152);

    img {
      &.active {
        animation: refresh 1s linear infinite;
      }
    }
  }

  .amount {
    // width: 692px;
    height: 138px;
    border-radius: 4px;
    border: 2px solid var(--border-color-323232);
    margin: 0 auto;
    display: flex;

    .divider {
      width: 2px;
      background-color: var(--border-color-323232);
    }

    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .top {
      .c;

      height: 50px;
      font-size: 24px;
      font-weight: 400;
      position: relative;

      img {
        right: -60px;
        top: 50%;
        margin-top: -25px;
        position: absolute;
      }

      .van-icon {
        color: var(--theme-color);
        margin-left: 10px;
      }
    }

    .bottom {
      height: 38px;
      font-size: 32px;
      font-weight: bold;
      color: var(--font-color-fff);
      line-height: 38px;
    }
  }

  .pullup {
    position: relative;
    margin-top: 44px;
    height: 60px;
    font-size: 24px;
    font-weight: 400;
    color: var(--font-color-525152);
    line-height: 60px;
    text-align: center;

    img {
      position: absolute;
      top: -10px;
      left: 50%;
      margin-left: -16px;
      width: 32px;
      height: 12px;
    }
  }
}

@keyframes refresh {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
