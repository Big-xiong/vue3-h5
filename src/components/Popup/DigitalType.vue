<template>
  <Popup v-model:show="isShow" close-icon-position="top-right" position="bottom" :title="$t('提款币种类型')" @onClose="closePop"
         teleport="body">
    <div class="pop-body digital-type-wrap">
      <ul>
        <li @click="handleChoose(item)" v-for="(item,index) in list" :key="index">{{item.type_name}}</li>
      </ul>
    </div>
  </Popup>
</template>

<script setup>
import {
 inject, defineEmits, ref, onMounted, defineProps, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Popup from '@/components/Popup/index.vue';

const global = inject('global');
const store = inject('store');
const { user } = store.state;
const isShow = ref(false);

setTimeout(() => {
  isShow.value = true;
}, 200);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  select: {
    type: Function,
    default: () => { },
  },
});

console.log('props', props.list);

function handleChoose(item) {
  isShow.value = false;
  props.select(item);
}

</script>

<style lang="less" scoped>
.digital-type-wrap{
  ul {
    li{
      font-size:30px;
      color: var(--dark-525152, var(--font-color-333333));
      text-align: center;
      line-height: 88px;
    }
  }
}
</style>
