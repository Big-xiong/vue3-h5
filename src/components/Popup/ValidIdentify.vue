<template>
  <Popup position="center" :showCancelBtn="true" v-model:show="isShowPopup" @clickCloseIcon="isShowPopup = false"
         :title="step === 3 ? $t('设置密保问题') : $t('身份验证')">
    <div class="bind-form-wrap">
      <Form v-if="step === 3" :columns="columns" ref="FormRef" theme="blockLabel">
        <template #arrow>
          <van-icon name="arrow-down"/>
        </template>
      </Form>

<!--      <VerifyStep v-if="step < 3" :userSafeInfo="userSafeInfo" v-model:step="step"/>-->

      <div class="btn-wrap" v-if="step === 3">
        <van-button type="success" @click="submit">{{ $t('确认提交') }}</van-button>
      </div>

      <FooterService :type="2" @toKefu="isShowPopup = false"/>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import {
  passquestion, forgetsafequestion, forgetpass, setpassquestion,
} from '@/api/center';
import Form from '@/components/Form/index.vue';
import FooterService from '@/components/FooterService/index.vue';
import Popup from './index.vue';
// import VerifyStep from '../../views/login/components/VerifyStep.vue';

const userSafeInfo = ref({});
const isShowPopup = ref(false);
setTimeout(() => {
  isShowPopup.value = true;
}, 100);

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const step = ref(3);

const props = defineProps({
  onSuccess: {
    type: Function,
  },
});

// useRequest(
//     () => forgetpass({
//       username: user.userInfo.username,
//     }),
//     {
//       onSuccess(result) {
//         userSafeInfo.value = result;
//         if (!result.email && !result.mobile && result.is_pass_answer === 1) {
//           step.value = 3;
//         } else {
//           step.value = 1;
//         }
//       },
//     },
// );

const FormRef = ref({});

const columns = reactive([
  {
    type: 'picker',
    label: global.$t('密保问题'),
    prop: 'type',
    block: true,
    defaultValue: null,
    placeholder: global.$t('请选择'),
    rightIconSlot: 'arrow',
    list: [],
  },
  {
    type: 'input',
    label: global.$t('密保答案'),
    prop: 'answer',
    block: true,
    placeholder: global.$t('请输入密保答案'),
  },
  {
    type: 'input',
    label: global.$t('确认密保答案'),
    prop: 're_answer',
    block: true,
    placeholder: global.$t('请再次输入密保答案'),
  },
]);

const { data: questions } = useRequest(passquestion, {
  onSuccess(res) {
    columns[0].list = res.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  },
});

// 密保问题保存
const { run: codeRun } = useRequest((data) => setpassquestion(data), {
  manual: true,
  onSuccess: async () => {
    await $store.dispatch('user/getUserInfo');
    Toast.success(global.$t('设置成功！'));
    props.onSuccess?.();
    isShowPopup.value = false;
  },
});

function submit() {
  const { data } = FormRef.value;
  if (data.type === null) {
    Toast.fail(global.$t('请选择密保问题'));
    return;
  }
  if (!data.answer) {
    Toast.fail(global.$t('请输入密保答案'));
    return;
  }
  if (data.answer !== data.re_answer) {
    Toast.fail(global.$t('两次输入的答案不一样'));
    return;
  }
  data.uid = user?.userInfo?.id;
  data.question_id = data.type;
  codeRun(data);
}
</script>

<style lang="less" scoped>
.bind-form-wrap {
  padding: 30px;
}

:deep(.van-field) {
  background-color: var(--bg-color-191919);
  height: 88px;
  border: 2px solid var(--dark-666, var(--border-color-00001));
  border-radius: 8px;
  margin-bottom: 40px;
}

:deep(.van-cell::after) {
  border: none;
}

:deep(.verify-step-wrap) {
  p {
    font-size: 36px;
  }

  .code {
    input {
      background: transparent;
    }
  }

  .next {
    width: 100% !important;
  }

  .verification-wrap {
    border-radius: 8px;
    margin-bottom: 24px;
  }
}

:deep(.verify-step-wrap) {
  margin-top: 20px;
  padding: 0;
}

.van-button {
  width: 90%;
  height: 80px;
  border-radius: 8px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}

.van-button--success {
  border: none;
}

.btn-wrap .van-button {
  flex: 1;
  width: 100%;
  margin-bottom: 30px;
}
</style>
