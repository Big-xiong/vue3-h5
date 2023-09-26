<template>
  <main class="success-popup-wrap">
    <img
      class="success-img"
      :src="$getSrc('/src/assets/native-sports/images/bet_icon_reg_fast_success@2x.png')"
      alt
    />
    <div class="success-text">{{ $t('投注成功') }}</div>
    <div
      class="bet-info-wrap"
      v-if="!isParlay"
    >
      <div class="bet-rate">
        <span>{{ oddsData.odds?.betTypeName }}</span>
        <span>@{{ betData.betPrice }}</span>
      </div>
      <div class="origin-money">{{ $t('本金') }}: ¥{{ betData.stake }}</div>
    </div>
    <div
      class="total-bet-info"
      v-else
    >
      <div class="parlay-bet-info">
        <div class="left-wrap">
          <div>{{ betData.result.currentCombos.reduce((p, item) => p += `${item.comboType} ${item.comboPrice} `, '') }}
          </div>
          <div>
            <span>{{ $t('本金') }}</span>
            <span>{{ betData.stake }}</span>
          </div>
        </div>
        <div class="right-wrap">
          <span>{{ betData.win }}</span>
          <span>{{ $t('预计派彩金额') }}</span>
        </div>
      </div>
      <div
        class="parlay-markets"
        v-for="item in multipleOdds"
        :key="item.eventId"
      >
        <div class="team-info">
          <div>{{ item.teamInfo.homeName }}VS{{ item.teamInfo.awayName }}</div>
          {{ item.odds.selected?.key === 'h' ? item.teamInfo.homeName : item.teamInfo.awayName }}
          <span>
            {{ item.odds.selected?.point }}{{
                item.odds.selected?.point ? `/${item.odds.selected?.point}` :
                  ''
            }}
          </span>

        </div>
        <div class="price">
          {{ item.odds.selected?.oddsPrice[pan] }}
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <van-button @click="emit('continue')">{{ $t('继续投注此单') }}</van-button>
      <van-button @click="emit('confirm')">{{ $t('确定') }}</van-button>
    </div>
  </main>
</template>

<script setup>
import { useStore } from 'vuex';

const props = defineProps({
  betData: {
    type: Object,
    default: () => ({}),
  },
  oddsData: {
    type: Object,
    default: () => ({}),
  },
  isParlay: {
    default: false,
    type: Boolean,
  },
});
const emit = defineEmits(['confirm', 'continue']);
const store = useStore();

const pan = computed(() => store.state.app.pan);
const multipleOdds = computed(() => store.state.app.multipleOdds);
</script>

<style lang="less">
.success-popup-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 32px;

  .success-img {
    width: 160px;
    height: 160px;
    margin-bottom: 28px;
  }

  .success-text {
    font-size: 32px;
    color: var(--dark-fff, var(--font-color-0A0A0A));
    margin-bottom: 46px;
  }

  .total-bet-info {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 60px;

    .parlay-bet-info {
      display: flex;
      position: relative;
      color: var(--dar-fff);
      padding-bottom: 28px;
      border-bottom: solid 1px var(--dark-444150, var(--bg-color-e6ebf1));

      .left-wrap {
        div {
          display: flex;
          align-items: center;
          font-size: 32px;
          color: var(--dark-fff, var(--font-color-0A0A0A));

          &:nth-child(1) {
            margin-bottom: 44px;
          }
        }
      }

      .right-wrap {
        position: absolute;
        top: 30px;
        right: 0;
        display: flex;
        flex-direction: column;

        span:nth-child(1) {
          color: var(--theme-color);
          font-size: 40px;
        }

        span:nth-child(2) {
          font-size: 32px;
          color: var(--font-color-848A9A);
        }
      }

    }

    .parlay-markets {
      display: flex;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      align-items: center;
      font-size: 28px;
      padding: 28px 0;
      border-bottom: solid 1px var(--dark-444150, var(--bg-color-e6ebf1));

      .team-info div {
        margin-bottom: 10px;
      }

      .price {
        margin-left: auto;
      }
    }
  }

  .btn-wrap {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .van-button {
      height: 68px;
      border-radius: 8px;
      width: 320px;
      font-size: 28px;

      &:last-child {
        background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);
        border: none;
        color: var(--font-color-fff);
      }
    }
  }
}
</style>
