<template>
  <div class="agent-home-wrap">
    <div class="banner-wrap" v-show="bannerList?.length">
      <van-swipe :autoplay="4000" class="banner bar-indicator">
        <van-swipe-item @click="goPage(item, global)" v-for="(item, index) in bannerList" :key="index">
          <van-image fit="cover" :src="item.h5_pic" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <Overview />
    <QuickEntry />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import { indexbanner } from '@/api/agent';
import Overview from './components/Overview.vue';
import QuickEntry from './components/QuickEntry.vue';
import { useLang, goPage } from '@/utils/hooks';

const global = inject('global');

const banners = ref([]);

const { run, data: bannerList } = useRequest(indexbanner);

const { getLangForImage } = useLang();

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
</script>

<style lang="less" scoped>
.banner-wrap {
  box-sizing: border-box;
  padding: 0 30px;
}

.agent-home-wrap {
  flex: 1;
  overflow-y: auto;
}

.banner {
  width: 100%;
  height: 270px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  margin: 36px auto 30px;

  :deep(.van-swipe-item) {
    .van-image {
      width: 100%;
      height: 100%;

      img {
        border-radius: 8px;

        &[lazy="loading"] {
          opacity: 0;
          max-width: 100%;
        }
      }

      .van-image__loading {
        background-size: 250px;
      }
    }
  }
}
</style>
