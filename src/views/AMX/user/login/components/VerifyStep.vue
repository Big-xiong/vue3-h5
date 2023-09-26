<template>
  <div class="verify-step-wrap">
    <div class="verification-wrap" v-if="selectWay">
      <p>
        <span>{{ $t("验证方式") }}</span>
      </p>
      <div class="input" @click="showPopup = true">
        <div class="picker-text">{{ selectWay.text }}</div>
        <img :src="$getSrc(`/src/assets/images/xiala@2x.png`)" alt />
      </div>
    </div>

    <div class="verification-wrap" v-if="selectWay.type !== 'question'">
      <p>
        <span>{{ $t("已绑定手机") }}</span>
        {{ userSafeInfo.mobile }}
      </p>
      <div class="code">
        <div class="input">
          <img class="img" :src="$getSrc(`/src/assets/images/mbwt@2x.png`)" alt />
          <input type="text" v-model="code" :placeholder="$t('请输入验证码')" />
        </div>

        <van-button
          type="gray"
          @click="sendCode"
          class="send"
          :loading="sendCodeLoading"
          :loading-text="$t('发送中...')"
          :disabled="sendCodeLoading || isCounting"
        >{{ codeText }}</van-button>
      </div>
    </div>

    <div class="verification-wrap" v-show="selectWay.type === 'question'">
      <p>
        <span>{{ $t("密保问题") }}</span>
        {{ question?.name || "" }}
      </p>
      <div class="code">
        <div class="input">
          <input v-model="answer" type="text" :placeholder="$t('请输入答案')" />
        </div>
      </div>
    </div>

    <van-button
      :type="code || answer ? 'primary' : 'gray'"
      :loading="submitLoading"
      @click="submit"
    >{{ $t("下一步") }}</van-button>
  </div>

  <van-popup teleport="#app" v-model:show="showPopup" position="bottom">
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
const selectWay = reactive({
  text: '手机号验证',
  type: 'mobile',
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

const codeText = computed(() => {
  if (isCounting.value) {
    return `${$t('重新获取')}(${countDown.value})`;
  }

  return isSended.value ? global.$t('重新获取验证码') : global.$t('获取验证码');
});

const emit = defineEmits(['update:step']);

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
      })
      .finally(() => {
        submitLoading.value = false;
      });
  }
}
</script>

<style scoped lang="less">
.verify-step-wrap {
  .verification-wrap {
    margin-top: 30px;
    margin-bottom: 60px;

    p {
      color: var(--theme-color);
      font-size: 28px;
      margin: 0 0 15px 0;
      font-weight: 600;

      span {
        color: var(--font-color-969696);
      }
    }

    .code {
      position: relative;
      margin-top: 10px;
      display: flex;

      .img {
        margin-left: 20px;
        margin-right: 20px;
      }

      .send {
        margin-left: 26px;
        min-width: 220px;
        white-space: nowrap;
        height: 88px;
        background-color: var(--bg-color-353435);
        border-radius: 8px;
        line-height: 88px;
        text-align: center;
        color: var(--font-color-f5f5f5);
        font-size: 28px;
      }
    }

    input {
      height: 88px;
      line-height: 88px;
      border-radius: 8px;
      flex: 1;
      border: none;
      color: var(--font-color-fff);
      font-size: 32px;
    }
  }

  .picker-text {
    flex: 1;
    color: var(--font-color-fff);
    font-size: 32px;
    margin-left: 30px;
  }
}
</style>
