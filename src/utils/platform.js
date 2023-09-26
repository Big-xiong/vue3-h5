const GAME_CATE_ID_CASINO = 1
const GAME_CATE_ID_SLOTS = 2
const GAME_CATE_ID_FISHING = 3
const GAME_CATE_ID_LOTTERY = 5
const GAME_CATE_ID_CHESS = 7
const GAME_CATE_ID_SPORTS = 4
const GAME_CATE_ID_ESPORTS = 8
export const casinoPlatforms = [
    {
        default_game_id: 1,
        game_platform_id: 1,
        game_platform_name: "AG",
        game_platform_mark: "亚洲市场占有率第一领导品牌",
        name: 'ag',
        title: 'AG平台',
        thumb: '/src/current_project/assets/images/home/casino/ag@2x.png',
        classname: 'tall',
        desc: ['亚洲市场', '占有率第一领导品牌']
    },
    {
        default_game_id: 15,
        game_platform_id: 3,
        game_platform_name: "BBIN",
        game_platform_mark: "最具影响力真人平台",
        name: 'bbin',
        title: 'BBIN',
        thumb: '/src/current_project/assets/images/home/casino/bbin@2x.png',
        desc: ['最具影响力', '真人平台']
    },
    {
        default_game_id: 2101,
        game_platform_id: 20,
        game_platform_name: "OG",
        game_platform_mark: "贴近亚洲文化市场",
        name: 'og',
        title: 'OG',
        thumb: '/src/current_project/assets/images/home/casino/og@2x.png',
        desc: ['贴近亚洲', '文化市场']
    },
    {
        default_game_id: 14,
        game_platform_id: 4,
        game_platform_name: "ALLBET",
        game_platform_mark: "首创超级多台百家乐",
        name: 'allbet',
        thumb: '/src/current_project/assets/images/home/casino/allbet@2x.png',
        title: 'ALLBET',
        desc: ['首创超级', '多台百家乐']
    },
    {
        default_game_id: 3137,
        game_platform_id: 104,
        game_platform_name: "SunBet",
        game_platform_mark: "互动多合一快感加倍",
        name: 'sunbet',
        thumb: '/src/current_project/assets/images/home/casino/sunbet@2x.png',
        title: 'SunBet平台',
        desc: ['互动多合一', '快感加倍']
    },
    {
        default_game_id: 3158,
        game_platform_id: 105,
        game_platform_name: "EBET",
        game_platform_mark: "互动多合一快感加倍",
        name: 'ebet',
        thumb: '/src/current_project/assets/images/home/casino/ebet@2x.png',
        title: 'eBET',
        desc: []
    },
    // {
    //   default_game_id: 3178,
    //   game_platform_id: 106,
    //   game_platform_name: "GOLD DELUXE",
    //   game_platform_mark: "互动多合一快感加倍",
    //   name: '',
    //   thumb: require('/src/current_project/assets/images/home/casino/gold@2x.png'),
    //   title: '',
    //   desc: []
    // },
    // {
    //   default_game_id: null,
    //   game_platform_id: null,
    //   game_platform_name: "salon",
    //   game_platform_mark: "互动多合一快感加倍",
    //   name: '',
    //   thumb: require('/src/current_project/assets/images/home/casino/salon@2x.png'),
    //   title: '',
    //   desc: []
    // }
]

export const fishingPlatforms10040 = [{
    default_game_id: 12,
    game_platform_id: 31,
    name: 'ag',
    text: 'ag3d',
    thumb: 'ag3d@2x.png',
    esthumb: 'ag3d_es@2x.png',
    title: 'AG捕鱼王3D',
    desc: ['顶级渔场，一炮致富']
}, {
    default_game_id: 620,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin',
    thumb: 'bbin@2x.png',
    esthumb: 'bbin_es@2x.png',
    title: 'BBIN捕鱼大师',
    desc: ['打鱼利器', '一手掌握']
}, {
    default_game_id: 3076,
    game_platform_id: 101,
    name: 'mw',
    text: 'mw',
    thumb: 'mw@2x.png',
    esthumb: 'mw_es@2x.png',
    title: 'MW千炮捕鱼',
    desc: ['最高奖金400倍']
}, {
    default_game_id: 620,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin-dr',
    thumb: 'bbin-dr@2x.png',
    esthumb: 'bbin-dr_es@2x.png',
    title: 'BBIN捕鱼达人',
    desc: ['多样化技能', '快感加倍']
}, {
    default_game_id: 627,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin2',
    thumb: 'bbin2@2x.png',
    esthumb: 'bbin2_es@2x.png',
    title: 'BBIN捕鱼大师2',
    desc: ['万炮齐发', '一网打尽']
}];

