<template>
  <div class="sport-filter-wrap sport-card-wrap">
    <ul
      class="nav-wrap"
      :class="lang"
    >
      <li
        @click="navActive = key"
        :class="{ 'nav-active': navActive === key }"
        v-for="(val, key) in state.navMap"
        :key="key"
      >{{ val }}{{ staticData?.[key]?.total }}</li>
    </ul>
    <van-tabs
      :key="count"
      v-model:active="cateActive"
    >
      <van-tab
        v-for="(item, i) in sports"
        :key="i"
        :name="item.sportType"
      >
        <template #title>
          {{ item.sportName }}
          <i>{{ item?.count }}</i>
        </template>
      </van-tab>
    </van-tabs>
    <div class="filter-wrap">
      <div class="filter-wrap-left">
        <!-- <SvgIcon name="sport-exchange" /> -->
        <img :src="$getSrc('/src/assets/native-sports/images/exchange.png')" />
        <span
          @click="handleSort(1)"
          :class="{ 'type-active': sortActive === 1 }"
        >{{ $t('时间') }}</span>
        <span class="divider">/</span>
        <span
          @click="handleSort(2)"
          :class="{ 'type-active': sortActive === 2 }"
        >{{ $t('联赛') }}</span>
      </div>
      <SvgIcon
        name="sport-filter"
        @click="emit('handleShowFind', true)"
      />
    </div>
  </div>
</template>

<script setup>
import {
  reactive, ref, computed, inject, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import SvgIcon from '@/components/SvgIcon.vue';

const navActive = ref('today');
const cateActive = ref(1);
const sortActive = ref(1);
const emit = defineEmits(['handleShowFind', 'update:query']);
const global = inject('global');

const lang = computed(() => global.$store.state.app.lang);

const props = defineProps({
  query: {
    type: Object,
    default: () => ({}),
  },
  staticData: {
    type: Object,
    default: () => ({}),
  },
});
const { t } = useI18n();

const sports = computed(() => props.staticData[navActive.value].sports);

const state = reactive({
  navMap: {
    today: t('今日'),
    early: t('早盘'),
    parlay: t('串关'),
    notice: t('关注'),
  },
});

const count = ref(0);

watch(() => global.$store.state.app.sort, (val) => {
  sortActive.value = val;
});

watch(() => props.staticData, () => {
  count.value += 1;
}, { deep: true });

watch(() => [navActive.value, sortActive.value, cateActive.value], () => {
  count.value += 1;
  emit('update:query', {
    ...props.query,
    sort: sortActive.value,
    sport_type: cateActive.value,
    nav: navActive.value,
  });
});

function handleSort(type) {
  sortActive.value = type;
  global.$store.commit('app/SET_SORT', type);
}

</script>

<style lang="less" scoped>
.sport-filter-wrap {
  background-color: var(--card-bg-color);
  margin-bottom: 26px;

  ul {
    display: flex;

    li {
      text-align: center;
      color: var(--font-color-848A9B);
      font-size: 28px;
      line-height: 40px;
      text-align: center;
    }

    &.nav-wrap {
      padding-top: 38px;
      padding-left: 20px;
      padding-bottom: 20px;
      overflow-x: auto;
      box-sizing: border-box;

      li {
        border-right: 2px solid var(--dark-border-color-2D2B36, var(--border-color-E6EBF1));
        white-space: nowrap;
        font-size: 28px;
        min-width: 160px;

        &:last-child {
          border: 0;
        }
      }

      .nav-active {
        font-size: 32px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
      }

      &.vn,
      &.en {
        li {
          font-size: 24px;
        }

        .nav-active {
          font-size: 28px;
        }
      }
    }

    &.cate-wrap {
      margin-top: 26px;

      li {
        padding: 10px 24px;
        border-radius: 30px;
        margin-left: 24px;
        background-color: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
      }

      .cate-active {
        color: var(--font-color-fff);
        background: var(--gradient-bg-color);
      }
    }
  }

  :deep(.van-tabs) {
    margin-top: 6px;
    padding-left: 36px;

    .van-tabs--line {
      .van-tabs__wrap {
        height: 60px;
      }
    }

    .van-tabs__nav {
      background-color: transparent;

      &--line {
        padding-bottom: 0;
        padding-left: 0 !important;
      }

      .van-tab {
        padding: 10px 24px;
        border-radius: 30px;
        margin-left: 24px;
        font-size: 28px;
        line-height: 40px;
        color: var(--font-color-848A9B);
        flex-grow: 0;
        min-width: 130px;
        background-color: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
        height: 60px;

        &:first-child {
          margin-left: 0;
        }

        &--active {
          color: var(--font-color-fff);
          background: var(--gradient-bg-color);
        }

        .van-tab__text {
          i {
            font-size: 24px;
          }
        }
      }
    }
  }

  .filter-wrap {
    padding: 22px 30px 34px 30px;
    font-size: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-left {
      display: flex;
      align-items: center;
      font-weight: bolder;
      height: 28px;

      >span {
        color: var(--dark-fff);
      }

      >img {
        width: 28px;
        margin-right: 6px;
      }

      .divider {
        margin: 0 10px;
        display: flex;
        font-size: 30px;
        align-items: center;
        transform: translateY(0.5px);
      }

      .sport-exchange {
        width: 28px;
        height: 28px;
        margin-right: 6px;
        position: relative;
        margin-top: 2px;
      }
    }

    .sport-filter {
      width: 28px;
      height: 24px;
      fill: var(--dark-fff, var(--font-color-404040));
    }

    span {
      line-height: 28px;
      height: 28px;
      display: block;

      &.type-active {
        color: var(--theme-color);
        font-size: 28px;
      }

      // font-size: 24px;
    }
  }
}
</style>
