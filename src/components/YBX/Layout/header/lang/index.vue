<template>
  <van-popup
    v-model:show="visible"
    lock-scroll
    overlay
    position="top"
    @close="handleClose"
    class="lang-popup-wrap"
    overlay-class="lang-overlay"
    teleport="body"
  >
    <div class="lang-wrap" :class="{ 'has-install': app?.showDownload }">
      <div
        class="lang-wrap-item"
        v-for="(item,key) in langList"
        :key="key"
        @click="selectLang(item)"
      >
        <SvgIcon class="lang-wrap-item-logo" :name="`flag-${item.lang}`"/>
        <span>{{ item.name }}</span>
        <van-icon name="success" color="#24C29A" v-if="currentLang === item.lang" />
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import {
  ref, inject, watch,
} from 'vue';
import Cookies from 'js-cookie';
import SvgIcon from "@/components/SvgIcon.vue"
const global = inject('global');

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
});

const store = inject('store');
const { app } = store.state;

const emit = defineEmits([
  'update:visible',
  'onClose',
  'onConfirm',
]);

function close() {
  emit('update:visible', false);
}

function handleClose() {
  close();
  emit('onClose');
}

const langList = ref([
  {
    name: '中文',
    logo: 'ch',
    lang: 'zh-CN',
  },
  /* { */
  /*   name: '繁體', */
  /*   logo: 'hk', */
  /*   lang: 'zh-TW', */
  /* }, */
  {
    name: 'ENG',
    logo: 'en',
    lang: 'en',
  },
  {
    name: 'ไทย',
    logo: 'th',
    lang: 'th',
  },
  {
    name: 'Tiếng Việt',
    logo: 'vi',
    lang: 'vi',
  },
]);
const currentLang = ref(Cookies.get('lang') || 'zh-CN');

function selectLang(data) {
  emit('onConfirm', data.lang);
  currentLang.value = data.lang;
  if (data.lang === Cookies.get('lang')) return;
  global.$store.commit('app/SET_LANG', data.lang);
}

watch(() => app.lang, () => {
  currentLang.value = app.lang;
});

</script>

<style lang="less">
.lang-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 124px 0 48px 0;
  background: var(--dark-111, var(--bg-color-ffffff));
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  font-size: 24px;

  &.has-install {
    margin-top: 88px;
  }

  &-item {
    width: 100%;
    position: relative;
    margin: 0 auto 42px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 300px;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      color: var(--dark-fff, var(--font-color-222930));
    }

    &-logo {
      width: 66px;
      height: 44px;
      margin-right: 20px;
    }

    .van-icon {
      position: absolute;
      right: 22px;
    }
  }
}

.lang-popup-wrap {
  z-index: 1001 !important;
}

.lang-overlay {
  z-index: 1000 !important;
}
</style>
