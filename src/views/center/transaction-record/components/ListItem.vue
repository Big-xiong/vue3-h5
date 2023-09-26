<template>
  <div class="list-item-wrap">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="recordList?.length ? $t('没有更多了') : ''"
      @load="onLoad">
      <div class="date-list-wrap" v-for="(dateItem, dateIndex) in recordList" :key="dateItem.date">
        <div
          class="list-date-item"
        >{{ dateItem.is_today === 1 ? $t('今日') : dateRange(dateItem.date) }}</div>
        <li
          v-for="(item, index) in dateItem.list"
          :key="index"
          :class="{ 'last-date': dateIndex === recordList.length - 1 }"
        >
          <slot :item="item" />
          <div class="list_content">
            <div class="layout-flex-between header">
              <slot name="header" :item="item">
                <span>{{ item.name }}</span>
              </slot>
              <slot name="money" :item="item">
                <span v-money="item.money"></span>
              </slot>
            </div>
            <div class="layout-flex-between status">
              <slot :item="item" name="status-left">
                <span>{{ item.trade_no }}</span>
              </slot>
              <slot :item="item" name="status-right">
                <span>{{ item.updated_at }}</span>
              </slot>
            </div>
            <div class="layout-flex-between remark" v-if="showRemark">
              <slot name="remark-note" :item="item">
                <span class="note">{{ item.remark ? $t('备注：') + item.remark : '' }}</span>
              </slot>
              <slot name="remark-time" :item="item">
                <span class="time">{{ filterTime(item.updated_at) }}</span>
              </slot>
            </div>
          </div>
        </li>
      </div>
    </van-list>
    <div class="record-nodata" v-show="noData">
      <!-- <img src="@/assets/images/center/ckjl.png" alt /> -->
      <SvgIcon name="my_Blank" />

      <p>{{ $t('非常抱歉未查询到任何记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import { dateRange } from '@/utils/index';
import SvgIcon from '@/components/SvgIcon.vue';

defineProps({
  recordList: {
    type: Array,
    default: () => ([]),
  },
  noData: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  finishedText: {
    type: String,
    default: () => window.$t('已加载全部'),
  },
  showRemark: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onLoad']);

function onLoad() {
  emit('onLoad');
}

function filterLevel(val) {
  return val.substr(5, val.length - 8);
}

function filterTime(val) {
  return val.substr(11, val.length - 14);
}
</script>

<style lang="less" scoped>
.list-item-wrap {
  :deep(.van-list) {
    li {
      list-style: none;
      display: flex;
      width: calc(100% - 60px);
      margin: 0 auto;

      &:not(:last-of-type) {
        border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
      }

      &.last-date {
        border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
      }

      &:nth-child(2) {
        padding-top: 30px;
      }

      .svg-icon-wrap,
      img {
        display: block;
        width: 60px;
        height: 60px;
        margin: 30px 20px auto 0;
        border-radius: 50%;
      }

      .tag {
        min-width: 60px;
        height: 60px;
        margin: 0 20px 0 0;
        border-radius: 30px;
        text-align: center;
        line-height: 60px;
        background-color: var(--bg-color-24c29a);
        color: var(--font-color-ffffff);
      }

      > .list_content {
        flex: 1;
        height: initial;
        line-height: initial;
        // border-bottom: 2px solid var(--border-color-323232);
        padding: 20px 0 24px;
        font-size: 24px;

        &.width100 {
          width: 100%;
        }

        .header {
          width: 100%;
          font-weight: 600;

          > span:first-child {
            font-size: 28px;
            color: var(--dark-fff, var(--font-color-c5cfd6));
          }

          > span:last-child {
            float: right;
            font-weight: 600;
            color: var(--theme-color);
            font-size: 32px;
          }
        }

        .status {
          width: 100%;
          margin-top: 20px;

          > span:first-child {
            word-wrap: break-word;
          }

          > span {
            opacity: 0.6;
            color: var(--dark-fff, var(--font-color-333333));
          }
        }

        .remark {
          position: relative;

          > .note {
            color: var(--dark-fff, var(--font-color-222930));
            margin-top: 20px;
            width: 80%;
            overflow: hidden;
          }

          > .time {
            color: var(--font-color-fff-6);
            margin-top: 20px;
          }
        }
      }
    }
  }
}

.record-nodata {
  text-align: center;
  color: var(--dark-fff, var(--font-color-222930));
  height: calc(100vh - 358px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .svg-icon-wrap {
    width: 76px;
    height: 88px;
    margin-bottom: 28px;
  }
}

.date-item {
  height: 60px;
  background-color: var(--dark-bg-color-191919, var(--bg-color-f7f7f7));
  color: var(--dark-fff, var(--font-color-333333));
  line-height: 60px;
  font-weight: 500;
  padding-left: 30px;
}

:deep(.red) {
  color: var(--font-color-ff6666) !important;
}

:deep(.green) {
  color: var(--theme-color) !important;
  opacity: 1 !important;
}
</style>
