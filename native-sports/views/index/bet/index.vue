<template>
  <main class="bet-wrapper">
    <van-nav-bar :title="$t('注单')">
      <template #right>
        <SvgIcon
          name="sport-filter"
          @click="showFilter = true"
          class="filter-icon"
        />
      </template>
    </van-nav-bar>

    <div class="tab-wrap">
      <div class="main-tab-wrap">
        <span
          @click="settled = true"
          :class="{ selected: settled }"
        >{{ $t('已结算') }}</span>
        <div class="divider"></div>
        <span
          @click="settled = false"
          :class="{ selected: !settled }"
        >{{ $t('未结算') }}</span>
      </div>

      <div class="sub-tab-wrap">
        <div
          :class="{ selected: index === timeSelected }"
          v-for="(item, index) in timeOptions"
          @click="timeSelected = index"
          :key="item"
        >{{ item }}</div>
      </div>
    </div>

    <van-list
      :loading="loading"
      class="list-wrap"
      :loadingText="$t('加载中')"
      :class="{ empty: !loading && !betData?.length }"
    >
      <div
        class="empty-wrap"
        v-if="!loading && !betData?.length"
      >
        <img :src="$getSrc('/src/assets/native-sports/images/bet_empty.png')" />

        <div class="text-wrap">
          {{ $t('您未产生注单') }},
          <span @click="$router.push('/home')">{{ $t('投一注吧') }}</span>
        </div>
      </div>
      <div
        class="filter-body"
        v-else-if="!loading"
      >
        <div class="state-wrap">
          <div>
            {{ $t('总计') }}
            <span>{{ betData?.length ?? 0 }}{{ $t('单') }}</span>
          </div>
          <div>
            {{ $t('输赢') }}
            <span>¥{{ total.toFixed(2) }}</span>
          </div>
        </div>
        <div
          class="bet-item"
          v-for="(item, index) in betData"
          :key="index"
          @click="showParlay(item)"
        >
          <header>
            <strong class="game-name">{{ item.parlayInfo ? item.betTypeName : item.leagueName }}</strong>
            <span class="number">{{ $t('单号') }}: {{ item.transId }}</span>
            <SvgIcon
              @click.stop="copy(item.transId)"
              name="sport-copy_number"
            />
          </header>
          <div class="bet-body">
            <div>
              <span>{{ $t('本金') }}：¥{{ Number(item.stake).toFixed(2) }}</span>
              <span v-show="settled">{{ $t('派彩金额') }}:¥{{ Number(item.settlementPrice).toFixed(2) }}</span>
            </div>
            <div v-if="!item.parlayInfo">
              <span>{{ item.homeTeamName }}-{{ item.awayTeamName }}</span>
            </div>
            <div v-if="!item.parlayInfo">
              <span>{{ item.betType }} {{ item.oddsTypeName }} {{ item.homeScore }}-{{ item.awayScore }}</span>
            </div>
            <div v-if="!item.parlayInfo">
              <span>{{ item.keyName }} @{{ item.price }}</span>
            </div>
            <div v-show="!settled">
              <span>{{ $t('预计派彩金额') }}:{{ Number(item.stake * item.price).toFixed(2) }}</span>
            </div>
          </div>

          <div class="bet-footer">
            <span>{{ item.parlayInfo ? item.comboType : '' }}</span>
            <span>{{ settled ? $t('已派彩') : $t('进行中') }}</span>
          </div>
        </div>
      </div>
    </van-list>
  </main>
  <TimeFilter
    v-model:startTime="startTime"
    v-model:endTime="endTime"
    v-model:showFilter="showFilter"
  />

  <Popup
    @close="showParlayPopup = false"
    :show="showParlayPopup"
    :title="parlayInfoForShow.comboType"
    teleport="body"
  >
    <div class="multiple-bet-popup-wrap">
      <div
        class="bet-item-wrap"
        v-for="(item, index) in parlayInfoForShow.parlayInfo"
        :key="index"
      >
        <div class="bet-info-wrap">
          <div class="left-wrap">
            <span>
              <strong>{{ item.leagueName }}</strong>
              {{ item.point }}
            </span>

            <span>{{ item.homeTeamName }}-{{ item.awayTeamName }}</span>
          </div>
          <div class="right-wrap">@{{ item.price }}</div>
        </div>
        <div class="bet-result-wrap">
          <span>{{ item.betTypeName }}</span>
          <span>{{ $t('派彩') }}：¥{{ Number(parlayInfoForShow.stake * item.price).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import SvgIcon from '@/components/SvgIcon.vue';
import TimeFilter from './components/TimeFilter.vue';
import Popup from '../../../components/Popup.vue';
import { bet_details } from '../../../api/bet';

const showFilter = ref(false);

const { t } = useI18n();

const settled = ref(true);

const startTime = ref('');
const endTime = ref('');

const timeOptions = ref([
  t('今天'),
  t('昨天'),
  t('近7天'),
]);

const timeSelected = ref(0);

const daySubtract = computed(() => {
  switch (timeSelected.value) {
    case 0: return 0;
    case 1: return 1;
    default: return 7;
  }
});

const parlayInfoForShow = ref({});
const showParlayPopup = ref(false);

function showParlay(data) {
  if (data.parlayInfo) {
    parlayInfoForShow.value = data;
    showParlayPopup.value = true;
  }
}

function copy(id) {
  Toast(t('复制成功'));
  navigator.clipboard.writeText(id);
}

const timeParam = computed(() => {
  if (timeSelected.value >= 0) {
    return dayjs().subtract(daySubtract.value, 'day').format('YYYY-MM-DD');
  }
  return dayjs(startTime.value).format('YYYY-MM-DD');
});

const total = ref(0);

const { data: betData, run: getDetails, loading } = useRequest((params) => bet_details(params || {
  is_settled: settled.value,
  start: timeSelected.value !== 0 ? `${timeParam.value}T00:00:00` : `${dayjs().format('YYYY-MM-DD')}T00:00:00`,
  end: `${timeSelected.value === 1 ? timeParam.value : dayjs().format('YYYY-MM-DD')}T23:59:59`,
}), {
  onSuccess(res) {
    total.value = 0;
    res.forEach((item) => total.value += Number(item.settlementPrice));
  },
});

watch(() => [timeSelected.value, settled.value], () => getDetails());

watch(() => showFilter.value, (val) => {
  if (!val && startTime.value && endTime.value) {
    getDetails({
      is_settled: settled.value,
      start: `${startTime.value}T00:00:00`,
      end: `${endTime.value}T00:00:00`,
    });
    timeSelected.value = -1;
  }
});
</script>

<style lang="less" scoped>
.filter-icon {
  width: 32px;
  height: 30px;
  fill: var(--dark-fff, var(--font-color-252525));
}

.bet-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--card-bg-color, var(--bg-color-fff));
}

