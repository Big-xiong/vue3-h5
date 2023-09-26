<template>
  <div class="sport-main-wrap">
    <van-pull-refresh
      v-model="refreshing"
      :loosing-text="$t('释放即可刷新')"
      :pulling-text="$t('下来即可刷新')"
      :loading-text="$t('加载中')"
      @refresh="onRefresh"
    >
      <van-list
        :loading="loading"
        :finished="finished"
        :loading-text="$t('加载中')"
        :finished-text="dataArr.length ? $t('没有更多了') : ''"
        @load="onLoad"
      >
        <template v-if="dataArr.length || loading">
          <ListEvent
            v-for="item in dataArr"
            :key="item.eventId"
            :item="item"
          />
        </template>
        <Empty
          v-else-if="query.nav === 'notice' && !dataArr.length"
          :imgSrc="`/src/assets/native-sports/images/focus-empty.png`"
          :text="$t('暂无关注数据')"
        />
        <Empty
          v-else-if="!dataArr.length && !loading && !refreshing"
          :imgSrc="'/src/assets/native-sports/images/search-empty.png'"
          :text="$t('暂无数据')"
        />
      </van-list>
    </van-pull-refresh>
    <SvgIcon
      name="sport-top"
      v-show="showTop"
      @click="handleTop"
    />
  </div>
</template>

