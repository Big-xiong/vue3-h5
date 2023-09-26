<template>
  <Popup
    v-model:show="isShow"
    :showConfirmBtn="false"
    :showCancelBtn="false"
    @onClose="onClose"
    @onCancel="onClose"
    :close-on-click-overlay="true"
    position="bottom"
  >
    <div class="register-success-wrap">
      <div class="register-info">
        <img
          :src="$getSrc(`/src/assets/images/chenggong@2x.png`)"
          alt
        />
        <p>{{ $t('恭喜您已成为{0}尊贵会员',[subConfig.title]) }}</p>
      </div>
      <div
        class="accountInfo"
        id="capture"
      >
        <div class="login-info">
          <div class="form-item-wrap">
            <div class="input">
              <label>{{ $t('账号') }}</label>
              <input
                :placeholder="$t('请输入a开头的6-12位英文字母和数字')"
                type="text"
                :disabled="!editStatus.account"
                v-model="username"
              />
              <template v-if="
                  registerType === 'quick' &&
                  editPermission.account &&
                  !editStatus.account
                ">
                <a
                  v-if="editPermission.account"
                  @click="editStatus.account = true"
                >{{ $t('修改') }}</a>
              </template>
            </div>
          </div>
          <div class="form-item-wrap">
            <div class="input">
              <label>{{ $t('密码') }}</label>
              <input
                :placeholder="$t('密码6-20位数字及字母组成')"
                type="text"
                v-model="password"
              />
              <template v-if="editPermission.password">
                <a
                  v-if="editPermission.password && !editStatus.password"
                  @click="editStatus.password = true"
                >{{ $t('修改') }}</a>
              </template>
            </div>
          </div>
          <div class="form-item-wrap">
            <div class="input">
              <label>{{ $t('地区') }}</label>
              <input
                type="text"
                readonly
                v-model="region"
              />
            </div>
          </div>
          <div class="form-item-wrap">
            <div class="input">
              <label>{{ $t('货币') }}</label>
              <input
                type="text"
                readonly
                v-model="currency"
              />
            </div>
          </div>
        </div>
        <div
          class="button-box"
          v-if="editStatus.account || editStatus.password"
        >
          <van-button
            type="success"
            @click="onCancel"
          >{{ $t('取消修改') }}</van-button>
          <van-button
            type="success"
            @click="saveInfo"
            :loading="saveInfoLoading"
            :loading-text="$t('提交中...')"
          >{{ $t('提交保存') }}</van-button>
        </div>
        <div
          class="button-box"
          v-else
        >
          <van-button
            type="success"
            v-clipboard:copy="`账户名: ${username}\n密码: ${password}`"
            v-clipboard:success="() => Toast.success('复制成功')"
          >{{ $t('复制账号密码') }}</van-button>
          <van-button
            type="success"
            @click="onScreenshot"
          >{{ $t('截图保存') }}</van-button>
        </div>
      </div>
      <div
        class="new-activity"
        @click="isShow=false,isToDiscountPage=true,router.push({ name: 'centerDeposit', query: { money } })"
      >
        <img
          :src="$getSrc(`/src/assets/images/login/zc@2x.png`)"
          :alt="$t('新人礼物')"
        />
      </div>
      <van-button
        type="success"
        class="withdraw-btn"
        @click="router.push({ name: 'centerDeposit', query: { money } })"
      >{{ $t('立即存款') }}</van-button>
    </div>
  </Popup>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import {
  inject, reactive, ref, defineProps,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firstchange } from '@/api/user';
import Popup from './index.vue';
const isToDiscountPage = ref(false);
const isShow = ref(true);
setTimeout(() => {
  isShow.value = true;
}, 100);

const global = inject('global');
const store = inject('store');
const route = useRoute();
const router = useRouter();
const { dicts } = store.state.app;
const region = ref('');
const currency = ref('');
const subConfig = inject('subConfig');

const editStatus = reactive({
  account: false,
  password: false,
});
const editPermission = reactive({
  account: false,
  password: true,
});

const props = defineProps({
  registerInfo: {
    default: () => ({
      name: 'account',
      data: {
        username: '',
        password: '',
        inte_region_id: '',
        inte_currency_id: '',
      },

    }),
    type: Object,
  },
});

const registerType = ref(props.registerInfo?.name ?? '');
const username = ref(props.registerInfo.data?.username);
const password = ref(props.registerInfo.data.password);

let cached = reactive({
  username: username.value,
  password: password.value,
});

region.value = dicts?.regionlist.filter((item) => item.id === props.registerInfo.data.inte_region_id)[0].name;
const list = dicts?.regionlist.filter((item) => item.id === props.registerInfo.data.inte_region_id)[0]?.currency_conf?.list ?? [];
currency.value = list.filter((item) => item.id === props.registerInfo.data.inte_currency_id)[0].name;

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

function onClose() {
  isShow.value = false;
  if (!isToDiscountPage.value) {
    router.push({ name: 'home' });
  } else {
    isToDiscountPage.value = false;
  }
}

function onScreenshot() {
  Toast.fail(global.$t('请截图保存账户密码'));
}

</script>

<style lang="less" scoped>
.register-success-wrap {
  padding: 40px;
  .register-info {
    text-align: center;
    img {
      width: 120px;
    }
    p {
      font-size: 32px;
      color: var(--dark-fff, var(--font-color-333333));
      font-weight: 600;
    }
  }
  .accountInfo {
    .form-item-wrap {
      line-height: 100px;
      color: var(--font-color-333333);
      border-bottom: 2px solid var(--border-color-00001);
      .input {
        font-size: 28px;
        display: flex;
        label {
          margin-right: 47px;
          color: var(--dark-fff, var(--font-color-333333));
        }
        input {
          border: 0;
          flex: 1;
          background: transparent;
          color: var(--dark-fff, var(--font-color-333333));
        }
        a {
          color: var(--dark-fff, var(--font-color-333333));
        }
      }
    }
    .button-box {
      display: flex;
      justify-content: space-between;
      margin: 46px 0 30px;
      .van-button {
        width: 330px;
      }
    }
  }
  .new-activity {
    img {
      width: 100%;
    }
  }
  .withdraw-btn {
    width: 100%;
    margin-top: 30px;
  }
}
</style>
