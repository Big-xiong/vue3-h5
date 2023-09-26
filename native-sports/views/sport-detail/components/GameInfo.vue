<template>
  <main
    class="game-video-wrap"
    v-if="playingVideo"
  >
    <VSNavBar
      @back="playingVideo = false"
      :data="data"
    />
    <Vue3Marquee
      v-if="showMarquee"
      class="marquee"
      :duration="(messageData?.length ?? 1) * 5"
    >
      <span
        v-for="item in messageData"
        :key="item"
        class="marquee-text"
      >{{ item }}</span>
    </Vue3Marquee>
    <div class="video-wrap">
      <video
        id="vid1"
        class="vjs-default-skin"
        autoplay
        :poster="$getSrc('/src/assets/native-sports/images/live_poster.jpg')"
      >
        <source
          :src="videoSrc"
          type="application/x-mpegURL"
        >
      </video>

      <div class="video-action">
        <img
          @click="showMarquee = !showMarquee"
          :src="$getSrc(`/src/assets/native-sports/images/marquee_${showMarquee ? 'open' : 'close'}.png`)"
        />
        <img
          @click="onFullscreen"
          :src="$getSrc('/src/assets/native-sports/images/fullscreen.png')"
          alt
        />
      </div>
    </div>
  </main>
  <main
    class="game-info-wrap"
    v-else
  >
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
    >
      <template #title>
        <div
          class="game-name-wrap"
          @click="$router.push({
            path: '/sport-detail-filter',
            query: {
              id: props.data.leagueId,
              leagueName: props.data.leagueName
            }
          })"
        >
          <img
            :src="$getSrc('/src/assets/native-sports/images/error.png')"
            alt
          />
          <span>{{ data.leagueName }}</span>
          <SvgIcon
            color="white"
            name="sport-drop_down"
          />
        </div>
      </template>

      <template #right>
        <div class="action-wrap">
          <van-loading v-if="addNoticeLoading" />
          <SvgIcon
            v-else-if="!isStart"
            name="sport-fav"
            class="fav-icon"
            @click="addNotice"
            :class="{ fav: isFav }"
          />
          <SvgIcon
            class="betting"
            @click="$router.push('/bet')"
            name="sport-bet-record"
          />
        </div>
      </template>
    </van-nav-bar>

    <section
      class="marquee-wrap"
      v-if="showMarquee"
    >
      <Vue3Marquee :duration="(messageData?.length ?? 1) * 5">
        <span
          v-for="item in messageData"
          :key="item"
          class="marquee-text"
        >{{ item }}</span>
      </Vue3Marquee>
    </section>

    <section class="game-status-wrap">
      <div class="team team-a">
        <van-image
          :src="data.teamInfo?.homeIconUrl"
          alt
        />
        <span>{{ data.teamInfo?.homeName }}</span>
      </div>

      <div class="status-wrap">
        <div
          class="not-start"
          v-if="!isStart"
        >
          <div class="start-time">
            <span>{{ dayjs(data.gameInfo?.kickOffTime).add(8, 'hours').format('MM-DD') }}</span>
            <div class="divider"></div>
            <span>{{ dayjs(data.gameInfo?.kickOffTime).add(8, 'hours').format('HH:mm') }}</span>
          </div>
          <div class="vs">VS</div>
        </div>
        <div
          class="main-status"
          v-else
        >
          <span>{{ data.gameInfo?.liveHomeScore }}</span>
          <span>-</span>
          <span>{{ data.gameInfo?.liveAwayScore }}</span>
        </div>
        <div class="time">{{ gameStatus }}</div>
      </div>

      <div class="team team-b">
        <van-image
          :src="data.teamInfo?.awayIconUrl"
          alt
        />
        <span>{{ data.teamInfo?.awayName }}</span>
      </div>
    </section>

    <section
      class="yellow-card-time"
      v-if="(data.sportName === '足球' || data.sportName === 'Soccer') && isStart"
    >
      <div
        class="yellow-card"
        v-if="data.soccerInfo?.homeYellowCard"
      >{{ data.soccerInfo?.homeYellowCard }}</div>
      <div
        class="yellow-card"
        v-if="data.soccerInfo?.awayYellowCard"
      >{{ data.soccerInfo?.awayYellowCard }}</div>
    </section>

    <section class="game-event-wrap">
      <div
        class="event-text-wrap"
        v-if="data.sportName === 'Soccer' && isStart"
      >
        <div
          class="corner"
          v-if="cornerData"
        >
          <img
            :src="$getSrc('/src/assets/native-sports/images/corner.png')"
            alt
          />
          <span>{{ cornerData.home }}-{{ cornerData.away }}</span>
        </div>
        <span
          class="divider"
          v-if="cornerData"
        ></span>
        <span>HT {{ result?.[0]?.htHomeScore || 0 }}-{{ result?.[0]?.htAwayScore || 0 }}</span>
      </div>
      <div class="event-action">
        <img
          @click="showMarquee = !showMarquee"
          :src="$getSrc(`/src/assets/native-sports/images/marquee_${showMarquee ? 'open' : 'close'}.png`)"
        />

        <img
          name="sport-tooltip"
          :src="$getSrc('/src/assets/native-sports/images/tooltip.png')"
          @click.stop="showToolTip = true"
        />
        <div
          class="tri"
          v-if="showToolTip"
        ></div>
        <div
          class="tooltip-wrap"
          v-if="showToolTip"
        >
          <header>{{ $t('免责声明') }}</header>
          <div class="tip-content">
            <span class="dot"></span>
            <div class="content">{{ $t('此版本实现的所有直播内容仅供参考！会员亦可使用此内容作为指南，我们将尽最大的努力确保显示的内容是正确的，如有错误，本公司将不承担任何责任！') }}</div>
          </div>
          <div class="tip-content">
            <span class="dot"></span>
            <div class="content">{{ $t('对于滚球比分，例如：滚球让球，将以投注时在投注单种显示的正确比分为准！') }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { watch, ref } from 'vue';
import { Vue3Marquee } from 'vue3-marquee';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useRequest } from 'ahooks-vue';
import videojs from 'video.js';
import { useI18n } from 'vue-i18n';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import SvgIcon from '@/components/SvgIcon.vue';
import VSNavBar from '../../../components/VSNavBar.vue';
import 'vue3-marquee/dist/style.css';
import { useInterval } from '../../../../src/utils/hooks';
import { add_notice, getMessage } from '../../../api/home';
import { getPlayingTime } from '../../../utils';

