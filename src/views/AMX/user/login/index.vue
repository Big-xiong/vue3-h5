<template>
  <div class="login-wrap">
    <van-icon name="cross" @click="router.push('/')"></van-icon>
    <div class="login-body">
      <div class="layout-flex-center login-wrap-logo">
        <img class="logo" :src="dicts?.siteinfo?.h5_logo ?? ''" alt />
      </div>
      <div class="login-wrap-main">
        <van-tabs v-model:active="activeName">
          <van-tab :title="$t('账号密码登录')">
            <Form ref="accountRef" :columns="accountColumns">
              <template #userIcon>
                <!-- <img
                  :src="$getSrc(`/src/assets/images/login/user@2x.png`)"
                  alt=""
                />-->
                <SvgIcon name="icon_user" />
              </template>
              <template #passIcon>
                <!-- <img
                  :src="$getSrc(`/src/assets/images/login/pass@2x.png`)"
                  alt=""
                />-->
                <SvgIcon name="icon_pass" />
              </template>
            </Form>
          </van-tab>
          <van-tab :title="$t('手机快捷登录')">
            <Form ref="mobileRef" :columns="mobileColumns">
              <template #phoneArea>
                <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
                  <span>+{{ areaCode }}</span>
                  <van-icon name="arrow-down" />

                  <!-- <img :src="$getSrc(`/src/assets/images/down-caret.png`)" alt /> -->
                </div>
              </template>
              <template #userIcon>
                <!-- <img
                  :src="$getSrc(`/src/assets/images/login/shouji@2x.png`)"
                  alt=""
                />-->
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
        <div class="login-wrap-func">
          <div class="login-wrap-item">
            <!-- <div
              class="login-keep"
              :class="isKeepLogin ? 'is-keep-login' : ''"
              @click="doKeepLogin"
            >
              <span></span>保持登录
            </div>-->
            <div></div>
            <div class="login-wrap-main-forget" @click="$router.push('/forget-password')">
              <span>{{ $t("忘记密码") }}?</span>
            </div>
          </div>
          <van-button
            type="primary"
            :loading="user.loginLoading"
            :loading-text="$t('登录中...')"
            @click="doLogin"
          >{{ $t("登录") }}</van-button>
          <van-button type="gray" @click="$router.push('/register')">
            {{
              $t("无账号？去注册")
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
    @confirm="onAreaCodeConfirm($event)"
    @close="isShowAreaPopup = false"
  />
</template>

<script setup>
import {
  inject, reactive, ref, onMounted, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { smscode } from '@/api/center';
import Form from '@/components/Form/index.vue';
import PhonePopup from '@/components/Popup/PhoneAreaPopup.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const activeName = ref(0);
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;
const showForget = ref(false);
const accountRef = ref(null);
const mobileRef = ref(null);
const router = useRouter();
const areaCode = ref(user?.userInfo?.phone_area_code || '86');
const accountColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入账号'),
    prop: 'username',
    leftIconSlot: 'userIcon',
    block: true,
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入账号'),
      },
    ],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    leftIconSlot: 'passIcon',
    block: true,
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入密码'),
      },
    ],
  },
]);

const mobileColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入手机号'),
    prop: 'mobile',
    leftIconSlot: 'userIcon',
    block: true,
    labelSlot: 'phoneArea',
    rule: [
      {
        message: global.$t('请输入手机号'),
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    type: 'number',
    placeholder: global.$t('请输入验证码'),
    prop: 'code',
    buttonSlot: 'buttonSlot',
    block: true,
    leftIconSlot: 'yzmIcon',
    rule: [
      {
        message: global.$t('请输入验证码'),
        required: true,
        trigger: 'blur',
      },
    ],
  },
]);

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
  const { data } = mobileRef.value;
  if (!/^1[3456789]\d{9}$/.test(data.mobile)) {
    Toast.fail(global.$t('手机格式有误'));
    return;
  }
  mobileRef.value.form
    .validate('mobile')
    .then(async () => {
      postSendSmsCode({
        mobile: mobileRef.value.data.mobile,
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
    })
    .catch((e) => {
      Toast.fail(global.$t('手机号不能为空'));
    });
}

// watchEffect(() => {
//   if ($store.state.user.isLogin) {
//     Toast.success({ message: global.$t('登录成功'), icon: 'none', duration: 4000 });
//     global.$router.push('/');
//   }
// });

// const isKeepLogin = ref(localStorage.getItem('isKeepLogin') === 'true');
// function doKeepLogin() {
//   isKeepLogin.value = !isKeepLogin.value
//   localStorage.setItem('isKeepLogin', isKeepLogin.value)
// }

function doLogin() {
  if (activeName.value === 0) {
    accountRef.value.form
      .validate()
      .then(async () => {
        $store.dispatch(
          'user/login',
          accountRef.value.data,
        )
          .then((result) => {
            Toast.success(global.$t('登录成功!'));
            global.$router.push('/');
          });
      })
      .catch((e) => { });
  } else {
    mobileRef.value.form
      .validate()
      .then(async () => {
        $store.dispatch('user/mobileLogin', {
          ...mobileRef.value.data,
          phone_area_code: areaCode.value,
        })
        .then((result) => {
            Toast.success(global.$t('登录成功!'));
            global.$router.push('/');
          });
      })
      .catch((e) => { });
  }
}

</script>

<style lang='less' scoped>
.login-wrap {
  background-color: var(--bg-color-0f3256);
  overflow: auto;
  height: 100%;

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
        .van-cell__value--alone .van-field__error-message {
          bottom: -25px;
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
    &-forget {
      span {
        color: var(--font-color-000-6);
      }
    }
  }

  &-func {
    padding: 0 30px;
  }
  &-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 28px;
    color: var(--font-color-ffffff);
    margin: 30px 0 68px;
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
      background: var(--theme-color, var(--bg-color-ffffff));
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
}
</style>
