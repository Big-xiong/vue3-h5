<template>
  <div class="omit-list-wrap">
    <ul class="list-header list">
      <li>
        <div>{{ $t("会员帐号") }}</div>
        <div>{{ $t("地区") }}</div>
        <div>{{ $t("货币") }}</div>
        <div>{{ $t("备注") }}</div>
        <div>{{ $t("新增时间") }}</div>
        <div>{{ $t("审核时间") }}</div>
        <div>{{ $t("操作") }}</div>
      </li>
      <li v-for="(item, i) in omitList" :key="i" class="list-item list">
        <div>{{ item.username }}</div>
        <div>{{ item.region }}</div>
        <div>{{ item.currency }}</div>
        <div>{{ item.remark }}</div>
        <div>{{ item.created_at ? item.created_at.substring(0, 10) : "" }}</div>
        <div>{{ item.audit_time ? item.audit_time.substring(0, 10) : "" }}</div>
        <div v-if="item.audit_status === 2">
          <van-button @click="openApply(item)" class="btn">{{ $t("申请") }}
          </van-button>
        </div>
        <div v-if="item.audit_status !== 2">
          <van-button @click="handleDetail(item)" type="primary" class="btn">{{ $t("查看") }}
          </van-button>
        </div>
      </li>
    </ul>
    <van-empty v-if="omitList.length === 0" image="/src/assets/images/agent/empty@2x.png" :description="$t('暂无数据')" />
  </div>
</template>

<script setup>
import { defineProps, inject, ref } from 'vue';
import { useDicts } from '@/utils/hooks';

const props = defineProps({
  omitList: {
    type: Array,
    default: () => [],
  },
});

const omitStatus = ref({});

useDicts('auditstatuslist', (val) => {
  omitStatus.value = val;
});

const global = inject('global');
function handleDetail(data) {
  global.$popup({ tpl: 'AgentOmitApply', isApplying: false, target: data });
}
function openApply(data) {
  global.$popup({ tpl: 'AgentOmitApply', isApplying: true, target: data });
}
</script>

<style scoped lang="less">
.omit-list-wrap {
  width: 100%;
  overflow-x: scroll;
  margin-top: 22.5px;

  .btn {
    width: 150px;
    height: 52.5px;
    color: var(--font-color-fff);
  }

  .list {
    color: var(--font-color-eee);
    font-size: 28px;
    width: 1050px;

    li {
      display: flex;
      height: 75px;
      line-height: 75px;
      width: 1050px;

      div {
        width: 300px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .list-header {
    color: var(--theme-color);
    font-size: 30px;
  }
}
</style>
