<template>
  <LevelUp :level="1" v-if="isShowLevelUp" @close="isShowLevelUp = false" />
  <Notice
    v-model:show="showNotice"
    :type="noticeType"
    :title="noticeTitle"
    :message="noticeMessage"
  />
</template>

<script setup>
import {
  inject, reactive, ref, onMounted, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { Notify, Toast } from 'vant';
import LevelUp from '@/components/Dialog/LevelUp.vue';
import { memberupdatetips, readmessage } from '@/api/center';
import Notice from '@/components/Popup/Notice.vue';
// import { getNoticeMessageType } from '@/utils';

const isShowLevelUp = ref(false);
const showNotice = ref(false);
const global = inject('global');
const $store = inject('store');
const { app: { dicts }, user } = $store.state;
const levelUpVisible = ref(false);

const level = ref(1);
const updatetips = ref(null);
const timeout2 = ref(8 * 1000);
const timeout = ref(10 * 1000);
// const globalAlertMaps = getNoticeMessageType(global);

const globalAlertMaps = inject('getNoticeMessageType');

function onClose() {
  levelUpVisible.value = false;
  updatetips.value && updatetips.value.id && readmessage({
    id: updatetips.value.id,
  }).then(() => {
  });
}

const noticeType = ref('');
const noticeTitle = ref('');
const noticeMessage = ref('');
const route = useRoute();

const { run: readNotice } = useRequest(
  (params) => readmessage(params),
  {
    manual: true,
  },
);

const { run: getTips, cancel } = useRequest(() => memberupdatetips(), {
  manual: true,
  pollingInterval: timeout.value,
  onSuccess(res) {
    if (updatetips.value?.id === res?.id) {
      return;
    }

    updatetips.value = res;
    if (!res || res.switch) {
      return;
    }
    const { type, content } = res;
    // VIP升级提示
    if (type === 9) {
      const watchHandler = watch(() => user.userInfo, () => {
        if (route.name === 'home') {
          isShowLevelUp.value = true;
        }
        watchHandler();
      }, { deep: true });
      $store.dispatch('user/getUserInfo');
    } else {
      let notifyType = 'success';
      if ([4, 6, 11, 18].indexOf(type) !== -1) {
        notifyType = 'error';
      }
      // 资金相关的，需要调用钱包接口
      if ([3, 5, 7, 13, 16].indexOf(type) !== -1) {
        global.$store.dispatch('user/getWalletInfo');
      }
      // // 资料相关的需要调用个人信息接口
      // if ([3, 5, 7, 13, 16].indexOf(type) !== -1) {
      //   this.getWallet()
      // }
      if ((type === 20 && !isGameAlert) || type !== 20) {
        if (res?.content.includes('红包雨')) {
          noticeTitle.value = `${globalAlertMaps[type]}${global.$t('提示')}`;
          noticeMessage.value = content;
          noticeType.value = notifyType;
          showNotice.value = true;
          /* Notify({ */
          /*   type: `${globalAlertMaps[type]}${global.$t('提示')}`, */
          /*   message: content, */
          /*   duration: 0, */
          /* }); */
          // global.$notify({
          //   title: `${globalAlertMaps[type]}提示`,
          //   dangerouslyUseHTMLString: true,
          //   message: content,
          //   duration: timeout2.value,
          //   type: notifyType,
          //   onClose: () => {
          //     onClose();
          //     if (type === 20) {
          //       window.sessionStorage.setItem('wanquGameAlert', type);
          //     }
          //   },
          // });
        }
      }
      // global.$store.dispatch('user/getUserInfo');
    }
    $store.dispatch('user/getUserInfo');
  },
});

watch(() => isShowLevelUp.value, (val) => {
  if (!val && updatetips.value?.id) {
    readNotice({ id: updatetips.value.id });
  }
});

watch(() => showNotice.value, (val) => {
  if (!val && updatetips.value?.id) {
    readNotice({ id: updatetips.value.id });
  }
});

onMounted(() => {
  if (user.isLogin) {
    getTips();
  }
});
</script>
