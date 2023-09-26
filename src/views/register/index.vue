<template>
  <div class="register-container">
    <div class="register-wrap">
      <div class="register-wrap-navBar" ref="navBarRef">
        <van-nav-bar :safe-area-inset-top="true" :border="false">
          <template #left>
            <van-icon name="arrow-left" color="#fff" @click="router.go(-1)" />
          </template>
          <template #title>
            <img class="logo" :src="$getSrc(`/src/assets/images/logo.png`)" />
          </template>
          <template #right>
            <SvgIcon name="kefu" @click="$openKefu" />
          </template>
        </van-nav-bar>
      </div>
      <div :style="`height:${navBarHeight}px`"></div>
      <div class="register-wrap-content">
        <van-row class="register-wrap-brand">
          <van-col span="8">
            <img class="brand" :src="$getSrc(`/src/assets/images/login/1.png`)" />
            <span>{{ $t('官方球衣赞助商') }}</span>
            <span>Slavia Prague</span>
          </van-col>
          <van-col span="8">
            <img class="brand" :src="$getSrc(`/src/assets/images/login/2.png`)" />
            <span>{{ $t('亚洲官方投注伙伴') }}</span>
            <span>Dynamo Kiev</span>
          </van-col>
          <van-col span="8">
            <img class="brand" :src="$getSrc(`/src/assets/images/login/3.png`)" />
            <span>{{ $t('BLIZZWIN品牌大使') }}</span>
            <span>{{ $t('维尔科斯基') }}</span>
          </van-col>
        </van-row>
        <div class="register-wrap-from">
          <div class="register-wrap-from-item">
            <Form id="register-form-account" ref="accountRef" :columns="accountColumns">
              <template #phoneArea>
                <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
                  <span>+{{ areaCode }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
              <template #labelIcon>
                <div
                  @click="showRec('account')"
                  :style="{ 'margin-bottom': accountShow ? '' : '20px' }"
                >
                  <span>{{ $t('推荐码 (选填)') }}</span>
                  <van-icon
                    name="play"
                    :style="{ transform: accountShow ? 'rotate(-90deg)' : 'rotate(90deg)' }"
                    class
                  />
                </div>
              </template>
            </Form>
          </div>
          <van-button
            :loading="user.registerLoading"
            :loading-text="$t('注册中')"
            type="success"
            class="login"
            @click="confirmRegister"
            block
          >{{ $t('确认注册') }}</van-button>
          <van-button block plain @click="router.push('/login')">{{ $t('已有账号，去登录') }}</van-button>
        </div>
        <div class="register-wrap-footer" @click="$popup({ tpl: 'UserProtocol' })">
          <SvgIcon name="select-btn" />
          《BLIZZWIN {{ $t('游戏条款') }}》
        </div>
      </div>

      <phone-area-popup
        :show="isShowAreaPopup"
        :areaCode="areaCode"
        @confirm="onAreaCodeConfirm($event)"
        @close="isShowAreaPopup = false"
      />

      <Popup v-model:show="isShowMobileBind" :title="$t('绑定手机号')" theme-title>
        <div class="bind-mobile-wrap">
          <Form ref="bindFormRef" :columns="bindMobileColumns">
            <template #phoneArea>
              <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
                <span>+{{ areaCode }}</span>
                <van-icon name="arrow-down" />
              </div>
            </template>
            <template #buttonSlot>
              <van-button
                type="gray"
                :disabled="isCounting"
                @click="sendCode"
                :loading="sendCodeLoading"
              >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
            </template>
          </Form>
          <div class="button-wrap">
            <van-button type="gray" @click="isShowMobileBind = false">{{ $t('残忍拒绝') }}</van-button>
            <van-button
              :loading="user.registerLoading"
              type="primary"
              :loading-text="$t('注册中')"
              @click="confirmBind"
            >{{ $t('确认') }}</van-button>
          </div>
          <FoorSerive />
        </div>
      </Popup>

      <ChooseCurrency
        :show="currencyShow"
        :registerType="registerType"
        @confirmCurrency="confirmCurrency"
      />
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, computed, onMounted, getCurrentInstance,
} from 'vue';
import { useRequest } from 'vue-request';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import Form from '@/components/Form/index.vue';
import { testPassword } from '@/utils';
import PhoneAreaPopup from '@/components/Popup/PhoneAreaPopup.vue';
import ChooseCurrency from '@/components/Popup/ChooseCurrency.vue';
import { smscode } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';
import Popup from '@/components/Popup/index.vue';
import FoorSerive from '@/components/FooterService/index.vue';
import { siteinfo } from '@/api/dicts';
import { spreadcodecurrency } from '@/api/app';
import { getAreaCodeFromRegion } from '../../utils';

