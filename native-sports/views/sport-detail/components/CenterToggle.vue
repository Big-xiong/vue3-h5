<template>
  <main class="center-toggle-wrap">
    <div
      class="toggle-item"
      :class="{ noVideo: !hasVideo }"
      @click="onPlaying"
    >
      <img :src="$getSrc('/src/assets/native-sports/images/online_video.png')" />
      <span>{{ $t('直播') }}</span>
    </div>
    <div
      class="toggle-item"
      @click="noAnimate"
    >
      <img :src="$getSrc('/src/assets/native-sports/images/animation.png')" />
      <span>{{ $t('动画') }}</span>
    </div>
    <div
      class="toggle-item"
      @click="emit('refresh')"
    >
      <img
        :class="{ refresh: refreshing }"
        :src="$getSrc('/src/assets/native-sports/images/refresh.png')"
      />
      <span>{{ $t('刷新') }}</span>
    </div>
  </main>
</template>

<script setup>
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['status', 'playing']);

const props = defineProps({
  refreshing: {
    type: Boolean,
    default: false,
  },
  hasVideo: Boolean,
});

const { t } = useI18n();

function onPlaying() {
  if (!props.hasVideo) {
    Toast({
      message: t('此赛事没有直播'),
    });
    return;
  }

  emit('playing');
}

function noAnimate() {
  Toast(t('此赛事没有动画'));
}
</script>

<style lang="less">
.center-toggle-wrap {
  display: flex;
  align-items: center;
  height: 86px;
  background-color: var(--dark-theme-bg);

  .toggle-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33.33%;
    font-size: 24px;
    color: var(--text-color);

    &.noVideo {

      img,
      span {
        opacity: 0.4;
      }
    }

    &:nth-child(2) {
      border-right: solid 2px var(--text-color);
      border-left: solid 2px var(--text-color);

      img,
      span {
        opacity: 0.4;
      }
    }

    img {
      width: 32px;
      height: 28px;
      transform-origin: 16px 14px;
      margin-right: 8px;
    }
  }
}

.refresh {
  animation: refresh 800ms forwards infinite;
}

@keyframes refresh {
  from {
    transform: rotateZ(0deg);
  }

  to {
    transform: rotateZ(360deg);
  }
}
</style>
