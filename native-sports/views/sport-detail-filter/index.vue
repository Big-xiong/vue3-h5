<template>
  <div class="sport-detail-filter">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <SvgIcon
          @click="$router.push('/bet')"
          name="sport-betting"
          class="goto-betting"
          color="var(--dark-fff, var(--font-color-404040))"
        />
      </template>
      <template #title>
        <div class="sport-detail-title-wrap">
          <img
            :src="$getSrc('/src/assets/native-sports/images/error.png')"
            alt
          />
          <span class="league-name">{{ route.query.leagueName || '' }}</span>
        </div>
      </template>
    </van-nav-bar>

    <main class="filter-body">
      <div
        class="filter-item"
        v-for="item in leagueData"
        :key="item.eventId"
        @click="$router.push('/sport-detail?id=' + item.eventId)"
      >
        <div class="team-info-wrap">
          <div class="team-info">
            <van-image
              :src="item.teamInfo.homeIconUrl"
              alt
            />
            <span>{{ item.teamInfo.homeName }}</span>
            <div>{{ item.gameInfo.liveHomeScore }}</div>
          </div>
          <div class="team-info">
            <van-image
              :src="item.teamInfo.awayIconUrl"
              alt
            />
            <span>{{ item.teamInfo.awayName }}</span>
            <div>{{ item.gameInfo.liveAwayScore }}</div>
          </div>
        </div>

        <div class="time-wrap">{{ item.started ? item.dateTime : getTime(item.kickOffTime) }}</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import SvgIcon from '@/components/SvgIcon.vue';
import { GetEvents } from '../../api/home';
import { getPlayingTime } from '../../utils';
import { useInterval } from '../../../src/utils/hooks';

const leagueData = ref([]);
const route = useRoute();

function isEventStart(item) {
  return item.eventStatus === 'running' && dayjs(item.kickOffTime).add(8, 'hours').toDate().getTime() < Date.now();
}

function getTime(item) {
  return dayjs(item.kickOffTime).add(8, 'hours').format('MM-DD HH:mm');
}

onMounted(async () => {
  const data = await GetEvents({
    query: `$filter=leagueid eq ${route.query.id} and eventstatus eq 'running'`,
    LOADING: true,
  });

  leagueData.value = data.events
    .sort((a, b) => new Date(a.kickOffTime) - new Date(b.kickOffTime))
    .map((item) => ({
      ...item,
      dateTime: getPlayingTime(item.kickOffTime),
      started: isEventStart(item),
    }));
  useInterval(() => {
    leagueData.value
      .forEach((item) => {
        item.dateTime = getPlayingTime(item.kickOffTime);
        item.started = isEventStart(item);
      });
  }, 1000);
});

</script>

<style lang="less">
.sport-detail-filter {
  background: #fbfbfb;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 1;

  .van-nav-bar {
    background-color: var(--card-bg-color, var(--bg-color-fff)) !important;
  }

  .filter-body {
    background-color: var(--dark-000, var(--bg-color-fff)) !important;
    flex: 1;
    overflow-y: auto;
    padding-top: 32px;

    .filter-item {
      width: 686px;
      height: 176px;
      background: var(--card-bg-color, var(--bg-color-fff));
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
      margin: 0 auto 30px auto;
      display: flex;
      align-items: center;

      .time-wrap {
        flex: 1px;
        height: 123px;
        border-left: solid 2px var(--dark-4E4C5D, var(--bg-color-e6ebf1));
        width: 206px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #848a9a;
      }

      .team-info-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 24px;
        padding-bottom: 28px;
        flex-direction: column;
        padding-left: 18px;
        width: 478px;
        margin-right: 20px;
        box-sizing: content-box;

        .team-info {
          display: flex;
          align-items: center;
          font-size: 22px;
          color: var(--dark-fff, var(--font-color-0A0A0A));
          width: 478px;

          &:first-child {
            margin-bottom: 40px;
          }

          span {
            margin-right: auto;
          }

          div {
            width: 30px;
            height: 30px;
            background: #d0b393;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--font-color-fff);
            border-radius: 4px;
          }

          .van-image {
            height: 28px;
            width: 28px;
            margin-right: 8px;
          }
        }
      }
    }
  }
}

.sport-detail-title-wrap {
  display: flex;
  align-items: center;

  span {
    max-width: 350px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  img {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }
}

.goto-betting {
  width: 28px;
  height: 30px;
  fill: #040000;
}
</style>
