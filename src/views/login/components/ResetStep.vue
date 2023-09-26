<template>
  <div class="reset-wrap">
    <div :class="['new-pass-word', focusArr[0] ? 'focused' : 'un-focus']">
      <p>{{ $t("新密码") }}</p>
      <div class="input">
        <input
          type="password"
          @focus="focusArr[0] = true"
          @blur="focusArr[0] = false"
          v-model="data.password"
          :placeholder="$t('6-20位字符，由数字、字母、符号组成')"
        />
      </div>
    </div>
    <div :class="['confirm-password', focusArr[1] ? 'focused' : 'un-focus']">
      <p>{{ $t("确认新密码") }}</p>
      <div class="input">
        <input
          type="password"
          @focus="focusArr[1] = true"
          @blur="focusArr[1] = false"
          v-model="data.repassword"
          :placeholder="$t('请再次输入密码')"
        />
      </div>
    </div>
    <div class="button-box">
      <van-button
        :loading="resetLoading"
        type="primary"
        :disabled="!data.password || !data.repassword"
        @click="submit"
      >{{ $t("完成") }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import {
  inject, reactive, defineEmits, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { forgetpassreset } from '@/api/center';

const global = inject('global');
const focusArr = ref([false, false]);

const props = defineProps({
  type: {
    type: [String, Number],
    default: '',
  },
  verifyData: {
    type: Object,
    default: () => ({}),
  },
  userSafeInfo: {
    type: Object,
    default: () => ({}),
  },
});

const data = reactive({
  password: '',
  repassword: '',
});

const router = useRouter();
const store = inject('store');
const { user } = store.state;

const typeConfig = { mobile: 1, email: 2, question: 3 };

const { run, loading: resetLoading } = useRequest(
  () => forgetpassreset({
    ...data,
    ...props.verifyData,
    uid: props.userSafeInfo?.id,
    type: typeConfig[props.type],
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('登录密码修改成功,请重新登录'));
      router.push({ name: 'login' });
    },
  },

);

function submit() {
  if (data.password !== data.repassword) {
    Toast.fail(global.$t('两次输入的密码不一致'));
    return;
  }

  run();
}
</script>

<style lang="less" scoped>
.dark .reset-wrap > div {
  &:nth-child(1),
  &:nth-child(2) {
    padding: 0 20px;
  }
}
.reset-wrap {
  width: 100%;
  padding-right: 10px;
  margin-top: 54px;
  p {
    font-size: 26px;
  }

  :deep(input) {
    width: 100%;
    border: none;
    color: var(--dark-fff, var(--font-color-000000));
    font-size: 28px;
    text-align: right;
    background-color: transparent;
    padding: 0;
    margin: 0;
  }
  .new-pass-word,
  .confirm-password {
    display: flex;
    align-items: center;
    line-height: 100px;
    justify-content: space-between;
    border-bottom: 2px solid var(--border-color-00001);
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    .input {
      flex: 1;
    }
    p {
      color: var(--dark-fff, var(--font-color-000000));
    }
  }
  .button-box {
    margin: 141px auto 0;
    width: 690px;
  }
}
</style>
