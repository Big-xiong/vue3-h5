<template>
  <Popup
    :showCancelBtn="false"
    :show="isShowPopup"
    @clickCloseIcon="isShowPopup = false"
    position="bottom"
    @onClose="isShowPopup = false"
  >
    <div class="choose-currency-wrap">
      <div class="head">{{ $t('货币选择') }}</div>
      <div class="inner">
        <p class="title">{{ $t('请选择您使用的货币？') }}</p>
        <p class="tips">{{ $t('在注册前，请务必选择您使用的货币信息') }}</p>
        <Form
          id="register-form-account"
          ref="accountRef"
          :columns="accountColumns"
        >
          <template #flag>
            <van-image
              :src="$getSrc('/src/assets/images/flag-th.png')"
              class="flag"
              v-show="accountRef.data.inte_region_id === 2"
            />
            <van-image
              :src="$getSrc('/src/assets/images/flag-vi.png')"
              class="flag"
              v-show="accountRef.data.inte_region_id === 3"
            />
          </template>
        </Form>
        <van-button
          type="primary"
          round
          @click="confirmCurrency"
        >{{ $t("确定") }}</van-button>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, defineProps, watch, defineEmits,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import Popup from './index.vue';
import { useDicts } from '@/utils/hooks';
import { siteinfo } from '@/api/dicts';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;
const currencyList = ref(null);
const props = defineProps({
  isShowPopup: {
    type: Boolean,
    default: true,
  },
  registerType: {
    type: Number,
    default: 1,
  },
});
const registerType = ref(props?.registerType);
const accountRef = ref({
  data: {
    inte_currency_id: '',
    inte_region_id: '',
  },
});

const accountColumns = reactive([
  {
    type: 'picker',
    prop: 'inte_region_id',
    block: true,
    label: '',
    rightIcon: 'arrow-down',
    placeholder: global.$t('请选择地区'),
    list: [],
    class: 'region',
    leftIconSlot: 'flag',
  },
  {
    type: 'picker',
    prop: 'inte_currency_id',
    rightIcon: 'arrow-down',
    placeholder: '',
    disabled: true,
    label: '',
    'label-width': 0,
    disabledMessage: global.$t('请先选择地区'),
    list: [],
  },
]);

useDicts('regionlist', (list) => {
  const defaultRegion = list.find((item) => item.is_default === 1);
  const regionList = list.map((item) => ({
    key: item.id,
    label: item.name,
    value: item.id,
  }));

  accountColumns[0].list = regionList;
  accountColumns[0].defaultValue = defaultRegion.id;
}, { immediate: true });

const { run: getSiteInfo } = useRequest(() => siteinfo(accountRef.value ? accountRef.value.data : {}), {
  manual: false,
  onSuccess(info) {
    registerType.value = Number(info?.h5_register_setting?.username_register ?? 1);
  },
});

watch(
  () => accountRef?.value?.data?.inte_region_id,
  (curVal) => {
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
    accountColumns[1].list = currencyList.value;
    accountColumns[1].disabled = !accountRef.value?.data?.inte_region_id;
    if (accountRef.value) {
      const { default: currency } = getCurrencyId(curVal);
      /* accountColumns[4].defaultValue = currency.id; */
      accountRef.value.data.inte_currency_id = currency.id;
      getSiteInfo();
    }
  },
);

function getCurrencyId(id) {
  return dicts?.regionlist?.find((item) => item.id === id)?.currency_conf;
}

const emit = defineEmits(['confirmCurrency']);
function confirmCurrency() {
  console.log(accountRef.value.data);
  emit('confirmCurrency', { ...accountRef.value.data, registerType: registerType.value });
}

</script>

<style lang='less' scoped>
.choose-currency-wrap {
  .head {
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 36px;
    color: var(--font-color-fff);
    background-color: var(--theme-color);
  }

  .inner {
    padding: 45px;

    .title {
      font-size: 32px;
      color: var(--dark-fff, var(--font-color-333));
      font-weight: bold;
    }

    .tips {
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-333));
      margin: 20px 0;
    }

    .van-button {
      width: 100%;
      font-size: 30px;
    }
  }
}

:deep(#register-form-account) {
  position: relative;
  .van-cell {
    width: calc(50% - 14px);
    float: left;
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
    border: 1px solid var(--dark-fff, var(--border-color-00002));
    min-height: 80px;
    height: 80px;

    &:last-child {
      margin-left: 28px;
    }
  }

  .van-cell__title {
    display: none;
  }
}

.flag {
  width: 24px;
}
</style>
