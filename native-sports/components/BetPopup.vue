<template>
  <van-popup
    teleport="body"
    v-model:show="show"
    position="bottom"
    close-on-popstate
    close-on-click-overlay
    round
  >
    <main
      class="bet-popup-wrap"
      v-if="targetOdds"
    >
      <div class="bet-info-wrap">
        <div class="left-wrap">
          <div>{{ targetOdds?.teamInfo?.homeName }} VS {{ targetOdds?.teamInfo?.awayName }}</div>
          <div>{{ targetOdds?.odds?.selected?.keyName }} {{ targetOdds?.odds?.selected?.point }}</div>
          <div>{{ targetOdds?.odds?.betTypeName }}</div>
          <div>{{ targetOdds?.leagueName }}</div>
        </div>
        <div class="divider"></div>
        <div class="right-wrap">@{{ !money.value ? targetOdds?.odds?.selected?.oddsPrice[pan] : ticketData?.price }}
        </div>
      </div>
      <div class="bet-status-wrap">
        <div>
          {{ $t('余额') }}：
          <span>¥{{ money.toFixed(2) ?? '0' }}</span>
        </div>
        <div>
          {{ $t('限额') }}：
          <span>¥{{ money ? ticketData?.minBet : 0 }}-{{ money ? ticketData?.maxBet : 0 }}</span>
        </div>
      </div>

      <div class="input-wrap">
        <span>¥</span>
        <input
          @tap.prevent.stop="onFocus"
          type="text"
          :value="amount"
          ref="input"
          :placeholder="$t('请输入金额')"
        />
      </div>
      <KeyBoard
        ref="keyboardRef"
        @input="amount = $event"
      />
      <div class="btn-wrap">
        <div
          @click="doParlay"
          :class="{ disabled: targetOdds?.odds?.combo === 0 }"
        >{{ selectedOdds ? '-' : '+' }}{{ $t('串关') }}</div>
        <van-button
          :loading="betLoading"
          class="submit-btn"
          :disabled="!amount || !money"
          @click="submitBet"
        >{{ $t('确定投注') }}</van-button>
      </div>
    </main>
  </van-popup>

  <van-popup
    teleport="body"
    position="bottom"
    round
    v-model:show="showSuccess"
  >
    <Success
      @confirm="onConfirm"
      @continue="onContinue"
      :betData="betData"
      :odds-data="targetOdds"
    />
  </van-popup>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { place_bet, single_ticket } from '../api/bet';
import Success from './SuccessPopup.vue';
import { ODDS_TYPE } from '../const';
import KeyBoard from './KeyBoard.vue';

const amount = ref('');

const { t } = useI18n();
const keyboardRef = ref();
const input = ref();
const show = ref(false);
const showSuccess = ref(false);

const inputFocus = ref(false);

function onFocus() {
  document.activeElement.blur();
  input.value.setAttributes('readonly', 'true');
  setTimeout(() => {
    input.value.removeAttributes('readonly');
  }, 200);
}

onMounted(() => {
});

defineProps({
  ticket: {
    type: Object,
    default: () => ({}),
  },
  odds: {
    type: Object,
    default: () => ({}),
  },
});

const { user } = useStore().state;

function onConfirm() {
  showSuccess.value = false;
  show.value = false;
}

watch(() => amount.value, () => {
  input.value.focus();
});

const store = useStore();
const pan = computed(() => store.state.app.pan);

const { data: ticketData, run: getSingleTicket } = useRequest((params) => single_ticket(params), {
  manual: true,
});
const targetOdds = computed(() => store.state.app.singleOdds);

function onContinue() {
  showSuccess.value = false;
  getTickets(targetOdds.value);
  keyboardRef.value.clear();
}

watch(() => show.value, (val) => {
  if (!show.value) keyboardRef.value.clear();
  if (val) {
    nextTick(() => {
      document.querySelector('input').focus();
    });
  }
});

async function getTickets(event) {
  if (!event.odds) {
    return;
  }
  try {
    const res = await getSingleTicket({
      sport_type: event.sportType,
      market_id: event.odds.marketId,
      key: event.odds.selected.key,
      odds_type: ODDS_TYPE[pan.value],
      LOADING: true,
    });
    if (res) show.value = true;
  } catch (e) {
    console.error(e);
    show.value = false;
  }
}

