<template>
  <Popup
    :showCancelBtn="false"
    noDefaultWidth
    position="center"
    :round="false"
    :customClose="true"
    v-model:show="isShowPopup"
    :style="{ height: '80%' }"
  >
    <div class="agent-register-wrap">
      <div class="popup-title-wrap layout-flex-center">
        {{ $t('加入{0}，百万佣金不是梦', [subConfig.title]) }}
        <van-icon name="cross" @click="isShowPopup = false" />
      </div>
      <div class="bind-form-wrap">
        <Form :columns="columns" padding ref="FormRef" theme="blockLabel">
          <template #arrow>
            <van-icon name="arrow-down" />
          </template>
          <template #phoneArea>
            <div class="layout-flex-between phone-area" @click="isShowAreaPopup = true">
              <span>+{{ areaCode }}</span>
              <img :src="$getSrc(`/src/assets/images/down-caret.png`)" alt />
            </div>
          </template>tch
          <template #buttonSlot>
            <van-button
              type="gray"
              :disabled="isCounting"
              @click="sendCode"
              :loading="sendCodeLoading"
            >{{ $t("获取验证码") + (isCounting ? `${$t('重新获取')}(${seconds})` : "") }}</van-button>
          </template>
        </Form>
        <div class="protocol" @click="toggleAgree">
          <em :class="{ active: agree }"></em>
          {{ $t('同意并接受') }}
          <span
            @click.stop="$popup({ tpl: 'AgentProtocol' })"
          >《{{ $t('合作代理条款') }}》</span>
        </div>
        <div class="btn-wrap">
          <van-button
            type="primary"
            @click="submit"
            :loading="registerLoading"
            :loading-text="$t('提交中')"
          >{{ $t('成为代理') }}</van-button>
        </div>
      </div>
    </div>
    <phone-area-popup v-model:show="isShowAreaPopup" @confirm="handleAreaConfirm($event)" />
  </Popup>
</template>

