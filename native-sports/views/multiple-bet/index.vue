<template>
  <main
    class="multiple-bet-page-wrap"
    @click.stop="showKeyboard(-1)"
  >
    <van-nav-bar
      :title="`${$t('串关')}${oddsData.length ? `(${oddsData.length})` : ''}`"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <section class="page-body">
      <header>
        <span>
          {{ $t('余额') }}
          <strong>¥{{ balance ?? '0' }}</strong>
        </span>
        <span @click="showConfirm = true">{{ $t('全部删除') }}</span>
      </header>

      <ul class="bet-item-wrap">
        <li
          class="bet-item"
          v-for="(item, index) in oddsData"
          :key="index"
          :class="{
            'attension': hasSameEvent(item, index) || oddsData.length < item.odds.combo,
            'closed': item.odds.marketStatus !== 'running'
          }"
        >
          <div class="info-wrap">
            <img
              :src="$getSrc('/src/assets/native-sports/images/close-tab.png')"
              @click="removeOdds(index)"
              alt
            />

            <div class="left-wrap">
              <header>
                {{ item.odds.selected?.key === 'h' ? item.teamInfo.homeName : item.teamInfo.awayName }}
                <span>
                  {{ item.odds.selected?.point }}{{
                      item.odds.selected?.point ? `/${item.odds.selected?.point}` :
                        ''
                  }}
                </span>
              </header>
              <div>{{ item.odds.selected?.betTypeName }}</div>
              <div>{{ item.leagueName }}</div>
              <div>{{ item.teamInfo.homeName }}-{{ item.teamInfo.awayName }}</div>
            </div>
            <div class="divider"></div>
            <div class="right-wrap">
              <span class="price">@{{ item.odds.selected?.oddsPrice[pan] }}</span>
              <div class="closed-wrap">
                <img
                  :src="$getSrc('/src/assets/native-sports/images/price-closed.png')"
                  alt=""
                >
                <span>{{ $t('盘口已关闭') }}</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <img
              :src="$getSrc('/src/assets/native-sports/images/parlay_warning.png')"
              alt
            />
            <span>
              {{
                  oddsData.length <
                    item.odds.combo
                    ?
                    $t('注单个数小于此赛事的最小要求')
                    +
                    `(${item.odds.combo})`
                    :
                    $t('不可选择同个赛事')
              }}
                </span
              >
          </div>
        </li>
      </ul>
    </section>

    <section
      class="page-footer"
      v-if="parlayTicketData"
    >
      <header>
        <span
          v-if="parlayTicketData?.combos.length > 1"
          @click="displayMoreParlay = !displayMoreParlay"
        >{{ displayMoreParlay ? $t('关闭更多串关方式') : $t('展开更多串关方式') }}</span>
        <span>{{ $t('共投注') }}: {{ total }}</span>
      </header>

      <div
        class="input-wrap"
        v-for="(item, index) in (displayMoreParlay ? parlayTicketData?.combos ?? [] : parlayTicketData.combos.slice(0, 1))"
        :key="index"
      >
        <div class="input-body">
          <div class="input-left">
            <span>{{ item.comboTypeName }}</span>
            <span>@{{ Number(item.price).toFixed(2) }}</span>
          </div>
          <div class="input-right">
            <span>
              {{ index + 1 }}
              <em>*</em>
            </span>
            <div class="input-outline">
              <span>¥</span>
              <input
                @click.stop="showKeyboard(index)"
                :placeholder="`${$t('限额')}${item.minBet}-${item.maxBet}`"
                :value="item.amount"
                readonly
              />
            </div>
          </div>
        </div>
        <KeyBoard
          @click.stop
          v-show="item.showKeyboard"
          @input="item.amount = $event"
        />
      </div>

      <van-button
        class="submit-button"
        :loading="placeLoading"
        :disabled="Number(total) <= 0"
        @click="doParlay"
      >{{ $t('投注') + `${Number(total) > 0 ? ` ${t('可赢')}${maxWinning}` : ''}` }}</van-button>
    </section>
  </main>

  <Confirm
    v-model:show="showConfirm"
    @confirm="deleteAll"
  />
  <van-popup
    teleport="body"
    position="bottom"
    round
    v-model:show="showSuccess"
  >
    <SuccessPopup
      @confirm="onConfirm"
      @continue="onContinue"
      :betData="betData"
      :odds-data="targetOdds"
      is-parlay
    />
  </van-popup>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRequest } from 'ahooks-vue';
