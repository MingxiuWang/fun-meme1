---
title: 我是怎么和AI一起做出"大学必拉榜"的
subtitle: 一次从零到上线、写了零行代码的协作记录
---

# 我是怎么和AI一起做出"大学必拉榜"的

> 一次从零到上线、写了零行代码的协作记录

## 一、起点:一个抽象的念头

事情的开头很简单。我打开 Claude Code,扔过去一句话:

> "我想做一个搞笑的 meme 项目,关于评测每个大学的厕所,做成 tier list。不要登录功能。"

就这一句。没有产品文档、没有 UI mock、没有技术选型。

AI 没有立刻动手,而是反问了两个关键问题:

- 这个 tier list,是用户投票自动生成,还是发布者直接选?
- 数据存哪里?本地 JSON 文件、Neon Postgres,还是 Upstash Redis?

我选了"众包投票 + Neon Postgres"。然后 AI 就开始干活了。

## 二、几分钟,一个能跑的雏形

接下来发生的事让我有点震撼。AI 在几分钟内自动:

- Scaffold 了 Next.js 16 + Tailwind v4 + shadcn/ui
- 设计了 Drizzle ORM 的 schema:`bathrooms` 表 + `votes` 表
- 写了 6 个 tier(S~F),每个 tier 一句拽拽的 slogan(英文版:"porcelain throne — life-changing flush" / "biohazard. condemn the building.")
- 加了 1~10 分的 ScorePicker,带情绪标签
- 全部走 Server Actions,不写 API 路由

整个过程我只回答了两个问题。代码、文件结构、组件拆分、类型定义全是 AI 自己设计的。

## 三、GitHub:一次关于身份的拉扯

代码要推到 GitHub。一开始我建了一个 alias 账号,因为不太想让认识的人查到我做了个评测厕所的玩意儿。

结果第一次推送就 403 —— 用的还是常用账号的 git 凭证。

AI 一步一步引导我:

- 用 fine-grained PAT 而不是 classic
- 不要把 token 写进 `.git/config`(用临时 credential helper)
- 因为已有的两个 commit 还是用常用账号签名的,要重写 author,再 force push

整个过程中,我中途随手把 token 贴到了对话里。AI 立刻提醒我:

> "这条 token 已经在聊天记录里了,先去 revoke,然后重新生成一个,通过环境变量传给我用,别再贴进来。"

它还指点我把 token 放在 `~/.zshenv`(对所有 shell 生效)而不是 `~/.zshrc`(只对交互式 shell 生效),并且提醒我 `~/.zshrc` 在 Claude Code 启动的非交互 shell 里加载不到。

最后我反悔了一次,决定换个账号推。AI 顺手把 commit author 改了,用了 GitHub 的 noreply 邮箱格式 `{id}+{username}@users.noreply.github.com`,既能链回 profile,又不暴露真实邮箱。

## 四、部署:第一次踩坑

push 完接到 Vercel。第一次访问页面:

> **This page couldn't load. A server error occurred. Reload to try again.**

AI 一查就知道:`vercel env ls` 是空的 —— Neon 没装,`DATABASE_URL` 不存在。我以为我点过那个按钮了,实际没成。

AI 用一行 CLI 命令 `vercel integration add neon` 直接装好了 Neon,自动 provision、自动连接项目、自动把 env 拉到 `.env.local`。然后又顺手帮我修了两个小坑:

- `drizzle-kit` 默认只读 `.env` 不读 `.env.local`
- `drizzle-kit push` 在非 TTY(像 CI 或 agent shell)下会报错,需要 `--force`

接着 `pnpm db:push && pnpm db:seed`,7 个种子厕所进库,刷新页面 —— 出来了。

## 五、改 URL:再藏一次身份

新部署的 URL 是 `kingofshit-{team-slug}-projects.vercel.app`,Vercel 默认会把账号 slug 拼进二级域名里,太显眼。AI 给了两个方案:

- **重命名整个 Vercel team slug** —— 影响账号下所有项目
- **加一个干净的 `.vercel.app` 子域名** —— 只影响这一个项目

我选了后者。AI 直接 `vercel domains add king-of-shit.vercel.app`,30 秒搞定。

现在它住在:<https://king-of-shit.vercel.app>

## 六、加中文:一次完整的国际化重构

然后我说:加个中文版,让中国人也能用。

AI 没有偷懒,直接读了 `node_modules/next/dist/docs/` 里的官方文档(因为我在 `AGENTS.md` 提前警告过它:"这版 Next.js 和你训练数据里的不一样"),确认了 Next.js 16 的几个关键变化:

- `middleware.ts` 已经改名叫 `proxy.ts`
- 推荐用 `app/[lang]/` 路由结构 + `generateStaticParams`
- dictionary 文件要标 `import "server-only"`

然后它:

- 把所有页面挪到 `app/[lang]/` 下
- 写了 `proxy.ts`,根据 cookie 或浏览器的 `Accept-Language` 自动跳转到 `/en` 或 `/zh`
- 写了 `lib/i18n/{en,zh,types,index}.ts`,完整类型化的字典
- 加了 `LocaleSwitcher` 按钮,记录用户选择
- 调整 server actions 让 redirect 带上 locale

中途撞了一个 React Server Component 不能向 Client Component 传函数的坑(因为 dict 里有个 `scorePicker.suffix(n, flair) => string`)。AI 直接定位、删函数、把格式 inline 到组件里,build 就过了。

## 七、搞抽象:最后的灵魂注入

部署完了,EN/ZH 都能跑。我看了眼中文版,觉得不够味,提了最后一条:

> "名字改为'大学必拉榜',多加一些恶搞元素,加点中国学校。这个网站主要是搞抽象的,不要背离主旨。"

AI 立刻懂了。"抽象"在中文互联网语境里不是字面意思,是一种风格 —— 蚌埠住了、麻了、破防、封神、祖坟冒烟、典中典。

它做了一整套重构:

- 品牌改为 **"大学必拉榜 · 抽象校园厕所图鉴"**
- 评分 1~10 改成抽象黑话:`蚌埠住了 / 祖坟冒烟 / 麻了 / 破防 / 可 / 还行 / 顶 / 嘎嘎好 / 封神预备 / 封神`
- Tier 标语:S "封神之坑 —— 蹲此悟道",F "生化现场 —— 建议拆楼重盖"
- 加了 schema 一列 `language`,中文用户看到的榜单优先展示中国学校
- 写了 8 个中文坑位种子:**清华六教蹲式黄金屋 · 北大燕园通天厕 · 复旦邯郸学步坑 · 交大电院深夜禁忌厕所 · 武大樱顶望湖大厕 · 浙大紫金港地下迷宫厕所 · 人大明德楼禁忌之厕 · 南科理学楼三楼禁忌坑位**
- 还配上抽象锐评:"蹲到忘记自己挂了几科,封神。" / "灯一闪我以为见鬼了,蚌埠住了。"

## 八、把它做成"真"产品:一份 Word 文档

第一版上线后我发现它只是个能跑的玩具。我打开 Word,把"想要的东西"列成一份 `改进.docx`,附了三张带标注的截图:

- 主页顶部要一个**夸张的倒计时**,带标语:"投票第一名和最后一名的厕所我将亲自探访"
- 榜单卡片要**图像优先**,文字塞到下面去
- 详情页要**实拍图廊**,空文字的锐评直接隐藏
- 提交页加**封面图 + 内容图**两个上传槽
- 投票要**一人一票一坑**(还是不要登录)
- 锐评可以**点赞**,排序按"新鲜度 + 赞数"加权,赞重一点

我把文件路径丢给 AI:

> "我建了一个 `改进.docx`,读一下然后按上面的要求改。"

它直接用 pandoc 把 docx 转成 markdown 读懂了图,然后开始顺着做:

1. **Vercel Blob 接图**。一行 `vercel integration add` 不行 —— 它发现 `vercel blob create-store` 默认走交互式 prompt,在 Claude Code 这种非 TTY 环境会卡住。AI 自己翻 `--help`,找到 `--yes --environment production --environment preview --environment development` 一把把三个环境的 token 都装好。
2. **Cookie 指纹 + 唯一约束**。`proxy.ts` 给每个访客发一个 `voter_id`(httpOnly, 1 年),DB 加 `unique(bathroom_id, voter_fingerprint)` 约束,Postgres 抛 `23505` 就在 Server Action 里捕获,提示"这一坑你已经投过了"。
3. **加权排序**。`count(distinct likes) + extract(epoch from created_at) / 86400` —— 一个赞约等于一天的新鲜度。
4. **倒计时**。一个 client component 每秒 tick,用 `useEffect` 算 D/H/M/S,从 dict 里取 `daysLeftTemplate: "还剩 {n} 天截止投票"`(不能传函数过 RSC 边界 —— 上次踩过坑,这次直接用模板字符串)。

过程中又踩了两个坑:

- `drizzle-kit push` 因为我新加了 `votes` 的唯一约束,想 truncate 整张表才肯继续。AI 没硬上,改成 `scripts/migrate-2.ts` —— 用 neon 直接发 targeted `ALTER` + `IF NOT EXISTS` + `pg_constraint` 检查,把 43 张测试票完整保住。
- 词典里有几个 `(n) => string`,RSC 又抛 "Functions cannot be passed to Client Components"。AI 全改成 `"{n} days left"` 模板,客户端 `.replace("{n}", ...)` 渲染。

最后 push 完一行 `until vercel ls ... grep -qE "Ready|Error"; do sleep 8; done` 把部署等到 ● Ready,30 秒过。

## 九、上线之后还在调

上线之后我看了一眼,觉得倒计时太大了、提交表单也别扭、测试期的脏数据该清。下面这一句话:

> "将现在的倒计时框元素不变,大小调小一点;所有的发布的厕所删掉,倒计时重置。"

AI 同时干了三件:

- **缩**:p-8 → p-5,8xl 数字 → 5xl,框架/光晕/斜纹动画全留着,就是整体掉一档。
- **清**:写 `scripts/wipe-bathrooms.ts`,跑一次 `DELETE FROM bathrooms`,FK 级联把 16 个提名 + 关联的 votes / images / likes 一起清干净。
- **重置**:`VOTE_START_MS` 改到 2026-05-14 00:00 北京时间,窗口刷新到 15 天。

之前还有一个意外:第二次 push 之后 GitHub → Vercel 的自动部署不知道为什么没触发,新 commit 在 main 上趴了 12 小时没动静。AI 看到 `vercel inspect` 里 production 还指向旧 commit,直接 `vercel --prod` 手动 ship,41 秒后 ● Ready。

## 十、复盘

整个过程,我从头到尾大概只敲了不到 20 条短消息。**没写一行代码**。

最让我有感的不是 AI 速度多快,而是它会:

- **反问关键决策**(投票机制?数据库?),而不是瞎猜默认值
- **主动提示安全风险**(token 泄露要 revoke,不要写进 `.git/config`)
- **承认陷阱**(中途 build 失败,定位、修、再 build)
- **听懂"抽象"**(把英文 meme 翻译成中文 meme,而不是字面翻译)
- **不偏离主旨**(从头到尾,这就是个搞笑的厕所榜单)

## 十一、成果

- 项目地址:<https://king-of-shit.vercel.app>
- 中文版:<https://king-of-shit.vercel.app/zh>

技术栈:Next.js 16 / React 19 / Tailwind v4 / shadcn/ui / Drizzle ORM / Neon Postgres / Vercel Blob / Vercel。

时间成本:**两轮迭代,总共约 3 小时**。

代码行数(自己写的):**0 行**。

数据库现状:清场完毕,投票窗口 **2026-05-14 → 2026-05-29 23:59 北京时间**,等你来提名第一坑。
