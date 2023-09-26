import {
  inject,
  ref,
  computed,
  onMounted,
} from 'vue';
import { Toast } from 'vant';
import { useDicts } from '@/utils/hooks.js';
import {
  forgetpasscode,
  forgetpassemailcode,
  forgetpassemailcodecheck,
  forgetpasssmscode,
  forgetsafequestion,
  passquestion,
} from '@/api/center';

export function useVerify(userSafeInfo) {
  const store = inject('store');

  const global = inject('global');
  const selectWay = ref({});

  const showVerifyWaysPopup = ref(false);
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
      return `${global.$t('重新获取')}(${countDown.value})`;
    }

    return isSended.value ? global.$t('重新获取验证码') : global.$t('获取验证码');
  });

  useDicts('passquestion', (list) => questionList.value = list, { immediate: true });

  function onVerifyWaysConfirm(event) {
    selectWay.value = event;
    isSended.value = false;
    isCounting.value = false;
    countDown.value = 60;
    clearInterval(timer.value);
    showVerifyWaysPopup.value = false;
  }

  function sendCode() {
    let request = forgetpasssmscode;
    if (selectWay.value.type === 'email') {
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
      phone_area_code: userSafeInfo.phone_area_code,
      uid: userSafeInfo.id,
    })
      .finally(() => {
        sendCodeLoading.value = false;
        isSended.value = true;
      });
  }

  const verifyWays = computed(() => {
    const {
      mobile,
      email,
      pass_question_id,
    } = userSafeInfo;
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
    const { pass_question_id } = userSafeInfo;
    return questionList.value.find((item) => {
      if (item.id === pass_question_id) {
        return item;
      }
    }) || {};
  });
  const submitLoading = ref(false);

  onMounted(() => {
    selectWay.value = {
      text: verifyWays.value?.[0]?.text ?? '',
      type: verifyWays.value?.[0]?.type ?? '',
    };
  });

  function submit() {
    return new Promise((resolve, reject) => {
      const { type } = selectWay.value;
      const data = {
        uid: userSafeInfo.id,
      };

      let request;
      if (type === 'question') {
        if (!answer.value) {
          Toast.fail(global.$t('请输入密保问题答案'));
          return;
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
          phone_area_code: userSafeInfo.phone_area_code,
        });

        if (type === 'mobile') {
          request = forgetpasscode(data);
        } else if (type === 'email') {
          request = forgetpassemailcodecheck(data);
        }
      }

      submitLoading.value = true;
      if (request) {
        const result = request
          .then((res) => {
            resolve();
            // emit('update:step', 3);
            // emit('verifyType', type);
            // emit('verifyData', data);
          })
          .finally(() => {
            submitLoading.value = false;
            reject();
          });
      }
    });
  }

  return {
    submit,
    submitLoading,
    codeText,
    countDown,
    selectWay,
    isSended,
    sendCodeLoading,
    sendCode,
    showVerifyWaysPopup,
    onVerifyWaysConfirm,
    code,
    verifyWays,
    answer,
    question,
  };
}