export const fishingPlatforms = [{
    default_game_id: 12,
    game_platform_id: 31,
    name: 'ag',
    text: 'ag3d',
    thumb: 'ag3d@2x.png',
    esthumb: 'ag3d_es@2x.png',
    title: 'AG捕鱼王3D',
    desc: ['顶级渔场，一炮致富']
}, {
    default_game_id: 13,
    game_platform_id: 2,
    name: 'gg',
    text: 'gg',
    thumb: 'pt@2x.png',
    esthumb: 'pt@2x.png',
    title: 'GG捕鱼天下',
    desc: ['简易上手', '一炮而红']
}, {
    default_game_id: 12,
    game_platform_id: 31,
    name: 'ag',
    text: 'ag',
    thumb: 'ag@2x.png',
    esthumb: 'ag@2x.png',
    title: 'AG捕鱼王',
    desc: ['四炮同场', '称霸海洋']
}, {
    default_game_id: 627,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin2',
    thumb: 'bbin2@2x.png',
    esthumb: 'bbin2_es@2x.png',
    title: 'BBIN捕鱼大师2',
    desc: ['万炮齐发', '一网打尽']
}, {
    default_game_id: 620,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin',
    thumb: 'bbin@2x.png',
    esthumb: 'bbin_es@2x.png',
    title: 'BBIN捕鱼大师',
    desc: ['打鱼利器', '一手掌握']
}, {
    default_game_id: 620,
    game_platform_id: 3,
    name: 'bbin',
    text: 'bbin-dr',
    thumb: 'bbin-dr@2x.png',
    esthumb: 'bbin-dr_es@2x.png',
    title: 'BBIN捕鱼达人',
    desc: ['多样化技能', '快感加倍']
}, {
    default_game_id: 3076,
    game_platform_id: 101,
    name: 'mw',
    text: 'mw',
    thumb: 'mw@2x.png',
    esthumb: 'mw_es@2x.png',
    title: 'MW千炮捕鱼',
    desc: ['最高奖金400倍']
}, {
    default_game_id: 3110,
    game_platform_id: 102,
    name: 'gg',
    text: 'gg',
    thumb: 'gg@2x.png',
    esthumb: 'gg@2x.png',
    title: 'GG捕鱼天下',
    desc: ['天天捕 天天赢']
}]

export const lotteryPlatforms = [
    // {
    //   default_game_id: 3024,
    //   game_platform_id: 11,
    //   game_platform_name: "LOTTO",
    //   game_platform_mark:
    //     "视讯快开彩，重庆时时彩，山东十一选五，北京PK10，幸运飞艇...",
    //   url: require("@assets/img/home/lottery-0.png"),
    //   url1: require("@assets/img/home/lottery-a-0.png"),
    //   bg: require("@assets/img/home/home_caipiao_pic_1@2x.jpg"),
    //   bgR: require("@assets/img/home/home_caipiao_pic_1register@2x.jpg"),
    // },
    // {
    //   default_game_id: 16,
    //   game_platform_id: 12,
    //   game_platform_name: "丰彩",
    //   game_platform_mark:
    //     "香港六合彩，重庆时时彩，PC蛋蛋，北京PK10，福彩3D",
    //   url: require("@assets/img/home/lottery-1.png"),
    //   url1: require("@assets/img/home/lottery-a-1.png"),
    //   bg: require("@assets/img/home/home_caipiao_pic_2@2x.jpg"),
    //   bgR: require("@assets/img/home/home_caipiao_pic_2register@2x.jpg"),
    // }
    {
        default_game_id: 4393,
        game_platform_id: 121,
        text: 'official',
        name: 'vr',
        thumb: '/src/current_project/assets/images/home/lottery/official@2x.png',
        title: 'VR彩票-官方彩',
        classname: 'tall',
        desc: ['强大的录号系统', '确保第一时间开奖']
    }, {
        default_game_id: 4400,
        game_platform_id: 121,
        text: 'mark-six',
        name: 'vr',
        thumb: '/src/current_project/assets/images/home/lottery/mark-six@2x.png',
        title: 'VR彩票-六合彩',
        desc: ['标准/双面玩法', '各类生肖玩法齐全']
    }, {
        default_game_id: 4379,
        game_platform_id: 121,
        text: 'vr',
        name: 'vr',
        thumb: '/src/current_project/assets/images/home/lottery/vr@2x.png',
        title: 'VR彩票-VR彩',
        desc: ['美女主播靓', '开彩赢']
    }, {
        default_game_id: 4421,
        game_platform_id: 122,
        name: 'sg',
        text: 'sg',
        thumb: '/src/current_project/assets/images/home/lottery/sg@2x.png',
        title: 'SG-Win 双赢彩票',
        desc: ['以小博大', '创造双赢']
    }, {
        default_game_id: 4338,
        game_platform_id: 120,
        name: 'ig',
        text: 'ig',
        thumb: '/src/current_project/assets/images/home/lottery/ig@2x.png',
        title: 'IG彩票',
        desc: ['实现您对彩票', '的所有期望']
    }
]


