<template>
  <Popup
    closeable
    close-icon-position="top-left"
    class="service-popup"
    position="bottom"
    :title="$t('选择联系方式')"
    @clickCloseIcon="isShow = false"
    v-model:show="isShow"
  >
    <div class="title">{{ $t("我们为您提供两种服务方式") }}</div>
    <div class="button-wrap">
      <van-button type="primary" @click="callService">{{ $t("联系客服") }}</van-button>
      <van-button type="primary" @click="openCallBack">{{ $t("电话回访") }}</van-button>
    </div>
  </Popup>
</template>

<script setup>
import { inject, ref } from 'vue';
import Popup from './index.vue';

const isShow = ref(false);
const global = inject('global');

setTimeout(() => (isShow.value = true), 100);

function callService() {
  global.$openKefu();
  isShow.value = false;
}

function openCallBack() {
  global.$dialog({ tpl: 'HeaderCall' });
}
</script>

<style scoped lang="less">
.service-popup {
  .title {
    margin: 62px auto 40px;
    text-align: center;
    height: 40px;
    font-size: 28px;
    font-weight: 400;
    color: var(--theme-color);
    line-height: 40px;
  }

  .button-wrap {
    display: flex;
    padding: 0 30px 30px 30px;
    box-sizing: border-box;
    flex-direction: column;

    .van-button {
      width: 100%;
      margin-bottom: 30px;
    }
  }
}
</style>
