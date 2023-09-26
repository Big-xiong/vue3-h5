<template>
  <div class="bank-wrap">
    <div class="layout-flex-between input bank" @click="chooseBank">
      <div class="input-head bank-icon">
        <!-- <BankIcon :bankCode="bankcard.icon_code" /> -->
        <BankIcon :bankCode="activeBank?.icon_code.toLowerCase()" />
      </div>
      <div class="input-body">
        <h3>{{ activeBank?.bank_name }}</h3>
        <p>{{ $t('尾号') }}{{ activeBank?.card_no && activeBank?.card_no.slice(-4) }}</p>
      </div>
      <div class="input-foot">
        <span>{{ $t('切换') }}</span>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="input-box">
      <label>{{ $t('取款金额') }}</label>
      <div class="input">
        <div class="input-head">{{ user?.userInfo?.currency_detail?.symbol }}</div>
        <div class="input-body">
          <input type="text" :class="{ 'has-value': String(withdraw_money).length }" @blur="checkNum"
            v-model="withdraw_money" :placeholder="placeHolder" />
        </div>
        <div class="input-foot">
          <span class="withdrawAll" @click="setAll">{{ $t('全部') }}</span>
        </div>
      </div>
    </div>
    <TotalMoney />

    <Fees :fee="costManage[0]" :admin="costManage[1]" :profit="costManage[2]" />
    <div class="actual">
      {{ $t('实际到账金额') }}
      <span v-money="costManage[3] || 0"></span>
    </div>

    <div v-if="user?.userInfo?.is_pay_password !== 2">
      <label>{{ $t('资金密码') }}</label>
      <div class="layout-flex-center input password-wrap" @click="setFundPassword">
        <div class="input-body">
          <p>{{ $t('为保障您的资金安全,请您先设置资金密码') }}</p>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="aagames-tips">{{ $t('取款流水验证有1-3分钟数据延迟，3-5分钟提款到账') }}</div>
    <van-button :disabled="!withdraw_money || commitLoading" :loading="commitLoading" type="success"
      @click="beforeCommit" class="save-btn">{{ $t('确认提交') }}</van-button>

    <WidthdrawPass v-model:show="show" @finish="commitQk" />
  </div>
</template>

<script setup>
import {
  inject, reactive, computed, defineProps, defineEmits, ref, watch, h, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Dialog, Toast } from 'vant';
import { withdraw } from '@/api/center';
import BankIcon from '@/components/BankIcon.vue';
import WidthdrawPass from './WidthdrawPass.vue';
import { priceFormat } from '@/utils';
import Fees from './Fees.vue';
import TotalMoney from './TotalMoney.vue';

const props = defineProps({
  siteinfo: {
    type: Object,
    default: null,
  },
  withDrawLimitInfo: {
    type: Object,
    default: null,
  },
  currencyType: {
    type: Number,
    default: 1,
  },
});

// 手续费，行政费，优惠，可取
const fees = {
  fee: 0,
  admin: 0,
  profit: 0,
  resFee: 0,
};

const actualMoney = ref(0);
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const myBankCards = computed(() => user?.userInfo?.user_bank ?? []);
const activeBank = ref(myBankCards.value[0]);
const withdraw_money = ref('');
const costManage = ref([0, 0, 0, 0]);
const show = ref(false);

function chooseBank() {
  global.$popup({
    title: global.$t('开户银行'),
    closeIconPosition: 'top-left',
    tpl: 'BankList',
    bankList: myBankCards.value,
    showBankName: true,
    onSelect: (data) => {
      activeBank.value = data;
    },
  });
}

const placeHolder = computed(() => {
  // const miniMoney = props?.siteinfo?.cost_manage?.money_range[0] || 0;
  const symbol = user?.userInfo?.currency_detail?.symbol || '';
  const money = user.walletInfo?.money || '0';
  // const maxMoney = props?.siteinfo?.cost_manage.money_range[1] || 0;
  // return `${$t(`最低取款金额`)}${symbol}${miniMoney},${$t(`最高取款金额`)}${symbol}${maxMoney}`;
  return `${$t(`可取`)}${symbol}${priceFormat(money)}`;
});