export const hotLotteryGames = [
    {
        default_game_id: 4409,
        game_platform_id: 121,
        title: '腾讯分分彩',
        name: 'vr',
        thumb: 'cp_tx@2x.png'
    },
    {
        default_game_id: 4393,
        game_platform_id: 121,
        title: '重庆时时彩',
        name: 'vr',
        thumb: 'cp_ssc@2x.png'
    },
    {
        default_game_id: 4397,
        game_platform_id: 121,
        title: '北京赛车',
        name: 'vr',
        thumb: 'cp_sc@2x.png'
    },
    {
        default_game_id: 4400,
        game_platform_id: 121,
        title: '香港六合彩',
        name: 'vr',
        thumb: 'cp_lhc@2x.png'
    },
    {
        default_game_id: 4399,
        game_platform_id: 121,
        title: '幸运28',
        name: 'vr',
        thumb: 'cp_xy28@2x.png'
    },
    {
        default_game_id: 4346,
        game_platform_id: 121,
        title: '幸运飞艇',
        name: 'vr',
        thumb: 'cp_ft@2x.png'
    },
    {
        default_game_id: 4383,
        game_platform_id: 121,
        title: 'VR彩票百家乐',
        name: 'vr',
        thumb: 'cp_vrdjl@2x.png'
    },
    {
        default_game_id: 4422,
        game_platform_id: 121,
        title: '澳洲幸运彩',
        name: 'vr',
        thumb: 'cp_az@2x.png'
    }
]

export const esportsPlatforms = [
    {
        default_game_id: 17,
        game_platform_id: 28,
        game_platform_name: "AVIA泛亚电竞",
        game_platform_mark: "聚焦全球经典赛事，最佳线上电竞平台",
        name: 'avia',
        thumb: '/src/current_project/assets/images/home/esports/avia@2x.png',
        title: 'AVIA电竞',
        desc: ['全球顶级赛事', '为战队加油助威']
    },
    {
        default_game_id: 4224,
        game_platform_id: 118,
        name: 'esb',
        thumb: '/src/current_project/assets/images/home/esports/im@2x.png',
        title: 'IM电竞',
        desc: ['尖端全面多元的', '电竞游戏']
    }
    // {
    //   default_game_id: 17,
    //   game_platform_id: 28,
    //   game_platform_name: "英雄联盟",
    //   game_platform_mark: "2019最新最全赛事竞猜",
    //   url: require("@assets/img/home/game-1.png"),
    //   bg: require("@assets/img/home/home_dianjing_pic_2@2x.jpg"),
    //   bgR: require("@assets/img/home/home_dianjing_pic_2register@2x.jpg"),
    // },
    // {
    //   default_game_id: 17,
    //   game_platform_id: 28,
    //   game_platform_name: "王者荣耀",
    //   game_platform_mark: "巅峰对决，为您的战队加油助威",
    //   url: require("@assets/img/home/game-2.png"),
    //   bg: require("@assets/img/home/home_dianjing_pic_3@2x.jpg"),
    //   bgR: require("@assets/img/home/home_dianjing_pic_3register@2x.jpg"),
    // },
    // {
    //   default_game_id: 17,
    //   game_platform_id: 28,
    //   game_platform_name: "DOTA2",
    //   game_platform_mark: "冠军之旅不成停歇",
    //   url: require("@assets/img/home/game-1.png"),
    //   bg: require("@assets/img/home/home_dianjing_pic_4@2x.jpg"),
    //   bgR: require("@assets/img/home/home_dianjing_pic_4register@2x.jpg"),
    // }
]


