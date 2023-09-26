<template>
  <Dialog :title="title" :showConfirmBtn="false" v-model:show="isShow" class="reward-dialog-wrap">
    <div class="result">
      <img :src="$getSrc('/src/assets/images/daliy-duty/hongbao@2x.png')" />
      <div class="text">
        <h2>
          {{ money }}
          <small>{{ $t('元') }}</small>
        </h2>
        <p>
          {{ text }}
          <br />
          {{ $t('已存入你的钱包') }}
        </p>
      </div>
      <van-icon name="cross" @click="isShow = false;" />
      <!-- <i class="el-icon-circle-close" @click="showResult = false" /> -->
    </div>
  </Dialog>
</template>

<script setup>
import { inject, ref, defineProps } from 'vue';
import Dialog from './index.vue';

const global = inject('global');
const isShow = ref(true);

defineProps({
  text: {
    default: '',
    type: String,
  },
  money: {
    default: 0,
    type: Number,
  },
});

</script>

<style lang="less">
.reward-dialog-wrap {
  background-color: transparent !important;
  // margin-top: -200px;
  .van-dialog__header {
    display: none;
  }
  .result {
    position: relative;

    img {
      width: 100%;
    }
  }
  .text {
    position: absolute;
    top: 440px;
    // left: 50%;
    width: 100%;
    text-align: center;
    color: var(--font-color-eecc8e);
    line-height: 24px;
    font-size: 24px;

    h2 {
      font-size: 80px;
      font-weight: 600;
      color: var(--font-color-eecc8e);
      margin-bottom: 40px;

      small {
        font-size: 40px;
        font-weight: normal;
        color: var(--font-color-eecc8e);
      }
    }
    p {
      font-size: 34px;
      line-height: 40px;
    }
  }
}
</style>

<style lang="less" scoped>
.reward-dialog-wrap {
  .van-icon-cross {
    position: absolute;
    left: 50%;
    bottom: -100px !important;
    color: var(--font-color-fff) !important;
    font-size: 30px;
    margin-top: 15px;
    font-size: 48px;
    width: 60px;
    height: 60px;
    margin-left: -30px;
    line-height: 60px;
    padding: 4px;
    border-radius: 50%;
    top: auto !important;
    border: 4px solid var(--font-color-fff) !important;
  }
}
</style>
