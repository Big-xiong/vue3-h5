<template>
  <van-popup
    round
    v-model:show="isShow"
    close-on-click-overlay
    position="center"
    teleport="body"
    class="discount-popup custom-close"
  >
    <div class="popup-title-wrap">
      <span>{{ data?.name }}</span>
      <van-icon name="cross" @click="isShow = false"></van-icon>
    </div>

    <div class="popup-body" v-if="hasData">
      <span v-html="data?.detail_content"></span>

      <!-- <div class="title-wrap"> -->
      <!--   <div class="title">{{$t('【新会员】沙巴体育 80%首存红利 高达800元！')}}</div> -->
      <!--   <div class="subtitle">{{$t('亚洲最佳手机体育平台独家优惠')}}</div> -->
      <!-- </div> -->

      <!-- <div class="info-wrap"> -->
      <!--   <div class="info-title">{{$t('活动时间')}}：</div> -->
      <!--   <div class="info-item">{{$t('2021年8月1日00:00开始至2021年8月31日')}}</div> -->
      <!--   <div class="info-item">{{$t('23:59结束（北京时间）')}}</div> -->
      <!-- </div> -->

      <!-- <div class="table-section"> -->
      <!--   <div class="table-column"> -->
      <!--     <div class="header">{{$t('帐号')}}</div> -->
      <!--     <div class="content">{{$t('体育')}}</div> -->
      <!--   </div> -->
      <!--   <div class="table-column"> -->
      <!--     <div class="header">{{$t('红利率')}}</div> -->
      <!--     <div class="content">{{$t('80%')}}</div> -->
      <!--   </div> -->
      <!--   <div class="table-column"> -->
      <!--     <div class="header">{{$t('红利限额')}}</div> -->
      <!--     <div class="content">{{$t('800元')}}</div> -->
      <!--   </div> -->
      <!-- </div> -->
    </div>
    <template v-else>
      <van-empty :description="$t('暂无数据')" class="empty">
        <template #image>
          <SvgIcon name="discount-empty" />
        </template>
      </van-empty>
    </template>
    <van-button v-show="discount?.signed_option !== 3" type="primary" @click="gotoDeposit">
      {{
        signedText[discount.signed_option]
      }}
    </van-button>
  </van-popup>
</template>

<script setup>
import { Toast } from 'vant';
import {
  inject, ref, watch, defineProps, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { useDiscount } from '@/utils/hooks.js';
import { activitydetail } from '@/api/active';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const isShow = ref(false);

const props = defineProps({
  id: {
    type: [Number, String],
    default: '',
  },
  discount: {
    type: Object,
    default: () => ({}),
  },
  handleSign: {
    type: Function,
    default: () => { },
  },
  btnText: {
    type: Object,
    default: () => { },
  },
});
const hasData = ref(true);

const router = useRouter();

const { data, run } = useRequest(
  () => activitydetail({
    id: props.id,
    LOADING: true,
  }),
  {
    onSuccess(res) {
      isShow.value = true;
      hasData.value = !!res.detail_content;
      console.log(res);
    },
  },
);

const { signedText, handleSign } = useDiscount(router, () => (isShow.value = false));

function apply() {
  isShow.value = false;
  router.push({ name: 'centerDeposit' });
}

const store = inject('store');
const { user } = store.state;

function gotoDeposit() {
  if (user.isLogin) {
    handleSign(props.discount);
    isShow.value = false;
  } else {
    global.$dialog({
      tpl: 'LoginDialog',
      confirm() {
        isShow.value = false;
      },
    });
  }
}
</script>

<style lang="less" scoped>
.popup-title-wrap {
  display: flex;
  flex-shrink: 0;
  padding: 0 66px 0 44px;
  box-sizing: border-box;
  justify-content: space-between;
  width: 682px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 112px;
  align-items: center;
  background: var(--cur-bg-color-173253, var(--theme-color));
  color: var(--font-color-ffffff);
  font-size: 28px;
  font-weight: 400;

  .van-icon {
    font-size: 40px;
    position: absolute;
    top: unset;
    left: unset;
    right: 36px;
    border: none;
  }

  overflow-y: auto;

  span {
    text-align: center;
    width: 100%;
  }
}

.popup-body {
  padding: 42px 24px 70px 24px;
  flex-grow: 1;
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  color: var(--cur-font-color-fff, var(--dark-fff));
  font-size: 28px;
  line-height: 50px;

  p {
    margin-bottom: 24px;
  }

  :deep(table) {
    margin-top: 48px;
    border-collapse: initial !important;
    overflow-x: auto;
    width: 100%;
    max-width: 100%;
    border: none;
    tr:first-child {
      color: var(--font-color-ffffff);
      font-size: 26px;

      td {
        background-color: var(--theme-color);
        border-bottom-color: var(--theme-color);
        border-top-color: var(--theme-color);
      }

      td:first-child {
        border-top-left-radius: 20px;
        border-left: none;
      }

      td:last-child {
        border-top-right-radius: 20px;
        border-right-color: var(--theme-color);
      }
    }

    tr:last-child {
      td:first-child {
        border-bottom-left-radius: 20px;
      }

      td:last-of-type {
        border-bottom-right-radius: 20px;
      }
    }

    td {
      color: var(--dark-fff);
      text-align: center;
      border: 2px solid var(--dark-333, var(--border-color-ececec));
      padding: 15px 0;

      &:not(:last-child) {
        border-right: 0;
      }
    }

    p {
      white-space: wrap;
    }
  }
}

.title-wrap {
  margin-top: 42px;
  margin-bottom: 24px;

  .title {
    font-size: 28px;
    font-weight: 500;
    color: var(--font-color-222930);
    line-height: 40px;
  }

  .subtitle {
    font-size: 28px;
    padding-left: 16px;
    font-weight: 400;
    color: var(--theme-color);
    line-height: 40px;
  }
}

.info-wrap {
  margin-top: 20px;
  font-size: 28px;
  color: var(--font-color-222930);

  .info-title {
    font-weight: 500;
    text-align: left;
  }

  .info-item {
    font-weight: 400;
    text-align: left;
  }
}

:deep(.table) {
  margin-top: 48px;
  font-size: 28px;
  border: solid 2px var(--theme-color);
  overflow-x: auto;
  display: block;

  .table-column {
    flex: 1;
    border-right: solid 2px var(--theme-color);

    .header,
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header {
      height: 96px;
      color: var(--font-color-ffffff);
      background: var(--font-color-24c29a);
    }

    .content {
      height: 224px;
      color: var(--font-color-222930);
    }

    &:first-child {
      .content {
        color: var(--theme-color);
      }
    }

    &:last-child {
      border-right: 0;
    }
  }
}

.no-data {
  text-align: center;
  display: block;
  font-size: 28px;
  padding: 80px 0;
  color: var(--dark-fff, #000);
}

.van-button {
  width: 100%;
  height: 88px;
  border-radius: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>

<style>
.discount-popup {
  width: 682px !important;
  max-height: 80% !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
