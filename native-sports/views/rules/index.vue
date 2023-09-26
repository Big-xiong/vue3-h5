<template>
  <div class="sport-rules-wrap">
    <van-nav-bar :title="$t('规则条款')" :border="false" left-arrow @click-left="$router.back()" />
    <van-tabs v-model:active="active" @click-tab="handleClick">
      <van-tab v-for="(tab, t_i) in navMap" :key="t_i">
        <template #title>{{ tab }}</template>
        <div class="tab-wrap">
          <Rang v-if="active === 0" />
          <Big v-else-if="active === 1" />
          <Regular v-else-if="active === 2" />
        </div>
      </van-tab>
    </van-tabs>
    <!-- <ul>
      <li class="sport-card-wrap" v-for="(item, i) in siteNoticeList" :key="i"
        @click="router.push({ name: 'sport-notice-detail', params: { id: 1 }, query: item })">
        <div class="notice-wrap-top">
          <h4>
            <i v-show="item.is_read !== 1" />{{ item.title }}
          </h4>
          <date>{{ item.publish_time }}</date>
        </div>
        <content>{{ item.content }}</content>
      </li>
    </ul>-->
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import Big from './components/Big.vue';
import Rang from './components/Rang.vue';
import Regular from './components/Regular.vue';

const { t } = useI18n();
const active = ref(0);
const navMap = [t('让球'), t('大小球'), t('条款')];

function handleClick() {
  console.log(active.value);
}
</script>

<style lang="less" scoped>
.sport-rules-wrap {
  background-color: var(--card-bg-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  :deep(.van-tabs) {
    flex: 1;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    .van-tabs__content {
      overflow-y: auto;
      flex: 1;
      border-top: 20px solid
        var(--dark-bg-color-18171D, var(--border-color-F9F9F9));
    }
    .van-tab__panel {
      padding: 0 42px;
      h4 {
        font-size: 32px;
        color: var(--dark-fff);
        margin-bottom: 12px;
      }
      content {
        text-align: justify;
        font-size: 28px;
        color: var(--dark-fff);
        padding-bottom: 60px;
      }
    }
    .van-tab {
      font-size: 28px;
    }
    .van-tab--active {
      span {
        color: var(--theme-color);
      }
    }
    .van-tabs__line {
      background-color: var(--theme-color) !important;
    }
  }
}
</style>
