<template>
  <Popup v-model:show="show" @onClose="emit('update:show', false);" @onCancel="emit('update:show', false);"
    close-icon-position="top-right" position="center" :title="$t('输入资金密码')">
    <div class="pop-body list-cells">
      <div class="input">
        <div class="input-body">
          <van-password-input :value="pay_password" :gutter="12" :focused="showKeyboard" @focus="showKeyboard = true" />
        </div>
        <span v-show="!showKeyboard" class="forgetPass" @click="forgetFundPassword">{{ $t('忘记资金密码') }}</span>
      </div>
      <FooterService @toKefu="isShow = false" :type="2" v-if="!showKeyboard" />
    </div>

    <teleport :to="$store.state.app.teleportContainer">
      <van-number-keyboard v-model="password" :show="showKeyboard" :maxlength="6" @blur="showKeyboard = false"
        @input="onInput" @delete="onDelete" />
    </teleport>
  </Popup>
</template>

<script setup>
import {
  inject, ref, defineEmits, defineProps, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import Popup from '@/components/Popup/index.vue';
import FooterService from '@/components/FooterService/index.vue';

const global = inject('global');
const pay_password = ref('');
const password = ref('');
const showKeyboard = ref(false);
const store = inject('store');
const { user, agent } = store.state;
const router = useRouter();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:show', 'finish']);

watch(() => props.show, (val) => {
  pay_password.value = '';
  password.value = '';
});

function onInput(key) {
  pay_password.value = (pay_password.value + key).slice(0, 6);
  navigator?.vibrate?.(100);
  if (pay_password.value.length === 6) {
    showKeyboard.value = false;
    emit('update:show', false);
    emit('finish', pay_password.value);
    pay_password.value = '';
  }
}

function onDelete() {
  pay_password.value = pay_password.value.slice(
    0,
    pay_password.value.length - 1,
  );
}

function forgetFundPassword() {
  if (!props.type) {
    if (!user.userInfo.email && !user.userInfo.mobile && user.userInfo.is_pass_answer === 1) {
      return global.$dialog({
        tpl: 'AgentTips',
        message: global.$t('请先绑定手机号码或邮箱!'),
        confirm() {
          router.push('/center/account-settings/account-safe');
        },
      });
    }
    global.$popup({
      tpl: 'AgentChangePayPassword',
      hasFooter: true,
      userInfo: user?.userInfo,
    });
  } else {
    global.$popup({
      tpl: 'AgentChangePayPassword',
      hasFooter: true,
      noOldPass: !agent.userInfo?.pay_password,
      type: 'agent',
      userInfo: agent?.userInfo,
    });
  }
}

</script>

<style lang="less" scoped>
.pop-body {
  padding: 30px;

  .input {
    span {
      padding: 30px;
      display: block;
    }
  }

  .forgetPass {
    color: var(--dark-fff, var(--font-color-000000));
    padding-left: 0 !important;
  }
}
</style>
