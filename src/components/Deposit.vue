<template>
  <div class="deposit-page">
    <div class="m-body">
      <div v-if="payments.length && !loading">
        <ul class="deposit-main">
          <!-- 存款金额 -->
          <li>
            <label>{{ $t('充值金额') }}</label>
            <div class="input">
              <span>{{ symbol }}</span>
              <input type="number" :disabled="!info.is_suit_money" v-model="form.money" @blur="handleMoney"
                :placeholder="placeHolder" />
              <!-- <input type="number" v-model="orderData.money" :placeholder="`最低${min_money}元，最高${max_money}元`"> -->
            </div>
          </li>
          <div class="chips-scroll-wrap">
            <div v-if="info.is_quick_money && moneyList.length > 0" class="chips">
              <div class="chip" v-for="(item, index) in moneyList" :key="index" :class="[
                amount_select === index ? 'selected' : '',
                getChipClassName(item),
              ]">
                <label @click="selectAmount(item, index)">{{ info.quick_money_exchange_list[index] }}</label>
              </div>
            </div>
          </div>
          <!-- 快捷金额 -->
          <li class="quick-select">
            <div class="board">
              <div class="list-cells">
                <div class="cell" @click="showPayments">
                  <div class="cell-head" v-if="payment">
                    <van-image :src="
                      $getSrc(`/src/assets/images/payments/wq_pay_img_${payment.id}.png`)
                    " />
                  </div>
                  <div class="cell-body">
                    {{ (payment && (payment.alias || payment.name)) || $t('请选择存款渠道') }}
                    <span v-if="payment && payment.act_text" class="cell-tip">
                      {{
                          payment.act_text
                      }}
                    </span>
                    <!-- <span v-show="payMethodId">-{{payMethodId}}</span> -->
                  </div>
                  <div class="cell-foot">
                    {{ $t('切换存款渠道') }}
                    <van-icon name="arrow" />
                  </div>
                </div>
                <template v-if="payType === 11 || payType === 15 || payType === 16">
                  <div class="cell-protocol">
                    <label class="label-protocol">{{ $t('协议') }}</label>
                    <div class="protocol">
                      <span @click="handleProtocol(item.protocol)"
                        :class="{ 'active': chosePtotocol === item.protocol }" v-for="(item, index) in protocolList"
                        v-show="displayProtocol.includes(String(item.type))" :key="index">{{ item.title }}</span>
                    </div>
                  </div>
                </template>
                <!-- 在线支付 - 选择银行 -->
                <!-- <div class="deposit" v-show="active === 1">
                      <div class="aagames-bank-select-box" style="margin-top:.8rem">
                          <div class="select">
                              <input type="text" v-model="orderData.bind" readonly @click="isBank"  :placeholder="$t('请选择银行')">
                              <i class="el-icon-caret-bottom"></i>
                          </div>
                      </div>
                </div>-->
                <!-- 支付宝转网银-6 网银转账-2 -->
                <div class="cell cell-ness" v-if="
                  payment && [2, 6, 12, 13, 14].indexOf(payment.id) !== -1
                ">
                  <ul v-if="qrCodeUrl" class="qrcode">
                    <li>
                      <img :src="qrCodeUrl" alt />
                      <p @click="downloadIamge">{{ $t('保存二维码') }}</p>
                    </li>
                  </ul>
                  <ul v-else class="cell-body card-like">
                    <li>
                      <label>{{ $t('银行卡号') }}</label>
                      <span class="copy1 no-select">
                        {{
                            bankList?.bank_card_no
                        }}
                      </span>
                      <a v-clipboard:copy="bankList?.bank_card_no" v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                        <SvgIcon name="copy"></SvgIcon>
                      </a>
                    </li>
                    <li>
                      <label>{{ $t('账户姓名') }}</label>
                      <span class="copy1 no-select">
                        {{
                            bankList?.bank_account_name
                        }}
                      </span>
                      <a v-clipboard:copy="bankList?.bank_account_name" v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                        <SvgIcon name="copy"></SvgIcon>
                      </a>
                    </li>
                    <li>
                      <label>{{ $t('开户银行') }}</label>
                      <span>{{ bankList?.bank_name }}</span>
                    </li>
                    <li>
                      <label>{{ $t('开户支行') }}</label>
                      <span class="copy1 no-select">
                        {{
                            bankList?.bank_branch_name
                        }}
                      </span>
                      <a v-clipboard:copy="bankList?.bank_branch_name" v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                        <SvgIcon name="copy"></SvgIcon>
                      </a>
                    </li>
                    <li v-if="payment && payment.id === 2">
                      <label>{{ $t('存款备注') }}</label>
                      <span class="copy1 no-select">
                        {{
                            bankList?.rand_num
                        }}
                      </span>
                      <a v-clipboard:copy="bankList?.rand_num" v-clipboard:success="onCopy" v-clipboard:error="onError">
                        <SvgIcon name="copy"></SvgIcon>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- 支付宝转网银 -->
                <div class="cell" v-if="payment && (payment.id === 6 || payment.id === 14)">
                  <div class="cell-head">{{ $t('支付宝姓名') }}</div>
                  <div class="cell-body">
                    <input type="text" v-model="form.alipayName" :placeholder="$t('请输入支付宝姓名')" />
                  </div>
                </div>
                <!-- 网银转账 -->
                <div class="cell" v-if="payment && payment.id === 2">
                  <div class="cell-head">{{ $t('转款人姓名') }}</div>
                  <div class="cell-body">
                    <input type="text" v-model="form.realName" :placeholder="$t('请输入转款人姓名')" />
                  </div>
                </div>
                <div class="cell" v-if="payment && (payment.id === 12 || payment.id === 13) && qrCodeUrl">
                  <template>
                    <div class="cell-head">{{ payment.id === 12 ? $t('微信') : $t('支付宝') }}{{ $t('昵称') }}</div>
                    <div class="cell-body">
                      <input type="text" v-if="payment.id === 12" v-model="form.alipayName"
                        :placeholder="$t('请输入您的微信昵称')" />
                      <input type="text" v-else v-model="form.alipayName" :placeholder="$t('请输入您的支付宝昵称')" />
                    </div>
                  </template>
                </div>

                <!-- feat-1073 根据后台配置展示真实姓名配置项 -->
                <div class="cell" v-if="payment && payment.is_realname === 1">
                  <div class="cell-head">{{ $t('真实姓名') }}</div>
                  <div class="cell-body">
                    <input type="text" v-model="form.realname" :placeholder="$t('请输入真实姓名')" />
                  </div>
                </div>

                <!-- 网银转账-2 网银在线-1 -->
                <div class="cell" v-if="info.is_need_bank_code" @click="checkBankcard">
                  <div class="cell-body">{{ $t('银行选择') }}</div>
                  <div class="cell-foot">
                    {{ form.bankName || $t('请选择银行') }}
                    <!-- <input
                          type="text"
                          v-model="form.bankName"
                          readonly
                          @click="isBank"
                           :placeholder="$t('请选择银行')"
                    />-->
                    <van-icon name="arrow" />
                  </div>
                </div>

                <!-- 优惠申请 -->
                <div class="cell" @click="show = true" v-show="type !== 'agent'">
                  <div class="cell-body">{{ $t('优惠申请') }}</div>
                  <div class="cell-foot">
                    {{ form.activityTitle || $t('您是否参与优惠申请') }}
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-if="qrCodeUrl" class="tips">
            <p>{{ $t('温馨提示：') }}</p>
            <p>{{ $t('1.扫码后请及时付款，付款成功后后请点击完成付款金额将确保及时为您充值成功；') }}</p>
            <p>{{ $t('2.充值成功后不要再次使用本次二维码充值，充值后我们无法为您增加相应额度') }}</p>
            <p>{{ $t('3.如充值后未到账额度请联系在线客服！') }}</p>
          </li>
          <li v-else-if="payType === 11 || payType === 15 || payType === 16" class="tips ticker">
            <span>{{ $t('参考汇率') }}：1{{ channel }}={{ ticker }}CNY</span>
            <span>
              {{ $t('预计支付') }}
              <i>{{ (form.money / ticker).toFixed(2) }}</i>
              {{ channel }}
            </span>
          </li>
          <li v-else class="tips">
            <template v-if="flowText && form.activityId">
              {{ flowText }}
              <br />
            </template>
            {{ $t('提交信息后，下一步请在15分钟内完成存款') }}
          </li>
          <li class="ui-buttons confirm-btn-wrap">
            <van-button class="submit-btn next-btn" :loading="submiting" type="success" :disabled="!form.money"
              @click="beforeSubmit">{{ $t('下一步') }}</van-button>
            <!-- <van-button type="cancel" @click="$openKefu">{{$t('支付遇到问题')}}</van-button> -->
            <!-- <van-button type="disabled" @click="$openKefu">{{$t('被禁用的')}}</van-button> -->
          </li>

          <li class="dc-wrap"
            v-if="(payType === 11 || payType === 15 || payType === 16) && payment && payment.h5_banner">
            <van-image lazy-load @click="go" :src="payment?.h5_banner"></van-image>
          </li>
        </ul>
      </div>

      <!-- 存款渠道 -->
      <van-popup v-model:show="paymentsShow" position="bottom" closeable round @close="closeon"
        close-icon-position="top-right" teleport="body" class="deposit-style-popup">
        <div class="pop-head">
          <h2>{{ $t('选择存款渠道') }}</h2>
          <van-icon v-show="paymentsChild.length > 0" @click="paymentsChild = []" name="arrow-left" />
        </div>
        <div class="list-cells" v-show="paymentsChild.length === 0">
          <div class="cell" v-for="(item, index) in payments" :key="index" @click="selectPayment(item)">
            <div class="cell-head">
              <van-image :src="$getSrc(`/src/assets/images/payments/wq_pay_img_parent_${item.id}.png`)" />
            </div>
            <div class="cell-body">
              <div class="cell-flex channel">{{ item.alias || item.name }}</div>
            </div>
            <div class="cell-foot" v-show="(payment && payment.id === item.id) || item.child">
              <van-icon v-show="payment && payment.id === item.id && !item.child" name="success" />
              <van-icon v-show="item.child" name="arrow" />
            </div>
          </div>
        </div>
        <div class="list-cells" v-show="paymentsChild.length > 0">
          <div class="cell" v-for="(item, index) in paymentsChild" :key="index" @click="selectPayment(item)">
            <div class="cell-head">
              <van-image :src="$getSrc(`/src/assets/images/payments/wq_pay_img_${item.id}.png`)" />
            </div>
            <div class="cell-body">
              <!-- {{ item.alias|| item.name}} -->
              <div class="cell-flex channel">{{ item.alias || item.name }}</div>
              <div v-if="item.h5_limit_money_start && item.h5_limit_money_end" class="cell-flex">
                <span>{{ $t('限额') }}{{ item.h5_limit_money_start }}-{{ item.h5_limit_money_end }}</span>
              </div>
            </div>
            <div class="cell-foot" v-show="payment && payMethodId === item.pay_method_id">
              <van-icon v-show="payment && payMethodId === item.pay_method_id" name="success" />
            </div>
          </div>
        </div>
      </van-popup>

      <van-popup class="deposit-popup" v-model:show="popUpExplain" closeable round teleport="body" ref="test1">
        <div class="pop-head">
          <h2>{{ $t('支付提示') }}</h2>
        </div>
        <div class="pop-body">
          <div class="pay-mark">
            <div class="clock" v-show="time > 0">
              <van-image :src="$getSrc('/src/assets/images/clock.png')" />
              <van-count-down ref="countDown1" @finish="isPayment('popUpExplain')" class="processing-time-deposit"
                :time="time" format="mm:ss" />
            </div>
            <h3>{{ $t('请在15分钟内完成支付') }}</h3>
            <p>
              {{ $t('完成支付后，直接回到当前页面') }}
              <br />
              {{ $t('点击“已完成支付”即可。') }}
            </p>
          </div>
          <div class="ui-buttons">
            <button class="aagames-button aagames-button-default" type="button" @click="$openKefu">{{
                $t('支付遇到问题？')
            }}</button>
            <button class="aagames-button van-button--primary" type="button" @click="isPayment('popUpExplain')">{{
                $t('已完成支付')
            }}</button>
          </div>
        </div>
      </van-popup>

      <van-popup class="deposit-popup" v-model:show="paymentSuccess" closeable round teleport="body">
        <div class="pop-head">
          <h2>{{ $t('支付提示') }}</h2>
        </div>
        <div class="pop-body iconImage">
          <van-image v-if="payment" :src="$getSrc(`/src/assets/images/payments/img${payment.id}.png`)"></van-image>
          <div class="pay-mark">
            <p>{{ $t('请在新打开的支付页面完成支付') }}</p>
          </div>
          <div class="ui-buttons">
            <van-button type="gray" @click="$openKefu">{{ $t('支付遇到问题') }}</van-button>
            <van-button type="primary" @click="isPayment('isExplain')">{{ $t('已完成支付') }}</van-button>
          </div>
        </div>
      </van-popup>

      <!-- 支付失败 -->
      <van-popup class="deposit-popup" v-model:show="paymentFail" closeable round teleport="body">
        <div class="pop-head">
          <h2>{{ $t('支付失败') }}</h2>
        </div>
        <div class="pop-body payStatus">
          <!-- <div class="close" @click="paymentFail = false">✕</div> -->
          <!-- <img class="middle-img" src="@assets/images/memberCenter/fail.png" alt="pay-warn"> -->
          <van-icon name="clear" color="#FF6666"></van-icon>
          <div class="pay-title">{{ $t('存款失败') }}</div>
          <div class="ui-buttons">
            <button class="aagames-button aagames-button-default" type="button" @click="$openKefu">{{
                $t('支付遇到问题？')
            }}</button>
            <button class="aagames-button van-button--primary" type="button" @click="paymentFail = false">{{
                $t('确认')
            }}</button>
          </div>
          <!--          <div class="btn">-->
          <!--            <div class="aagames-button-box fail-button">-->
          <!--              <button-->
          <!--                  class="aagames-button"-->
          <!--                  type="button"-->
          <!--                  @click="paymentFail = false"-->
          <!--              >{{ $t('确认') }}-->
          <!--              </button>-->
          <!--            </div>-->
          <!--            <div class="aagames-button-box">-->
          <!--                <van-button class="aagames-button" type="default" @click="paymentFail = false">{{$t('确认')}}</van-button>-->
          <!--              </div>-->
          <!--            <van-button type="primary" class="cancel" @click="$openKefu">{{$t('支付遇到问题')}}</van-button>-->
          <!--          </div>-->
        </div>
      </van-popup>

      <!-- 支付成功 -->
      <van-popup class="deposit-popup" v-model:show="paymentSuccess" closeable round teleport="body">
        <div class="pop-head">
          <h2>{{ $t('支付成功') }}</h2>
        </div>
        <div class="pop-body payStatus">
          <van-icon name="checked"></van-icon>
          <div class="pay-title">{{ $t('您的存款已到账') }}</div>
          <div class="ui-buttons">
            <van-button class="confirm-btn" type="primary" @click="handleSuccess">{{ $t('确认') }}</van-button>
          </div>
        </div>
      </van-popup>

      <van-popup class="deposit-popup" v-model:show="submitInfo" closeable round close-icon-position="top-right"
        teleport="body" ref="test">
        <div class="pop-head">
          <h2>{{ $t('存款审核中') }}</h2>
        </div>
        <div class="pop-body">
          <!-- <img class="big-img" src="@assets/images/memberCenter/success.png" alt="pay-warn"> -->
          <div class="pay-mark">
            <div class="clock">
              <van-image :src="$getSrc('/src/assets/images/clock.png')" />
              <van-count-down @finish="isPayment('submitInfo')" class="processing-time-deposit" :time="time"
                format="mm:ss" />
            </div>
            <div class="money-text" v-money="form.money ? (form.money * 1).toFixed(2) : 0"></div>
            <p>{{ $t('您的存款系统正在处理中') }}</p>
            <p>{{ $t('请耐心等待') }}</p>
          </div>
          <div class="btn">
            <div class="aagames-button-box order">
              <button class="aagames-button line" type="button" @click="$openKefu">{{ $t('查询订单进度') }}</button>
            </div>
            <div class="aagames-button-box">
              <button class="aagames-button mt30" type="button" @click="isPayment('submitInfo')">{{
                  $t('已完成存款')
              }}</button>
            </div>
          </div>
        </div>
      </van-popup>

      <!-- 银行选择 -->
      <van-popup :show="bankShow" teleport="body" position="bottom" round>
        <van-picker show-toolbar @confirm="onConfirmBank" value-key="name" @cancel="onCancelBank" :allow-html="true"
          :columns="banks" />
      </van-popup>

      <!-- 银行选择 -->
      <van-popup class="bankShowForPayOnline" :show="bankShowForPayOnline" teleport="body" position="bottom" round>
        <van-picker show-toolbar :title="$t('银行选择')" class="bankPick" :allow-html="true" @confirm="onConfirmBank"
          value-key="name" @cancel="onCancelBank" :columns="banksForPayOnline" />
      </van-popup>

      <!-- 优惠申请 -->
      <van-popup v-model:show="show" position="bottom" round teleport="body">
        <van-picker show-toolbar @confirm="onConfirm" :title="$t('优惠申请')" value-key="name" @cancel="onCancel"
          :columns="activities" />
      </van-popup>
      <form v-show="false" v-if="order" id="actform" name="actform" ref="from" :method="order.form.type"
        :action="order.form.url" target="_blank">
        <input v-for="(val, key) in order.form.form" :key="key" :name="key" type="hidden" :value="val" />
        <button class="aagames-button" id="actformBtn" type="submit">{{ $t('提交') }}</button>
      </form>
    </div>
    <van-dialog v-model:show="showDialog" show-cancel-button :message="$t('请问您当前存款遇到问题吗？客服小姐姐协助您解决哟！')"
      :cancelButtonText="$t('继续支付')" :confirmButtonText="$t('联系客服')" messageAlign="left" teleport="body"
      @cancel="goPayment" @confirm="$openKefu">
      <template #title>
        <div class="dialogTitle">
          <h4>{{ $t('支付提醒') }}</h4>
          <van-icon name="cross" @click="showDialog = false" />
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script>
import { computed, defineComponent, inject } from 'vue';
import * as centerApis from '@/api/center';
import * as agentApis from '@/api/agent';
// import {
//   // bankcardlist,
//   preferentialactivity,
//   paytype,
//   // paysubtype,
//   order,
//   merchantbank,
//   // allorderstatus,
//   checkorder,
//   allbanklist,
//   banklist,
//   paymethodinfo,
//   // quickmoneylist,
//   getprotocol,
//   getticker,
//   allgamecate,
// } from '@/api/center';
import { paymentsIcons } from '@/utils/bankcards';
import { openUrl } from '@/utils';
import { priceFormat, priceUnitTransform } from '../utils';
import SvgIcon from '@/components/SvgIcon.vue';

