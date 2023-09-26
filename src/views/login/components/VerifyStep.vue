<template>
  <div class="verify-step-wrap">
    <p class="bind-info">
      <template v-if="data.selectWay.type === 'mobile'">
        <span>{{ $t('已绑定手机') }}</span>
        {{ userSafeInfo.phone_area_code || '' }} {{ userSafeInfo.mobile }}
      </template>
      <template v-if="data.selectWay.type === 'email'">
        <span>{{ $t('已绑定邮箱') }}</span>
        {{ userSafeInfo.email }}
      </template>
      <template v-if="data.selectWay.type === 'question'">
        <span>{{ $t('密保问题') }}</span>
        {{ question?.name || '' }}
      </template>
    </p>
    <div class="verification-wrap step-wrap" v-if="data.selectWay">
      <div class="code">{{ $t('请选择验证方式') }}</div>
      <div class="input" @click="showPopup = true">
        <div class="picker-text">{{ data.selectWay.text }}</div>
        <van-icon name="arrow-down" />
      </div>
    </div>

    <div
      :class="['verification-wrap', 'step-wrap', focus ? 'focused' : 'un-focus']"
      v-if="data.selectWay.type !== 'question'"
    >
      <div class="code">{{ $t('验证码') }}</div>
      <input
        type="text"
        v-model="code"
        @focus="focus = true"
        @blur="focus = false"
        :placeholder="$t('请输入验证码')"
      />
      <van-button
        @click="sendCode"
        class="send"
        :loading="sendCodeLoading"
        :loading-text="$t('发送中...')"
        :disabled="sendCodeLoading || isCounting"
      >{{ codeText }}</van-button>
    </div>

    <div
      :class="['verification-wrap', 'step-wrap', focus ? 'focused' : 'un-focus']"
      v-show="data.selectWay.type === 'question'"
    >
      <van-field
        class="question"
        v-model="answer"
        @focus="focus = true"
        @blur="focus = false"
        :label="$t('密保答案')"
        :placeholder="$t('请输入答案')"
        input-align="right"
      />

      <!-- <div class="input">
          <input class="question" v-model="answer" type="text" :placeholder="$t('请输入答案')" />
      </div>-->
    </div>
    <div class="step-two">
      <van-button
        type="primary"
        :loading="submitLoading"
        @click="submit"
        class="next"
      >{{ $t('下一步') }}</van-button>
    </div>
  </div>

  <van-popup teleport="body" v-model:show="showPopup" position="bottom" round>
    <van-picker
      show-toolbar
      @confirm="onConfirm"
      @cancel="showPopup = false"
      :columns="verifyWays"
    />
  </van-popup>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject,
  defineProps,
  reactive,
  ref,
  defineEmits,
  computed,
  watchEffect,
} from 'vue';
import { Toast } from 'vant';
import {
  forgetpasscode,
  forgetpassemailcode,
  forgetpassemailcodecheck,
  forgetpasssmscode,
  forgetsafequestion,
  passquestion,
} from '@/api/center';

const props = defineProps({
  userSafeInfo: {
    type: Object,
    default: () => ({}),
  },
  step: Number,
});

const global = inject('global');
const { user } = global.$store.state;

const data = reactive({
  selectWay: {
    text: global.$t('手机验证'),
    type: 'mobile',
  },
});
const showPopup = ref(false);
const answer = ref('');
const code = ref();
const questionList = ref([]);
const isCounting = ref(false);
const countDown = ref(60);
const timer = ref(0);
const isSended = ref(false);
const sendCodeLoading = ref(false);
const focus = ref(false);

const codeText = computed(() => {
  if (isCounting.value) {
    return `${global.$t('重新获取')}(${countDown.value})`;
  }

  return isSended.value ? global.$t('重新获取验证码') : global.$t('获取验证码');
});

const emit = defineEmits(['update:step', 'verifyData', 'verifyType']);

useRequest(passquestion, {
  onSuccess(result) {
    questionList.value = result;
  },
});

function onConfirm(event) {
  data.selectWay = event;
  isSended.value = false;
  isCounting.value = false;
  countDown.value = 60;
  clearInterval(timer.value);
  showPopup.value = false;
}

function sendCode() {
  let request = forgetpasssmscode;
  if (data.selectWay.type === 'email') {
    request = forgetpassemailcode;
  }
  countDown.value = 59;
  isCounting.value = true;
  timer.value = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value === 0) {
      isCounting.value = false;
      countDown.value = 60;
      clearInterval(timer.value);
    }
  }, 1000);
  sendCodeLoading.value = true;

  request({
    phone_area_code: props.userSafeInfo.phone_area_code,
    uid: props.userSafeInfo.id,
    mobile: user.userInfo.mobile,
  })
    .finally(() => {
      Toast.success(global.$t('验证码发送成功'));
      sendCodeLoading.value = false;
      isSended.value = true;
    });
}

