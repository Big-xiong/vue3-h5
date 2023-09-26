<template>
  <div class="header-wrap layout-flex-between" :class="{ 'no-download': !app.showDownload }">
    <div class="inner-wrap">
      <div class="download-wrap" v-if="app.showDownload">
        <van-icon name="cross" @click.stop="closeDownload"></van-icon>
        <img
          class="logo_insta"
          :src="$getSrc('/src/current_project/assets/images/home/logo_instal@2x.png')"
        />
        <div class="download-wrap-desc">
          <h3>{{ $t(`${subConfig.title}全站APP`) }}</h3>
          <span class="text">{{ $t('真人娱乐，体育投注，电子游艺等尽在一手掌握') }}</span>
        </div>
        <div class="download-btn" @click="$router.push({ name: 'appDownload' })">{{ $t('立即下载') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
} from 'vue';

const store = inject('store');
const subConfig = inject('subConfig');
const { app } = store.state;
function closeDownload() {
  store.commit('app/SET_SHOW_DOWNLOAD', false);
}
</script>

<style lang="less" scoped>
.inner-wrap {
  width: 100%;
}
.download-wrap {
  display: flex;
  align-items: center;
  background-color: var(--bg-color-afafaf);
  height: 100px;
  padding: 0 28px;
  box-sizing: border-box;
  width: 100%;
  color: var(--font-color-fff);
  font-size: 24px;
  bottom: var(--van-tabbar-height);
  justify-content: space-between;
  // border-bottom: 4px solid var(--border-color-d8d8d8);
  .van-icon {
    font-size: 36px;
    margin-right: 16px;
  }
  .logo_insta {
    width: 76px;
    margin-right: 20px;
  }

  span {
    white-space: nowrap;
  }

  .text {
    white-space: pre-wrap;
    margin-right: auto;
  }
  &-desc {
    margin-right: 10px;
    h3 {
      color: var(--font-color-333);
      margin: 0 0 3px 0;
      font-size: 28px;
    }
    .text {
      font-size: 24px;
    }
  }
  .download-btn {
    width: 160px;
    height: 52px;
    line-height: 52px;
    // background: var(--theme-color);
    background: var(--btn-gradient-color);
    border-radius: 26px;
    font-weight: 500;
    font-size: 24px;
    text-align: center;
  }
}
</style>
