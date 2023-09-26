<template>
  <Popup
    :title="$t(title)"
    v-model:show="isShow"
    close-icon-position="top-left"
    @clickCloseIcon="isShow = false"
    @close="isShow = false"
  >
    <div class="activity-join-wrap">
      <Form :columns="columns" ref="FormRef">
        <template #areaCode>
          <div class="area-code-wrap" @click="isShowAreaPopup = true">
            <span>+{{ areaCode }}</span>
            <van-icon name="arrow-down"></van-icon>
          </div>
        </template>
      </Form>
      <van-button
        type="primary"
        @click="submit"
        :loading="submitLoading"
        :loading-text="$t('提交中...')"
      >{{ $t("确认提交") }}</van-button>
    </div>
  </Popup>
  <PhonePopup
    :show="isShowAreaPopup"
    @confirm="onAreaCodeConfirm($event)"
    @close="isShowAreaPopup = false"
  />
</template>

<script setup>
import {
  inject, reactive, ref, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import Form from '@/components/Form/index.vue';
import { dateFormat } from '@/utils';
import { joininactivity } from '@/api/vip';
import PhonePopup from '@/components/Popup/PhoneAreaPopup.vue';
import Popup from './index.vue';

const isShowAreaPopup = ref(false);
const props = defineProps({
  type: {
    type: String,
    default: '1',
  },
  title: {
    type: String,
    default: '1',
  },
  vip_act_id: {
    type: String,
    default: '',
  },
});

const isShow = ref(false);
setTimeout(() => (isShow.value = true), 100);

const global = inject('global');
const store = inject('store');
const areaCode = ref(86);

function onAreaCodeConfirm(event) {
  areaCode.value = event;
  isShowAreaPopup.value = false;
}

const columns = reactive([
  {
    prop: 'name',
    type: 'input',
    label: global.$t('贵姓'),
    placeholder: global.$t('请输入贵姓'),
    block: true,
  },
  {
    prop: 'join_time',
    block: true,
    type: 'datetime-picker',
    defaultValue: dateFormat('YYYY-MM-DD', new Date()),
    subType: 'date',
    label: global.$t('意向时间'),
    format(date) {
      return dateFormat('YYYY-MM-DD', date);
    },
  },
  {
    block: true,
    prop: 'mobile',
    type: 'input',
    label: global.$t('手机号码'),
    placeholder: global.$t('请填写您的手机号码'),
    labelSlot: 'areaCode',
  },
]);

const FormRef = ref({});

const { run: postSubmit, loading: submitLoading } = useRequest(
  (params) => joininactivity(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('申请成功'));
      isShow.value = false;
    },
  },
);

function submit() {
  const { data } = FormRef.value;
  if (!data.name) {
    Toast.fail(global.$t('请输入您的称呼，方便我们联系您'));
    return;
  }
  if (!data.join_time) {
    Toast.fail(global.$t('请输入您的意向时间'));
    return;
  }
  if (!data.mobile) {
    Toast.fail(global.$t('请输入您的手机号码'));
    return;
  }
  if (
    !/^((?!169)(?!170)(?!171)1[0-9]{10})|(92[0-9]{9})|(98[0-9]{9})$/.test(
      data.mobile,
    )
  ) {
    Toast.fail(global.$t('请输入正确的手机号码'));
    return;
  }

  postSubmit({
    ...props,
    ...data,
    mobile: `+${areaCode.value}${data.mobile}`,
  });
}
</script>

<style scoped lang="less">
.activity-join-wrap {
  box-sizing: border-box;
  padding: 60px 30px;

  :deep(.van-button) {
    display: block;
    width: 100%;
    margin-top: 30px;
  }

  :deep(input) {
    padding-left: 15px;
  }

  :deep([labelslot="areaCode"]) {
    .van-field__label {
      width: 160px !important;

      .area-code-wrap {
        color: var(--font-color-ccc);
        text-align: center;
        white-space: nowrap;
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-right: 30px;
      }

      span {
        margin-left: auto;
        font-size: 20px;
      }

      .van-icon {
        font-size: 20px;
        margin-left: auto;
      }
    }
  }
  :deep(.van-form) {
    .van-field {
      padding-left: 0;
      background-color: var(--bg-color-191919);
    }
  }
}
</style>
