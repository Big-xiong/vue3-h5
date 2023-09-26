<template>
  <div class="history-wrap">
    <div class="main">
      <div
        v-if="dataObj.recordList.length"
        class="wash-money"
      >
        <div class="money">
          <p v-money="dataObj.stat[4] || 0"></p>
          <p>{{ $t('累计洗码总金额') }}</p>
        </div>
      </div>
      <div
        class="list"
        v-if="dataObj.recordList.length"
      >
        <div class="detail">
          <van-list
            v-model="recordLoading"
            :finished="dataObj.finished"
            :finished-text="$t('已加载全部了')"
            @load="loadData"
          >
            <div
              class="item"
              v-for="(item, index) in dataObj.recordList"
              :key="index"
            >
              <div class="layout-flex-between col t">
                <div class="l">
                  {{ dicts?.platformgameidsv2?.filter((child) => child.game_cate_id === item.game_type)[0]?.name ?? '' }}
                  <span v-show="item.proportion">{{ item.proportion }}%</span>
                </div>
                <div
                  class="r"
                  v-money="item.money"
                ></div>
              </div>
              <div class="layout-flex-between col b">
                <div class="l">{{ item.created_at }}</div>
                <div class="r">{{ item.status_text }}</div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <div
      class="layout-flex-center empty"
      v-if="dataObj.noData && !dataObj.recordList?.length"
    >
      <!-- <img
        :src="$getSrc(`/src/assets/images/center/ckjl.png`)"
        alt
      /> -->
      <svg-icon name="history" />
      <div class="text">{{ $t('非常抱歉未查询到任何洗码记录') }}</div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { washcoderecord } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const dataObj = reactive({
  startTime: '',
  endTime: '',
  noData: false,
  recordList: [],
  columns: [],
  total: 0,
  current: 1,
  stat: {},
  finished: false,
});

const $store = inject('store');
$store.dispatch('app/getDict', ['platformgameidsv2']);
const { dicts } = $store.state.app;

const { run: recordRun, loading: recordLoading } = useRequest(
  () => washcoderecord({
    page: dataObj.current, start_time: dataObj.startTime || '', end_time: dataObj.endTime || '',
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      dataObj.recordList = dataObj.recordList.concat(res.data);
      dataObj.total = res.total;
      dataObj.stat = res.stat;
      dataObj.noData = !res.data.length;
      if (dataObj.current >= res.last_page) {
        dataObj.finished = true;
      }
    },
  },
);
function pageUpdataObj(val) {
  dataObj.current = val;
  recordRun();
}

function loadData() {
  dataObj.current += 1;
  recordRun();
}

</script>

<style lang="less" scoped>
.history-wrap {
  .main {
    .wash-money {
      padding-top: 40px;
      height: 150px;
      background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));

      .money {
        text-align: center;

        > p:first-child {
          height: 84px;
          line-height: 84px;
          font-size: 60px;
          color: var(--dark-fff, var(--font-color-333333));
        }

        > p:last-child {
          height: 24px;
          font-size: 24px;
          font-weight: 400;
          color: var(--dark-fff-06, var(--font-color-333333));
          line-height: 24px;
          opacity: 0.6;
        }
      }
    }

    .list {
      padding: 20px 30px;

      .detail {
        .item {
          box-sizing: border-box;
          position: relative;
          padding: 20px 0;
        }

        .t {
          font-size: 32px;
          color: var(--font-color-333333);
          .l {
            height: 44px;
            line-height: 44px;
            color: var(--dark-fff, var(--font-color-000000));
            margin-bottom: 8px;
          }
        }

        .b {
          font-size: 32px;
          font-weight: 600;
          color: var(--font-color-b1b1b1);

          .l {
            height: 24px;
            font-size: 24px;
            color: var(--dark-fff-04, var(--font-color-515104));
            line-height: 24px;
          }

          .r {
            height: 34px;
            font-size: 24px;
            font-weight: 400;
            color: var(--font-color-24c29a);
            line-height: 34px;
          }
        }

        .col {
          display: flex;
          position: relative;
          .r {
            color: var(--font-color-24c29a);
          }
          .l {
            flex: 1;
          }
        }
      }
    }
  }

  .empty {
    flex-direction: column;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0;
    margin-left: 0;

    .svg-icon-wrap {
      width: 76px;
      height: 88px;
    }

    .text {
      text-align: center;
      margin-top: 60px;
      font-size: 28px;
      color: var(--dark-fff, var(--font-color-222930));
      opacity: 0.4;
      line-height: 48px;
      white-space: nowrap;
    }
  }
}
</style>
