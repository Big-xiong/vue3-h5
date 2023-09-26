
<template>
    <Dialog :title="$t('绑定联系方式')" v-model:show="isShow" @confirm="submit" @cancel="handleCancel" :width="670" show-cancel-btn :confirm-btn-text="$t('提交')">
      <div class="form-dialog-body-wrap">
        <Form :columns="columns" ref="InfoRef" @onConfirm="submit"/>
      </div>
    </Dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, watch,
} from 'vue';
import { Toast } from 'vant';
import { updatedetail } from '@/api/agent';
import Form from '../Form/index.vue';
import Dialog from './index.vue';

const isShow = ref(true);

const store = inject('store');
const { agent } = store.state;

const userInfo = ref({});

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    prop: 'qq',
    block: true,
    placeholder: global.$t('请输入您的QQ'),
    defaultValue: agent.userInfo.qq,
  },
  {
    type: 'input',
    prop: 'wechat',
    block: true,
    placeholder: global.$t('请输入您的微信号'),
    defaultValue: agent.userInfo.wechat,
  },
  {
    type: 'input',
    prop: 'skype',
    block: true,
    placeholder: global.$t('请输入您的Skype'),
    defaultValue: agent.userInfo.skype,
  },
]);

const InfoRef = ref();

const { run: setContactInfo, loading: setInfoLoading } = useRequest(
  () => updatedetail(InfoRef.value.data),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('修改成功'));
      isShow.value = false;
      store.dispatch('agent/getUserInfo');
    },
  },
);

function handleCancel(e) {
  isShow.value = false;
}

function submit() {
  setContactInfo();
}

</script>

<style lang="less">
.form-dialog-body-wrap {
  padding-top: 0;
}
</style>
