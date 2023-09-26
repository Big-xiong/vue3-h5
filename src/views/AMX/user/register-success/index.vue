<template>
  <div class="register-success-wrap">
    <van-icon name="cross" @click="$router.push('/')"></van-icon>
    <div class="register-body">
      <div class="layout-flex-center login-wrap-logo">
        <img class="logo" :src="dicts?.siteinfo?.h5_logo ?? ''" alt />
      </div>
      <div class="register-body-main">
        <div class="register-info">
          <SvgIcon name="chenggong" />
          <p>{{ $t("恭喜您已成为") }}{{ $t(`${subConfig.title}`) }}{{ $t("尊贵会员") }}</p>
          <div>{{ $t("您的账号密码") }}</div>
        </div>
        <div class="accountInfo" id="capture">
          <div class="login-info">
            <div class="form-item-wrap">
              <div class="input">
                <label>{{ $t("账号") }}</label>
                <input
                  :placeholder="$t('请输入a开头的6-12位英文字母和数字')"
                  type="text"
                  :disabled="!editStatus.account"
                  v-model="username"
                />
                <template
                  v-if="
                    registerType === 'quick' &&
                    editPermission.account
                  "
                >
                  <a
                    v-if="editPermission.account && !editStatus.account"
                    @click="editStatus.account = true"
                  >{{ $t("修改") }}</a>
                </template>
              </div>
            </div>
            <div class="form-item-wrap">
              <div class="input">
                <label>{{ $t("密码") }}</label>
                <input
                  :disabled="!editStatus.password"
                  :placeholder="$t('密码6-20位数字及字母组成')"
                  type="text"
                  v-model="password"
                />
                <template v-if="editPermission.password">
                  <a
                    v-if="editPermission.password && !editStatus.password"
                    @click="editStatus.password = true"
                  >{{ $t("修改") }}</a>
                </template>
              </div>
            </div>
          </div>
          <div class="button-box" v-if="editStatus.account || editStatus.password">
            <van-button type="default" @click="onCancel">
              {{
                $t("取消修改")
              }}
            </van-button>
            <van-button
              type="default"
              @click="saveInfo"
              :loading="saveInfoLoading"
              :loading-text="$t('提交中...')"
            >{{ $t("提交保存") }}</van-button>
          </div>
          <div class="button-box" v-else>
            <van-button
              type="default"
              v-clipboard:copy="`账户名: ${username}\n密码: ${password}`"
              v-clipboard:success="() => Toast.success($t('复制成功'))"
            >{{ $t("复制账号密码") }}</van-button>
            <van-button type="default" @click="onScreenshot">{{ $t("截图保存") }}</van-button>
          </div>
        </div>
        <div class="new-activity" @click="$router.push({ path: '/promos' })">
          <img :src="$getSrc(`/src/assets/images/login/zc@2x.png`)" :alt="$t('新人礼物')" />
        </div>
        <van-button
          type="primary"
          class="withdraw-btn"
          @click="$router.push({ name: 'centerDeposit', query: { money: money } })"
        >{{ $t("立即存款") }}</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { firstchange } from '@/api/user';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const subConfig = inject('subConfig');
const $store = inject('store');
const { app: { dicts }, user } = $store.state;

const editStatus = reactive({
  account: false,
  password: false,
});
const editPermission = reactive({
  account: true,
  password: true,
});

const store = inject('store');
const route = useRoute();

const registerType = ref(route.query.name);
const username = ref('');
const password = ref(route.query.password || '');

watch(() => user.userInfo, (res) => {
  username.value = user?.userInfo?.username;
}, { immediate: true });

let cached = reactive({
  username: username.value,
  password: password.value,
});

const { run: saveInfo, loading: saveInfoLoading } = useRequest(
  () => firstchange({
    username: username.value,
    password: password.value,
  }),
  {
    manual: true,
    onSuccess() {
      cached = {
        username: username.value,
        password: password.value,
      };
      if (editStatus.account) {
        editPermission.account = false;
        editStatus.account = false;
      }
      if (editStatus.password) {
        editPermission.password = false;
        editStatus.password = false;
      }
      store.dispatch('user/getUserInfo');
      Toast.success(global.$t('账号修改成功'));
    },
  },
);

function onCancel() {
  editStatus.account = false;
  editStatus.password = false;
  username.value = cached.username;
  password.value = cached.password;
}

function onScreenshot() {
  Toast.fail(global.$t('请截图保存账户密码'));
}
</script>

<style scoped lang="less">
.register-success-wrap {
  height: 100%;
  overflow: auto;

  > .van-icon-cross {
    color: var(--font-color-ffffff);
    position: absolute;
    left: 30px;
    top: 30px;
    font-size: 44px;
  }

  .login-wrap-logo {
    text-align: center;
    flex-grow: 1;
    flex-direction: column;
    box-sizing: border-box;
    height: 474px;
    background-color: var(--bg-color-f7f7f7);

    .logo {
      width: 300px;
      margin: 0 auto;
    }
  }

  .register-body-main {
    background-color: var(--card-bg-color01);
    border-radius: 20px 20px 0 0;
    padding: 40px;
  }

  p {
    margin: 0;
  }

  .register-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 20px 20px 0 0;

    .svg-icon-wrap {
      width: 120px;
      height: 120px;
      margin-bottom: 15px;
    }

    p {
      height: 48px;
      font-size: 32px;
      font-weight: 600;
      color: var(--font-color-ffffff);
      line-height: 48px;
    }

    div {
      height: 40px;
      font-size: 28px;
      font-weight: 400;
      color: var(--font-color-999999);
      line-height: 40px;
      margin-top: 8px;
    }
  }

  .accountInfo {
    .login-info {
      text-align: center;
      font-size: 14;
      color: var(--font-color-ccc);

      .form-item-wrap {
        display: flex;
        padding: 0;
        margin: 30px 0;
        height: 96px;
        align-items: center;
        background: var(--bg-color-282828);
        border-bottom: 2px solid var(--border-color-323232);

        .input {
          border-radius: 0;

          input {
            color: var(--font-color-ffffff);
            background-color: transparent;
            border: none;
          }
          input[disabled],
          input:disabled {
            color: var(--font-color-ffffff);
            opacity: 1;
            -webkit-text-fill-color: var(--font-color-ffffff);
          }
        }

        label {
          width: 110px;
          color: var(--font-color-ffffff);
        }

        > div {
          flex: 1;
          text-align: left;
          display: flex;
        }

        a {
          margin-left: 20px;
          padding-right: 20px;
          color: var(--font-color-999);
        }

        input {
          flex: 1;
          width: 240px;
          outline: none;
          padding: 0 10px;
          border-radius: 4px;
        }
      }
    }

    p {
      height: 64px;
      line-height: 64px;
      text-align: center;
      font-size: 22px;
      color: var(--font-color-333333);
    }
  }

  .button-box {
    display: flex;
    justify-content: space-between;

    :deep(.van-button) {
      width: calc(50% - 15px);
      height: 100px;
      border-radius: 8px;
      font-size: 32px;
      background: var(--bg-color-112946);
      border-color: transparent;
      color: var(--font-color-white);
    }
  }

  .new-activity {
    margin: 30px 0;
    height: 124px;

    img {
      display: block;
      width: 100%;
    }
  }

  .withdraw-btn {
    font-size: 32px;
    width: 100%;
    display: block;
    font-weight: bold;
  }
}
</style>
