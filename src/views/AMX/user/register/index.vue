<template>
  <div class="register-wrap">
    <van-icon name="cross" @click="router.push('/')"></van-icon>

    <div class="login-body">
      <div class="layout-flex-center login-wrap-logo">
        <img class="logo" :src="dicts?.siteinfo?.h5_logo ?? ''" alt />
      </div>
      <div class="login-wrap-main">
        <van-tabs v-model:active="activeName" @change="onTabChange">
          <van-tab :title="tabsTitle[0]">
            <Form ref="accountRef" :columns="accountColumns">
              <template #userIcon>
                <SvgIcon name="icon_user" />
              </template>
              <template #passIcon>
                <SvgIcon name="icon_pass" />
              </template>
              <template #phoneArea>
                <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
                  <span>+{{ areaCode }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
              <template #mobileIcon>
                <SvgIcon name="icon_shouji" />
              </template>
              <template #yzmIcon>
                <SvgIcon name="icon_yzm" />
              </template>
              <template #buttonSlot>
                <van-button
                  type="primary"
                  :disabled="isCounting"
                  @click="sendCode"
                  :loading="sendCodeLoading"
                >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
              </template>
            </Form>
          </van-tab>
          <van-tab :title="tabsTitle[1]">
            <div class="one-key-wrap">
              <Rocket @click="doRegister" />
              <div class="one-key-text">{{ $t(`${subConfig.title}娱乐`) }}{{ $t("一键开户，极速体验！") }}</div>
            </div>
          </van-tab>
          <van-tab :title="tabsTitle[2]">
            <Form ref="mobileRef" :columns="mobileColumns">
              <template #phoneArea>
                <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
                  <span>+{{ areaCode }}</span>
                  <van-icon name="arrow-down" />

                  <!-- <img
                    :src="$getSrc(`/src/assets/images/down-caret.png`)"
                    alt=""
                  />-->
                </div>
              </template>
              <template #mobileIcon>
                <SvgIcon name="icon_shouji" />
              </template>
              <template #yzmIcon>
                <SvgIcon name="icon_yzm" />
              </template>
              <template #buttonSlot>
                <van-button
                  type="primary"
                  :disabled="isCounting"
                  @click="sendCode"
                  :loading="sendCodeLoading"
                >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
              </template>
            </Form>
          </van-tab>
        </van-tabs>
        <div class="agreement" @click="isAgree = !isAgree">
          <!-- <i
            v-if="isAgree"
            :style="{
              backgroundImage: `url(/src/assets/images/chenggong@2x.png)`,
            }"
          ></i>-->
          <div class="check-out">
            <van-icon name="checked" v-if="isAgree" />
            <i v-else class="uncheck"></i>
          </div>
          <span>{{ $t("同意并接受") }}</span>
          <a @click.stop="Protocol">《{{ $t(`${subConfig.title}娱乐`) }}{{ $t("游戏条款") }}》</a>
        </div>

        <div class="btn-wrap">
          <van-button
            type="primary"
            :loading="user.registerLoading"
            :loading-text="activeName === 1 ? $t('获取中...') : $t('注册中...')"
            @click="doRegister"
          >
            {{
              $t("注册")
            }}
          </van-button>
          <van-button type="gray" @click="$router.push('/login')">
            {{
              $t("已有账号？去登录")
            }}
          </van-button>
        </div>
        <div class="layout-flex-center footerService-wrap">
          <div class="wait" @click="$router.push('/')">
            <!-- <SvgIcon name="footer-index" /> -->
            <img :src="$getSrc(`/src/assets/images/zaigg@2x.png`)" alt />
            {{ $t('再逛逛吧') }}
          </div>
          <div class="line"></div>
          <div class="kefu" @click="$openKefu">
            <SvgIcon name="footer-service" />
            <!-- <img
              :src="$getSrc(`/src/assets/images/kefu@2x.png`)"
              alt
            />-->
            {{ $t('专属客服') }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <PhonePopup
    :show="isShowAreaPopup"
    :defaultValue="areaCode"
    @confirm="onAreaCodeConfirm($event)"
    @close="isShowAreaPopup = false"
  />

  <MobileVerify
    :show="isShowMobileVerify"
    :isRegisterCode="isRegisterCode"
    :registerType="activeName"
    @close="isShowMobileVerify = false"
    @doRegisterAfter="doRegisterAfter"
    @doRegisterAccount="doRegisterAccount"
  />
</template>

<script setup>
import {
  inject, reactive, ref, watchEffect, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import { smscode } from '@/api/center';
import Form from '@/components/Form/index.vue';
import PhonePopup from '@/components/Popup/PhoneAreaPopup.vue';
import FooterService from '@/components/FooterService/index.vue';
import Rocket from '@/components/Rocket.vue';
import SvgIcon from '@/components/SvgIcon.vue';

import { useDicts } from '@/utils/hooks';
import { testPassword } from '@/utils';
import MobileVerify from './components/MobileVerify.vue';
import Protocol from './Protocol';

const activeName = ref(0);
const global = inject('global');
const navTitle = ref(global.$t('账号注册'));
const $store = inject('store');
const siteInfo = ref({});
const isShowMobileVerify = ref(false);
const subConfig = inject('subConfig');

const { user } = $store.state;
const { dicts } = $store.state.app;
const isAgree = ref(true);

const accountRef = ref(null);
const mobileRef = ref(null);
const tabsTitle = [
  global.$t('账号注册'),
  global.$t('一键注册'),
  global.$t('手机号注册'),
];

const router = useRouter();

const accoutRegisterCode = ref(1);
const quickRegisterCode = ref(1);

const areaCode = ref(user?.userInfo?.phone_area_code || '86');

const accountColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入账号'),
    prop: 'username',
    leftIconSlot: 'userIcon',
    block: true,
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    leftIconSlot: 'passIcon',
    block: true,
  },
  {
    type: 'password',
    placeholder: global.$t('请确认密码'),
    prop: 'repassword',
    leftIconSlot: 'passIcon',
    block: true,
  },
]);

const mobileColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入手机号'),
    prop: 'mobile',
    leftIconSlot: 'mobileIcon',
    block: true,
    labelSlot: 'phoneArea',
  },
  {
    type: 'number',
    placeholder: global.$t('请输入验证码'),
    prop: 'code',
    buttonSlot: 'buttonSlot',
    block: true,
    leftIconSlot: 'yzmIcon',
  },
]);
const isRegisterCode = computed(() => {
  if (activeName.value === 0) return accoutRegisterCode.value;
  if (activeName.value === 1) return quickRegisterCode.value;
  return 1;
});
function onTabChange() {
  navTitle.value = tabsTitle[activeName.value];
}

const isShowAreaPopup = ref(false);

function onAreaCodeConfirm(event) {
  areaCode.value = event;
  isShowAreaPopup.value = false;
}

const { run: postSendSmsCode, loading: sendCodeLoading } = useRequest(smscode, {
  manual: true,
});
const isCounting = ref(false);
const seconds = ref(60);
async function sendCode() {
  if (isCounting.value) {
    return;
  }

  const { data } = activeName.value === 0 ? accountRef.value : mobileRef.value;
  if (!/^1[3456789]\d{9}$/.test(data.mobile)) {
    Toast.fail(global.$t('手机格式有误'));
    return;
  }

  postSendSmsCode({
    mobile: data.mobile,
    phone_area_code: areaCode.value,
  });

  isCounting.value = true;
  seconds.value = 60;
  const interval = setInterval(() => {
    seconds.value -= 1;
    if (seconds.value === 0) {
      clearInterval(interval);
      isCounting.value = false;
      seconds.value = 60;
    }
  }, 1000);
}

useDicts('siteinfo', (info) => {
  quickRegisterCode.value = Number(info?.h5_register_setting?.quick_register ?? 1);
  accoutRegisterCode.value = Number(info?.h5_register_setting?.username_register ?? 1);
}, { immediate: true });

