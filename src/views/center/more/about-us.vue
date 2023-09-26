<template>
  <div class="more-wrap">
    <div class="more-wrap-main">
      <p v-html="content"></p>
      <!-- <p>{{ $t('一、谁是{0}', [subConfig.title]) }}</p>
      <span>{{ $t('{0}附属于AA集团。AA集团是世界领先的网络博彩集团！在全球差不多五十个国家均设办事处，英国、比利时、爱尔兰、美国及阿根廷都提供投注服务。现集团基于业务多元化考虑，将线上博彩业务领域扩展至亚洲，并以"全力打造亚洲最丰富的真人视讯超市"为己任，向博彩爱好者隆重推出。同时也已经取得了菲律宾', [subConfig.title]) }}</span>
      <span>{{ $t('PhilippineAmusementandGamingCorporation(PAGCOR)(https://www.pagcor.ph/index.php)的充分授权。{0}严格按照这些管理机构发布的规则进行所有运营。', [subConfig.title]) }}</span>
      <p>{{ $t('二、在{0}投注的好', [subConfig.title]) }}</p>
      <span>{{ $t('只要使用一个账户，{0}便可带给您全面的激动人心的投注娱乐。而且{0}是世界上最大的博彩公司的一份子，您尽可放心，我们对您账户的处理是完全安全、谨慎和诚实的。', [subConfig.title]) }}</span>
      <p>{{ $t('三、{0}的目标', [subConfig.title]) }}</p>
      <span>{{ $t('博彩世界并非只是博彩爱好者的乐园，对我们来说也同样刺激和挑战！{0}不惜重金招聘和发掘最佳员工。我们的目标是保证能提供给客户们全心全意的服务和最清楚的信息。', [subConfig.title]) }}</span>-->
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { staticpage } from '@/api/help';

const global = inject('global');
const subConfig = inject('subConfig');
const content = ref('');

const { loading: pageLoading } = useRequest(staticpage,
  {
    onSuccess: (res) => {
      for (let i = 0; i < res.length; i += 1) {
        if (res[i].title === '关于我们') {
          content.value = res[i].content;
          break;
        }
      }
    },
  });

</script>

<style lang="less" scoped>
.more-wrap {
  &-main {
    padding: 0 30px;
    opacity: 1;
    font-size: 28px;
    font-weight: 500;
    text-align: left;
    color: var(--dark-fff, var(--font-color-333333));
    line-height: 40px;
    span {
      display: block;
    }
    span {
      margin: 48px 0 40px 0;
    }
    p {
      font-weight: bold;
    }
    p:nth-child(1) {
      margin-top: 34px;
      line-height: 40px;
    }
    :deep(a) {
      color: var(--theme-color);
    }
  }
}
</style>