import { useI18n } from 'vue-i18n';
import { Toast } from 'vant';
import { GetParlayTickets, parlay_tickets, place_parlay } from '../../api/bet';
import Confirm from './confirm.vue';
import KeyBoard from '../../components/KeyBoard.vue';
import { GetMarkets } from '../../api/home';
import SuccessPopup from '../../components/SuccessPopup.vue';

const store = useStore();

const { user } = store.state;
const money = computed(() => user.balance);
const pan = computed(() => store.state.app.pan);

const displayMoreParlay = ref(false);
const showConfirm = ref(false);
const oddsData = computed(() => store.state?.app?.multipleOdds ?? []);
const parlayTicketData = ref(null);
const showSuccess = ref(false);
const betData = ref({});

const router = useRouter();

function deleteAll() {
  store.commit('app/CLEAR_PARLAY');
  showConfirm.value = false;
  localStorage.removeItem('multiple-odds');
  localStorage.removeItem('multiple-tickets');
  router.back();
}

function onConfirm() {
  showSuccess.value = false;
  deleteAll();
}

function hasSameEvent(event, eventIndex) {
  return oddsData.value.find((item, index) => item.eventId === event.eventId && index !== eventIndex);
}

const sameEvent = computed(() => {
  if (oddsData.value.length) {
    return oddsData.value.find((item, index) => item.eventId === oddsData.value[0].eventId && index !== 0);
  }
  return true;
});

const { run: getParlayTicket } = useRequest(() => parlay_tickets({
  LOADING: true,
  parlayTickets: oddsData.value.map((item) => ({
    sportType: item.sportType,
    marketId: item.odds.marketId,
    point: item.odds.selected.point,
    key: item.odds.selected.key,
  })),
}), {
  manual: true,
  formatResult(res) {
    if (res) {
      res.combos = res.combos.map((item, index) => ({
        ...item,
        amount: '',
        showKeyboard: index === 0,
      }));
    }
    return res;
  },
  onSuccess(res) {
    parlayTicketData.value = res;
  },
});

function showKeyboard(index) {
  parlayTicketData.value?.combos.forEach((item) => item.showKeyboard = false);
  if (parlayTicketData.value?.combos[index]) parlayTicketData.value.combos[index].showKeyboard = true;
}

const total = computed(() => parlayTicketData.value?.combos.reduce((previous, current) => previous += Number(current.amount), 0)?.toFixed(2) ?? '0.00');

const maxCombo = computed(() => {
  const { odds: { combo } } = oddsData.value.sort((a, b) => b.odds.combo - a.odds.combo)?.[0] ?? { odds };
  return combo || 2;
});

const { t } = useI18n();

const balance = computed(() => user.balance ?? 0);

const maxWinning = computed(() => parlayTicketData.value?.combos?.reduce((previous, current) => previous + Number(current.amount) * current.price, 0)?.toFixed(2) ?? 0);

const { loading: placeLoading, run: placeParlay } = useRequest(() => place_parlay({
  betInfo: {
    vandorTransId: '',
    priceOption: 0,
    tickets: parlayTicketData.value.priceInfo.map((item) => ({
      sporttype: item.sportType,
      marketid: item.marketId,
      point: item.point,
      key: item.key,
      price: item.currentPrice,
    })),
    combos: parlayTicketData.value.combos.reduce((previous, current) => {
      if (Number(current.amount) > 0) {
        previous.push({
          comboType: current.comboType,
          stake: current.amount,
        });
      }
      return previous;
    }, []),
  },
}), {
  manual: true,
  onSuccess(res) {
    betData.value = {
      stake: total.value,
      win: maxWinning.value,
      result: res,
    };
    Toast(t('投注成功!'));
    store.dispatch('user/getBalance');
    showSuccess.value = true;
  },
});