export const hotGamesSport = [
    {
        default_game_id: 1514,
        game_platform_id: 13,
        title: '足球',
        name: 'ibc',
        thumb: 'zq@2x.png'
    },
    {
        default_game_id: 1515,
        game_platform_id: 13,
        title: '篮球',
        name: 'ibc',
        thumb: 'lq@2x.png'
    },
    {
        default_game_id: 1524,
        game_platform_id: 13,
        title: 'F1赛车',
        name: 'ibc',
        thumb: 'F1@2x.png'
    },
    {
        default_game_id: 1522,
        game_platform_id: 13,
        title: '羽毛球',
        name: 'ibc',
        thumb: 'ymq@2x.png'
    },
    {
        default_game_id: 1518,
        game_platform_id: 13,
        title: '网球',
        name: 'ibc',
        thumb: 'wq@2x.png'
    },
    {
        default_game_id: 1529,
        game_platform_id: 13,
        title: '拳击',
        name: 'ibc',
        thumb: 'qj@2x.png'
    },
    {
        default_game_id: 1519,
        game_platform_id: 13,
        title: '排球',
        name: 'ibc',
        thumb: 'pq@2x.png'
    },
    {
        default_game_id: 1538,
        game_platform_id: 13,
        title: '飞镖',
        name: 'ibc',
        thumb: 'fb@2x.png'
    },
    {
        default_game_id: 1531,
        game_platform_id: 13,
        title: '乒乓球',
        name: 'ibc',
        thumb: 'bpq@2x.png'
    },
    {
        default_game_id: 1520,
        game_platform_id: 13,
        title: '台球',
        name: 'ibc',
        thumb: 'tq@2x.png'
    },
    {
        default_game_id: 1523,
        game_platform_id: 13,
        title: '高尔夫',
        name: 'ibc',
        thumb: 'grf@2x.png'
    },
    {
        // default_game_id: 1523,
        // game_platform_id: 13,
        title: '滑雪',
        name: 'ibc',
        thumb: 'hx@2x.png'
    }
]


export const sportsPlatforms = [
    {
        default_game_id: 4223,
        game_platform_id: 117,
        text: 'im',
        name: 'imsb',
        thumb: '/src/current_project/assets/images/home/sports/im@2x.png',
        recommend: true,
        title: 'IM体育',
        desc: ['满足亚洲', '体育会员喜好']
    },
    {
        default_game_id: 18,
        game_platform_id: 13,
        game_platform_name: "沙巴体育",
        game_platform_mark: "超多盘口，亚洲市占率第一",
        text: 'shaba',
        name: 'ibc',
        thumb: '/src/current_project/assets/images/home/sports/shaba@2x.png',
        title: '沙巴体育',
        desc: ['超多盘口', '亚洲市占率第一']
    },
    {
        default_game_id: 611,
        game_platform_id: 3,
        game_platform_name: "BB体育",
        game_platform_mark: "赛事直播，快速结算满足亚洲体育会员喜好",
        text: 'bbin',
        name: 'bbin',
        thumb: '/src/current_project/assets/images/home/sports/bbin@2x.png',
        title: 'BBIN体育',
        desc: ['赛事直播', '快速结算']
    },
]

export const sportsPlatforms10040 = [
    {
        default_game_id: 18,
        game_platform_id: 13,
        game_platform_name: "沙巴体育",
        game_platform_mark: "每月超过1500场滚球赛事，多元竞猜，多样赛事，应有尽有！",
        text: 'shaba',
        name: 'ibc',
        thumb: 'common/aGsports.2758f0f3',
        title: '沙巴体育',
        desc: ['每月超过1500场滚球赛事', '多元竞猜，多样赛事，应有尽有！']
    },
    {
        default_game_id: 4223,
        game_platform_id: 117,
        text: 'im',
        name: 'imsb',
        thumb: 'common/sabah.60c41894',
        title: 'IM体育',
        desc: ['满足亚洲体育会员喜好',]
    },
    {
        default_game_id: 611,
        game_platform_id: 3,
        game_platform_name: "BB体育",
        game_platform_mark: "赛事直播，快速结算",
        text: 'bbin',
        name: 'bbin',
        thumb: 'common/bbin',
        title: 'BBIN体育',
        desc: ['赛事直播快速结算']
    }
]

