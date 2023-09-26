<template>
  <div class="digital-wrap">
    <label>{{ $t('提款币种') }}</label>
    <div class="layout-flex-between tiker-wrap" @click="showDig">
      <input style="text-transform: uppercase;" disabled type="text" v-model="form.dig_mode_type" />
      <!-- <span style="text-transform: uppercase;">{{ form.dig_mode_type }}</span> -->
      <van-icon name="arrow-down" />
    </div>
    <label>{{ $t('协议') }}</label>
    <div class="protocol">
      <span :class="{ 'active': form.protocol === item.value }" @click="handleProtocol(item.value)"
        v-for="(item, index) in protocalList?.filter(m => m.type === form.dig_mode_type)[0]?.protocol ?? []"
        :key="index">{{ item.name }}</span>
    </div>
    <label>{{ $t('收币地址') }}</label>
    <div class="layout-flex-center tiker-wrap">
      <input type="text" :placeholder="$t('请粘贴地址')" @blur="handleAddress" v-model="form.address" />
      <SvgIcon @click="handleDig" name="address1" />
      <!-- <img @click="handleDig" :src="$getSrc(`/src/assets/images/center/address@2x.png`)" alt /> -->
    </div>
    <div class>
      <label>{{ $t('取款金额') }}</label>
      <div class="layout-flex-center input">
        <div class="input-head">{{ user?.userInfo?.currency_detail?.symbol }}</div>
        <div class="input-body">
          <input type="text" @blur="checkNum" v-model="withdraw_money" class="has-value"
            :placeholder="`${$t(`可取`)}${priceFormat(user.walletInfo?.money || '0')}`" />
        </div>
        <div class="input-foot">
          <span class="withdrawAll" @click="setAll">{{ $t('全部') }}</span>
        </div>
      </div>
      <TotalMoney />
    </div>
    <Fees :fee="costManage[0]" :admin="costManage[1]" :profit="costManage[2]" />
    <p class="digital-wrap-get">
      {{ $t('预计到账') }}
      <span>{{ money }} </span>
      {{ form.dig_mode_type }}（{{ $t('实时汇率') }}{{ tickerList?.upCoin }}）
    </p>
    <div class="aagames-tips">{{ $t('温馨提示：取款流水验证有1-3分钟数据延迟，3-5分钟提款到账') }}</div>
    <van-button :disabled="!withdraw_money || !form.address" :loading="commitLoading" type="primary"
      @click="beforeCommit" class="save-btn">{{ $t('确认提交') }}</van-button>

    <WidthdrawPass v-model:show="show" @finish="commitQk" />
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, defineProps, watch, h, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { Dialog, Toast } from 'vant';
import {
  staticprotocol,
  getticker,
  withdraw,
  adddigwallet,
  digwalletlist,
} from '@/api/center';
import TotalMoney from './TotalMoney.vue';

import WidthdrawPass from './WidthdrawPass.vue';
import { priceFormat, dateFormat } from '@/utils';
import Fees from './Fees.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;
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
    default: 2,
  },
});
const withdraw_money = ref('');
const costManage = ref([0, 0, 0, 0]);
const form = reactive({
  dig_mode_type: '',
  protocol: '',
  address: props.address,
  user_dig_wallet_id: '',
});
const show = ref(false);

const route = useRouter();
const { query } = route.currentRoute.value;

watch(() => query, () => {
  if (query.param) {
    const param = JSON.parse(query.param);
    form.address = param.address;
    form.protocol = param.protocol;
    form.user_dig_wallet_id = param.id;
    withdraw_money.value = param.withdraw_money;
    computeCostManage(withdraw_money.value);
  }
}, { immediate: true });

// 汇率
const { run: tickerRun, data: tickerList } = useRequest(getticker, {
  manual: true,
});
// 提款币种
const { run: protocalRun, data: protocalList } = useRequest(staticprotocol, {
  onSuccess(res) {
    form.dig_mode_type = res[0].type;
    if (!query.param) {
      form.protocol = res[0].protocol[0].value;
    }
    tickerRun({ digital_mode_type: res[0].protocol[0].value });
  },
});
function checkNum() {
  const reg = /.*\..*/;
  if (reg.test(form.withdraw_money)) {
    Toast.fail(global.$t('取款金额只能为正整数，不能带小数点'));
  }
}
function handleProtocol(val) {
  form.protocol = val;
  form.address = '';
  form.user_dig_wallet_id = '';
  route.replace({ query: {} });
  tickerRun({ digital_mode_type: val });
}

