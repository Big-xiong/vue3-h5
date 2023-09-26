<template>
  <div class="agent-landing-wrap">
    <van-nav-bar :safe-area-inset-top="true" :border="false" fixed>
      <template #left>
        <van-icon name="arrow-left" @click="$router.push('/')" />
      </template>
      <template #title>
        <span>{{ $t('合营伙伴计划') }}</span>
      </template>
    </van-nav-bar>
    <MainContent />
    <DataTable />
    <ExcellentAgent />
    <Commission />
    <Step />
    <Protocol />
    <Cooperate />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import MainContent from './MainContent.vue';
import DataTable from './DataTable.vue';
import ExcellentAgent from './ExcellentAgent.vue';
import Commission from './Commission.vue';
import Step from './Step.vue';
import Protocol from './Protocol.vue';
import Cooperate from './Cooperate.vue';

const router = useRouter();
const route = useRoute();

if (route.hash === '#login') {
  router.push({ name: 'agentLogin' });
} else if (route.hash === '#register') {
  router.push({ name: 'agentRegister' });
}

function goBack() {
  router.go(-1);
}
</script>

<style scoped lang="less">
.agent-landing-wrap {
  .van-icon {
    font-size: 32px;
    color: var(--font-color-ffffff);
  }

  :deep(.van-nav-bar__content) {
    background-color: var(--theme-color);
  }

  :deep(.title) {
    display: flex;
    flex-direction: column;

    .top {
      text-align: center;
      padding: 0 40px;
      height: 60px;
      font-size: 44px;
      font-weight: 500;
      color: var(--theme-color);
      line-height: 60px;
      margin: 80px auto 0;
      position: relative;

      &::after,
      &::before {
        content: "";
        display: block;
        width: 80px;
        height: 4px;
        background: var(--theme-color);
        border-radius: 4px;
        position: absolute;
        left: -80px;
        top: 28px;
      }

      &::before {
        left: auto;
        right: -80px;
      }
    }

    .down {
      margin: 30px auto 0;
      text-align: center;
      height: 40px;
      font-size: 28px;
      font-weight: 400;
      color: var(--cur-color-cccccc);
      line-height: 40px;
    }
  }
}
</style>
