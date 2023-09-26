<template>
  <teleport :to="$store.state.app.teleportContainer">
    <popup
      position="bottom"
      v-model:show="isShow"
      closeIconPosition="top-right"
      @close="emit('update:show', false); $attrs?.unmount?.()"
      :theme-title="true"
      :title="$t('选择号码地区')"
      :close-on-click-overlay="true"
      v-bind="$attrs"
      @touchmove="touchFix"
    >
      <div id="phonearea" class="index-bar">
        <div class="wrapper" ref="wrapperRef" @scroll="onScroll($event)">
          <div v-for="i in indexList" :key="i" :ref="(el) => (anchorRefs[i] = el)">
            <div class="index-anchor">{{ anchorName(i) }}</div>
            <div class="list-wrap" v-if="list[i]">
              <div
                class="cell"
                :class="{ select: j[2] == areaCode }"
                v-for="(j, k) in list[i]"
                :key="i + k"
                @click="onConfirm(j[2])"
              >
                <div class="left">{{ $i18n && $i18n.locale == 'en' ? j[0] : j[1] }}</div>
                <div class="rigth">+{{ j[2] }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="index-bar__sidebar">
          <div
            class="index-bar__index"
            v-for="(i, index) in indexList"
            @click.stop="onShortcutStart(i)"
            :class="{ active: activeIndex === i }"
            :key="index"
          >{{ i }}</div>
        </div>
      </div>
    </popup>
  </teleport>
</template>

<script setup>
import {
  defineEmits, defineProps, inject, ref, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Popup from '@/components/Popup/index.vue';

const indexList = [
  '*',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  // 'W',
  // 'X',
  'Y',
  'Z',
];

const wrapperRef = ref(null);
const anchorRefs = ref([]);
const activeIndex = ref('*');

const list = ref({
  '*': [],
});

const global = inject('global');

function anchorName(type) {
  if (type === '*') {
    return global.$t('常用');
  }
  return type;
}

const $store = inject('store');

const areaDomList = [];

function onScroll(event) {
  const { scrollTop } = event.target;
  if (areaDomList.length === 0) {
    document.querySelectorAll('#phonearea .wrapper > div').forEach((item) => {
      areaDomList.push(item.offsetTop);
    });
  }
  activeIndex.value = indexList[areaDomList.findIndex((item) => scrollTop < item)];
}

onMounted(() => {
  $store.dispatch('app/getDict', ['phoneareav3']);
});

// const { userInfo } = $store.state.agent;
const isShow = ref(true);

const { app } = $store.state;
const emit = defineEmits(['update:show', 'confirm', 'firstCode']);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  areaCode: String,
});

watch(() => props.show, (show) => {
  isShow.value = show;
}, { immediate: true, deep: true });

watch(
  app.dicts,
  (dicts) => {
    const { phoneareav3 } = dicts;
    if (list.value['*'].length) {
      return;
    }

    if (phoneareav3?.length) {
      const firstCode = phoneareav3[0].split('-');
      emit('firstCode', firstCode[firstCode.length - 1]);
    }

    phoneareav3?.forEach((item) => {
      const items = item.split('-');
      const index = items[0].substring(0, 1);
      if (!list.value[index]) {
        list.value[index] = [];
      }
      if ([
        '66',
        '86',
        '84',
        '852',
        '65',
      ].indexOf(items[2]) > -1) {
        list.value['*'].push(items);
      }
      list.value[index].push(items);
    });
  },
  {
    immediate: true,
    deep: true,
  },
);

function onShortcutStart(index) {
  const target = anchorRefs.value[index];
  wrapperRef.value.scrollTop = target.offsetTop - 100;
  activeIndex.value = index;
}

function onConfirm(code) {
  emit('confirm', code);
}

let warpItem;
function touchFix() {
  if (!warpItem) warpItem = document.querySelector('.wrapper');
  if (!warpItem.scrollTop) warpItem.scrollTop = 1;
}
</script>

<style lang="less" scoped>
.index-bar {
  flex: 1;
  display: flex;
  height: 744px;

  .index-anchor {
    position: relative;
    padding: 0 20px;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--theme-color));
    line-height: 80px;
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      left: 20px;
      bottom: 0;
      background-color: var(--dark-333, var(--border-color-00001));
    }
  }

  .wrapper {
    height: 744px;
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .cell {
    padding: 0 20px;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-333333));
    line-height: 80px;
    display: flex;

    .left {
      flex: 1;
      // color: var(--cur-font-color-f5f5f5);
    }

    .rigth {
      color: var(--cur-font-color-ccc);
    }
  }

  .select {
    color: var(--theme-color);
  }

  .index-bar__sidebar {
    width: 40px;
    position: static;
    transform: none;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;

    .index-bar__index {
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
      font-size: 20px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-525152));
      line-height: 33px;
      cursor: pointer;

      &.active {
        color: var(--theme-color);
      }
    }
  }
}
</style>
