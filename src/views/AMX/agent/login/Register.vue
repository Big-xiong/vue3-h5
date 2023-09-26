<template>
  <div class="agent-register-wrap">
    <Form :columns="columns" ref="RegisterRef">
      <template v-slot:username>
        <SvgIcon name="icon_user" />
      </template>
      <template v-slot:password>
        <SvgIcon name="icon_pass" />
      </template>
      <template v-slot:wechat>
        <SvgIcon name="icon_wechat" />
      </template>
      <template v-slot:skype>
        <SvgIcon name="icon_skype" />
      </template>
      <template v-slot:mobile>
        <SvgIcon name="icon_shouji" />
      </template>
      <template v-slot:code>
        <SvgIcon name="icon_rec" />
      </template>
    </Form>
    <div class="btn-wrap">
      <van-button type="primary" @click="doRegister" :loading="registerLoading">{{ $t("注册") }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import Form from '@/components/Form/index.vue';
import { login, register, auditsetting } from '@/api/agent';
import SvgIcon from '@/components/SvgIcon.vue';
import { getParams } from '@/utils';

const $store = inject('store');
const store = inject('store');
const global = inject('global');

const columns = reactive([
  {
    type: 'input',
    prop: 'username',
    placeholder: global.$t('请输入代理账户'),
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
    placeholder: global.$t('请输入登录密码'),
    block: true,
    leftIconSlot: 'password',
    rule: [{
      message: global.$t('密码由6-20位英文字母或数字组成'),
      required: true,
      trigger: 'blur',
      validator: (value) => /^[0-9A-Za-z]{6,20}$/.test(value),
    }],
  },
  {
    type: 'input',
    prop: 'wechat',
    placeholder: global.$t('请输入微信号'),
    block: true,
    leftIconSlot: 'wechat',
  },
  {
    type: 'input',
    prop: 'skype',
    placeholder: global.$t('请输入Skype账号'),
    block: true,
    leftIconSlot: 'skype',
  },
  {
    type: 'input',
    prop: 'mobile',
    placeholder: global.$t('请输入手机号码'),
    block: true,
    leftIconSlot: 'mobile',
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入手机号码'),
      },
    ],
  },

]);

const list = ref({});
const userInfo = ref({});

const { data: auditSetting, run: getAuditSetting } = useRequest(
  (params) => auditsetting(params),
  {
    async onSuccess(res) {
      if (res.agent_code_show === 2) {
        if (columns[columns.length - 1].prop !== 'parent_code') {
          columns.push({
            type: 'input',
            prop: 'parent_code',
            required: false,
            block: true,
            leftIconSlot: 'code',
            defaultValue: getParams('id'), // || sessionStorage.getItem('agentCode'),
            placeholder: global.$t('请输入推荐码'),
          });
        }
      } else if (columns[columns.length - 1].prop === 'parent_code') {
        columns.splice(columns.length - 1, 1);
      }
    },
  },
);

const { run: postLogin, loading: loginLoading } = useRequest(
  (params) => login(params),
  {
    manual: true,
    async onSuccess(loginResult) {
      localStorage.setItem('agent_access_token', loginResult.access_token);
      await $store.dispatch('agent/getUserInfo');
      global.$router.push({ name: 'agentCenter' });
    },
  },
);

const RegisterRef = ref(null);

const { run: postRegister, loading: registerLoading } = useRequest(
  (params) => register(params),
  {
    manual: true,
    async onSuccess() {
      Toast.success(global.$t('注册成功！'));
      // await postLogin(RegisterRef.value.data);
      // await $store.dispatch('agent/getUserInfo');
      login({
        username: RegisterRef.value.data.username,
        password: RegisterRef.value.data.password,
      })
        .then((result) => {
          Cookies.set('agent_access_token', result.access_token);
          store.dispatch('agent/getUserInfo');
          // global.$router.push({ name: 'agentHome' });
          global.$router.push({ path: '/affiliate/home' });
        });
    },
  },
);

function doRegister() {
  RegisterRef.value.form.validate()
    .then(() => {
      postRegister({
        ...RegisterRef.value.data, phone_area_code: 86, register_domain: document.domain,
      });
    });
}

</script>

<style lang="less" scoped>
.agent-register-wrap {
  padding: 0 40px;

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

    .icon_skype {
      width: 32px;
      height: 32px;
    }

    .icon_rec {
      width: 32px;
      height: 32px;
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

        span {
          color: var(--font-color-fff);
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
    padding: 30px 0;
    display: flex;
    justify-content: center;

    .van-button {
      font-size: 32px;
      width: 100%;
    }
  }
}
</style>
