<template>
  <div class="more-wrap">
    <div class="more-wrap-main">
      <div class="layout-flex-between item" @click="$router.push('/contact-us')">
        <p>{{ $t('联系我们') }}</p>
        <span>
          <van-icon name="arrow" />
        </span>
      </div>
      <div class="layout-flex-between item" @click="$router.push({ name: 'AboutUs' })">
        <p>{{ $t('关于我们') }}</p>
        <span>
          <van-icon name="arrow" />
        </span>
      </div>
      <!--
        备用域名去除： https://zentao.awgroup.dev/index.php?m=bug&f=view&bugID=17883
      -->
      <!-- <div
        class="layout-flex-between item"
        @click="backDomainJump"
      >
        <p>{{ $t('备用域名') }}</p>
        <span>
          <van-icon name="arrow" />
        </span>
      </div>-->
      <div class="layout-flex-between item">
        <p>{{ $t('永久域名') }}</p>
        <span
          v-clipboard:copy="host"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >{{ host }}</span>
      </div>
      <van-button type="primary" @click="handleLogout">{{ $t('退出登录') }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import { useDicts } from '@/utils/hooks.js';
import { getHeaders } from '@/api/app.js';

const global = inject('global');
const $store = inject('store');
const domain = ref('wanqu.com');
const host = window.location.host;
const { isMicro } = $store.state.app;

function handleLogout() {
  $store.dispatch('user/logout').then(() => {
    if (isMicro) {
      window.location.pathname = '/login';
    } else {
      getHeaders($store);
      global.$router.push('/');
    }
  });
}

function backDomainJump() {
  let url = `https://mspeed.blizzwin.com?lang=${Cookies.get('lang')}`;
  if (location.href.includes('test')) {
    url = `https://mspeed.59001.wq-test.com?lang=${Cookies.get('lang')}`;
  }
  window.open(url);
}

const siteinfo = ref({});

useDicts('siteinfo', (info) => siteinfo.value = info, { immediate: true });

function onCopy(e) {
  Toast.success(global.$t('复制成功'));
}
function onError(e) {
  Toast.fail(global.$t('复制失败，请重试'));
}
</script>

<style lang='less' scoped>
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
      font-size: 32px;
    }

    .item {
      height: 112px;
      color: var(--dark-fff, var(--font-color-000000));
      border-bottom: 2px solid var(--dark-333, var(--border-color-00001));
      p{
        font-weight: bold;
      }
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
      span {
        font-size: 28px;
        font-weight: 400;
        color: var(--font-color-929292);
      }
    }
  }
}
</style>
