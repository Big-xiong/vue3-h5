<template>
  <div class="notice" @click="noticeView">
    <van-icon name="volume-o" />
    <!-- <span class="notice-title">{{ $t(`公告`) }}</span> -->
    <van-swipe
      v-if="lists.length"
      :autoplay="4000"
      vertical
      @change="onChange"
      :show-indicators="false"
    >
      <van-swipe-item v-for="(item, index) in lists" :key="index">{{ item.content }}</van-swipe-item>
    </van-swipe>
    <a class="action">
      {{ $t('查看') }}
      <van-icon name="arrow" />
    </a>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { inject, ref, watchEffect } from 'vue';
import { sitenotice } from '@/api/news';

const lists = ref([]);
const selected = ref(null);
const global = inject('global');
const $router = useRouter();

const { run: getList } = useRequest(
  sitenotice,
  {
    manual: false,
    onSuccess(res) {
      lists.value = res.data;
      onChange(0);
    },
  },
);
function noticeView() {
  global.$store.commit('app/SET_NOTICE_DATA', selected.value);
  $router.push({
    name: 'Details',
    query: {
      id: selected.value.id,
      type: 'notice',
      is_read: selected.value.is_read,
    },
  });
}
function onChange(index) {
  selected.value = lists.value[index];
}
watchEffect(() => {
  if (lists.value.length <= 0) {
    getList();
  }
});
</script>

<style lang="less" scoped>

.notice {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 28px;
  line-height: 50px;
  color: var(--cur-color-666666);
  background: var(--bg-color-white);
  border-radius: 0;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 22px;
  margin-top: 10px;
  :deep(.van-icon) {
    color: var(--theme-color);
  }
  .van-swipe {
    width: 100%;
    height: 50px;
    margin: 0 15px;
    :deep(.van-swipe-item) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  a {
    position: relative;
    display: flex;
    white-space: nowrap;
    align-items: center;
    padding-left: 15px;
    .van-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    &:before {
      content: "";
      width: 2px;
      height: 28px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--theme-color);
    }
  }
}
</style>
