<template>
  <div ref="seoProtocolRef" class="seo-protocol">
    <van-collapse v-model="openSeoProtocol">
      <van-collapse-item :title="$t('关于我们')" name="1">
        <div v-html="textData" />
      </van-collapse-item>
    </van-collapse>
  </div>
  <teleport :to="$store.state.app.teleportContainer">
    <van-button
      :style="{ display: seoProtocolInView ? 'flex' : 'none' }"
      round
      type="primary"
      class="go-top"
      icon="arrow-up"
      @click="goTop"
    />
  </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRequest, useInViewport } from 'ahooks-vue';
import { getSeoProtocol } from '@/utils/importFiles';

const seoProtocolRef = ref(null);
const seoProtocolInView = useInViewport(seoProtocolRef);

const openSeoProtocol = ref(['1']);
const { data: textData } = useRequest(getSeoProtocol);

function goTop() {
  document.querySelector('.home-wrap').scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style lang="less" scoped>
.seo-protocol {
  :deep(.van-cell__title) {
    color: var(--dark-fff);
  }
  :deep(.van-hairline--top-bottom) {
    &::after {
      display: none !important;
    }
  }
  :deep(.van-collapse-item__content) {
    background: var(--dark-bg-color);
  }
}
.go-top {
  position: fixed;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  left: calc(100% - 100px);
  bottom: 200px;
  font-size: 35px;
  padding: 0;
  display: none;
  align-items: center;
  justify-content: center;
  :deep(.van-button__content) {
    &:before {
      display: none;
    }
  }
}
</style>
