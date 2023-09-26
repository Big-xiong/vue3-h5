<template>
  <div class="transfer-base-wrap">
    <div class="transfer-pop-body">
      <div class="transfer-top">
        <span>{{ state.from_platform_name || $t('中心钱包') }}</span>
        <span>{{ state.to_platform_name }}</span>
      </div>
      <div class="account">
        <div @click="handleChose('out')" class="treasury">
          <span v-money="state.from_money" />
          <van-icon name="play"></van-icon>
        </div>
        <!-- <img
          @click="changeType"
          :src="$getSrc(`/src/assets/images/exchange.png`)"
          alt
        />-->
        <SvgIcon name="exchange" @click="changeType" />
        <div @click="handleChose('in')" class="master-account">
          <span v-money="state.to_money" />
          <van-icon name="play"></van-icon>
        </div>
      </div>
      <div class="transfer-amount">
        <p class="amount">{{ $t("转入金额") }}</p>
        <div>
          <!-- <span class="icon">￥</span> -->
          <input class="input" type="number" :placeholder="$t('请输入转入金额')" @blur="changeNumber" v-model="money" />
          <span class="all" @click="money = Math.floor(state.from_money)">{{ $t("全部") }}</span>
        </div>
      </div>
      <div class="transfer-btn">
        <template v-if="dialogType === 'back'">
          <van-button type="gray" @click="emit('update:isShow', false);">{{ $t('关闭弹窗') }}</van-button>
          <van-button loading-text="转账中..." :loading="submitLoading" @click="submit" type="primary">{{ $t('确定转账') }}
          </van-button>
        </template>
        <template v-else-if="isFlowType">
          <van-button :loading-text="$t('转账中')" :loading="submitLoading" @click="submit" type="gray">{{ $t('确定转账') }}
          </van-button>
          <van-button type="primary" @click="goWithdraw">{{ $t('继续取款') }}</van-button>
        </template>
        <template v-else>
          <van-button @click="goPlay(true)" type="gray">{{ $t("进入旁观") }}</van-button>
          <van-button :loading-text="$t('转账中')" :loading="submitLoading" type="primary" @click="submit">{{ $t("确认") }}
          </van-button>
        </template>
      </div>
    </div>

    <WalletTransfer @close="isShowWallet = false" :title="walletTitle" :isShow="isShowWallet" :walletList="walletList"
      :walletInfo="walletInfo" :shareWallet="shareWallet" :chooseType="chooseType" :noTitleBorder="true"
      v-model:fromCateId="fromCateId" v-model:toCateId="toCateId" v-model:state="state"
      v-model:activeChooseFrom="activeChooseFrom" v-model:activeChooseTo="activeChooseTo" v-model:allMoney="allMoney" />
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { trans } from '@/api/center';
import WalletTransfer from './Popup/WalletTransfer.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  gameId: String,
  platformId: String,
  cateId: String,
  cancel: {
    type: Function,
    default: () => { },
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
  dialogType: {
    type: String,
    default: '',
  },
  isFlowType: {
    type: Boolean,
    default: false,
  },
  isShow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'update:isShow', 'goWithdraw',
]);

const isShowWallet = ref(false);
const chooseType = ref(0);

const shareWallet = ref([]);
const global = inject('global');
const store = inject('store');

const money = ref('');
const allMoney = ref(0);

const state = ref({
  pay_password: '1',
  from_platform_id: 0,
  to_platform_id: 0,
  from_platform_name: global.$t('中心钱包'),
  to_platform_name: global.$t('中心钱包'),
  from_money_code: 'money',
  from_money: '0',
  to_money_code: 'money',
  to_money: '0',
});

const activeChooseFrom = ref(0);
const activeChooseTo = ref(0);
const gameCheckTimer = ref(null);
const router = useRouter();
const walletList = ref([]);
const shareList = ref([]);
const walletInfo = ref({});
const fromCateId = ref(0);
const toCateId = ref(props.cateId);
const { user, game } = store.state;
const walletType = ref('out');
const walletTitle = ref();
const closeGame = ref(true);
const gamePlayWin = ref(null);

watchEffect(() => {
  walletInfo.value = user.walletInfo;
  if (game.gameCatePlatforms.length && !walletList.value.length) {
    initWalletList(game.gameCatePlatforms);
  }
});

