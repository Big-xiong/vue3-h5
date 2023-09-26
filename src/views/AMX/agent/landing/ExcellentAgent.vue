<template>
  <div class="agent-excellent">
    <div class="agent-excellent-content">
      <div class="title">
        <div class="top">{{ $t("上月优秀代理") }}</div>
      </div>
      <div class="excellent-list">
        <div
          class="list-wrap"
          v-for="(user, index) in excellentData"
          :key="index"
        >
          <div class="list">
            <div class="member">{{ $t("会员") }} {{ user.username }}</div>
            <div class="commission">
              {{ $t("上月佣金") }}：￥{{ user.month_fee }}
            </div>
            <p class="household">
              {{ $t("累计开户") }}：{{ user.members }}{{ $t("户") }}
            </p>
            <p class="date">
              {{ $t("已运营") }}{{ parseInt(user.months / 12) }}{{ $t("年")
              }}{{ user.months % 12 }}{{ $t("月") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { excellentagent } from '@/api/agent';
import { useRequest } from 'ahooks-vue';
import { ref } from 'vue';

const excellentData = ref([]);

useRequest(() => excellentagent(), {
  onSuccess(result) {
    excellentData.value = result.slice(0, 10);
  },
});
</script>

<style scoped lang="less">
.agent-excellent {
  .excellent-list {
    margin-top: 54px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px;
  }

  .list-wrap {
    width: 50%;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
  }

  .list {
    font-size: 24px;
    display: flex;
    flex-direction: column;
    font-weight: 400;
    text-align: left;
    flex: 1;
    background: var(--bg-color-1d395d);
    position: relative;
    border-radius: 8px;

    .member {
      padding: 30px 30px 0;
      font-weight: 400;
      color: var(--font-color-ffffff);
    }

    .commission {
      color: var(--font-color-ffffff);
      opacity: 0.6;
      padding: 0 30px;
      margin-top: 10px;
    }

    .household {
      font-size: 28px;
      font-weight: 600;
      color: var(--font-color-ffffff);
      padding: 20px 30px;
      border-bottom: 2px solid var(--border-bottom-fff-1);
      margin: 0;
    }

    .date {
      color: var(--font-color-ffffff);
      padding: 20px 30px;
    }
  }
}
</style>