export const sportsPlatformsBall = [
    {
        default_game_id: 4223,
        game_platform_id: 117,
        text: 'im',
        name: 'imsb',
        thumb: '@/assets/common/img/home/im@2x-index.png',
        title: 'IM体育',
        desc: ['满足亚洲', '体育会员喜好']
    },
    {
        default_game_id: 18,
        game_platform_id: 13,
        game_platform_name: "沙巴体育",
        game_platform_mark: "超多盘口，亚洲市占率第一",
        text: 'shaba',
        name: 'ibc',
        thumb: '@/assets/common/img/home/shaba@2x-index.png',
        title: '沙巴体育',
        desc: ['超多盘口', '亚洲市占率第一']
    }
]

export const hotGames10040 = [
    {
        default_game_id: 1,
        game_platform_id: 1,
        game_platform_name: "AG",
        game_platform_mark: "亚洲市场占有率第一领导品牌",
        text: 'ag',
        name: 'ag',
        type: '真人',
        thumb: 'home/casino-ag@2x',
        title: 'AG平台',
        desc: ['亚洲市场', '占有率第一领导品牌']
    }, {
        default_game_id: 3026,
        game_platform_id: 29,
        text: 'chess',
        name: 'wq',
        type: '棋牌',
        thumb: 'home/chess-wanqu@2x',
        title: '万趣棋牌',
        desc: ['万人在线', '抢庄对弈其乐无穷']
    }, {
        default_game_id: 3990,
        game_platform_id: 116,
        text: 'slots',
        name: 'pt',
        type: '电子',
        thumb: 'home/slots-pt@2x',
        title: 'PT电子',
        active: 2,
        desc: ['超多精品游戏', '亿万奖池爆不停']
    }
];

export const hotGames = [{
    default_game_id: 1,
    game_platform_id: 1,
    game_platform_name: "AG",
    game_platform_mark: "亚洲市场占有率第一领导品牌",
    text: 'ag',
    name: 'ag',
    type: '真人',
    thumb: '/src/current_project/assets/images/home/casino-ag@2x.png',
    title: 'AG平台',
    desc: ['亚洲市场', '占有率第一领导品牌']
}, {
    default_game_id: 3026,
    game_platform_id: 29,
    text: 'chess',
    name: 'wq',
    type: '棋牌',
    thumb: '/src/current_project/assets/images/home/chess-wanqu@2x.png',
    title: '万趣棋牌',
    desc: ['万人在线', '抢庄对弈其乐无穷']
}, {
    default_game_id: 3990,
    game_platform_id: 116,
    text: 'slots',
    name: 'pt',
    type: '电子',
    thumb: '/src/current_project/assets/images/home/slots-pt@2x.png',
    title: 'PT电子',
    active: 2,
    desc: ['超多精品游戏', '亿万奖池爆不停']
}, {
    default_game_id: 4379,
    game_platform_id: 121,
    name: 'vr',
    text: 'vr',
    type: '彩票',
    thumb: '/src/current_project/assets/images/home/lottery-vr@2x.png',
    title: 'VR彩票',
    desc: ['真人视讯开奖', '玩法多样赔率高']
}, {
    default_game_id: 18,
    game_platform_id: 13,
    game_platform_name: "沙巴体育",
    game_platform_mark: "超多盘口，亚洲市占率第一",
    name: 'ibc',
    text: 'shaba',
    type: '体育',
    thumb: '/src/current_project/assets/images/home/sports-shaba@2x.png',
    title: '沙巴体育',
    desc: ['超多盘口', '亚洲市场占率第一']
}, {
    default_game_id: 17,
    game_platform_id: 28,
    name: 'avia',
    text: 'avia',
    type: '电竞',
    thumb: '/src/current_project/assets/images/home/gaming-avia@2x.png',
    title: 'AVIA电竞',
    desc: ['全球顶尖赛事', '为战队加油助威']
}, {
    default_game_id: 12,
    game_platform_id: 31,
    game_platform_name: "AG捕鱼王",
    game_platform_mark: "四炮同场，称霸海洋",
    name: 'ag',
    text: 'fishing',
    type: '捕鱼',
    thumb: '/src/current_project/assets/images/home/fishing-ag@2x.png',
    title: 'AG捕鱼王',
    desc: ['顶级渔场', '一炮致富']
}]

