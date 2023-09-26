<template>
  <div class="agent-step">
    <div class="title">
      <div class="top">{{ $t("加入流程") }}</div>
    </div>
    <div class="step-list">
      <div
        v-for="(item, index) in stepData"
        :key="index"
      >
        <div class="text">{{item.title}}</div>
        <div class="desc">{{item.step}}</div>
        <div class="content">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');

const stepData = reactive([
  {
    title: global.$t('第一步'),
    step: global.$t('提交申请'),
    content: global.$t(
      '填写代理申请表，一旦申请成功，您将成为最有吸引力的合作计划的一份子。',
    ),
  },
  {
    title: global.$t('第二步'),
    step: global.$t('资格审核'),
    content: global.$t(
      '提交申请后留下联系方式，等待我们的代理专员审核，审核通过后马上联系您成为我们的合作伙伴。',
    ),
  },
  {
    title: global.$t('第三步'),
    step: global.$t('立即推广'),
    content: global.$t(
      '除了运用您本身的资源以外，我们也提供多样化的物料，市场渠道以及推广方式给你进行推广，与您一起开拓市场，让您如虎添翼。',
    ),
  },
  {
    title: global.$t('第四步'),
    step: global.$t('立即盈利'),
    content: global.$t(
      '您的佣金来自每一位您带来的会员，会员越多，投注越多，盈利越多！心动不如行动，马上加入吧！',
    ),
  },
]);
</script>

<style scoped lang="less">
.agent-step {
  .step-list {
    margin-top: 54px;
    text-align: center;

    div {
      width: 690px;
      height: 298px;
      margin: 0 auto;
      text-align: center;
      border-radius: 2px;
      color: var(--font-color-ffffff);
      margin-bottom: 26px;
      padding-top: 34px;
      box-sizing: border-box;
      background-color: var(--bg-color-1d395d);

      .text {
        height: 50px;
        font-size: 36px;
        font-weight: 500;
        color: var(--theme-color);
        padding-top: 0;
        line-height: 50px;
      }

      .desc {
        margin-top: 20px;
        height: 40px;
        padding-top: 0;
        font-size: 28px;
        font-weight: 400;
        color: var(--font-color-ffffff);
        line-height: 40px;
      }

      .content {
        width: 610px;
        padding-top: 0;
        margin: 20px auto 0;
        height: 68px;
        font-size: 24px;
        font-weight: 400;
        color: var(--font-color-cccccc);
        line-height: 34px;
      }
    }
  }
}
</style>
