import type { Dictionary } from "./types";

const zh: Dictionary = {
  htmlLang: "zh-Hans",
  langLabel: "中",
  switchTo: "EN",

  nav: {
    brandA: "屎之",
    brandB: "王",
    tagline: "/ 大学厕所排行榜",
    submit: "+ 提交一个厕所",
  },

  home: {
    titleA: "大学厕所",
    titleB: "排行榜",
    blurb:
      "众包评分,覆盖每一间值得一去的校园厕所(还有一些应该被推平的)。1–10 打分——平均分决定等级。免登录,绝不留情。",
    bathroomCount: (n) => `${n} 间厕所`,
    voteCount: (n) => `${n} 票`,
    addOne: "添加一个 →",
    emptyTitle: "暂无厕所。",
    emptyBody: "来做第一个提名瓷器王座(或战犯现场)的人吧。",
    emptyCta: "提交第一个",
    rowEmpty: "空缺 —— 来提名一个",
  },

  tiers: {
    S: "瓷器王座 —— 一冲改变人生",
    A: "下次还会再来",
    B: "体面,无可挑剔",
    C: "马马虎虎,能装水",
    D: "实在憋不住再用",
    F: "生化危机,建议拆楼。",
  },

  scoreFlair: {
    1: "战犯级",
    2: "生化危机",
    3: "勉强能用",
    4: "存疑",
    5: "中规中矩",
    6: "还行吧",
    7: "靠谱",
    8: "相当不错",
    9: "顶级",
    10: "瓷器王座",
  },

  submit: {
    back: "← 返回排行榜",
    title: "提交一个厕所",
    intro: "把一间新厕所加入榜单 —— 你的评分将开启它的平均分。",
    nameLabel: "厕所名称 / 外号 *",
    namePlaceholder: '例如 "三楼臭气坑"',
    schoolLabel: "学校 / 大学 *",
    schoolPlaceholder: "例如 北京大学",
    buildingLabel: "教学楼",
    buildingPlaceholder: "例如 一教",
    floorLabel: "楼层 / 位置",
    floorPlaceholder: "例如 三楼西侧",
    descLabel: "氛围 / 描述",
    descPlaceholder: "描述一下气氛。说实话。",
    ratingLabel: "你的评分 *",
    reviewLabel: "简短评论(可选)",
    reviewPlaceholder: '"柔和的灯光,残酷的真相。"告诉我们你看到了什么。',
    submit: "提交并评分 🚽",
    submitting: "提交中…",
  },

  detail: {
    back: "← 返回排行榜",
    tierBadge: "等级",
    voteHeading: "投出你的一票",
    reviewsHeading: "评论",
    noReviews: "还没有评论。",
    yourRating: "你的评分",
    leaveReview: "留下评论(可选)",
    reviewPlaceholder: "你的体验如何?",
    vote: "投票",
    voting: "投票中…",
    voteRecorded: "投票已记录。冲水已计。",
  },

  footer: {
    left: "为人民而做。请合理冲水。",
    right: "免登录。不评判任何人(除了厕所)。",
  },
};

export default zh;
