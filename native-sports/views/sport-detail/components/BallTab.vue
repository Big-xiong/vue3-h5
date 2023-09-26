<template>
  <main
    class="ball-tab-container"
  >
    <div class="divider"></div>

    <main class="ball-tab-wrap">
      <BetItem
        @doBet="doBet($event)"
        @top="top($event)"
        :index="index"
        :data="item"
        v-for="(item, index) in list"
        :key="item.marketId"
      />
    </main>
  </main>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { getBetTypeName } from '../../../const';
import BetItem from './BetItem.vue';
// import Let from '../bet-types/Let.vue';
// import Solo from '../bet-types/Solo.vue';
// import WinLoss from '../bet-types/WinLoss.vue';
// import BigLittle from '../bet-types/BigLittle.vue';

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

const emit = defineEmits(['empty']);

const list = ref([]);
const marketsHolder = ref([]);

function top(index) {
  const value = list.value[index];
  list.value = list.value.sort((a, b) => (a === value ? -1 : 1));
}

const store = useStore();

function doBet({ market, selection }) {
  store.commit('app/TOGGLE_SINGLE_ODDS', {
    ...props.data,
    odds: {
      ...market,
      selected: {
        ...selection,
      },
    },
  });
}

watch(() => props.markets, (markets) => {
  if (markets?.add.length) {
    const holder = [];
    markets.add.forEach((item) => {
      if (!marketsHolder.value.find((sub) => sub.marketId === item.marketId)) {
        holder.push(item);
      }
    });
    marketsHolder.value = marketsHolder.value.concat(holder.filter((item) => item.selections.length));
  }

  if (markets?.change.length) {
    markets.change.forEach((item) => {
      marketsHolder.value.forEach((subItem, index) => {
        if (subItem.marketId === item.marketId) {
          const selections = item.selections.map((selectItem, selectIndex) => ({
            ...selectItem,
            ...subItem.selections[selectIndex],
          }));
          marketsHolder.value[index] = {
            ...subItem,
            ...item,
            selections,
          };
        }
      });
    });
  }

  if (markets?.remove.length) {
    markets.remove.forEach((item) => {
      const index = marketsHolder.value.findIndex((subItem) => subItem.marketId === item.marketId);
      marketsHolder.value.splice(index, 1);
    });

    if (marketsHolder.value.length === 0) {
      emit('empty');
    }
  }

  getList();
});

function getList() {
  let listHolder = [];
  if (props.betType === -1) {
    listHolder = marketsHolder.value.concat([]);
  } else {
    listHolder = marketsHolder.value.filter((item) => item.betType === props.betType);
  }

  if (listHolder.length) {
    const holder = [];
    listHolder.forEach((item) => {
      let index = holder.findIndex((sub) => sub.betType === item.betType);
      if (index === -1) {
        holder.push({
          name: item.betTypeName,
          betType: item.betType,
          teams: [],
          markets: [],
        });
        index += holder.length;

        if (getBetTypeName(item.betType) === 'Let') {
          holder[index].teams = item.selections.map((select) => select.keyName);
        }
      }

      const selections = item.selections.concat([]).map((select) => {
        const typeName = getBetTypeName(item.betType);
        if (typeName === 'Let') {
          select.title = select.point;
        } else if (typeName === 'BigLittle') {
          select.title = `${select.keyName} ${select.point}`;
        } else if (['WinLoss', 'Solo', 'Ball', 'Goal', 'OddsEven', 'WinTeam', 'LoseGoal', 'NextCombo'].includes(typeName)) {
          select.title = select.keyName;
        }
        return select;
      });

      holder[index].markets.push({
        ...item,
        selections,
      });
    });
    list.value = holder;
  }
}

watch(() => props.betType, () => {
  getList();
});

onBeforeMount(() => {
  marketsHolder.value = props.data.markets?.map((item) => ({ ...item })).filter((item) => item.selections?.length) ?? [];

  getList();
});
</script>

<style lang="less">
.divider {
  height: 20px;
  background-color: var(--divider-bg);
  flex-shrink: 0;
}

.ball-tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ball-tab-wrap {
  padding: 24px 32px 30px 32px;
  background-color: var(--card-bg-color, var(--bg-color-fff));
  flex: 1;
  box-sizing: border-box;

  .state-item {
    padding: 0 18px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--dark-bg-color-33323E, var(--bg-color-F9FAFB));
    font-size: 22px;
    color: var(--dark-fff, var(--font-color-0A0A0A));
    width: 160px;

    span:nth-child(1) {
      color: var(--font-color-848A9B);
      margin-right: 12px;
    }
  }
}
</style>
