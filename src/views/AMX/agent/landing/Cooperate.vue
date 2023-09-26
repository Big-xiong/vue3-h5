<template>
  <div class="agent-cooperate">
    <div class="agent-cooperate-list">
      <div v-for="(list, index) in siteInfo.business_cooperation" :key="index">
        <van-image :src="list.icon" fit="contain" />
        <p>{{ list.name }}:{{ list.contact }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';

const global = inject('global');
const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo']);
const { dicts } = $store.state.app;
const siteInfo = ref({});

watch(
  () => dicts.siteinfo,
  (info) => {
    siteInfo.value = info;
  },
);

const cooperateData = reactive([
  {
    pic: '/src/assets/images/landing/skype.png',
    name: 'Skype:198681681@qq.com',
  },
  {
    pic: '/src/assets/images/landing/telegram.png',
    name: 'Telegram:@wanqudaili',
  },
  {
    pic: '/src/assets/images/landing/whatsApp.png',
    name: 'WhatsApp:13218765428',
  },
  {
    pic: '/src/assets/images/landing/qqimg.png',
    name: 'QQ:198681681',
  },
  {
    pic: '/src/assets/images/landing/wechat.png',
    name: global.$t('微信:AAwanqu'),
  },
  {
    pic: '/src/assets/images/landing/dianhua.png',
    name: global.$t('手机号：1231232332'),
  },
]);
</script>

<style scoped lang="less">
.agent-cooperate {
  width: 100%;
  margin-top: 60px;
  background: var(--bg-color-1d395d);

  .agent-cooperate-list {
    text-align: center;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    > div {
      height: 224px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 50%;
      padding-top: 60px;
    }

    :deep(.van-image) {
      width: 60px;
      height: 60px;
      margin-bottom: 30px;
    }

    p {
      margin: 0;
      font-size: 24px;
      font-weight: 400;
      color: var(--font-color-000);
      line-height: 44px;
      word-break: break-all;
    }
  }
}
</style>