const { run: submit, loading: submitLoading } = useRequest(
  () => {
    const from_platform_id = activeChooseFrom.value;
    const to_platform_id = activeChooseTo.value;
    if (!from_platform_id && from_platform_id !== 0) {
      return Toast.fail(global.$t('请选择转出游戏账户类型'));
    }
    if (from_platform_id !== 0 && to_platform_id !== 0) {
      return Toast.fail(global.$t('游戏平台间不能进行转账'));
    }
    if (
      (!to_platform_id && to_platform_id !== 0)
      || from_platform_id === to_platform_id
    ) {
      return Toast.fail(global.$t('请选择转入游戏账户类型'));
    }
    if (!money.value) {
      return Toast.fail(global.$t('请输入转账金额'));
    }
    const params = {
      money: money.value,
      from_platform_id,
      to_platform_id,
    };
    setTimeout(() => {
      if (!props.dialogType && !props.isFlowType) {
        gamePlayWin.value?.close?.();
        gamePlayWin.value = window.open('', 'gamePlayWin');
      }
    }, 100);
    return trans(params);
  },
  {
    manual: true,
    async onSuccess() {
      Toast.success(global.$t('转账成功'));
      await store.dispatch('user/getWalletInfo');
      // isShow.value = false;
      // emit('update:isShow', false);
      if (!props.dialogType && !props.isFlowType) {
        goPlay(false, true);
      } else {
        props.dialogType = '';
        emit('update:isShow', false);
        if (props.isFlowType) {
          router.push({ name: 'centerWithdraw' });
          props.isFlowType = false;
        }
      }
    },
    onError() {
      gamePlayWin.value.close();
    },
  },
);

const token = Cookies.get('access_token');
const gameCheck = () => {
  if (gameCheckTimer.value) {
    clearInterval(gameCheckTimer.value);
  }
  gameCheckTimer.value = setInterval(() => {
    // 窗口关闭，且存在gameId，表明是进了游戏再关闭了
    if (gamePlayWin.value.closed && props.gameId) {
      clearInterval(gameCheckTimer.value);
      gamePlayWin.value = null;
      const { gameCatePlatforms } = store.state.game;
      // 判断当前游戏额度是否大于10
      gameCatePlatforms.forEach((m) => {
        if (m.game_cate_id === props.cateId) {
          m.platform_list.forEach((n) => {
            if (n.game_platform_id === props.platform_id) {
              allMoney.value = walletInfo.value[n.money_code];
            }
          });
        }
      });
      // 未开启免转并且游戏额度大于10
      if (walletInfo.value.is_auto_trans === 2 && allMoney.value > 10) {
        global.$popup({
          tpl: 'TransferPopup',
          gameId: props.gameId,
          platformId: props.platformId,
          cateId: props.cateId,
          dialogType: 'back',
        });
        return false;
      }
    }
  }, 5000);
};

function goPlay(isCheck, isBeforeOpen) {
  // isShow.value = false;
  emit('update:isShow', false);
  if (walletInfo.value.open_mode === 2) {
    // 回调前打开一个新窗口
    const win = window.open(props.gameData.url, '_blank');
    !isCheck && gameCheck();
    return false;
  }
  const url = `//${location.host}/play.html?at=${token}&game_id=${props.gameId || ''}&cate_id=${props.cateId}&platform_id=${props.platformId}`;

  // 考虑需要定时器监听窗口打开状态，还是用open的方式
  if (isBeforeOpen) {
    gamePlayWin.value.location = url;
  } else {
    setTimeout(() => {
      gamePlayWin.value?.close?.();
      gamePlayWin.value = window.open(url, '_blank');
    }, 100);
  }
  !isCheck && gameCheck();
}

function changeType() {
  const temp = JSON.parse(JSON.stringify(state.value));
  const tempFromId = fromCateId.value;
  const tempToId = toCateId.value;
  state.value.from_platform_id = temp.to_platform_id;
  state.value.to_platform_id = temp.from_platform_id;
  state.value.from_platform_name = temp.to_platform_name;
  state.value.to_platform_name = temp.from_platform_name;
  state.value.from_money_code = temp.to_money_code;
  state.value.to_money_code = temp.from_money_code;
  state.value.from_money = temp.to_money;
  state.value.to_money = temp.from_money;
  activeChooseFrom.value = temp.to_platform_id;
  activeChooseTo.value = temp.from_platform_id;
  fromCateId.value = tempToId;
  toCateId.value = tempFromId;
  state.value.allMoney = temp.to_money;
}

