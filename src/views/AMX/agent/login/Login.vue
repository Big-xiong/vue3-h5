<template>
  <div class="agent-login-wrap">
    <Form :columns="columns" ref="SignInRef">
      <template #username>
        <SvgIcon name="icon_user" />
      </template>
      <template #password>
        <SvgIcon name="icon_pass" />
      </template>
    </Form>
    <div class="btn-wrap">
      <van-button :loading="loginLoading" :loading-text="$t('登录中')" type="primary" @click="doLogin">{{ $t("登录") }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import Form from '@/components/Form/index.vue';
import { login, register } from '@/api/agent';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const columns = reactive([
  {
    type: 'input',
    prop: 'username',
    placeholder: global.$t('代理账户'),
    block: true,
    leftIconSlot: 'username',
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入代理帐号'),
      },
    ],
  },
  {
    type: 'password',
    prop: 'password',
    placeholder: global.$t('登录密码'),
    block: true,
    leftIconSlot: 'password',
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入登录密码'),
      },
    ],
  },
]);

const list = ref({});
const userInfo = ref({});
const $store = inject('store');

const { run: postLogin, loading: loginLoading } = useRequest(
  (params) => login(params),
  {
    manual: true,
    async onSuccess(loginResult) {
      localStorage.setItem('agent_access_token', loginResult.access_token);
      Cookies.set('agent_access_token', loginResult.access_token);
      await $store.dispatch('agent/getUserInfo');
      global.$router.push({ name: 'agentCenter' });
    },
  },
);

const SignInRef = ref(null);
async function doLogin() {
  SignInRef.value.form
    .validate()
    .then(() => {
      postLogin(SignInRef.value.data);
    })
    .catch(() => { });
}
</script>

<style lang="less" scoped>
.agent-login-wrap {
  padding: 0 40px;

  :deep(.van-field__label) {
    margin: 0 !important;
  }

  .van-form {
    :deep(.van-cell) {
      border: 0;
      border-bottom: 2px solid var(--border-color-323232);
      text-align: left;
      height: 96px;
      margin-bottom: 0;
      padding: 0 !important;

      img {
        width: 50px;
        vertical-align: middle;
        margin-right: 20px;
      }

      .van-field__error-message {
        bottom: -35px;
      }

      .van-field__left-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        width: 44px;
      }
    }

    .svg-icon-wrap {
      width: 44px;
      height: 44px;
    }

    :deep(.van-field) {
      background-color: var(--bg-color-282828);
      border-radius: 0;
    }

    .van-button {
      margin: 0;
      min-width: 240px;
      height: 70px !important;
    }

    :deep([labelslot="phoneArea"]) {
      .van-field__label {
        width: 140px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span,
        i {
          color: var(--font-color-000);
          flex: 1;
        }

        img {
          height: 24px;
          width: 30px;
          margin-left: 15px;
        }
      }
    }
  }

  .btn-wrap {
    padding: 100px 0;
    display: flex;
    justify-content: center;

    .van-button {
      font-size: 32px;
      width: 100%;
    }
  }

  .login-wrap-main {
    background-color: var(--bg-color-0f3256);
    border-radius: 20px 20px 0 0;
    overflow: hidden;

    :deep(.van-tabs__wrap) {
      height: 120px;
      border-bottom: 2px solid var(--border-color-323232);

      .van-tab {
        flex: 1;
        margin-right: 0;
        font-size: 32px;
      }

      .van-tab--active {
        color: var(--theme-color);
        font-size: 36px;
      }
    }

    :deep(.van-tabs__content) {
      padding: 0 30px;
    }
  }
}
</style>
