<template>
  <teleport :to="$store.state.app.teleportContainer">
    <div class="levelup-dialog-wrap">
      <div class="content">
        <div class="star">
          <img :src="$getSrc(`/src/assets/images/level-up/V${props.level}@3x.png`)" />
        </div>
        <div class="text1">{{ $t('恭喜您') }}</div>
        <div class="text2">{{ `${$t('升级到')}${levelCn}${$t('星会员')}` }}</div>
        <div class="icons">
          <div class="icon">
            <div class="pic icon1"></div>
            <p>
              {{ $t('更多') }}
              <br />
              {{ $t('专属福利') }}
            </p>
          </div>
          <div class="icon">
            <div class="pic icon2"></div>
            <p>
              {{ $t('更高') }}
              <br />
              {{ $t('洗码比例') }}
            </p>
          </div>
          <div class="icon">
            <div class="pic icon3"></div>
            <p>
              {{ $t('更多') }}
              <br />
              {{ $t('线下体验') }}
            </p>
          </div>
        </div>
        <div class="close" @click="emit('close')"></div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import {
  computed, ref, inject,
} from 'vue';

const props = defineProps({
  level: {
    type: String,
  },
});

const emit = defineEmits(['close']);
const global = inject('global');

const levelCnName = {
  1: global.$t('一'),
  2: global.$t('二'),
  3: global.$t('三'),
  4: global.$t('四'),
  5: global.$t('五'),
  6: global.$t('六'),
  7: global.$t('七'),
};

const levelCn = computed(() => levelCnName[props.level]);
</script>

<style lang="less" scoped>
.levelup-dialog-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  animation: popin 0.3s ease-in-out forwards;
  z-index: 3000;
  > * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 630px;
    height: 580px;
    border-radius: 32px;
    background: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    padding-top: 154px;
    text-align: center;
    font-weight: bold;
    color: var(--dark-fff, var(--font-color-2b2b2b));
    .star {
      position: absolute;
      left: 50%;
      top: -138px;
      width: 324px;
      height: 310px;
      background: url("/src/assets/images/level-up/star.png") no-repeat center;
      background-size: contain;
      transform: translate(-50%);
      > img {
        position: absolute;
        top: 116px;
        left: 106px;
        width: 108px;
      }
    }
    .text1 {
      font-size: 56px;
      height: 80px;
      line-height: 80px;
      margin-bottom: 6px;
    }
    .text2 {
      font-size: 40px;
      height: 56px;
      line-height: 56px;
    }
    .icons {
      margin-top: 40px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding: 0 60px;
      font-weight: normal;
      .icon {
        .pic {
          width: 98px;
          height: 98px;
          margin-bottom: 14px;
          &.icon1 {
            background: url("/src/assets/images/level-up/icon1.png") no-repeat
              center;
            background-size: contain;
          }
          &.icon2 {
            background: url("/src/assets/images/level-up/icon2.png") no-repeat
              center;
            background-size: contain;
          }
          &.icon3 {
            background: url("/src/assets/images/level-up/icon3.png") no-repeat
              center;
            background-size: contain;
          }
        }
        p {
          font-size: 24px;
          line-height: 30px;
        }
      }
    }
    .close {
      position: absolute;
      left: 50%;
      bottom: -96px;
      transform: translate(-50%);
      width: 50px;
      height: 50px;
      background: url("/src/assets/images/level-up/close@3x.png") no-repeat
        center;
      background-size: contain;
    }
  }
}

@keyframes popin {
  0% {
    transform: scale(0);
    background: rgba(0, 0, 0, 0);
  }
  50% {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
