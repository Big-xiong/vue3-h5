<template>
  <van-action-sheet
    class="password-action-wrap"
    closeable
    :show="isShow"
    @close="emit('close', payPassword)"
    :description="$t('请输入资金密码')"
  >
    <div class="password-wrap" :class="{ 'keyboard-show': showKeyboard }">
      <van-icon name="cross" @click="emit('close', payPassword)"></van-icon>
      <van-password-input
        :value="payPassword"
        :gutter="10"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <div class="forget" @click="router.push({ name: 'agentCenter' })">{{ $t('忘记资金密码') }}</div>
      <div class="issue">
        {{ $t('遇到问题联系') }}
        <span @click="$openKefu">{{ $t('专属客服') }}</span>
      </div>
      <van-number-keyboard v-model="payPassword" :show="showKeyboard" @blur="showKeyboard = false" />
    </div>
  </van-action-sheet>
</template>

<script setup>
import {
  inject, defineProps, ref, defineEmits,
} from 'vue';
import { useRouter } from 'vue-router';

const global = inject('global');

const props = defineProps({
  isShow: Boolean,
});

const router = useRouter();
const payPassword = ref('');
const showKeyboard = ref(false);
const emit = defineEmits(['close']);
</script>

<style lang="less">
.password-action-wrap {
  .password-wrap {
    box-sizing: border-box;
    padding: 30px 30px 75px;

    &.keyboard-show {
      padding-bottom: 450px;
    }

    .issue {
      color: var(--dark-fff, var(--font-color-666666));
      text-align: center;
      line-height: 75px;
      font-size: 28px;

      span {
        text-decoration: underline;
        color: var(--theme-color);
      }
    }

    .forget {
      font-size: 28px;
      line-height: 75px;
      color: var(--dark-fff, var(--font-color-666666));
      padding-left: 20px;
    }

    .van-password-input {
      .van-password-input__item {
        background-color: var(--password-ingput-bg-color);
        border-radius: 8px;
      }

      i {
        background-color: var(--theme-color);
      }
    }

    .van-action-sheet__description {
      color: var(--dark-fff, var(--font-color-333333));
      font-size: 32px;
    }
  }

  .van-icon {
    position: absolute;
    top: 40px;
    left: 40px;
    font-size: 32px;
    color: var(--dark-fff, var(--font-color-cccccc));
  }
}
</style>
