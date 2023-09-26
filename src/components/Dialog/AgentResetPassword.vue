
<template>
      <Dialog :title="$t('修改登录密码')" v-model:show="isShow" @confirm="submit" @cancel="handleCancel" :width="670" show-cancel-btn :confirm-btn-text="$t('提交')">
        <div class="form-dialog-body-wrap">
          <Form :columns="columns" ref="FormRef" @onConfirm="submit"/>
        </div>
      </Dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { Toast } from 'vant';
import { setpass } from '@/api/agent';
import Form from '../Form/index.vue';
import Dialog from './index.vue';

const isShow = ref(true);

const store = inject('store');
const { agent } = store.state;

const userInfo = ref({});
const FormRef = ref(null);

const global = inject('global');
const columns = reactive([
  {
    type: 'password',
    prop: 'old_password',
    block: true,
    label: global.$t('输入原密码'),
    placeholder: global.$t('请输入原密码'),
  },
  {
    type: 'password',
    prop: 'password',
    block: true,
    placeholder: global.$t('请输入新密码'),
    label: global.$t('新密码'),
  },
  {
    type: 'password',
    prop: 'repassword',
    block: true,
    placeholder: global.$t('确认新密码'),
    label: global.$t('确认密码'),
  },
]);

const { run: setPassword, loading: setInfoLoading } = useRequest(
  () => setpass({
    ...FormRef.value.data,
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('修改成功'));
      isShow.value = false;
    },
  },
);

function handleCancel(e) {
  isShow.value = false;
}

function submit() {
  const { data } = FormRef.value;
  if (!data.old_password) {
    Toast.fail(global.$t('请输入您的原登录密码'));
    return false;
  }
  if (!/^[0-9a-zA-Z]{8,12}$/.test(data.password)) {
    Toast.fail(global.$t('登录密码由6-12位英文字母或数字组成'));
    return false;
  }
  if (data.password !== data.repassword) {
    Toast.fail(global.$t('您两次输入的登录密码不一致'));
    return false;
  }
  setPassword();
}
</script>

<style lang="less" scoped>
:deep(.van-field__body) {
  padding-left: 0px !important;
}
</style>
