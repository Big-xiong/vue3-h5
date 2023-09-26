<template>
  <div class="filter-sort-wrap">
    <van-nav-bar :title="$t('筛选与排序')" left-arrow @click-left="emit('close')"></van-nav-bar>
    <div class="filter-sort-wrap-content">
      <div class="title">{{ $t('排序方式') }}</div>
      <div class="select">
        <div class="select-box layout-flex-center-between" @click="selecting = !selecting">
          {{ types[activeNav]?.name || $t('请选择') }}
          <van-icon name="play" />
        </div>
        <div class="select-mantle" v-if="selecting">
          <div @click="onSelect(item)" class="select-mantle-item layout-flex-center-between"
               v-for="item in types.slice(1)" :key="item.id">{{ item.name }}
          </div>
        </div>
      </div>
      <div class="title">{{ $t('筛选游戏') }}</div>
      <van-search @update:model-value="emit('update:keyword', $event)" :model-value="keyword" @search="emit('search')"
                  :placeholder="$t('输入关键词搜一搜')"/>
      <sort-item :title="$t('平台')" :selected="platList.find(item => item.id === activePlat)?.name ?? '1'"
                 @select="emit('update:activePlat', platList.find(item => item.name === $event)?.id ?? '')"
                 :dataList="platList.map(item => item.name)"></sort-item>
      <sort-item :title="$t('赔付线')" :selected="lineList[activeLine]"
                 @select="emit('update:activeLine', lineList.indexOf($event))" :dataList="lineList"></sort-item>
      <div class="btn-box layout-flex-center">
        <van-button type="primary" @click="emit('filter')">{{ $t('筛选') }}</van-button>
        <van-button class="cancel" @click="emit('clear')">{{ $t('清除') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import SortItem from './components/SortItem.vue';

const props = defineProps({
  activeNav: [Number, String],
  activePlat: [Number, String],
  activeLine: [Number, String],
  lineList: {
    type: Array,
    default: () => [],
  },
  platList: {
    type: Array,
    default: () => [],
  },
  keyword: String,
});

const selecting = ref(false);

const global = inject('global');
const emit = defineEmits(['update:activeNav', 'update:activePlat', 'update:activeLine', 'update:keyword', 'close']);
const store = inject('store');
const { user } = store.state;

function onSelect(item) {
  if (item.id === 2 && !user.isLogin) {
    global.$dialog({ tpl: 'LoginDialog' });
    return;
  }
  emit('update:activeNav', item.id);
  selecting.value = false;
}

const types = ref([
  {
    name: global.$t('请选择'),
    id: 0,
  },
  {
    name: global.$t('最新游戏'),
    id: 1,
  },
  {
    name: global.$t('我的最爱'),
    id: 2,
  },
  {
    name: global.$t('推荐游戏'),
    id: 3,
  },
  {
    name: global.$t('最后游玩游戏'),
    id: 4,
  },
]);
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  color: var(--font-color-ffffff);
}

:deep(.van-nav-bar) {
  position: sticky;
  top: 0;
}

:deep(.van-nav-bar__title) {
  color: var(--font-color-ffffff);
}

:deep(.van-col--12) {
  margin-bottom: 52px;
}

:deep(.van-radio__label) {
  color: var(--dark-fff, var(--font-color-999999));
}

.filter-sort-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100% !important;
  overflow-y: auto;
  background-color: var(--dark-000, var(--bg-color-f3f3f3));

  &-content {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 36px 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .select {
      position: relative;
      width: 100%;
      background: var(--theme-color);
      font-size: 28px;
      font-weight: 400;
      color: var(--font-color-ffffff);
      margin-bottom: 36px;

      &-box {
        height: 90px;
        padding: 28px 45px 22px 44px;
        box-sizing: border-box;

        .van-icon {
          transform: rotate(90deg);
        }
      }

      &-mantle {
        position: absolute;
        width: 100%;
        z-index: 99;

        &-item {
          height: 90px;
          box-sizing: border-box;
          background: var(--bg-color-24c29a);
          padding: 28px 45px 22px 44px;
          border-top: 2px solid var(--border-color-fff);
          &:last-of-type {
            border-bottom: 2px solid var(--border-color-fff);
          }
        }
      }
    }

    .van-search {
      width: 100%;
      padding: 0;
      margin-bottom: 36px;
      background-color: transparent;

      :deep(.van-search__content) {
        height: 90px;
        line-height: 90px;
        background: var(--dark-bg-color-191919, var(--bg-color-ffffff));
        box-sizing: border-box;
        border: none;

        .van-icon {
          font-size: 50px;
        }

        .van-cell {
          background-color: var(--dark-transparent);
          line-height: 90px;
          height: 100%;
          padding: 0;
        }

        input {
          color: var(--dark-fff, var(--font-color-222930));
        }
      }
    }
  }

  .two {
    width: 100%;
  }

  .btn-box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    :deep(.van-button--primary) {
      width: 448px;
      height: 72px;
      border-radius: 8px;
      margin-right: 14px;
    }
  }

  :deep(.cancel) {
    width: 230px;
    border: 2px solid var(--font-color-999999);
    color: var(--font-color-999999);
    height: 72px;
  }

  .title {
    font-size: 36px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-222930));
    margin-bottom: 30px;
  }
}
</style>
