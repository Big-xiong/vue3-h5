<template>
  <div class="discount-wrap">
    <div class="discount-wrap-order">
      <van-tabs v-model:active="tabActive" @change="handlerTab" sticky swipeable color="#24c29a" :swipe-threshold="4"
        title-active-color="#24c29a">
        <van-tab v-for="(item, index) in tabList" :key="index" :title="item">
          <div class="discount-wrap-order-line"></div>
          <div class="discount-wrap-content">
            <van-list v-if="discountData?.length">
              <van-cell v-for="item in discountData" :key="item.id" @click="handleUnSign(item)">
                <van-image lazy-load fit="cover" class="img" :class="{ dark: isDark }" :key="item.h5_index_pic"
                  :src="item.h5_index_pic" />
              </van-cell>
            </van-list>
            <van-empty v-else-if="discountData" :description="$t('暂无红利')" class="empty">
              <template #image>
                <SvgIcon name="discount-empty" />
              </template>
            </van-empty>
            <div class="loading-wrap" v-else>
              <van-loading />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useDiscount, useLang } from '@/utils/hooks.js';
import { allbenefit } from '@/api/active';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const tabList = [
  global.$t('全部'),
  global.$t('VIP红利'),
  global.$t('新手红利'),
  global.$t('专题红利'),
  global.$t('常规红利'),
];

const bTypes = [0, 5, 1, 3, 2];
const { getLangForImage } = useLang();

const tabActive = ref(0);

const { handleUnSign } = useDiscount();

function handlerTab(index) {
  tabActive.value = index;
}

const { run, data: discountData, loading } = useRequest(
  () => allbenefit({ b_type: bTypes[tabActive.value] }),
  {
    formatResult(res) {
      return res.data;
    },
  },
);

watch(
  () => tabActive.value,
  () => {
    run();
  },
);

const store = inject('store');
</script>

<style lang="less" scoped>
.discount-wrap {
  width: 100%;
  display: flex;
  height: 100%;
  overflow-y: auto;
  flex: 1;

  &-order {
    order: -1;
    overflow-x: hidden;
    width: 100%;

    &-line {
      width: 100%;
      height: 20px;
      background-color: var(--dark-000, var(--bg-color-f7f7f7));
    }
  }

  &-content {
    width: 100vw;
    margin-top: 28px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.loading-wrap {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }

  :deep(.van-tabs__line) {
    width: 64px;
  }

  :deep(.van-sticky--fixed) {
    background-color: var(--bg-color-ffffff);
  }

  :deep(.van-tabs__wrap) {
    padding-left: 30px;
    border-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }

  :deep(.van-tabs__nav) {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }

  :deep(.van-tab) {
    color: var(--dark-fff, var(--font-color-999999));
  }

  :deep(.van-list) {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }

  :deep(.van-cell) {
    height: 268px;
    margin-bottom: 32px;
    padding: 0;
    width: 100%;

    .van-image {
      width: 100%;
      height: 100%;
    }
  }
}

:deep(.van-tab) {
  margin-right: 60px;
  padding: 0;
}

:deep(.van-loading__circular) {
  color: var(--theme-color);
}
</style>