<script setup>
import {
  ref, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import { Toast } from 'vant';
import { onBeforeRouteUpdate } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';
import { add_notice } from '/native-sports/api/home';
import Empty from '../../../../components/Empty.vue';
import { getPlayingTime } from '../../../../utils';
import { useInterval } from '../../../../../src/utils/hooks';
import { GetEventResults, GetEvents } from '../../../../api/home';
import ListEvent from '../../../../components/ListEvent.vue';
import ListFocusEvent from '../../../../components/ListFocusEvent.vue';

const finished = ref(false);
const refreshing = ref(false);
const dataArr = ref([]);
const showTop = ref(false);
const scrollWrap = ref('');
const { t } = useI18n();
const pageSize = 10;
const page = ref(1);

const props = defineProps({
  selectedLeagues: {
    type: Array,
    default: () => [],
  },
  query: {
    type: Object,
    default: () => ({}),
  },
  timeRange: {
    type: Object,
    default: () => ({}),
  },
  showFind: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['handleStatic']);
const store = useStore();

useInterval(() => {
  dataArr.value.forEach((item) => {
    item.isStart = isEventStart(item);
    item.dateTime = handleTime(item);
  });
}, 1000);

const { run: getResults } = useRequest((params) => GetEventResults(params), {
  manual: true,
  formatResult(res) {
    return res.result.reduce((p, c) => p.concat(c.events), []) || [];
  },
});

const { run: runEvent, data: eventData, loading } = useRequest((params) => GetEvents(params), {
  manual: true,
  formatResult(res) {
    const marketsFilter = res.markets.filter((item) => item.selections?.length);
    res.events = res.events?.map((item) => {
      const markets = marketsFilter.filter((market) => market.eventId === item.eventId && market.selections.length);
      return {
        ...item,
        isStart: isEventStart(item),
        OverUnder: markets.find((odds) => odds.betType === 3) || {},
        Handicap: markets.find((odds) => odds.betType === 1) || {},
        markets,
        dateTime: handleTime(item),
      };
    });

    return res;
  },
  async onSuccess(res, params) {
    if (res.events.length < pageSize) {
      finished.value = true;
      refreshing.value = false;
    }

    if (refreshing.value) {
      dataArr.value = res.events;
      refreshing.value = false;
    } else {
      dataArr.value = dataArr.value.concat(res.events);
    }

    if (dataArr?.value?.length >= eventData?.value?.total) {
      finished.value = true;
    }

    page.value += 1;

    const resultIds = [];
    res.events.forEach((item) => {
      if (item.isStart && item.sportType === 1) {
        resultIds.push(item.eventId);
      }
    });

    if (resultIds.length) {
      const results = await getResults({
        from: dayjs().subtract(1, 'days').format('YYYY-MM-DDT00:00:00'),
        until: dayjs().add(1, 'days').format('YYYY-MM-DDT00:00:00'),
        query: `$filter=eventid in (${resultIds.join(',')})`,
      });

      dataArr.value.forEach((event) => {
        const target = results?.find((item) => item.eventId === event.eventId);
        if (target && target.soccerDetail) {
          const { cornerSequence } = target.soccerDetail;
          const corner = cornerSequence?.split('.') ?? [];
          const home = corner.reduce((p, c) => (['主', 'H'].includes(c) ? (p + 1) : p), 0);
          const away = corner.reduce((p, c) => (['客', 'A'].includes(c) ? (p + 1) : p), 0);
          if (home || away) {
            event.cornerData = {
              home, away,
            };
          }
        }
      });
    }
  },
});

watch(() => props.query, (val) => {
  refreshing.value = true;
  onRefresh();
  handleTop();
}, { deep: true });

watch(() => props.showFind, (val) => {
  refreshing.value = true;
  onRefresh();
  handleTop();
}, { deep: true });

const es = ref({});

onMounted(() => {
  scrollWrap.value = document.getElementsByClassName('sport-main-wrap')[0];
  if (scrollWrap.value) {
    scrollWrap.value.addEventListener('scroll', () => scrollFunc(), true);
  }
  es.value = new EventSource(
    `https://sabadirect-test.binanlyst.com/sports/stream/v1/GetEvents`
    + `?token=${localStorage.getItem('saba_token')}`
    + `&language=${localStorage.getItem('sport_lang')}`,
  );

  es.value.onmessage = (msg) => {
    const { payload } = JSON.parse(msg.data);

    if (payload.events?.remove.length) {
      const { remove, add, change } = payload.events;
      const { sport_type } = props.query;

      add.forEach((item) => {
        if (item.sportType === sport_type) {
          dataArr.value.push(item);
        }
      });

      change.forEach((item) => {
        const index = dataArr.value.findIndex((sub) => sub.eventId === item.eventId);

        dataArr.value[index] = {
          ...dataArr.value[index],
          ...item,
        };
      });

      remove.forEach((item) => {
        const index = dataArr.value.find((sub) => sub.eventId === item.eventId);
        dataArr.value.splice(index, 1);
      });
    }

    const { markets } = payload;

    if (markets.add?.length) {
      markets.add.forEach((item) => {
        dataArr.value.forEach((event) => {
          if (event.eventId === item.eventId) {
            event.markets?.push(item);
          }
        });
      });
    }

    if (markets.change?.length) {
      markets.change.forEach((item) => {
        dataArr.value.forEach((event) => {
          event?.markets?.forEach((sub) => {
            if (item.marketId === sub.marketId) {
              Object.keys(item).forEach((key) => sub[key] = item[key]);
            }
          });
        });
      });
    }

    if (markets.remove?.length) {
      markets.add.forEach((item) => {
        dataArr.value.forEach((event) => {
          event.markets?.forEach((sub) => {
            if (item.marketId === sub.marketId) {
              const index = event.markets.findIndex((m) => item.marketId === m.marketId);
              event.markets.splice(index, 1);
            }
          });
        });
      });
    }
  };
});

onBeforeUnmount(() => es.value.close());

const { game } = store.state;

function onLoad() {
  const {
    sport_type, sort, nav,
  } = props.query;

  runEvent({
    ...props.timeRange,
    query: `$filter=sporttype eq ${sport_type} `
      + `and eventstatus eq 'running' `
      + `and istest eq false `
      + `${props.selectedLeagues.length ? `and leagueId in (${props.selectedLeagues.join(',')})` : ''}`
      + `${nav === 'parlay' ? ' and isparlay eq true' : ''}`
      + `${nav === 'notice' ? ` and eventid in (${game.noticeList.length ? game.noticeList.join(',') : '000'})` : ''}`
      + `&$orderby=${sort === 1 ? 'kickOffTime' : 'leagueName'} asc`
      + `&$skip=${(page.value - 1) * pageSize}&$top=${pageSize}`,
  });
}

function onRefresh() {
  page.value = 1;
  finished.value = false;
  refreshing.value = true;
  dataArr.value = [];

  onLoad();
}

watch(() => game.noticeList, () => {
  if (props.query.nav === 'notice') {
    setTimeout(() => {
      onRefresh();
    }, 200);
  }
});

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

function scrollFunc() {
  if (scrollWrap.value.scrollTop > scrollWrap.value.offsetHeight) {
    showTop.value = true;
  } else {
    showTop.value = false;
  }
}

function handleTop() {
  scrollWrap.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

</script>

<style lang="less" scoped>
.sport-main-wrap {
  overflow: auto;
  height: 100%;

  // height: calc(100vh - 630px);
  .van-pull-refresh {
    padding: 0 32px;
  }

  :deep(.empty-wrap) {
    height: 800px;

    .van-image {
      width: 254px;
      margin-top: 50px;
    }

    p {
      width: 330px;
      text-align: center;
    }
  }

  .sport-top {
    position: fixed;
    width: 60px;
    height: 60px;
    top: 75%;
    right: 36px;
    z-index: 10;
  }

  :deep(.empty-wrap) {
    img {
      width: 254px;
      margin-top: 120px;
    }
  }
}
</style>
