<template>
  <div class="save-qr-code-wrap">
    <van-popup
      round
      :show="show"
      close-on-click-overlay
      @close="emit('close')"
      @click="emit('close')"
    >
      <div class="save-qr-code-body">
        <div class="container">
          <div
            :key="key"
            v-for="(item, key) in contactInfo"
            class="c-box"
            v-show="item.is_bind === 1"
          >
            <img :src="$getSrc(`/src/assets/images/agent/${key}.png`)" alt />
            <span class="name">{{ formatText(key) }}:&nbsp;</span>
            <span class="content">{{ item.account }}</span>
          </div>
          <div class="image-wrap" :style="{ backgroundImage: `url(${qrImage})` }"></div>
        </div>
        <van-button type="primary" @click="emit('download', '.save-qr-code-body')">{{ $t('保存到相册') }}</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import {
  computed, defineEmits, defineProps, inject,
} from 'vue';
import { useContact } from '@/utils/hooks.js';

const global = inject('global');
const subConfig = inject('subConfig');

defineProps({
  show: Boolean,
  qrImage: {
    type: String,
    default: '',
  },
  downloadImage: {
    type: Function,
    default: () => { },
  },
});

const store = inject('store');
const { agent } = store.state;
const emit = defineEmits(['close', 'download']);

const userInfo = computed(() => agent.userInfo);

const { contactInfo } = useContact(userInfo, subConfig.contactConfig);

function formatText(name) {
  switch (name) {
    case 'qq':
      return 'QQ';
    case 'wechat':
      return '微信';
  }
  return name;
}
</script>

<style lang="less" scoped>
.save-qr-code-wrap {
  :deep(.van-popup) {
    width: 100vw;
    height: 100vh;
    background-color: transparent;
  }

  .save-qr-code-body {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;

    .container {
      width: 630px;
      text-align: center;
      background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
      border-radius: 20px;
      .image-wrap {
        width: 236px;
        height: 236px;
        margin: 50px auto;
        border-radius: 16px;
        background-size: cover;
        border: solid 5px var(--border-color-ccc, var(--font-color-9a9a9a));
      }

      img {
        width: 50%;
        border-radius: 20px;
        margin-top: 40px;
      }

      .c-box {
        max-width: 90%;
        min-width: 400px;
        min-height: 60px;
        align-items: center;
        opacity: 1;
        background: var(--cur-color-c-box, var(--bg-color-e9e9e9));
        border-radius: 18px;
        display: inline-flex;
        margin: 20px auto 0;
        padding: 0 46px;
        box-sizing: border-box;
        white-space: nowrap;

        img {
          width: 36px;
          margin-top: 0;
        }

        span {
          font-size: 30px !important;
        }

        .name {
          color: var(--font-color-222930);
          text-transform: capitalize;
          font-weight: normal;
          white-space: nowrap;
          margin-left: 20px;
        }

        .content {
          color: var(--font-color-222930);
          max-width: 50%;
          white-space: pre-wrap;
          font-weight: 500;
        }
      }
    }
    :deep(.van-button) {
      width: 630px;
      height: 100px;
    }
  }
}

.icon-activityweixin {
  color: #0db807;
}

.icon-activityQQhaoma {
  color: #18acfc;
}

.icon-activitySkype {
  color: #00aff0;
}
</style>