function checkNum() {
  const reg = /.*\..*/;
  if (reg.test(withdraw_money.value)) {
    Toast.fail(global.$t('取款金额只能为正整数，不能带小数点'));
  }
}

function showTips() {
  Dialog
    .confirm({
      title: global.$t('扣款详情'),
      message: () => h('div', [
        h('p', global.$t('手续费：取款时根据取款金额收取的手续费')),
        h('p', global.$t('行政费：领取红利产生未达标的流水按照比例扣除的费用')),
        h('p', global.$t('扣除优惠：领取红利之后未达标流水要求时申请取款需要扣除的红利金额')),
        h('p', global.$t('最后可取：扣除手续费、行政费和优惠之后可以取款的总金额')),
      ]),
      cancelButtonText: global.$t('联系客服'),
      messageAlign: 'left',
      confirmButtonText: global.$t('确认'),
    })
    .then(() => {
      // on confirm
    })
    .catch(() => {
      global.$openKefu();
    });
}

function judgeCostMethod() { // 判断是否需要手续费 true 需要 false 不需要
  const costManage02 = props.siteinfo?.cost_manage;
  if (!costManage02.bank_limit_open) {
    return false;
  }
  if (costManage02.level_limit.indexOf(user?.userInfo?.level) !== -1) {
    return false;
  }
  if (costManage02.white_list.split(',')
    .indexOf(user?.userInfo?.username) !== -1) {
    return false;
  }
  return true;
}

function computeCostManage(moneyStr) {
  // 手续费：根据用户输入的取款金额判断后台返回扣除费用
  // 行政费：存款金额（未达到流水部分）*后台配置百分比
  // 扣除优惠：后台返回字段数据
  // 计算出最后可取金额，自动填充到输入取款金额输入框
  // 数字货币手续费
  const money = Number(moneyStr);
  const {
    administrative_rate,
    withdraw_fees,
    dig_fee,
  } = props.siteinfo?.cost_manage;
  // [取款手续费, 行政费, 扣除优惠, 可取金额]
  const costs = [0, 0, 0, 0];
  let fee = null;
  // 手续费
  if (money && judgeCostMethod()) {
    // withdraw_fees.some((item, index, _ary) => {
    //   if (item.withdraw_fee_type === 1) {
    //     fee = item.withdraw_fee;
    //   } else if (item.withdraw_fee_type === 2) {
    //     fee = (money * (item.withdraw_fee / 100)).toFixed(2);
    //   } else {
    //     fee = item.withdraw_fee;
    //   }
    //   return money * 1 <= item.withdraw_fee_max * 1;
    // });
    withdraw_fees.forEach((item) => {
      console.log(money, item.withdraw_fee_max, item.withdraw_fee_min);
      if ((money === Number(item.withdraw_fee_max) || money === Number(item.withdraw_fee_min)) || (
        money < Number(item.withdraw_fee_max) && money > Number(item.withdraw_fee_min)
      )) {
        fee = Number(item.withdraw_fee);
      }
    });

    if (fee === null) {
      fee = Number(withdraw_fees[withdraw_fees.length - 1].withdraw_fee);
    }

    costs[0] = props.siteinfo?.cost_manage?.fees_type && props.siteinfo?.cost_manage?.fees_type === 2 ? (money * (fee / 100)) : fee;
  }

  // 行政费
  if (props.withDrawLimitInfo?.draw_limit_amount) {
    costs[1] = (Math.min(props.withDrawLimitInfo?.draw_limit_amount, money)
      * administrative_rate).toFixed(2);
  }
  // 扣除优惠
  costs[2] = props.withDrawLimitInfo?.deduction_money;
  // 可取金额（避免为负
  costs[3] = Math.max(money - costs[0] - costs[1] - costs[2], 0)
    .toFixed(2);
  costManage.value = costs;
}

watch(withdraw_money, (val) => {
  computeCostManage(val);
});

function setAll() {
  withdraw_money.value = Math.floor(user.walletInfo?.money ?? 0);
}

function beforeCommit() {
  if (user.userInfo?.is_pay_password === 2) {
    show.value = true;
  } else {
    setFundPassword();
  }
}

