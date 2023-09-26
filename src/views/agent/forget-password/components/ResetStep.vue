<template>
    <div class="reset-wrap">
      <van-form>
        <van-field v-model="data.password" :label="$t('新密码')" :placeholder="$t('密码6-20位数字及字母组成')"/>
        <van-field v-model="data.repassword" :label="$t('确认新密码')" :placeholder="$t('密码6-20位数字及字母组成')"/>
      </van-form>
      <van-button :loading="resetLoading" type="primary" :disabled="!password || !repassword" @click="submit">{{$t("完成")}}</van-button>
    </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { inject, reactive, defineEmits } from 'vue';
import { forgetpassreset } from '@/api/center';

const global = inject('global');

const props = defineProps({
  type: {
    type: [String, Number],
    default: '',
  },
});

const data = reactive({
  password: '',
  repassword: '',
});

const emit = defineEmits(['close']);
const store = inject('store');
const { user } = store.state;
const typeConfig = ['mobile', 'email', 'question'];

const { run: submit, loading: resetLoading } = useRequest(
  () => forgetpassreset({
    ...data,
    uid: user.userInfo?.id,
    type: typeConfig.indexOf(props.type),
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('登录密码修改成功'));
      emit('close');
    },
  },
);
</script>

<style lang="less" scoped>
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
