<template>
  <div class="popularize-wrap">
    <van-tabs v-model:active="activeKey" class="title-nav-tabs" :swipe-threshold="2">
      <van-tab :title="$t('会员链接')" name="1">
        <QrCode :title="$t('PC / H5会员注册链接')" :url="domainUrl" :qrUrl="qrUrl" @share="share"></QrCode>
      </van-tab>
      <van-tab :title="$t('代理链接')" name="2" v-if="agent.userInfo.spread_switch === 2">
        <div class="set-ratting-wrap">
          <van-field border :placeholder="$t('下级代理佣金比例')" v-model="ratting">
            <template #left-icon>
              <span class="required"></span>
            </template>
          </van-field>
          <van-button type="primary" :loading="setRateLoading" @click="doSetRate">{{ $t("设置") }}</van-button>
        </div>
        <p class="tips-wrap">
          <van-icon name="info-o" />
          {{ $t("不得高于自身比例") }}
        </p>
        <QrCode :title="$t('PC / H5代理注册链接')" :url="domainUrl" :qrUrl="qrUrl" @share="share"></QrCode>

        <div class="code-wrapper" v-show="auditSetting?.agent_code_show === 2">
          <header>{{ $t('代理推荐码') }}</header>
          <div class="code-content">
            {{ $t('推荐码') }}：{{ agent?.userInfo?.code }}
            <span
              v-clipboard:copy="agent?.userInfo?.code ?? ''"
              v-clipboard:success="copySuccess"
            >
              <SvgIcon name="code-copy" />
            </span>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('专属域名')" name="3">
        <QrCode
          :title="$t('PC / H5专属域名')"
          :url="domainUrl"
          :qrUrl="qrUrl"
          @share="share"
          :noDomain="!hasSpecialDomain"
        ></QrCode>
      </van-tab>
    </van-tabs>

    <SavePopup
      @download="generateImageFromHtml($event)"
      :show="showSave"
      @close="showSave = false"
      :qrImage="qrCodeImage"
    />
    <SharePopup
      @save="onSave"
      @download="downloadImage(qrCodeImage)"
      :show="showShare"
      @close="showShare = false"
    />
  </div>
</template>

<script setup>
import {
  computed, inject, ref, watch,
} from 'vue';
import html2canvas from 'html2canvas';
import { Toast } from 'vant';
import { useRequest } from 'vue-request';
import { auditsetting, setchildrate } from '@/api/agent';
import SavePopup from './components/SavePopup.vue';

import SharePopup from './components/SharePopup.vue';
import QrCode from './QrCode.vue';
import SvgIcon from '@/components/SvgIcon.vue';

let subConfig = import.meta.globEager('/src/current_project/config/index.js');
subConfig = Object.values(subConfig)?.[0]?.default ?? { isI18n: true };

const global = inject('global');
const store = inject('store');
const { agent, app } = store.state;

store.dispatch('agent/getUserInfo');

const activeKey = ref('1');
const showShare = ref(false);
const showSave = ref(false);
const hasSpecialDomain = ref(false);
const ratting = ref(Number((agent.userInfo?.child_rate ?? 0) * 100).toFixed(0));
const domainUrl = ref('');
const qrUrl = ref('');

function onSave() {
  showSave.value = true;
}

function copySuccess() {
  Toast.success(global.$t('复制成功'));
}

const { data: auditSetting, run: getAuditSetting } = useRequest(
  () => auditsetting(),
  {
    manual: true,
  },
);

watch(
  () => activeKey.value,
  () => {
    initData();
    if (!subConfig.isCurrency) {
      getAuditSetting();
    }
  },
  { immediate: true },
);

watch(
  () => app.agentHeaders,
  () => {
    if (Object.keys(app.agentHeaders).length && !auditSetting.value) {
      initData();
      getAuditSetting();
    }
  },
  { deep: true },
);

