<template>
  <div class="sport-search-wrap">
    <van-cell-group inset>
      <van-field
        v-model="searchWord"
        :placeholder="$t('请输入队伍或赛事名称')"
      >
        <template #left-icon>
          <SvgIcon
            name="sport-search"
            @click="handleSearch(0, 'clear')"
          />
          <!-- <van-icon v-show="searchWord" @click="handDel" name="clear" /> -->
        </template>
        <template #right-icon>
          <van-icon
            v-show="searchWord"
            @click="handDel"
            name="clear"
          />
        </template>
      </van-field>
    </van-cell-group>
    <SportSearchDefault
      v-if="!hasSearch"
      :historySearch="historySearch"
      @handleClear="handleClear"
      @handleSearch="searchWord = $event"
      :loading="hotLoading"
      :searchData="hotSearch"
    />
    <SportSearchRes
      v-else
      :loadQuery="loadQuery"
      :searchData="searchData"
      v-model:sportType="sportType"
      :searchWord="searchWord"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRequest } from 'ahooks-vue';
import { onBeforeRouteLeave } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';
import SportSearchRes from './components/SportSearchRes.vue';
import SportSearchDefault from './components/SportSearchDefault.vue';
import { events_list, GetEvents, getPromotions } from '../../../api/home';
import { useStore } from '../../../store';

const searchWord = ref('');
const historySearch = ref([]);
const hasSearch = ref(false);
const searchData = ref([]);
const staticData = ref({});
const sportType = ref(-1);
const loadQuery = reactive({
  loading: false,
  pagesize: 20,
  finished: false,
  page: 1,
});

const emit = defineEmits(['routeLeave']);

onBeforeRouteLeave(() => emit('routeLeave'));

const { run: runHotEvent } = useRequest((params) => GetEvents(params), {
  manual: true,
  onSuccess(res) {
    loadQuery.loading = false;
    if (!res?.events.length) {
      loadQuery.finished = true;
      searchData.value = [];
      return;
    }

    searchData.value = searchData.value.concat(res.events);
    loadQuery.page += 1;
    loadQuery.finished = res.events.length < loadQuery.pagesize;
  },
});

const { data: hotSearch, loading: hotLoading } = useRequest(() => getPromotions({
  query: '$top=40&includeMarkets=none',
}), {
  formatResult(res) {
    const unique = [];
    res.events.forEach((event) => {
      if (!unique.find((item) => item.leagueName === event.leagueName)) {
        unique.push(event);
      }
    });
    return unique;
  },
});

const store = useStore();

onMounted(() => {
  store.dispatch('app');
  historySearch.value = localStorage.getItem('sport-search') ? JSON.parse(localStorage.getItem('sport-search')) : [];
});

function handDel() {
  hasSearch.value = false;
  searchWord.value = '';
}

let timer = 0;

watch(() => searchWord.value, (val, oldVal) => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    if (searchWord.value) {
      handleSearch(0, 'clear');
      timer = 0;
    } else {
      hasSearch.value = false;
      searchData.value = [];
      loadQuery.page = 1;
    }
  }, oldVal ? 500 : 0);
});

async function handleSearch(item, type) {
  loadQuery.loading = true;
  loadQuery.finished = false;

  if (type === 'clear') {
    searchData.value = [];
    loadQuery.page = 1;
  }

  if (item?.leaguename) searchWord.value = item.leaguename;

  if (!historySearch.value.includes(searchWord.value)) {
    historySearch.value.push(searchWord.value);
    localStorage.setItem('sport-search', JSON.stringify(historySearch.value));
  }
  hasSearch.value = true;
  if (item?.page) loadQuery.page = item.page;
  const { page } = loadQuery;

  runHotEvent({
    ...item,
    // page: loadQuery.page,
    // pagesize: loadQuery.pagesize,
    // leaguename: searchWord.value,
    query: `$filter=contains(sportName,'${searchWord.value}') or contains(leagueName, '${searchWord.value}') and eventstatus eq 'running'`
      + `${Number(sportType.value) > 0 ? ` and sporttype eq ${sportType.value}` : ''}`
      + `${`&$skip=${(page - 1) * loadQuery.pagesize}&$top=${loadQuery.pagesize}`}&includeMarkets=none`,
  });
}

watch(() => sportType.value, () => handleSearch({}, 'clear'));

function handleClear() {
  localStorage.removeItem('sport-search');
  historySearch.value = [];
}

</script>

<style lang="less" scoped>
.sport-search-wrap {
  flex: 1;
  background: var(--dark-bg-color-18171D, var(--bg-color-fff));
  display: flex;
  flex-direction: column;
  overflow: auto;

  .van-cell-group {
    margin: 0;
    padding: 24px 30px 30px;
  }

  .van-cell {
    padding: 20px 40px;
    line-height: 40px;
    height: 80px;
    border-radius: 40px;

    background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));

    .van-field__right-icon {
      display: flex;

      .van-icon-clear {
        position: absolute;
        top: 0;
        right: -10px;
        font-size: 40px;
      }
    }

    .svg-icon-wrap {
      width: 34px;
      height: 38px;
      fill: var(--dark-fff, var(--font-color-000));
    }

    :deep(.van-field__control) {
      color: var(--dark-fff, var(--font-color-0A0A0A));
    }
  }
}
</style>

<script>
export default {
  name: 'sport-search',
};
</script>