function judgeCostMethod() { // 判断是否需要手续费 true 需要 false 不需要
  const costManage02 = props.siteinfo?.cost_manage;
  if (costManage02.level_limit.indexOf(user?.userinfo?.level) !== -1) {
    return false;
  }
  if (costManage02.white_list.split(',').indexOf(user?.userinfo?.username) !== -1) {
    return false;
  }
  return true;
}
function computeCostManage(money) {
  // 手续费：根据用户输入的取款金额判断后台返回扣除费用
  // 行政费：存款金额（未达到流水部分）*后台配置百分比
  // 扣除优惠：后台返回字段数据
  // 计算出最后可取金额，自动填充到输入取款金额输入框
  // 数字货币手续费
  const {
    administrative_rate, withdraw_fees, dig_fee, fees_type,
  } = props.siteinfo?.cost_manage ?? {};
  // [取款手续费, 行政费, 扣除优惠, 可取金额]
  const costs = [0, 0, 0, 0];
  // 手续费
  if (money && judgeCostMethod()) {
    // if (fees_type === 2) {
    //   costs[0] = (money * (dig_fee / 100)) * 1;
    // } else {
    //   costs[0] = (money * dig_fee).toFixed(2) * 1;
    // }
    costs[0] = (money * dig_fee).toFixed(2) * 1;
  }
  // 行政费
  if (props.withDrawLimitInfo?.draw_limit_amount) {
    costs[1] = (Math.min(props.withDrawLimitInfo?.draw_limit_amount, money)
      * administrative_rate).toFixed(2);
  }
  // 扣除优惠
  costs[2] = props.withDrawLimitInfo?.deduction_money;
  // 可取金额（避免为负
  costs[3] = Math.max(money - costs[0] - costs[1] - costs[2], 0).toFixed(2);
  costManage.value = costs;
}

const money = computed(() => {
  const upCoin = tickerList?.value?.upCoin ?? 0;
  if (!isNaN(costManage.value[3]) && upCoin !== 0) {
    return (costManage.value[3] / upCoin).toFixed(2);
  }
  return 0;

  // costManage[3] && tickerList?.upCoin ? (costManage[3] / tickerList?.upCoin).toFixed(2) : 0
});

watch(withdraw_money, (val) => {
  computeCostManage(val);
});

function handleDig() {
  global.$router.push({
    name: 'centerDigitalAddress',
    query: { param: JSON.stringify({ ...form, withdraw_money: withdraw_money.value }) },
  });
}
async function handleAddress() {
  const time = dateFormat('HH:MM', (new Date()).getTime());
  const param = {
    type: form.dig_mode_type,
    protocol: form.protocol,
    address: form.address,
    remark: `${form.protocol} ${time}`,
  };
  if (form.address) await adddigwallet(param);
  const res = await digwalletlist();
  form.user_dig_wallet_id = res[0].id;
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

function setAll() {
  withdraw_money.value = Math.floor(user.walletInfo?.money ?? 0);
}

function showDig() {
  global.$popup({
    tpl: 'DigitalType',
    list: protocalList.value,
    onSelect(data) {
      form.dig_mode_type = data.type;
    },
  });
}

function beforeCommit() {
  show.value = true;
}

const { run: commitRun, loading: commitLoading } = useRequest(withdraw, {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('提交成功'));
    global.$popup({
      tpl: 'WidthdrawRes',
      money: withdraw_money.value,
    });
  },
});
function commitQk(data) {
  commitRun({
    ...form,
    currency_type: props.currencyType,
    // user_dig_wallet_id: form?.id,
    withdraw_money: withdraw_money.value,
    pay_password: data,
    user_bank_id: user?.userInfo?.user_bank[0]?.id,
  });
}

</script>

<style lang="less" scoped>
.digital-wrap {
  padding-bottom: 30px;
  margin-top: 50px;

  input {
    &::placeholder {
      color: var(--dark-fff, var(--font-color-cccccc)) !important;
    }
  }

  label {
    display: block;
    font-size: 32px;
    line-height: 40px;
    margin-top: 30px;
    color: var(--dark-fff, var(--font-color-969696));

    .van-icon {
      color: var(--theme-color);
    }
  }

  &-get {
    color: var(--font-color-606060);
    text-transform: uppercase;
    padding-top: 40px;

    span {
      color: var(--theme-color);
    }
  }

  .input {
    height: 120px;
    font-size: 28px;
    border-bottom: 2px solid var(---dark-fff, var(--border-color-ececec));
    margin-bottom: 18px;

    &-head {
      color: var(--dark-fff, var(--font-color-222930));
      min-width: 20px;

      &.bank-icon {
        width: 100px;
      }
    }

    &-body {
      width: 100%;
      text-align: left;
      font-size: 32px;
      line-height: 40px;

      input,
      textarea {
        width: 100%;
        background-color: transparent;
        border: none;
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-525152));
        padding-left: 0 !important;

        &.has-value {
          &:placeholder-shown {
            font-size: 28px;
          }

          font-size: 68px;
          color: var(--dark-fff, var(--font-color-000));
        }
      }
    }

    &-foot {
      min-width: 60px;
      display: flex;
      align-items: center;
      white-space: nowrap;

      .van-icon {
        font-size: 40px;
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
    }
  }

  .tiker-wrap {
    border: 2px solid var(--border-color-525152-02);
    border-radius: 8px;
    height: 88px;
    margin-top: 30px;
    padding: 0 15px;
    color: var(--dark-525152, var(--font-color-333333));

    input {
      flex: 1;
      background-color: transparent;
      border: 0;

      &:disabled {
        opacity: 1;
        color: var(--font-color-fff, var(--font-color-333333)) !important;
      }
    }

    .svg-icon-wrap {
      width: 36px;
      fill: var(--dark-fff, var(--font-color-969696));
    }
  }

  .protocol {
    margin-top: 10px;

    span {
      display: inline-block;
      width: 200px;
      height: 80px;
      border-radius: 12px;
      opacity: 0.4;
      border: 2px solid var(--dark-525152, var(--border-color-00002));
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      margin-right: 20px;
      color: var(--dark-ccc, var(--font-color-666666));

      &.active {
        border: 4px solid var(--theme-color);
        color: var(--theme-color);
        opacity: 1;
      }
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
  }
}
</style>
