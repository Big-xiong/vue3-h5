<template>
  <van-cell
    :border="false"
    class="sport-card-wrap"
  >
    <div
      class="sport-card-wrap-top"
      @click="fold = !fold"
    >
      <van-image
        :src="$getSrc('/src/assets/native-sports/images/error.png')"
        alt
      />
      <h4>{{ item?.leagueName }}</h4>
      <SvgIcon
        name="sport-arrow_up"
        :class="{ 'rotate-arrow': fold }"
      />
    </div>
    <van-swipe-cell :class="{ 'hide-cell': fold }">
      <van-cell
        :border="false"
        @click="$router.push('/sport-detail?id=' + item.eventId)"
      >
        <div class="sport-card-wrap-thead">
          <span>{{ item.dateTime }}
            <SvgIcon
              color="var(--theme-color)"
              v-show="hasStreaming()"
              name="sport-online"
            />
          </span>
          <span :class="{ hidden: !item.isStart || !item.cornerData }">
            <SvgIcon name="sport-corner_ball" />
            {{ item?.cornerData?.home }}-{{ item?.cornerData?.away }}
          </span>
          <span>{{ item?.marketCount }}{{ item.marketCount > 0 ? '+' : '' }}</span>
          <span>{{ $t('让球') }}</span>
          <span>{{ $t('大小球') }}</span>
          <svg
            viewBox="0 0 182 50"
            v-show="!item.isStart"
          >
            <path d="M 0,0 H 152 L 134,50 H 0 V 0 " />
          </svg>
        </div>
        <div class="sport-card-wrap-tbody">
          <div>
            <span>
              <van-image :src="item?.teamInfo?.homeIconUrl" />
              {{ item?.teamInfo?.homeName }}
            </span>
            <span>
              <i v-show="item?.soccerInfo?.homeYellowCard">{{ item?.soccerInfo?.homeYellowCard }}</i>
            </span>
            <span class="bold">{{ item?.gameInfo?.liveHomeScore }}</span>
            <OddsItem
              @bet="doBet(item, item.Handicap, 0)"
              :price="item?.Handicap?.selections?.[0]?.oddsPrice?.[pan]"
              :marketStatus="item.Handicap?.marketStatus"
              :title="item?.Handicap?.selections?.[0]?.point"
              :class="{ 'selected-odds': selectedOdds(item, item.Handicap?.marketId, item.Handicap?.selections?.[0]?.key) }"
            />
            <OddsItem
              @bet="doBet(item, item.OverUnder, 0)"
              :title="`${$t('大')}${item?.OverUnder?.selections?.[0]?.point}`"
              :price="item?.OverUnder?.selections?.[0]?.oddsPrice[pan]"
              :marketStatus="item.OverUnder?.marketStatus"
              :class="{ 'selected-odds': selectedOdds(item, item.OverUnder?.marketId, item.OverUnder?.selections?.[0]?.key) }"
            />
          </div>
          <div>
            <span>
              <van-image :src="item?.teamInfo?.awayIconUrl" />
              {{ item?.teamInfo?.awayName }}
            </span>
            <span>
              <i v-show="item?.soccerInfo?.awayYellowCard">{{ item?.soccerInfo?.awayYellowCard }}</i>
            </span>
            <span class="bold">{{ item?.gameInfo?.liveAwayScore }}</span>
            <OddsItem
              @bet="doBet(item, item.Handicap, 1)"
              :class="{ 'selected-odds': selectedOdds(item, item.Handicap?.marketId, item.Handicap?.selections?.[1]?.key) }"
              :marketStatus="item.Handicap?.marketStatus"
              :title="item?.Handicap?.selections?.[1]?.point"
              :price="item?.Handicap?.selections?.[1]?.oddsPrice?.[pan]"
            />
            <OddsItem
              @bet="doBet(item, item.OverUnder, 1)"
              :class="{ 'selected-odds': selectedOdds(item, item.OverUnder?.marketId, item.OverUnder?.selections?.[1]?.key) }"
              :title="`${$t('小')}${item?.OverUnder?.selections?.[1]?.point}`"
              :marketStatus="item.OverUnder?.marketStatus"
              :price="item?.OverUnder?.selections?.[1]?.oddsPrice[pan]"
            />
          </div>
        </div>
      </van-cell>
      <template #right>
        <van-button
          v-if="noticeList.includes(item.eventId)"
          square
          type="danger"
          @click="handleNotice(item, 2)"
          :text="$t('取消关注')"
        />
        <van-button
          v-else
          square
          type="primary"
          @click="handleNotice(item, 1)"
          :text="`+${$t('关注')}`"
        />
      </template>
    </van-swipe-cell>
  </van-cell>
</template>

<script setup>
import { useStore } from 'vuex';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import SvgIcon from '../../src/components/SvgIcon.vue';
import OddsItem from './OddsItem.vue';
import { add_notice, GetStreaming } from '../api/home';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

const fold = ref(false);
const store = useStore();
const pan = computed(() => store.state.app.pan);

const { t } = useI18n();

const streaming = computed(() => store.state.game.streamings[props.item.eventId]);

const multipleOdds = computed(() => store.state.app.multipleOdds);
const noticeList = computed(() => store.state.game.noticeList);

function selectedOdds(event, marketId, key) {
  return multipleOdds.value.find((item) => item.eventId === event.eventId
    && item.odds.marketId === marketId
    && item.odds.selected.key === key);
}

function hasStreaming() {
  return streaming.value?.streamingUrl || streaming.value?.streamingUrlCN || streaming.value?.streamingUrlNonCN;
}

