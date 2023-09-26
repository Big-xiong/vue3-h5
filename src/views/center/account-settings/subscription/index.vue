<template>
  <div class="subscription-wrap">
    <div class="subscription-wrap-main">
      <div class="tips" v-for="(item, index) in tipsList" :key="index">
        <h2>{{ item.title }}</h2>
        <p>{{ item.tip }}</p>
      </div>
      <div class="layout-flex-between item">
        <span>{{ $t('短信服务') }}</span>
        <van-switch
          v-model="is_allow_sms"
          @change="onChange"
          active-color="rgb(14,136,105)"
          size="20px"
        />
      </div>
      <div class="layout-flex-between item">
        <span>{{ $t('邮箱服务') }}</span>
        <van-switch
          v-model="is_allow_email"
          @change="onChange"
          active-color="rgb(14,136,105)"
          size="20px"
        />
      </div>
      <div class="layout-flex-between item">
        <span>{{ $t('站内信') }}</span>
        <van-switch
          v-model="is_allow_sitesms"
          @change="onChange"
          active-color="rgb(14,136,105)"
          size="20px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { getsubscribe, subscribe } from '@/api/center';

const global = inject('global');
let timer = null;
const id = ref(null);
const is_allow_sms = ref(true);
const is_allow_email = ref(false);
const is_allow_sitesms = ref(false);
const tipsList = [
  { title: global.$t('资金安全'), tip: global.$t('存款到账通知、取款到账通知、红利发放') },
  { title: global.$t('安全提醒'), tip: global.$t('域名更换通知、密码修改通知、异地登录通知') },
  { title: global.$t('优惠发放'), tip: global.$t('优惠活动通知') },
];

const { run: detailRun } = useRequest(getsubscribe, {
  manual: false,
  onSuccess(res) {
    id.value = res.id;
    is_allow_sms.value = res.is_allow_sms === 2;
    is_allow_email.value = res.is_allow_email === 2;
    is_allow_sitesms.value = res.is_allow_sitesms === 2;
  },
});

function onChange() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    subscribe({
      id: id.value,
      is_allow_sms: is_allow_sms.value ? 2 : 1,
      is_allow_email: is_allow_email.value ? 2 : 1,
      is_allow_sitesms: is_allow_sitesms.value ? 2 : 1,
    }).then((res) => {
      detailRun();
    });
  }, 1000);
}
</script>

<style lang="less" scoped>
:deep(.van-switch__node) {
}
.subscription-wrap {
  &-main {
    padding: 30px 0;

    .tips {
      padding: 30px;
      margin-bottom: 30px;
      // background-color: var(--bg-color-0f3256);
      position: relative;

      &::after {
        position: absolute;
        content: "";
        left: 30px;
        right: 30px;
        bottom: 0;
        height: 2px;
        background-color: var(--dark-333, var(--tips-border-color-51-01));
      }

      h2 {
        font-size: 32px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-333333));
        margin: 0;
        margin-bottom: 24px;
      }

      p {
        font-size: 28px;
        font-weight: 400;
        color: var(--dark-fff-06, var(--font-color-51-01));
        line-height: 40px;
        margin: 0;
      }
    }

    .item {
      // border-bottom: 2px solid var(--dark-333, var(--font-color-51-01));
      height: 110px;
      color: var(--dark-fff, var(--font-color-333333));
      font-size: 32px;
      padding: 0 30px;
      // background-color: var(--bg-color-0f3256);
      position: relative;

      &:not(:last-child)::after {
        position: absolute;
        content: "";
        left: 30px;
        right: 30px;
        bottom: 0;
        height: 2px;
        background-color: var(--dark-333, var(--border-color-51-01));
      }
    }
  }
}
</style>
