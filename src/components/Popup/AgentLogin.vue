<template>
  <Popup
    :showCancelBtn="false"
    position="center"
    :customClose="true"
    :round="false"
    v-model:show="isShowPopup"
    noDefaultWidth
  >
    <div class="agent-login-wrap">
      <div class="popup-title-wrap layout-flex-center">
        {{ $t('加入{0}，百万佣金不是梦',[subConfig.title]) }}
        <van-icon
          name="cross"
          @click="isShowPopup = false"
        />
      </div>
      <div class="bind-form-wrap">
        <Form
          :columns="columns"
          ref="FormRef"
          theme="blockLabel"
        ></Form>
        <div class="btn-wrap">
          <van-button
            :loading="submitLoading"
            :loading-text="$t('登录中')"
            type="primary"
            @click="submit"
          >{{ $t('登录') }}</van-button>
        </div>
        <div class="bottom">
          <!--            <span @click="onAgentForgetClick">{{$t('忘记密码')}}？</span>-->
          <span @click="onAgentRegisterClick">{{ $t('代理注册') }}</span>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, defineProps, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import Form from '@/components/Form/index.vue';
import { login } from '@/api/agent';
import Popup from './index.vue';

const subConfig = inject('subConfig');
const open = ref(true);
const isShowPopup = ref(false);
setTimeout(() => {
  isShowPopup.value = true;
}, 100);

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const props = defineProps({
  goRegister: Function,
  goForget: Function,
});

const FormRef = ref(null);

const columns = computed(() => [
  {
    type: 'input',
    label: global.$t('代理账号：'),
    prop: 'username',
    block: true,
    required: true,
    placeholder: global.$t('请输入代理账号'),
  },
  {
    type: 'password',
    extraSlot: 'code',
    label: global.$t('密码：'),
    prop: 'password',
    block: true,
    required: true,
    placeholder: global.$t('请输入密码'),
  },
]);

function onAgentForgetClick() {
  props?.goForget?.();
  isShowPopup.value = false;
}

function onAgentRegisterClick() {
  props?.goRegister?.();
  isShowPopup.value = false;
}

const { run: submit, loading: submitLoading } = useRequest(() => login(FormRef.value.data), {
  manual: true,
  async onSuccess(loginResult) {
    Cookies.set('agent_access_token', loginResult.access_token);
    Toast.success(global.$t('登录成功！'));
    await $store.dispatch('agent/getUserInfo');
    global.$router.push({ name: 'agentCenter' });
    isShowPopup.value = false;
  },
  onError(res) {
    if (res.code === -5) {
      isShowPopup.value = false;
    }
  },
});
</script>

<style lang="less" scoped>
.bind-form-wrap {
  padding: 40px 40px 44px;
}
:deep(.van-field) {
  background-color: var(--dark-000, var(--bg-color-191919));
  height: 84px !important;
  border: 2px solid var(--dark-666, var(--border-color-00001));
  border-radius: 8px;
  margin-bottom: 40px;
}
:deep(.van-cell::after) {
  border: none;
}
.van-button {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}
.van-button--success {
  background-color: var(--bg-color-24c29a);
  border: none;
}
.btn-wrap .van-button {
  flex: 1;
  margin-bottom: 30px;
}
:deep(.van-icon) {
  color: var(--font-color-ffffff) !important;
  margin-left: 30px;
  font-size: 45px !important;
}
.popup-title-wrap {
  width: 676px;
  background-color: var(--theme-color);
  height: 160px;
  color: var(--font-color-ffffff);
  padding: 0 22px 0 44px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  font-size: 36px;
  vertical-align: middle;
  text-align: center;
  position: relative;
  line-height: 40px;
  border-bottom: none;
  :deep(.van-icon) {
    transform: translateY(-2px);
    height: auto;
  }
}
.icon {
  z-index: 2;
  img {
    width: 32px;
    height: 24px;
  }
}
:deep(.config-form-wrap .block-label) {
  font-size: 36px;
}
.bottom {
  font-size: 28px;
  line-height: 42px;
  font-weight: 400;
  justify-content: flex-end;
  display: flex;
  //span:nth-child(1) {
  //  color: var(--font-color-929292);
  //}
  span:nth-child(1) {
    color: var(--theme-color);
  }
}
</style>
