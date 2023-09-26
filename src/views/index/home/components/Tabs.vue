<template>
  <div class="tabs-wrap" :loop="false" :show-indicators="false">
    <div class="inner-wrap no-scrollbar">
      <div
        @click="tabClick(item, $event)"
        class="box"
        v-for="(item, index) in gameList"
        :key="index"
      >
        <div
          :class="{ active: item.id === active?.id }"
          class="box-btn layout-flex-center"
        >{{ item.transName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, reactive } from 'vue';

const global = inject('global');

defineProps({
  active: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:active']);

const gameList = ref([{
  name: '体育',
  transName: global.$t('体育'),
  type: 'sport',
  id: 4,
},
{
  name: '电竞',
  transName: global.$t('电竞'),
  type: 'esport',
  id: 8,
},
{
  name: '真人',
  transName: global.$t('真人'),
  type: 'real',
  id: 1,
},
{
  name: '电子',
  transName: global.$t('电子'),
  type: 'electron',
  id: 2,
},
{
  name: '彩票',
  transName: global.$t('彩票'),
  type: 'lottery',
  id: 5,
},
  // {
  //   name: '捕鱼',
  //   transName: global.$t('捕鱼'),
  //   type: 'fish',
  //   id: 3,
  // }
]);

function tabClick(tab, event) {
  emit('update:active', tab);
  const target = event.target.parentNode;
  target.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}
</script>

<style lang="less" scoped>
.tabs-wrap {
  position: relative;
  height: 72px;

  .inner-wrap {
    width: 100%;
    position: absolute;
    display: flex;
    overflow-x: auto;
    padding-bottom: 1px;
    box-sizing: border-box;
  }

  .box {
    position: relative;
    border-radius: 8px;
    margin-right: 12px;
    &:first-child {
      padding-left: 30px;
    }
    &:last-child {
      padding-right: 30px;
      margin-right: 0;
    }
    &-btn {
      min-width: 188px;
      height: 72px;
      white-space: nowrap;
      box-sizing: border-box;
      padding: 0 10px;
      color: var(--font-color-24c29a);
      border: 2px solid var(--border-color-24c29a);
      background-color: var(--dark-transparent, var(--bg-color-ffffff));
      border-radius: 6px;
    }
    .active {
      background-color: var(--bg-color-24c29a);
      color: var(--font-color-ffffff);
    }
  }
}
</style>
