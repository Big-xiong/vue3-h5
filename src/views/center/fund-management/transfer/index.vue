<template>
  <div class="transfer-wrap">
    <van-nav-bar class="m-header" :title="$t('额度转账')" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <van-icon v-show="user?.walletInfo?.open_mode == 1" name="question-o" size="24px" @click="help" />
      </template>
    </van-nav-bar>
    <div class="transfer-wrap-main">
      <div class="layout-flex-between automatic" v-show="user?.walletInfo?.open_mode == 1">
        <span>{{ $t('自动免转钱包') }}</span>
        <!-- <span  > -->
        <van-switch :disabled="autoTransferLoading" :loading="autoTransferLoading" v-model="openMoney"
          @change="onChange" size="20px" />
      </div>
      <div class="transfer_out">
        <p class="transfer_out-title" v-if="!openMoney">{{ $t('转出钱包') }}</p>
        <div class="layout-flex-between content">
          <div class="content_l">
            <span class="wallet">{{ list?.from_platform_name }}</span>
            <span class="num" v-money="list?.money ?? '0.00'"></span>
            <van-icon class="refresh" @click="refreshMoney" :class="{ active: $store.state.user.uploadWalletLoading }"
              name="replay" />
          </div>
          <div class="arrow-container" @click="chooseItem('', -1)">
            <van-icon name="arrow" v-if="!openMoney" />
          </div>
        </div>
        <van-button class="reback-btn" type="primary" v-show="openMoney" @click="backTransAll">{{ $t('一键回收') }}
        </van-button>
        <p v-if="openMoney" class="note">{{ $t('游戏大厅') }}</p>
        <p v-if="!openMoney" class="trans-in">{{ $t('转入钱包') }}</p>
        <van-loading class="text-center" v-if="gameDataLoading" />
        <ul class="layout-flex-between" v-else>
          <li :class="{ 'active': activeIndex == 0 }" @click="chooseItem(item, 0)">
            <p>{{ $t('中心钱包') }}</p>
            <p v-money="user?.walletInfo?.money ?? '0.00'"></p>
          </li>
          <li v-for="(item, index) in gameData" :key="index" :class="{ 'active': activeIndex === index + 1 }"
            @click="chooseItem(item, index + 1)">
            <p>
              {{ item.name }}
              <span v-show="list?.to_platform_name !== $t('中心钱包') && activeIndex == (index + 1) && !openMoney">({{
                  list?.to_platform_name
              }})</span>
            </p>
            <p v-money="user?.walletInfo[`cate_${item.game_cate_id}_money`] ?? 0"></p>
            <!-- <img
              :src="$getSrc(`/src/assets/images/icon/used.png`)"
              class="most-used"
              alt
              v-if="item.hot === 1"
            />-->
            <svg-icon name="money-hot" v-if="item.hot === 1" />
          </li>
        </ul>
        <div class="transfer" v-if="!openMoney">
          <p>{{ $t('转账金额') }}</p>
          <div class="transfer-money">
            <input type="number" :placeholder="$t('请输入转账金额')" v-model="money" />
            <span @click="transferAll">{{ $t('全部转入') }}</span>
          </div>
          <div class="layout-flex-between aagames-button-box">
            <van-button class="line" @click="backTransAll">{{ $t('一键回收') }}</van-button>
            <van-button type="success" :loading="transLoading" @click="handleSubmit">{{ $t('确认转账') }}</van-button>
          </div>
        </div>
      </div>
    </div>

    <GameTransfer v-model:show="isShow" :type="type" :walletList="walletList" :shareWallet="shareWallet"
      :userWallet="user?.walletInfo ?? {}" @choosedFatherVal="choosedFatherVal" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Toast, Dialog } from 'vant';
import {
  autotrans, trans,
} from '@/api/center';
import { getPlatformGameIdsv2 } from '@/api/game';
import GameTransfer from './components/GameTransfer.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

const openMoney = ref(false);

const list = reactive({
  pay_password: '1',
  from_platform_id: 0,
  to_platform_id: null,
  from_platform_name: global.$t('中心钱包'),
  to_platform_name: global.$t('中心钱包'),
  from_money_code: 'money',
  from_money: '0',
  allMoney: '',
  // money: '',
});
const isShow = ref(false);
const walletList = ref([]);
const activeIndex = ref(-1);
const shareWallet = ref({});
const type = ref(null);
const money = ref('');

// 自动免转钱包
const {
  run: autoTransferRun,
  loading: autoTransferLoading,
} = useRequest(autotrans, {
  manual: true,
  throttleInterval: 500,
  onSuccess() {
    $store.dispatch('user/getWalletInfo');
  },
});

function onChange(value) {
  autoTransferRun({
    is_auto_trans: openMoney.value ? 1 : 2,
  });
}

