<template>
  <div class="accountSafe-wrap">
    <h2>{{ $t('个人资料') }}</h2>
    <Form
      :columns="columns"
      ref="FormRef"
      :padding="false"
      :marginBottom="false"
      :border="false"
      :borderBottom="true"
      inputAlign="right"
    ></Form>
    <h2>{{ $t('账户绑定') }}</h2>
    <Form
      :columns="columnsAccount"
      ref="accountFormRef"
      :padding="false"
      :marginBottom="false"
      :border="false"
      :borderBottom="true"
      inputAlign="right"
    >
      <template #arrow>
        <van-icon name="arrow" />
      </template>
    </Form>
    <h2>{{ $t('安全设置') }}</h2>
    <Form
      :columns="columnsSafe"
      ref="safeFormRef"
      :padding="false"
      :marginBottom="false"
      :border="false"
      :borderBottom="true"
      inputAlign="right"
    >
      <template #arrow>
        <van-icon name="arrow" />
      </template>
    </Form>
    <!-- v-show="showBtn" -->
    <van-button @click="submit" :loading="updateLoading" type="primary">{{ $t('保存') }}</van-button>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, ref, onMounted, toRaw,
} from 'vue';
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import Form from '@/components/Form/index.vue';
import { dateFormat } from '@/utils';
import { forgetpass, updateProfile } from '@/api/center';

const global = inject('global');
const today = new Date();
const FormRef = ref(null);
const accountFormRef = ref(null);
const safeFormRef = ref(null);
const otherFormRef = ref(null);
const showBtn = ref(true);

const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;

let isBirthdayChange = false;

