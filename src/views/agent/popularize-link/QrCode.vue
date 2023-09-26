<template>
  <div class="qr-code-wrap" :key="qrImage">
    <div class="qrcode-box">
      <p class="qrcode-title">{{ title }}</p>
      <p class="qrcode-domain">{{ url }}</p>

      <img v-if="!noDomain && qrImage" :src="qrImage" alt class="qrcode-img" />

      <div class="btn-wrap" v-if="!noDomain">
        <van-button type="primary" @click="emit('share', qrImage)">{{ $t("分享二维码") }}</van-button>
        <van-button
          v-clipboard:copy="url"
          v-clipboard:success="firstCopySuccess"
          v-clipboard:error="firstCopyError"
        >{{ $t("复制链接") }}</van-button>
      </div>

      <div class="no-domain" v-else>{{ $t("尚未分配专属域名") }}</div>
    </div>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import {
  defineEmits, defineProps, inject, ref, watch,
} from 'vue';
import toQrCode from 'qrcode';

const props = defineProps({
  url: String,
  title: String,
  noDomain: {
    type: Boolean,
    default: false,
  },
  qrUrl: String,
});

const emit = defineEmits(['share']);

const global = inject('global');
const qrImage = ref('');

watch(
  () => props.qrUrl,
  (url) => {
    if (url) {
      getQrImage();
    }
  },
  { immediate: true },
);

function getQrImage() {
  toQrCode.toDataURL(props.qrUrl).then((res) => {
    qrImage.value = res;
  });
}

function firstCopySuccess(e) {
  Toast({ type: 'success', message: global.$t('复制成功') });
}

function firstCopyError() {
  Toast({ type: 'fail', message: global.$t('复制失败') });
}
</script>

<style lang="less" scoped>
.qr-code-wrap {
  margin-top: 22.5px;
  width: 100%;

  .btn-wrap {
    display: flex;
    flex-direction: column;
    width: 62%;
    margin: 0 auto;

    :deep(.van-button) {
      margin-bottom: 40px;
      height: 64px;
      font-weight: normal;
    }
  }

  .qrcode-img {
    margin-top: 52.5;
    margin-bottom: 52.5px;
    // border: 14px solid var(--border-color-838383);
    border-radius: 15px;
    background: var(--bg-color-282828);
    box-shadow: 0 2px 50px 0 rgba(var(--bg-color-000), 0.2);
    width: 360px;
    height: 360px;
    border: solid 8px var(--border-color-ccc, var(--border-color-838383));
    border-radius: 14px;
  }

  .qrcode-domain {
    color: var(--theme-color);
    text-align: center;
    font-size: 28px;
    margin-top: 8px;
    margin-bottom: 40px;
  }

  .qrcode-title {
    color: var(--cur-font-color-fff, var(--dark-fff));
    text-align: center;
    font-size: 36px;
    margin: 0;
  }

  .qrcode-box {
    width: 630px;
    margin: auto;
    background: var(--dark-bg-color-191919, var(--bg-color-f5f5f5));
    border-radius: 6px;
    height: 796px;
    text-align: center;
    padding-top: 36px;
    margin-bottom: 34px;
  }

  .no-domain {
    margin-top: 280px;
    font-size: 28px;
    color: var(--cur-font-color-fff, var(--dark-fff));
  }
}
</style>