function walletM() {
  state.value.from_money = walletInfo.value.money || '0.00';
  if (!allMoney.value) allMoney.value = state.value.from_money;
  const list = walletList.value;
  list.forEach((val) => {
    if (val.game_cate_id === walletInfo.value.last_platform_cate_id) {
      val.hot = 1;
    } else {
      val.hot = 0;
    }
    val.money = 0;
    Object.keys(walletInfo.value).forEach((key) => {
      if (val.game_cate_id === Number(key.split('_')[1])) {
        val.money = (walletInfo.value[key] * 1).toFixed(2);
      }
      if (key === 'money') {
        val.money = (walletInfo.value[key] * 1).toFixed(2);
      }
    });
    // 游戏分类金额
    // 游戏平台金额
    if (val.platform_list) {
      val.platform_list.forEach((item) => {
        Object.keys(walletInfo.value).forEach((key) => {
          if (item.money_code === key) {
            item.money = (walletInfo.value[key] * 1).toFixed(2);
          }
        });
      });
    }
  });

  if (walletInfo.value.last_platform_cate_id === 0) {
    list[0].hot = 1;
  }
  walletList.value = list;
}

function initMoney() {
  if (props.dialogType === 'back') {
    state.value.to_money = walletInfo.value.money;
    state.value.to_platform_id = 0;
    state.value.to_platform_name = global.$t('中心钱包');
    state.value.from_platform_id = props.platformId;
    activeChooseFrom.value = props.platformId;
    walletList.value.map((item) => {
      if (item.game_cate_id === props.cateId) {
        item.platform_list.map((m) => {
          if (m.game_platform_id === props.platformId) {
            state.value.from_platform_name = `${item.game_cate_name}/${m.game_platform_name}`;
            state.value.from_money = `${walletInfo.value[m.money_code]}`;
            state.value.from_money_code = m.money_code;
          }
        });
      }
    });
    return false;
  }
  if (props.isFlowType) {
    state.value.to_money = walletInfo.value.money;
    state.value.to_platform_id = 0;
    state.value.to_platform_name = global.$t('中心钱包');
    const temp = JSON.parse(JSON.stringify(walletList.value));
    let maxMoney = 0;
    let maxMoneyId = 0;
    let maxCate = '';
    let maxPlat = '';
    let maxCateId = 0;
    temp.forEach((item) => {
      // if (['gm_ag_money', 'gm_bbin_money'].indexOf(item.money_code) !== -1) {
      //   return
      // }
      item.platform_list && item.platform_list.forEach((p) => {
        if (walletInfo.value[p.money_code] > maxMoney) {
          maxMoneyId = p.game_platform_id;
          maxMoney = walletInfo.value[p.money_code];
          maxCate = item.game_cate_name;
          maxCateId = item.game_cate_id;
          maxPlat = p.game_platform_name;
        }
      });
    });
    state.value.from_money = maxMoney;
    if (!maxCate && !maxPlat) {
      state.value.from_platform_name = global.$t('中心钱包');
      state.value.from_platform_id = 0;
      state.value.from_money = walletInfo.value.money;
      activeChooseFrom.value = 0;
      allMoney.value = walletInfo.value.money;
      fromCateId.value = 0;
    } else {
      state.value.from_platform_id = maxMoneyId;
      state.value.from_platform_name = `${maxCate}/${maxPlat}`;
      state.value.from_money = maxMoney;
      activeChooseFrom.value = maxMoneyId;
      allMoney.value = maxMoney;
      fromCateId.value = maxCateId;
    }
    return false;
  }
  state.value.from_money = walletInfo.value.money;
  state.value.from_platform_id = 0;
  state.value.from_platform_name = global.$t('中心钱包');
  state.value.to_platform_id = props.platformId;
  activeChooseTo.value = props.platformId;
  walletList.value.forEach((item) => {
    if (item.game_cate_id === props.cateId) {
      item.platform_list.forEach((m) => {
        if (m.game_platform_id === props.platformId) {
          state.value.to_platform_name = `${item.game_cate_name}/${m.game_platform_name}`;
          state.value.to_money = `${walletInfo.value[m.money_code]}`;
          state.value.to_money_code = m.money_code;
        }
      });
    }
  });
}

