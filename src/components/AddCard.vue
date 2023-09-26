<template>
  <div class="add-bank-wrap">
    <div class="add-bank-body">
      <Form
        :columns="columns"
        ref="FormRef"
        :marginBottom="false"
        :borderBottom="true"
        inputAlign="right"
      >
        <template #rightCaret>
          <van-icon name="arrow"></van-icon>
        </template>
      </Form>
      <van-button type="primary" :loading="addBankCardLoading" @click="submit">{{ $t("确定绑定") }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { addbankcard as agentAdd } from '@/api/agent';
import { addbankcard as centerAdd } from '@/api/center';

import Form from '@/components/Form/index.vue';

const global = inject('global');
const store = inject('store');
const FormRef = ref({});
const router = useRouter();

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

const route = useRoute();

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
    type: 'input',
    label: global.$t('请输入银行卡号'),
    placeholder: global.$t('请输入银行卡号'),
    inputAlign: 'right',
    validateFirst: true,
    prop: 'card_no',
  },
  {
    type: 'input',
    label: global.$t('请选择银行'),
    inputAlign: 'right',
    placeholder: global.$t('请选择'),
    clickable: true,
    validateFirst: true,
    prop: 'bank',
    readonly: true,
    rightIconSlot: 'rightCaret',
    onClick: onBankClick,
  },
  {
    type: 'input',
    label: global.$t('省份/地区'),
    inputAlign: 'right',
    placeholder: global.$t('请输入输入省份/地区'),
    prop: 'address',
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

const SelectBankList = () => global.$popup({
  tpl: 'BankList',
  defaultBank: bankData.selectBank,
  onSelect(bank) {
    bankData.selectBank = bank;
    FormRef.value.data.bank = bankData.selectBank.name;
  },
});

// const ProvinceCity = (region) => global.$popup({
//   tpl: 'ProvinceCity',
//   defaultProvince: bankData.selectedRegion.province,
//   defaultCity: bankData.selectedRegion.city,
//   onConfirm(data) {
//     bankData.selectedRegion = {
//       province: data[0],
//       city: data[1],
//     };
//     columns[3].defaultValue = data.join('');
//   },
// });

function onBankClick() {
  SelectBankList();
}

// function onProvinceClick() {
//   ProvinceCity();
// }

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
  if (!card_no) {
    Toast.fail(global.$t('请输入银行账户'));
    return false;
  }
  // 12473 添加银行卡账号根据不同货币限制位数，泰国10-12位，越南6-13位
  // if (props.type === 'agent') {
  //   if (store.state.agent?.userInfo?.currency?.code === 'thb') {
  //     if (!/^\d{10,12}$/.test(card_no)) {
  //       Toast.fail(global.$t('银行账户仅支持输入数字，10-12位'));
  //       return false;
  //     }
  //   } else if (!/^\d{6,13}$/.test(card_no)) {
  //     Toast.fail(global.$t('银行账户仅支持输入数字，6-13位'));
  //     return false;
  //   }
  // } else if (store.state.user?.userInfo?.currency_detail?.code === 'thb') {
  //   if (!/^\d{10,12}$/.test(card_no)) {
  //     Toast.fail(global.$t('银行账户仅支持输入数字，10-12位'));
  //     return false;
  //   }
  // } else if (!/^\d{6,13}$/.test(card_no)) {
  //   Toast.fail(global.$t('银行账户仅支持输入数字，6-13位'));
  //   return false;
  // }

  if (!bankData.selectBank.id) {
    Toast.fail(global.$t('请选择银行'));
    return false;
  }
  if (!FormRef.value.data.address) {
    Toast.fail(global.$t('请填写省份/地区'));
    return;
  }
  if (!branch) {
    Toast.fail(global.$t('请填写开户分行'));
    return false;
  }

  const { selectedRegion, selectBank } = bankData;
  // const { province, city } = selectedRegion;
  addBankCard({
    ...FormRef.value.data,
    bank_id: selectBank.id,
    bank_of_deposit: `${FormRef.value.data.address}-${FormRef.value.data.branch}`,
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
    [righticonslot] {
      padding-right: 20px !important;
    }
    .van-cell {
      padding: 0 30px;
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
