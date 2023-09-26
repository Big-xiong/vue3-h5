<template>
  <div class="container">
    <van-icon name="cross" @click="$router.go(-1)"></van-icon>
    <!-- <img
      class="main-logo"
      :src="$getSrc('/src/assets/images/agent/logo@2x.png')"
      alt
    />-->
    <div class="layout-flex-center login-wrap-logo">
      <img class="logo" :src="dicts?.siteinfo?.h5_logo ?? ''" alt />
    </div>
    <!-- <img class="cooperation-logo" :src="$getSrc('/src/assets/images/agent/cooperation@2x.png')" alt/> -->
    <div class="main login-wrap-main">
      <van-tabs v-model:active="tabSelected">
        <van-tab :title="$t('代理登录')" :replace="true" name="login" to="/auth/login" class="tab-list"></van-tab>
        <van-tab
          name="register"
          :title="$t('代理注册')"
          :replace="true"
          to="/auth/register"
          class="tab-list"
        ></van-tab>
      </van-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { computed, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login, register } from '@/api/agent';

const route = useRoute();
// const tabSelected = ref(route.name === 'agentLogin' ? 'login' : 'register');
const tabSelected = computed(() => {
  console.log(route.name);
  if (route.name === 'agentLogin') {
    return 'login';
  }
  return 'register';
});

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;

const title = computed(() => {
  if (route.name === 'agentLogin') {
    return global.$t('代理登录');
  }
  return global.$t('代理注册');
});
</script>

<style lang="less" scoped>
.container {
  background-color: var(--bg-color-0f3256);
  min-height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  > .van-icon-cross {
    color: var(--font-color-ffffff);
    position: absolute;
    left: 30px;
    top: 30px;
    font-size: 44px;
  }

  .login-wrap-logo {
    flex: 0 0 474px;
    text-align: center;
    background-color: var(--bg-color-f7f7f7);
    box-sizing: border-box;

    .logo {
      width: 300px;
      margin: 0 auto;
    }
  }

  .main {
    flex: 1 0 auto;
    padding: 0;
    overflow: hidden;
    width: 100%;
    background: var(--bg-color-173253);
    .van-tabs {
      // background-color: var(--cur-color-191919);
      border-radius: 0;
    }
    :deep(.block-label) {
      padding-bottom: 0;
    }
    :deep(.van-tabs__wrap) {
      height: 120px;
      border-bottom: 2px solid var(--border-color-323232);
      background-color: var(--bg-color-0f3256);
      border-radius: 20px 20px 0 0;
      box-sizing: border-box;
      overflow: hidden;

      .van-tab {
        flex: 1;
        margin-right: 0;
        font-size: 32px;
      }

      .van-tab--active {
        color: var(--theme-color);
        font-size: 36px;
      }
    }
  }

  .main-logo {
    margin: 120px auto 0 auto;
    width: 262px;
  }

  .cooperation-logo {
    margin: 40px auto 0 auto;
    width: 428px;
  }
}
</style>
