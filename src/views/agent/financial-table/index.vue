<template>
  <div class="financial-table-wrap">
    <van-nav-bar
      :title="$t('账变记录')"
      @click-left="router.go(-1)"
      left-arrow
      @click-right="isShowPopup = true"
      :right-text="$t('筛选')"
    />

    <div class="list-wrap">
      <van-list
        v-model:loading="changeLogLoading"
        :finished="finished"
        :finished-text="list.length ? $t('没有更多了') : ''"
        @load="onLoad"
        v-if="list.length"
        :offset="50"
      >
        <div class="item" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
          <div class="p p1">
            <span class="left">
              <b>{{ accountChangeType[item.type] || $t('余额增加') }}</b>
              <i v-money="item.money"></i>
            </span>
            <span class="right">{{ item.created_at }}</span>
          </div>
          <div class="p p2">
            <span class="left">
              <span class="label">{{ $t('现余额') }}：</span>
              <i v-money="item.after_money * 1 + item.after_commission_money * 1"></i>
              ({{ $t('代理') }}
              <i v-money="item.after_money"></i>
              /{{ $t('佣金') }}
              <i v-money="item.after_commission_money"></i>)
            </span>
            <span class="right">
              <span class="label">{{ $t('账变前余额') }}：</span>
              <i v-money="item.before_money * 1 + item.before_commission_money * 1"></i>
              ({{ $t('代理') }}
              <i v-money="item.before_money"></i>
              /{{ $t('佣金') }}
              <i v-money="item.before_commission_money"></i>)
              <van-icon v-if="item.type === 6" name="arrow" />
            </span>
            <span class="right">
              <span class="label">{{ $t('账变前累积结余') }}：</span>
              <i v-money="item.before_commission_loss"></i>
            </span>
            <span class="right">
              <span class="label">{{ $t('账变后累积结余') }}：</span>
              <i v-money="item.after_commission_loss"></i>
            </span>
          </div>
        </div>
      </van-list>

      <van-empty
        class="empty"
        v-if="!list.length && inited"
        :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
        :description="$t('暂无数据')"
      />
    </div>

    <FilterPopup
      @confirm="handleFilerConfirm"
      @close="isShowPopup = false"
      v-model:isShow="isShowPopup"
      isCalendar
      type="date"
    >
      <template #input>
        <div class="select-input">
          <p class="title">{{ $t('账变类型') }}</p>
          <div class="day-list">
            <div
              class="day-item"
              @click="onType(key)"
              :class="{ active: key == typeValue }"
              v-for="(val, key) in accountChangeType"
              :key="key"
            >{{ val }}</div>
          </div>
          <van-field
            class="userInput"
            type="text"
            v-model="username"
            :placeholder="$t(`输入需要搜索的会员代充账号`)"
          />
        </div>
      </template>
    </FilterPopup>
  </div>
</template>