<script setup>
import {
  inject, onMounted, reactive, ref, watch, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import Form from '@/components/Form/index.vue';
import { useRegion } from '@/utils/hooks';
import { register, login, auditsetting } from '@/api/agent';
import { getParams, testPassword, validateEmail } from '@/utils';
import { spreadcodecurrency } from '@/api/app';
import PhoneAreaPopup from '@/components/Popup/PhoneAreaPopup.vue';
import Popup from './index.vue';
import { getAreaCodeFromRegion } from '../../utils';

const agree = ref(true);

const open = ref(true);
const isShowAreaPopup = ref(false);
const isShowPopup = ref(false);
const popularId = ref('');
const subConfig = inject('subConfig');

setTimeout(() => {
  isShowPopup.value = true;
}, 100);

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

function toggleAgree() {
  agree.value = !agree.value;
}

const FormRef = ref({});
const areaCode = ref('86');

const columns = reactive([
  {
    type: 'input',
    label: global.$t('代理账号：'),
    prop: 'username',
    required: true,
    block: true,
    placeholder: global.$t('请输入代理账号'),
  },
  {
    type: 'password',
    label: global.$t('密码：'),
    prop: 'password',
    required: true,
    block: true,
    placeholder: global.$t('请输入密码'),
  },
  {
    type: 'password',
    label: global.$t('确认密码：'),
    prop: 'repassword',
    required: true,
    block: true,
    placeholder: global.$t('请确认密码'),
  },
  {
    type: 'input',
    placeholder: global.$t('请输入手机号'),
    prop: 'mobile',
    leftIconSlot: 'userIcon',
    required: true,
    block: true,
    label: global.$t('手机号:'),
    labelSlot: 'phoneArea',
  },
  {
    type: 'input',
    placeholder: global.$t('请输入邮箱'),
    prop: 'email',
    required: true,
    block: true,
    label: global.$t('邮箱地址:'),
  },
  {
    type: 'picker',
    label: global.$t('地区：'),
    prop: 'inte_region_id',
    required: true,
    block: true,
    placeholder: global.$t('请选择地区'),
    rightIconSlot: 'arrow',
    list: [],
  },
  {
    type: 'picker',
    label: global.$t('货币：'),
    block: true,
    prop: 'inte_currency_id',
    required: true,
    placeholder: global.$t('请选择货币'),
    rightIconSlot: 'arrow',
    disabledMessage: global.$t('请先选择地区'),
    defaultValue: '',
    list: [],
  },
]);

const isNeedCurrency = ref(true);

function handleAreaConfirm(code) {
  areaCode.value = code;
  isShowAreaPopup.value = false;
}

function onFirstCode(event) {
  areaCode.value = event;
}

const store = inject('store');
const {
  regionList, currencyList, changeRegionId, defaultCurrency, defaultRegion,
} = useRegion(FormRef.value);
const { dicts } = $store.state.app;

watch(() => regionList.value, () => {
  if (isNeedCurrency.value) {
    columns[5].list = regionList.value;
    columns[5].defaultValue = defaultRegion.value.id;
  }
}, { immediate: true, deep: true });

function getCurrencyId(id) {
  return dicts?.regionlist?.find((item) => item.id === id)?.currency_conf;
}

const spreadCodeData = ref(null);

const { data: auditSetting, run: getAuditSetting } = useRequest(
  (params) => auditsetting(params),
  {
    manual: true,
    async onSuccess() {
      if (auditSetting.value.agent_code_show === 2) {
        if (columns[columns.length - 1].prop !== 'parent_code') {
          columns.push({
            type: 'input',
            label: global.$t('推荐码'),
            prop: 'parent_code',
            required: false,
            defaultValue: getParams('id') || sessionStorage.getItem('agentCode'),
            block: true,
            placeholder: global.$t('请输入推荐码'),
          });
        }
      } else if (columns[columns.length - 1].prop === 'parent_code') {
        columns.splice(columns.length - 1, 1);
      }
    },
  },
);

const { run: postRegister, loading: registerLoading } = useRequest(
  (params) => register({ ...params, id: FormRef.value.data.parent_code || getParams('id') }),
  {
    manual: true,
    async onSuccess() {
      if (auditSetting.value.agent_audit === 1) {
        Toast.success(global.$t('注册成功！'));
        login({
          username: FormRef.value.data.username,
          password: FormRef.value.data.password,
        })
          .then((result) => {
            Cookies.set('agent_access_token', result.access_token);
            store.dispatch('agent/getUserInfo');
            global.$router.push({ name: 'agentHome' });
            isShowPopup.value = false;
          });
      } else {
        Toast.success(global.$t('成功提交审核'));
        isShowPopup.value = false;
      }
    },
  },
);

onMounted(async () => {
  let result = await spreadcodecurrency({
    domain: location.host,
  });

  if (typeof result?.inte_currency_id !== 'undefined') {
    spreadCodeData.value = result;
    isNeedCurrency.value = false;
    columns.splice(columns.length - 2, 2);
    areaCode.value = await getAreaCodeFromRegion($store, result.inte_region_id);
  } else if (getParams('id')) {
    result = await spreadcodecurrency({ code: getParams('id') });
    if (typeof result.inte_currency_id !== 'undefined') {
      spreadCodeData.value = result;
      isNeedCurrency.value = false;
      columns.splice(columns.length - 2, 2);
    }
  }

  if (spreadCodeData.value?.phone_area_code) {
    areaCode.value = spreadCodeData.value.phone_area_code;
  }

  const { app } = store.state;
  if (!spreadCodeData.value && app.isLangMatching) {
    isNeedCurrency.value = false;
    columns.splice(columns.length - 2, 2);
    areaCode.value = app.langMatchingAreaCode;
    spreadCodeData.value = {
      inte_currency_id: app.headers['X-Inte-Currency-Id'],
      inte_region_id: app.headers['X-Inte-Region-Id'],
    };
  }

  if (spreadCodeData.value) {
    getAuditSetting(spreadCodeData.value);
  }

  if (isNeedCurrency.value) {
    watch(() => FormRef.value?.data?.inte_region_id, (curVal) => {
      const regionId = FormRef.value?.data?.inte_region_id;
      if (regionId) {
        const list = dicts?.regionlist.filter((item) => item.id === curVal)[0]?.currency_conf?.list ?? [];
        currencyList.value = list.map((item) => {
          if (item.status !== 0) {
            return {
              key: item.id,
              label: item.name,
              value: item.id,
            };
          }
          return false;
        });
        columns[6].list = currencyList.value;

        if (FormRef.value) {
          const { default: currency } = getCurrencyId(curVal);
          FormRef.value.data.inte_currency_id = currency.id;
          if (FormRef.value.data.inte_currency_id) {
            getAuditSetting({
              ...FormRef.value.data,
            });
          }
        }
      }
    });
  }
});

function submit() {
  const { data } = FormRef.value;
  if (!agree.value) {
    Toast.fail(global.$t('请接受并同意《游戏条款》'));
    return;
  }

  if (!validateEmail(data.email)) {
    Toast.fail(global.$t('请输入正确的邮箱地址'));
    return;
  }

  if (!data.username) {
    Toast.fail(global.$t('请输入用户名'));
    return;
  }

  if (!data.mobile) {
    Toast.fail(global.$t('请输入手机号'));
    return;
  }

  if (!testPassword(data.password)) {
    Toast.fail(global.$t('密码格式有误'));
    return;
  }

  if (data.password !== data.repassword) {
    Toast.fail(global.$t('两次密码不一致'));
    return;
  }

  if (!data.inte_region_id && isNeedCurrency.value) {
    Toast.fail(global.$t('请选择区域'));
    return;
  }

  if (!data.inte_currency_id && isNeedCurrency.value) {
    Toast.fail(global.$t('请选择货币'));
    return;
  }

  const params = {
    ...FormRef.value.data,
    register_domain: document.domain,
    phone_area_code: areaCode.value,
  };

  if (spreadCodeData.value) {
    params.inte_region_id = spreadCodeData.value.inte_region_id;
    params.inte_currency_id = spreadCodeData.value.inte_currency_id;
  }

  postRegister(params);
}

</script>

<style lang="less" scoped>
.bind-form-wrap {
  padding: 40px;
}
:deep(.van-field) {
  background-color: var(--bg-color-191919);
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

.popup-title-wrap {
  width: 100%;
  background-color: var(--bg-color-24c29a) !important;
  border-bottom: none;
  height: 160px;
  color: var(--font-color-ffffff);
  font-size: 36px;
  text-align: center;
  display: flex;
  align-items: center;
  line-height: 36px;
  position: relative;
  padding: 0 22px 0 44px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  :deep(.van-icon) {
    color: var(--font-color-ffffff) !important;
    margin-left: 30px;
    height: auto;
    font-size: 45px;
    transform: translateY(-2px);
  }
}
.icon {
  margin-right: 42px;
  img {
    width: 32px;
    height: 24px;
  }
}
:deep(.config-form-wrap .block-label) {
  font-size: 36px;
}
:deep(.van-field__right-icon) {
  margin-right: 20px;
}
</style>

<style lang="less" scoped>
.agent-register-wrap {
  display: flex;
  height: 100%;
  width: 676px;
  flex-direction: column;
  .popup-title-wrap {
    flex-shrink: 0;
  }
  .bind-form-wrap {
    flex: 1;
    overflow-y: auto;
  }
  :deep(.van-field__right-icon) {
    margin-right: 0;
  }
}

.protocol {
  margin-top: 48px;
  margin-bottom: 22px;
  font-size: 26px;
  color: var(--font-color-929292);
  display: flex;
  align-items: center;

  em {
    border: solid 2px var(--font-color-999999);
    width: 30px;
    border-radius: 50%;
    box-sizing: border-box;
    height: 30px;
    margin-right: 8px;
    &.active {
      border: none;
      background: url("/src/assets/images/protocol_select.png");
      background-size: cover;
    }
  }

  span {
    font-weight: 500;
    color: var(--theme-color);
  }
}
</style>
