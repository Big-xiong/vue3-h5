<template>
  <van-dialog close-on-popstate show-cancel-button close-on-click-overlay :confirmButtonText="$t('登录/注册')"
    :cancelButtonText="$t('查看新手教程')" v-model:show="isShow"
    :message="`${$t('为了您更好的体验')}${subConfig.title || siteinfo.title}${$t('游戏，建议您登录后进行游戏')}`" v-bind="$attrs"
    @close="attrs.close" class="login-dialog-wrap">
    <template #title>
      <div class="title-wrap">
        {{ $t('未登录提醒') }}
        <van-icon name="cross" @click="attrs.close" />
      </div>
    </template>
    <template #footer>
      <div class="footer-wrap layout-flex-center" :class="[lang]">
        <van-button type="default" @click="goView('/help')">{{ $t('新手教程') }}</van-button>
        <div class="button van-button--success van-button--normal" @click="goView('/login')">
          <span @click.stop="goView('/login');">{{ $t('登录') }} <em>/</em> {{ $t('注册') }}</span>
        </div>
      </div>
    </template>
  </van-dialog>
</template>

<script setup>
import Cookies from 'js-cookie';
import { useDicts } from '@/utils/hooks.js';

const subConfig = inject('subConfig');

const global = inject('global');
const lang = Cookies.get('lang');
// import Dialog from './index.vue';
const siteinfo = ref({});
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  confirm: {
    type: Function,
  },
});

useDicts('siteinfo', (info) => siteinfo.value = info, { immediate: true });

watch(props.isShow, (val) => {
  if (!val) {
    props.confirm?.();
  }
});

const router = useRouter();
const attrs = useAttrs();
function goView(url) {
  attrs.close();
  router.push(url);
}

</script>

<style lang="less">
.login-dialog-wrap {
  width: 630px !important;
  overflow: hidden !important;

  .van-dialog__header {
    border-bottom: none;
  }

  .van-dialog__content {
    padding-bottom: 0;
    padding-top: 10px;

    .van-dialog__message {
      font-size: 28px;
      overflow-x: hidden !important;
      color: var(--dark-fff, var(--font-color-666666)) !important;
    }
  }

  .van-dialog__footer {
    padding-bottom: 20px;
  }

  .van-dialog__cancel {
    color: var(--dark-fff, var(--font-color-222930)) !important;
    background-color: var(--bg-color-353435) !important;
    border: none !important;
  }

  .van-icon {
    position: absolute;
    right: 30px;
    top: 20px;
  }

  .van-button {
    width: 42%;
    height: 80px;
    border-radius: 8px;
    font-size: 30px;
    font-weight: 400;
  }

  .van-button--success {
    background-color: var(--bg-color-24c29a);
    margin-left: 30px;
    color: var(--font-color-ffffff);
    display: flex;
    justify-content: center;

    em {
      margin: 0 15px 0 10px;
    }
  }

  .van-button--default {
    color: var(--dark-666, var(--font-color-bbbbbb));
    border: 2px solid var(--dark-666, var(--font-color-bbbbbb));
    background-color: var(--dark-transparent);
  }

  .title-wrap {
    font-size: 36px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-333333));
  }

  .footer-wrap {
    width: 100%;
    padding-bottom: 40px;

    .button {
      min-width: 42%;
      height: 80px;
      line-height: 80px;
      border-radius: 8px;
      font-size: 30px;
      font-weight: 400;
      box-sizing: border-box;
      text-align: center;
    }

    &.vi,
    &.th {
      display: flex;
      flex-direction: column;

      .button,
      .van-button {
        white-space: nowrap;
        width: 570px !important;
        margin: 0;
      }

      .button {
        margin-top: 30px;
      }
    }
  }
}
</style>