function walletM() {
  const list02 = walletList.value;
  list02.forEach((val) => {
    if (val.game_cate_id === user?.walletInfo.last_platform_cate_id) {
      val.hot = 1;
    } else {
      val.hot = 0;
    }
    val.money = 0;
    Object.keys(user?.walletInfo).forEach((key) => {
      if (val.game_cate_id === Number(key.split('_')[1]) || key === 'money') {
        val.money = (+user?.walletInfo[key]).toFixed(2);
      }
    });
    // 游戏分类金额
    // 游戏平台金额
    if (val.platform_list) {
      val.platform_list.forEach((item) => {
        Object.keys(user?.walletInfo).forEach((key) => {
          if (item.money_code === key) {
            item.money = (+user?.walletInfo[key]).toFixed(2);
          }
        });
      });
    }
  });

  if (user?.walletInfo.last_platform_cate_id === 0) {
    list02[0].hot = 1;
  }

  walletList.value = list02;
}

const {
  run: gameRun,
  loading: gameDataLoading,
  data: gameData,
} = useRequest(getPlatformGameIdsv2, {
  manual: true,
  formatResult: (data) => {
    if (user?.walletInfo?.last_platform_cate_id === 0) {
      data[0].hot = 1;
    }
    // 筛选共享钱包
    let tmp = [];
    const arr = [];
    data.forEach((item) => {
      item?.list_data.forEach((a) => {
        arr.push(a.money_code);
      });
      if (item.game_cate_id === user?.walletInfo?.last_platform_cate_id) {
        item.hot = 1;
      } else {
        delete item.hot;
      }
    });
    /* eslint-disable */
    tmp = arr.concat()
      .sort()
      .sort((a, b) => {
        if (a === b && tmp.indexOf(a) === -1) return a;
      });
    data.forEach((item) => {
      // if (item.platform_list) {
      item?.list_data.forEach((plist) => {
        tmp.forEach((b) => {
          if (plist.money_code === b) {
            plist.isShare = true;
          }
        });
      });
      // }
    });
    // 标记共享钱包平台
    tmp.forEach((item) => {
      shareWallet.value[item] = [];
      data.forEach((a) => {
        // if (a.platform_list) {
        a?.list_data.forEach((b) => {
          if (b.money_code === item && shareWallet.value[item].indexOf(b.name) === -1) {
            shareWallet.value[item].push(b.name);
          }
        });
        // }
      });
    });
    walletList.value = data;
    // walletM();
    return data;
  },
});
watch(() => user.walletInfo, (val) => {
  if (list.from_platform_name === global.$t('中心钱包')) {
    list.money = user?.walletInfo?.money;
    list.from_money = user?.walletInfo?.money;
    list.allMoney = user?.walletInfo?.money;
  } else {
    list.money = user?.walletInfo?.[list.from_money_code];
    list.from_money = user?.walletInfo?.[list.from_money_code];
    list.allMoney = user?.walletInfo?.[list.from_money_code];
  }
  openMoney.value = val?.is_auto_trans === 1

  gameRun();
}, { immediate: true });

// 确认转账
const {
  run: transRun,
  loading: transLoading
} = useRequest(trans, {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('操作成功'));
    refreshMoney();
  },
});

function handleSubmit() {
  // list.money = money.value;
  if (list.from_platform_id == null) {
    Toast.fail(global.$t('请选择转出账户'));
    return false;
  }
  if (list.to_platform_id == null) {
    Toast.fail(global.$t('请选择转入账户'));
    return false;
  }
  if (!list.money) {
    Toast.fail(global.$t('请输入转账金额'));
    return false;
  }
  transRun({
    money: money.value,
    from_platform_id: list.from_platform_id,
    to_platform_id: list.to_platform_id,
  });
}

function help() {
  Dialog.confirm({
    title: global.$t('温馨提示'),
    message: () => h('div', [
      h('p', global.$t('1.开启后，进入旁观时系统会自动将中心钱包余额充进游戏平台')),
      h('p', global.$t('2.不同游戏类型标识共享钱包时游戏余额共享')),
    ]),
    messageAlign: 'left',
    showCancelButton: false,
    className: 'buttonWidth160 tips-dialog',
    confirmButtonText: global.$t('确认'),
  });
}

function chooseItem(item, index) {
  if (index !== activeIndex.value && index !== -1) {
    list.to_platform_name = global.$t('中心钱包');
    list.to_platform_id = 0;
  }

  if (index === -1) {
    type.value = 1;
    // activeIndex.value = -1;
    walletList.value = [{
      id: 0,
      name: global.$t('中心钱包'),
      money: user?.walletInfo?.money
    }, ...gameData.value];
  } else if (index === 0) {
    walletList.value = [];
    activeIndex.value = index;
  } else {
    activeIndex.value = index;
    type.value = 2;
    const arr = [];
    arr.push(gameData.value[index - 1]);
    walletList.value = arr;
  }

  isShow.value = index !== 0;
}

// 刷新余额
function refreshMoney() {
  global.$store.dispatch('user/getWalletInfo')
}

function backTransAll() {
  $store.dispatch('game/backTransAll').then(() => {
    Toast.success(global.$t('收回余额成功'));
    refreshMoney();
  });
}