const { data: betData, loading: betLoading, run: doBet } = useRequest(() => place_bet({
  sport_type: targetOdds.value.sportType,
  market_id: targetOdds.value.odds.marketId,
  odds_type: ODDS_TYPE[pan.value],
  stake: Number(amount.value),
  point: targetOdds.value.odds.selected.point || 0,
  key: targetOdds.value.odds.selected.key,
  odds_option: 0,
  price: ticketData.value.price,
}), {
  manual: true,
  onSuccess() {
    Toast(t('下注成功'));
    showSuccess.value = true;
    show.value = false;
    amount.value = '';
    store.dispatch('user/getBalance');
  },
});

const money = computed(() => user.balance);

function submitBet() {
  if (!money.value) {
    return Toast(t('请先存款'));
  }
  const { maxBet, minBet } = ticketData.value;
  const errorText = `${t('投注限额')}${minBet}-${maxBet}`;
  if (Number(amount.value) > maxBet) {
    return Toast(errorText);
  }
  if (Number(amount.value) < minBet) {
    return Toast(errorText);
  }

  doBet();
}

const multipleOdds = computed(() => store.state.app.multipleOdds);

const selectedOdds = computed(() => {
  const { eventId } = targetOdds.value;
  const { marketId } = targetOdds.value.odds;
  const { key } = targetOdds.value.odds.selected;

  return multipleOdds.value.find((item) => item.eventId === eventId
    && item.odds.marketId === marketId
    && item.odds.selected.key === key);
});

function doParlay() {
  if (targetOdds.value.odds.combo === 0) {
    return;
  }

  store.commit('app/TOGGLE_MULTIPLE_ODDS', targetOdds.value);
  amount.value = '';
  show.value = false;
}

watch(() => targetOdds.value, async (data) => {
  await store.dispatch('user/getBalance');
  if (data && money.value) {
    getTickets(data);
  } else if (data) {
    show.value = true;
  }
}, { deep: true });

</script>

<style lang="less">
.bet-popup-wrap {
  box-sizing: border-box;
  padding: 30px 32px;

  .bet-info-wrap {
    height: 248px;
    background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);
    border-radius: 16px;
    align-items: center;
    display: flex;
    color: var(--text-color);
    margin-bottom: 24px;

    .left-wrap {
      width: 406px;
      display: flex;
      flex-direction: column;
      padding-top: 28px;
      padding-left: 40px;
      padding-bottom: 30px;
      font-size: 28px;
      color: var(--font-color-fff);
      line-height: 40px;

      div {
        margin-top: 8px;
        white-space: nowrap;
      }

      div:first-child {
        font-weight: 700;
        height: 40px;
      }

      div {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .divider {
      width: 2px;
      height: 166px;
      opacity: 0.1;
      background-color: var(--card-bg-color, var(--bg-color-fff));
    }

    .right-wrap {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: center;
      font-size: 48px;
      font-weight: 500;
      color: var(--font-color-fff);
    }
  }

  .bet-status-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    font-weight: 400;
    color: var(--font-color-848A9B);
    line-height: 40px;
    margin-bottom: 42px;

    span {
      color: var(--dark-fff, var(--font-color-0A0A0A));
    }
  }

  .input-wrap {
    height: 100px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
    box-sizing: border-box;
    padding-left: 24px;
    font-size: 32px;
    line-height: 44px;
    color: var(--dark-fff, var(--font-color-0A0A0A));

    input {
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      background-color: transparent;
      margin-left: 12px;

      &::placeholder {
        color: var(--font-color-848A9B);
      }
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: space-between;

    div:first-child {
      width: 240px;
      height: 68px;
      border-radius: 8px;
      border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-0A0A0A));

      &.disabled {
        color: var(--dark-disabled-font, var(--disabled-font-color));
        background-color: var(--dark-disabled-bg, var(--disabled-bg-color));
      }
    }

    .van-button {
      width: 420px;
      height: 68px;
      background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);
      border: none;
      color: var(--text-color);
      font-size: 28px;
      border-radius: 8px;

      .van-loading {
        border: none;
      }

      .van-button__content {
        border: none;
        width: 100%;
        border: none;
        color: var(--font-color-fff);
      }
    }
  }
}
</style>
