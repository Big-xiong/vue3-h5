<template>
  <div class="add-bank-wrap">
    <div class="add-bank-body">
      <Form
        :columns="columns"
        ref="FormRef"
        :marginBottom="false"
        :borderBottom="true"
        inputAlign="right"
        label-width="130px"
      >
        <template #bankIcon>
          <BankIcon
            :bankCode="bankData.selectBank.icon_code?.toLowerCase()"
            v-if="bankData.selectBank.icon_code"
          />
          <div class="select-bank-name">
            <span class="bank-placeholder" v-if="!bankData.selectBank.name">请选择银行</span>
            <span v-else>{{ bankData.selectBank.name }}</span>
          </div>
          <van-icon name="arrow" class="select-bank-arrow"></van-icon>
        </template>
        <template #rightCaret>
          <van-icon name="arrow"></van-icon>
        </template>
      </Form>
      <van-button type="primary" :loading="addBankCardLoading" @click="submit">{{ $t("确定绑定") }}</van-button>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { addbankcard as agentAdd } from '@/api/agent';
import { addbankcard as centerAdd } from '@/api/center';
import BankIcon from '@/components/BankIcon.vue';

import Form from '@/components/Form/index.vue';

const global = inject('global');
const store = inject('store');
const FormRef = ref({});
const router = useRouter();
const route = useRoute();
const props = defineProps({
  type: {
    default: 'center',
    type: String,
  },
});

const bankData = reactive({
  selectBank: {
    name: '',
    id: '',
  },
  selectedRegion: {
    city: '',
    province: '',
  },
});

const columns = reactive([
  {
    type: 'input',
    label: global.$t('持卡人姓名'),
    placeholder: global.$t('请输入真实姓名'),
    validateFirst: true,
    defaultValue: route.query.name,
    inputAlign: 'right',
    prop: 'name',
    disabled: !!route.query.name,
  },
  {
    type: 'number',
    label: global.$t('请输入银行卡号'),
    placeholder: global.$t('请输入银行卡号'),
    inputAlign: 'right',
    validateFirst: true,
    prop: 'card_no',
  },
  {
    type: 'label',
    label: global.$t('请选择银行'),
    inputAlign: 'right',
    // placeholder: global.$t('请选择'),
    clickable: true,
    validateFirst: true,
    prop: 'bank',
    readonly: true,
    // rightIconSlot: 'rightCaret',
    extraSlot: 'bankIcon',
    onClick: onBankClick,
  },
  {
    type: 'input',
    label: global.$t('开户省份和城市'),
    inputAlign: 'right',
    prop: 'city',
    placeholder: global.$t('请选择'),
    clickable: true,
    readonly: true,
    rightIconSlot: 'rightCaret',
    onClick: onProvinceClick,
  },
  {
    type: 'input',
    label: global.$t('开户支行'),
    inputAlign: 'right',
    prop: 'branch',
    placeholder: global.$t('请输入开户支行'),
    validateFirst: true,
  },
]);

watch(() => FormRef.value.data?.card_no, (res) => {
  FormRef.value.data.card_no = res?.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
});

const SelectBankList = () => global.$popup({
  tpl: 'BankList',
  defaultBank: bankData.selectBank,
  onSelect(bank) {
    bankData.selectBank = bank;
    FormRef.value.data.bank = bankData.selectBank.name;
    columns[2].defaultValue = bank.name;
  },
});

const ProvinceCity = (region) => global.$popup({
  tpl: 'ProvinceCity',
  defaultProvince: bankData.selectedRegion.province,
  defaultCity: bankData.selectedRegion.city,
  onConfirm(data) {
    bankData.selectedRegion = {
      province: data[0],
      city: data[1],
    };
    columns[3].defaultValue = data.join('');
  },
});

function onBankClick() {
  SelectBankList();
}

function onProvinceClick() {
  ProvinceCity();
}

const { run: addBankCard, loading: addBankCardLoading } = useRequest(
  (params) => (props.type === 'agent' ? agentAdd : centerAdd)(params),
  {
    manual: true,
    async onSuccess() {
      Toast.success(global.$t('银行卡绑定成功'));
      await route.fullPath.includes('affiliate') ? store.dispatch('agent/getUserInfo') : store.dispatch('user/getUserInfo');
      router.go(-1);
    },
  },
);

function submit() {
  const { name, card_no, branch } = FormRef.value.data;
  if (!name) {
    Toast.fail(global.$t('请输入真实姓名'));
    return false;
  }
  if (!/^[\u4e00-\u9fa5]{0,5}$/.test(name)) {
    Toast.fail(global.$t('输入真实姓名，最多5汉字'));
    return false;
  }

  if (!card_no) {
    Toast.fail(global.$t('请输入银行账户'));
    return false;
  }
  if (!/^\d{16,20}$/.test(card_no.replace(/\s/g, ''))) {
    Toast.fail(global.$t('银行账户仅支持输入数字，16-20位'));
    return false;
  }

  if (!bankData.selectBank.id) {
    Toast.fail(global.$t('请选择银行'));
    return false;
  }
  if (!bankData.selectedRegion) {
    Toast.fail(global.$t('请选择省份/地区'));
    return;
  }
  if (!branch) {
    Toast.fail(global.$t('请填写开户分行'));
    return false;
  }
  if (!/^[\u4e00-\u9fa5]/.test(branch)) {
    Toast.fail(global.$t('开户分行格式不对'));
    return false;
  }

  const { selectedRegion, selectBank } = bankData;
  // const { province, city } = selectedRegion;
   if (!selectedRegion?.province || !selectedRegion?.city) {
  Toast.fail(global.$t('请选择开户省份和城市'));
    return false;
  }

  addBankCard({
    ...FormRef.value.data,
    bank_id: selectBank.id,
    card_no: card_no.replace(/\s/g, ''),
    bank_of_deposit: `${selectedRegion?.province}-${selectedRegion?.city}-${FormRef.value.data.branch}`,
  });
}
</script>

<style lang="less" scoped>
.add-bank-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 92px);

  .add-bank-body {
    padding: 30px 0;
    display: flex;
    flex-direction: column;

    :deep(.van-button) {
      margin: 60px auto;
      width: 690px;
    }
  }

  :deep(.van-form) {
    background-color: var(--bg-color-0f3256);
    padding: 0 30px;

    .van-cell {
      padding: 0;

      .select-bank-arrow {
        margin-right: 0;
        margin-left: 0;
        font-size: 35px;
      }

      // &:last-child {
      //   border-bottom: 0;
      // }
    }
    .van-field__label {
      color: var(--dark-fff, var(--font-color-333333));
      font-size: 28px;
      span {
        white-space: pre-wrap;
      }
    }

    .van-field__body {
      // padding-right: 20px;
      input {
        color: var(--dark-fff, var(--font-color-222930));
        font-size: 28px;
        &::placeholder {
          color: var(--dark-999, var(--font-color-333333)) !important;
        }
      }
    }

    .van-field__right-icon {
      // width: 0;
      padding-right: 0;
      padding-left: 0;
    }
  }

  .van-icon-arrow {
    color: var(--dark-999);
  }
}
</style>
