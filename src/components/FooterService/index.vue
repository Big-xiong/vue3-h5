<template>
  <!--    <div v-show="type === 1" class="layout-flex-center footerService-wrap">-->
  <!--      <div class="wait" @click="$router.push('/')">-->
  <!--        <img :src="$getSrc(`/src/assets/images/zaigg@2x.png`)" alt/>{{$t('再逛逛吧')}}</div>-->
  <!--      <div class="line"></div>-->
  <!--      <div class="kefu" @click="$openKefu">-->
  <!--        <img :src="$getSrc(`/src/assets/images/kefu@2x.png`)" alt/>{{$t('专属客服')}}</div>-->
  <!--    </div>-->
  <div v-show="type === 2" class="footerService-tips">
    {{ $t("遇到问题") }} {{ $t("联系") }}
    <span @click="toService">{{ $t("专属客服") }}</span>
  </div>
</template>

<script setup>
import {
  inject, reactive, defineProps, defineEmits,
} from 'vue';

const global = inject('global');
const props = defineProps({
  type: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(['toKefu']);
function toService() {
  emit('toKefu');
  global.$openKefu();
}
</script>

<style lang="less" scoped>
.footerService-wrap {
  padding: 100px 0;

  .line {
    width: 2px;
    height: 40px;
    background: var(--card-bg-color, var(--bg-color-fff));
    border-radius: 5px;
    margin: 0 20px;
  }

  .wait,
  .kefu {
    height: 42px;
    font-size: 28px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-222930));
    line-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 42px;
      height: 42px;
      margin-right: 20px;
    }
  }

  .kefu {
    color: var(--font-color-7c86e9);
  }
}

.footerService-tips {
  font-size: 26px;
  margin-top: 30px;
  text-align: center;
  color: var(--font-color-525152);
  padding-bottom: 30px;

  span {
    text-decoration: underline;
    color: var(--font-color-24c29a);
    margin-left: -5px;
  }
}
</style>
