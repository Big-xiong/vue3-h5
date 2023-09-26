<template>
  <div class="sport-search-default-wrap">
    <ul
      class="sport-search-default-wrap-history"
      v-show="historySearch.length"
    >
      <h4>
        <span>
          {{ $t('近期搜索') }}
        </span>
        <span @click="handleClear">
          <van-icon name="delete" />
          <span>{{ $t('清空') }}</span>
        </span>
      </h4>
      <li
        v-for="(item, i) in historySearch"
        :key="i"
        @click="handleSearch(item)"
      >{{ item }}</li>
    </ul>
    <ul class="sport-search-default-wrap-hot">
      <h4>{{ $t('热门搜索') }}</h4>
      <van-list
        :loading="loading"
        :loading-text="$t('加载中')"
      >
        <li
          v-for="(item, i) in searchData"
          :key="i"
          @click="handleSearch(item.leagueName)"
        >
          <i>{{ i + 1 }}.</i>
          {{ item.leagueName }}
        </li>

      </van-list>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({
  loading: Boolean,
  historySearch: {
    type: Array,
    default: () => [],
  },
  searchData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['handleClear', 'handleSearch']);

function handleClear() {
  emit('handleClear');
}

function handleSearch(item) {
  emit('handleSearch', item);
}

</script>

<style lang="less" scoped>
.sport-search-default-wrap {
  padding: 0 30px;

  ul {
    h4 {
      color: var(--dark-fff, var(--font-color-0A0A0A));
      font-size: 28px;
    }

    li {
      font-size: 28px;
      margin-bottom: 10px;
    }
  }

  &-history {
    margin-top: 62px;
    overflow: hidden;

    h4 {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      font-weight: 600;

      span:last-child {
        display: flex;
        align-items: center;
        font-size: 24px;
        color: var(--font-color-848A9B);

        .van-icon {
          margin-left: 4px;
          font-size: 32px;
        }
      }
    }

    li {
      width: 160px;
      height: 60px;
      background: var(--dark-card-bg-color, var(--bg-color-F9FAFB));
      color: var(--dark-fff, var(--font-color-848A9B));
      text-align: center;
      line-height: 60px;
      margin-right: 10px;
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-hot {
    margin-top: 46px;

    h4 {
      margin-bottom: 32px;
      font-weight: 600;

    }

    li {
      color: var(--dark-fff, var(--font-color-43434D));
      margin-bottom: 32px !important;

      &:nth-child(2) {
        i {
          color: var(--font-color-fir);
        }
      }

      &:nth-child(3) {
        i {
          color: var(--font-color-sec);
        }
      }

      &:nth-child(4) {
        i {
          color: var(--font-color-third);
        }
      }
    }
  }
}
</style>
