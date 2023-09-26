<template>
  <van-popup
    round
    v-model:show="isShow"
    close-on-click-overlay
    position="center"
    teleport="body"
    class="discount-popup"
  >
    <div class="popup-title-wrap">
      <span>{{ subConfig.title }} {{ $t('条款') }}</span>
      <van-icon
        name="cross"
        @click="isShow = false"
      ></van-icon>
    </div>

    <div
      class="popup-body"
      v-html="textData"
    ></div>

    <van-button
      type="primary"
      @click="isShow = false"
    >{{ $t('确认') }}</van-button>
  </van-popup>
</template>

<script setup>
import {
  inject, ref, watch, defineProps, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { getMemberProtocol } from '@/api/protocol.js';

const isShow = ref(true);
const subConfig = inject('subConfig');

const { data: textData } = useRequest(() => getMemberProtocol({ CACHE: true, id: 1 }), {
  formatResult: (res) => res.replaceAll('\n', '<br>'),
});

</script>

<style
 lang="less" scoped>
.popup-title-wrap {
  display: flex;
  flex-shrink: 0;
  padding: 0 36px 0 44px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  box-sizing: border-box;
  justify-content: space-between;
  width: 682px;
  height: 112px;
  align-items: center;
  background: var(--theme-color);
  color: var(--font-color-ffffff);
  font-size: 28px;
  font-weight: 400;
  overflow-y: auto;
  box-sizing: border-box;
  span {
    text-align: center;
    width: 100%;
  }
}

.popup-body {
  padding: 42px 24px 70px 24px;
  flex-grow: 1;
  overflow-y: auto;
  font-size: 26px;
  border-radius: 20px;
  text-align: left;
  color: var(--dark-fff, var(--font-color-222930));
  max-height: 600px;

  div {
    margin-bottom: 15px;
  }
}

.van-button {
  flex-shrink: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.title-wrap {
  margin-top: 42px;
  margin-bottom: 24px;
  .title {
    font-size: 28px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-222930));
    line-height: 40px;
  }
  .subtitle {
    font-size: 28px;
    padding-left: 16px;
    font-weight: 400;
    color: var(--theme-color);
    line-height: 40px;
  }
}
</style>

<style>
.discount-popup {
  width: 682px !important;
  max-height: 85% !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
