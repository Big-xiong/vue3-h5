<template>
  <div class="agent-contact-info-wrap">
    <Form :columns="columns" borderBottom ref="InfoRef" />
    <van-button type="primary" @click="run" :loading="loading" :loading-text="$t('提交中')">{{ $t('确定') }}</van-button>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { bindcontact, updatedetail } from '@/api/agent';
import Form from '@/components/Form/index.vue';
import { useContact } from '@/utils/hooks';

const subConfig = inject('subConfig');
const isShow = ref(true);

const store = inject('store');
const global = inject('global');
const router = useRouter();
const InfoRef = ref({});

const { columns, contactInfo } = useContact(subConfig.contactConfig);

const { run, loading } = useRequest(
  () => {
    const data = { ...InfoRef.value.data };
    Object.keys(data).map((key) => {
      data[key] = {
        account: data[key],
        is_bind: contactInfo.value[key]?.is_bind || 2,
      };
    });
    return bindcontact({ inte_contact: JSON.stringify(data), ...InfoRef.value.data });
  },
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('修改成功'));
      isShow.value = false;
      store.dispatch('agent/getUserInfo');
      router.go(-1);
    },
  },
);
</script>

<style lang="less" scoped>
.agent-contact-info-wrap {
  box-sizing: border-box;
  padding: 48px 30px;

  :deep(.van-button) {
    width: 630px;
    height: 90px;
    margin: 20px auto;
    display: block;
  }

  :deep(.van-field) {
    margin-bottom: 48px;
    padding-left: 0;
  }
}
</style>
