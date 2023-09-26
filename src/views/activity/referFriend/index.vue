<template>
  <div class="invitation">
     <van-nav-bar
      :title="title"
      v-if="route.query.source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>
    <div class="container">
      <div>
        <div class="top">
          <!-- 领取福利 -->
          <div class="receive">
            <div class="receiveNum">
              <div>
                <div class="left fl">{{$t('已领取福利')}}</div>
                <div class="right fr">{{ detail?.has_get_benefits }}</div>
              </div>
              <div>
                <div class="left fl">{{$t('待领取福利')}}</div>
                <div class="right active fr">{{ detail?.no_get_benefits }}</div>
              </div>
            </div>
            <div class="immediately" @click="doDetspreadmoney">
              <p>{{user?.isLogin ? $t('立即') : $t('登录')}}</p>
              <p>{{user?.isLogin ? $t('领取') : $t('注册')}}</p>
            </div>
          </div>
          <!-- 累计邀请好友 -->
          <div class="cumulative">
            <div>
              <p>{{$t('累计邀请好友')}}</p>
              <p>{{ detail?.invit_users }}</p>
            </div>
            <div>
              <p>{{$t('累计福利礼金')}}</p>
              <p>{{ detail?.total_benefits }}</p>
            </div>
          </div>
          <!-- 我的专属好友邀请链接和推广码 -->
          <div class="code">
            <p>{{$t('我的专属好友邀请链接')}}</p>
            <div class="clickToGet">
              <van-button
                type="success"
                v-clipboard:copy="`${detail?.spread_url}?code=${detail?.spread_code}`"
                v-clipboard:success="() => Toast.success('复制成功')"
                v-clipboard:error="() => Toast.fail('复制失败')"
              >
                {{ detail?.spread_url }}?code={{ detail?.spread_code }}
              </van-button>
            </div>
          </div>
        </div>
        <!-- 我的好友，邀请规则 -->
        <div class="list">
          <div class="title">
            <div
              class="goodfriend"
              :class="{active: activeTab === 0}"
              @click="activeTab = 0"
            >
{{$t('我的好友')}}
            </div>
            <div
              class="rules"
              :class="{active: activeTab === 1}"
              @click="activeTab = 1"
            >
{{$t('邀请规则')}}
            </div>
          </div>
          <!-- 我的好友内容 -->
          <div class="goodfriendContent" v-if="activeTab === 0">
            <p class="top"> {{`< 邀请好友明细>`}}</p>

            <table>
              <tr class="title">
                <th>{{$t('日期')}}</th>
                <th>{{$t('好友账号')}}</th>
                <th>{{$t('总投注金额')}}</th>
                <th>{{$t('拉新福利礼金')}}</th>
              </tr>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{ item.start_time }}</td>
                <td>{{ item.new_username }}</td>
                <td>{{ item.valid_bet }}</td>
                <td>{{ item.benefit_money }}</td>
              </tr>
            </table>

            <div class="pagingBtn">
              <div class="previousPage" @click="prev">{{$t('上一页')}}</div>
              <div class="nextPage" @click="next">{{$t('下一页')}}</div>
            </div>
          </div>
          <!-- 邀请规则内容 -->
          <div class="rulesContent" v-if="activeTab === 1">
            <p class="top">&lt;{{$t(`会员等级介绍`)}}&gt;</p>
            <table>
              <tr class="title">
                <th>{{$t('会员等级')}}</th>
                <th>{{$t('新手福利')}}</th>
                <th>{{$t('拉新福利')}}</th>
                <th>{{$t('享有时长')}}</th>
              </tr>
              <tr v-for="(item, index) in memberList" :key="index">
                <td>{{ dicts?.memberlevellist[index]?.name }}</td>
                <td v-if="item.condition">
                  {{ item.condition.new_profite_money }}{{$t(`元额外注册礼金`)}}
                </td>
                <td v-if="item.condition">
                  {{$t(`新人投注额`)}} {{ item.condition.get_new_benefit }}
                </td>
                <td v-if="item.condition">{{ item.condition.druing_week }}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 邀请流程 -->
        <div class="invitationProcess">
          <p>&lt;{{$t(`邀请流程`)}}&gt;</p>
          <div class="lists">
            <div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/referFriend/Group1.png`)" alt />
              <p>{{$t('第一步')}}</p>
            </div>
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/referFriend/arrow.png`)" alt />
            <div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/referFriend/Group2.png`)" alt />
              <p>{{$t('第二步')}}</p>
            </div>
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/referFriend/arrow.png`)" alt />
            <div>
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/referFriend/Group3.png`)" alt />
              <p>{{$t('第三步')}}</p>
            </div>
          </div>
        </div>
        <!-- 邀请说明 -->
        <div class="rule">
          <P>
            <span>1</span>
            <span>{{subConfig.title}}{{$t(`所有会员均可享受。`)}}</span>
          </P>
          <P>
            <span>2</span>
            <span
              >{{$t('新手福利需要完成')}}</span
            >
          </P>
          <P>
            <span>3</span>
            <span
              >{{$t('新手会员如果已经超过享有时长')}}</span
            >
          </P>
          <P>
            <span>4</span>
            <span
              >{{$t('拉新福利必须是新人在有存款的情况下才计算')}}</span
            >
          </P>
          <P>
            <span>5</span>
            <span
              >{{$t('系统判断单周如果有效拉新人数超过')}}</span
            >
          </P>
          <P>
            <span>6</span>
            <span
              >{{$t('每月系统挑选出有效拉新人数最多的')}}</span
            >
          </P>
          <P>
            <span>7</span>
            <span>
              {{$t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，
              一经发现我们将保留冻结帐户以及没收所有余额的权利。`)}}
            </span>
          </P>
          <P>
            <span>8</span>
            <span>{{subConfig.title}}{{$t('拥有最终解析权。')}}</span>
          </P>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, watchEffect,
} from 'vue';
import Cookies from 'js-cookie';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import { getParams } from '@/utils';

