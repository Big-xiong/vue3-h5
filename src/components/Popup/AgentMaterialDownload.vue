<template>
  <div class="material-save-photo">
    <Popup
      v-model:show="isShow"
      position="center"
      :show-cancel-btn="false"
      @clickCloseIcon="isShow = false"
    >
      <div class="material-save-photo-top" id="edit-region">
        <van-image :src="url" alt />
        <div v-if="qrcodeUrl && domainUrl" class="qrcode-url">
          <van-image :src="qrcodeUrl" alt />
        </div>
      </div>
      <input type="text" v-model="domainUrl" :placeholder="$t('输入二维码URL')" />
      <van-button type="white-text" class="download-btn" @click="downloadImage()">{{ $t("保存到相册") }}</van-button>
    </Popup>
  </div>
</template>

<script setup>
import {
  inject, ref, defineProps, watch,
} from 'vue';
import QRCode from 'qrcode';
import domtoimage from 'dom-to-image';
import { Toast } from 'vant';
import Popup from './index.vue';

const global = inject('global');
const isShow = ref(true);
const domainUrl = ref('');

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});

const qrcodeUrl = ref('');

watch(() => domainUrl.value, async (val) => {
  if (val) {
    qrcodeUrl.value = await QRCode.toDataURL(val, {
      margin: 0,
      color: {
        dark: '#fff',
        light: '#000',
      },
    });
  }
});
function downloadImage() {
  const ele = document.getElementById('edit-region');
  domtoimage.toJpeg(ele, { quality: 0.95, cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${new Date().getTime()}.jpeg`;
      link.href = dataUrl;
      link.click();
      isShow.value = false;
      Toast.success(global.$t('保存成功'));
    })
    .catch((err) => console.error(err));
}
</script>

<style scoped lang="less">
.material-save-photo {
  :deep(.van-popup) {
    width: 675px;
    text-align: center;
    padding: 37.5px 30px 52.5px;
    box-sizing: border-box;
  }

  .material-save-photo-top {
    position: relative;
    .qrcode-url {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 15px;
      box-sizing: border-box;
      background: var(--bg-color-white, var(--font-color-fff));
    }
  }
  img {
    width: 90%;
  }

  input {
    width: 100%;
    margin-top: 22.5px;
    margin-bottom: 30px;
    background: none;
    padding-left: 30px;
    border: 1px solid var(--border-color-00002);
    color: var(--font-color-000000);
    font-size: 28px;
    border-radius: 4px;
    height: 88px;
    font-weight: 400;
    box-sizing: border-box;
  }

  .download-btn {
    width: 100%;
  }
}
</style>
