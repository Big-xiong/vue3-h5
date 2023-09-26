<template>
    <div class="brand-wrap">
      <template v-for="(item, i) in imageList" :key="i">
        <van-image v-show="i != 0" fit="cover" :src="item.h5_index_pic" alt/>
      </template>
    </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, ref } from 'vue';
import { strength } from '@/api/help';

const global = inject('global');

const imageList = ref([]);

const { loading } = useRequest(() => strength(), {
  onSuccess(result) {
    imageList.value = result;
  },
});
</script>

<style lang="less" scoped>
.brand-wrap {
  img {
    width: 100%;
  }
}
</style>
