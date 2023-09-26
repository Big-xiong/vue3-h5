<template>
  <section-wrap :title="$t('月度详细数据')" class="commission-list">
    <div class="list-wrap">
      <van-list
        v-model:loading="getCommissionDataLoading"
        :finished="finished"
        :finished-text="commissionList.length ? $t('没有更多了') : ''"
        @load="onLoad"
        v-if="commissionList.length"
        :offset="50"
      >
        <div v-for="(item, index) in commissionList" :key="index" class="list-wrap" @click="handleDetail(item)">
        <div class="outline-wrap">
          <div class="sub-title">{{ item.date }}{{ $t("佣金") }}</div>
          <div class="theme-text" :class="[item.className]" v-money="item.commission"></div>
        </div>
        <div class="info-list-wrap">
          <div class="info-list" style="width: 75%;">
            <div>
              <div>
                <span>{{ $t("纯利") }}:</span>
                <span v-money="item.profit"></span>
              </div>
              <div>
                <span>{{ $t("佣金比例") }}:</span>
                <span>{{ item.rate * 100 }}%</span>
              </div>
              <div>
                <span>{{ $t("活跃会员") }}:</span>
                <span>{{ item.active_members }}</span>
              </div>
              <div>
                <span>{{ $t("新增注册") }}:</span>
                <span>{{ item.new_members }}</span>
              </div>
              <!-- <div>
                <span>{{ $t("扣减") }}:</span>
                <span>{{ item.commission_deducted }}</span>
              </div>
              <div>
                <span>{{ $t("补发") }}:</span>
                <span>{{ item.commission_replenish }}</span>
              </div>-->
              <div>
                <span>{{ $t("存取差") }}:</span>
                <span v-money="item.sub"></span>
              </div>
            </div>
          </div>
          <div class="tips">
            {{ status[item.status] }}
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      </van-list>

      <van-empty
        class="empty"
        v-if="!commissionList.length && inited"
        :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
        :description="$t('暂无数据')"
      />
    </div>
  </section-wrap>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { agentcommissionlog } from '@/api/agent';
import SectionWrap from '../components/SectionWrap.vue';
import { useDicts } from '@/utils/hooks';

const global = inject('global');

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
});

const status = ref([]);
useDicts('agentcommissionstatus', (result) => {
  status.value = result;
}, { immediate: true });

const commissionList = ref([]);
const finished = ref(false);
const inited = ref(false);
const date = reactive({
  current: 1,
  last_page: 1,
});

const { run: getCommissionData, loading: getCommissionDataLoading } = useRequest((params) => agentcommissionlog({
  ...params,
  page: params?.load ? date.current : 1,
  LOADING: true,
}), {
  onSuccess(result, params) {
    const commissionListTemp = result.data.map((item) => {
      const commission = item.commission[0];
      let className = 'normal';
      let commissionNumber = '';
      let symbol = '';
      if (commission === '-') {
        className = 'minus';
        commissionNumber = item.commission.slice(1, item.commission.length);
        symbol = item.commission[0];
      } else if (commission === '+') {
        className = 'plus';
        commissionNumber = item.commission.slice(1, item.commission.length);
        symbol = item.commission[0];
      } else {
        commissionNumber = item.commission;
      }

      return {
        ...item,
        commissionNumber,
        symbol,
        className,
      };
    });
    if (params[0]?.load) {
        commissionList.value = commissionList.value.concat(commissionListTemp);
      } else {
        date.current = 1;
        finished.value = false;
        commissionList.value = commissionListTemp;
      }
      inited.value = true;
      date.last_page = result.last_page;
      if (date.current >= result.last_page) finished.value = true;
  },
});

function onLoad() {
  if (date.current < date.last_page) {
    date.current += 1;
    getCommissionData({ load: true, ...props.params });
  }
}
watch(() => props.params, () => getCommissionData(props.params), { deep: true });

const router = useRouter();

function handleDetail(item) {
  sessionStorage.setItem('agent_commission_detail', JSON.stringify(item));
  router.push({ name: 'agentCommissionDetail' });
}
</script>

<style lang="less" scoped>
.commission-list {
  :deep(.tip) {
    margin-top: 26px;
    padding: 0;
  }

  .list-wrap {
    width: 100%;
    margin-bottom: 20px;

    .outline-wrap {
      display: flex;
      justify-content: space-between;
    }

    .list-text {
      color: var(--font-color-606060);

      div span {
        color: var(--dark-fff, var(--font-color-222930));
        font-size: 24px;

        &:nth-child(odd) {
          color: var(--font-color-606060);
          padding-right: 5px;
        }
      }
    }

    .sub-title {
      font-size: 32px;
      color: var(--dark-fff, var(--font-color-333333));
      padding: 10px 0 28px;
    }

    .info-list-wrap {
      display: flex;
      justify-content: space-between;
    }

    .info-list {
      >div {
        display: flex;
        flex-wrap: wrap;

        >div {
          width: 50%;
          padding-bottom: 20px;

          span {
            font-size: 24px;
            color: var(--font-color-606060);

            &:last-child {
              padding-left: 8px;
              color: var(--dark-fff, var(--font-color-999999));
            }
          }

          &:last-child {
            width: 100%;
          }
        }
      }
    }

    .theme-text {
      color: var(--theme-color, var(--font-color-2d2e2f));
      font-size: 40px;

      &.plus,
      &.normal {
        color: var(--theme-color);
      }

      &.minus {
        color: var(--font-color-ff000b);
      }
    }

    .btn {
      background: none;
      border: 2px solid var(--theme-color);
      padding: 15px;
      border-radius: 15px;
      color: var(--theme-color);
    }
  }

  .empty {
    text-align: center;
    color: var(--dark-fff, var(--font-color-222930));
    margin: 37.5px 0;
  }

  .tips {
    font-size: 24px;
    white-space: nowrap;
    color: var(--font-color-999999);
  }
}
</style>