function handleChose(type) {
  walletType.value = type;
  if (type === 'out') {
    chooseType.value = 0;
    walletTitle.value = global.$t('转出钱包');
  } else {
    chooseType.value = 1;
    walletTitle.value = global.$t('转入钱包');
  }
  // walletM();
  // initMoney();
  isShowWallet.value = true;
}

function initWalletList(games) {
  let data = JSON.parse(JSON.stringify(games));
  data = data.map((item) => ({
    ...item,
    game_platform_name: item.name,
  }));

  data.unshift({
    game_platform_name: global.$t('中心钱包'),
    game_platform_id: 0,
    game_cate_id: 0,
    money: walletInfo.value.money || 0,
  });
  // 筛选共享钱包

  const tmp = [];
  const arr = [];
  data.forEach((item) => {
    if (item.platform_list) {
      item.platform_list.forEach((a) => {
        arr.push(a.money_code);
      });
    }
  });

  arr
    .concat()
    .sort((a, b) => {
      if (a === b && tmp.indexOf(a) === -1) tmp.push(a);
      return 0;
    })
    .sort();

  // 标记共享钱包
  data = data.map((item) => {
    const platform_list = item.platform_list?.map((subItem) => ({
      ...subItem,
      isShare: tmp.indexOf(subItem.money_code) !== -1,
    })) ?? [];

    return {
      ...item,
      platform_list,
    };
  });

  tmp.forEach((item) => {
    shareWallet.value[item] = [];
    data.forEach((a) => {
      if (a.platform_list) {
        a.platform_list.forEach((b) => {
          if (
            b.money_code === item
            && shareWallet.value[item].indexOf(b.game_platform_name) === -1
          ) {
            shareWallet.value[item].push(b.game_platform_name);
          }
        });
      }
    });
  });
  walletList.value = data;
  walletM();
  initMoney();
}

function goWithdraw() {
  // isShow.value = false;
  emit('update:isShow', false);
  emit('goWithdraw');
  router.push({ name: 'centerWithdraw' });
}

store.dispatch('game/getAllGameCatePlatforms');
</script>

<style lang="less" scoped>
.transfer-pop-body {
  box-sizing: border-box;
  overflow: hidden;
  padding: 30px;

  .transfer-top {
    display: flex;

    span {
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-000000));

      &:nth-child(2) {
        position: relative;
        left: 40px;
      }

      flex: 1;
    }

    margin-bottom: 20px;
  }

  .account {
    display: flex;
    align-items: center;

    .rotateChose {
      transform: rotate(180deg);
    }

    >.svg-icon-wrap {
      width: 28px;
      height: 28px;
      top: 50%;
      margin-top: -14px;
      margin-left: 24px;
      margin-right: 24px;
    }

    .treasury,
    .master-account {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      width: 300px;
      height: 88px;
      box-sizing: border-box;
      line-height: 88px;
      border-radius: 8px;
      background-color: var(--dark-333, var(--bg-color-f6f6f6));
      color: var(--dark-fff, var(--font-color-333333));
      font-size: 28px;
      padding: 0 20px;
      border: 2px solid var(--border-color-fff-4);
      // display: flex;
      // align-items: center;
      // justify-content: space-between;

      .van-icon {
        transform: rotateZ(90deg);
        margin-right: 30px;
        position: absolute;
        right: -14px;
        top: 30px;
      }
    }
  }

  .transfer-amount {
    margin-top: 40px;
    margin-bottom: 40px;

    >div {
      position: relative;

      .icon {
        position: absolute;
      }

      .all {
        position: absolute;
        font-size: 28px;
        right: 24px;
        top: 50%;
        margin-top: -14px;
        color: var(--theme-color);
      }
    }

    .amount {
      margin: 0 0 10px 0;
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-000000));
    }

    .input {
      width: 100%;
      background-color: var(--dark-333, var(--bg-color-f6f6f6));
      height: 88px;
      border: none;
      box-sizing: border-box;
      font-size: 28px;
      outline: none;
      border-radius: 8px;
      padding: 30px 24px;
      color: var(--dark-fff, var(--font-color-333333));
      border: 2px solid var(--border-color-fff-4);

      &::placeholder {
        padding-left: 0;
        opacity: 0.6;
      }
    }
  }

  .transfer-btn {
    display: flex;
    justify-content: space-between;

    .van-button {
      width: 330px;
    }
  }
}
</style>
