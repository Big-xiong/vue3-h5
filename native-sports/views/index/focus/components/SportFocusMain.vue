<template>
  <div :class="['sport-focus-main-wrap', { empty: !dataArr.length && !loading }]">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :loosing-text="$t('释放即可刷新')"
      :pulling-text="$t('下来即可刷新')"
      :loading-text="$t('加载中')"
    >
      <van-list
        :loading="loading"
        :loading-text="$t('加载中')"
      >
        <ListEvent
          v-for="item in dataArr"
          :item="item"
          :key="item.eventId"
        />
      </van-list>
      <Empty
        v-if="!dataArr.length && !loading"
        :text="$t('暂无关注数据')"
      />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import Empty from '../../../../components/Empty.vue';
import { BET_TYPE_MAP } from '../../../../const';
import { getPlayingTime } from '../../../../utils';
import ListEvent from '../../../../components/ListEvent.vue';

const dataArr = ref([]);
const refreshing = ref(false);
const loading = ref(false);

const props = defineProps({
  sportType: Number,
});

const store = useStore();

function isEventStart(item) {
  return item.eventStatus === 'running' && dayjs(item.kickOffTime).add(8, 'hours').toDate().getTime() < Date.now();
}

function handleTime(item) {
  if (isEventStart(item)) {
    return getPlayingTime(item.kickOffTime);
  }
  if (item.eventStatus === 'closed') {
    return t('已结束');
  }

  return dayjs(item.kickOffTime).add(8, 'hours').format('MM-DD HH:mm');
}

const { game } = store.state;

onMounted(async () => {
  loading.value = true;
  await store.dispatch('game/getNoticeList');
  loading.value = false;
  getFocusList();
});

function getFocusList() {
  let list = game.noticeCategory.concat([]);

  if (props.sportType > -1) {
    list = list.filter((item) => item.sportType === props.sportType);
  }

  dataArr.value = list.map((item) => ({
    ...item,
    OverUnder: item.markets?.find((odds) => BET_TYPE_MAP.BigLittle.includes(odds.betType)),
    Handicap: item.markets?.find((odds) => BET_TYPE_MAP.Let.includes(odds.betType)),
    Solo: item.markets?.find((odds) => BET_TYPE_MAP.Solo.includes(odds.betType)),
    dateTime: handleTime(item),
  }));
}

watch(() => props.sportType, () => {
  getFocusList();
});

watch(() => game.noticeList, () => {
  getFocusList();
}, { deep: true });

async function onRefresh() {
  refreshing.value = true;
  await store.dispatch('game/getNoticeList');
  refreshing.value = false;
}
</script>

<style lang="less" scoped>
.sport-focus-main-wrap {
  overflow: auto;
  height: 100%;
  border-top: 20px solid var(--dark-bg-color-18171D, var(--border-color-F9F9F9));

  &.empty {
    background-color: var(--dark-bg-color-18171D, var(--bg-color-fff));
  }

  :deep(.empty-wrap) {
    flex: 1;
    background-color: var(--dark-bg-color-18171D, var(--bg-color-fff));

    img {
      width: 254px;
      margin-top: 170px;
    }

    p {
      width: 330px;
      white-space: wrap;
      text-align: center;
    }
  }

  .van-pull-refresh {
    padding: 30px 32px;
    overflow-y: auto;
    height: 100%;

    .sport-card-wrap {
      margin-bottom: 26px;
      border-radius: 12px;
    }
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

      ul {
        flex: 1;
        margin-right: 8px;

        &:last-child {
          margin: 0;
        }

        li {
          background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
          margin-bottom: 8px;
          font-size: 22px;
          height: 94px;
          color: var(--font-color-848A9B);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          span {
            line-height: 20px;
            font-size: 18px;
          }

          strong {
            line-height: 20px;
            font-size: 18px;
            color: var(--dark-fff, var(--font-color-0A0A0A));
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        &.win-wrap {
          li {
            height: 60px;
          }
        }
      }
    }
  }
}
</style>