const columns = reactive([
  // {
  //   type: 'input',
  //   label: global.$t('昵称'),
  //   placeholder: global.$t('您未填写昵称'),
  //   validateFirst: true,
  //   inputAlign: 'right',
  //   prop: 'nick_name',
  //   leftIconSlot: 'user',
  //   clickable: true,
  //   onClick: showCommitBtn,
  // },
  {
    type: 'input',
    label: global.$t('真实姓名'),
    placeholder: global.$t('请输入与银行卡一致的真实姓名'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'realname',
    leftIconSlot: 'user',
    disabled: false,
    defaultValue: user?.userInfo?.realname ?? '',
    autocomplete: false,
  },
  {
    type: 'input',
    label: global.$t('微信号'),
    placeholder: global.$t('您未填写微信'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'wechat',
    defaultValue: user?.userInfo?.wechat ?? '',
    leftIconSlot: 'wechat',
  }, {
    type: 'input',
    label: global.$t('QQ号'),
    placeholder: global.$t('您未填写QQ，立即填写'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'qq',
    defaultValue: user?.userInfo?.qq ?? '',
    leftIconSlot: 'qq',
  },
  {
    type: 'datetime-picker',
    subType: 'date',
    label: global.$t('出生日期'),
    placeholder: global.$t('请输入出生日期'),
    inputAlign: 'right',
    prop: 'birthday',
    leftIconSlot: 'birthday',
    rightIconSlot: 'arrow',
    defaultValue: user?.userInfo?.birthday || '',
    disabled: false,
    'min-date': new Date('1900-01-01'),
    format(date) {
      return date ? dateFormat('YYYY-MM-DD', date) : '';
    },
    onConfirm() {
      isBirthdayChange = true;
    },
  },

]);
const columnsAccount = reactive([
  {
    type: 'input',
    label: global.$t('手机号'),
    placeholder: global.$t('立即绑定'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'mobile',
    leftIconSlot: 'shouji',
    rightIconSlot: user.userInfo.is_valid_mobile === 1 ? 'arrow' : '',
    readonly: true,
    clickable: true,
    onClick: bindMobile,
  }, {
    type: 'input',
    label: global.$t('邮箱地址'),
    placeholder: global.$t('立即绑定'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'email',
    leftIconSlot: 'mail',
    rightIconSlot: user.userInfo.is_valid_email === 1 ? 'arrow' : '',
    readonly: true,
    clickable: true,
    onClick: bindEmail,
  },
]);

const columnsSafe = reactive([
  {
    type: 'input',
    label: global.$t('登录密码'),
    placeholder: global.$t('登录密码'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'login',
    leftIconSlot: 'pass',
    rightIconSlot: 'arrow',
    defaultValue: global.$t('强度'),
    disabled: true,
    clickable: true,
    onClick: onLoginPassClick,
  }, {
    type: 'input',
    label: global.$t('资金密码'),
    placeholder: global.$t('资金密码'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'payment',
    leftIconSlot: 'zjmm',
    disabled: true,
    rightIconSlot: 'arrow',
    clickable: true,
    onClick: onFeeClick,
  }, {
    type: 'input',
    label: global.$t('密保问题'),
    placeholder: global.$t('密保问题'),
    validateFirst: true,
    inputAlign: 'right',
    prop: 'question',
    leftIconSlot: 'mbwt',
    rightIconSlot: 'arrow',
    disabled: true,
    clickable: true,
    onClick: bindSecretQues,
  },
]);

function initData() {
  $store.dispatch('app/getDict', ['regionlist']);
  const {
    nick_name,
    realname,
    mobile,
    email,
    phone_area_code,
    birthday,
    is_valid_email,
    is_valid_mobile,
    password_level,
    is_first_set_pass,
    is_pay_password,
    is_pass_answer,
  } = user?.userInfo;

  columnsAccount[0].disabled = is_valid_mobile === 2;
  columnsAccount[1].disabled = is_valid_email === 2;

  if (!password_level && is_first_set_pass === 1) {
    columnsSafe[0].defaultValue = global.$t('设置密码');
    columnsSafe[0].class = 'normal';
  } else if (password_level === 1) {
    columnsSafe[0].defaultValue = global.$t('强度为低');
    columnsSafe[0].class = 'red';
  } else if (password_level === 2) {
    columnsSafe[0].defaultValue = global.$t('强度为中');
    columnsSafe[0].class = 'centre';
  } else {
    columnsSafe[0].defaultValue = global.$t('强度为强');
    columnsSafe[0].class = 'high';
  }

  columnsSafe[2].class = is_pass_answer === 1 ? 'red' : '';
  columnsSafe[1].class = is_pay_password === 1 ? 'red' : '';

  columns[0].disabled = !!user?.userInfo?.realname;

  if (FormRef?.value) {
    safeFormRef.value.data.payment = is_pay_password === 1 ? global.$t('您未设置资金密码') : global.$t('已设置,修改资金密码');
    safeFormRef.value.data.question = is_pass_answer === 1 ? global.$t('您未设置密保问题') : global.$t('已设置,修改密保问题');
    accountFormRef.value.data.mobile = mobile ? `+${phone_area_code.replace('+', '')} ${mobile}` : '';
    accountFormRef.value.data.email = email;
  }
  if (columns[0].disabled) showBtn.value = false;
}
onMounted(() => {
  initData();
});

watch(
[() => user.userInfo, () => dicts.regionlist],
  [() => {
    initData();
  },
  () => {
    initData();
  },
  ],

{ immediate: true },
);

function showCommitBtn() {
  showBtn.value = true;
}

function bindMobile() {
  if (user.userInfo.is_valid_mobile === 2) {
    return;
  }

  global.$popup({
    tpl: 'AgentBindMobile',
    userInfo: user?.userInfo,
  });
}

function onLoginPassClick() {
  global.$popup({
    tpl: 'SetLoginPass',
    onSuccess() {
      initData();
    },
  });
}

// 设置资金密码
function onFeeClick() {
  global.$popup({
    tpl: 'AgentChangePayPassword',
    hasFooter: true,
    userInfo: user?.userInfo,
  });
}

// 设置邮箱
function bindEmail() {
  if (user.userInfo.is_valid_email === 2) {
    return;
  }

  global.$popup({
    tpl: 'BindEmail',
    userInfo: user?.userInfo,
  });
}

function openPassPopup() {
  global.$popup({
    tpl: 'ValidIdentify',
    onSuccess() {
      initData();
    },
  });
}

// 设置密保问题
function bindSecretQues() {
  forgetpass({
    username: user.userInfo.username,
  }).then((result) => {
    if (!result.email && !result.mobile && result.is_pass_answer === 1) {
      openPassPopup();
    } else {
      global.$popup({
        tpl: 'VerifyIdentity',
        userSafeInfo: result,
        onSuccess() {
          openPassPopup();
        },
      });
    }
  });
}

function toSecretPage() {
  global.$router.push('/');
}

const {
  run: updateRun,
  loading: updateLoading,
} = useRequest((params) => updateProfile(params), {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('保存成功'));
    $store.dispatch('user/getUserInfo');
  },
  onError(err) {
    // Toast.fail(err.data.msg);
  },
});

function submit() {
  const data = toRaw(FormRef.value.data);

  if (!data.realname) {
    Toast.fail(global.$t('请输入真实姓名'));
    return false;
  }

  if (!isBirthdayChange) {
    delete data.birthday;
  } else {
    data.birthday = dateFormat('YYYY-MM-DD', data.birthday);
  }

  updateRun(data);
}
</script>

<style lang="less" scoped>
.avatar {
  :deep(.van-cell__right-icon) {
    margin-top: 8px;
  }

  :deep(.van-cell__title) {
    margin-top: 16px;
  }
}

:deep(.van-form) {
  padding: 0px 30px;

  [lefticonslot] {
    background: var(--dark-000, var(--bg-color-ffffff)) !important;
  }

  .van-cell {
    overflow: visible;

    &:not(:last-child) {
      border-bottom: 1px solid var(--cur-color-fff-1) !important;
    }
  }
}

:deep(.van-cell::after) {
  border: none !important;
}

.accountSafe-wrap {
  .van-image {
    margin-bottom: 15px;
  }

  h2 {
    padding: 0 30px;
    font-size: 33px;
    height: 84px;
    line-height: 84px;
    margin: 0;
    color: var(--dark-fff, var(--font-color-333333));
    font-weight: normal;
    background-color: var(--cur-color-001e36);
  }

  .save {
    width: 100%;
    margin-top: 30px;
  }

  :deep(.van-field) {
    min-height: 100px;

    .van-field__label {
      font-weight: 500;
    }

    .van-field__label,
    .van-field__control {
      color: var(--dark-fff, var(--font-color-333333));
      span {
        white-space: pre-wrap;
      }
    }

    .van-field__left-icon img {
      width: 42px;
      display: block;
      margin-right: 15px;
    }

    .van-field__body {
      padding-right: 0;

      .van-field__right-icon,
      .van-field__button {
        padding: 0;
        // margin-right: 0;
      }
    }
  }

  .van-button {
    font-size: 32px;
    width: 690px;
    margin: 60px 30px;
  }

  :deep(.van-cell) {
    &.red {
      .van-field__control {
        -webkit-text-fill-color: #ff6666 !important;
      }
    }

    &.green {
      .van-field__control {
        -webkit-text-fill-color: green !important;
      }
    }

    &.yellow {
      .van-field__control {
        -webkit-text-fill-color: yellow !important;
      }
    }
  }

  :deep(.van-field) {
    input::placeholder {
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-333333)) !important;
      opacity: 0.6;
    }
    .van-icon-arrow {
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-333333)) !important;
      opacity: 0.6;
    }
  }
}

.avatar {
  margin: 10px 0 -50px 0;
}
</style>
