<template>
  <section class="ball-item-wrap">
    <header>
      <SvgIcon name="sport-arrow_up" :class="{ folded: fold }" @click="fold = !fold" />
      <span>{{ data.name }}</span>

      <SvgIcon
        name="sport-to_top"
        :color="index === 0 ? 'var(--theme-color)' : ''"
        @click="emit('top', index)"
      />
    </header>

    <div class="body-wrap" v-show="!fold">
      <div class="body-inner">
        <div class="bet-wrap">
          <div class="team-wrap">
            <div
              class="team"
              :class="`odds-${data?.teams?.length}`"
              v-for="item in data?.teams ?? []"
              :key="item.key"
            >
              <div class="team-name">
                <span></span>
                {{ item }}
              </div>
            </div>
          </div>
          <div
            class="odds-wrap"
            :class="typeClass(market.betType)"
            v-for="market in data?.markets"
            :key="market.marketId"
          >
            <OddsItem
              :key="item.key"
              v-for="item in market?.selections ?? []"
              @bet="emit('doBet', { market, selection: item })"
              :market-status="market.marketStatus"
              :class="[`odds-${market?.selections?.length}`, { 'selected-odds': selectedOdds(market.marketId, item.key) }]"
              :title="item.title"
              :price="item.oddsPrice[pan]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, computed } from 'vue';
import { useStore } from 'vuex';
import SvgIcon from '@/components/SvgIcon.vue';
import OddsItem from '../../../components/OddsItem.vue';
import { getBetTypeName } from '../../../const';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  title: String,
  index: Number,
});

const store = useStore();
const emit = defineEmits(['doBet', 'top']);
const pan = computed(() => store.state.app.pan);

const multipleOdds = computed(() => store.state.app.multipleOdds);

const typeClass = (type) => getBetTypeName(type);

function selectedOdds(marketId, key) {
  return multipleOdds.value.find((item) => item.odds.marketId === marketId
    && item.odds.selected.key === key);
}

const fold = ref(false);

</script>

<style lang="less">
.ball-item-wrap {
  &:not(:last-child) {
    margin-bottom: 30px;
  }

  header {
    display: flex;
    align-items: center;

    .svg-icon-wrap:nth-child(1) {
      width: 22px;
      height: 14px;
      transition: transform 0.2s ease-out;
    }

    span {
      margin-left: 10px;
      margin-right: auto;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      font-size: 24px;
    }

    .svg-icon-wrap:last-child {
      width: 28px;
      height: 28px;
    }

    .folded {
      transform: rotateZ(180deg);
    }
  }

  .body-wrap {
    margin-top: 24px;
    border-radius: 12px;
    border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));

    .body-inner {
      padding: 26px 32px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      display: flex;
    }
  }

  .team {
    width: 290px;

    .team-name {
      height: 34px;
      display: flex;
      align-items: center;
      font-size: 22px;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      line-height: 32px;
      margin-bottom: 14px;

      span {
        background-color: var(--dark-theme-bg);
        width: 4px;
        height: 20px;
        margin-right: 8px;
      }
    }
  }

  .info-item {
    height: 36px;
    background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    margin-bottom: 14px;
    font-size: 22px;
    width: 290px;

    .svg-icon-wrap {
      margin: 0 auto;
    }

    span:nth-child(1) {
      color: var(--font-color-848A9B);
      max-width: 80%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    span:nth-child(2) {
      color: var(--dark-fff, var(--font-color-0A0A0A));
    }
  }

  .bet-wrap {
    width: 100%;

    .team-wrap,
    .odds-wrap {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .Ball,
    .Goal,
    .LoseGoal {
      flex-wrap: wrap;
      .info-item {
        flex-shrink: 0;
      }
    }

    .odds-3 {
      width: 160px !important;
    }

    .NextCombo {
      .info-item {
        width: 200px !important;
      }
    }
  }

  .selected-odds {
    background-color: var(--theme-color) !important;
  }
}
</style>
