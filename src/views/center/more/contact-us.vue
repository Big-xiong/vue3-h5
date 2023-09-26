<template>
  <div class="more-wrap">
    <div class="more-wrap-main">
      <div class="item" v-for="(item,i) in contact" :key="i" @click="go(item.link)">
        <div class="title-box">
          <div class="line"></div>
          <span>{{ item?.param_name }}</span>
        </div>
        <span>{{ item?.param_value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useDicts } from '@/utils/hooks';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;

const contact = ref([
  {
    title: global.$t('客服邮箱'),
    content: 'aawanqu@gmail.com',
  },
  {
    title: 'SKYPE', content: '',
  },
  {
    title: global.$t('帮助'),
    content: '',
  },
  {
    title: global.$t('合营伙伴联系方式'),
    content: '',
  },
]);

function go(link) {
  window.open(link, 'contact');
}

useDicts('siteinfo', (info) => {
  contact.value = JSON.parse(info.extend_params);
}, { immediate: true });

</script>

<style lang="less" scoped>
:deep(.van-row) {
  padding-left: 70px;
  margin-bottom: 20px;
  color: var(--dark-fff-06, #000);
}
.more-wrap {
  &-main {
    padding: 20px 30px;

    .van-button {
      width: 100%;
      margin-top: 30px;
      height: 100px;
      background: var(--bg-color-24c29a);
      border-radius: 8px;
      border: none;
    }

    > .title-box {
      padding-left: 24px;
    }

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 140px;
      color: var(--font-color-fff);
      border-bottom: 2px solid var(--border-color-00001);
      span {
        font-size: 28px;
        font-weight: 400;
        color: var(--dark-fff-06, var(--font-color-929292));
        line-height: 50px;
      }
      > span {
        margin-left: 24px;
      }
    }
    .title-box {
      display: flex;
      align-items: center;
      .line {
        width: 4px;
        height: 28px;
        background: var(--bg-color-24c29a);
        border-radius: 2px;
        margin-right: 20px;
      }
      span {
        font-size: 32px;
        font-weight: 600;
        color: var(--dark-fff, var(--font-color-333333));
      }
    }
    .mgt {
      margin-top: 40px;
      padding-left: 0;
    }
    .num {
      margin: 24px 0 20px 0;
      img {
        width: 44px;
        height: 44px;
        margin-right: 10px;
      }
    }
  }
}
</style>
