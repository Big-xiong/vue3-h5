<template>
  <div class="active-detail-wrap">
    <van-nav-bar
      class="m-header"
      :title="activity?.title || title"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="$openKefu"
      v-if="!route.query.source"
    >
      <template #right>
        <van-icon name="service" />
      </template>
    </van-nav-bar>
    <div class="detail-body" v-if="activity?.title">
      <van-image class="h5Img" :src="activity?.h5_index_max_pic" fit="cover" />
      <div v-if="[2, 9, 10].indexOf(activity?.id) !== -1" class="m-button">
        <van-button @click="handleGo" type="primary">{{
          buttonName
        }}</van-button>
      </div>
      <article v-html="activity?.detail_content"></article>
    </div>
    <van-empty
        v-else
        :description="$t('暂无数据')"
        class="empty"
    >
      <template #image>
        <SvgIcon name="discount-empty" />
      </template>
    </van-empty>
  </div>
</template>

<script setup>
import { activitydetail } from '@/api/active';
import SvgIcon from '@/components/SvgIcon.vue';
import { useRequest } from 'ahooks-vue';
import {
  computed, inject, reactive, ref, defineProps,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const props = defineProps({
  id: Number,
});

const router = useRouter();
const store = inject('store');
const { user } = store.state;
const global = inject('global');
const activeId = [9, 10]
const activeIdThird = [2]

const id = computed(()=> route.query.id ? route.query.id * 1 : '')
const title = computed(()=> route.query.title)
const { data: activity, loading: detailLoading } = useRequest(() => activitydetail({ id: id.value }));

function handleGo() {
  if (activeId.includes(id.value) && user.isLogin) {
    router.push('/center/fund-management/deposit');
  } else if (activeIdThird.includes(id.value) && user.isLogin) {
    router.push('/center/fund-management/rebate');
  } else if (!user.isLogin) {
    router.push('/login');
  }
}

const buttonName = computed(() => {
  if (activeId.includes(id.value) && user?.isLogin) {
    return global.$t('立即存款');
  }
  if (activeIdThird.includes(id.value) && user?.isLogin) {
    return global.$t('立即洗码');
  }

  return global.$t('立即登录');
});
</script>

<style scoped lang="less">
.active-detail-wrap {
  flex-direction: column;
  display: flex;
  height: 100%;

  .van-badge__wrapper {
    color: var(--font-color-fff);
    font-size: 45px;
  }

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
    .m-button{
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
      strong span{
        color: var(--theme-color) !important;
      }
    }

    :deep(img) {
      max-width: 100%;
    }

    :deep(table) {
      width: 100%;
      height: auto !important;
      padding: 15px !important;
      margin-bottom: 20px !important;
      border-collapse: collapse !important;
      border: 2px solid var(--bg-color-282828) !important;
      overflow-x: auto;
      display: block;

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
        }

        td {
          background-color: transparent !important;
          border: 2px solid rgba(#666, 0.5) !important;
          font-size: 24px !important;
          padding: 15px 0 !important;
          height: auto !important;

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

  .van-empty.empty{
    height: 100%;
  }
}
</style>
