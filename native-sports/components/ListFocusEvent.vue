<template>
  <van-cell
    :border="false"
    class="sport-focus-card-wrap"
  >
    <div
      class="sport-focus-card-wrap-top"
      @click="handleTrans(l_i)"
    >
      <van-image
        src
        alt
      />
      <h4>{{ item.leagueName }}</h4>
      <SvgIcon name="sport-arrow_up" />
    </div>
    <div
      class="sport-focus-card-wrap-thead"
      @click="$router.push('sport-detail?id=' + item.eventId)"
    >
      <span>
        {{ item.dateTime }}
      </span>
      <span>{{ item?.gameInfo?.liveHomeScore }}-{{ item?.gameInfo?.liveAwayScore }}</span>
      <span>{{ $t('全场独赢') }}</span>
      <span>{{ $t('全场让球') }}</span>
      <span>{{ $t('全场大小') }}</span>
    </div>
    <div
      class="sport-focus-card-wrap-tbody"
      @click="$router.push('sport-detail?id=' + item.eventId)"
    >
      <div class="tbody-left">
        <div>
          <span>
            <van-image :src="item?.teamInfo?.homeIconUrl" />
            {{ item?.teamInfo?.homeName }}
          </span>
          <span>
            <i v-show="item?.soccerInfo?.homeYellowCard">{{ item?.soccerInfo?.homeYellowCard }}</i>
          </span>
        </div>
        <div>
          <span>
            <van-image :src="item?.teamInfo?.awayIconUrl" />
            {{ item?.teamInfo?.awayName }}
          </span>
          <span>
            <i v-show="item?.soccerInfo?.awayYellowCard">{{ item?.soccerInfo?.awayYellowCard }}</i>
          </span>
        </div>
        <div class="icon-wrap">
          <SvgIcon
            :class="{ fav: !item.notIn }"
            @click.stop="removeNotice(item)"
            name="sport-fav"
          />
          <!-- <SvgIcon
            color="var(--theme-color)"
            name="sport-animation"
          /> -->
          <SvgIcon
            v-show="hasStreaming()"
            color="var(--theme-color)"
            name="sport-online"
          />
          <span> {{ getMarketCount(item) }} </span>
        </div>
      </div>
      <div class="tbody-right">
        <ul class="win-wrap">
          <OddsItem
            v-for="(odds, index) in (item.Solo?.selections ?? [
              {}, {}, {}
            ])"
            :key="odds.key"
            @click.stop="doBet(item, item.Solo, index)"
            :class="{ 'selected-odds': selectedOdds(item, item.Solo?.marketId, odds.key) }"
            :title="odds.keyName"
            :marketStatus="item.Solo?.marketStatus"
            :price="odds.oddsPrice?.[pan]"
          />
        </ul>
        <ul class="rang-wrap">
          <OddsItem
            v-for="(odds, index) in (item.Handicap?.selections ?? [
              {}, {}
            ])"
            :key="odds.key"
            :class="{ 'selected-odds': selectedOdds(item, item.Handicap?.marketId, odds.key) }"
            :marketStatus="item.Handicap?.marketStatus"
            @click.stop="doBet(item, item.Handicap, index)"
            :title="odds.point"
            :price="odds.oddsPrice?.[pan]"
          />
        </ul>
        <ul class="da-wrap">
          <OddsItem
            v-for="(odds, index) in (item.OverUnder?.selections ?? [
              {}, {}
            ])"
            :key="odds.key"
            :marketStatus="item.OverUnder?.marketStatus"
            :class="{ 'selected-odds': selectedOdds(item, item.OverUnder?.marketId, odds.key) }"
            @click.stop="doBet(item, item.OverUnder, index)"
            :title="odds.keyName"
            :price="odds.oddsPrice?.[pan] ?? ''"
          />
        </ul>
      </div>
    </div>
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

const store = useStore();

const multipleOdds = computed(() => store.state.app.multipleOdds);