async function getStreaming() {
  const { sportType, streamingOption, channelCode } = props.item;
  if (channelCode && !streaming.value) {
    const res = await GetStreaming({
      sportType,
      streamingOption,
      channelCode,
    });

    if (res) {
      store.commit('game/SET_STREAMING', { key: props.item.eventId, data: res });
    }
  }
}

onMounted(() => getStreaming());

function doBet(event, odds, index) {
  store.commit('app/TOGGLE_SINGLE_ODDS', {
    ...JSON.parse(JSON.stringify(event)),
    odds: {
      ...odds,
      selected: odds?.selections[index] ? { ...odds.selections[index] } : {},
    },
  });
}

async function handleNotice(item, type) {
  const res = await add_notice({
    event_id: item.eventId, status: type, sport_type: item.sportType,
  });
  if (res) {
    type === 1 ? Toast(t('关注成功')) : Toast(t('取消关注成功'));
    if (type === 1) {
      store.commit('game/SET_NOTICE_LIST', noticeList.value.concat([item.eventId]));
      store.commit('game/SET_NOTICE_CATEGORY', store.state.game.noticeCategory.concat([{ ...item }]));
    } else {
      const notice = noticeList.value.concat([]);
      notice.splice(notice.findIndex((sub) => sub === item.eventId), 1);
      const noticeCategory = store.state.game.noticeCategory.concat([]);
      noticeCategory.splice(noticeCategory.findIndex((sub) => sub.eventId === item.eventId), 1);
      store.commit('game/SET_NOTICE_LIST', notice);
      store.commit('game/SET_NOTICE_CATEGORY', noticeCategory);
    }
  }
}

</script>

<style lang="less" scoped>
.van-cell {
  padding: 0;
}

.sport-card-wrap {
  padding: 0;
  margin-bottom: 26px;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0px 8px 22px 0px rgba(0, 0, 0, 0.0500);

  .van-swipe-cell {
    transition: all 0.5s;
    height: 180px;

    &.hide-cell {
      height: 0;
    }

    :deep(.van-swipe-cell__right) {

      // padding: 0 20px;
      .van-button {
        margin: 0 20px;
        width: 156px;
        height: 156px;
        border-radius: 6px;
        background: var(--dark-gradient-light-bg-color,
            var(--gradient-light-bg-color));
        border: 0;

        &--primary {
          background: var(--gradient-bg-color);

          .van-button__text {
            color: var(--font-color-fff) !important;
          }
        }

        .van-button__text {
          font-size: 28px;
          white-space: nowrap;
          color: var(--font-color-848A9B);
        }
      }
    }
  }

  &-top {
    display: flex;
    padding: 26px 16px;
    align-items: center;
    position: relative;

    .van-image {
      width: 28px;
      height: 28px;
    }

    h4 {
      max-width: 440px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 12px;
    }

    .svg-icon-wrap {
      position: absolute;
      right: 18px;
      width: 26px;
      height: 18px;
      transform: rotate(0deg);
      transition: transform 0.5s;

      &.rotate-arrow {
        transform: rotate(180deg);
      }
    }
  }

  &-thead {
    padding: 0 18px;
    border-bottom: 2px solid var(--dark-border-color-2D2B36, var(--border-color-EEE));
    display: flex;
    justify-content: space-between;
    position: relative;

    svg {
      position: absolute;
      width: 182px;
      height: 54px;
      top: 0;
      border-top-left-radius: 15px;
      overflow: hidden;
      left: 0;

      path {
        fill: var(--dark-2e2d37, var(--bg-color-f3f3f3));
      }
    }

    span {
      position: relative;
      z-index: 2;

      &:first-child {
        display: flex;
        align-items: center;

        .svg-icon-wrap {
          width: 22px;
          height: 22px;
          margin-left: 5px;
          overflow: visible;
          border-radius: 0;
          position: relative;
          transform: translateY(-2px);
        }
      }

      &:nth-child(2) {
        position: relative;

        .svg-icon-wrap {
          width: 18px;
          height: 20px;
          margin-left: 5px;
          overflow: visible;
          border-radius: 0;
          position: absolute;
          left: -30px;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      &.hidden {
        opacity: 0;
      }
    }

  }

  &-tbody {
    padding: 28px 18px 26px;

    >div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.info-item) {
        background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
        width: 170px;
        font-size: 22px;
        height: 36px;
        color: var(--font-color-848A9B);
        align-items: center;
        display: flex;
        justify-content: center;

        &:last-child {
          margin-left: 10px;
        }

        span:last-child {
          margin-left: 8px;
          color: var(--dark-fff, var(--font-color-0A0A0A));
        }
      }

      span {
        height: 36px;
        line-height: 36px;
        width: 70px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        .van-image {
          width: 28px;
          height: 28px;
          vertical-align: middle;
        }

        &:nth-child(2)>i {
          background: var(--theme-color);
          font-size: 18px;
          display: inline-block;
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          border-radius: 2px;
          color: var(--font-color-fff);
        }
      }
    }
  }

  &-thead span,
  &-tbody>div span {
    font-size: 22px;
    color: var(--dark-fff, var(--font-color-0A0A0A));
    text-align: center;
    flex: 2;

    &:nth-child(2),
    &:nth-child(3) {
      flex: 1;
    }

    &:first-child,
    &:nth-child(2) {
      text-align: left;
    }

    &:nth-child(4) {
      margin-right: 48px;
    }
  }

  .selected-odds {
    background-color: var(--theme-color) !important;
  }
}
</style>
