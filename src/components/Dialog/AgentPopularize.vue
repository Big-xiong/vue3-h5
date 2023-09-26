<template>
  <div class="agent-popularize-wrap">
    <Dialog
      :title="$t('推广页展示')"
      v-model:show="isShow"
      @confirm="run"
      @cancel="isShow = false"
      show-cancel-btn
      :confirm-btn-text="$t('提交')"
      closeIcon
    >
      <p class="p-text">{{ $t("筛选想要在推广图上展示的信息") }}</p>
      <div class="flex promote" v-for="(item, index) in contactInfo" :key="index">
        <div>
          <img :src="$getSrc(`/src/assets/images/agent/${index}.png`)" alt />
          <span>{{ formatText(index) }}</span>
        </div>
        <van-checkbox
          shape="square"
          :modelValue="item.is_bind === 1"
          @update:modelValue="item.is_bind = $event ? 1 : 2"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import {
  computed,
  inject, onMounted, reactive, ref, watch,
} from 'vue';
import { bindcontact, bindtype } from '@/api/agent';
import { useContact, useDicts } from '@/utils/hooks';
import Dialog from './index.vue';

const subConfig = inject('subConfig');

const isShow = ref(true);

const iconType = [
  '/src/assets/images/agent/qq.png',
  '/src/assets/images/agent/wechat.png',
  '/src/assets/images/agent/skype.png',
];

const store = inject('store');
const { agent } = store.state;
const global = inject('global');
const userInfo = computed(() => agent.userInfo);

const { contactInfo } = useContact(userInfo, subConfig.contactConfig);

const { run, loading } = useRequest(() => bindcontact({ inte_contact: JSON.stringify(contactInfo.value) }), {
  manual: true,
  onSuccess() {
    Toast.success(global.$t('修改成功'));
    store.dispatch('agent/getUserInfo');
    isShow.value = false;
  },
});

function formatText(name) {
  switch (name) {
    case 'qq':
      return 'QQ';
    case 'wechat':
      return '微信';
  }
  return name;
}
</script>

<style lang="less" scoped>
:deep(.van-dialog__content) {
  padding: 0 30px 45px 30px !important;
}

.agent-popularize-wrap {
  width: 90%;
  margin: 22.5px auto 0;

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .p-text {
    font-size: 28px;
    margin: 30px 0;
    color: var(--dark-fff, var(--font-color-222930));
  }

  .promote {
    color: var(--dark-fff, var(--font-color-222930));
    font-size: 30px;
    margin: 30px 0;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }

    span {
      text-transform: capitalize;
    }
  }

  img {
    width: 56px;
    height: 56px;
    margin-right: 20px;
  }
}
</style>
