<template>
  <div class="affiliate-wrap">
    <van-swipe :autoplay="5000" class="affiliate-wrap-contain">
      <van-swipe-item v-for="(component, index) in componentList" :key="index">
        <component :is="component" />
      </van-swipe-item>
    </van-swipe>
    <div class="btn-wrap">
      <van-button
        class="add"
        type="primary"
        @click="onAgentClick"
      >{{ agent.isLogin ? $t('代理中心') : $t('加入我们') }}</van-button>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';
import Contact from './contact.vue';
import Report from './report.vue';
import Security from './security.vue';

const store = inject('store');
const { app } = store.state;
const global = inject('global');
const $router = useRouter();
const { agent } = store.state;

const componentList = [Contact, Report, Security];
function onAgentClick() {
  if (agent.isLogin) {
    global.$router.push({ name: 'agentCenter' });
  } else {
    global.$router.push({ name: 'agentLogin' });
  }
}
</script>

<style lang='less' scoped>
.affiliate-wrap {
  background: url("@img/agent/affiliate/join_us_bg2@2x.png") top center
    no-repeat;
  background-size: 100% auto;
  &-contain {
    min-height: calc(100vh - 360px);
  }
  .btn-wrap {
    padding: 0 28px;
    .van-button {
      width: 100%;
    }
  }
  :deep(.van-swipe__indicators) {
    .van-swipe__indicator {
      background: var(--theme-color);
    }
  }
}
</style>