<script setup>
import {
 inject, queuePostFlushCb, reactive, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { agentaccountchangelog } from '@/api/agent';
import { useDicts } from '@/utils/hooks';
import FilterPopup from '@/components/Popup/FilterPopup.vue';

const isShowPopup = ref(false);
const finished = ref(false);
const list = ref([]);
const accountChangeType = ref({});
const global = inject('global');
const detailData = ref({});
const typeValue = ref(0);
const username = ref('');
const inited = ref(false);
const date = reactive({
  current: 1,
  last_page: 1,
});
const router = useRouter();

useDicts('agentaccountchangetype', (value) => {
  accountChangeType.value = {
    ...value,
  };
  accountChangeType.value[0] = global.$t('全部');
}, { immediate: true });

const AgentDetail = (data) => global.$popup({ tpl: 'AgentFinancialDetail', detailData: data });

function handleDetail(item) {
  if (item.type === 6) {
    detailData.value = {
      ...item,
    };
    AgentDetail(detailData.value);
  }
}

function onType(value) {
  typeValue.value = value;
}

const { run: getChangeLog, loading: changeLogLoading } = useRequest(
  (params = {}) => agentaccountchangelog({
      ...params,
      page: params?.load ? date.current : 1,
      LOADING: true,
    }),
  {
    onSuccess(result, params) {
      if (params[0]?.load) {
        list.value = list.value.concat(result.data);
      } else {
        date.current = 1;
        finished.value = false;
        list.value = result.data;
      }
      inited.value = true;
      date.last_page = result.last_page;
      if (date.current >= result.last_page) finished.value = true;
    },
  },
);
const filterData = ref({});
function handleFilerConfirm(data) {
  filterData.value = data;
  getChangeLog({
    ...data,
    type: typeValue.value,
    username: username.value,
  });
  isShowPopup.value = false;
}
function onLoad() {
  if (date.current < date.last_page) {
    date.current += 1;
    getChangeLog({ load: true, ...filterData.value });
  }
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  background-color: var(--theme-color);
  color: var(--font-color-ffffff);
  .van-nav-bar__title {
    color: var(--font-color-ffffff);
  }
  .van-nav-bar__text {
    color: var(--font-color-ffffff);
  }
}

.financial-table-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: var(--bg-color-161616);

  .list-wrap {
    padding: 0 30px 30px;
    box-sizing: border-box;
    position: relative;
    overflow-y: auto;
    flex: 1;

    .empty-wrap {
      text-align: center;
    }
    .empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .item {
      padding: 50px 0 0;
      box-sizing: border-box;
      border-bottom: 2px solid var(--dark-333, var(--border-color-e7e7e7));

      .p {
        display: flex;
      }

      .p1 {
        height: 44px;
        font-size: 32px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-999999));
        line-height: 44px;

        .left {
          font-size: 32px;
          color: var(--theme-color);

          b {
            color: var(--dark-fff, var(--font-color-333333));
            padding-right: 20px;
          }
        }

        .right {
          height: 44px;
          font-size: 28px;
          color: var(--cur-font-color-fff);
          line-height: 44px;

          .label {
            color: var(--dark-fff, var(--font-color-999999));
            font-size: 24px;
          }
        }
      }

      .p2 {
        margin: 30px 0 40px;
        font-size: 24px;
        font-weight: 400;
        color: var(--dark-fff, var(--font-color-222930));
        line-height: 34px;
        flex-direction: column;

        .label {
          color: var(--cur-font-color-fff-4, var(--font-color-606060));
          padding-right: 5px;
        }

        .left,
        .right {
          // color: var(--dark-fff, var(--font-color-999999));
          font-size: 24px;
          margin-bottom: 10px;
        }

        .right {
          margin-top: 12px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }

      :deep(.van-icon) {
        display: inline-block;
        margin-left: auto;
      }

      .p3 {
        margin-top: -6px;
        flex-direction: row-reverse;
        margin-bottom: 40px;

        .van-button {
          width: 150px;
          height: 60px;
          background-color: transparent;
          border: 2px solid var(--theme-color);

          .van-button__text {
            display: block;
            //line-height: 60px;
            font-size: 24px;
            color: var(--theme-color);
          }
        }
      }
      @media only screen and (max-width: 320px) {
        .p3 {
          margin-top: 75px;
          flex-direction: row-reverse;
          margin-bottom: 20px;

          .van-button {
            width: 170px;
            height: 60px;
            background-color: transparent;
            border: 2px solid var(--theme-color);

            .van-button__text {
              display: block;
              font-size: 24px;
              line-height: 60px;
              color: var(--theme-color);
            }
          }
        }
      }

      .left {
        flex: 1;
      }
    }

    .loading_ing {
      width: 100%;
      text-align: center;
      line-height: 80px;
      position: absolute;
      bottom: -31px;
      background: var(--card-bg-color, var(--bg-color-fff));
      color: var(--font-color-bd8c24);

      img {
        width: 50px;
        position: relative;
        top: 15px;
      }

      .loading-1 {
        width: 30px;
        height: 30px;
        position: relative;
        left: 40px;
        top: 5px;
      }

      .loading-2 {
        animation: rotation 1s linear infinite;
      }
    }

    .chanebac {
      background: none;
      color: var(--font-color-fff);
    }

    .nomore {
      width: 100%;
      text-align: center;
      line-height: 80px;
      color: var(--dark-fff, var(--font-color-222930));
    }
  }
}

.select-input {
  .title {
    height: 44px;
    font-size: 32px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-222930));
    line-height: 44px;
    margin: 40px 20px 20px 0;
  }

  .van-cell {
    padding-left: 0;
    :deep(.van-field__body) {
      padding-left: 30px;
    }
  }

  .day-list {
    display: flex;
    flex-wrap: wrap;

    .day-item {
      margin-top: 20px;
      margin-right: 30px;
      box-sizing: border-box;
      flex-grow: 0;
      width: auto;
      height: 80px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      border-radius: 8px;
      border: 2px solid var(--dark-333, var(--border-color-cccccc));
      font-size: 28px;
      font-weight: 400;
      width: 210px;
      color: var(--dark-999, var(--font-color-999999));
      text-align: center;
      padding: 0;
      &:nth-child(3n) {
        margin-right: 0px;
      }
    }

    .active {
      background-color: var(--theme-color);
      font-weight: 600;
      color: var(--font-color-ffffff);
      border-color: var(--theme-color);
    }
  }
  :deep(.van-field) {
    background-color: var(--dark-bg-color-191919);
  }
}
</style>
