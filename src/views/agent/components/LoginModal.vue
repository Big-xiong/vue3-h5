<template>
    <div class="agent-login-modal">
      <Dialog :confirmText="active === 'signIn' ? $t('登录') : $t('成为代理') " :show="isShow" blockBtn center footerBtnWidth="100%" :confirmLoading="loginLoading || registerLoading" @onConfirm="active === 'signIn' ? doLogin() : doRegister()" @onClose="emit('onCancel')" :showCancelBtn="false">
        <template #title>
          <el-tabs v-model="active">
            <el-tab-pane :label="$t('代理登录')" name="signIn"></el-tab-pane>
            <el-tab-pane :label="$t('代理注册')" name="register"></el-tab-pane>
          </el-tabs>
        </template>

        <Form ref="SignInRef" :columns="signInColumns" v-show="active === 'signIn'"></Form>
        <Form ref="RegisterRef" :columns="registerColumns" v-show="active === 'register'"></Form>
        <el-form ref="MobileRef" v-show="active === 'register'" class="phone-form" :model="registerForm">
          <el-form-item :rules="registerRule" prop="mobile">
            <div class="area-wrap">
              <i class="el-input__icon el-icon-mobile"></i>
              <span class="plus">+</span>
              <div class="line"/>
            </div>
            <el-input v-model="registerForm.mobile" type="number" :placeholder="$t('请输入手机号')" class="input-with-select">
              <template #prepend>
                <el-select v-model="registerForm.phone_area_code" :placeholder="$t('请选择')">
                  <el-option v-for="(item, index) in phoneCodeData" :key="index" :value="item.value">
                    <span style="float: left;">{{item.label}}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px;">{{ item.key }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </Dialog>
    </div>
</template>

<script setup>
import {
  reactive, ref, inject, defineProps, watch, defineEmits,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { login, register } from '@/api/agent';

defineProps({
  isShow: {
    type: Boolean,
  },
});
const emit = defineEmits(['onCancel']);

const active = ref('signIn');

const global = inject('global');

const phoneCodeData = ref([]);

const registerForm = reactive({
  phone_area_code: '86',
  mobile: '',
});

const registerRule = {
  required: true,
  trigger: 'blur',
  message: global.$t('请输入手机号'),
};

const registerColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入代理帐号'),
    prop: 'account',
    rule: [{
      message: global.$t('请输入代理帐号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    rule: [{
      message: global.$t('密码由6-20位英文字母数字组成'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    placeholder: global.$t('请再次输入密码'),
    prop: 'repassword',
    rule: [{
      message: global.$t('第二次密码与第一次不一致'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'input',
    placeholder: global.$t('请输入微信号'),
    prop: 'wechat',
    rule: [{
      message: global.$t('请输入微信号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'input',
    placeholder: global.$t('请输入skype帐号'),
    prop: 'skype',
  },
]);

const RegisterRef = ref(null);
const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;

watch(() => dicts.phoneareav3, () => {
  phoneCodeData.value = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[1], value: item.split('-')[2],
  }));
}, { immediate: true });

const { run: postLogin, loading: loginLoading } = useRequest(
  (params) => login(params),
  {
    manual: true,
    async onSuccess(loginResult) {
      localStorage.setItem('agent_access_token', loginResult.access_token);
      await $store.dispatch('agent/getUserInfo');
      global.$router.push('/affiliate');
    },
  },
);

const { run: postRegister, loading: registerLoding } = useRequest(
  (params) => register(params),
  {
    manual: true,
    async onSuccess() {
      global.$message.success(global.$t('登陆成功！'));
      await postLogin(RegisterRef.value.data);
      await $store.dispatch('agent/getUserInfo');
    },
  },
);

const MobileRef = ref(null);
function doRegister() {
  RegisterRef.value.form.validate((valid) => {
    if (valid) {
      MobileRef.value.validate((mobileValid) => {
        if (mobileValid) {
          postLogin({
            ...RegisterRef.value.data,
            ...registerForm,
          });
        }
      });
    }
  });
}

const signInColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入代理帐号'),
    prop: 'username',
    rule: [{
      message: global.$t('请输入代理帐号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    rule: [{
      message: global.$t('请输入密码'),
      required: true,
      trigger: 'blur',
    }],
  },
]);

const SignInRef = ref(null);
function doLogin() {
  SignInRef.value.form.validate((valid) => {
    if (valid) {
      postLogin(SignInRef.value.data);
    }
  });
}
</script>

<style lang="less" scoped>
.agent-login-modal {
  :deep(.el-dialog__footer) {
    padding: 0 50px 40px 50px;
  }

  :deep(.el-dialog__body-wrap) {
    padding: 40px 50px 0 50px !important;
  }

  :deep(.el-tabs__item) {
    padding: 20px 0 20px 60px !important;
    font-size: 20px;
  }

  :deep(.el-input-group__prepend),
  :deep(.el-input__inner),
  :deep(.el-input-group) {
    border: none !important;
    background-color: var(--bg-color-191919);
  }

  :deep(.el-select) {
    z-index: 10;
    background-color: transparent;
  }
}

.phone-form {
  .area-wrap {
    display: flex;
    position: absolute;
    align-items: center;
    width: 110px;
    left: 10px;
    z-index: 1;

    i,
    span,
    div {
      color: var(--font-color-525152);
    }

    i {
      margin-right: 5px;
      font-size: 20px;
    }

    .span {
      color: var(--font-color-8f8f8f);
    }

    .line {
      top: 15px;
      right: 0;
      z-index: 10;
      width: 1px;
      position: absolute;
      height: 16px;
      background-color: #525152;
    }
  }

  :deep(.el-select__caret) {
    font-size: 22px;
    color: var(--dark-fff, var(--font-color-222930));
  }

  :deep(.el-select) {
    width: 120px;
    box-sizing: border-box;
    padding-left: 38px !important;

    input {
      font-size: 16px;
    }
  }
}
</style>