function doParlay() {
  const { combos } = parlayTicketData.value;

  if (Number(total.value) < 0) {
    return Toast(t('至少在一个串关下注'));
  }

  if (balance.value < Number(total.value)) {
    return Toast(t('余额不足'));
  }

  if (combos.reduce((p, c) => Number(c.amount) < c.minBet && Number(c.amount) !== 0, false)) {
    return Toast(t('输入金额小于限额'));
  }
  if (combos.reduce((p, c) => Number(c.amount) > c.maxBet && Number(c.amount) !== 0, false)) {
    return Toast(t('输入金额大于限额'));
  }

  placeParlay();
}

const marketWatcher = ref('');

const { run: updateMarket } = useRequest(() => GetMarkets({
  query: `$filter=marketid in (${oddsData.value.map((item) => item.odds.marketId).join(',')})`,
  LOADING: true,
}), {
  manual: true,
  onSuccess(res) {
    marketWatcher.value();
    const { markets } = res || { markets: [] };
    const oldOdds = JSON.parse(JSON.stringify(oddsData.value));

    const newOdds = oldOdds.concat([]).map((sport, index) => {
      const target = markets.find((item) => sport.odds.marketId === item.marketId);
      if (target) {
        const selected = target.selections.find((item) => item.key === sport.odds.selected.key);
        sport.odds = {
          ...target,
          selected,
        };
      } else {
        sport.odds.marketStatus = 'closed';
      }

      return sport;
    });

    nextTick(() => {
      getTicket();
    });

    store.commit('app/SET_MULTIPLE_ODDS', { odds: newOdds });
  },
});

function onContinue() {
  parlayTicketData.value = null;
  showSuccess.value = false;
  updateMarket();
}

function removeOdds(index) {
  store.commit('app/TOGGLE_MULTIPLE_ODDS', oddsData.value[index]);
  parlayTicketData.value = null;

  if (oddsData.value.length === 0) {
    router.back();
  } else if (maxCombo.value <= oddsData.value.length) {
    updateMarket();
  }
}

const allHasPrice = computed(() => !!oddsData.value
  ?.filter?.((item) => item.odds.selected?.oddsPrice[pan.value]).length ?? false);
const allRunning = computed(() => !oddsData.value
  ?.filter?.((item) => item.odds.marketStatus !== 'running').length ?? false);

function getTicket() {
  if (!sameEvent.value
    && maxCombo.value <= oddsData.value.length
    && allRunning.value
    && money.value
    && allHasPrice.value) {
    getParlayTicket();
  }
}

