<template>
  <Popup :show="isShow" class="transfer-popup-wrap" close-icon-position="top-right" position="bottom"
    :title="$t('额度转账')" @clickCloseIcon="isShow = false">
    <Transfer :platformId="platformId" :cateId="cateId" :cancel="cancel" :gameData="gameData" :dialogType="dialogType"
      :gameId="gameId" v-model:isShow="isShow" />
  </Popup>
</template>

<script setup>
import Popup from './index.vue';
import Transfer from '../Transfer.vue';

const isShow = ref(false);
setTimeout(() => {
  isShow.value = true;
}, 100);

const props = defineProps({
  gameId: String,
  platformId: String,
  cateId: String,
  cancel: {
    type: Function,
    default: () => { },
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
  dialogType: {
    type: String,
    default: '',
  },
});
</script>