const verifyWays = computed(() => {
  const {
    mobile,
    email,
    pass_question_id,
  } = props.userSafeInfo;
  const num = 0;
  // 判断是否有下拉校验
  const ways = [];
  if (mobile) {
    ways.push({
      text: global.$t('手机号验证'),
      type: 'mobile',
    });
  }
  if (email) {
    ways.push({
      text: global.$t('邮箱验证'),
      type: 'email',
    });
  }

  if (pass_question_id) {
    ways.push({
      text: global.$t('密保验证'),
      type: 'question',
    });
  }
  return ways;
});
data.selectWay = {
  text: verifyWays.value[0]?.text,
  type: verifyWays.value[0]?.type,
};

const question = computed(() => {
  const { pass_question_id } = props.userSafeInfo;
  return questionList.value.find((item) => {
    if (item.id === pass_question_id) {
      return item;
    }
    return {};
  });
});

const submitLoading = ref(false);

function submit() {
  const { type } = data.selectWay;
  data.uid = props.userSafeInfo.id;

  let request;
  if (type === 'question') {
    if (!answer.value) {
      Toast.fail(global.$t('请输入密保问题答案'));
    }

    Object.assign(data, {
      pass_question_id: question.value.id,
      pass_answer: answer.value,
    });

    request = forgetsafequestion(data);
  } else {
    if (!code.value) {
      Toast.fail(global.$t('请输入验证码'));
      return;
    }

    Object.assign(data, {
      code: code.value,
      phone_area_code: props.userSafeInfo.phone_area_code,
    });

    if (type === 'mobile') {
      request = forgetpasscode(data);
    } else if (type === 'email') {
      request = forgetpassemailcodecheck(data);
    }
  }

  submitLoading.value = true;
  if (request) {
    request
      .then((res) => {
        emit('update:step', 3);
        emit('verifyType', type);
        emit('verifyData', data);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  }
}
</script>

<style lang="less" scoped>
.verify-step-wrap {
  width: 100%;
  /* margin-top: 54px; */
  /* padding: 0 36px 0 34px; */
  box-sizing: border-box;
  padding: 0 !important;

  .bind-info {
    padding: 0 30px;
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-333333));
  }

  font-size: 28px;

  > p {
    margin-bottom: 20px;
    color: var(--dark-fff, var(--font-color-333333));
  }

  .verification-wrap {
    padding: 0 30px !important;
    border-bottom: 2px solid var(--dark-333, var(--border-color-00001));
    height: 100px;
    display: flex;
    align-items: center;
    /* padding: 0 36px; */
    box-sizing: border-box;
    width: 100%;
    border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    /* justify-content: space-between; */
    overflow: hidden;
    background: var(--bg-color-white);
    .van-icon {
      font-size: 32px;
    }

    p {
      color: var(--dark-fff, var(--theme-color));
      font-size: 28px;
      font-weight: 600;
      display: block;
      white-space: nowrap;

      span {
        color: var(--font-color-969696);
      }
    }

    :deep(input) {
      font-size: 28px !important;
    }

    .code {
      display: flex;
      align-items: center;
      font-size: 28px;
      white-space: nowrap;
      font-weight: 500;
    }
    .van-field.question {
      padding-left: 0;
      padding-right: 0;
      :deep(.van-field__label) {
        color: var(--dark-fff, var(--font-color-000000));
      }
      :deep(.van-field__body) {
        width: 100%;
        input {
          padding-right: 0;
        }
      }
    }
    input {
      border: none;
      text-align: left;
      font-size: 28px;
      width: auto;
      color: var(--dark-fff, var(--font-color-333333));
      background: transparent;
    }

    :deep(.van-button) {
      border: none;
      white-space: nowrap;
      margin-left: auto;

      &::before {
        content: "";
      }
    }

    .input {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .question {
        text-align: left;
      }
    }
  }

  .picker-text {
    flex: 0 1 auto;
    color: var(--dark-fff, var(--font-color-000000));
    font-size: 28px;
    font-weight: 500;
  }

  .step-two {
    text-align: center;
    .van-button {
      font-size: 32px;
    }
  }

  :deep(.van-button:not(.send)) {
    width: 690px;
  }

  .van-button.next {
    margin-top: 82px;
  }
}
</style>