import {
  specialdetail,
  spreadinfo,
  spreadrecord,
  getspreadmoney,
} from '@/api/active';

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
const activeTab = ref(0);
const { id, source, access_token } = getParams();
const memberList = ref([]);
const detail = ref({});
const page = ref(1);
const total = ref(1);

if (source === 'app' && access_token) {
  Cookies.set('access_token', access_token);
  store.dispatch('user/getUserInfo');
}
global.$store.dispatch('app/getDict', ['memberlevellist']);

// 获取优惠详情
useRequest(() => specialdetail({ id }), {
  onSuccess(res) {
    title.value = res?.name;
    memberList.value = res?.condition_setting;
  },
});

 // 获取优惠信息
function getInfo() {
  if (user?.isLogin) {
    useRequest(() => spreadinfo({ id }), {
      onSuccess: (res) => {
        detail.value = res;
      },
    });
  }
}
 // 邀请记录
function getList() {
  if (user?.isLogin) {
    const { data: list } = useRequest(() => spreadrecord({ id, page: page.value }));
  }
}
function prev() {
  if (page.value > 1) {
    page.value -= 1;
    getList();
  }
}
function next() {
  if (page.value < total.value) {
    page.value += 1;
    getList();
  }
}
// 领取福利
function doDetspreadmoney() {
  if (user?.isLogin) {
    useRequest(() => getspreadmoney({ id }), {
      onSuccess(res) {
        if (res.data.code === 0) {
          Toast.success(`领取成功`);
          getInfo();
          getList();
        } else {
          Toast.fail(res.data.msg);
        }
      },
    });
  } else {
    app.source === 'app' ? window.location.href = `app://login` : router.push({ name: 'login' });
  }
}
// getInfo();
// getList();
watchEffect(() => {
  if (user?.isLogin) {
    getInfo();
    getList();
  }
});
</script>

