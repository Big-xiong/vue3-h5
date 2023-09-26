<template>
  <div class="road-map-wrap" v-loading="connecting">
    <div class="road-map-item">
      <div class="canvas-wrap">
        <canvas id="canvas"></canvas>
        <div v-if="data.roadMapData.noopen" data-noopen>{{ $t("发牌中") }}</div>
      </div>
      <div class="map-info" v-if="data.canvasOnReady">
        <div class="countdown">{{ data.secondsStr }}</div>
        <p>{{ $t("距离本局结束") }}</p>
        <a v-if="!$getGameStatus(gameData, 1)" @click="$playGame(gameData, $t('真人'))">{{ $t("快速入桌") }}</a>
      </div>
      <div class="table-info" v-if="data.canvasOnReady">
        <h4>
          <!-- <em>{{ vid.replace("00", "0") }}</em> -->
          <span>{{ tableTilesMap[data.roadMapData.gameType] }}{{ vid.replace("00", "0") }}</span>
        </h4>
        <div class="roadmap-statistics">
          <label data-banker>
            <span>{{ $t("庄") }}</span>
            <span class="c-banker">{{ data.statistics.bankerNum }}</span>
          </label>
          <label data-tie>
            <span>{{ $t("和") }}</span>
            <span class="c-tie">{{ data.statistics.tieNum }}</span>
          </label>
          <label data-player>
            <span>{{ $t("闲") }}</span>
            <span class="c-player">{{ data.statistics.playerNum }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  defineEmits,
  defineProps,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { Settings } from '@nodelib/fs.stat';
import RoadMap from '@/utils/roadmap';

const props = defineProps({
  isShowTab: {
    type: Boolean,
    default: true,
  },
  lineWidth: {
    type: Number,
    default: 0.5,
  },
  vid: {
    type: String,
    default: 'D056',
  },
  canvasWidth: {
    type: Number,
    default: 380,
  },
  canvasHeight: {
    type: Number,
    default: 140,
  },
  cellSize: {
    type: Number,
    default: 20,
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
  zoom: {
    type: Number,
    default: 2,
  },
});

const connecting = ref(true);
const emit = defineEmits(['change']);
function onTabChange(type) {
  emit('change', type);
}

const global = inject('global');

const tableTilesMap = {
  BAC: global.$t('经典百家乐'),
  CBAC: global.$t('包桌百家乐'),
  TBAC: global.$t('竞咪百家乐'),
  LBAC: global.$t('现场百家乐'),
  SBAC: global.$t('保险百家乐'),
  BBAC: global.$t('龙宝百家乐'),
  SHB: global.$t('骰宝'),
  DT: global.$t('龙虎'),
  ROU: global.$t('轮盘'),
  TEB: global.$t('二八杠'),
  NN: global.$t('牛牛'),
};

const data = reactive({
  roadmap: null,
  canvasOnReady: false,
  vids: [],
  allTables: null,
  tableTypes: [],
  timer: null,
  secondsStr: '00:00',
  // 庄、闲、和
  statistics: {},
  roadMapData: {},
  data: {},
});

onMounted(() => {
  initCanvas();
});

let canvasCtx = null;
const timeout = ref(0);

function initCanvas() {
  const canvasWraps = Array.from(document.querySelectorAll('.canvas-wrap'));

  let index = 0;
  if (!canvasWraps[0].offsetWidth) {
    index = 1;
  }

  if (!canvasWraps[index]?.offsetWidth) {
    timeout.value = setTimeout(() => {
      initCanvas();
    }, 100);
    return;
  }

  const { offsetWidth } = canvasWraps[index];
  const {
    cellSize, lineWidth, zoom, canvasHeight,
  } = props;
  const size = cellSize + lineWidth;
  const canvasWidth = Math.floor(offsetWidth / size) * size;
  const canvas = canvasWraps[index].querySelector('#canvas');
  canvas.width = canvasWidth * zoom;
  canvas.height = canvasHeight * zoom;
  canvas.style.zoom = 1 / zoom;
  canvasCtx = canvas.getContext('2d');
  initSocket();
}

const $store = inject('store');
const { app } = $store.state;

const runFn = {
  onResultList, onNewShoes, onNewRound, onCloseRound,
};

watch(
  () => app.roadmapSocketData,
  () => {
    connecting.value = false;
    const fnName = `${app.roadmapSocketType.charAt(0).toUpperCase()}${app.roadmapSocketType.substr(1)}`;
    runFn[`on${fnName}`](app.roadmapSocketData);
  },
);

onUnmounted(() => {
  if (app.isSocketConnected) $store.dispatch('app/disconnectSocket');
  clearTimeout(timeout.value);
});

function initSocket() {
  if (!app.isSocketConnected) {
    $store.dispatch('app/connectSocket');
  }
}

function getGameTables(gameTableData) {
  const vids = [];
  const allTables = {};
  let { vid } = data;
  const { tableTypes } = data;

  Object.keys(gameTableData).forEach((key) => {
    const tableItem = gameTableData[key];
    const { gameType } = tableItem;
    allTables[key] = gameType;
    if (tableTypes.indexOf(gameType) < 0) {
      tableTypes.push(gameType);
    }
    if (tableItem.roundCount > 0) {
      if (gameType === 'BAC' || gameType === 'CBAC') {
        vids.push(key);
      }
    }
  });

  // 如果没有默认的桌台
  if (!vid) {
    const idx = Math.floor(Math.random() * vids.length);
    vid = vids[idx];
  }

  data.vid = vid;
  data.allTables = allTables;
  data.vids = vids;
}

function initRoadMap(roadmapData) {
  getGameTables(roadmapData);
  const {
    canvasWidth, canvasHeight, zoom, cellSize, vid,
  } = props;
  const { allTables } = data;
  const gameType = allTables[vid];
  const canvasRealWidth = Math.floor(canvasWidth / cellSize) * cellSize;
  data.roadmap = RoadMap({
    canvas: canvasCtx,
    canvasWidth: canvasRealWidth,
    canvasHeight,
    cellSize,
    gameType,
    zoom,
  });
  data.canvasOnReady = true;
}

// 初始化获取到结果
function onResultList(msgData) {
  if (!data.canvasOnReady) {
    initRoadMap(msgData);
  }
  const {
    roadmap, vid, canvasWidth, canvasHeight,
  } = data;
  const vidData = msgData[vid];
  if (vidData.roundCount) {
    data.roadMapData.notOpen = false;
  }
  // 清除所有数据
  roadmap.removeAll();
  // 设置数据
  roadmap.setIList(vidData);
  // 清空画布
  roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
  // 画网格线
  roadmap.drawPath();
  // 画露珠图
  roadmap.drawBeads();
  // 到计时
  data.roadMapData = {
    ...data.roadMapData,
    gameType: vidData.gameType,
    gmcode: vidData.gmcode,
    roundCount: vidData.roundCount,
    seconds: vidData.seconds,
  };
  countdown();
  formatStatistics();
}

function countdown() {
  countdownStop();
  data.timer = setInterval(() => {
    data.roadMapData.seconds -= 1;
    if (data.roadMapData.seconds <= 0) {
      data.roadMapData.seconds = 0;
      countdownStop();
      $store.dispatch('app/disconnectSocket');
      setTimeout(() => {
        initSocket();
      }, 200);
    }
    formatSeconds();
  }, 1000);
}

function formatSeconds() {
  let { seconds } = data.roadMapData;
  // 不存在或为0
  if (!seconds) {
    return (data.secondsStr = '00:00');
  }
  const str = '0000';
  seconds += '';
  seconds = str.substr(0, str.length - seconds.length) + seconds;
  seconds = seconds.split('');
  data.secondsStr = `${seconds[0] + seconds[1]}:${seconds[2]}${seconds[3]}`;
}

function formatStatistics(vid) {
  const { roadmap, statistics } = data;
  const { gameType } = data.roadMapData;
  const {
    sumbig,
    sumsmall,
    sumdan,
    sumshuang,
    baozi,
    bankerNum,
    playerNum,
    tieNum,
  } = roadmap;
  Object.assign(statistics, {
    sumbig,
    sumsmall,
    sumdan,
    sumshuang,
    baozi,
    bankerNum,
    playerNum,
    tieNum,
  });
}

// 新牌靴
function onNewShoes(msgData) {
  const _vid = msgData.vid;
  const { vid, canvasWidth, canvasHeight } = props;
  const { roadmap } = data;
  if (vid === _vid) {
    data.roadMapData.notOpen = true;
    // 清除所有数据
    roadmap.removeAll();
    // 清空画布
    roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
    // countdown(vid);
    // 画网格线
    roadmap.drawPath();
    // 画露珠图
    roadmap.drawBeads();
    data.roadMapData = {
      ...data.roadMapData,
      gameType: msgData.gameType,
      gmcode: msgData.gmcode,
      // roundCount: msgData.roundCount,
      roundCount: 1,
      seconds: msgData.seconds,
    };
    formatStatistics();
  }
}
// 开始新局（发牌）
function onNewRound(msgData) {
  const _vid = msgData.vid;
  if (_vid === props.vid) {
    data.roadMapData = {
      ...data.roadMapData,
      seconds: msgData.seconds,
      notOpen: false,
    };
    countdown();
  }
}

function countdownStop() {
  if (data.timer) {
    clearInterval(data.timer);
    data.timer = null;
  }
}

// 结束一局
function onCloseRound(msgData) {
  const _vid = msgData.vid;
  const _gmcode = msgData.gmcode;
  const { vid, canvasWidth, canvasHeight } = props;
  const { roadmap } = data;
  if (vid === _vid && _gmcode !== data.roadMapData.gmcode) {
    // 停止倒计时
    countdownStop();
    // 清除除msgData外所有数据
    roadmap?.removeAll();
    // 设置数据
    roadmap.appendIList(msgData);
    // 清空画布
    roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
    // 画网格线
    roadmap.drawPath();
    // 画露珠图
    roadmap.drawBeads();
    data.roadMapData = {
      ...data.roadMapData,
      gmcode: _gmcode,
      roundCount: msgData.round,
      notOpen: true,
    };

    formatStatistics();
  }
}
</script>

<style lang="less" scoped>
.road-map-wrap {
  position: relative;
  padding: 25px;
  box-sizing: border-box;
  overflow: hidden;

  .road-map-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .map-info {
    width: 40%;
    height: 100%;
    text-align: center;
    font-size: 14px;

    h4,
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      color: var(--font-color-999);
      font-size: 24px;
      line-height: 40px;
    }

    [data-round] {
      color: var(--font-color-ff6680);
    }

    .countdown {
      color: var(--font-color-fff);
      line-height: 32px;
      font-size: 40px;
      font-weight: 300;
      margin-bottom: 10px;
    }

    a {
      background-color: var(--theme-color);
      color: var(--font-color-232321);
      width: 160px;
      line-height: 60px;
      text-align: center;
      border-radius: 8px;
      display: inline-block;
      font-size: 28px;
    }
  }

  .canvas-wrap {
    width: 60%;
    position: relative;

    [data-noopen] {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      line-height: 30px;
      text-align: center;
      color: var(--font-color-999);
      font-weight: 300;
      font-size: 30px;
      letter-spacing: 5px;
      transform: translateY(-50%);
    }
  }

  .roadmap-statistics {
    width: 40%;
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 24px;

    label {
      white-space: nowrap;

      span {
        // color: var(--font-color-999);
        display: inline-block;
        vertical-align: middle;
        padding-right: 5px;
      }

      &:nth-child(1) span {
        color: var(--font-color-ff6666);
      }

      &:nth-child(2) span {
        color: var(--font-color-24b253);
      }

      &:nth-child(3) span {
        color: var(--font-color-8095ff);
      }
    }

    .c-banker {
      color: var(--font-color-ff6666);
    }

    .c-player {
      color: var(--font-color-24b253);
    }

    .c-tie {
      color: var(--font-color-8095ff);
    }
  }
}

.table-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 15px;

  h4 {
    width: 60%;
    margin: 0;
    font-weight: 400;
    color: var(--font-color-999);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 24px;

    em,
    span {
      margin-right: 10px;
    }

    em {
      background-image: linear-gradient(135deg,
          var(--font-color-ff6680),
          var(--bg-color-994957));
      font-style: normal;
      color: var(--font-color-fff);
      padding: 2px 5px;
      border-radius: 2px;
      text-transform: uppercase;
      margin-right: 5px;
    }
  }
}
</style>
