<template>
  <van-nav-bar
    left-arrow
    style="width: 100%"
    @click-left="emit('back')"
  >
    <template #title>
      <div class="game-name-wrap">
        <div class="team team-a">
          <van-image
            :src="data.teamInfo?.homeIconUrl"
            alt
          />
          <span>{{ data.teamInfo?.homeName }}</span>
        </div>
        <div class="time-score">
          <span>{{ time }}</span>
          <span>
            {{ data.gameInfo?.liveHomeScore }}
            <em />
            {{ data.gameInfo?.liveAwayScore }}
          </span>
        </div>
        <div class="team team-b">
          <van-image
            :src="data.teamInfo?.awayIconUrl"
            alt
          />
          <span>{{ data.teamInfo?.awayName }}</span>
        </div>
      </div>
    </template>

    <template #right>
      <SvgIcon
        class="betting"
        name="sport-bet-record"
        @click="$router.push('/bet')"
      />
    </template>
  </van-nav-bar>
</template>

<script setup>
import { ref, watch } from 'vue';
import SvgIcon from '../../src/components/SvgIcon.vue';
import { useInterval } from '../../src/utils/hooks';
import { getPlayingTime } from '../utils';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const time = ref('00:00');

const emit = defineEmits(['back']);

function getTime() {
  time.value = getPlayingTime(props.data.kickOffTime);
}

watch(() => props.data, () => {
  if (props.data.isLive) {
    getTime();
    useInterval(() => getTime(), 1000);
  }
}, { deep: true, immediate: true });
</script>

<style lang="less" scoped>
.betting {
  width: 28px;
  height: 30px;
  fill: white;
}

.game-name-wrap {
  display: flex;
  justify-content: center;

  .time-score {
    display: flex;
    flex-direction: column;
    margin: 0 24px;
    font-size: 28px;
    font-weight: 500;
    color: var(--font-color-fff);
    line-height: 40px;

    span {
      height: 40px;
      font-size: 28px !important;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      em {
        display: block;
        width: 10px;
        margin: 0 8px;
        background-color: white;
        height: 2px;
      }
    }
  }

  .team {
    display: flex;
    align-items: center;

    &.team-b {
      flex-direction: row-reverse;

      span {
        text-align: right;
        margin-right: 10px;
      }
    }

    .van-image {
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }

    span {
      font-size: 24px;
      font-weight: 400;
      width: 164px;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      color: var(--font-color-fff);
    }
  }
}

:deep(.van-badge__wrapper) {
  color: var(--font-color-fff) !important;
}
</style>