<style lang="less" scoped>
.invitation {
  height: 100vh;
  background-color: var(--font-color-white);
  display: flex;
  flex-direction: column;
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .container {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    > div {
      > .top {
        padding: 510px 0 28px 0;
        width: 100%;
        height: auto;
        background-size: 100% auto;
        background-image: url("/src/assets/images/activity/zh-CN/referFriend/bg.png");
        // 领取福利
        > .receive {
          width: 100%;
          display: flex;
          justify-content: center;
          > .receiveNum {
            > div {
              overflow: hidden;
              > .left {
                color: var(--font-color-fff);
                font-size: 28px;
                line-height: 72px;
              }
              > .right {
                font-size: 32px;
                color: var(--font-color-fff);
                text-align: center;
                width: 238px;
                height: 81px;
                line-height: 81px;
                background-size: 100% auto;
                background-image: url("/src/assets/images/activity/zh-CN/referFriend/welfare_bg.png");
                &.active {
                  color: var(--font-color-ffe400);
                }
              }
            }
            > div:first-child {
              margin-bottom: 20px;
            }
          }
          .immediately {
            font-size: 32px;
            color: var(--font-color-000);
            text-align: center;
            width: 187px;
            height: 178px;
            padding-top: 40px;
            background-size: 100% auto;
            // line-height: 1.2;
            margin-left: 28px;
            box-sizing: border-box;
            background-image: url("/src/assets/images/activity/zh-CN/referFriend/Receive_bg.png");
          }
        }
        // 累计邀请好友
        .cumulative {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 40px;
          > div {
            text-align: center;
            padding: 28px 0;
            width: 330px;
            height: 143px;
            background-size: 100% auto;
            box-sizing: border-box;
            background-image: url("/src/assets/images/activity/zh-CN/referFriend/leiji_bg.png");
            > p:first-child {
              color: var(--font-color-8c8c8c);
              font-size: 32px;
              font-weight: normal;
              // padding-bottom: 10px;
            }
            > p:last-child {
              color: var(--font-color-f74848);
              font-weight: normal;
              font-size: 50px;
            }
          }
          > div:first-child {
            margin-right: 40px;
          }
        }
        .code {
          width: 100%;
          text-align: center;
          margin-top: 50px;
          > p {
            color: var(--font-color-fff);
            font-size: 28px;
          }
          > .clickToGet {
            color: var(--font-color-000);
            font-size: 28px;
            text-align: center;
            width: 316px;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 10px;
            .van-button{
              background:var(--font-color-ffd700);
            }
          }
        }
      }
      // 我的好友，邀请规则
      .list {
        padding: 40px 0 28px 0;
        width: 100%;
        background-size: 100% auto;
        background-image: url("/src/assets/images/activity/zh-CN/referFriend/bg2.png");
        > .title {
          display: flex;
          justify-content: center;
          > div {
            float: left;
            color: var(--font-color-3d2944);
            font-size: 28px;
            text-align: center;
            width: 325px;
            height: 80px;
            line-height: 80px;
            background-size: cover;
            background-image: url("/src/assets/images/activity/zh-CN/referFriend/list_bg.png");
            &.active {
              height: 92px;
              line-height: 86px;
              color: var(--font-color-fff);
              background-image: url("/src/assets/images/activity/zh-CN/referFriend/list_active_bg.png");
            }
          }
        }
        // 邀请好友内容
        > .goodfriendContent {
          padding-top: 54px;
          > .top {
            text-align: center;
            color: var(--font-color-614411);
            font-size: 30px;
          }
          > .time {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            > div {
              > p {
                color: var(--font-color-614411);
                font-size: 24px;
                text-align: center;
              }
              > div {
                text-align: center;
                color: var(--font-color-614411);
                font-size: 24px;
                width: 198px;
                height: 54px;
                line-height: 54px;
                background: rgba(255, 255, 255, 1);
                border-radius: 20px;
              }
            }
            > div:first-child {
              margin-right: 50px;
            }
          }
          .query {
            color: var(--font-color-000);
            font-size: 24px;
            text-align: center;
            margin: 28px auto 0;
            width: 452px;
            height: 64px;
            line-height: 64px;
            background-size: 100% auto;
            background-image: url("/src/assets/images/activity/zh-CN/referFriend/bt_2.png");
          }
          table {
            width: 100%;
            margin-top: 48px;
            tr {
              width: 100%;
              display: flex;
              justify-content: space-around;
              height: 60px;
              line-height: 60px;
              th,
              td {
                color: var(--font-color-000);
                font-size: 24px;
                display: flex;
                justify-content: center;
                width: 25%;
                text-align: center;
              }
            }
            tr:nth-child(2n) {
              background-color: var(--font-color-ffe6b1);
            }
            tr:nth-child(2n + 1) {
              background-color: var(--font-color-f3daa4);
            }
            .grade-title {
              background-color: var(--font-color-e3af44) !important;
            }
          }
          .pagingBtn {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 18px;
            > div {
              color: var(--font-color-000);
              font-size: 24px;
              text-align: center;
              width: 206px;
              height: 64px;
              line-height: 64px;
              background-size: 100% auto;
              background-image: url("/src/assets/images/activity/zh-CN/referFriend/bt_1.png");
            }
            > div:first-child {
              margin-right: 76px;
            }
          }
        }
        // 邀请规则内容
        > .rulesContent {
          padding-top: 54px;
          > .top {
            text-align: center;
            color: var(--font-color-614411);
            font-size: 30px;
          }
          table {
            width: 100%;
            margin-top: 48px;
            tr {
              width: 100%;
              display: flex;
              justify-content: space-around;
              height: 60px;
              line-height: 60px;
              th,
              td {
                color: var(--font-color-000);
                font-size: 24px;
                display: flex;
                justify-content: center;
                width: 25%;
                text-align: center;
                &:nth-child(2){
                  width: 35%;
                }
                &:nth-child(3) {
                  width: 30%;
                }
                &:nth-child(4) {
                  width: 20%;
                }
              }
            }
            tr:nth-child(2n) {
              background-color: var(--font-color-ffe6b1);
            }
            tr:nth-child(2n + 1) {
              background-color: var(--font-color-f3daa4);
            }
            .grade-title {
              background-color: var(--font-color-e3af44) !important;
            }
          }
        }
      }
      // 邀请流程
      .invitationProcess {
        width: 100%;
        height: auto;
        padding: 44px 0;
        background-size: 100% auto;
        background-image: url("/src/assets/images/activity/zh-CN/referFriend/Invitation_bg.png");
        > p {
          text-align: center;
          color: var(--font-color-fff);
          font-size: 30px;
        }
        > .lists {
          margin-top: 44px;
          width: 100%;
          display: flex;
          justify-content: center;
          > div {
            width: 166px;
            > img {
              width: 100%;
              height: 166px;
              display: block;
              margin-bottom: 58px;
            }
            > p {
              width: 100%;
              text-align: center;
              color: var(--font-color-fff);
              font-size: 20px;
              line-height: 32px;
            }
          }
          > img {
            display: block;
            width: 36px;
            height: 28px;
            margin: 80px 22px 0 22px;
          }
        }
      }
      // 邀请说明
      .rule {
        width: 100%;
        padding: 48px 28px 62px 48px;
        box-sizing: border-box;
        > p {
          display: flex;
          justify-content: flex-start;
          &:after {
            content: "";
            display: block;
            clear: both;
          }
          > span:first-child {
            margin: 11px 20px 0 0;
            display: block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 50%;
            text-align: center;
            border: 1px solid var(--font-color-7f7f7f);
            color: var(--font-color-7f7f7f);
          }
          > span:last-child {
            flex: 1;
            display: block;
            color: var(--font-color-7f7f7f);
            font-size: 24px;
            line-height: 52.5px;
          }
        }
      }
    }
  }
  .no-header {
    padding-top: 0;
    margin-top:0;
  }
}

</style>