function doRegister() {
  if (!isAgree.value) {
    Toast.fail('请接受并同意《游戏条款》');
    return;
  }

  let registerInfo = {
    name: 'quick',
    data: {},
  };
  if (activeName.value === 1 && quickRegisterCode.value !== 1) {
    isShowMobileVerify.value = true;
    return;
  }
  if (activeName.value === 0) {
    const { data } = accountRef.value;
    if (!data.username) {
      Toast.fail(global.$t('请输入用户名'));
      return;
    }

    if (!testPassword(data.password)) {
      Toast.fail(global.$t('密码格式有误'));
      return;
    }

    if (data.password !== data.repassword) {
      Toast.fail(global.$t('两次密码不一致'));
      return;
    }
    if (activeName.value === 0 && accoutRegisterCode.value !== 1) {
      isShowMobileVerify.value = true;
      return;
    }
    doRegisterAccount();
  } else {
    if (activeName.value === 2) {
      const { data } = mobileRef.value;

      if (!data.code) {
        Toast.fail(global.$t('验证码输入有误'));
        return;
      }

      registerInfo = {
        name: 'mobile',
        data: {
          ...mobileRef.value.data,
          phone_area_code: areaCode.value,
          spread_code: sessionStorage.getItem('spread_code') || '',
        },
      };
    }
    $store.dispatch('user/register', registerInfo).then(() => {
      global.$router.push({ name: 'success', query: { name: activeName.value === 1 ? 'quick' : '', password: activeName.value === 0 ? accountRef.value.data.password : 'aa123456' } });
    });
  }
}
function doRegisterAccount(val = null) {
  accountRef.value.data.id = accountRef.value.data.id || (sessionStorage.getItem('agentCode') || '');
  sessionStorage.getItem('friendCode') && (accountRef.value.data.spread_code = sessionStorage.getItem('friendCode'));
  const registerInfo = {
    name: 'account',
    data: val === null ? {
      ...accountRef.value.data,
    } : {
      ...accountRef.value.data,
      ...val,
    },
  };
  $store.dispatch('user/register', registerInfo).then(() => {
    global.$router.push({ name: 'success', query: { password: accountRef.value.data.password } });
  });
}
function doRegisterAfter() {
  global.$router.push({ name: 'success', query: { name: activeName.value === 1 ? 'quick' : '', password: activeName.value === 0 ? accountRef.value.data.password : 'aa123456' } });
}
</script>
<style lang='less' scoped>
.register-wrap {
  background-color: var(--bg-color-0f3256);
  height: 100%;
  overflow: auto;

  > .van-icon-cross {
    color: var(--font-color-ffffff);
    position: absolute;
    left: 30px;
    top: 30px;
    font-size: 44px;
  }

  .login-body {
    display: flex;
    height: 100%;
    justify-content: flex-start;
    flex-direction: column;
  }
  :deep(.van-cell) {
    background-color: var(--bg-color-282828) !important;
    border-radius: 0;
  }

  .login-wrap-logo {
    text-align: center;
    flex-direction: column;
    box-sizing: border-box;
    flex: 1;
    background-color: var(--bg-color-f7f7f7);

    .logo {
      width: 300px;
      margin: 0 auto;
    }
  }

  .cooperation {
    width: 428px;
  }

  .login-wrap-main {
    overflow: hidden;
    :deep(.van-tabs__wrap) {
      height: 120px;
      border: 0;
      background-color: var(--cur-color-191919);
      border-radius: 0;
      padding-left: 0;

      .van-tabs__nav {
        background-color: var(--bg-color-0f3256);
        border-radius: 20px 20px 0 0;
        border-bottom: 2px solid var(--border-bottom-fff-1);
        box-sizing: border-box;
        padding-bottom: 0;
      }

      .van-tabs__line {
        bottom: 0;
      }

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
      .van-form .block-label {
        padding-bottom: 0;
      }
    }

    .van-form {
      :deep(.van-cell) {
        border: 0;
        border-bottom: 2px solid var(--border-bottom-fff-1);
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
          margin-right: 16px;
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

    &-forget {
      text-align: right;
      font-size: 30px;
      color: var(--font-color-ffffff);
      margin: 30px 0 68px;
    }

    .van-button {
      display: block;
      width: 100%;
      height: 100px;
      margin-top: 40px;
      font-size: 32px;
    }
    .van-field__body .van-button {
      font-size: 28px;
    }
  }

  &-func {
    padding: 0 30px;
  }

  .agreement {
    margin-top: 50px;
    margin-bottom: 30px;
    color: var(--font-color-ffffff);
    font-size: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;

    .van-icon {
      color: var(--theme-color);
      font-size: 44px;
    }

    span {
      display: inline-block;
    }
    .check-out {
      width: 55px;
      display: flex;
      align-items: center;
    }
    i {
      width: 36px;
      height: 36px;
      margin-right: 14px;
      display: block;
      background-size: cover;
      flex: 1 0 auto;
      &.van-icon-checked {
        height: auto;
      }
      &.uncheck {
        border: 2px solid var(--theme-color);
        border-radius: 50%;
      }
    }

    a {
      color: var(--theme-color);
      text-decoration: underline;
    }
  }

  .btn-wrap {
    box-sizing: border-box;
    padding: 0 30px;
  }
}

.one-key-wrap {
  margin-top: 30px;
  text-align: center;

  .one-key-Img {
    img {
      width: 176px;
      height: 176px;
    }
  }

  .one-key-text {
    color: var(--font-color-ffffff);
    font-size: 28px;
    margin-top: 26px;
  }
}
.phone-area {
  .van-icon-arrow-down {
    margin-left: 10px;
  }
}
.footerService-wrap {
  padding: 50px 0;

  .line {
    width: 2px;
    height: 40px;
    background: var(--theme-color);
    border-radius: 5px;
    margin: 0 20px;
  }

  .wait,
  .kefu {
    height: 42px;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--theme-color));
    line-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    .svg-icon-wrap,
    img {
      width: 42px;
      height: 42px;
      margin-right: 20px;
      fill: var(--theme-color);
    }
  }

  // .kefu {
  //   color: var(--font-color-7c86e9);
  // }
}
</style>

<style lang="less">
.protocol-wrap {
  border-radius: 20px;
  top: 48%;

  .van-dialog__confirm {
    width: 95%;
  }

  .van-dialog__header {
    height: 75px;
    font-size: 32px;
    line-height: 75px;
    padding-top: 25px;
    border-bottom: none;
  }

  .van-dialog__content {
    padding: 0;
  }

  .protocol {
    color: var(--font-color-646566);
  }

  .van-dialog__footer {
    margin-top: 20px;
    .van-button {
      width: 100% !important;
    }
  }
}
</style>
