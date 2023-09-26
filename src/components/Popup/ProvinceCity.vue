<template>
    <Popup v-model:show="isShow" :showConfirmBtn="false" :showCancelBtn="false" @onClose="isShow = false" @onCancel="isShow = false" position="bottom">
      <van-picker ref="pickerRef" show-toolbar :confirmButtonText="$t('确认')" :cancelButtonText="$t('取消')" @confirm="onConfirm" @change="onChange" @close="isShow = false" @cancel="isShow = false" :columns="columns"/>
    </Popup>
</template>

<script setup>
import {
 inject, computed, defineProps, ref,
} from 'vue';
import areaList from '/public/areaData';
import Popup from './index.vue';

 const global = inject('global');

const isShow = ref(false);

const props = defineProps({
  defaultCity: String,
  defaultProvince: String,
  onConfirm: Function,
});

setTimeout(() => {
  isShow.value = true;
}, 100);

const selectedRegion = ({
  province: props.defaultProvince || '',
  city: props.defaultProvince || '',
});
const areaData = ref([]);

function onConfirm(data) {
  props?.onConfirm?.(data);
  isShow.value = false;
}

const pickerRef = ref(null);
function onChange(values) {
  pickerRef.value.setColumnValues(1, areaData.value[values[0]]);
}

const columns = computed(() => {
  Object.keys(areaList.province_list).forEach((key) => {
    const province = areaList.province_list[key];
    areaData.value[province] = [];
    const pCode = String(key).slice(0, 2);
    if (
      Number(key) === 110000
      || Number(key) === 120000
      || Number(key) === 310000
      || Number(key) === 500000
    ) {
      Object.keys(areaList.county_list).forEach((countyKey) => {
        if (String(countyKey).slice(0, 2) === pCode) {
          areaData.value[province].push(areaList.county_list[countyKey]);
        }
      });
    } else {
      Object.keys(areaList.city_list).forEach((cityKey) => {
        if (String(cityKey).slice(0, 2) === pCode) {
          areaData.value[province].push(areaList.city_list[cityKey]);
        }
      });
    }
  });

  const provinceKeys = Object.keys(areaData.value);
  const cityKeys = props.defaultProvince ? areaData.value[props.defaultProvince] : areaData.value[global.$t('北京市')];
  return [
    {
      values: provinceKeys,
      defaultIndex: provinceKeys.indexOf(props.defaultProvince),
      className: 'column1',
    },
    {
      values: cityKeys,
      defaultIndex: cityKeys.indexOf(props.defaultCity),
      className: 'column2',
    },
  ];
});
</script>

<style scoped>
</style>
