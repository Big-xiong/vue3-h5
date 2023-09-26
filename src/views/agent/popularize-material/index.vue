<template>
  <div class="popularize-material-wrap">
    <Form ref="FormRef" :columns="columns" :borderBottom="true" :padding="false" />

    <van-button
      @click="getSourceData"
      :loading="getSourceLoading"
      class="query-btn"
      type="primary"
    >{{ $t("查询") }}</van-button>

    <material-list :sourceTypes="sourceTypes" :sizeTypes="sizeTypes" :materialList="sourceData" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, reactive, ref } from 'vue';
import { promotionsource } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import { useDicts } from '@/utils/hooks';
import MaterialList from './MaterialList.vue';

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    label: global.$t('图片标题'),
    inputAlign: 'right',
    placeholder: global.$t('图片标题'),
    prop: 'title',
  },
  {
    type: 'picker',
    label: global.$t('图片类型'),
    inputAlign: 'right',
    placeholder: global.$t('请选择图片类型'),
    rightIcon: 'arrow',
    prop: 'type',
    list: [],
  },
  {
    type: 'picker',
    label: global.$t('图片尺寸'),
    inputAlign: 'right',
    placeholder: global.$t('请选择图片尺寸'),
    rightIcon: 'arrow',
    prop: 'size',
    list: [],
  },
]);

const sourceTypes = ref([]);
const sizeTypes = ref([]);
const sourceData = ref([]);

function mapObjectToArray(obj) {
  return Object.keys(obj).map((key) => ({
    value: key,
    label: obj[key],
  }));
}

useDicts('promotionsourcesizelist', (types) => {
  sizeTypes.value = types;
  columns[2].list = mapObjectToArray(types);
  console.log(columns);
}, { immediate: true });

useDicts('promotionsourcetypelist', (types) => {
  sourceTypes.value = types;
  columns[1].list = mapObjectToArray(types);
}, { immediate: true });

const FormRef = ref({});
const { run: getSourceData, loading: getSourceLoading } = useRequest(
  () => promotionsource(FormRef.value?.data ?? {}),
  {
    onSuccess(result) {
      sourceData.value = result.data;
    },
  },
);

</script>

<style lang="less" scoped>
:deep(.config-form-wrap) {
  input {
    padding: 22px 0px;
  }
}
.popularize-material-wrap {
  padding: 20px 30px 0;

  .query-btn {
    font-size: 32px;
    margin: 60px auto 0 auto;
    height: 90px;
    width: 630px;
    display: block;
  }
}

// :deep(.van-button--primary) {
//   background-color: var(--bg-color-24c29a);
//   color: var(--font-color-ffffff) !important;
//   border: none;
// }
:deep(.list-wrap) {
  border-bottom: 2px solid var(--border-color-00001);
}
</style>
