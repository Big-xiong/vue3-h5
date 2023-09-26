<template>
  <div class="install-wrap">
    <van-nav-bar :title="$t('APP下载')" @click-left="$router.go(-1)" left-arrow></van-nav-bar>
    <div class="install-body">
      <van-image
        class="banner"
        :src="$getSrc(`/src/assets/images/download-banner/${getLang()}.jpg`)"
      ></van-image>

      <div class="divice-wrap">
        <SvgIcon name="ios" :class="{ active: type === 'apple' }" @click="type = 'apple'" />
        <SvgIcon name="android" :class="{ active: type === 'android' }" @click="type = 'android'" />
      </div>

      <div class="content-wrap">
        <div class="app-info">
          <van-image :src="er_pic"></van-image>
          <div class="info-wrap" v-if="type === 'apple'">
            <div class="info-title">{{ subConfig.title }} APP</div>
            <div class="info-item">{{ $t('版本') }}：{{ iosInfo.version }}</div>
            <div class="info-item">{{ $t('更新日期') }}：{{ iosInfo.update }}</div>
            <div class="info-item">{{ $t('大小') }}：{{ iosInfo.size }}</div>
          </div>
          <div class="info-wrap" v-else>
            <div class="info-title">{{ subConfig.title }} APP</div>
            <div class="info-item">{{ $t('版本') }}：{{ androidInfo.version }}</div>
            <div class="info-item">{{ $t('更新日期') }}：{{ androidInfo.update }}</div>
            <div class="info-item">{{ $t('大小') }}：{{ androidInfo.size }}</div>
          </div>
        </div>
        <div
          class="tips"
          v-if="type === 'android'"
        >{{ $t('建议使用') }}{{ $t('安卓版本6') }}{{ $t('(含)以上的系统') }}。</div>
        <div class="tips" v-else>{{ $t('建议使用') }}{{ $t('苹果版本9') }}{{ $t('(含)以上的系统') }}。</div>
        <van-button type="primary" @click="download">{{ $t('立即下载') }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, onMounted, reactive, watch, computed,
} from 'vue';
import qrcode from 'qrcode';
import Cookies from 'js-cookie';
import SvgIcon from '@/components/SvgIcon.vue';

const subConfig = inject('subConfig');

function getLang() {
  let lang = Cookies.get('lang') || 'cn';
  if (lang.includes('zh')) {
    lang = 'cn';
  }

  return lang;
}

const global = inject('global');
const isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
const type = ref(isAndroid ? 'android' : 'apple');
const $store = inject('store');
const appleLogo = computed(() => global.$getSrc(`/src/assets/images/install_apple_${type.value === 'apple' ? 's' : 'n'}.png`));
const androidLogo = computed(() => global.$getSrc(`/src/assets/images/install_android_${type.value === 'android' ? 's' : 'n'}.png`));

const { dicts } = $store.state.app;

const activeIndex = ref(isAndroid ? 1 : 0);

const iosInfo = reactive({
  version: '',
  update: '',
  size: '',
});
const androidInfo = reactive({
  vaersion: '',
  update: '',
  size: '',
});
const er_pic = ref('');
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};

onMounted(() => {
  $store.dispatch('app/getDict', 'siteinfo');
  watch(() => dicts.siteinfo, (res) => {
    iosInfo.version = res?.ios_version;
    androidInfo.version = res?.android_version;

    iosInfo.size = res?.ios_size;
    androidInfo.size = res?.android_size;

    iosInfo.update = res?.ios_update_date;
    androidInfo.update = res?.android_update_date;
  }, { immediate: true });

  const ho = window.location.host;
  let link = `https://m.${ho}.com/appDownload`;
  if (Cookies.get('agentCode')) {
    link += `${link}?id=${Cookies.get('agentCode')}`;
  }
  qrcode.toDataURL(`https://m.${ho}/appDownload`, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
});

const downloadUrl = computed(() => dicts.siteinfo?.[type.value === 'apple' ? 'ios_down_url' : 'android_down_url']);

function download() {
  if (type.value === 'apple') {
    window.open(downloadUrl.value);
  } else {
    const a = document.createElement('a');
    // const filename = 'what-you-want.txt';
    a.href = downloadUrl.value;
    // a.download = filename;
    a.click();
  }
}

</script>

<style lang="less" scoped>
.install-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  .install-body {
    padding-bottom: 30px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .banner {
    width: 750px;
    height: 400px;
  }

  .divice-wrap {
    display: flex;
    justify-content: center;
    flex: 1;
    max-height: 100px;
    align-items: center;
    .svg-icon-wrap {
      fill: var(--bg-color-bdbdbd);
      &.active {
        fill: var(--theme-color);
      }
      &:nth-child(1) {
        width: 66px;
        height: 82px;
        margin-right: 208px;
      }
      &:nth-child(2) {
        width: 70px;
        height: 82px;
      }
    }
  }

  .title {
    font-size: 40px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-0a0a0a));
    text-align: center;
  }

  .content-wrap {
    width: 688px;
    min-height: 490px;
    margin: 0 auto 0;
    opacity: 1;
    box-sizing: border-box;
    padding: 44px 0 32px;
    background: var(--dark-bg-color-191919, var(--bg-color-f2f3f4));

    .app-info {
      display: flex;
      padding-left: 54px;
      .van-image {
        margin-right: 32px;
        width: 232px;
        height: 232px;
      }
      .info-wrap {
        padding-top: 15px;
      }

      .info-title {
        font-size: 36px;
        font-weight: 700;
        color: var(--dark-fff, var(--font-color-0a0a0a));
        line-height: 54px;
        margin-bottom: 15px;
      }

      .info-item {
        font-size: 28px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-0a0a0a));
        line-height: 48px;
      }
    }
  }

  .tips {
    font-size: 28px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-929292));
    margin-top: 36px;
    text-align: center;
  }

  .van-button {
    margin: 18px auto 0;
    display: block;
    width: 240px;
    height: 88px;
  }

  :deep(.van-image) {
    .van-image__loading {
      background-size: 250px;
    }
  }
}
</style>
