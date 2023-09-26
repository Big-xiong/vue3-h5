<template>
  <div class="financial-wrap">
    <teleport to="#app">
      <van-nav-bar
        class="m-header m-header-financial"
        :title="$t('理财小金库')"
        left-arrow
        :right-text="$t('筛选')"
        @click-left="$router.push({ name: 'user' })"
        @click-right="isShow = true"
      />
    </teleport>
    <div class="financial-wrap-main">
      <div class="total-box">
        <div class="total-amount">
          <div class="item">
            <div>￥{{ priceFormat(moneyData?.financing_money ?? "0.00") }}</div>
            <div>{{ $t("钱包总资产") }}</div>
          </div>
          <div class="item">
            <div>￥{{ priceFormat(moneyData?.max_profit ?? "0.00") }}</div>
            <div>{{ $t("最高收益") }}</div>
          </div>
          <van-icon
            v-if="moneyData?.hasOwnProperty('day_rate')"
            @click="showMsg"
            name="question"
          />
        </div>
        <!-- 收益统计 -->
        <div class="income">
          <div class="total-amount">
            <div class="item">
              <div>￥{{ priceFormat(moneyData?.all_profit ?? "0.00") }}</div>
              <div>{{ $t("历史累计收益") }}</div>
            </div>
            <div class="item">
              <div>￥{{ priceFormat(moneyData?.month_profit ?? "0.00") }}</div>
              <div>{{ $t("本月累计收益") }}</div>
            </div>
          </div>
          <div class="total-amount">
            <div class="item">
              <div>￥{{ priceFormat(moneyData?.week_profit ?? "0.00") }}</div>
              <div>{{ $t("本周累计收益") }}</div>
            </div>
            <div class="item">
              <div>￥{{ priceFormat(moneyData?.day_profit ?? "0.00") }}</div>
              <div>{{ $t("昨日收益") }}</div>
            </div>
          </div>
          <!-- 浮动按钮 -->
          <div class="layout-flex-between income-btn">
            <van-button @click="openMoney(1)">{{ $t("转出") }}</van-button>
            <van-button type="primary" @click="openMoney(2)">{{
              $t("转入")
            }}</van-button>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div v-if="date.recordList.length > 0" class="lists">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="$t('没有更多了')"
          @load="onLoad"
        >
          <div class="list">
            <div
              class="item"
              v-for="(item, index) in date.recordList"
              :key="index"
            >
              <div class="blod">
                <span v-if="statusArr">{{
                  statusArr[item.type * 1] ?? ""
                }}</span>
                <span>{{ item.type == 2 ? "-" : "+" }}{{ item.money }}</span>
              </div>
              <div>
                <span>{{ item.created_at }} | {{ item.trade_no }}</span>
                <span>{{ item.sum || "0.00" }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <div class="empty" v-if="!date.recordList.length">
        <div class="emptyWallet"></div>
        <div class="text">
          <div class="chinese">{{ $t("非常抱歉未查询到任何理财记录1") }}</div>
        </div>
      </div>
    </div>

    <FilterPopup
      :isShow="isShow"
      :hasTimeFilter="false"
      @confirm="
        isShow = false;
        recordRun();
      "
      @close="isShow = false"
    >
      <template #topInput>
        <div class="select">
          <div class="day-list">
            <div class="day-item" @click="onDay(0)" :class="{ active: 0 == date.chooseStatus }">
                {{ $t("全部类型") }}
            </div>
            <div
              class="day-item"
              :class="{ active: key == date.chooseStatus }"
              v-for="(i, key, index) in statusArr"
              :key="index"
              @click="onDay(key)"

            >
              {{ i }}
            </div>
          </div>
        </div>
      </template>
    </FilterPopup>
  </div>
</template>

<script setup>
import {
 inject, reactive, ref, h,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Dialog } from 'vant';
import {
  moneywallet,
  allmoneytype,
  moneytrans,
  transrecord,
  allmoneytranstype,
} from '@/api/center';
import { priceFormat } from '@/utils/index';
import FilterPopup from '@/components/Popup/FilterPopup.vue';

const global = inject('global');
const isShow = ref(false);
const show = ref(false);
const date = reactive({
  recordList: [],
  total: 0,
  noData: false,
  current: 1,
  chooseStatus: 0,
});
// 获取金额
const { run: doGetData, data: moneyData } = useRequest(moneywallet);

const { data: statusArr } = useRequest(allmoneytranstype);
const { run: recordRun, loading: recordLoading } = useRequest(
  () => transrecord({
    LOADING: true,
    page: date.current,
    type: date.chooseStatus || '',
    start_time: date.startTime || '',
    end_time: date.endTime || '',
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.recordList = res.data;
      date.total = res.total;
      date.noData = !res.data.length;
    },
  },
);

function onDay(val) {
  date.chooseStatus = val;
}

function openMoney(type) {
  global.$popup({
    tpl: 'MoneyTransfer',
    type,
    data: moneyData?.value,
    onClose() {
      doGetData();
      recordRun();
    },
  });
}

function showMsg() {
  show.value = true;
  global.$dialog({
    tpl: 'AgentTips',
    className: 'dialog-content-text-left',
    title: global.$t('温馨提示'),
    text: `${global.$t('您当前收益率')}：${(moneyData?.value.day_rate * 100).toFixed(2)}%`,
    message: `${global.$t('使用理财小金库可让您额外获得高额利息，收益率将按照转入金额*不同等级计算。发放时间为每天下午4点准时发放到您的理财钱包。')}`,
    confirmText: global.$t('我知道了'),
  });
}
</script>

<style lang='less' scoped>
:deep(.van-nav-bar__content) {
  background-color: var(--theme-color);
}

.financial-wrap {
  height: 100%;

  &-main {
    .total-box {
      position: relative;
      padding-top: 40px;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 388px;
        background-color: var(--theme-color);
        z-index: 1;
      }

      > .total-amount {
        margin: 0 20px 0;
        height: 172px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;

        .van-icon {
          margin-left: 10px;
          color: rgba(#fff, 0.8);
          font-size: 36px;
          position: absolute;
          top: 0;
          right: 47px;
        }

        .item {
          flex: 1;
          text-align: center;
          position: relative;

          > div:first-child {
            color: var(--font-color-fff);
            font-size: 38px;
            font-weight: 600;
            line-height: 52px;
          }

          > div:last-child {
            color: var(--font-color-fff);
            font-size: 26px;
            font-weight: 400;
            line-height: 36px;
          }
        }
      }

      .income {
        background-color: var(--bg-color-282828);
        border-radius: 8px;
        margin: 0 20px;
        position: relative;
        z-index: 2;
        padding-top: 30px;

        > .total-amount {
          border-radius: 0;
          height: 150px;
          position: relative;
          margin: 0 20px;
          display: flex;
          justify-content: center;
          align-items: center;

          .item {
            flex: 1;
            text-align: center;
            position: relative;

            > div:first-child {
              font-size: 28px;
              color: var(--font-color-fff);
            }

            > div:last-child {
              margin-top: 15px;
              font-size: 24px;
              color: var(--font-color-999);
            }
          }
        }

        &-btn {
          padding: 20px 30px;

          .van-button {
            height: 76px;
            width: calc(50% - 10px);

            &--default {
              border-color: rgba(#fff, 0.08);
              color: var(--font-color-fff);
            }
          }
        }
      }
    }

    .lists {
      margin-top: 20px;
    }

    .list {
      padding-top: 30px;
      margin: 20px;

      .item {
        padding: 0 20px 30px;
        position: relative;
        border-bottom: 2px solid var(--border-color-3f3f3f);

        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--font-color-999);
          font-size: 24px;
          margin-top: 20px;

          > span:first-child {
            color: var(--theme-color);
          }
        }

        &:last-child {
          margin-top: 30px;
        }

        .blod {
          color: var(--font-color-ccc);
          font-size: 28px;
          font-weight: 600;

          > span:first-child {
            color: var(--font-color-ccc);
          }
        }
      }
    }
  }

  .select {
    padding-top: 30px;
  }

  .empty {
    .errorImg {
      width: 224px;
      height: 224px;
      margin: 0 auto;
      margin-top: 40px;
      background-image: url("/src/assets/images/center/fund-management/empty.png");
      background-repeat: no-repeat;
      background-size: contain;
    }

    .emptyWallet {
      width: 170px;
      height: 220px;
      margin: 0 auto;
      margin-top: 40px;
      background-image: url("/src/assets/images/center/fund-management/none.png");
      background-repeat: no-repeat;
      background-size: contain;
    }

    .text {
      color: var(--font-color-f5f5f5);
      text-align: center;

      .chinese {
        margin-top: 30px;
        font-size: 28px;
        color: var(--font-color-ccc);
        line-height: 1;
      }
    }
  }

  .tips-p {
    padding: 0 70px 30px;
    font-size: 28px;
    color: var(--font-color-646566);

    &:nth-child(1) {
      padding-top: 0;
    }
  }

  :deep(.van-dialog__footer) {
    justify-content: center;
    padding-bottom: 20px;
  }
}

</style>
