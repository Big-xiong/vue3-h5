<template>
  <div class="notice" :style="{ background: `url(${$getSrc('/src/assets/images/home/notice.png')}) no-repeat` }"
    @click="noticeView">
    <van-swipe :autoplay="4000" vertical @change="onChange" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in lists" :key="index">{{ item.content }}</van-swipe-item>
    </van-swipe>
    <a class="action">
      {{ $t('查看') }}
      <van-icon name="arrow" />
    </a>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { sitenotice } from '@/api/news';

const selected = ref(null);
const global = inject('global');
const $router = useRouter();

const { run: getList, data: lists, loading } = useRequest(
  sitenotice,
  {
    formatResult: (res) => res?.data ?? [],
    onSuccess() {
      onChange(0);
    },
  },
);

onMounted(() => {
  getList();
});

function noticeView() {
  global.$store.commit('app/SET_NOTICE_DATA', selected.value);
  $router.push({
    name: 'Details',
    query: {
      id: selected.value.id,
      type: 'notice',
      is_read: selected.value.is_read,
    },
  });
}

function onChange(index) {
  selected.value = lists.value[index];
}

</script>

<style lang="less" scoped>
.notice {
  color: var(--amx-notice-font-color, var(--cur-color-666666)) !important;
  box-shadow: none !important;
  margin-top: 0 !important;
  border-radius: 0 !important;
  background-size: 24px !important;
  background-position: 20px center !important;
  padding: 0 28px 0 40px !important;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 22px;
  font-family: PingFangSC, PingFangSC-Regular;

  >span {
    color: var(--theme-color);
    flex: 1;
  }

  // transform: scale(.95);
  :deep(.van-icon) {
    color: var(--theme-color) !important;
  }

  img {
    width: 26px;
  }
}

.notice-dialog.theme {
  .dialog-header-wrap {

    // background-image: url('~@assets/img3_0/notice-dialog/notice-dialog-yellow-bg.png');
    .header-title {
      color: var(--font-color-white);
    }

    .header-icon {
      // background-image: url('~@assets/img3_0/notice-dialog/header-icon-yellow.png');
    }
  }

  .dialog-content-wrap {
    background: linear-gradient(360deg, #fffbf3 0%, #ffffff 100%);
    box-shadow: 0px -3px 12px 0px rgba(124, 124, 124, 0.15);

    :deep(.van-swipe__indicator) {
      background-color: rgba(227, 181, 119, 0.5);
    }

    :deep(.van-swipe__indicator.van-swipe__indicator--active) {
      background-color: var(--bg-color-E3B577) !important;
    }

    .content {
      .content-title {
        color: var(--cur-color-666666);

        &::before {
          background-color: var(--bg-color-E3B577);
        }
      }

      .content-desc {
        color: var(--font-color-8C8C8C);
      }
    }

    .content-btn {
      span {
        color: var(--font-color-white);
        background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);

        &:hover {
          background: linear-gradient(90deg, #ccad8c 0%, #f1d7b6 100%);
        }
      }
    }
  }
}

.notice {
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px 15px;
  line-height: 50px;
  color: var(--cur-font-color-ccc);
  margin-top: 30px;
  border-radius: 70px;
  box-shadow: 0px 0.1067rem 0.4267rem 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  :deep(.van-icon) {
    width: 30px;
    height: 30px;
    font-size: 30px;
  }

  .van-swipe {
    width: 100%;
    height: 50px;
    margin: 0 15px;

    :deep(.van-swipe-item) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  a {
    position: relative;
    display: flex;
    white-space: nowrap;
    align-items: center;
    padding-left: 15px;

    .van-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    &:before {
      content: "";
      width: 2px;
      height: 28px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--theme-color);
    }
  }
}
</style>