dayjs.extend(duration);

const props = defineProps({
  playingVideo: Boolean,
  data: {
    type: Object,
    default: () => ({}),
  },
  result: {
    type: Array,
    default: () => ([]),
  },
});

const { t } = useI18n();

const videoReady = ref(false);

const videoSrc = ref('');
const videoPlayer = ref({});
const global = inject('global');

const cornerData = computed(() => {
  const { cornerSequence } = props.result?.soccerDetail ?? {};
  if (cornerSequence) {
    const corner = cornerSequence?.split('.') ?? [];
    const home = corner.reduce((p, c) => (['主', 'H'].includes(c) ? (p + 1) : p), 0);
    const away = corner.reduce((p, c) => (['客', 'A'].includes(c) ? (p + 1) : p), 0);
    if (home || away) {
      return {
        home, away,
      };
    }
  }
  return null;
});

watch(() => props.playingVideo, (val) => {
  if (val) {
    const { streaming } = props.data;
    const src = streaming.streamingUrlNonCN || streaming.streamingUrlCN || streaming.streamingUrl;
    videoSrc.value = src;
    if (src) {
      nextTick(() => {
        videoPlayer.value = videojs('#vid1');
      });
    }
  }
});

function onFullscreen() {
  videoPlayer.value.requestFullscreen();
}

const isStart = computed(() => props.data.eventStatus === 'running'
  && dayjs(props.data.kickOffTime).add(8, 'hours').toDate().getTime() < Date.now());

const store = useStore();

const route = useRoute();
const time = ref('00:00');

const noticeList = computed(() => store.state.game.noticeList);
const isFav = ref(false);