export const chessPlatforms = [{
    default_game_id: 3026,
    game_platform_id: 29,
    name: 'wq',
    title: '万趣棋牌',
    thumb: '/src/current_project/assets/images/home/chess/wq@2x.png',
    hide: ['10046']
}, {
    default_game_id: 3006,
    game_platform_id: 27,
    name: '3k',
    title: '3K棋牌',
    thumb: '/src/current_project/assets/images/home/chess/3k@2x.png',
}, {
    default_game_id: 3052,
    game_platform_id: 22,
    name: 'ky',
    title: '开元棋牌',
    thumb: '/src/current_project/assets/images/home/chess/ky@2x.png',
}, {
    default_game_id: 1585,
    game_platform_id: 14,
    name: 'gg',
    title: 'GG棋牌',
    thumb: '/src/current_project/assets/images/home/chess/gg@2x.png',
    hide: ['10046']
}, {
    default_game_id: 1917,
    game_platform_id: 17,
    name: 'mw',
    title: 'MW棋牌',
    thumb: '/src/current_project/assets/images/home/chess/mw@2x.png',
}, {
    default_game_id: 4458,
    game_platform_id: 123,
    name: 'ly',
    title: 'LE YOU棋牌',
    thumb: '/src/current_project/assets/images/home/chess/le you@2x.png',
}, {
    default_game_id: 4555,
    game_platform_id: 127,
    name: 'mt',
    title: 'MEI TIAN棋牌',
    thumb: '/src/current_project/assets/images/home/chess/mt@2x.png',
}, {
    default_game_id: 4599,
    game_platform_id: 128,
    name: 'isg',
    title: 'IM SG WIN棋牌',
    thumb: '/src/current_project/assets/images/home/chess/im sg win@2x.png',
    hide: ['10046']
}, {
    default_game_id: 4517,
    game_platform_id: 125,
    name: 'vg',
    title: 'VG棋牌',
    thumb: '/src/current_project/assets/images/home/chess/vg@2x.png',
},
// {
//   default_game_id: 4537,
//   game_platform_id: 126,
//   name: 'tf',
//   title: 'TF棋牌',
//   thumb: require('/src/current_project/assets/images/home/chess/as@2x.png'),
// },
// {
//   default_game_id: 1585,
//   game_platform_id: 14,
//   name: 'z88',
//   title: 'Z88棋牌',
//   thumb: require('/src/current_project/assets/images/home/chess/z88@2x.png'),
// },
    {
        default_game_id: 4618,
        game_platform_id: 129,
        name: 'lg',
        title: 'LUCKY GAMING',
        thumb: '/src/current_project/assets/images/home/chess/lucky gaming@2x.png',
    }, {
        default_game_id: 4637,
        game_platform_id: 130,
        name: 'img',
        title: 'IM GAMING',
        thumb: '/src/current_project/assets/images/home/chess/im@2x.png',
    }]

export const chessPlatformsHg = [
    {
        default_game_id: 3026,
        game_platform_id: 29,
        name: "WQ",
        title: "WQ",
        thumb: "/src/current_project/assets/images/home/chess/wq@2x.png",
        hide: ["10046"],
    },
    {
        default_game_id: 3006,
        game_platform_id: 27,
        name: "3k",
        title: "3K",
        thumb: "/src/current_project/assets/images/home/chess/3k@2x.png",
    },
    {
        default_game_id: 3052,
        game_platform_id: 22,
        name: "KY",
        title: "KY",
        thumb: "/src/current_project/assets/images/home/chess/ky@2x.png",
    },
    {
        default_game_id: 1585,
        game_platform_id: 14,
        name: "GG",
        title: "GG",
        thumb: "/src/current_project/assets/images/home/chess/gg@2x.png",
        hide: ["10046"],
    },
    {
        default_game_id: 1917,
        game_platform_id: 17,
        name: "mw",
        title: "MW",
        thumb: "/src/current_project/assets/images/home/chess/mw@2x.png",
    },
    {
        default_game_id: 4555,
        game_platform_id: 127,
        name: "MT",
        title: "MT",
        thumb: "/src/current_project/assets/images/home/chess/mt@2x.png",
    },
    {
        default_game_id: 4458,
        game_platform_id: 123,
        name: "LG",
        title: "LG",
        thumb: "/src/current_project/assets/images/home/chess/le you@2x.png",
    },
    {
        default_game_id: 4637,
        game_platform_id: 130,
        name: "IMG",
        title: "IMG",
        thumb: "/src/current_project/assets/images/home/chess/im@2x.png",
    },
    {
        default_game_id: 4517,
        game_platform_id: 125,
        name: "vg",
        title: "VG",
        thumb: "/src/current_project/assets/images/home/chess/vg@2x.png",
    },
    {
        default_game_id: 4618,
        game_platform_id: 129,
        name: "LUCKY",
        title: "LUCKY",
        thumb: "/src/current_project/assets/images/home/chess/lucky gaming@2x.png",
    },
    {
        default_game_id: 4599,
        game_platform_id: 128,
        name: "SG WIN",
        title: "SG WIN",
        thumb: "/src/current_project/assets/images/home/chess/im sg win@2x.png",
        hide: ["10046"],
    },
]

