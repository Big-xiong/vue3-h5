<template>
  <div class="omit-apply-wrap">
    <Popup
      :round="false"
      :show-cancel-btn="false"
      @closeIconClick="isShow = false"
      v-model:show="isShow"
    >
      <van-nav-bar
        :title="isApplying ? $t('发起申请') : $t('查看申请')"
        class="nav-top"
        left-arrow
        @click-left="isShow = false"
      />

      <div class="body-wrap">
        <div class="title-text">
          <!-- <span class="iconfont icon-gantanhao"></span> -->
          <van-icon name="info-o"></van-icon>
          {{ $t("只能找回通过自身代理链接注册的下级会员，且注册三天时间内有效。") }}
        </div>

        <div class="content">
          <div class="user">
            {{ $t("会员账号") }}：
            <span>{{ target.username }}</span>
          </div>

          <div class="form-wrap">
            <Form ref="FormRef" :columns="columns">
              <template #devType>
                <div class="dev-type-slot">
                  {{ $t("推广设备") }}
                  <em class="required">*</em>
                </div>
              </template>
              <template #playIcon>
                <van-icon name="play"></van-icon>
              </template>
            </Form>
          </div>

          <div class="label">{{ $t("申请附图：请上传jpg，png，jpeg格式，且大小不超过5M的图片。") }}</div>

          <div v-if="isApplying" class="image-wrap">
            <van-uploader v-model="imgList" multiple :max-count="6" :after-read="afterRead">
              <div class="upload-tips">
                <van-icon name="plus" />
                <span>{{ $t("最多6张") }}</span>
              </div>
            </van-uploader>
          </div>

          <ul v-else class="img-box">
            <li v-for="(item, i) in imgList" :key="i">
              <van-image
                width="100%"
                height="100%"
                fit="cover"
                :src="item"
                @click="checkUploaderImg(i)"
              />
            </li>
          </ul>
          <div class="btn-wrap">
            <van-button
              :loading="submitOmitLoading"
              type="primary"
              v-if="isApplying"
              @click="submit"
            >{{ $t("确认提交") }}</van-button>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, defineProps,
} from 'vue';
import { ImagePreview, Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { useDicts } from '@/utils/hooks';
import { upload } from '@/api/home';
import { askomit } from '@/api/agent';
import Popup from './index.vue';

const isShow = ref(true);
const props = defineProps({
  isApplying: {
    type: Boolean,
    default: true,
  },
  target: {
    type: Object,
    default: () => ({}),
  },
  userName: {
    type: String,
    default: '',
  },
  onClose: {
    type: Function,
    default: () => { },
  },
});

const global = inject('global');
const columns = reactive([
  {
    type: 'input',
    label: global.$t('推广链接'),
    prop: 'agent_domain',
    block: true,
    readonly: !props.isApplying,
    placeholder: global.$t('请输入推广链接'),
  },
  {
    type: 'picker',
    label: global.$t('推广设备'),
    readonly: !props.isApplying,
    clickable: !props.isApplying,
    prop: 'ask_dev_type',
    block: true,
    blockSlot: 'devType',
    rightIconSlot: props.isApplying ? 'playIcon' : '',
    placeholder: global.$t('选择设备'),
    list: [
      { label: 'PC', value: '1' },
      { label: 'H5', value: '2' },
      { label: 'IOS', value: '3' },
      { label: '安卓', value: '4' },
    ],
  },
  {
    type: 'textarea',
    label: global.$t('申请理由'),
    showWordLimit: true,
    prop: 'ask_reason',
    maxlength: '100',
    autosize: true,
    block: true,
    readonly: !props.isApplying,
    rows: '3',
    placeholder: props.isApplying ? global.$t('填写申请理由100字以内') : '',
    list: [],
  },
]);

useDicts('devtypelist', (list) => {
  columns[1].list = Object.keys(list).map((key) => ({
    label: list[key],
    value: key,
  }));
});

const FormRef = ref({});
const imgList = ref([]);
const uploadImages = ref([]);
const loading = ref(false);

async function doUpload(file, index) {
  index = index ?? imgList.value.length - 1;
  imgList.value[index].status = 'uploading';
  const formData = new FormData();
  formData.append('file', file.file);
  const res = await upload(formData);
  imgList.value[index].status = 'done';
  uploadImages.value.push(res.path);
}

async function afterRead(file) {
  loading.value = true;
  if (Array.isArray(file)) {
    await Promise.all(file.map(async (item, index) => doUpload(item, index)));
  } else {
    await doUpload(file);
  }
  loading.value = false;
}

const { run: submitOmit, loading: submitOmitLoading } = useRequest(
  (params) => askomit(params),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('提交成功'));
      isShow.value = false;
      props.onClose?.();
    },
  },
);

