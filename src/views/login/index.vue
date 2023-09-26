<template>
  <div class="login-wrap">
    <div class="login-wrap-navBar">
      <van-nav-bar
        :safe-area-inset-top="true"
        :border="false"
      >
        <template #left>
          <van-icon
            name="arrow-left"
            color="#fff"
            @click="goBack"
          />
        </template>
        <template #title>
          <img
            class="logo"
            :src="$getSrc(`/src/assets/images/logo.png`)"
          />
        </template>
        <template #right>
          <SvgIcon
            @click="$openKefu"
            name="kefu"
          />
        </template>
      </van-nav-bar>
    </div>
    <div class="login-wrap-content">
      <van-row class="login-wrap-brand">
        <van-col span="8">
          <img
            class="brand"
            :src="$getSrc(`/src/assets/images/login/1.png`)"
          />
          <span>{{ $t('官方球衣赞助商') }}</span>
          <span>Slavia Prague</span>
        </van-col>
        <van-col span="8">
          <img
            class="brand"
            :src="$getSrc(`/src/assets/images/login/2.png`)"
          />
          <span>{{ $t('亚洲官方投注伙伴') }}</span>
          <span>Dynamo Kiev</span>
        </van-col>
        <van-col span="8">
          <img
            class="brand"
            :src="$getSrc(`/src/assets/images/login/3.png`)"
          />
          <span>{{ $t('BLIZZWIN品牌大使') }}</span>
          <span>{{ $t('维尔科斯基') }}</span>
        </van-col>
      </van-row>
      <div class="login-wrap-from">
        <div class="login-wrap-from-item">
          <Form
            id="login-form"
            padding
            ref="accountRef"
            :columns="accountColumns"
          >
            <!-- <template #userIcon>
                  <img :src="$getSrc(`/src/assets/images/login/user@2x.png`)" alt="" />
                </template>
                <template #passIcon>
                  <img :src="$getSrc(`/src/assets/images/login/pass@2x.png`)" alt="" />
            </template>-->
          </Form>
        </div>
        <van-button
          :loading="user.loginLoading"
          :loading-text="$t('登录中')"
          class="login"
          color="#24C29A"
          block
          @click="submit"
        >{{ $t('登录') }}</van-button>
      </div>
      <div class="login-wrap-footer">
        <span @click="$router.push('/forget-password')">{{ $t('忘记密码？') }}</span>
        <div class="line"></div>
        <span @click="$router.push('/register')">{{ $t('用户注册') }}</span>
      </div>
    </div>
    <PhonePopup
      :show="isShowAreaPopup"
      :areaCode="areaCode"
      @confirm="onAreaCodeConfirm($event)"
      @close="isShowAreaPopup = false"
    />
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, onMounted,
} from 'vue';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import PhonePopup from '@/components/Popup/PhoneAreaPopup.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const $store = inject('store');
const global = inject('global');
const { user } = $store.state;
const accountRef = ref(null);

const accountColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入帐号'),
    prop: 'username',
    block: true,
    label: global.$t('账号'),
    rule: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入帐号'),
      },
    ],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    label: global.$t('密码'),
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

// 密码增加小眼睛切换
const eyeClickHandle = () => {
  if (accountColumns[1].type === 'password') {
    accountColumns[1].type = 'input';
  } else {
    accountColumns[1].type = 'password';
  }
};
onMounted(() => {
  accountColumns[1].eyeClickHandle = eyeClickHandle;
});

// const mobileColumns = reactive([
//   {
//     type: 'input',
//     placeholder: global.$t('请输入手机号'),
//     prop: 'mobile',
//     block: true,
//     label: global.$t('手机号'),
//     labelSlot: 'phoneArea',
//   },
//   {
//     type: 'number',
//     placeholder: global.$t('请输入验证码'),
//     prop: 'code',
//     buttonSlot: 'buttonSlot',
//     label: global.$t('验证码'),
//     block: true,
//   },
// ]);

const isShowAreaPopup = ref(false);

function goBack() {
  if ($store.state.user?.isLogin) {
    global.$router.go(-1);
  } else {
    global.$router.push({ name: 'home' });
  }
}

function onAreaCodeConfirm(event) {
  areaCode.value = event;
  isShowAreaPopup.value = false;
}

async function submit() {
  const { data } = accountRef.value;
  if (!data.username) {
    Toast.fail(global.$t('请输入账号'));
    return;
  }

  if (!data.password) {
    Toast.fail(global.$t('请输入密码'));
    return;
  }
  $store.dispatch(
    'user/login',
    accountRef.value.data,
  )
    .then((result) => {
      Toast.success(global.$t('登录成功!'));
      global.$router.push('/');
    });
}
</script>

<style lang="less" scoped>
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

.login-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-navBar {
    order: -1;

    .logo {
      width: 240px;
      height: 36px;
    }

    .svg-icon-wrap {
      width: 48px;
      height: 48px;
      fill: var(--bg-color-ffffff);
    }

    :deep(.van-nav-bar__content) {
      background-color: var(--dark-bg-color-000, var(--theme-color));
    }
  }

  &-brand {
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 66px;

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
    margin-top: 70px;

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
        .van-cell {
          margin-bottom: 52px;
          flex-grow: 0;
          height: 84px;
          min-height: 84px;
          background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));

          &:last-child {
            margin-bottom: 32px;
          }
        }
      }
    }

    :deep(.van-field) {
      border-radius: 10px;
      margin-top: 8px;
      box-sizing: border-box;
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
    box-sizing: border-box;
    padding: 0 36px 0 34px;
    background: var(--dark-bg-color-000, var(--background-007658));
    display: flex;
    overflow-y: auto;
    flex: 1;
    flex-direction: column;
    align-items: center;

    .brand {
      width: 204px;
      height: 204px;
    }
  }

  .login {
    margin: 52px 0 32px 0;
  }

  &-footer {
    display: flex;
    align-items: center;
    font-size: 28px;
    font-weight: 500;
    color: var(--font-color-ffffff);
    line-height: 40px;
    margin: 66px 0 0px;
    padding-bottom: 40px;

    .line {
      width: 2px;
      height: 58px;
      background: var(--bg-color-ffffff);
      margin: 0 66px 0 52px;
    }
  }
}
</style>
