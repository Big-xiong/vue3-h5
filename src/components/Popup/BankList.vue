<template>
  <Popup
    v-model:show="isShow"
    :showConfirmBtn="false"
    position="bottom"
    @clickCloseIcon="isShowPopup = false"
    :title="$t(title)"
    :closeIconPosition="closeIconPosition"
  >
    <div class="bank-list-wrap">
      <div class="bank-list-body">
        <div
          class="bank-list-item"
          v-for="(item, index) in bankData"
          :key="index"
          @click="selectBank(item)"
        >
          <BankIcon :bankCode="item.icon_code?.toLowerCase()" />
          <div class="name" v-show="!showBankName">{{ item.name }}</div>
          <div class="name" v-show="showBankName">{{ item.bank_name }}</div>
          <van-icon name="success" v-if="selectedBank.id === item.id" />
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { inject, defineProps, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDicts } from '@/utils/hooks';
import Popup from './index.vue';
import BankIcon from '../BankIcon.vue';

const global = inject('global');

const isShow = ref(false);

setTimeout(() => {
  isShow.value = true;
}, 100);

const props = defineProps({
  title: {
    type: String,
    default: () => inject('$t')('开户银行'),
  },
  closeIconPosition: {
    type: String,
    default: 'top-right',
  },
  defaultBank: {
    type: Object,
    default: () => ({}),
  },
  onSelect: {
    type: Function,
    default: () => { },
  },
  bankList: {
    type: Array,
    default: () => [],
  },
  showBankName: {
    type: Boolean,
    default: false,
  },
});

const bankData = ref([]);
const selectedBank = ref(props.defaultBank || {});

function selectBank(data) {
  selectedBank.value = data;
  isShow.value = false;
  props?.onSelect?.(data);
}

if (!props.bankList.length) {
  const route = useRoute();

  const allBankList = route.fullPath.includes('affiliate')
    ? 'agentallbanklist'
    : 'allbanklist';

  useDicts(allBankList, (list) => {
    bankData.value = list;
  }, { immediate: true });
} else {
  bankData.value = props.bankList;
}
</script>

<style lang="less" scoped>
.bank-list-wrap {
  width: 750px;
  max-height: 800px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.bank-list-body {
  box-sizing: border-box;
  padding: 0 30px;
  flex: 1;

  .bank-list-item {
    height: 100px;
    display: flex;
    align-items: center;
    color: var(--dark-fff, var(--font-color-222930));
    font-size: 28px;
    justify-content: space-between;
    border-bottom: 2px solid var(---border-color-333);

    .name {
      margin-right: auto;
      color: var(--dark-fff, var(--font-color-000000));
    }
  }
}
</style>
