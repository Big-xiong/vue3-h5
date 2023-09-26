export default [
  {
    path: '/center',
    redirect: { name: 'user' },
    component: () => import('@/components/Layout/center.vue'),
    children: [
      {
        path: 'fund-management',
        icon: 'el-icon-s-finance',
        meta: {
          title: '资金管理',
        },
        props: true,
        redirect: { name: 'centerDeposit' },
        component: () => import('@/views/center/components/Wrap.vue'),
        children: [
          {
            path: 'deposit',
            name: 'centerDeposit',
            meta: {
              title: '充值',
              rightStatus: true,
              showSubHeader: true,
            },
            component: () => import('@/views/center/fund-management/deposit/index.vue'),
          },
          {
            path: 'withdraw',
            name: 'centerWithdraw',
            meta: {
              title: '取款',
              rightStatus: false,
              showSubHeader: true,
              // goBack: 'centerHome',
              goBack: 'user',
            },
            component: () => import('@/views/center/fund-management/withdraw/index.vue'),
          },
          {
            path: 'digital',
            name: 'centerDigitalAddress',
            meta: {
              title: '收币地址',
              // rightStatus: false,
              // showSubHeader: true,
              // goBack: 'centerWithdraw',
              layout: false,
            },
            component: () => import('@/views/center/fund-management/withdraw/digitalAddress.vue'),
          },
          {
            path: 'addDigitalAddress',
            name: 'centerAddDigitalAddress',
            meta: {
              title: '新增收币地址',
              layout: false,
            },
            component: () => import('@/views/center/fund-management/withdraw/addDigAddress.vue'),
          },
          {
            path: 'bank-card',
            name: 'centerBankCard',
            meta: {
              title: '银行卡管理',
              rightStatus: true,
              showSubHeader: true,
            },
            component: () => import('@/views/center/fund-management/bank-card/index.vue'),
          },
          {
            path: 'bank-card-add',
            name: 'centerBankCardAdd',
            meta: {
              title: '添加银行卡',
              rightStatus: true,
              showSubHeader: true,
            },
            component: () => import('@/views/center/fund-management/bank-card/addCard.vue'),
          },
          {
            path: 'financial',
            name: 'centerFinancial',
            meta: {
              title: '理财小金库',
              layout: false,
            },
            component: () => import('@/views/center/fund-management/financial/index.vue'),
          },
          {
            path: 'history',
            name: 'centerHistory',
            meta: {
              title: '历史记录',
              showSubHeader: true,
              rightStatus: false,
            },
            component: () => import('@/views/center/fund-management/rebate/history.vue'),
          },
          {
            path: 'rebate',
            name: 'centerRebate',
            meta: {
              title: '自助洗码',
              layout: false,
              noBg: true,
            },
            component: () => import('@/views/center/fund-management/rebate/index.vue'),
          },
          {
            path: 'transfer',
            name: 'centerTransfer',
            meta: {
              title: '额度转账',
              layout: false,
            },
            component: () => import('@/views/center/fund-management/transfer/index.vue'),
          },
        ],
      },
      {
        path: 'account-settings',
        icon: 'el-icon-setting',
        meta: {
          title: '账户设置',
        },
        redirect: { name: 'centerSubscription' },
        component: () => import('@/views/center/components/Wrap.vue'),
        children: [
          {
            path: 'subscription',
            name: 'centerSubscription',
            meta: {
              title: '服务订阅',
              showSubHeader: true,
              rightStatus: false,
            },
            component: () => import('@/views/center/account-settings/subscription/index.vue'),
          },
          {
            path: 'site-mail',
            name: 'centerSiteMail',
            meta: {
              title: '消息中心',
              rightStatus: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/account-settings/site-mail/index.vue'),
          },
          // {
          //   path: 'notice',
          //   name: 'centerNotice',
          //   meta: {
          //     title: '最新公告',
          //     rightStatus: false,
          //     goBack: 'user',
          //   },
          //   component: () => import('@/views/center/account-settings/notice/index.vue'),
          // },
          // {
          //   path: 'profile',
          //   name: 'centerProfile',
          //   meta: {
          //     title: '个人资料',
          //   },
          //   component: () => import('@/views/center/accountSettings/profile/index.vue'),
          // },
          {
            path: 'account-safe',
            name: 'centerAccountSafe',
            meta: {
              title: '账号安全',
              showSubHeader: true,
            },
            component: () => import('@/views/center/account-settings/account-safe/index.vue'),
          },
        ],
      },
      {
        path: 'transaction-record',
        icon: 'el-icon-s-order',
        meta: {
          title: '交易记录',
        },
        props: true,
        redirect: { name: 'centerDepositRecord' },
        component: () => import('@/views/center/transaction-record/index.vue'),
        children: [
          {
            path: 'deposit-record',
            name: 'centerDepositRecord',
            meta: {
              title: '存款',
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/deposit-record/index.vue'),
          },
          {
            path: 'withdraw-record',
            name: 'centerWithdrawRecord',
            meta: {
              title: '取款',
              // showSubHeader: true,
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/withdraw-record/index.vue'),
          },
          {
            path: 'transfer-record',
            name: 'centerTransferRecord',
            meta: {
              title: '转账',
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/transfer-record/index.vue'),
          },
          {
            path: 'bonus-record',
            name: 'centerBonusRecord',
            meta: {
              title: '红利',
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/bonus-record/index.vue'),
          },
          {
            path: 'game-record',
            name: 'centerGameRecord',
            meta: {
              title: '投注',
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/game-record/index.vue'),
          },
          {
            path: 'account-change-record',
            name: 'centerAccountChangeRecord',
            meta: {
              title: '账变',
              layout: false,
              goBack: 'user',
            },
            component: () => import('@/views/center/transaction-record/account-change-record/index.vue'),
          },
        ],
      },
      {
        path: 'my-vip',
        hiddenSelf: true,
        props: true,
        component: () => import('@/views/center/components/Wrap.vue'),
        redirect: { name: 'myVip' },
        children: [
          // {
          //   path: 'my-vip',
          //   name: 'myVip',
          //   icon: 'el-icon-star-on',
          //   meta: {
          //     title: 'VIP特权',
          //   },
          //   component: () => import('@/views/center/my-vip/index.vue'),
          // },
        ],
      },
      {
        path: '/more',
        name: 'more',
        meta: {
          title: '更多',
          showSubHeader: true,
          rightStatus: false,
        },
        component: () => import('@/views/center/more/index.vue'),
      },
      {
        path: '/contact-us',
        name: 'ContactUs',
        meta: {
          title: '联系我们',
          showSubHeader: true,
          rightStatus: false,
        },
        component: () => import('@/views/center/more/contact-us.vue'),
      },
      {
        path: '/aboutWe',
        name: 'AboutUs',
        meta: {
          title: '关于我们',
          showSubHeader: true,
          rightStatus: false,
        },
        component: () => import('@/views/center/more/about-us.vue'),
      },
      {
        path: '/vip',
        name: 'Vip',
        meta: {
          showVipHeader: true,
        },
        component: () => import('@/views/index/vip/index.vue'),
      },
      {
        path: '/details',
        name: 'Details',
        meta: {
          title: '公告详情',
          showSubHeader: true,
        },
        component: () => import('@/views/index/notice/details.vue'),
      },

      {
        path: '/slot',
        name: 'slot',
        meta: {
          title: '电子', // 与subHeader.vue逻辑绑定
          showSubHeader: true,
          rightStatus: false,
        },
        component: () => import('@/views/index/slot/index.vue'),
      },
    ],
  },

];
