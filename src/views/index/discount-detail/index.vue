<template>
  <div class="discount-detail-wrap">
    <van-nav-bar
      :title="discount?.title || title"
      v-if="route.query.source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>
    <div class="detail-body" v-if="hasData">
      <van-image class="h5Img" :src="discount?.h5_index_max_pic" fit="cover" />
      <div class="m-button">
        <!--v-if="[2, 9, 10].indexOf(discount?.id) !== -1" -->
        <van-button
          @click="handleSign(discount, type)"
          type="primary"
        >{{ signedText[discount.signed_option] }}</van-button>
      </div>
      <article v-html="discount?.detail_content"></article>
    </div>
    <van-empty v-else-if="discount" :description="$t('暂无数据')" class="empty">
      <template #image>
        <SvgIcon name="discount-empty" />
      </template>
    </van-empty>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { activitydetail } from '@/api/active.js';
import { getParams } from '@/utils';
import { useDiscount } from '@/utils/hooks.js';
import SvgIcon from '@/components/SvgIcon.vue';

const subConfig = inject('subConfig');
const route = useRoute();
const router = useRouter();
const discountId = ref(getParams('id') || '');
const store = inject('store');
const { app } = store.state;
const title = computed(() => route.query.title);
const type = computed(() => (subConfig.isCurrency ? 'blizzwin' : 'app'));
const {
  signedText,
  handleSign,
} = useDiscount();
const hasData = ref(false);

const {
  data: discount,
  run,
} = useRequest(
  () => activitydetail({ id: discountId.value, LOADING: true }),
  {
    onSuccess(res) {
      hasData.value = !!res.detail_content;
    },
  },
);

</script>

<style lang="less" scoped>
.discount-detail-wrap {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  .van-image {
    padding: 30px;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;

    :deep(img) {
      border-radius: 8px;
    }
  }

  .h5Img {
    min-height: 200px;
  }

  .detail-button {
    flex: 1;
    text-align: center;
  }

  .van-button {
    width: 400px;
  }

  .detail-body {
    overflow-y: scroll;
    overflow-x: hidden;
    flex: 1;
    color: var(--cur-font-color-ccc);
    .m-button {
      text-align: center;
    }
  }

  article {
    padding: 30px;
    font-size: 28px;
    line-height: 1.5;

    :deep(p) {
      margin: 0 0 15px 0;
      line-height: 50px;
      strong span {
        color: var(--theme-color) !important;
      }
    }

    :deep(img) {
      max-width: 100%;
    }

    :deep(table) {
      width: 100%;
      height: auto !important;
      border-spacing: 0;
      border-collapse: separate !important;
      border-radius: 20px 20px;
      overflow: hidden;
      // overflow-x: auto;
      // display: block;

      tbody {
        text-align: center !important;

        tr {
          height: auto !important;
          background-color: transparent !important;

          &:first-child {
            td {
              background: var(--theme-color) !important;
              font-weight: 500 !important;
              white-space: nowrap !important;
              color: var(--font-color-fff) !important;
              border: 2px solid var(--theme-color) !important;
              padding: 10px !important;
            }
          }
          &:last-child {
            td:first-child {
              border-radius: 0 0 0 20px;
            }
            td:last-child {
              border-radius: 0 0 20px 0;
            }
          }
        }

        td {
          background-color: transparent !important;
          border: 2px solid rgba(#666, 0.5) !important;
          border-right-width: 0 !important;
          font-size: 24px !important;
          padding: 15px 0 !important;
          height: auto !important;
          &:last-child {
            border-right-width: 2px !important;
          }
          p {
            margin-bottom: 0 !important;
          }
        }
      }
    }

    :deep(.rule) {
      margin-top: 30px;

      .ruleTitle {
        display: flex;
        align-items: center;
        font-size: 26px;

        span {
          width: 8.0025px;
          display: inline-block;
          height: 32.0025px;
          background-color: var(--theme-color);
          margin-right: 9.9975px;
          border-radius: 0 3.9975px 3.9975px 0;
        }
      }

      .ruleExplain {
        color: var(--font-color-666);
        margin-top: 20.0025px;
        font-size: 26.0025px;
        line-height: 39.9975px;
      }
    }
  }
}
.van-empty.empty {
  height: 100vh;
}
</style>
