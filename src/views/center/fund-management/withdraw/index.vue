<template>
  <div class="widthdraw-wrap">
    <div class="switcher-wrap" v-show="withDrawLimitInfo?.dig_withdraw_status === 1">
      <div class="switch-item" :class="{ active: method === 'card' }" @click="method = 'card'">{{ $t('银行卡') }}</div>
      <div class="switch-item" :class="{ active: method === 'digital' }" @click="method = 'digital'">
        {{ $t('数字货币') }}
        <van-image class="lightning-icon" :src="$getSrc('/src/assets/images/icon/lightning.png')" />
      </div>
    </div>
    <Bank :currencyType="1" v-show="method === 'card'" :siteinfo="dicts?.siteinfo ?? null"
      :withDrawLimitInfo="withDrawLimitInfo ?? null" />
    <Digital :currencyType="2" v-show="method === 'digital'" :siteinfo="dicts?.siteinfo ?? null"
      :with-draw-limit-info="withDrawLimitInfo" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { withdrawlimitinfo } from '@/api/center';
import Bank from './components/Bank.vue';
import Digital from './components/Digital.vue';

const route = useRouter();
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;
const method = ref('card');

const { data: withDrawLimitInfo } = useRequest(withdrawlimitinfo);

if (route.currentRoute.value.query.param) {
  method.value = 'digital';
}

</script>

<style lang="less" scoped>
.widthdraw-wrap {
  padding: 0 30px;
  overflow-x: hidden;

  .switcher-wrap {
    position: relative;
    margin-top: 20px;
    height: 77px;
    width: 690px;

    .switch-item {
      width: 344px;
      height: 77px;
      border-radius: 16px;
      background-color: var(--dark-333, var(--switch-bg-color-f1f1f1));
      color: var(--font-color-fff-4, var(--font-color-999999));
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;

      .lightning-icon {
        font-style: normal;
        position: absolute;
        top: -6px;
        right: 20px;
        width: 44px;
      }

      &:nth-child(1) {
        left: 15px;
      }

      &:nth-child(2) {
        right: 15px;
      }

      &.active {
        z-index: 2;
        color: var(--font-color-ffffff);
        background-color: var(--theme-color);
      }
    }
  }

  :deep(.van-tabs__wrap) {
    height: 72px;

    .van-tabs__nav {
      margin: 0;
      height: 100%;
      border: 0;
      padding: 0;
    }
  }
}
</style>
