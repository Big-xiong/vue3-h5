<template>
  <div class="site-notice-wrap">
    <Dialog
      class="notice-wrap"
      :show-confirm-button="false"
      :show-cancel-button="false"
      title
      :show="true"
    >
      <div class="dialog-content-wrap">
        <div
          class="title-wrap"
          :style="{ 'background-image': `url(${$getSrc('/src/assets/images/notice-header.png')})` }"
        >
          <div class="icon"></div>
          <div class="close" @click="handleClose"></div>
          {{ $t(`重要公告`) }}
        </div>
        <!-- <div v-if="notice && notice.length === 1" style="height:230px">
            <div v-for="item in notice" :key="item.id">
              <div class="content">
                <div class="content-item" @click="readNotice(item)">
                  <div class="content-title">{{ item.title }}</div>
                  <p class="content-desc">{{ item.content }}</p>
                </div>
              </div>
            </div>
        </div>-->
        <van-swipe :autoplay="3000" class="my-swipe">
          <van-swipe-item v-for="item in notice" :key="item.id">
            <div class="content">
              <div class="diamond"></div>
              <div class="content-item" @click="readNotice(item)">
                <div class="content-title">{{ item.title }}</div>
                <p class="content-desc">{{ item.content }}</p>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div class="content-btn">
          <van-button type="primary" @click="handleClose" class="but">
            {{ `${$t('确认')}` }}（
            <em>{{ `${seconds}s` }}</em> ）
          </van-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {
  defineEmits, inject, reactive, ref, watch, onMounted, onUnmounted, watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import Dialog from './index.vue';

// const dialogRef = ref();

const seconds = ref(0);
let closeTimer = 0;
const global = inject('global');
const props = defineProps({
  notice: {
    type: Array,
    default: () => ([
      {
        title: inject('$t')('IM体育虚拟体育维护通知'),
        content: inject('$t')('尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…'),
      },
    ]),
  },
  callback: Function,
  unmount: Function,
});

// const notice = ref([
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
//   {
//     title: 'IM体育虚拟体育维护通知',
//     content: '尊敬的会员:您好IM虚拟体育游戏于2021年4月29日13: 00-16:00进行维护，在此期间将无法进入游戏，给您带来不便还望您谅解…',
//   },
// ]);

const isShowPopup = ref(true);
const $router = useRouter();

const emit = defineEmits(['update:modelValue', 'onClose']);

function handleClose() {
  // emit('onClose');
  // emit('update:modelValue', false);
  // isShowPopup.value = false;
  clearInterval(closeTimer);
  props.callback?.();
  props.unmount();
  // dialogRef.value.handleCancel();
}

function readNotice(item) {
  $router.push({ name: 'notice' });
  // if (!user?.isLogin) {
  //   Toast.fail(global.$t('请登录后查看'));
  //   return;
  // }
  // handleClose();
  handleClose();
  // dialogRef.value.handleCancel();
}

// function handleEnter() {
//   clearInterval(closeTimer);
// }
// function handleLeave() {
//   startCloseTimer();
// }

function startCloseTimer() {
  closeTimer = setInterval(() => {
    if (seconds.value <= 0) {
      clearInterval(closeTimer);
      handleClose();
      return;
    }
    seconds.value -= 1;
  }, 1000);
}

onMounted(() => {
  seconds.value = 10;
  // console.log('mounted');
  startCloseTimer();
});

onUnmounted(() => {
  clearInterval(closeTimer);
});

</script>

<style lang="less" scoped>
.diamond {
  // background-image: url("/src/assets/images/diamond.png");
  width: 12px;
  height: 12px;
  display: block;
  margin-top: 15px;
  background: var(--theme-color);
  transform: rotate(45deg);
  box-sizing: border-box;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.content {
  display: flex;
  text-align: left;
  padding: 34px 38px 50px 36px;
  min-height: 200px;

  .content-item {
    margin-left: 24px;
  }

  .content-title {
    font-size: 30px;
    line-height: 42px;
    margin-bottom: 20px;
    color: var(--dark-fff, var(--font-color-666666));
  }

  .content-desc {
    font-size: 26px;
    color: var(--dark-fff, var(--font-color-333333));
    line-height: 36px;
    text-align: justify;
    font-weight: normal;
  }
}

.content-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 40px;

  .but {
    width: 360px;
    height: 88px;
    border-radius: 100px;
    font-size: 32px;
  }

  em {
    font-style: normal;
    font-size: 28px;
  }
}

.site-notice-wrap {
  :deep(.notice-wrap) {
    width: 630px !important;
  }

  :deep(.van-hairline--top) {
    display: none;
  }

  :deep(.van-swipe__indicator) {
    background-color: var(--theme-color);
  }
}

.title-wrap {
  width: 630px;
  height: 148px;
  line-height: 168px;
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  color: var(--font-color-fff);
  // background-image: url("/src/assets/images/notice-header.png");
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  // border-radius: var(--van-dialog-border-radius) var(--van-dialog-border-radius)
  //   0 0;
  .icon {
    width: 70px;
    background-size: cover;
    background-repeat: no-repeat;
    height: 80px;
    background-image: url("/src/assets/images/bell.png");
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .close {
    width: 36px;
    height: 36px;
    background-image: url("/src/assets/images/close.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