onBeforeMount(() => {
  isFav.value = noticeList.value.findIndex((item) => item.eventId === Number(route.query.id)) !== -1;
});

onBeforeUnmount(() => videoPlayer.value?.dispose?.());

const gameStatus = computed(() => {
  if (isStart.value) {
    return time.value;
  } if (props.data.eventStatus === 'closed') {
    return t('已结束');
  } if (props.data.eventStatus === 'postponed') {
    return t('已延迟');
  }

  return t('未开赛');
});

const { run: addNotice, loading: addNoticeLoading } = useRequest(() => add_notice({
  event_id: route.query.id,
  merchant_no: '19001',
  status: isFav.value ? 2 : 1,
  sport_type: props.data.sportType,
}), {
  manual: true,
  onSuccess() {
    isFav.value = !isFav.value;
    store.dispatch('game/getNoticeList');
  },
});

const { data: messageData, run: reGetMessage } = useRequest(() => getMessage({
  merchant_no: '19001',
  page: 1,
  pagesize: 20,
  match_id: route.query.id,
}), {
  manual: false,
  formatResult(res) {
    return res.data.map((item) => item.barrage);
  },
});

defineExpose({
  reGetMessage,
});

function getTime() {
  time.value = getPlayingTime(props.data.kickOffTime);
}

watch(() => props.data, () => {
  if (isStart.value) {
    getTime();
    useInterval(getTime, 1000);
  }
}, { immediate: true });

const showToolTip = ref(false);
watch(() => showToolTip.value, () => {
  if (showToolTip.value) {
    document.querySelector('body').onclick = (e) => {
      if (e.target.className !== 'tooltip-wrap') {
        showToolTip.value = false;
        document.querySelector('body').onclick = null;
      }
    };
  }
});

const showMarquee = ref(false);

</script>

<style lang="less">
.game-info-wrap {
  background-image: url(/src/assets/native-sports/images/game_info_bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 448px;

  .van-nav-bar {
    background-color: transparent;

    i {
      color: var(--font-color-fff) !important;
    }
  }
}

.game-name-wrap {
  display: flex;
  align-items: center;

  img {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }

  span {
    font-size: 36px;
    font-weight: 400;
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--font-color-fff);
  }

  .svg-icon-wrap {
    width: 24px;
    height: 12px;
    margin-left: 8px;
  }
}

.action-wrap {
  display: flex;

  .van-loading {
    width: 30px;
    height: 30px;
  }

  .svg-icon-wrap {
    &:first-child {
      width: 36px;
      height: 36px;
    }

    &:last-child {
      width: 26px;
      height: 30px;
      margin-left: 44px;
    }

    stroke: white;
    fill: none !important;

    &.fav {
      stroke: #f7b500 !important;
      fill: #f7b500 !important;
    }
  }

  .betting {
    fill: white;
  }
}

.game-status-wrap {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 30px 0 34px;

  .team {
    display: flex;
    flex-direction: column;

    &.team-a {
      align-items: flex-start;
    }

    &.team-b {
      align-items: flex-end;

      span {
        text-align: right;
      }
    }

    span {
      font-size: 28px;
      font-weight: 500;
      color: var(--font-color-fff);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 160px;
      line-height: 40px;
    }

    .van-image {
      width: 94px;
      height: 94px;
      margin-bottom: 20px;
      margin-top: 8px;

      img {
        border-radius: 100%;
        overflow: hidden;
      }
    }
  }

  .status-wrap {
    /* margin-left: 58px; */
    /* margin-right: 60px; */

    .not-start {
      color: var(--font-color-fff);
      display: flex;
      flex-direction: column;
      align-items: center;

      .vs {
        font-size: 100px;
        font-weight: 500;
        line-height: 122px;
      }

      .text {
        font-size: 28px;
        font-weight: 500;
        line-height: 40px;
      }

      .start-time {
        font-size: 24px;
        line-height: 340x;
        display: flex;
        align-items: center;
      }

      .divider {
        height: 20px;
        margin-left: 20px;
        margin-right: 20px;
        width: 2px;
        background-color: var(--bg-color-fff);
      }
    }

    .time {
      font-size: 28px;
      font-weight: 500;
      transform: translateY(-14px);
      line-height: 40px;
      display: flex;
      color: var(--font-color-fff);
      margin-top: 12px;
      justify-content: center;
    }

    .main-status {
      height: 122px;
      line-height: 122px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 100px;
      color: var(--font-color-fff);

      span {
        white-space: nowrap;
        overflow: hidden;
        max-width: 200px;
        text-overflow: ellipsis;

        &:nth-child(2) {
          margin: 0 50px 0 46px;
        }
      }
    }
  }
}