const {
  run: commitRun,
  loading: commitLoading,
} = useRequest(withdraw, {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('提交成功'));
    withdraw_money.value = '';
    global.$router.go(-1);
  },
});

function commitQk(data) {
  commitRun({
    withdraw_money: withdraw_money.value,
    pay_password: data,
    user_bank_id: activeBank.value.id,
    currency_type: props.currencyType,

  });
}

function setFundPassword() {
  global.$popup({
    tpl: 'AgentChangePayPassword',
    hasFooter: true,
    userInfo: user?.userInfo,
  });
}
</script>

<style lang="less" scoped>
.bank-wrap {
  padding-bottom: 30px;
  margin-top: 42px;

  p {
    margin: 0;
  }

  .input-box {
    margin-bottom: 20px;
  }

  .input {
    font-size: 28px;
    border-bottom: 2px solid var(--dark-525152, var(--border-color-ececec));
    height: 120px;
    display: flex;
    align-items: center;
    display: flex;
    justify-content: flex-start;

    &.bank {
      margin-bottom: 80px;
    }

    :deep(input) {
      padding-right: 40px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 68px;

      &::placeholder {
        color: var(--dark-525152, var(--font-color-cccccc)) !important;
      }
    }

    &-head {
      color: var(--dark-fff, var(--font-color-cccccc));
      min-width: 40px;

      &.bank-icon {
        width: 100px;
      }
    }

    &-body {
      width: 100%;
      text-align: left;
      line-height: 40px;
      font-size: 32px;

      h3 {
        color: var(--dark-fff, var(--font-color-333333));
      }

      p {
        color: var(--dark-fff, var(--font-color-333333));
        opacity: 0.6;
        font-size: 28px;
      }

      input,
      textarea {
        width: 100%;
        background-color: transparent;
        border: none;
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-525152));
        padding-left: 0 !important;

        &.has-value {
          font-size: 64px;
          color: var(--dark-fff, var(--font-color-000));
        }
      }
    }

    &-foot {
      min-width: 60px;
      display: flex;
      align-items: center;
      white-space: nowrap;

      span,
      van-icon {
        color: var(--dark-fff, var(--font-color-333333));
      }

      .van-icon {
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-333333));
        margin-left: 10px;
        margin-right: 20px;
      }

      .withdrawAll {
        margin-right: 24px;
        color: var(--theme-color);
      }
    }

    .van-image {
      width: 60px;
    }

    h3 {
      margin: 0;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .red {
      color: var(--font-color-f66);
      opacity: 1;
    }
  }

  label {
    display: block;
    font-size: 32px;
    line-height: 40px;
    margin-top: 52px;
    color: var(--dark-fff, var(--font-color-000000));

    .van-icon {
      color: var(--theme-color);
    }
  }

  :deep(.bankIcon) {
    width: 64px;
    height: 64px;

    .van-image {
      width: 64px;
      height: 64px;
    }
  }

  .table {
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 30px;
    width: 100%;
    font-size: 28px;

    th {
      background-color: var(--bg-color-24c29a);
      color: var(--font-color-ffffff);
      font-weight: normal;
      border: 2px solid var(--border-color-18703);
      padding: 25px 0;
    }

    td {
      background-color: var(--bg-color-282828);
      border: 2px solid var(--border-color-18703);
      text-align: center;
      padding: 25px 0;
      color: var(--dark-fff, var(--font-color-333333));
    }
  }

  .aagames-tips {
    color: var(--dark-fff, var(--font-color-333333));
    font-size: 24px;
    margin-top: 100px;
    opacity: 0.6;
    text-align: center;
  }

  .save-btn {
    width: 100%;
    margin-top: 30px;

    &.van-button--disabled {
      background-color: var(--bg-color-7ae5ce) !important;
    }
  }
}

:deep(.van-button--success) {
  background-color: var(--bg-color-24c29a);
  border: none;
}

:deep(.van-button--normal) {
  color: var(--font-color-ffffff);
}

.actual {
  font-size: 28px;
  margin-top: 23px;
  color: var(--dark-999, var(--font-color-929292));

  span {
    color: var(--theme-color);
  }
}
</style>
