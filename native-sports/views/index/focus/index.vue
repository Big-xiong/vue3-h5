<template>
  <div class="sport-focus-wrap">
    <div class="sport-focus-wrap-top">
      <van-nav-bar :title="$t('关注赛事')" />
      <van-tabs
        v-model:active="active"
        @click-tab="handleClick"
        :key="count"
      >
        <van-tab
          v-for="(item, index) in tabOptions"
          :key="index"
        >
          <template #title>
            {{ item.sportName }}
            <span>{{ item.count }}</span>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <SportFocusMain :sport-type="sportType" />
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import SportFocusMain from './components/SportFocusMain.vue';
import { SPORT_TYPE } from '../../../const';

const { t } = useI18n();

const active = ref(0);

const sportType = ref(-1);
const count = ref(0);

const store = useStore();
const { game } = store.state;

const tabOptions = ref([]);
function computeTabs() {
  const base = [
    {
      sportName: t('全部'),
      sportType: -1,
      count: 0,
    },
  ].concat(SPORT_TYPE(t).map((item) => ({ ...item, count: 0 })));

  if (game.noticeCategory.length) {
    base[0].count = game.noticeCategory.length;

    console.log(game.noticeCategory);
    game.noticeCategory.forEach((item) => {
      const index = base.findIndex((sub) => sub.sportType === item.sportType);
      if (index === -1) {
        base.push({
          sportName: item.sportName,
          sportType: item.sportType,
          count: 1,
        });
      } else {
        base[index].count += 1;
      }
    });
    tabOptions.value = base;
  } else {
    tabOptions.value = base.map((item) => ({
      ...item,
      count: 0,
    }));
  }

  tabOptions.value = tabOptions.value.sort((a, b) => b.count - a.count);
  count.value += 1;
}

watch(() => game.noticeList, () => {
  console.log('watching notice');
  computeTabs();
}, { deep: true, immediate: true });

function handleClick(tab) {
  sportType.value = tabOptions.value[tab.name].sportType;
}
</script>

<style lang="less" scoped>
.sport-focus-wrap {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &-top {
    background: var(--card-bg-color);

    :deep(.van-tabs) {
      padding: 0 32px;

      .van-tab {
        flex: initial;
        margin-right: 56px;
        color: var(--font-color-848A9B);
        font-size: 28px;
        white-space: nowrap;
        position: relative;

        &--active {
          color: var(--theme-color);
          font-weight: normal;
        }

        .van-tab__text {
          span {
            position: absolute;
            top: 4px;
            right: -14px;
            font-size: 22px;
          }
        }
      }
    }
  }
}
</style>
