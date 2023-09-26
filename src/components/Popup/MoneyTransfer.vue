<template>
  <div class="money-transfer-wrap">
    <Popup
      :showCancelBtn="true"
      :show="isShowPopup"
      @clickCloseIcon="closeDialog"
      :title="$t('理财小金库转账')"
    >
      <div class="money-transfer-wrap-main">
        <template v-if="!data.boxShow">
          <div class="layout-flex-center account">
            <div class="treasury">{{data.chooseFather}}</div>
            <img
              @click="changeType"
              :class="{'rotateChose':data.iconType}"
              :src="$getSrc(`/src/assets/images/center/fund-management/choose.png`)"
              alt
            />
            <div class="master_account">{{data.chooseSon}}</div>
          </div>
          <div class="tranfer_amount">
            <p class="amount">{{$t('转入金额')}}</p>
            <div class="layout-flex-center">
              <span class="icon">￥</span>
              <input
                type="number"
                :placeholder="data.chooseText"
                v-model="data.money"
              />
              <span
                class="all"
                @click="data.money = data.chooseMoney"
              >{{$t('全部转入')}}</span>
            </div>

            <van-button
              class="btn"
              :type="data.money && data.money!='0.00' ?'primary':'grey'"
              :loading="transLoading"
              :loading-text="$t('提交中')"
              @click="handleSubmit"
            >{{$t('确认转入')}}</van-button>
          </div>
        </template>
        <div
          class="finshBox"
          v-if="data.boxShow"
        >
          <img
            :src="$getSrc(`/src/assets/images/center/fund-management/right.png`)"
            alt
          />
          <p class="money">¥{{data.money}}</p>
          <p class="tishi">{{type === 2 ? $t('转入成功') : $t('转出成功')}}</p>
          <van-button
            class="btn"
            @click="closeDialog"
          >{{$t('确认')}}</van-button>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { allmoneytype, moneytrans } from '@/api/center';
import Popup from './index.vue';

const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  data: {
    type: Object,
    default: {},
  },
   onClose: {
    type: Function,
  },
});
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const isShowPopup = ref(false);
setTimeout(() => {
  isShowPopup.value = true;
}, 100);

function closeDialog() {
  isShowPopup.value = false;
  props.onClose?.();
}
const data = reactive({
  chooseFather: '',
  chooseSon: '',
  iconType: false,
  money: '',
  chooseText: '',
  chooseSonID: 0,
  chooseFatherID: 0,
  chooseID: 0,
  boxShow: false,
  chooseMoney: 0,
});

const { data: allMoney } = useRequest(allmoneytype, {
  onSuccess(res) {
    Object.keys(res).forEach((item) => {
      if (res[item] === global.$t('理财钱包')) {
        data.chooseFatherID = item;
      }
    });
  },
});
const case1 = {
  chooseFather: global.$t('理财小金库'),
  chooseSon: global.$t('主账户'),
  chooseText: global.$t('你最多转入') + props.data.financing_money + global.$t('元'),
  chooseMoney: props.data.financing_money,
};
const case2 = reactive({
  chooseFather: global.$t('主账户'),
  chooseSon: global.$t('理财小金库'),
  chooseText: global.$t('你最多转入') + user?.walletInfo?.money + global.$t('元'),
  chooseMoney: user?.walletInfo?.money,
});

watch(user.walletInfo, () => {
  case2.chooseText = global.$t('你最多转入') + user?.walletInfo?.money + global.$t('元');
}, { immediate: true });

if (props.type === 1) {
  Object.assign(data, case1);
} else {
  Object.assign(data, case2);
}

function changeType() {
  data.iconType = !data.iconType;

  if (data.chooseFather === global.$t('理财小金库')) {
    Object.assign(data, case2);
    if (data.money) {
      data.money = case2.chooseMoney;
    }
  } else {
    Object.assign(data, case1);
    if (data.money) {
      data.money = case1.chooseMoney;
    }
  }
}

const { run: transRun, loading: transLoading } = useRequest(moneytrans, {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('转账成功'));
    data.boxShow = true;
  },
});
function handleSubmit() {
  if (!data.money) {
    Toast.fail(global.$t('请输入金额'));
    return;
  }
  const {
 chooseFatherID, chooseID, money,
} = data;
  transRun({
    money,
    from_platform_id: data.iconType ? chooseFatherID : chooseID,
    to_platform_id: data.iconType ? chooseID : chooseFatherID,
  });
}

</script>

<style lang='less' scoped>
.money-transfer-wrap {
  &-main {
    padding: 0 30px 30px;

    .account {
      margin-top: 0.667rem;

      .rotateChose {
        transform: rotate(180deg);
      }

      > div {
        text-align: center;
        flex: 1;
        color: var(--font-color-ccc);
        font-size: 28px;
        height: 100px;
        line-height: 100px;
        border-radius: 8px;
        background-color: var(--bg-color-353435);
      }

      > img {
        display: block;
        width: 44px;
        height: 44px;
        margin: 0 44px;
      }
    }

    .tranfer_amount {
      margin-top: 40px;

      > p {
        font-size: 32px;
        color: var(--font-color-999);
        margin: 0;
      }

      > div {
        overflow: hidden;
        height: 100px;
        padding-bottom: 15px;
        line-height: 100px;
        border-bottom: 2px solid var(--border-color-3f3f3f);

        > .icon {
          float: left;
          font-size: 32px;
          color: var(--font-color-999);
        }

        > .all {
          font-size: 32px;
          float: right;
          color: var(--font-color-999);
        }

        > input {
          border: none;
          padding-left: 15px;
          flex: 1;
          height: 100px;
          color: var(--font-color-fff);
          font-size: 32px;
          background-color: var(--bg-color-282828);
        }
      }

      > .btn {
        font-weight: 600;
        color: var(--font-color-fff);
        font-size: 32px;
        margin: 0 auto;
        margin-top: 50px;
        text-align: center;
        width: 100%;

        &.active {
          background-color: var(--theme-color);
          border: 2px solid var(--theme-color);
          color: var(--font-color-fff);
        }
      }
    }

    .finshBox {
      overflow: hidden;

      > img {
        display: block;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        border-radius: 50%;
        margin-top: 60px;
      }

      > .money {
        width: 100%;
        text-align: center;
        color: var(--font-color-ccc);
        font-size: 60px;
        margin-top: 20px;
      }

      > .tishi {
        width: 100%;
        font-size: 28px;
        text-align: center;
        color: var(--font-color-fff);
        margin: 15px 0;
      }

      > .btn {
        display: block;
        font-weight: 600;
        font-size: 32px;
        color: var(--font-color-1e1e1e);
        width: 100%;
        margin-top: 60px 0 40px;
      }

      > .text {
        text-align: center;
        color: var(--font-color-999);
        margin-top: 40px;
        font-size: 28px;
      }
    }
  }
}
.van-button--grey{
  background: var(--theme-color);
  opacity: .5;
  color: var(--font-color-232321) !important;
}
.van-button--default{
  background: var(--theme-color);
}
</style>
