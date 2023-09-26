<template>
  <div class="reset-wrap">
    <div class="new-pass-word">
      <p>{{ $t("请输入新登录密码") }}</p>
      <div class="input">
        <img
          class="img"
          style="margin-right: 6px;"
          :src="$getSrc(`/src/assets/images/pass@2x.png`)"
          alt
        />
        <input
          type="password"
          v-model="data.password"
          :placeholder="$t('6-20位字符，由数字、字母、符号组成')"
        />
      </div>
    </div>
    <div class="confirm-password">
      <p>{{ $t("确认新密码") }}</p>
      <div class="input">
        <img
          class="img"
          style="margin-right: 6px;"
          :src="$getSrc(`/src/assets/images/pass@2x.png`)"
          alt
        />
        <input
          type="password"
          v-model="data.repassword"
          :placeholder="$t('请再次输入密码')"
        />
      </div>
    </div>
    <div class="button-box">
      <van-button
        :loading="resetLoading"
        :type="password && repassword ? 'primary' : 'gray'"
        :disabled="!password || !repassword"
        @click="submit"
      >{{ $t("完成") }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { forgetpassreset } from '@/api/center';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { inject, reactive, defineEmits } from 'vue';

const data = reactive({
  password: '',
  repassword: '',
});
const emit = defineEmits(['close']);

const { run: submit, loading: resetLoading } = useRequest(
  () => forgetpassreset(data),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('登录密码修改成功'));
      emit('close');
    },
  },
);
</script>

<style scoped lang="less">
.reset-wrap {
  p {
    font-size: 26px;
    margin: 0 0 15px 0;
  }

  input {
    width: 100%;
    border: none;
    color: var(--font-color-fff);
    font-size: 32px;
  }

  .input {
    margin-bottom: 30px;
  }
}
</style>