export const chobetIndex = [{
    default_game_id: 18,
    game_platform_id: 13,
    game_platform_name: "沙巴体育",
    game_platform_mark: "超多盘口，亚洲市占率第一",
    name: 'ibc',
    text: 'shaba',
    type: '体育',
    thumb: '@/assets/common/img/home/sports-shaba@2x.png',
    title: '沙巴体育',
    desc: ['超多盘口', '亚洲市场占率第一']
}, {
    default_game_id: 4223,
    game_platform_id: 117,
    game_platform_name: "IM体育",
    game_platform_mark: "满足亚洲体育 会员爱好",
    name: 'imsb',
    text: 'im',
    type: '体育',
    thumb: '@/assets/common/img/home/sports-im@2x.png',
    title: 'IM体育',
    desc: ['满足亚洲体育', '会员爱好']
}, {
    default_game_id: 611,
    game_platform_id: 3,
    game_platform_name: "BBIN体育",
    game_platform_mark: "赛事直播，快速结算",
    name: 'bbin',
    text: 'bbin',
    type: '体育',
    thumb: '@/assets/common/img/home/sports-bbin@2x.png',
    title: 'BBIN体育',
    desc: ['赛事直播', '快速结算']
}, {
    default_game_id: 1,
    game_platform_id: 1,
    game_platform_name: "AG",
    game_platform_mark: "亚洲市场占有率第一领导品牌",
    text: 'ag',
    name: 'ag',
    type: '真人',
    thumb: '@/assets/common/img/home/casino-ag@2x.png',
    title: 'AG平台',
    desc: ['亚洲市场', '占有率第一领导品牌']
}, {
    default_game_id: 3026,
    game_platform_id: 29,
    text: 'chess',
    name: 'wq',
    type: '棋牌',
    thumb: '@/assets/common/img/home/chess-wanqu@2x.png',
    title: '万趣棋牌',
    desc: ['万人在线', '抢庄对弈其乐无穷']
}, {
    default_game_id: 4224,
    game_platform_id: 118,
    text: 'esb',
    name: 'esb',
    type: '电竞',
    thumb: '@/assets/common/img/home/esports-im@2x.png',
    title: 'IM电竞',
    desc: ['尖端全面多元的', '电竞游戏']
}]

export default [
    {
        game_cate_id: GAME_CATE_ID_CASINO,
        game_cate_name: "真人",
        platform_list: casinoPlatforms
    },
    {
        game_cate_id: GAME_CATE_ID_FISHING,
        game_cate_name: "捕鱼",
        platform_list: fishingPlatforms
    },
    {
        game_cate_id: GAME_CATE_ID_LOTTERY,
        game_cate_name: "彩票",
        platform_list: lotteryPlatforms
    },
    {
        game_cate_id: GAME_CATE_ID_ESPORTS,
        game_cate_name: "电竞",
        platform_list: esportsPlatforms
    },
    {
        game_cate_id: GAME_CATE_ID_SPORTS,
        game_cate_name: "体育",
        platform_list: sportsPlatforms
    },
    {
        game_cate_id: GAME_CATE_ID_CHESS,
        game_cate_name: "棋牌",
        platform_list: chessPlatforms
    }
]
