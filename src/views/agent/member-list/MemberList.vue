<template>
  <section-wrap :title="$t('下级成员列表')" class="member-list-wrap">
    <template #rightBtn>
      <div class="right-wrap" @click="isShowFilter = true">
        <!-- <van-image :src="$getSrc('/src/assets/images/agent/filter.png')"></van-image> -->
        <SvgIcon name="filter" />
        <span>{{ $t("筛选") }}</span>
      </div>
    </template>

    <van-empty
      v-if="requested && memberListData.length === 0"
      :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
      :description="$t('暂无数据')"
    />

    <div class="member-list" v-else>
      <van-list>
        <div
          class="member-item"
          v-for="(item, index) in memberListData"
          :key="index"
          @click="handleDetail(item)"
        >
          <div class="p p1">
            <span class="left">{{ item.username }}</span>
            <span
              class="right"
              v-money:[item.currency.symbol]="item.user_wallet_static.valid_invest"
            ></span>
          </div>
          <div class="p p2">
            <div class="left">
              <span>
                {{ $t("等级") }}:
                <em>{{ item.level || 0 }}</em>
              </span>
              <span>
                {{ $t("存款") }}:
                <em
                  v-money:[item.currency.symbol]="item.user_wallet_static.deposit_money || 0"
                ></em>
              </span>
              <span>
                {{ $t("提款") }}:
                <em
                  v-money:[item.currency.symbol]="item.user_wallet_static.draw_money || 0"
                ></em>
              </span>
            </div>
            <span class="right">
              {{ $t("有效投注") }}
              <van-icon name="arrow" />
            </span>
          </div>
        </div>
      </van-list>
    </div>
    <Filter
      :isShow="isShowFilter"
      @close="isShowFilter = false"
      type="date"
      isCalendar
      @confirm="onFilterConfirm"
    >
      <template #topInput>
        <div class="filter-name-wrap"></div>
        <h3>{{ $t("会员账号") }}</h3>
        <div class="pop-search-wrap-input">
          <van-field :placeholder="$t('请输入会员账号')" v-model="username" />
        </div>
      </template>
    </Filter>
  </section-wrap>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Filter from '@/components/Popup/FilterPopup.vue';
import { memberlist } from '@/api/agent';
import SectionWrap from '../components/SectionWrap.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const memberListData = ref([]);

const isShowFilter = ref(false);
const router = useRouter();
const username = ref('');

function handleDetail(data) {
  sessionStorage.setItem('memberDetailData', JSON.stringify(data));
  router.push({ name: 'agentMemberDetail', query: { id: data.id } });
}

const requested = ref(false);
const { run: getMemberListData, loading: getMemberLoading } = useRequest(
  (params) => memberlist({
    ...params,
    LOADING: true,
  }),
  {
    manual: true,
    onSuccess(result) {
      requested.value = true;
      memberListData.value = result.data;
    },
  },
);

const dateFilterData = ref({
  statinfo_start: '',
  statinfo_end: '',
});

function onFilterConfirm(data) {
  dateFilterData.value.statinfo_start = data.start_text;
  dateFilterData.value.statinfo_end = data.end_text;
  isShowFilter.value = false;

  getMemberListData({
    ...dateFilterData.value,
    username: username.value,
    size: 99999,
  });
}

getMemberListData({
  ...dateFilterData.value,
  username: username.value,
  size: 99999,
});
</script>

<style scoped lang="less">
.member-list-wrap {
  box-sizing: border-box;
  padding: 0 30px;
  height: auto;

  :deep(.tip) {
    padding: 0;
  }

  .right-wrap {
    display: flex;
    align-items: center;
    font-size: 28px;

    .svg-icon-wrap {
      width: 32px;
      height: 32px;
      fill: var(--filter-svg-color);
    }

    span {
      margin-left: 5px;
      color: var(--dark-fff);
    }
  }

  .member-item {
    padding: 40px 0;
    box-sizing: border-box;
    border-bottom: 2px solid var(--border-color-282828);

    .p {
      display: flex;
    }

    em {
      font-style: normal;
    }

    .p1 {
      height: 44px;
      font-size: 32px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-222930));
      line-height: 44px;

      .left {
        font-size: 32px;
        color: var(--dark-fff, var(--font-color-222930));
      }

      .right {
        height: 44px;
        font-size: 32px;
        font-weight: 600;
        color: var(--theme-color);
        line-height: 44px;
      }
    }

    .p2 {
      margin-top: 20px;
      height: 34px;
      font-size: 24px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-222930));
      line-height: 34px;

      .left {
        color: var(--dark-fff, var(--font-color-222930));

        span {
          padding-right: 20px;

          em {
            padding-left: 10px;
            color: var(--dark-fff, var(--font-color-222930));
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
      }
    }

    .left {
      flex: 1;
    }
  }
}

.filter-wrap {
  h3 {
    color: var(--cur-font-color-fff, var(--dark-fff));
    font-size: 32px;
    font-weight: 400;
    padding-top: 10px;
  }

  :deep(.van-field__body) {
    border: none !important;
  }

  :deep(.van-field) {
    padding-top: 0;
    padding-right: 0;
    padding-left: 0 !important;
    background: transparent;

    .van-field__control {
      line-height: 88px;
      height: 88px;
      border-radius: 8px;
      padding: 0 30px;
      border: 2px solid var(--dark-666, var(--border-color-cccccc));
      color: var(--dark-fff, var(--font-color-222930));
      font-size: 28px;
    }
  }
}

:deep(.van-empty__image) {
  width: 158px;
  height: 164px;
}
</style>

<style lang="less">
</style>
