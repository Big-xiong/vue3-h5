<template>
  <div></div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { runPop } from '@/utils/sitenotice.js';
import IndexPop from '@/components/Dialog/IndexPop.vue';
import SiteNotice from '@/components/Dialog/SiteNotice.vue';

import { indexpop } from '@/api/news';
import { sitenotice } from '@/api/center';
import { useDicts } from '@/utils/hooks';

const isShowNotice = ref(false);

const $router = useRouter();
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

const popData = reactive({
  name: '',
  h5_pop_pic: '',
  url: '',
});

// const notice = reactive([]);
let timer = null;
let isOpen = false;
let isImageOpen = false;
const noticeArray = ref([]);
const imageArray = ref([]);

const route = useRoute();

function showImageNotice(imageNotice) {
  isImageOpen = true;
  global.$dialog({
    tpl: 'SiteImageNotice',
    notice: imageNotice,
    callback() {
      isImageOpen = false;
    },
  });
}

function showNotice(notice) {
  isOpen = true;
  global.$dialog({
    tpl: 'SiteNotice',
    notice,
    callback() {
      isOpen = false;
      if (imageArray.value.length) {
        runPop(imageArray.value, (data) => {
          if (data.length && route.name === 'home') {
            isImageOpen = true;
            showImageNotice(data[0]);
          }
        });
      }
    },
  });
}

function showPop() {
  global.$dialog({
    tpl: 'IndexPop',
    popData,
  });
}

function loadIndexPop() {
  indexpop()
    .then((data) => {
      if (data) {
        popData.name = data.name;
        popData.h5_pop_pic = data.h5_pop_pic;
        popData.url = data.url;
      }
      if (
        !window.sessionStorage.getItem('pop_status')
        && popData.h5_pop_pic
      ) {
        showPop();
      }

      // else if (
      //   Boolean(window.sessionStorage.getItem('pop_status'))
      //     && popData.pc_pop_pic
      // ) {
      //   show.value = false;
      // }
    });
}

function getSiteNotice() {
  const params = {};
  if ($store.state.user.isLogin) {
    params.uid = $store.state.user.userInfo.id;
  }
  sitenotice(params)
    .then((data) => {
      if (data.data.length > 0) {
        noticeArray.value = data.data.filter((item) => item.title.toLowerCase() !== 'image-type');
        imageArray.value = data.data
          .filter((item) => item.title.toLowerCase() === 'image-type')
          .sort((a, b) => {
            const aTime = a.publish_time || a.updated_at || a.created_at;
            const bTime = b.publish_time || b.updated_at || b.created_at;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
        noticeArray.value.sort((a, b) => dayjs(b.publish_time) - dayjs(a.publish_time));

        // 存入store 供公告界面使用
        $store.dispatch('app/updateSiteNotice', noticeArray.value);
      }
      if (noticeArray.value.length > 0) {
        runPop(noticeArray.value, (noticeData) => {
          if (noticeData.length && route.name === 'home') {
            showNotice(noticeData);
          }
        });
      } else if (imageArray.value.length > 0) {
        if (route.name === 'home' && !isImageOpen) {
          runPop(imageArray.value, (imageData) => {
            if (imageData.length) {
              showImageNotice(imageData[0]);
            }
          });
        }
      }
    });
}

function listen() {
  timer = setInterval(() => {
    if (isOpen) {
      return;
    }
    getSiteNotice();
  }, 15000); // 15000
}

const noticeShow = ref(0);

useDicts('siteinfo', (info) => {
  noticeShow.value = Number(info.notice_show);
  // noticeShow.value = 1;
}, { immediate: true });

watch(() => noticeShow.value, () => {
  if (!user.gottenUserInfo) {
    return;
  }

  const { isLogin } = $store.state.user;

  if (noticeShow.value === 1 && !isLogin) {
    listen();
    getSiteNotice();
  } else if (noticeShow.value === 2 && isLogin) {
    listen();
    getSiteNotice();
  }
});

watch(() => user.isLogin, () => {
  if (noticeShow.value === 2 && user.isLogin) {
    getSiteNotice();
  }
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="less" scoped>
</style>