export default defineComponent({
  name: 'deposit',
  components: {
    SvgIcon,
  },
  inject: ['global'],
  props: {
    type: {
      type: String,
      default: 'center',
    },
  },
  data() {
    return {
      apis: this.type === 'center' ? centerApis : agentApis,
      title: this.global.$t('存款'),
      pay_first: true,
      drawerWidth: '100%',
      paymentsShow: false,
      amount_select: -1,
      paymentsIcons,
      loading: true,
      payments: [],
      paymentsChild: [],
      payment: null,
      active: 3,
      // 当前选中支付方式
      payType: 1,
      bankList: {},
      info: {
        min_money: 0,
        max_money: 1000,
        is_need_bank_code: false,
        quick_money_list: '',
      },
      activities: [
        {
          id: '',
          name: this.global.$t('不参与优惠活动'),
        },
      ],
      banks: [],
      allBanks: [],
      banksForPayOnline: [],
      allBanksForPayOnline: [],
      bankShowForPayOnline: false,
      promoShow: false,
      bankShow: false,
      moneyList: [],
      allGameCate: {},
      form: {
        money: '',
        bank: null,
        bankName: '',
        realName: '',
        alipayName: null,
        realname: '',
        activityId: null,
        pay_method_id: null,
      },
      orderData: {},
      submiting: false,
      // 流水倍数
      flow: 1,
      /* activity: {}, */
      flowText: '',
      popUpExplain: false,
      paymentFail: false,
      paymentSuccess: false,
      submitInfo: false,
      show: false,
      isExplain: false,
      paymentUrl: '',
      allorderstatusList: {},
      // { pay_url,trade_no }
      order: null,
      haskefupay: false,
      finished: false,
      time: 900000,
      payMethodId: '',
      showDialog: false,
      qrCodeUrl: '',
      protocolList: [],
      displayProtocol: [],
      chosePtotocol: '',
      ticker: '',
      channel: null,
      bankCodeArr: [
        'ABC',
        'BCCB',
        'BOC',
        'BOCOM',
        'BOS',
        'CCB',
        'CEB',
        'CGB',
        'CIB',
        'CMB',
        'CMBC',
        'ECITIC',
        'HXB',
        'HZCBC',
        'ICBC',
        'NBCBC',
        'PAB',
        'PSBC',
        'SPDB',
      ],
    };
  },
  computed: {
    activity() {
      return this.activities.find((act) => act.id === this.form.activityId) || {};
    },
    symbol() {
      if (this.type === 'agent') {
        return this.$store.state.agent?.userInfo?.currency?.symbol;
      }
      return this.$store.state.user?.userInfo?.currency_detail?.symbol;
    },
    placeHolder() {
      const { max_money, min_money } = this.info;
      const symbol = this.symbol;
      let minText; let
        maxText;
      if (symbol === '₫') {
        // 越南金额过大处理成k/m单位
        const { money: minnum, unit: minunit } = priceUnitTransform(min_money, 1);
        const { money: maxnum, unit: maxunit } = priceUnitTransform(max_money, 1);
        minText = `${minnum}${minunit}`;
        maxText = `${maxnum}${maxunit}`;
      } else {
        minText = priceFormat(min_money);
        maxText = priceFormat(max_money);
      }
      return `${this.$t('最低') + symbol + minText},${this.$t('最高') + symbol + maxText}`;
    },
  },
  watch: {
    active(val) {
      this.form = {};
      this.flowText = '';
      const data = {
        pay_type: this.payType,
        pay_method_id: this.payMethodId,
      };
      if (val === 2 || val === 6) {
        this.max_money = this.merchantBank.limit_money_end;
        this.min_money = this.merchantBank.limit_money_start;
      } else {
        this.apis.paymethodinfo(data)
          .then((res) => {
            this.max_money = res.max_money;
            this.min_money = res.min_money;
          });
      }
      this.apis.banklist(data)
        .then((res) => {
          this.bindColumns = res;
        });
    },
    'form.money': {
      handler(newValue, oldValue) {
        this.getFlowText();
        if (newValue) {
          this.getActivities();
        }
      },
      immediate: true,
    },
    'form.activityId': {
      handler() {
        this.getFlowText();
      },
      immediate: true,
    },
  },
  created() {
    // this.$loading();\
    Promise.all([
      this.getPaytypes(),
      // this.getMerchantBank(),
      this.getAllBanklist(),
      // todo: 接口报错操作金额不能为0，暂时注释
      this.getActivities(),
      this.getAllGames(),
    ])
      .then(() => {
        this.loading = false;
        this.global.$toast.clear();
        this.paymentsShow = !this.payment;
      });
  },
  methods: {
    getFlowText() {
      const { money = 0 } = this.form;
      if (this.form.activityId) {
        // if (Object.keys(this.activity).length) {
        // let proportion = 0;
        // const { flow, type } = this.activity;

        // try {
        //   proportion = JSON.parse(this.activity.benefit_setting)?.proportion / 100 ?? 0;
        // } catch (e) { }
        // console.log('````````` flow', flow, type, proportion);

        // const flowText = this.global.$t('流水要求：流水倍数');
        // this.flowText = `${flowText}${flow},${this.global.$t('有效投注额')}`;
        // if (type === 14) {
        //   this.flowText += `${this._priceFormat(flow * money * proportion)}`;
        // } else {
        //   this.flowText += `${this._priceFormat(flow * money * (1 + proportion))}`;
        // }
        const uid = this.$store.state.user.userInfo.id;
        const flowText = this.global.$t('流水要求：流水倍数');
        centerApis.activity_require({
          uid,
          id: this.form.activityId,
          money,
        }).then((data) => {
          const flowRate = data.flow_rate || '0';
          const flowMoney = this._priceFormat(data.flow_money || 0);
          this.flowText = `${flowText + flowRate},${this.global.$t('有效投注额') + flowMoney}`;
        });
      } else {
        this.flowText = this.global.$t('未选择活动');
      }
    },
    _priceFormat(price = 0) {
      const { user, agent } = this.$store.state;
      if (Number.isNaN(price)) price = 0;
      const symbol = agent?.userInfo?.currency?.symbol || user?.userInfo?.currency_detail?.symbol;
      return symbol + priceFormat(price);
    },
    handleScrollClass() {
      this.$nextTick(() => {
        const viewHeight = window.screen.availHeight;
        const headerHeight = document.getElementsByClassName('m-header')[0].offsetHeight;
        const bodyHeight = document.getElementsByClassName('deposit-page')[0].offsetHeight;
        const targetDom = document.getElementsByClassName('chips-scroll-wrap')[0];
        const targetBtn = document.getElementsByClassName('confirm-btn-wrap')[0];
        if (viewHeight - headerHeight - 200 < bodyHeight) {
          targetDom?.classList.add('scroll');
          targetBtn?.classList.add('scroll');
        } else {
          targetDom?.classList.remove('scroll');
          targetBtn?.classList.remove('scroll');
        }
      });
    },
    closeon() {
      if (this.payment === null) {
        this.$router.push(this.type === 'center' ? '/user' : '/affiliate/affiliate-deposit');
      }
    },
    selectPay() {
      this.pay_first = false;
    },
    selectPAyBack() {
      this.pay_first = true;
    },
    showPayments() {
      this.paymentsShow = true;
    },
    selectPayment(payment) {
      this.form.bankName = '';
      this.amount_select = -1;
      if (payment.child && payment.child.length > 0) {
        this.paymentsChild = payment.child;
      } else {
        this.payment = payment;
        this.paymentsShow = false;
        this.payType = payment.id;
        this.channel = payment.name;
        this.payMethodId = payment.pay_method_id;
        if (this.payType === 2 || this.payType === 1) {
          this.getBanklist();
        }
        if (this.payType === 11 || this.payType === 15 || this.payType === 16) {
          this.getProtocolList();
        }
        this.getDepositInfo();
        this.getMerchantBank();
      }
      this.handleScrollClass();
    },
    async getProtocolList() {
      const res = await this.apis.getprotocol({ pay_method_id: this.payment.pay_method_id });
      this.protocolList = res.map((item) => ({
        ...item,
        type: item.title === 'ERC20' ? '1' : '2',
      }));
      this.chosePtotocol = this.protocolList[0].protocol;
      this.handleTicker(this.protocolList[0].protocol);
    },
    handleProtocol(val) {
      this.chosePtotocol = val;
      this.handleTicker(val);
    },
    async handleTicker(val) {
      const res = await this.apis.getticker({
        digital_mode_type: val,
        pay_method_id: this.payment.pay_method_id,
      });
      this.ticker = res.upCoin;
    },
    initForm() {
      this.form = {
        money: '',
        bank: null,
        bankName: '',
        alipayName: null,
        realname: '',
        activityId: null,
        pay_method_id: null,
      };
      this.amount_select = -1;
    },
    // 获取银行图标
    getIcon(name) {
      let url = '';
      try {
        url = `/src/assets/images/deposit-bank/${name}@2x.png`;
        // url = "";
      } catch (error) {
        url = '';
      }
      return url;
    },
    paymentSwitch(idx) {
      const { payments } = this;
      const payment = payments[idx];
      let payType = {};
      if (!payment?.child) {
        payType = (payment && payment.id) || 0;
        this.payMethodId = payment?.pay_method_id;
      } else {
        payType = (payment.child[0] && payment.child[0].id) || 0;
        this.payMethodId = payment.child[0].pay_method_id;
      }

      const toast = this.global.$toast.loading({
        className: 'toast-loading',
        mask: true,
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
        message: this.global.$t('加载中...'),
      });

      const data = {
        pay_type: payType,
      };
      this.initForm();
      this.payType = payType;
      Promise.all([
        this.getDepositInfo(),
        this.getBanklist(),
        this.getMerchantBank(),
      ])
        .then((res) => {
          toast.clear();
        });
    },
    // 获取支付渠道列表
    getPaytypes() {
      return this.apis.paytype()
        .then((res) => {
          this.payments = res;
          this.payments.forEach((item, i) => {
            if (item.name === this.global.$t('客服支付')) {
              this.haskefupay = true;
              this.payments.splice(i, 1);
            }
          });
          setTimeout(() => {
            this.paymentSwitch(0);
          }, 300);
        });
    },
    // 获取渠道信息
    getDepositInfo() {
      const data = {
        // pay_type: this.payType,
        pay_method_id: this.payMethodId,
      };
      this.apis.paymethodinfo(data)
        .then((res) => {
          this.info = res;
          this.moneyList = this.info.quick_money_list;
          this.qrCodeUrl = this.info.pay_qrcode_url;
          this.displayProtocol = this.info?.support_protocol ?? [];
        });
    },
    // 获取渠道银行
    getBanklist() {
      const data = {
        pay_type: this.payType,
        pay_method_id: this.payMethodId,
      };
      this.apis.banklist(data)
        .then((res) => {
          if (res?.length) {
            this.banks = res;
            const list = JSON.parse(JSON.stringify(res));
            const allList = JSON.parse(JSON.stringify(this.allBanksForPayOnline));
            this.banksForPayOnline = [];
            allList.forEach((item) => {
              list.forEach((sub) => {
                if (sub.id === item.id) {
                  item.isDisabled = false;
                }
              });
              this.banksForPayOnline.push(item);
            });
            this.banksForPayOnline.forEach((item) => {
              item.name = `<div style='position: relative;'>
              <div style="display: ${item.isDisabled ? 'block' : 'none'};height: 44px;
              position: absolute;
              width: 100%;
              padding: 0 16px;
              text-align: right;">
              <div style='position: absolute;
              right: -54px;
              bottom: 24px;
              color: #999;
              padding: 0 5px;
              height: 18px;
              line-height: 18px;'>维护中</div>
              </div>
              <img style="height: 26px;vertical-align: middle;margin-right:10px;" src="${this.$getSrc(`/src/assets/images/bank/bank_${item.icon_code?.toLowerCase()}_logo.png`)
                || this.$getSrc(`/src/assets/images/bank/bank_${item.icon_code}_bg.png`)
                }"><span>${item.name}</span></div>`;
            });
            this.banks.forEach((item) => {
              item.nameCN = item.name;
              // item.name = `<p>${item.name}</p>`;
              item.name = `
              <img style="height: 26px;vertical-align: middle;margin-right:10px;" src="${this.$getSrc(`/src/assets/images/bank/bank_${item.icon_code?.toLowerCase()}_logo.png`)
                || this.$getSrc('/src/assets/images/bank/bank_ty_logo.png')
                }"><span>${item.name}</span></div>`;
            });
          }
        });
    },
    // 获取所有银行列表
    getAllBanklist() {
      return this.apis.allbanklist()
        .then((res) => {
          if (res?.length) {
            this.allBanks = res;
            const list = JSON.parse(JSON.stringify(res));
            list.forEach((item) => {
              item.isDisabled = true;
              item.nameCN = item.name;
            });
            this.allBanksForPayOnline = list;
          }
        });
    },
    getActivities() {
      if (!this.$route.path.includes('affiliate')) {
        return this.apis.preferentialactivity({ money: parseFloat(this.form.money) })
          .then((res) => {
            this.activities = [
              {
                id: '',
                name: this.global.$t('不参与优惠活动'),
              },
            ];
            this.activities = this.activities.concat(res);
          });
      }
    },
    getAllGames() {
      return centerApis.allgamecate()
        .then((res) => {
          this.allGameCate = res;
        });
    },
    getMerchantBank() {
      this.apis.merchantbank({
        pay_method_id: this.payMethodId,
      })
        .then((res) => {
          this.bankList = res;
        });
    },
    // 快捷选择
    selectAmount(amount, index) {
      this.form.money = amount;
      this.amount_select = index;
      this.handleMoney();
    },
    getChipClassName(money) {
      if (money <= 500) {
        return 'chip1';
      }
      if (money > 500 && money <= 2000) {
        return 'chip2';
      }
      if (money > 2000 && money <= 4000) {
        return 'chip3';
      }
      if (money > 4000 && money <= 6000) {
        return 'chip4';
      }
      return 'chip5';
    },
    isPayment(val) {
      if (this[val]) {
        this[val] = false;
      }
      this.apis.checkorder({
        trade_no: this.order.trade_no,
      })
        .then((res) => {
          this.isExplain = false;
          if (res.pay_status === 2) {
            this.paymentSuccess = true;
          } else {
            this.paymentFail = true;
          }
        });
    },
    goPayment(win) {
      // this.popUpExplain = true
      this.isExplain = true;
      if (this.order.pay_url) {

      } else {
        document.getElementById('actformBtn')
          .click();
      }
    },
    checkBankcard() {
      if (this.payType === 2) {
        this.bankShow = true;
      } else {
        this.bankShowForPayOnline = true;
      }
    },
    goback() {
      this.$router.push('/center');
    },
    beforeSubmit() {
      openUrl(this.submit);
    },
    submit(fn) {
      return new Promise((resolve) => {
        const {
          form,
          payType,
          info,
          banks,
          payment,
          bankList,
          payMethodId,
        } = this;
        if (!form.money) {
          this.global.$toast.fail(this.global.$t('请填写存款金额'));
          return false;
        }
        if (form.money > info.max_money || form.money < info.min_money) {
          this.global.$toast.fail(this.global.$t('最大存款'));
          return false;
        }
        if (!payment || !payment.id) {
          this.global.$toast.fail(this.global.$t('请选择存款渠道'));
          return false;
        }
        if (payment.is_realname === 1 && !form.realname) {
          this.$toast.fail(this.$t('请输入真实姓名'));
          return false;
        }
        this.submiting = true;
        const data = {
          pay_type: payType,
          domain: window.location.host,
          user_bank_id: form.bank,
          alipay_name: form.alipayName,
          real_name: form.realName,
          bank_name: form.realName,
          money: parseFloat(form.money),
          activity_id: form.activityId,
          remark: (bankList && bankList.rand_num) || '',
          recive_bankaccount_id: (bankList && bankList.id) || '',
          pay_method_id: payMethodId,
          digital_mode_type: this.chosePtotocol,
          realname: form.realname,
        };
        this.$nextTick(() => this.apis.order(data)
          .then((res) => {
            this.submiting = false;
            // if (this.$refs.test.$children[1]) {
            //   this.$refs.test.$children[1].reset();
            // }
            // if (this.$refs.test1.$children[1]) {
            //   this.$refs.test1.$children[1].reset();
            // }

            this.order = res;
            this.getDepositInfo();
            this.getMerchantBank();
            if (
              payType === 2
              || payType === 6
              || payType === 13
              || payType === 12
              || payType === 14
            ) {
              this.submitInfo = true;
              resolve(this.order.pay_url);
            } else {
               this.popUpExplain = true;
            }
            // this.goPayment()
            fn?.(this.order.pay_url);

            resolve(this.order.pay_url);
          })
          .catch((err) => {
            this.submiting = false;
          }));
      });
    },
    onConfirmBank(val) {
      if (this.payType === 1) {
        if (val.isDisabled) {
          this.global.$toast.fail(`${val.nameCN}正在维护中...`);
          return;
        }
        this.form.bank = val.id;
        this.form.bankName = val.nameCN;
      } else {
        // if (val.isDisabled) {
        //   this.global.$toast.fail(`${val.nameCN}正在维护中...`);
        //   return;
        // }
        this.form.bank = val.id;
        // this.form.bankName = val.name;
        this.form.bankName = val.nameCN;
      }
      this.bankShow = false;
      this.bankShowForPayOnline = false;
    },
    onCancelBank() {
      this.bankShow = false;
      this.bankShowForPayOnline = false;
    },
    onConfirm(val) {
      const {
        flow,
        id,
        name,
      } = val;
      // const { money } = this.form
      /* this.activity = val; */
      this.flow = flow || 1;
      this.form.activityId = id;
      this.form.activityTitle = name;
      this.show = false;
    },
    onCancel() {
      this.show = false;
    },
    onCopy(e) {
      this.global.$toast.success(this.global.$t('复制成功'));
    },
    onError(e) {
      this.global.$toast.fail(this.global.$t('复制失败'));
    },
    onClickLeft() {
      this.$router.push({
        name: 'centerHome',
      });
    },
    onClickRight() {
      this.$openKefu();
    },
    handleSuccess() {
      this.paymentSuccess = false;
    },
    downloadIamge() {
      const image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        const url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
        const a = document.createElement('a'); // 生成一个a元素
        const event = new MouseEvent('click'); // 创建一个单击事件
        a.download = 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = this.qrCodeUrl;
    },
    handleMoney() {
      const max = this.form.money * 1 + 1;
      const min = this.form.money * 1;
      if (this.payType === 14) {
        this.form.money = (Math.random() * (max - min) + min).toFixed(2);
      }
    },
    go() {
      console.log('this.payment', this.payment);
      if (this.payment.h5_url && !this.payment.h5_url.includes('https')) {
        this.$router.push(this.payment.h5_url);
      } else if (this.payment.h5_url && this.payment.h5_url.includes('https')) {
        window.open(this.payment.h5_url);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.deposit-page {
  box-sizing: border-box;
  height: 100%;
  flex: 1;
  overflow-y: auto;

  .select-pay {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--border-color-323232);
    padding: 22.5px 0;
    margin: 0 30px;

    >div {
      display: flex;
      align-items: center;

      img:nth-child(1) {
        width: 60px;
        margin-right: 22.5px;
      }

      div:nth-child(2) {
        color: var(--dark-fff, var(--font-color-222930));
      }

      img:nth-child(2) {
        width: 45px;
      }

      div:nth-child(1) {
        color: var(--dark-fff, var(--font-color-222930));
        margin-right: 22.5px;
      }
    }
  }

  .deposit-main {
    overflow-x: hidden;
    width: 100%;

    >li {
      margin: 0 30px;

      .label-protocol {
        display: block;
        margin: 30px 0;
        color: var(--dark-fff, var(--font-color-222930));
      }

      .protocol {
        padding-bottom: 40px;

        span {
          display: inline-block;
          width: 200px;
          height: 80px;
          border-radius: 12px;
          border: 2px solid var(--dark-333, var(--border-color-e7e7e7));
          line-height: 80px;
          text-align: center;
          font-size: 28px;
          color: var(--dark-fff, var(--font-color-666666));
          margin-right: 20px;

          &.active {
            border: 4px solid var(--theme-color);
            color: var(--theme-color);
            opacity: 1;
          }
        }
      }

      &.tips {
        padding: 0 30px;
        font-size: 24px;

        >p {
          text-align: justify;
        }

        &.ticker {
          display: flex;
          justify-content: space-between;

          span {
            font-size: 24px;
            cursor: pointer;

            i {
              color: var(--theme-color);
            }
          }
        }

        line-height: 1.5;
        margin: 20px 0;
        text-align: center;
        color: #666;
      }

      &.quick-select {
        background-color: var(--dark-bg-color-191919, var(--bg-color-f6f6f6));
        border-radius: 26px;

        .cell {

          input,
          .cell-foot {
            color: var(--dark-fff, var(--font-color-333333));
          }
        }
      }

      &:nth-child(1) {
        // background: var(--theme-color);
        // width: 100%;
        height: 118px;
        padding: 30px 30px 0;
        margin: 0;

        .input {
          // background: var(--theme-color);
          text-align: left;

          input {
            background: none;
            color: var(--dark-fff, var(--font-color-333333));
            font-size: 48px;
            font-weight: 400;
            text-align: left;
            padding: 0;
          }

          ::-webkit-input-placeholder {
            color: var(--font-color-fff-5);
            font-size: 40px;
          }
        }
      }

      >label {
        color: var(--dark-fff, var(--font-color-333333));
        font-size: 28px;
        line-height: 40px;
        display: block;
      }
    }

    .input {
      height: 70px;
      display: flex;
      align-items: center;

      span {
        color: var(--dark-fff, var(--font-color-222930));
        margin-right: 10px;
        line-height: 75px;
        font-size: 40px;
      }

      >input {
        color: var(--dark-fff, var(--font-color-222930));
        width: 100%;
        height: 100%;
        border: none;
        font-size: 14px;

        &::placeholder {
          opacity: 0.4;
        }
      }
    }

    .quick-select {
      .label {
        position: absolute;
        color: var(--font-color-333);
        height: 100%;
        width: 100%;
      }

      .board {
        padding-top: 20px;
        background: var(--border-color-282828);
        border-radius: 8px;
        overflow: hidden;
        position: relative;

        .yt-label {
          background: var(--theme-color);
          padding: 0;
          margin: 0 30px;
          line-height: 80px;
          border-radius: 10px;
          margin-top: 10px;

          p {
            padding-left: 20px;
            font-size: 30px;
          }
        }
      }
    }
  }

  .pay-nav {
    display: flex;
    align-items: center;
    height: 150px;
    margin: 0 22.5px;
    border-top: 2px solid var(--border-color-646464);

    img:nth-child(1) {
      width: 75px;
    }

    img:nth-child(3) {
      width: 45px;
    }

    .pay-info {
      padding: 0 37.5px;
      width: 80%;

      div:nth-child(1) {
        font-size: 37.5px;
        color: var(--font-color-fff);
        margin-bottom: 7.5px;
      }

      div:nth-child(2) {
        font-size: 30px;
        color: var(--font-color-999999);
      }
    }
  }

  // .aagames-button-box{
  //   .aagames-button{
  //     &.line{
  //       background:@bg-card-color;
  //     }
  //   }
  // }
}

.dialogTitle {
  position: relative;

  h4 {
    margin: 0;
  }

  .van-icon-cross {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.pop-body.iconImage {
  text-align: center;
}

.pay-mark {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 20px;

  .van-count-down {
    color: var(--theme-color);
    font-size: 32px;
  }

  >p {
    color: var(--dark-fff, var(--font-color-333333));
    font-size: 28px;
  }

  >* {
    width: 100%;
  }

  .clock {
    margin-bottom: 30px;

    .van-image {
      width: 120px;
      height: 120px;
      margin-bottom: 15px;
      color: var(--theme-color);
    }

    span {
      display: block;
      width: 100%;
    }
  }

  .money-text {
    font-size: 60px;
    margin-bottom: 20px;
    color: var(--theme-color);
  }

  h3 {
    margin: 0;
    font-size: 36px;
    color: var(--dark-fff, var(--font-color-222930));
    margin-bottom: 30px;
  }

  p {
    line-height: 1.4;
  }
}

.cell-flex {
  margin-bottom: 10px;

  &.channel {
    opacity: 1 !important;
  }

  &:last-child {
    margin-bottom: 0;
    opacity: 0.6;
  }
}

.cell-body {
  position: relative;

  .cell-tip {
    position: absolute;
    top: -40px;
    right: 10px;
    padding: 6px;
    background: var(--theme-color);
    font-size: 14px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    color: var(--font-color-fff);
  }
}

.qrcode {
  width: 100%;

  li {
    text-align: center;
    width: 100%;

    p {
      color: var(--theme-color);
      font-size: 30px;
      line-height: 50px;
    }
  }

  img {
    width: 50%;
  }
}

.bankPick {
  :deep(.van-ellipsis) {
    overflow: unset;
  }
}

.list-cells {
  padding: 0 30px;

  .cell {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 2px solid #333;
    color: var(--dark-fff, var(--font-color-333333));
    font-size: 28px;

    &:last-child {
      border-bottom: none;
    }

    &-head {
      padding-right: 30px;
      white-space: nowrap;

      .van-image {
        width: 60px;
        height: 60px;
      }
    }

    &-body {
      width: 100%;
      // font-size: 28px;
      text-align: left;

      input {
        background-color: transparent;
        width: 100%;
        border: none;
        text-align: right;
      }
    }

    &-foot {
      white-space: nowrap;
      color: #666;
      display: flex;
      align-items: center;

      .van-icon {
        font-size: 40px;
        margin-left: 30px;
      }

      .van-icon-success {
        color: var(--theme-color);
      }
    }

    &.cell-ness {
      height: auto;
      padding: 20px 0;
    }

    .card-like {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 56px;

        label,
        >span {
          padding-right: 30px;
        }

        label,
        a {
          white-space: nowrap;
        }

        >label {
          color: var(--dark-fff-06, var(--font-color-333333));
        }

        >span {
          color: var(--dark-fff, var(--font-color-333333));
          font-weight: 500;
          text-align: left;
          width: 100%;
        }

        a {
          width: 38px;
          height: 38px;

          >svg {
            width: 24px;
            height: 26px;
            fill: var(--theme-color);
          }
        }
      }
    }
  }
}

.van-popup--bottom {
  .van-icon-cross {
    color: var(--font-color-666666);
  }

  .list-cells {
    .cell {
      padding: 14px 0;
    }
  }
}

.pop-head {
  color: var(--dark-fff, var(--font-color-333333));
  position: relative;
  text-align: center;

  h2 {
    margin: 0;
    text-align: center;
    line-height: 100px;
    font-size: 32px;
  }

  .van-icon {
    color: var(--font-color-666666);
  }

  .van-icon-arrow-left {
    position: absolute;
    font-size: 40px;
    margin-top: -20px;
    left: 10px;
    top: 50%;
  }
}

.pop-body {
  padding: 0 30px 40px;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .pay-title {
    font-size: 28px;
    color: var(--dark-fff, var(--font-color-000000));
    margin: 20px 0;
  }

  &.payStatus {
    .van-icon-clear {
      font-size: 120px;
    }

    .van-icon-checked {
      font-size: 120px;
      color: var(--theme-color);
    }
  }
}

.btn {
  margin-top: 60px;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .aagames-button-box {
    flex: 1;

    &:nth-child(1) {
      margin-right: 30px;
    }

    // &.order{
    //   flex: 1;
    // }
  }

  .aagames-button {
    background-color: var(--theme-color);
    width: 100%;
    font-size: 30px;
    text-align: center;
    color: var(--font-color-ffffff);
    border-radius: 8px;
    height: 80px;

    &.line {
      border: 2px solid var(--border-color-666);
      background-color: transparent;
      color: var(--dark-666, var(--font-color-999999));
      // var(--font-color-666666)
    }
  }
}

.submit-btn {
  width: 100%;
  margin-bottom: 30px;
}

.van-button {
  width: 560px;
  height: 90px;
  font-size: 30px;
  font-weight: 400;
  border-radius: 8px;
}

.van-button--success {
  background-color: var(--bg-color-24c29a);
  border: none;
}

.ui-buttons {
  display: flex;
  width: 100%;
  margin-top: 60px;

  &.confirm-btn-wrap {
    width: auto;

    &.scroll {
      // position: fixed;
      // bottom: 0;
      margin-top: 60px;
    }
  }

  .van-button {
    // width: 100%;
    width: 270px;

    &:nth-child(2) {
      margin-left: 30px;
    }

    &.next-btn {
      font-size: 32px;
      width: 690px;
    }

    &.van-button--disabled {
      background-color: var(--dark-00654e, var(--bg-color-7ae5ce)) !important;

      .van-button__text {
        opacity: 0.5;
      }

      opacity: 1 !important;
    }
  }

  .confirm-btn {
    width: 100%;
  }

  .aagames-button {
    height: 80px;
    border-radius: 8px;
    width: 270px !important;
    font-size: 30px;

    &:first-child {
      margin-right: 30px;
      padding: 0;
    }
  }

  .aagames-button-default {
    background-color: transparent;
    border: solid 2px var(--border-color-666);
    color: var(--dark-666, var(--font-color-999999));
  }
}

.chips-scroll-wrap {
  z-index: 1;
  padding: 15px 30px 20px;
  overflow-y: visible;
  // position: relative;

  &.scroll {
    overflow-x: auto;
    // position: relative;
    // &::after {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   height: 106px;
    //   width: 2px;
    //   right: 20px;
    //   top: 38px;
    //   z-index: 10;
    //   box-shadow: -12px 0px 10px 0px var(--dark-fff, var(--border-color-00001));
    // }

    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }

    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;

    /* IE 10+ */
    // margin: 0 30px 20px;
    .chips {
      overflow: visible;

      // flex-flow: nowrap;
      .chip {
        padding: 10px 6px;

        &.selected {
          &::after {
            left: 18px;
          }
        }
      }
    }
  }
}

.chips {
  display: flex;
  align-items: center;
  flex-flow: wrap;

  .chip {
    width: 20%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    box-sizing: border-box;

    // filter: grayscale(.8);
    &.selected {
      background-repeat: no-repeat;
      background-size: cover;

      &::after {
        content: "";
        width: 100px;
        height: 100px;
        position: absolute;
        top: 15px;
        left: 10px;
        box-shadow: 0 -3px 26px var(--bg-color-666666);
        border-radius: 50%;
      }

      // background-image: url("~@assets/img3_0/chouma/choumafaguang.png");
      // filter: grayscale(0);
    }

    label {
      width: 106px;
      height: 106px;
      line-height: 100px;
      transition: all 0.45s ease-out;
      font-size: 34px;
      text-align: center;
      color: var(--font-color-ffffff);
      font-weight: 600;
      background-repeat: no-repeat;
      background-size: contain;
      position: relative;
      z-index: 10;

      &.disabledLabel {
        // color: #c0c4cc;
        cursor: not-allowed;
        background-image: none;
        border-color: var(--border-color-ebeef5);
      }
    }

    &.chip1 {
      label {
        background-image: url("/src/assets/images/chouma/chouma1.png");
      }
    }

    &.chip2 {
      label {
        background-image: url("/src/assets/images/chouma/chouma2.png");
      }
    }

    &.chip3 {
      label {
        background-image: url("/src/assets/images/chouma/chouma3.png");
      }
    }

    &.chip4 {
      label {
        background-image: url("/src/assets/images/chouma/chouma4.png");
      }
    }

    &.chip5 {
      label {
        background-image: url("/src/assets/images/chouma/chouma5.png");
      }
    }
  }
}

:deep(.van-loading__circular) {
  color: var(--font-color-fff);
}
</style>
