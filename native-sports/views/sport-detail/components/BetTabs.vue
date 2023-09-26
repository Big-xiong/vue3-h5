<template>
  <main
    class="bet-tabs-wrap"
  >
    <div
      class="tab-item"
      v-for="(item, index) in tabOptions"
      :class="{ selected: index === tabSelected }"
      :key="index"
      @click="tabSelected = index"
    >{{ item.betTypeName }}</div>
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { t } = useI18n();

const props = defineProps({
  betType: Number,
  markets: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const tabOptions = ref([]);

watch(() => props.data, () => {
  computeTabOptions(props.data?.markets ?? []);
}, { deep: true, immediate: true });

watch(() => props.markets, () => {
  if (props.markets.add?.length) {
    const holder = props.data.markets.concat(props.markets.add);
    computeTabOptions(holder);
  }

  if (props.markets.remove?.length) {
    const holder = props.data.markets.concat([]);
    props.markets.remove.forEach((item) => {
      const index = holder.findIndex((subItem) => subItem.marketId === item.marketId);
      holder.splice(index, 1);
    });
    computeTabOptions(holder);
  }
});

function computeTabOptions(markets) {
  tabOptions.value = [
    {
      betTypeName: t('全部'),
      betType: -1,
    },
  ];
  markets.forEach((item) => {
    if (item.selections?.length && !tabOptions.value.find((subItem) => subItem.betType === item.betType)) {
      tabOptions.value.push(
        {
          betTypeName: item.betTypeName,
          betType: item.betType,
        },
      );
    }
  });
}

const tabSelected = ref(0);

const emit = defineEmits(['closeStatus', 'update:betType']);

watch(() => tabSelected.value, () => emit('update:betType', tabOptions.value[tabSelected.value].betType));
</script>

<style lang="less">
.bet-tabs-wrap {
  background-color: var(--card-bg-color, var(--bg-color-fff));
  display: flex;
  align-items: center;
  height: 100px;
  padding-left: 46px;
  overflow-x: auto;

  .tab-item {
    font-size: 28px;
    font-weight: 400;
    line-height: 40px;
    padding: 0 26px 0 30px;
    background-color: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
    color: var(--font-color-848A9B);
    border-radius: 100px;
    white-space: nowrap;
    height: 48px;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-right: 40px;
    }

    &.selected {
      color: var(--font-color-fff);
      background-color: #d0b393;
    }
  }

  &.game-status-tab {
    //background: linear-gradient(90deg, #ffffff 0%, #fbfbfb 100%);

    .tab-item {
      background-color: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
    }

    .close {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--card-bg-color, var(--bg-color-fff));

      .svg-icon-wrap {
        width: 20px;
        height: 20px;
        fill: var(--font-color-848A9B, var(--font-color-0A0A0A));
      }
    }
  }
}
</style>
