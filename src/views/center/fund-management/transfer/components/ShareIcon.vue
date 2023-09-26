<template>
  <div class="share-icon-wrap" :class="`icon-type-${walletArr.indexOf(moneyCode)}`"></div>
</template>

<script setup>
import {
  defineProps, computed, ref,
} from 'vue';

const props = defineProps({
  moneyCode: {
    type: String,
    default: '',
  },
  shareWallet: {
    type: Object,
    default: () => {},
  },
});
const walletArr = ref([]);

Object.keys(props.shareWallet).forEach((code) => {
    if (props.shareWallet[code].length > 1) {
      walletArr.value.push(code);
    }
});
// for (const code in props.shareWallet) {
//   if (props.shareWallet.hasOwnProperty(code)) {
//     if (props.shareWallet[code].length > 1) {
//       walletArr.value.push(code);
//     }
//   }
// }

</script>

<style lang="less" scoped>
.share-icon-wrap {
  display: inline-block;
  //position: absolute;
  //top: 32px;
  //left: 120px;
  width: 48px;
  height: 30px;
  &.icon-type-0 {
    background: url("/src/assets/images/icon/share1.png") no-repeat center;
    background-size: contain;
  }
  &.icon-type-1 {
    background: url("/src/assets/images/icon/share2.png") no-repeat center;
    background-size: contain;
  }
  &.icon-type-2 {
    background: url("/src/assets/images/icon/share3.png") no-repeat center;
    background-size: contain;
  }
  &.icon-type-3 {
    background: url("/src/assets/images/icon/share4.png") no-repeat center;
    background-size: contain;
  }
  &.icon-type-4 {
    background: url("/src/assets/images/icon/share5.png") no-repeat center;
    background-size: contain;
  }
}
</style>