.yellow-card-time {
  display: flex;
  position: relative;
  justify-content: space-between;
  padding: 0 30px 0 34px;
  color: var(--font-color-fff);
  margin-top: 10px;
  height: 30px;

  .yellow-card {
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
    background: #f7b500;
    border-radius: 4px;
  }
}

.game-event-wrap {
  margin-top: 40px;
  display: flex;
  padding: 0 30px 0 34px;
  justify-content: space-between;

  .event-text-wrap {
    display: flex;
    align-items: center;
    font-size: 22px;
    height: 32px;
    color: var(--font-color-fff);

    img {
      width: 24px;
      height: 28px;
      margin-right: 8px;
    }

    .divider {
      height: 20px;
      width: 1px;
      margin-left: 64px;
      margin-right: 64px;
      background-color: var(--bg-color-fff);
    }
  }

  .event-action {
    position: relative;
    overflow: visible;
    margin-left: auto;

    img:first-child {
      width: 48px;
      margin-right: 20px;
    }

    img:nth-child(2) {
      width: 32px;
      height: 32px;
    }

    .tri {
      position: absolute;
      right: 10px;
      top: 38px;
      width: 10px;
      height: 10px;
      transform: rotateZ(45deg);
      background-color: var(--card-bg-color, var(--bg-color-fff));
    }

    .tooltip-wrap {
      position: absolute;
      bottom: 0;
      transform: translateY(100%);
      right: -18px;
      z-index: 200;
      width: 364px;
      padding: 25px;
      background: var(--card-bg-color, var(--bg-color-fff));
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.11);
      border-radius: 8px;
      padding: 18px 22px 18px 18px;

      header {
        font-size: 18px;
        font-weight: 500;
        color: var(--dark-fff, var(--font-color-0A0A0A));
        margin-bottom: 8px;
      }

      .tip-content {
        font-size: 14px;
        font-weight: 400;
        color: #b8bbc3;
        line-height: 18px;
        display: flex;

        .dot {
          background-color: var(--theme-color);
          width: 8px;
          height: 8px;
          margin-top: 8px;
          flex-shrink: 0;
          border-radius: 100%;
          margin-right: 8px;
        }

        .content {
          line-height: 30px;
        }
      }
    }

    .svg-icon-wrap {
      width: 32px;
      height: 32px;
    }
  }
}

.marquee-wrap {
  position: absolute;
  width: 100%;
  left: 0;
  overflow-y: hidden;

  >div {
    overflow-y: hidden;
  }
}

.marquee-text {
  font-size: 24px;
  color: var(--font-color-fff);
  line-height: 32px;
  margin-right: 50px;
}

.game-video-wrap {
  .van-nav-bar {
    background: var(--gradient-bg-color) !important;
  }

  .marquee {
    margin-top: 20px;
    position: absolute;
    left: 0;
    top: 20px;
  }
}

.video-wrap {
  width: 100%;
  height: 424px;
  position: relative;
  background-image: url(/src/assets/native-sports/images/game_info_bg.png);
  background-repeat: no-repeat;
  background-size: cover;

  .vjs-control-text {
    display: none;
  }

  #vid1,
  video {
    width: 100%;
    height: 100%;
    padding-top: 0;
  }

  .video-action {
    position: absolute;
    bottom: 28px;
    right: 24px;
    z-index: 200;

    img:first-child {
      width: 48px;
      height: 34px;
    }

    img:last-child {
      width: 36px;
      height: 36px;
      margin-left: 20px;
    }
  }
}

.van-nav-bar__right {
  padding: 0;
  margin-right: 32px;
}
</style>