function submit() {
  if (!FormRef.value.data.ask_dev_type) {
    Toast.fail(global.$t('推广设备不能为空'));
    return;
  }

  submitOmit({
    ...props.target,
    ...FormRef.value.data,
    ask_pics: JSON.stringify(uploadImages.value),
  });
}

if (!props.isApplying) {
  const isDataInit = ref(false);
  watch(
    () => FormRef.value,
    () => {
      if (
        FormRef.value
        && props.target.audit_status !== 2
        && !isDataInit.value
      ) {
        isDataInit.value = true;
        FormRef.value.data.agent_domain = props.target.agent_domain;
        FormRef.value.data.ask_dev_type = '2';
        FormRef.value.data.ask_reason = props.target.ask_reason;
        try {
          imgList.value = JSON.parse(props.target.ask_pics);
        } catch (e) { }
      }
    },
  );
}

function checkUploaderImg(index) {
  // console.log('props.imgList', props.imgList);
  ImagePreview({
    images: imgList.value,
    startPosition: index,
  });
}
</script>

<style lang="less" scoped>
.omit-apply-wrap {
  width: 100%;
  height: 100%;
  background: var(--bg-color-191919);
  color: var(--dark-fff, var(--font-color-222930));
  font-size: 28px;

  :deep(.van-popup) {
    &:nth-child(2) {
      height: 100%;
      overflow: hidden;
    }
  }

  .body-wrap {
    overflow-y: auto;
    height: calc(100% - 92px);
    // background: var(--omit-bg-color-fff);
  }

  .content {
    padding: 15px 30px;

    .form-wrap {
      margin-top: 20px;

      :deep(.van-cell) {
        padding-left: 30px !important;
        border: 2px solid var(--dark-333, var(--border-color-00001));
        margin-bottom: 40px;
        min-height: 88px;
      }

      :deep(.van-icon) {
        transform: rotate(90deg);
      }

      :deep([name="ask_reason"]) {
        color: var(--dark-fff, var(--font-color-222930));
        min-height: 204px !important;
      }
    }

    .label {
      margin: 30px 0;
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-222930));
    }

    .img-load {
      position: absolute;
      top: 0;
      left: 0;

      img {
        width: 50%;
      }
    }

    .user {
      line-height: 112.5px;
      height: 112.5px;
      font-size: 30px;

      span {
        color: var(--dark-fff, var(--font-color-222930));
      }
    }
  }

  .iconfont {
    vertical-align: middle;
    margin-right: 7.5px;
  }

  .title-text {
    color: var(--font-color-ffffff);
    padding: 15px 52.5px;
    background-color: var(--bg-color-42535d);
    font-size: 28px;
    .van-icon {
      color: var(--theme-color);
    }
  }

  .image-wrap {
    margin: 30px 0;
  }

  .img-box {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    margin-right: -30px;

    li {
      background-color: var(--bg-color-282828);
      width: 156px;
      height: 156px;
      margin: 0 15px 15px 0;
    }
  }

  .upload-tips {
    position: relative;
    border: dashed 2px var(--font-color-cccccc);
    background-size: contain;
    width: 156px;
    height: 156px;

    :deep(.van-icon) {
      font-size: 45px;
      text-align: center;
      color: var(--font-color-9a9a9a);
      margin-top: 30px;
      display: block;
    }

    > span {
      position: absolute;
      bottom: 20px;
      width: 100%;
      color: var(--font-color-606060);
      text-align: center;
      font-size: 24px;
    }
  }

  .btn-wrap {
    display: flex;
    margin: 60px auto;
    width: 630px;
    height: 90px;
    justify-content: center;

    :deep(.van-button) {
      flex: 1;
      font-size: 32px;
      &:nth-child(1) {
        margin-right: 45px;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .dev-type-slot {
    display: flex;

    em {
      font-style: none;
      color: var(--font-color-ff000b);
      font-size: 50px;
      font-weight: 400;
    }
  }
  :deep(.van-field__word-limit) {
    position: absolute;
    right: 0;
    left: 0;
  }
  :deep(.van-nav-bar__left) {
    color: var(--font-color-ffffff);
  }
  :deep(.van-nav-bar__title) {
    color: var(--font-color-fff);
  }
  :deep(.van-cell::after) {
    border: none;
  }
  :deep(.van-button--primary) {
    border: none;
    width: 100%;
    background-color: var(--bg-color-24c29a);
  }
}
</style>
