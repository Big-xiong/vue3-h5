<template>
    <div class="sort-item-wrap">
      <div class="title">{{ title }}</div>
      <div class="list-wrap">
        <div class="item" @click="emit('select', item)" v-for="item in dataList" :key="item">
          <em :class="{ selected: item === selected }"></em>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const global = inject('global');
defineProps({
  selected: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  dataList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);
</script>

<style lang="less" scoped>
.sort-item-wrap {
  box-sizing: border-box;
  width: 100%;
  .title {
    font-size: 36px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-222930));
    margin-bottom: 20px;
  }
  .list-wrap {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item {
      font-size: 24px;
      font-weight: 400;
      color: var(--font-color-999999);
      margin-bottom: 50px;
      width: 50%;
      display: flex;
      em {
        display: block;
        margin-right: 18px;
        background-color: var(--dark-000, var(--bg-color-ffffff));
        width: 28px;
        height: 28px;
        border: 2px solid var(--font-color-999999);
        box-sizing: border-box;
        border-radius: 50%;
        &.selected {
          border: 8px solid var(--theme-color);
        }
      }
    }
  }
}
</style>
