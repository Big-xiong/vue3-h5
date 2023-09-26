export default [
  {
    path: '/affiliate',
    name: 'agentHome',
    redirect: '/affiliate/home',
    component: () => import('@/components/Layout/agent.vue'),
    children: [
      // {
      //   path: 'auth',
      //   name: 'agentAuth',
      //   redirect: '/agent/auth/login',
      //   meta: {
      //     title: '登录注册',
      //   },
      //   component: () => import('@/views/agent/login/index.vue'),
      //   children: [
      //     {
      //       path: 'login',
      //       name: 'agentLogin',
      //       component: () => import('@/views/agent/login/Login.vue'),
      //       meta: {
      //         title: '代理登陆',
      //       },
      //     },
      //     {
      //       path: 'register',
      //       name: 'agentRegister',
      //       component: () => import('@/views/agent/login/register.vue'),
      //       meta: {
      //         title: '代理注册',
      //       },
      //     },
      //   ],
      // },
      {
        path: '',
        name: 'agentLanding',
        meta: {
          title: '合营伙伴计划',
          layout: false,
        },
        component: () => import('@/views/agent/landing/index.vue'),
      },
      {
        path: 'home',
        name: 'agentHome',
        meta: {
          title: 'BLIZZWIN',
          icon: 'home-tab',
          go: 'home',
          tabName: '首页',
          rightStatus: false,
        },
        component: () => import('@/views/agent/home/index.vue'),
      },
      {
        path: 'member-list',
        name: 'agentMemberList',
        meta: {
          title: '会员列表',
          icon: 'member-tab',
          tabName: '成员',
          layout: false,
        },
        component: () => import('@/views/agent/member-list/index.vue'),
      },
      {
        path: 'popularize-link',
        name: 'agentPopularizeLink',
        meta: {
          icon: 'pop-tab',
          title: '推广',
          tabName: '推广',
        },
        component: () => import('@/views/agent/popularize-link/index.vue'),
      },
      {
        path: 'popularize-material',
        name: 'agentPopularizeMaterial',
        meta: {
          title: '推广素材',
        },
        component: () => import('@/views/agent/popularize-material/index.vue'),
      },
      {
        path: 'commission-table',
        name: 'agentCommissionTable',
        meta: {
          title: '佣金报表',
          tabName: '佣金',
          icon: 'money-tab',
          layout: false,
        },
        component: () => import('@/views/agent/commission-table/index.vue'),
      },
      {
        path: 'center',
        name: 'agentCenter',
        meta: {
          title: '我的',
          tabName: '我的',
          icon: 'my-tab',
          layout: false,
        },
        component: () => import('@/views/agent/center/index.vue'),
      },
      {
        path: 'financial-table',
        name: 'agentFinancialTable',
        meta: {
          title: '财务报表',
          layout: false,
        },
        component: () => import('@/views/agent/financial-table/index.vue'),
      },
      {
        path: 'card-management',
        name: 'agentCardManagement',
        meta: {
          title: '银行卡管理',
          layout: false,
        },
        component: () => import('@/views/agent/card-management/index.vue'),
      },
      {
        path: 'add-card',
        name: 'agentAddCard',
        meta: {
          title: '添加银行卡',
          layout: true,
        },
        component: () => import('@/views/agent/add-card/index.vue'),
      },
      {
        path: 'member-detail',
        name: 'agentMemberDetail',
        meta: {
          title: '会员详情',
          rightStatus: false,
        },
        component: () => import('@/views/agent/member-detail/index.vue'),
      },
      {
        path: 'member-withdraw',
        name: 'agentWithdraw',
        meta: {
          title: '会员转账',
          layout: false,
        },
        component: () => import('@/views/agent/member-withdraw/index.vue'),
      },
      {
        path: 'commission-withdraw',
        name: 'agentCommissionWithdraw',
        meta: {
          title: '佣金提款',
        },
        component: () => import('@/views/agent/commission-withdraw/index.vue'),
      },
      {
        path: 'commission-detail',
        name: 'agentCommissionDetail',
        meta: {
          title: '佣金详情',
          rightStatus: false,
        },
        component: () => import('@/views/agent/commission-detail/index.vue'),
      },
      {
        path: 'member-register',
        name: 'agentVipRegister',
        meta: {
          title: '会员开户',
          rightStatus: false,
        },
        component: () => import('@/views/agent/member-register/index.vue'),
      },
      {
        path: 'affiliate-list',
        name: 'agentList',
        meta: {
          title: '代理列表',
        },
        component: () => import('@/views/agent/agent-list/index.vue'),
      },
      {
        path: 'affiliate-deposit',
        name: 'agentDeposit',
        meta: {
          title: '充值',
          rightStatus: false,
        },
        component: () => import('@/views/agent/deposit/index.vue'),
      },
      {
        path: 'affiliate-register',
        name: 'agentMemberRegister',
        meta: {
          title: '代理开户',
          rightStatus: false,
        },
        component: () => import('@/views/agent/agent-register/index.vue'),
      },
      {
        path: 'subordinate-charge',
        name: 'agentSubordinateCharge',
        meta: {
          title: '下级代充',
          rightTitle: '记录',
          tips: { tpl: 'AgentChargeTips' },
          rightGo: { name: 'agentFinancialTable' },
        },
        component: () => import('@/views/agent/subordinate-charge/index.vue'),
      },
      {
        path: 'forget-password',
        name: 'agentForgetPassword',
        meta: {
          title: '找回密码',
        },
        component: () => import('@/views/agent/forget-password/index.vue'),
      },
      {
        path: 'contact-info',
        name: 'agentContactInfo',
        meta: {
          title: '联系方式',
        },
        component: () => import('@/views/agent/contact-info/index.vue'),
      },
      {
        path: 'omit-application',
        name: 'agentOmitApplication',
        meta: {
          title: '遗漏申请',
        },
        component: () => import('@/views/agent/omit-application/index.vue'),
      },
      {
        path: 'personal-information',
        redirect: '/affiliate/center',
      },
      {
        path: 'change-password',
        redirect: '/affiliate/center',
      },
      // {
      //   path: 'landing',
      //   name: 'agentLanding',
      //   meta: {
      //     title: '合营伙伴计划',
      //     layout: false,
      //   },
      //   component: () => import('@/views/agent/landing/index.vue'),
      // },
    ],
  },
];
