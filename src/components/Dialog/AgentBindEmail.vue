<template>
  <Dialog
    :title="$t('绑定邮箱地址')"
    v-model:show="isShow"
    @confirm="submit"
    @cancel="isShow = false"
    show-cancel-btn
    :width="670"
    :confirm-btn-text="$t('提交')"
    closeIcon
  >
    <div class="agent-email-wrap">
      <Form :columns="columns" ref="FormRef" @onConfirm="submit"></Form>
      <div class="code-wrap">
        <input v-model="code" class="field-input" :placeholder="$t('请输入验证码')" />
        <van-button
          :loading="sendCodeLoading"
          :loading-text="$t('发送中')"
          @click="sendCode"
        >{{ isCounting ? `${$t('重新获取')}(${seconds})` : $t('获取验证码') }}</van-button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, watch, defineEmits,
} from 'vue';
import { Toast } from 'vant';
import { getEmailcode, bindemail } from '@/api/agent';
import Form from '../Form/index.vue';
import Dialog from './index.vue';

const props = defineProps({
  callback: Function,
});
const isShow = ref(true);

const store = inject('store');
const { agent } = store.state;
const code = ref('');

const userInfo = ref({});

watch(() => agent.userInfo, (info) => userInfo.value = info);

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    prop: 'email',
    block: true,
    placeholder: global.$t('请输入您的邮箱'),
    defaultValue: agent.userInfo.email,
    rule: [{
      required: true,
      trigger: 'blur',
      validator: (value) => /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/.test(value),
    }],
  },
]);

const isCounting = ref(false);
const seconds = ref(10);
const FormRef = ref(null);

const interval = 0;

const {
  run: postEmailCode,
  loading: sendCodeLoading,
} = useRequest(
  (params) => getEmailcode(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('发送成功'));
      isCounting.value = true;
      seconds.value = 10;
      setInterval(() => {
        seconds.value -= 1;
        if (seconds.value === 0) {
          clearInterval(interval);
          isCounting.value = false;
          seconds.value = 10;
        }
      }, 1000);
    },
  },
);

async function sendCode() {
  if (isCounting.value) {
    return;
  }

  FormRef.value.form
    .validate()
    .then(async () => {
      await postEmailCode({
        uid: userInfo.value.id,
        ...FormRef.value.data,
      });
    })
    .catch((e) => {
      Toast.fail(global.$t('请输入正确的邮箱地址'));
    });
}

const {
  run: postBindEmail,
  loading: bindEmailLoading,
} = useRequest(
  () => bindemail({
    ...FormRef.value.data,
    code: code.value,
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success({
        message: global.$t('绑定成功'),
      });
      props.callback?.();
      isShow.value = false;
    },
  },
);

function submit() {
  FormRef.value.form.validate()
    .then((res) => postBindEmail())
    .catch((res) => {
      if (res[0].name === 'email') {
        Toast.fail(global.$t('请输入正确的邮箱地址'));
      } else {
        Toast.fail(global.$t('请输入验证码'));
      }
    });
}
</script>

<style lang="less" scoped>
.agent-email-wrap {
  padding: 28px 40px 40px 40px;

  :deep(.block-label) {
    display: none;
  }

  .code-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;

    input {
      width: 320px;
      padding-left: 30px;
      font-size: 28px;
      border-color: var(--dark-666, var(--border-color-00002));
      color: var(--dark-fff, var(--font-color-222930));

      &::placeholder {
        color: var(--dark-999, var(--font-color-cccccc));
      }
    }

    :deep(.van-button) {
      width: 240px;
      height: 84px;
      .van-button__content {
        white-space: nowrap;
      }
    }
  }

  .field-input,
  :deep(.van-field) {
    box-sizing: border-box;
    height: 84px;
    border: 2px solid var(--dark-666, var(--border-color-00002));
    background-color: var(--dark-bg-color-191919);
    border-radius: 8px;
  }
}

:deep(.van-field__body) {
  input {
    font-size: 28px;
  }
}
</style>
