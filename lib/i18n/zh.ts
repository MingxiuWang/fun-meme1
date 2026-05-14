import type { Dictionary } from "./types";

const zh: Dictionary = {
  htmlLang: "zh-Hans",
  langLabel: "中",
  switchTo: "EN",

  nav: {
    brandA: "大学",
    brandB: "必拉榜",
    tagline: "/ 抽象校园厕所图鉴",
    submit: "+ 提名一坑",
  },

  home: {
    titleA: "大学",
    titleB: "必拉榜",
    blurb:
      "全民众包,记录每一间值得蹲(或值得逃离)的大学厕所。1–10 打分,均分定生死。蹲下是学生,站起是哲学家。免登录,免审判(除了厕所)。",
    bathroomCount: (n) => `${n} 个坑位`,
    voteCount: (n) => `${n} 票`,
    addOne: "提名一个 →",
    emptyTitle: "暂无坑位。",
    emptyBody: '做第一个提名 "封神之坑" 或 "生化现场" 的人吧。',
    emptyCta: "提交第一坑",
    rowEmpty: "空缺 —— 等你提名",
  },

  countdown: {
    headline: "投票第一名和最后一名的厕所我将亲自探访",
    daysLeftTemplate: "还剩 {n} 天截止投票",
    ended: "投票已结束,朝圣启程中。",
    daysLabel: "天",
    hoursLabel: "时",
    minutesLabel: "分",
    secondsLabel: "秒",
    progressLabel: "进度",
  },

  tiers: {
    S: "封神之坑 —— 蹲此悟道",
    A: "下次还来,绝不嘴硬",
    B: "中规中矩,挑不出毛病",
    C: "勉强能蹲,凑合凑合",
    D: "万不得已,憋到极限",
    F: "生化现场 —— 建议拆楼重盖",
  },

  scoreFlair: {
    1: "蚌埠住了",
    2: "祖坟冒烟",
    3: "麻了",
    4: "破防",
    5: "可",
    6: "还行",
    7: "顶",
    8: "嘎嘎好",
    9: "封神预备",
    10: "封神",
  },

  submit: {
    back: "← 返回必拉榜",
    title: "提名一个坑位",
    intro: "把一坑加入榜单 —— 你的评分将开启它的均分。整点抽象的。",
    nameLabel: "厕所名 / 外号 *",
    namePlaceholder: '例如 "六教蹲式黄金屋"',
    schoolLabel: "学校 / 大学 *",
    schoolPlaceholder: "例如 北京大学",
    buildingLabel: "教学楼",
    buildingPlaceholder: "例如 第六教学楼",
    floorLabel: "楼层 / 位置",
    floorPlaceholder: "例如 三楼西厕",
    descLabel: "氛围 / 描述",
    descPlaceholder: "描述一下气氛。能多抽象就多抽象。",
    coverImageLabel: "封面图",
    coverImageHint: "榜单卡片主视觉。JPG/PNG/WEBP,单张不超过 8MB。",
    contentImagesLabel: "内容图(最多 8 张)",
    contentImagesHint: "一张一张加。详情页图廊会按你添加的顺序展示。",
    addImageButton: "+ 再加一张",
    removeImageButton: "移除",
    imageCountTemplate: "已添加 {n}/8",
    ratingLabel: "你的评分 *",
    reviewLabel: "锐评(可选)",
    reviewPlaceholder: '"蹲下是大学生,站起是哲学家。" 告诉我们你看到了啥。',
    submit: "提交并锐评 🚽",
    submitting: "提交中…",
  },

  detail: {
    back: "← 返回必拉榜",
    tierBadge: "评级",
    voteHeading: "投出你神圣的一票",
    reviewsHeading: "锐评",
    noReviews: "暂无文字锐评。",
    yourRating: "你的评分",
    leaveReview: "留下锐评(可选)",
    reviewPlaceholder: "蹲完心情如何?",
    vote: "投票",
    voting: "投票中…",
    voteRecorded: "投票已记,冲水已计。",
    alreadyVoted: "这一坑你已经投过了。",
    galleryEmpty: "暂无实拍。",
    likeAction: "👍 顶",
    unlikeAction: "👍 已顶",
  },

  footer: {
    left: "为人民服务,合理冲水。",
    right: "免登录,免审判(除了厕所)。",
  },
};

export default zh;
