<template>
  <Skeleton v-if="loading" />
  <ChatRoom
    :data="eventData"
    @close="chatting = false"
    v-else-if="chatting"
  />
  <main
    class="sport-detail-page"
    v-else
  >
    <ScoreToast
      :teamInfo="eventData?.teamInfo"
      v-if="showScoreToast"
    />

    <VSNavBar
      :data="eventData"
      v-show="maxBetType"
      @back="maxBetType = false"
    />
    <div
      class="detail-header"
      v-show="!maxBetType"
    >
      <GameInfo
        :result="resultData"
        :playingVideo="playingVideo"
        :data="eventData"
        ref="info"
      />
      <CenterToggle
        :refreshing="refreshing"
        @refresh="getData"
        @playing="playingVideo = true"
        :hasVideo="eventData?.streaming?.streamingUrl || eventData?.streaming?.streamingUrlCN"
        @status="isStatus = true"
        v-if="eventData?.markets?.length || refreshing"
      />
      <BetTabs
        :data="eventData"
        :markets="marketPayload"
        v-model:betType="betTypeSelected"
        @tabChange="tabSelected = $event"
      />
    </div>

    <div
      class="detail-body"
      @scroll="onScroll"
      v-if="eventData?.markets?.length || refreshing"
    >
      <BallTab
        :markets="marketPayload"
        :data="eventData"
        :betType="betTypeSelected"
        @empty="eventData.markets = []"
      />
    </div>
    <Empty
      v-else
      :imgSrc="`/src/assets/native-sports/images/market_empty.png`"
      :text="$t('赛事盘口已关闭')"
    />
    <ChatAction
      @send="getMessage"
      @chat="chatting = true"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import GameInfo from './components/GameInfo.vue';
import CenterToggle from './components/CenterToggle.vue';
import ChatRoom from './components/ChatRoom.vue';
import ChatAction from './components/ChatAction.vue';
import ScoreToast from './components/ScoreToast.vue';
import BetTabs from './components/BetTabs.vue';
import BallTab from './components/BallTab.vue';
import Skeleton from './components/Skeleton.vue';
import Empty from '../../components/Empty.vue';
import {
  event_result, GetEvents, GetStreaming, GetMarkets,
} from '../../api/home';
import VSNavBar from '../../components/VSNavBar.vue';

const playingVideo = ref(false);
const maxBetType = ref(false);
const betTypeSelected = ref(-1);
const route = useRoute();
const showScoreToast = ref(false);

const chatting = ref(false);
const info = ref();
const loading = ref(false);
const refreshing = ref(false);

const eventData = ref({});

const { run: getStreaming } = useRequest(
  (params) => GetStreaming(params),
  {
    manual: true,
    onSuccess(res) {
      eventData.value.streaming = res;
    },
  },
);

let timer = null;
function onScroll(event) {
  if (timer) {
    return;
  }
  const result = event.target.scrollTop > 0;
  if (result === maxBetType.value) {
    return;
  }

  maxBetType.value = result;
  timer = setTimeout(() => {
    timer = null;
  }, 200);
}

const { run: getMarkets } = useRequest(
  (params) => GetMarkets(params),
  {
    manual: true,
    onSuccess(res) {
      eventData.value.markets = res.markets;
    },
    onFinally() {
      loading.value = false;
      refreshing.value = false;
    },
  },
);

const store = useStore();

const streaming = computed(() => store.state.game.streamings[Number(route.query.id)]);

const {
  run: getEventData,
} = useRequest((params = {}) => GetEvents({
  query: `$filter=eventid eq ${route.query.id}`
    + `&includeMarkets=none`,
  NO_FILTER: true,
  ...params,
}), {
  manual: true,
  formatResult(res) {
    if (res) {
      return {
        ...res.events[0],
        markets: res.markets.filter((item) => item.selections.length),
      };
    }
    return res;
  },
  onSuccess(res) {
    eventData.value = res;
    startES();
    getMarkets({
      query: `$filter=eventid eq ${route.query.id}`,
    });

    if (streaming.value) {
      eventData.value.streaming = streaming.value;
    } else if (res.channelCode) {
      getStreaming({
        sportType: res.sportType,
        streamingOption: res.streamingOption,
        channelCode: res.channelCode,
      });
    }
  },
});

const es = ref({});

const marketPayload = ref({});

function startES() {
  es.value = new EventSource(
    `https://sabadirect-test.binanlyst.com/sports/stream/v1/GetEvents`
    + `?token=${localStorage.getItem('saba_token')}`
    + `&language=${localStorage.getItem('sport_lang')}`
    + `&query=$filter=eventId eq ${route.query.id}`,
  );
  es.value.onmessage = (msg) => {
    const { payload } = JSON.parse(msg.data);

    if (payload.events?.change.length) {
      const changeData = payload.events.change[0];
      const { gameInfo: newVal } = changeData;
      const { gameInfo: oldVal } = eventData.value;

      if (newVal?.liveHomeScore > oldVal?.liveHomeScore
        || newVal?.liveAwayScore > oldVal?.liveAwayScore) {
        showScoreToast.value = true;
        setTimeout(() => {
          showScoreToast.value = false;
        }, 2500);
      }

      Object.keys(changeData).forEach((key) => eventData.value[key] = changeData[key]);
    }
    marketPayload.value = payload.markets;
  };
}

onBeforeUnmount(() => {
  es.value.close?.();
});

const { data: resultData } = useRequest(() => event_result({ event_id: route.query.id }));

onMounted(() => {
  loading.value = true;
  getEventData();
});

function getMessage() {
  info.value.reGetMessage();
}

async function getData() {
  refreshing.value = true;
  getEventData({ LOADING: true });
}
</script>

<style lang="less" scoped>
.sport-detail-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  :deep(.empty-wrap) {
    flex: 1;

    img {
      width: 234px;
      margin-top: 84px;
    }
  }
}

.detail-header {
  flex-shrink: 0;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
