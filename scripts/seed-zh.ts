import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });
import { db } from "../lib/db/client";
import { bathrooms, votes } from "../lib/db/schema";

const seed: Array<{
  bathroom: typeof bathrooms.$inferInsert;
  votes: Array<{ score: number; review?: string }>;
}> = [
  {
    bathroom: {
      name: "六教蹲式黄金屋",
      school: "清华大学",
      building: "第六教学楼",
      floor: "三楼",
      description: "学霸蹲坑悟道之地。蹲下去清华梦,站起来已秃。",
      language: "zh",
    },
    votes: [
      { score: 10, review: "蹲到忘记自己挂了几科,封神。" },
      { score: 9, review: "纸不够,但灯光氛围满分。" },
      { score: 9 },
    ],
  },
  {
    bathroom: {
      name: "燕园通天厕",
      school: "北京大学",
      building: "图书馆",
      floor: "顶层",
      description: "蹲此可观未名湖之波光,可见博雅塔之倒影。学神蹲位。",
      language: "zh",
    },
    votes: [
      { score: 10, review: "蹲完悟了三个真理。" },
      { score: 8, review: "风景拉满,但纸有点少。" },
    ],
  },
  {
    bathroom: {
      name: "邯郸学步坑",
      school: "复旦大学",
      building: "光华楼",
      floor: "三楼",
      description: "进去时是大学生,出来时是哲学家。",
      language: "zh",
    },
    votes: [
      { score: 8, review: "蹲完发现期末没救了,但坑位本身没毛病。" },
      { score: 7 },
      { score: 9, review: "氛围拉满,但隔壁老哥手机外放抖音,扣一分。" },
    ],
  },
  {
    bathroom: {
      name: "电院深夜禁忌厕所",
      school: "上海交通大学",
      building: "电子信息学院",
      floor: "B1",
      description: "凌晨三点工科男的最后避难所。地下灯泡只剩两个。",
      language: "zh",
    },
    votes: [
      { score: 4, review: "灯一闪我以为见鬼了,蚌埠住了。" },
      { score: 3, review: "祖坟冒烟级。" },
    ],
  },
  {
    bathroom: {
      name: "樱顶望湖大厕",
      school: "武汉大学",
      building: "樱顶",
      floor: "顶层",
      description: "春天蹲坑赏樱花,秋天蹲坑落叶纷飞,人生圆满。",
      language: "zh",
    },
    votes: [
      { score: 9, review: "封神预备,差点哭出来。" },
      { score: 10, review: "蹲完出来就脱单了,真的封神。" },
      { score: 9 },
    ],
  },
  {
    bathroom: {
      name: "紫金港地下迷宫厕所",
      school: "浙江大学",
      building: "教学楼",
      floor: "B2",
      description: "找厕所比找路还难。找到的人都成了浙大传说。",
      language: "zh",
    },
    votes: [
      { score: 5, review: "找了二十分钟,差点拉裤里。" },
      { score: 6 },
      { score: 5, review: "迷路三次,但坑位本身还行。" },
    ],
  },
  {
    bathroom: {
      name: "明德楼禁忌之厕",
      school: "中国人民大学",
      building: "明德楼",
      description: "据说蹲超过30分钟会迷失自我。蹲过的人不愿再提。",
      language: "zh",
    },
    votes: [
      { score: 6, review: "蹲了40分钟,我还是我,但我已经不是我了。" },
      { score: 7 },
    ],
  },
  {
    bathroom: {
      name: "理学楼三楼禁忌坑位",
      school: "南方科技大学",
      building: "理学院",
      floor: "三楼",
      description: "实验室狗的避难所。隔音奇佳,适合崩溃。",
      language: "zh",
    },
    votes: [
      { score: 8, review: "在这里哭过三次,过审了。" },
      { score: 7, review: "崩溃专用,推荐。" },
    ],
  },
];

async function main() {
  console.log("🚽 Seeding 大学必拉榜 — 中文坑位...");
  for (const entry of seed) {
    const [inserted] = await db
      .insert(bathrooms)
      .values(entry.bathroom)
      .returning({ id: bathrooms.id });
    for (const v of entry.votes) {
      await db.insert(votes).values({
        bathroomId: inserted.id,
        score: v.score,
        review: v.review,
      });
    }
    console.log(`  ✓ ${entry.bathroom.name} @ ${entry.bathroom.school} (${entry.votes.length} 票)`);
  }
  console.log("✅ 必拉榜中文坑位录入完毕。");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