function transferAll() {
  money.value = ~~list.allMoney;
}

// list 赋值
function choosedFatherVal(data) {
  Object.assign(list, data);
  money.value = '';
}

</script>

<style lang='less' scoped>
.text-center {
  text-align: center;
}

.transfer-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 30px;

  .m-header {
    order: -1;
  }

  &-main {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 30px;

    .automatic {
      padding: 30px 0;
      height: 120px;
      line-height: 75px;
      overflow: hidden;
      border-bottom: 2px solid var(--border-color-323232);
      margin-right: 10px;
      box-sizing: border-box;

      >span:first-child {
        font-size: 32px;
        color: var(--dark-fff, var(--font-color-ccc));
      }

      >span:last-child {
        color: var(--font-color-fff);
      }

      >.van-switch {
        float: right;
        margin-top: 12px;
        margin-right: 10px;
      }
    }

    .transfer_out {
      padding-bottom: 22px;
      width: 100%;

      >p {
        padding: 30px 0;
        color: var(--dark-fff, var(--font-color-999999));
        font-size: 28px;
      }

      &-title {
        padding-bottom: 0 !important;
      }

      .content {
        height: 100px;
        line-height: 100px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid var(--border-color-323232);

        .arrow-container {
          flex: 1;
          text-align: right;
          color: var(--font-color-666666);
        }

        .van-icon {
          color: var(--font-color-666666);
        }

        >.content_l {
          flex: 2;

          >.wallet {
            float: left;
            color: var(--dark-fff, var(--font-color-ccc));
            font-size: 32px;
          }

          .num {
            float: left;
            color: var(--theme-color);
            font-size: 32px;
            margin-left: 23px;
          }

          >i {
            font-size: 36px;
            color: var(--theme-color);
            transform: rotate(60deg);
          }

          >img {
            display: block;
            float: left;
            width: 23px;
            height: 23px;
            margin: 37px 0 0 15px;
            border-radius: 50%;
          }
        }

        .arrow_r {
          display: block;
          width: 30px;
          height: 23px;
          float: right;
          margin-top: 38px;
        }
      }

      .note {
        font-size: 28px;
        font-weight: 600;
        color: var(--dark-fff, var(--font-color-000000));
      }
    }

    .reback-btn {
      margin-top: 41px;
      width: 100%;
    }

    .transfer {
      width: 100%;
      // margin-top: 40px;

      >p {
        width: 100%;
        color: var(--dark-fff, var(--font-color-222930));
        font-size: 32px;
      }

      >.transfer-money {
        padding: 28px 0;
        box-sizing: border-box;
        width: 100%;
        height: 100px;
        overflow: hidden;
        border-bottom: 2px solid var(--dark-333, var(--border-color-323232));
        align-items: center;

        >input {
          color: var(--dark-fff, var(--theme-color));
          font-size: 32px;
          float: left;
          border: none;
          background-color: transparent;
          padding-left: 0;

          &::placeholder {
            font-size: 32px;
            color: var(--bg-color-3f3f3f);
          }
        }

        >span {
          float: right;
          line-height: 46px;
          color: var(--font-color-24c29a);
          font-size: 28px;
        }
      }
    }

    .aagames-button-box {
      margin-top: 30px;

      .van-button {
        width: calc(50% - 20px);
      }
    }

    ul {
      overflow: hidden;
      flex-wrap: wrap;
      align-items: stretch;

      >li {
        position: relative;
        width: calc(50% - 15px);
        padding: 18px 30px 15px 50px;
        background-color: var(--dark-bg-color-191919, var(--bg-color-f6f6f6));
        border-radius: 8px;
        margin-bottom: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &.active {
          background-color: var(--bg-color-24c29a);
          color: var(--bg-color-ffffff);

          >p:first-child {
            color: var(--font-color-fff);
            opacity: 1;
          }

          >p:nth-child(2) {
            color: var(--font-color-fff);
          }
        }

        >p:first-child {
          color: var(--dark-fff-06, var(--font-color-333333));
          opacity: 0.6;
          font-size: 32px;
          margin: 0;
        }

        >p:nth-child(2) {
          margin: 8px 0 0;
          color: var(--dark-fff, var(--font-color-333333));
          font-size: 32px;
        }

        >.svg-icon-wrap {
          position: absolute;
          display: block;
          width: 60px;
          height: 60px;
          top: 0;
          right: 0;
          transform: translate(0.01333rem, 0.04rem);
          fill: var(--svg-money-hot-color);
        }
      }
    }
  }

  :deep(.van-nav-bar__title) {
    color: var(--font-color-ffffff);
  }

  :deep(.van-nav-bar .van-icon) {
    color: var(--font-color-ffffff);
  }

  .van-button {
    width: 310px;
    height: 90px;
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
    color: var(--dark-666, var(--font-color-666666));
    border: 2px solid var(--dark-666, var(--border-color-666));
  }

  .van-button--primary {
    background-color: var(--bg-color-24c29a);
    width: 100%;
    border: none;
  }
}
</style>
