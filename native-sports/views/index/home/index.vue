<template>
  <div class="sport-home-wrap">
    <template v-if="staticLoading">
      <SportSkeleton />
    </template>
    <template v-else>
      <div class="sport-home-wrap-top">
        <h4>{{ $t('我的余额') }}</h4>
        <div class="sport-home-wrap-money">
          <span>¥{{ user.balance ?? 0.00 }}</span>
          <div>
            <van-badge :dot="siteNoticeList.length">
              <SvgIcon
                name="sport-notice"
                @click="router.push({ name: 'sport-notice' })"
              />
            </van-badge>

            <SvgIcon
              name="sport-more"
              @click="showPopup = true"
            />
          </div>
        </div>
        <SportNotice />
        <SportFilter
          v-model:query="query"
          @handleShowFind="handleShowFind"
          :staticData="staticData"
        />
      </div>
      <SportMain
        :query="query"
        :showFind="showFind"
        :time-range="timeRange"
        :selected-leagues="selectedLeagues"
        @handleStatic="runStatic"
      />
    </template>

    <teleport to="body">
      <SportFind
        v-show="showFind"
        v-model:selected-leagues="selectedLeagues"
        @handleShowFind="handleShowFind"
      />
    </teleport>
    <Popup
      :show="showPopup"
      position="right"
      teleport="body"
      :round="false"
      @close="showPopup = false"
    >
      <SideMorePopup @handleShowPopup="handleShowPopup" />
    </Popup>
  </div>
</template>

<script setup>
import {
  ref, inject, computed, onMounted,
} from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import SportFilter from './components/SportFilter.vue';
import SportNotice from './components/SportNotice.vue';
import SportMain from './components/SportMain.vue';
import SportFind from './components/SportFind.vue';
import SportSkeleton from './components/SportSkeleton.vue';
import Popup from '../../../components/Popup.vue';
import SideMorePopup from '../../../components/Popup/SideMorePopup.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { GetEvents, GetSports, user_leagues } from '../../../api/home';
import { SPORT_TYPE } from '../../../const';

const router = useRouter();
const global = inject('global');
const showFind = ref(false);
const selectedLeagues = ref([]);
const showPopup = ref(false);
const query = ref({
  sport_type: 1,
  sort: 1,
  nav: 'today',
});

const { user } = global.$store.state;
const siteNoticeList = computed(() => global.$store.state.app.siteNoticeList.filter((item) => item.is_read === 0));

const staticData = reactive(
  {
    early: { sports: [], total: 0 },
    notice: {
      sports: SPORT_TYPE,
      total: 0,
    },
    parlay: { sports: [], total: 0 },
    today: { sports: [], total: 0 },
  },
);
const timeParams = {
  early: {
    until: dayjs().add(7, 'days').format('YYYY-MM-DDT23:59:59'),
    from: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  },
  today: {
    until: dayjs().add(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
    from: dayjs().format('YYYY-MM-DDT00:00:00'),
  },
  parlay: {
    until: dayjs().add(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
    from: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  },
};

const timeRange = computed(() => timeParams[query.value.nav]);

function handleShowFind(event) {
  showFind.value = event;
}

function handleShowPopup(event) {
  showPopup.value = event;
}

const store = useStore();
const { game } = store.state;

const staticLoading = ref(false);

async function runStatic() {
  const keys = Object.keys(timeParams);
  const staticReq = keys.map((key) => GetSports({
    ...timeParams[key],
    NO_FILTER: true,
  }));
  staticLoading.value = true;

  const resArray = await Promise.all(staticReq);

  staticLoading.value = false;

  resArray.forEach((res, index) => {
    if (index === 3) {
      return;
    }
    const key = keys[index];
    staticData[key].sports = res.sports.map((item) => {
      if (key === 'parlay') {
        item.count = item.parlayGame;
      } else {
        item.count = item.gameCount + item.liveGameCount;
      }
      return item;
    }).sort((a, b) => {
      if (b.sportType === 1) {
        return 1;
      } if (b.sportType === 2) {
        return 1;
      }
      return b.count - a.count;
    });
    staticData[key].total = res.sports.reduce((p, c) => {
      if (key === 'parlay') {
        p += c.parlayGame;
      } else {
        p += c.gameCount + c.liveGameCount;
      }
      return p;
    }, 0);
  });

  computeNotice();
}

watch(() => game.noticeList, () => {
  computeNotice();
}, { deep: true });

const { t } = useI18n();

function computeNotice() {
  let sports = SPORT_TYPE(t).map((item) => ({ ...item, count: 0 }));

  game.noticeCategory.forEach((item) => {
    const index = sports.findIndex((sub) => sub.sportType === item.sportType);
    if (index === -1) {
      sports.push({
        sportName: item.sportName,
        sportType: item.sportType,
        count: 1,
      });
    } else {
      sports[index].count += 1;
    }
  });

  sports = sports.sort((a, b) => b.count - a.count);

  if (sports.length) {
    staticData.notice.sports = sports;
    staticData.notice.total = sports.reduce((p, c) => p += c.count, 0);
  } else {
    staticData.notice.total = 0;
  }
}

const emit = defineEmits(['routeLeave']);

onBeforeRouteLeave(() => emit('routeLeave'));

onMounted(() => {
  runStatic();
  if (localStorage.getItem('selected_leagues')) {
    selectedLeagues.value = JSON.parse(localStorage.getItem('selected_leagues'));
  }
});
</script>

<style lang="less" scoped>
.sport-home-wrap {
  position: relative;
  flex: 1;
  transform: translateZ(0);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // padding: 0 32px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    height: 282px;
    width: 100%;
    background-color: var(--theme-color);
    left: 0;
    z-index: -1;
  }

  &-top {
    padding: 0 32px;

    h4 {
      margin-top: 10px;
      font-size: 22px;
      color: var(--text-color);
    }
  }

  &-money {
    font-size: 72px;
    color: var(--text-color);
    line-height: 84px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;

      .van-badge__wrapper {
        width: 30px;
        height: 40px;
        margin-right: 50px;
      }
    }

    .sport-notice {
      width: 30px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
    }

    .sport-more {
      width: 30px;
      height: 24px;
    }
  }

  :deep(.sport-card-wrap) {
    box-shadow: 0px 8px 22px 0px var(--card-shadow-color);
    background-color: var(--card-bg-color);
    border-radius: 8px;
  }
}
</style>

<script>
export default {
  name: 'sport-home',
};
</script>