function getDomainUrl() {
  const { userInfo } = agent;
  switch (activeKey.value) {
    case '1':
      return userInfo.member_spread_url;
    case '2':
      return userInfo.agent_domain[0]?.domain ?? '';
    // return `${location.host}/affiliate?id=${userInfo.id}`;
    default:
      return userInfo.special_domain;
  }
}

function getQrUrl() {
  const { userInfo } = agent;
  switch (activeKey.value) {
    case '1':
      return userInfo.qrcode_member_domain;
    case '2':
      // return userInfo.rand_domain[0]?.domain ?? '';
      return userInfo.agent_domain[0]?.domain ?? '';
    // return `${location.host}/affiliate?id=${userInfo.id}`;
    default:
      return userInfo.special_domain;
  }
}

const qrCodeImage = ref('');

function share(event) {
  showShare.value = true;
  qrCodeImage.value = event;
}

function initData() {
  domainUrl.value = getDomainUrl();
  qrUrl.value = getQrUrl();
  hasSpecialDomain.value = !!agent.userInfo.special_domain;
}

let index = 1;

function downloadImage(url) {
  const link = document.createElement('a');
  link.href = url; // 下载链接
  link.target = '_blank';
  link.setAttribute('download', `${index}.png`);
  link.style.display = 'none'; // a标签隐藏
  document.body.appendChild(link);
  link.click();
  index += 1;
}

function generateImageFromHtml(element) {
  html2canvas(document.querySelector(element)).then((canvas) => {
    downloadImage(canvas.toDataURL());
  });
}

const { run: setRate, loading: setRateLoading } = useRequest(
  () => setchildrate({
    child_rate: ratting.value,
  }),
  {
    manual: true,
    onSuccess() {
      Toast.success(global.$t('设置成功'));
      store.dispatch('agent/getUserInfo');
    },
  },
);
function doSetRate() {
  if (!/^[+]{0,1}(\d+)$/.test(ratting.value)) {
    Toast.fail(global.$t('佣金比例仅支持正整数'));
    return;
  }
  setRate();
}
</script>

<style lang="less" scoped>
.popularize-wrap {
  box-sizing: border-box;

  .title {
    text-align: center;
    color: var(--font-color-fff);
    font-weight: normal;
  }

  .set-ratting-wrap {
    display: flex;
    margin-top: 20px;
    width: 100%;
    height: 75px;
    padding: 0 40px;
    box-sizing: border-box;
    align-items: center;

    :deep(.van-field) {
      height: 75px;
      margin-bottom: 0;
      align-items: center;
      border: solid 2px var(--dark-666, var(--border-color-e7e7e7));

      input {
        color: var(--dark-fff);
      }

      .van-icon {
        font-size: 16px;
        color: var(--font-color-ff000b);
      }
    }

    :deep(.van-button) {
      width: 200px;
      height: 75px;
      margin-left: 40px;
    }
  }

  .tips-wrap {
    padding: 0 40px;
    margin-top: 20px;
    font-size: 22.5px;
    color: var(--dark-fff, var(--font-color-222930));
    height: 40px;
    line-height: 40px;
  }
}

.icon-activityweixin {
  color: #0db807;
}

.icon-activityQQhaoma {
  color: #18acfc;
}

.icon-activitySkype {
  color: #00aff0;
}

:deep(.code-wrapper) {
  background-color: var(--bg-color-f5f5f5);
  height: 162px;
  width: 630px;
  margin: 34px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  header {
    font-size: 36px;
    font-weight: 600;
    color: var(--dark-fff, var(--font-color-222930));
  }

  .code-content {
    color: var(--theme-color);
    font-weight: normal;
    font-size: 28px;
  }

  .svg-icon-wrap {
    width: 20px;
    height: 20px;
  }
}

.required {
  color: var(--font-color-ff000b);
  font-size: 28px;
  &::after {
    display: inline-block;
    padding-top: 15px;
    content: "*";
  }
}
</style>