const streaming = computed(() => store.state.game.streamings[props.item.eventId]);

function hasStreaming() {
  return streaming.value?.streamingUrl || streaming.value?.streamingUrlCN || streaming.value?.streamingUrlNonCN;
}

const { t } = useI18n();
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

function getMarketCount(item) {
  const count = item?.marketCategories?.length && item?.marketCategories?.reduce((acu, cur) => acu + cur);

  let str = '';

  if (count > 0) {
    str = `${count}+`;
  } else {
    str = count;
  }
  return `${str}`;
}

function selectedOdds(event, marketId, key) {
  return multipleOdds.value?.find((item) => item.eventId === event.eventId
    && item.odds.marketId === marketId
    && item.odds.selected.key === key);
}

function removeNotice(item) {
  add_notice({
    event_id: item.eventId,
    status: item.notIn ? 1 : 2,
  }).then((res) => {
    store.dispatch('game/getNoticeList');
    item.notIn ? Toast(t('关注成功')) : Toast(t('取消关注成功'));
    item.notIn = !item.notIn;
  });
}

function doBet(event, odds, index) {
  store.commit('app/TOGGLE_SINGLE_ODDS', {
    ...event,
    odds: {
      ...odds,
      selected: odds.selections[index],
    },
  });
}

const pan = computed(() => store.state.app.pan);
</script>

<style lang="less" scoped>
.sport-focus-card-wrap {
  margin-bottom: 26px;
  padding: 0;
  height: 400px;
  transition: all 0.5s;
  overflow: hidden;
  box-shadow: 0px 8px 22px 0px rgba(0, 0, 0, 0.0500);
  border-radius: 12px !important;

  &.hide-cell {
    height: 100px;
  }

  &-top {
    display: flex;
    padding: 26px 16px;
    align-items: center;
    position: relative;

    h4 {
      max-width: 58.667vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    span {
      flex: 3;
      text-align: center;
      font-size: 22px;
      white-space: nowrap;
      color: var(--dark-fff);

      &:first-child {
        flex: 2;
        text-align: left;
      }

      &:nth-child(2) {
        flex: 1;
      }

      &:nth-child(3),
      &:nth-child(4) {
        margin-right: 8px;
      }
    }
  }

  &-tbody {
    display: flex;
    padding: 20px 18px 24px;
    justify-content: space-between;

    .tbody-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      >div {
        display: flex;

        span {
          flex: 1;
          font-size: 22px;
          white-space: nowrap;
          color: var(--dark-fff);
          width: 70px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          .van-image {
            width: 28px;
            height: 28px;
            vertical-align: middle;
          }

          &:first-child {
            flex: 2;
          }

          &:last-child {
            text-align: left;
            padding: 0 8px 0 20px;

            i {
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

        &.icon-wrap {
          display: flex;
          align-items: center;
          position: relative;
          top: 10px;

          .svg-icon-wrap {
            width: 24px;
            height: 18px;
            margin-right: 16px;

            &:first-child {
              stroke: var(--font-color-848A9B);
              fill: none !important;

              &.fav {
                stroke: #f7b500 !important;
                fill: #f7b500 !important;
              }
            }

            &.sport-online {
              margin-right: 0;
              height: 22px;
              margin-top: -2px;
            }
          }
        }
      }
    }

    .tbody-right {
      flex: 3;
      display: flex;

      .selected-odds {
        background-color: var(--theme-color) !important;
      }

      .info-item {
        background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
        margin-bottom: 8px;
        font-size: 22px;
        height: 94px;
        color: var(--font-color-848A9B);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        :deep(span) {
          line-height: 20px;
          font-size: 18px;
        }

        :deep(span:last-child) {
          line-height: 20px;
          font-size: 18px;
          color: var(--dark-fff, var(--font-color-0A0A0A));
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      .win-wrap {
        .info-item {
          height: 60px;
        }
      }

      ul {
        flex: 1;
        margin-right: 8px;
      }
    }
  }
}
</style>
