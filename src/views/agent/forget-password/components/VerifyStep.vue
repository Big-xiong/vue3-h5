<template>
  <div class="verify-step-wrap">
    <p class="bind-text-wrap" v-if="selectWay.type !== 'question'">
      <span>{{ selectName }}:</span>
      {{ selectValue }}
    </p>

    <div class="verification-wrap">
      <van-field v-model="selectWay.text" readonly @click="showWaysPopup = true">
        <template #right-icon>
          <van-icon name="arrow-down"></van-icon>
        </template>
      </van-field>
    </div>

    <div class="verification-wrap" v-if="selectWay.type !== 'question'">
      <van-field :label="$t('验证码')" :placeholder="$t('请输入验证码')" input-align="right">
        <template #button>
          <span
            class="text-btn send"
            @click="sendCode"
            :loading="sendCodeLoading"
            :loading-text="$t('发送中...')"
            :disabled="sendCodeLoading || isCounting"
          >{{ codeText }}</span>
        </template>
      </van-field>
    </div>

    <div class="verification-wrap" v-if="selectWay.type === 'question'">
      <van-field :label="$t('密保答案')" :placeholder="$t('请输入答案')" input-align="right" />
    </div>

    <van-button type="primary" :loading="submitLoading" @click="submit">{{ $t("下一步") }}</van-button>
  </div>

  <van-popup round teleport="body" v-model:show="showWaysPopup" position="bottom">
    <van-picker
      show-toolbar
      @confirm="onConfirm"
      @cancel="showWaysPopup = false"
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
const selectWay = reactive({
  text: global.$t('手机号验证'),
  type: 'mobile',
});
const showQuestionPopup = ref(false);
const showWaysPopup = ref(false);
const answer = ref('');
const code = ref();
const questionList = ref([]);
const isCounting = ref(false);
const countDown = ref(60);
const timer = ref(0);
const isSended = ref(false);
const sendCodeLoading = ref(false);
const question = computed(() => {
  const { pass_question_id } = props.userSafeInfo;
  return questionList.value.find((item) => {
    if (item.id === pass_question_id) {
      return item;
    }
    return {};
  });
});

const selectValue = computed(() => {
  switch (selectWay) {
    case 'email': return props.userSafeInfo.email;
    case 'question': return question.value.name;
    default: return props.userSafeInfo.mobile;
  }
});

const selectName = computed(() => {
  switch (selectWay) {
    case 'email': return global.$t('已绑定邮箱');
    case 'question': return global.$t('密保问题');
    default: return global.$t('已绑定手机');
  }
});

const codeText = computed(() => {
  if (isCounting.value) {
    return `${global.$t('重新获取')}(${countDown.value})`;
  }

  return isSended.value ? global.$t('重新获取验证码') : global.$t('获取验证码');
});

const emit = defineEmits(['update:step', 'verifyType']);

useRequest(passquestion, {
  onSuccess(result) {
    questionList.value = result;
  },
});

function onConfirm(event) {
  selectWay.value = event;
  isSended.value = false;
  isCounting.value = false;
  countDown.value = 60;
  clearInterval(timer.value);
  showWaysPopup.value = false;
}

function sendCode() {
  let request = forgetpasssmscode;
  if (selectWay.value === 'email') {
    request = forgetpassemailcode;
  }
  countDown.value = 59;
  isCounting.value = true;
  timer.value = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value === 0) {
      isCounting.value.vaue = false;
      countDown.value = 60;
      clearInterval(timer.value);
    }
  }, 1000);
  sendCodeLoading.value = true;

  request({
    phone_area_code: props.userSafeInfo.phone_area_code,
    uid: props.userSafeInfo.id,
  }).finally(() => {
    sendCodeLoading.value = false;
    isSended.value = true;
    isCounting.value = false;
    clearInterval(timer.value);
  });
}

const verifyWays = computed(() => {
  const { mobile, email, pass_question_id } = props.userSafeInfo;
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

const submitLoading = ref(false);
function submit() {
  const data = {
    uid: props.userSafeInfo.id,
  };
  const { type } = selectWay;

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
    emit('update:step', 3);
    request
      .then((res) => {
        emit('update:step', 3);
        emit('verifyType', type);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  }
}
</script>

<style lang="less" scoped>
.verify-step-wrap {
  .verification-wrap {
    box-sizing: border-box;
    padding: 0 30px;
    background: var(--dark-bg-color-191919);
    &:last-of-type .van-field {
      border-bottom: none;
    }
  }

  .bind-text-wrap {
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-333333));
    margin-bottom: 20px;
    padding-left: 30px;
  }

  .text-btn {
    color: var(--theme-color);
    font-size: 28px;
    font-weight: 500;
  }
}
</style>
