<template>
  <Dialog
    class="callback-popup-wrap"
    :title="$t('申请回电')"
    :showConfirmBtn="false"
    v-model:show="isShow"
    closeIcon
  >
    <p class="title">{{ $t("申请回拨我们将有专人在5分钟内给您致电处理问题") }}</p>
    <div class="form-wrap">
      <div class="input-wrap">
        <div class="phone-area" @click="areaShow = true">
          <span>+{{ areaCode }}</span>
          <van-icon name="arrow-down" />
          <!--          <img class="xiala" :src="$getSrc(`/src/assets/images/xiala@2x.png`)" alt />-->
        </div>
        <input v-model="phone" type="text" :placeholder="$t('请输入手机号')" />
      </div>
      <div class="input-wrap">
        <textarea v-model="remark" :placeholder="'您可以描述您的疑问，可以更快的帮助您处理'" />
      </div>
      <div class="feedback-img-wrap">
        <div class="feedback-list">
          <div
            class="layout-flex-between upload-item"
            v-for="(item, index) in uploadImg"
            :key="index"
          >
            <p>{{ $t("附件") }}:{{ item }}</p>
            <van-icon size="16px" name="cross" @click="deleteFile(index)" />
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrap">
      <van-uploader :after-read="onRead">
        <van-button type="gray">{{ $t("上传附件") }}</van-button>
      </van-uploader>

      <van-button type="primary" v-login @click="submit">{{ $t("申请回拨") }}</van-button>
    </div>
  </Dialog>

  <PhoneAreaPopup v-model:show="areaShow" @confirm="onAreaConfirm($event)" />
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue';
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { recall, upload } from '@/api/home';
import Dialog from './index.vue';
import PhoneAreaPopup from '../Popup/PhoneAreaPopup.vue';

const isShow = ref(false);
const global = inject('global');
const store = inject('store');
const { user } = store.state;
const areaShow = ref(false);
const phone = ref('');
const remark = ref('');
const uploadImg = ref([]);
const imageArr = ref([]);
const areaCode = ref(user.userInfo?.phone_area_code ?? '86');

const { run: doCallBack } = useRequest((params) => recall(params), {
  manual: true,
  onSuccess() {
    isShow.value = false;
    Toast.success(global.$t('请求回电成功！'));
  },
});

function submit() {
  if (!user.isLogin) {
    isShow.value = false;
    return;
  }
  if (!phone.value) {
    Toast.fail(global.$t('请输入手机号'));
    return;
  }

  if (!remark.value) {
    Toast.fail(global.$t('多少写点什么吧~：）'));
  }

  doCallBack({
    tel: phone.value,
    remark: remark.value,
    phone_area_code: areaCode.value,
    pic: JSON.stringify(uploadImg.value),
  });
}

async function onRead(file) {
  const param = new FormData();
  param.append('file', file.file);
  const res = await upload(param);
  uploadImg.value.push(res.path);
  imageArr.value.push(res.saveName);
}

function deleteFile(index) {
  uploadImg.value.splice(index, 1);
  imageArr.value.splice(index, 1);
}

setTimeout(() => (isShow.value = true), 100);

function onAreaConfirm(event) {
  areaCode.value = event;
  areaShow.value = false;
}

</script>

<style scoped lang="less">
.callback-popup-wrap {
  .form-wrap,
  .button-wrap {
    box-sizing: border-box;
    padding: 0 30px;
  }

  .button-wrap {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    .van-button {
      font-size: 30px;
      width: 270px;
      box-sizing: border-box;
    }
  }

  .title {
    padding: 10px 65px 40px;
    text-align: center;
    height: 40px;
    font-size: 28px;
    font-weight: 400;
    color: var(--font-color-fff-7);
    line-height: 40px;
    margin-bottom: 30px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    font-size: 24px;
    background-color: var(--bg-color-191919);
    min-height: 88px;
    margin-bottom: 40px;
    border: 1px solid var(--dark-666, var(--border-color-00001));
    border-radius: 12px;

    .phone-area {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--font-color-fff);
      padding: 0 20px;
      i {
        margin-left: 20px;
      }
      &:after {
        margin-left: 30px;
      }
    }

    input {
      background: transparent;
      border: none;
      padding-left: 15px;
      font-size: 28px;
      color: var(--font-color-fff);
    }

    textarea {
      background-color: transparent;
      font-size: 28px;
      padding: 15px;
      width: 100%;
      border: none;
      min-height: 200px;
      color: var(--font-color-fff);
    }
    textarea::-webkit-input-placeholder {
      color: var(--dark-666, var(--font-color-999999));
    }
    .icon-down {
      height: 88px;
    }
    &:nth-child(1) {
      margin-bottom: 20px;
    }
  }

  .feedback-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 40px;

    .upload-item {
      background: var(--bg-color-191919);
      border-radius: 8px;
      position: relative;
      border: 2px solid var(--border-color-00001);

      p {
        margin: 0;
        width: 318px;
        color: var(--cur-color-upload, var(--font-color-fff));
        line-height: 66px;
        font-size: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 30px;
        box-sizing: border-box;
      }

      .van-icon-cross {
        color: var(--theme-color) !important;
        position: initial;
      }
    }
  }
}
</style>
