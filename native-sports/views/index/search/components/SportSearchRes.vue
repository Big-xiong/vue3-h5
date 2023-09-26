<template>
  <div class="sport-search-res-wrap">
    <van-tabs
      @click-tab="handleQuery"
      v-model:active="active"
      shrink
    >
      <van-tab>
        <template #title>{{ $t('全部') }}</template>
      </van-tab>
      <van-tab
        v-for="item in SPORT_TYPE($t)"
        :name="item.sportType"
        :key="item.sportType"
      >
        <template #title>
          {{ item.sportName }}
        </template>
      </van-tab>
    </van-tabs>
    <main>
      <van-list
        :loading="loadQuery.loading"
        :finished="loadQuery.finished"
        :finished-text="searchData.length && $t('没有更多了')"
        :loading-text="$t('加载中')"
        @load="emit('handleSearch')"
      >
        <ul>
          <li
            v-for="(item, i) in searchData"
            :key="i"
            @click="$router.push('/sport-detail?id=' + item.eventId)"
          >
            <div>
              <van-image
                :src="$getSrc('/src/assets/native-sports/images/error.png')"
                alt
              />
              <p v-html="handleKey(item?.leagueName)" />
              <!-- {{ handleKey(item?.leagueName) }} -->
            </div>
            <div>
              <van-icon
                :name="item.is_noticed ? 'like' : 'like-o'"
                @click.stop="handleNotice(item, index)"
              />
              <div>
                <span>{{ dayjs(item?.globalShowTime).format('DD/MM HH:mm A') }}</span>
                <span>{{ item?.teamInfo?.homeName }}-{{ item?.teamInfo?.awayName }}</span>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
      <Empty
        v-if="!searchData.length && !loadQuery.loading"
        :imgSrc="`/src/assets/native-sports/images/search-empty.png`"
        :text="$t('暂无搜索内容')"
      />
    </main>
  </div>
</template>

<script setup>
import {
  ref, computed, inject,
} from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Empty from '../../../../components/Empty.vue';
import { add_notice } from '/native-sports/api/home';
import { SPORT_TYPE } from '../../../../const';

const active = ref(undefined);
const global = inject('global');
const { t } = useI18n();

const props = defineProps({
  searchData: {
    type: Array,
    default: () => [],
  },
  staticData: {
    type: Object,
    default: () => ({}),
  },
  loadQuery: {
    type: Object,
    default: () => ({}),
  },
  searchWord: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['handleSearch', 'handleOnload', 'update:sportType']);

const { run: runNotice } = useRequest((data) => add_notice(data), {
  manual: true,
});

function handleQuery(key) {
  emit('update:sportType', key.name);
}

function handleKey(val) {
  return val?.split(props.searchWord).join(`<span style='color: var(--theme-color);'>${props.searchWord}</span>`);
}

async function handleNotice(item, index) {
  const type = item.is_noticed ? 2 : 1;
  const res = await runNotice({
    event_id: item.eventId, status: type, sport_type: item.sportType, LOADING: true,
  });
  if (res) {
    item.is_noticed = !item.is_noticed;
    type === 1 ? Toast(t('关注成功')) : Toast(t('取消关注成功'));
  }
  // console.log()
}

</script>

<style lang="less" scoped>
.sport-search-res-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;

  :deep(.van-tabs) {
    .van-tab {
      color: var(--font-color-848A9B);
      font-size: 28px;
      padding-top: 20px;

      &--active {
        color: var(--theme-color);
        font-weight: normal;
      }
    }
  }

  main {
    border-top: 20px solid var(--dark-bg-color-18171D, var(--border-color-F9F9F9));
    // height: calc(100% - 518px);
    overflow: auto;
    padding: 0 30px;

    ul {
      li {
        line-height: 40px;
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-0A0A0A));

        >div {
          padding: 28px 0;

          border-bottom: 2px solid var(--dark-border-color-3F3D4B, var(--border-color-E6EBF1));

          &:first-child {
            display: flex;
            align-items: center;
          }

          .van-image {
            width: 36px;
            margin-right: 22px;
          }

          &:last-child {
            display: flex;
            align-items: center;

            .van-icon {
              font-size: 36px;
              margin-right: 22px;
              color: var(--font-color-848A9A);

              &.van-icon-like {
                color: #f7b500;
              }
            }

            >div {
              display: flex;
              flex-direction: column;

              span {
                &:first-child {
                  color: var(--font-color-848A9A);
                }
              }
            }
          }
        }
      }
    }

    :deep(.empty-wrap) {
      img {
        width: 254px;
        margin-top: 170px;
      }

      p {
        width: 330px;
        text-align: center;
      }
    }
  }
}
</style>