const areaCode = ref('86');
const global = inject('global');
const $store = inject('store');
const isShowAreaPopup = ref(false);
const registerType = ref(1);
const isShowMobileBind = ref(false);
const currencyShow = ref(false);
const accountRef = ref({
  data: {
    inte_currency_id: '',
    inte_region_id: '',
  },
});
const navBarHeight = ref(0);

const router = useRouter();
const accountShow = ref(false);
const accountColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入用户名'),
    prop: 'username',
    leftIconSlot: 'userIcon',
    label: global.$t('用户名'),
    block: true,
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    leftIconSlot: 'passIcon',
    label: global.$t('密码'),
    block: true,
  },
  {
    type: 'password',
    placeholder: global.$t('请确认密码'),
    label: global.$t('确认密码'),
    prop: 'repassword',
    leftIconSlot: 'passIcon',
    block: true,
  },
  {
    type: 'input',
    placeholder: global.$t('请输入手机号'),
    prop: 'mobile',
    leftIconSlot: 'userIcon',
    block: true,
    label: global.$t('手机号'),
    labelSlot: 'phoneArea',
  },
  {
    type: 'input',
    placeholder: global.$t('请输入邮箱号码'),
    prop: 'email',
    leftIconSlot: 'userIcon',
    label: global.$t('邮箱'),
    block: true,
  },
  {
    type: 'input',
    placeholder: global.$t('请输入推荐码'),
    prop: 'id',
    leftIconSlot: 'codeIcon',
    label: global.$t('推荐码 (选填)'),
    block: true,
    defaultValue: sessionStorage.getItem('agentCode') || '',
    blockSlot: 'labelIcon',
    class: accountShow.value ? 'show' : 'hide',
  },
]);

const bindMobileColumns = computed(() => {
  const base = [
    {
      type: 'input',
      placeholder: global.$t('请输入手机号'),
      prop: 'mobile',
      leftIconSlot: 'userIcon',
      labelSlot: 'phoneArea',
      block: true,
    },
  ];
  if (registerType.value === 4) {
    base.push({
      type: 'number',
      placeholder: global.$t('请输入验证码'),
      prop: 'code',
      buttonSlot: 'buttonSlot',
      label: global.$t('验证码'),
    });
  }
  return base;
});

const mobileShow = ref(false);
const mobileColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入手机号'),
    prop: 'mobile',
    leftIconSlot: 'userIcon',
    block: true,
    label: global.$t('手机号'),
    labelSlot: 'phoneArea',
  },
  {
    type: 'number',
    placeholder: global.$t('请输入验证码'),
    prop: 'code',
    buttonSlot: 'buttonSlot',
    label: global.$t('验证码'),
    block: true,
  },
  {
    type: 'input',
    placeholder: global.$t('请输入推荐码'),
    prop: 'id',
    leftIconSlot: 'codeIcon',
    label: global.$t('推荐码 (选填)'),
    block: true,
    defaultValue: sessionStorage.getItem('agentCode') || '',
    blockSlot: 'labelIcon',
    class: mobileShow.value ? 'show' : 'hide',
  },
]);

function showRec(type) {
  if (type === 'account') {
    accountShow.value = !accountShow.value;
    accountColumns[5].class = accountShow.value ? 'show' : 'hide';
  } else {
    mobileShow.value = !mobileShow.value;
    mobileColumns[2].class = mobileShow.value ? 'show' : 'hide';
  }
}

function onAreaCodeConfirm(event) {
  areaCode.value = event;
  isShowAreaPopup.value = false;
}

const { user } = $store.state;

const { run: getSiteInfo } = useRequest(
  () => siteinfo(accountRef.value ? accountRef.value.data : {}),
  {
    manual: false,
    onSuccess(info) {
      registerType.value = Number(info?.h5_register_setting?.username_register ?? 1);
    },
  },
);

const bindFormRef = ref({});

function confirmRegister() {
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

  if (!data.mobile) {
    Toast.fail(global.$t('请输入手机号'));
    return;
  }
  if (!data.email) {
    Toast.fail(global.$t('请输入邮箱'));
    return;
  }

  registerType.value === 1 ? doRegister() : (isShowMobileBind.value = true);
}

function confirmBind() {
  if (registerType.value > 2 && !bindFormRef.value.data.mobile) {
    Toast.fail(global.$t('请输入手机号'));
    return;
  }

  if (registerType.value === 4 && !bindFormRef.value.data.code) {
    Toast.fail(global.$t('请输入验证码'));
    return;
  }

  doRegister({
    ...bindFormRef.value.data,
    phone_area_code: areaCode.value,
  });
  // isShowMobileBind.value = false;
}