onMounted(async () => {
  store.dispatch('user/getBalance');
  marketWatcher.value = watch(() => oddsData.value, () => {
    if (maxCombo.value <= oddsData.value.length) {
      updateMarket();
    }
  }, { immediate: true });
});
</script>
<style lang="less">
.multiple-bet-page-wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: var(--card-bg-color, var(--bg-color-fff));
  flex-direction: column;

  :deep(.van-nav-bar) {
    i {
      color: var(--dark-fff) !important;
    }
  }

  .page-body {
    background: var(--dark-bg-color-18171D, var(--bg-color-fafafa));
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
    padding-left: 28px;
    padding-right: 32px;

    >header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32px;
      font-weight: 400;
      color: var(--font-color-848A9B);
      padding-top: 36px;
      padding-bottom: 30px;

      strong {
        color: var(--dark-fff, var(--font-color-0A0A0A));
      }

      span:last-child {
        color: var(--theme-color);
        font-size: 28px;
      }
    }

    .bet-item-wrap {
      flex: 1;
      overflow-y: auto;

      .bet-item {
        margin-bottom: 30px;
        border: solid 4px transparent;
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
        border-radius: 16px;

        .info-wrap {
          position: relative;
          border-radius: 16px;
          box-sizing: border-box;
          padding: 28px 54px 30px 44px;
          display: flex;
          align-items: center;
          background: var(--card-bg-color, var(--bg-color-fff));

          >img {
            position: absolute;
            top: 28px;
            right: 32px;
            width: 20px;
            height: 20px;
          }

          .divider {
            width: 2px;
            height: 166px;
            background-color: var(--dark-4E4C5D, var(--bg-color-e6ebf1));
          }

          .right-wrap {
            flex: 1;
            display: flex;
            margin-top: auto;
            justify-content: flex-end;
            align-items: flex-end;
            font-size: 48px;
            font-weight: 500;
            color: var(--theme-color);
            position: relative;

            .closed-wrap {
              position: absolute;
              bottom: 0px;
              left: 34px;
              font-size: 24px;
              white-space: nowrap;
              display: none;
              align-items: center;
              color: #D62726;

              span {
                width: 130px;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              img {
                width: 22px;
                height: 22px;
                margin-right: 10px;
              }
            }
          }

          .left-wrap {
            width: 416px;

            header {
              font-size: 28px;
              font-weight: 500;
              color: var(--dark-fff, var(--font-color-0A0A0A));
              margin-bottom: 10px;

              span {
                font-weight: 400;
                margin-left: 48px;
              }
            }

            div {
              font-size: 28px;
              color: var(--font-color-848A9B);

              &:not(:last-child) {
                margin-bottom: 10px;
              }
            }
          }
        }

        .footer {
          height: 72px;
          background-color: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
          display: none;
          align-items: center;
          padding-left: 44px;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;

          img {
            width: 22px;
            height: 22px;
            margin-right: 10px;
          }

          span {
            color: var(--theme-color);
            width: 90%;
            font-size: 24px;
          }
        }

        &.attension {
          .footer {
            display: flex;
          }

          border-color: var(--theme-color);
        }

        &.closed {
          border-color: transparent;

          .footer {
            display: none !important;
          }

          .left-wrap,
          .divider,
          .info-wrap>img {
            opacity: 0.3;
          }

          .closed-wrap {
            display: flex !important;
          }

          .right-wrap .price {
            display: none;
          }
        }
      }
    }
  }

  .page-footer {
    min-height: 340px;
    background: var(--card-bg-color, var(--bg-color-fff));
    padding: 24px 32px;
    width: 100%;
    box-shadow: 0px -10px 28px 0px rgba(45, 40, 60, 0.03);
    border-radius: 40px 40px 0px 0px;

    header {
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      display: flex;
      margin-bottom: 18px;

      span:last-child {
        color: var(--font-color-848A9B);
        margin-left: auto;
      }
    }

    .submit-button {
      width: 100%;
      height: 88px;
      background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);
      border-radius: 8px;
      color: var(--text-color);
      font-size: 32px;
    }

    .input-wrap {
      margin-bottom: 24px;

      .input-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .input-left {
        font-size: 28px;
        color: var(--font-color-848A9B);

        span:last-child {
          color: var(--theme-color);
          margin-left: 8px;
        }
      }

      .input-right {
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
        display: flex;
        align-items: center;

        >span {
          display: flex;
          margin-right: 10px;

          em {
            display: block;
            transform: translate(-3px, -3px);
          }
        }

        .input-outline {
          height: 76px;
          border-radius: 8px;
          border: 1px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
          display: flex;
          align-items: center;
          padding-left: 16px;

          input {
            border: none;
            outline: none;
            margin-left: 12px;
            font-size: 28px;
            background-color: transparent;
            color: var(--dark-fff, var(--font-color-0A0A0A));

            &::placeholder {
              color: var(--font-color-848A9B);
            }
          }
        }
      }
    }
  }
}
</style>
