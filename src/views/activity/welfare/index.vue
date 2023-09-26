<template>
  <div id="welfare">
    <van-nav-bar :title="title" v-if="route.query.source !== 'app'" left-arrow @click-left="router.go(-1)">
    </van-nav-bar>
    <div class="content">
      <div>
        <div class="top"></div>
        <div class="center">
          <!-- 星级晋级机制 -->
          <div class="Witty" v-if="note.length > 0">
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/title.png`)" alt />
            <div class="list">
              <div>
                <p>{{ $t('四品官员') }}</p>
                <p>投注{{ note[0].money.valid_bet }}W+</p>
                <p>月存{{ note[0].money.deposite_money }}W+</p>
              </div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/arrow-right.png`)" alt />
              <div>
                <p>{{ $t('三品官员') }}</p>
                <P>投注{{ note[1].money.valid_bet }}W+</P>
                <P>月存{{ note[1].money.deposite_money }}W+</P>
              </div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/arrow-right.png`)" alt />
              <div>
                <p>{{ $t('二品官员') }}</p>
                <P>投注{{ note[2].money.valid_bet }}W+</P>
                <P>月存{{ note[2].money.deposite_money }}W+</P>
              </div>
            </div>
            <div class="list">
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/arrow-right.png`)" alt />
              <div>
                <p>{{ $t('一品官员') }}</p>
                <P>投注{{ note[3].money.valid_bet }}W+</P>
                <P>月存{{ note[3].money.deposite_money }}W+</P>
              </div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/arrow-right.png`)" alt />
              <div>
                <p>{{ $t('乾隆大帝') }}</p>
                <P>投注{{ note[4].money.valid_bet }}W+</P>
                <P>月存{{ note[4].money.deposite_money }}W+</P>
              </div>
            </div>
          </div>
          <!-- 星级特权福利 -->
          <div class="privilege">
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/titlecopy.png`)" alt />
            <div class="privilege-table">
              <table>
                <tr>
                  <th>{{ $t('品职') }}</th>
                  <th>{{ $t('酒店') }}</th>
                  <th>{{ $t('美女') }}</th>
                  <th>{{ $t('年龄') }}</th>
                  <th>{{ $t('服务周期') }}</th>
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{ item.starClass }}</td>
                  <td>{{ item.hotel }}</td>
                  <td>{{ item.beauty }}</td>
                  <td>{{ item.age }}</td>
                  <td>{{ item.cycle }}</td>
                </tr>
              </table>

              <div class="text">
                <p>*{{ $t('温馨提示') }} ：</p>
                <p>
                  ①
                  会员提前联系客服专员，选取美女服务，只针对有机场直达的城市，AA集团承担交通服务费用；
                </p>
                <p>
                  ②
                  相关隐私请参考当地法律，AA集团不干涉，为避免文字差异,AA集团保留最终解释权
                </p>
              </div>
            </div>
          </div>
          <!-- 活动规则 -->
          <div class="rulesActivity">
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/welfare/group1.png`)" alt />
            <div class="text">
              <p>
                <span>1</span>
                <span>本活动{{ subConfig.title }}所有二星及以上会员均可享受；</span>
              </p>
              <p>
                <span>2</span>
                <span>{{ $t('会员需要提前联系客服') }}</span>
              </p>
              <p>
                <span>3</span>
                <span>{{ $t('只针对有机场直达的城市') }}</span>
              </p>
              <p>
                <span>4</span>
                <span>{{ $t('本存款金额只限线下存款') }}</span>
              </p>
              <p>
                <span>5</span>
                <span>{{ $t('本活动数据按月累计') }}</span>
              </p>
              <p>
                <span>6</span>
                <span>本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户、包括同一姓名、同一姓名、统一邮箱，同一/相似IP地址，同一住址，
                  同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，已经发现我们将保留冻结账户以及没收所有余额的权利;</span>
              </p>
              <p>
                <span>7</span>
                <span>关于本活动{{ subConfig.title }}拥有最终解释权。</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { DatetimePicker, Toast } from 'vant';
import { getParams } from '@/utils';
import { specialdetail } from '@/api/activity';

const global = inject('global');
const store = inject('store');

const {
  user,
  app: { dicts },
} = global.$store.state;

const router = useRouter();
const route = useRoute();
const subConfig = inject('subConfig');
const title = ref(route?.meta?.title || '');
const id = getParams('id') || '';
const note = ref([]);
const list = [
  {
    starClass: global.$t('四品官员'),
    hotel: global.$t('三星酒店'),
    beauty: global.$t('模特'),
    age: '18-25',
    cycle: '1次/6个月',
  },
  {
    starClass: global.$t('三品官员'),
    hotel: global.$t('四星酒店'),
    beauty: global.$t('模特'),
    age: '18-25',
    cycle: '1次/3个月',
  },
  {
    starClass: global.$t('二品官员'),
    hotel: global.$t('五星酒店'),
    beauty: global.$t('模特,空姐,学生'),
    age: '18-25',
    cycle: '1次/1个月',
  },
  {
    starClass: global.$t('一品官员'),
    hotel: global.$t('五星豪华'),
    beauty: global.$t('二线明星'),
    age: '18-25',
    cycle: '1次/1个月',
  },
  {
    starClass: global.$t('乾隆大帝'),
    hotel: global.$t('顶级豪华'),
    beauty: global.$t('二线明星'),
    age: '18-25',
    cycle: '2次/1个月',
  },
];
useRequest(() => specialdetail({ id }), {
  onSuccess(res) {
    title.value = res?.name;
    note.value = res?.condition_setting.map((val) => ({
      ...val,
    }));
  },
});
</script>

<style lang="less" scoped>
#welfare {
  width: 100%;
  height: 100vh;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;

  .content {
    width: 100%;
    height: calc(100vh - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;

    >div {
      >.top {
        width: 100%;
        height: 844px;
        background-size: 100% 100%;
        overflow: hidden;
        background-image: url("/src/assets/images/activity/zh-CN/welfare/banner.png");

        // background-image: url("/src/assets/images/activity/zh-cn/welfare/banner.png");
        &.top-wanqu {
          background-image: url("/src/assets/images/activity/zh-CN/welfare/banner.png");
        }

        &.top-other {
          background-image: url("/src/assets/images/activity/zh-CN/welfare/banner1.png");
        }
      }

      >.center {
        width: 100%;
        overflow: hidden;
        background-image: url("/src/assets/images/activity/zh-CN/welfare/layer1.png");

        >.Witty {
          width: 100%;
          margin-bottom: 56px;
          padding: 37.5px 28px 0;
          box-sizing: border-box;

          >img {
            display: block;
            width: 462px;
            height: 46px;
            margin: 0 auto 44px;
          }

          >.list {
            width: 100%;
            display: flex;
            justify-content: center;

            >div {
              width: 200px;
              height: 190px;
              border: 6px solid #ec5074;
              text-align: center;
              margin-bottom: 40px;

              >p:first-child {
                position: relative;
                padding: 32px 0 18px 0;
                color: #ec5074;
                font-size: 32px;
                font-weight: 600;

                &::after {
                  position: absolute;
                  display: block;
                  content: "";
                  width: 90px;
                  height: 2px;
                  background: rgba(236, 80, 116, 1);
                  left: 24%;
                  bottom: 0;
                }
              }

              >p:nth-child(2) {
                color: #9a1f3a;
                font-size: 24px;
                line-height: 40px;
              }

              >p:nth-child(3) {
                color: #9a1f3a;
                font-size: 24px;
                line-height: 40px;
              }
            }

            >img {
              width: 26px;
              height: 44px;
              margin: 60px 20px 0 20px;
            }
          }
        }

        // 星级特权福利
        .privilege {
          width: 100%;

          >img {
            display: block;
            width: 442px;
            height: 46px;
            margin: 0 auto 40px;
          }

          .privilege-table {
            padding: 0 20px;

            >table {
              width: 100%;

              tr {
                width: 100%;
                display: flex;
                justify-content: space-around;
                height: 46px;
                line-height: 46px;

                th,
                td {
                  color: #ffffff;
                  font-size: 24px;
                  display: flex;
                  justify-content: center;
                  width: 25%;
                  text-align: center;
                  border-bottom: 2px solid #ffffff;
                  border-right: 2px solid #ffffff;

                  &:nth-child(3) {
                    width: 35%;
                  }

                  &:nth-child(1),
                  &:nth-child(2),
                  &:nth-child(4) {
                    width: 20%;
                  }
                }
              }

              tr:nth-child(2n + 1) {
                background: #ec5074;
              }

              tr:nth-child(2n) {
                background-color: #f49eb3;
              }
            }

            >.text {
              width: 100%;
              padding: 20px;

              >p {
                color: #972036;
                font-size: 24px;
                text-align: left;
                margin-bottom: 20px;
                line-height: 30px;
              }
            }
          }
        }

        // 活动规则
        .rulesActivity {
          width: 100%;
          padding-top: 80px;

          >img {
            display: block;
            width: 342px;
            height: 46px;
            margin: 0 auto;
          }

          >.text {
            margin-top: 40px;

            p {
              padding: 0 24px;
              padding-bottom: 37px;

              &:after {
                content: "";
                display: block;
                clear: both;
              }

              >span:first-child {
                float: left;
                margin: 7.5px 10px 0 0;
                color: #ffffff;
                text-align: center;
                display: block;
                width: 30px;
                height: 30px;
                line-height: 30px;
                border-radius: 50%;
                background-color: #ec5074;
              }

              >span:last-child {
                float: left;
                color: #ff3d72;
                font-size: 24px;
                display: block;
                line-height: 45px;
                width: calc(100% - 78px - 10px);
              }
            }
          }
        }
      }
    }
  }

  .no-header {
    padding-top: 0;
    margin-top: 0;
  }
}
</style>