function doRegister(params = {}) {
  let registerInfo = {
    name: 'account',
    data: {},
  };

  accountRef.value.data.id = accountRef.value.data.id || (sessionStorage.getItem('agentCode') || '');

  registerInfo = {
    name: 'account',
    data: {
      ...accountRef.value.data,
      ...params,
      phone_area_code: areaCode.value,
    },
  };
  $store.dispatch('user/register', registerInfo)
    .then(() => {
      Toast.success(global.$t('注册成功'));
      global.$router.push('/user');
    })
    .catch((e) => console.error(e));
}

const {
  run: postSendSmsCode,
  loading: sendCodeLoading,
} = useRequest(smscode, {
  manual: true,
});

const isCounting = ref(false);
const seconds = ref(60);

async function sendCode() {
  if (isCounting.value) {
    return;
  }

  let data = {};
  if (activeName.value === 0) {
    data = bindFormRef.value.data;
  } else {
    data = mobileRef.value.data;
  }

  if (!/^[0-9]*$/.test(data.mobile)) {
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

// 获取navbar的高度
onMounted(async () => {
  const proxy = getCurrentInstance();
  const navBarRef = proxy.refs.navBarRef;
  navBarHeight.value = navBarRef?.offsetHeight;
  getSiteInfo();

  let res = await spreadcodecurrency({
    domain: location.host,
  });

  if (typeof res?.inte_currency_id !== 'undefined') {
    confirmCurrency(res);
    areaCode.value = res.phone_area_code;
    return;
  }

  const { app } = $store.state;
  const agentCode = sessionStorage.getItem('agentCode');

  if (agentCode) {
    res = await spreadcodecurrency({
      code: agentCode,
    });
    if (typeof res?.inte_currency_id !== 'undefined') {
      confirmCurrency(res);
      areaCode.value = res.phone_area_code;
      return;
    }
  }

  if (app.isLangMatching) {
    confirmCurrency(app.regionData);
  } else {
    currencyShow.value = true;
  }
  areaCode.value = app.langMatchingAreaCode;
});

function confirmCurrency(res) {
  accountRef.value.data.inte_region_id = res.inte_region_id;
  accountRef.value.data.inte_currency_id = res.inte_currency_id;

  registerType.value = res.registerType;
  currencyShow.value = false;
}

</script>

<style lang="less" scoped>
:deep(.van-tab) {
  color: var(--font-color-ffffff);
  opacity: 0.5;
  font-size: 28px;
}

:deep(.van-tabs) {
  .van-tabs__wrap {
    border-bottom: 0;
  }
}

:deep(.van-tab--active) {
  opacity: 1;
}

:deep(.van-tabs__line) {
  width: 104px;
  height: 8px;
  border-radius: 4px;
}

:deep(.van-col--8) {
  text-align: center;
}

:deep(.van-checkbox__label) {
  color: var(--font-color-ffffff);
  font-size: 26px;
  font-weight: 500;
}

:deep(.van-checkbox__icon) {
  line-height: 45px;
}

:deep(.van-button--plain) {
  background: rgba(0, 0, 0, 0.0000001);
  color: var(--dark-666, var(--font-color-ffffff));
  border-color: var(--dark-666);
}

:deep(.van-tabs__nav) {
  margin: auto;
}

.register-container {
  overflow-y: scroll;
  .register-wrap {
    //overflow-y: scroll;
    //height: 100%;
    &-tabs {
      width: 100%;
      :deep(.van-tabs__wrap) {
        display: flex;
        padding: 0;
      }
      :deep(.van-tab) {
        margin: 0 30px;
      }
    }
    &-navBar {
      order: -1;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 999999;
      .svg-icon-wrap {
        width: 48px;
        height: 48px;
      }

      .logo {
        width: 240px;
        height: 36px;
      }

      :deep(.van-nav-bar__content) {
        background-color: var(--dark-bg-color-000, var(--theme-color));

        .van-nav-bar__title {
          display: flex;
          align-items: center;
        }
      }
    }

    &-brand {
      width: 100%;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      :deep(.van-col) {
        position: relative;
        span {
          font-size: 16px;
          line-height: 24px;
          position: absolute;
          width: 100%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          &:nth-child(2) {
            color: var(--theme-color);
            top: 146px;
          }
          &:nth-child(3) {
            color: var(--dark-fff, var(--font-color-333333));
            bottom: 20px;
          }
        }
      }
    }

    &-from {
      width: 100%;
      text-align: left;
      margin-top: 30px;

      &-lable {
        font-size: 36px;
        font-weight: 500;
        color: var(--font-color-ffffff);
        line-height: 50px;
      }

      &-item {
        .phone {
          position: relative;

          :deep(.van-field__control) {
            padding-left: 120px;
          }

          &-line {
            width: 2px;
            height: 48px;
            background: var(--bg-color-d1d1d1);
            position: absolute;
            left: 120px;
            top: 86px;
          }

          .area-code {
            font-size: 32px;
            font-weight: 500;
            color: var(--font-color-404040);
            position: absolute;
            left: 30px;
            top: 86px;
          }
        }

        :deep(.config-form-wrap) {
          overflow: hidden;

          .block-label {
            padding-bottom: 0;
          }

          .van-cell {
            margin-bottom: 22px;
            background-color: var(
              --dark-bg-color-191919,
              var(--bg-color-ffffff)
            );
            min-height: 80px !important;
            height: 80px;

            &:last-child {
              margin-bottom: 32px;
            }

            [labelslot="phoneArea"] {
              .van-cell__value {
                padding-left: 30px;
              }
            }

            .van-icon {
              font-size: 32px;
              margin-left: 18px;
              color: var(--dark-fff, var(--font-color-333333)) !important;
            }

            .van-button {
              border: 0;
              color: var(--theme-color);
            }
          }
        }
      }

      .select {
        margin-top: 52px;
        position: relative;

        .arrow-icon {
          position: absolute;
          right: 40px;
          top: 90px;
        }
      }

      .password {
        margin-top: 52px;
        position: relative;

        img {
          width: 36px;
          height: 32px;
          position: absolute;
          right: 40px;
          top: 90px;
        }

        .get-area-code {
          position: absolute;
          right: 40px;
          top: 85px;
          font-size: 32px;
          font-weight: 500;
          color: var(--font-color-24c29a);
        }
      }

      .img-icon {
        width: 30px;
        height: 30px;
      }

      .remember-password {
        margin-top: 32px;
      }
    }

    &-content {
      width: 100vw;
      height: 100%;
      flex-grow: 1;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 0 36px 0 34px;
      background: var(--dark-bg-color-000, var(--background-007658));
      display: flex;
      flex-direction: column;
      align-items: center;
      .brand {
        width: 204px;
        height: 204px;
      }
    }

    .login {
      margin: 0px 0 32px 0;
    }

    &-footer {
      display: flex;
      align-items: center;
      text-decoration: underline;
      font-size: 26px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 40px;
      flex: 1;
      min-height: 50px;
      margin: auto 0;

      .svg-icon-wrap {
        height: 30px;
        width: 30px;
        margin-right: 8px;
      }

      .line {
        width: 2px;
        height: 58px;
        background: var(--bg-color-ffffff);
        margin: 0 66px 0 52px;
      }
    }

    :deep(.van-field__value) {
      display: flex;
      align-items: center;
    }

    :deep(.van-tabs__content) {
      display: none;
    }

    :deep(.van-tabs__wrap) {
      border: none;

      .van-tab--active {
        color: var(--dark-theme-main, var(--font-color-ffffff));
      }

      .van-tabs__line {
        background-color: var(--dark-theme-main, var(--bg-color-ffffff));
      }
    }

    :deep(.van-field) {
      border-radius: 10px;
      margin-top: 8px;
      margin-bottom: 22px;
      box-sizing: border-box;

      &.hide {
        display: none;
      }

      &.show {
        display: flex;
      }
    }

    :deep(.van-field__button) {
      .van-button {
        height: 80px;
        line-height: 80px;
      }
    }

    .van-button {
      min-height: 60px;
      flex-shrink: 1;
    }
  }
}

.bind-mobile-wrap {
  padding: 24px 46px;
  align-items: center;

  .button-wrap {
    display: flex;
    margin-top: 50px;
    margin-bottom: 32px;

    .van-button--gray {
      margin-right: 28px;
    }

    .van-button {
      flex: 1;
    }
  }

  :deep(.van-cell) {
    padding-top: 8px;
    padding-bottom: 8px;
    box-sizing: border-box;
    min-height: 88px;

    .phone-area {
      height: 72px;
      &::after {
        height: 72px;
      }
    }

    &[buttonslot="buttonSlot"] {
      padding-right: 0 !important;
      .van-field__button {
        line-height: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        &::before {
          content: "";
          height: 72px;
          width: 2px;
          background-color: var(--dark-fff, var(--bg-color-d1d1d1));
        }
      }
    }

    .van-cell__title {
      min-height: 72px;
      width: auto;
      line-height: 72px;
    }

    .van-button {
      border: 0;
      line-height: 24px;
      height: 24px;
      color: var(--theme-color);
    }
  }

  :deep(.van-field) {
    border: 2px solid var(--dark-666, var(--border-color-00001));
  }
}
</style>
