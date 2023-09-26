<template>
    <Popup position="center" :showCancelBtn="true" v-model:show="isShowPopup" @clickCloseIcon="isShowPopup = false" :title="$t('修改登录密码')">
      <div class="bind-form-wrap">
        <Form :columns="columns" ref="FormRef" theme="blockLabel">
          <template #arrow>
            <van-icon name="arrow-down"/>
          </template>
        </Form>
        <div class="btn-wrap">
          <van-button type="success" @click="submit">{{$t("确认提交")}}</van-button>
        </div>
        <FooterService :type="2" @toKefu="isShowPopup = false"/>
      </div>
    </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import FooterService from '@/components/FooterService/index.vue';
import { setpass } from '@/api/center';
import { testPassword } from '@/utils';
import Popup from './index.vue';

const isShowPopup = ref(false);
setTimeout(() => {
  isShowPopup.value = true;
}, 100);

const props = defineProps({
  onSuccess: {
    type: Function,
  },
});

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const columns = reactive([
  {
    type: 'password',
    label: global.$t('新密码'),
    prop: 'password',
    block: true,
    placeholder: global.$t('请输入6~20位字符'),
  },
  {
    type: 'password',
    label: global.$t('确认新密码'),
    prop: 'repassword',
    block: true,
    placeholder: global.$t('请再次输入密码'),
  },
]);

const FormRef = ref({});

const { run: postSetPass, loading: setPassLoading } = useRequest(
  () => setpass(FormRef.value.data),
  {
    manual: true,
    onSuccess() {
      Toast.success({ message: global.$t('设置成功！') });
      props.onSuccess?.();
      isShowPopup.value = false;
      $store.dispatch('user/getUserInfo');
    },
  },
);

function submit() {
  const { data } = FormRef.value;
  if (Number(user.userInfo?.is_first_set_pass) !== 1 && !data.old_password) {
    Toast.fail(global.$t('请输入您的原登录密码'));
    return false;
  }
  if (!testPassword(data.password)) {
    Toast.fail(global.$t('登录密码由6-12位英文字母或数字组成'));
    return false;
  }
  if (data.password !== data.repassword) {
    Toast.fail(global.$t('您两次输入的登录密码不一致'));
    return false;
  }

  postSetPass();
}

// todo 接入重制登录密码接口

watch(
  user.userInfo,
  () => {
    if (user?.userInfo?.is_first_set_pass !== 1) {
      columns.unshift({
        type: 'password',
        label: global.$t('旧密码'),
        prop: 'old_password',
        block: true,
        placeholder: global.$t('请输入旧登录密码'),
      });
    }
  },
  { immediate: true },
);
</script>

<style lang="less" scoped>
.bind-form-wrap {
  padding: 30px;
}
:deep(.van-field) {
  background-color: var(--bg-color-191919);
  height: 88px;
  border: 2px solid var(--dark-666, var(--border-color-00001));
  border-radius: 8px;
  margin-bottom: 40px;
}
:deep(.van-cell::after) {
  border: none;
}
.van-button {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}
.van-button--success {
  background-color: var(--bg-color-24c29a);
  /* margin-left: 30px; */
  border: none;
  color: var(--font-color-ffffff);
}
.btn-wrap .van-button {
  /* flex: 1; */
  /* margin-bottom: 30px; */
}

:deep(.van-field__body) {
  /* padding-left: 30px; */
}
</style>