.tab-wrap {
  background-color: var(--card-bg-color, var(--bg-color-fff));

  .main-tab-wrap {
    height: 88px;
    display: flex;
    align-items: center;

    .divider {
      width: 2px;
      height: 45px;
      background-color: var(--dark-4E4C5D, var(--bg-color-e6ebf1));
    }

    span {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      width: 50%;
      font-size: 28px;
      color: var(--font-color-848A9B);

      &.selected {
        color: var(--dark-fff, var(--font-color-252525));
      }
    }
  }

  .sub-tab-wrap {
    height: 88px;
    background-color: var(--card-bg-color, var(--bg-color-fff));
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 76px;

    div {
      min-width: 132px;
      padding: 0 10px;
      height: 48px;
      background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
      border-radius: 37px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: var(--font-color-848A9B);
      line-height: 40px;

      &.selected {
        background-color: var(--theme-color);
        color: var(--text-color);
      }
    }
  }
}

.state-wrap {
  box-sizing: border-box;
  padding-top: 32px;
  padding-bottom: 20px;
  background-color: var(--dark-bg-color-18171D, var(--bg-color-fafafa));
  padding-left: 28px;
  display: flex;

  div {
    margin-right: 44px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: var(--font-color-848A9B);

    span {
      color: var(--dark-fff, var(--font-color-0A0A0A));
      margin-left: 10px;
    }
  }
}

.list-wrap {
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow-y: auto;
  padding-bottom: 80px;
  background-color: var(--dark-bg-color-18171D, var(--bg-color-fafafa));

  &.empty {
    background-color: var(--dark-bg-color-18171D, var(--bg-color-fff));
  }
}

.empty-wrap {
  padding-top: 150px;
  height: 600px;
  width: 100%;

  img {
    width: 234px;
    height: 198px;
    display: block;
    margin: 0 auto;
  }

  .text-wrap {
    margin-top: 30px;
    text-align: center;
    margin: 0 auto;
    color: var(--font-color-848A9B);
    font-size: 28px;

    span {
      color: var(--theme-color);
    }
  }
}

.filter-body {
  background-color: var(--dark-bg-color-18171D, var(--bg-color-fafafa));
  padding-left: 28px;
  padding-right: 32px;
  box-sizing: border-box;
  flex: 1;

  .bet-item {
    background-color: var(--card-bg-color, var(--bg-color-fff));
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    box-sizing: border-box;
    margin-bottom: 30px;
    padding: 28px 40px 40px 44px;

    header {
      font-size: 28px;
      display: flex;
      color: var(--dark-fff, var(--font-color-0A0A0A));
      white-space: nowrap;
      flex-wrap: wrap;
      align-items: center;

      .game-name {
        font-weight: 500;
        font-weight: 700;
        overflow: hidden;
        width: 330px;
        text-overflow: ellipsis;
      }

      .number {
        margin-right: 16px;
      }

      .svg-icon-wrap {
        width: 20px;
        height: 20px;
      }
    }

    .bet-body {
      div {
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
        margin-top: 10px;
        display: flex;
        margin-bottom: 10px;

        span:nth-child(1) {
          width: 330px;
        }

        span:nth-child(2) {
          width: 260px;
        }
      }
    }

    .bet-footer {
      display: flex;
      font-size: 28px;
      justify-content: space-between;
      color: var(--theme-color);
    }
  }
}

.multiple-bet-popup-wrap {
  .bet-item-wrap {
    margin-top: 30px;
    height: 200px;
    border-radius: 16px;
    border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
    padding: 28px 52px 32px 44px;

    .bet-info-wrap {
      display: flex;
      justify-content: space-between;

      .left-wrap {
        display: flex;
        flex-direction: column;

        span {
          font-size: 28px;
          color: var(--dark-fff, var(--font-color-0A0A0A));
          line-height: 40px;
          display: flex;
          align-items: center;

          strong {
            max-width: 315px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            font-weight: bolder;
            text-overflow: ellipsis;
            margin-right: 40px;
          }

          &:nth-child(2) {
            width: 90%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &:last-child {
            color: var(--font-color-848A9B);
            margin-top: 10px;
          }
        }
      }

      .right-wrap {
        font-size: 48px;
        font-weight: 500;
        color: var(--theme-color);
        line-height: 66px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .bet-result-wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      span {
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
        line-height: 40px;

        strong {
          margin-right: 40px;
        }

        &:first-child {
          color: var(--font-color-848A9B);
        }
      }
    }
  }
}
</style>
