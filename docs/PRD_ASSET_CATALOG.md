# PRD 附录｜GitHub 素材分组与索引清单

## 1. 文档目标

本附录用于说明 [solvely-home-experiment](https://github.com/shuoxindai-blip/solvely-home-experiment) 仓库中的素材组织方式，帮助产品、设计、开发和 QA 快速确认：

- 每个素材对应哪个产品模块和示例场景。
- 开发应从哪个代码入口接入。
- 哪些文件可以在当前原型中直接使用。
- 哪些文件只是源文件或二期素材。

> “分组”是按产品场景建立的素材包，不等于文件夹。一个分组可以包含封面图、详情页、音频、字幕或文档等多个相关文件。

## 2. 索引总览

| 项目 | 数量 | 说明 |
|---|---:|---|
| 场景分组 | 19 | 按产品页面、功能和示例场景组织 |
| 本地索引文件 | 59 | `groups[].files[]` 中记录的唯一仓库文件 |
| 外部运行时资源 | 6 | `groups[].externalResources[]` 中记录的 3 个远程 HTML 和 3 张远程图片 |
| 资源引用总数 | 65 | 59 个本地文件 + 6 个外部运行时资源 |
| `runtime` | 52 | 当前原型直接加载，一期可接入 |
| `source` | 6 | 用于编辑、裁剪、重新生成或回滚，不应代替当前实现 |
| `phase_2` | 1 | Exam Prep / Diagnostic 二期素材，一期不接入 |

## 3. 开发使用规则

1. 以 `assets/catalog.json` 为素材路径、用途和状态的唯一信息源。
2. 一期实现只允许默认接入 `runtime` 文件。
3. `source` 文件仅用于重新生成运行时素材，不在页面中直接加载。
4. `phase_2` 文件需等待二期流程和页面方案确认，不得接入一期。
5. `externalResources` 中的 `runtime` 项是案例详情的必需内容，不是可选外链；远程 HTML 必须提供加载失败和重试状态。
6. 新增、删除或替换本地/外部资源后，开发必须执行 `node scripts/check-assets.mjs`，且校验结果不得包含错误或 Git 跟踪警告。

## 4. 19 个分组与 59 个本地索引文件

### 4.1 `global.mobile-download`

- 页面/模块：Global header
- 场景：移动端 App 下载入口和二维码浮层
- 代码入口：`index.html` 中的 `.app-download` / `.app-store-link`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 1 | `assets/download-on-app-store.svg` | App Store 下载徽标 | `runtime` |
| 2 | `assets/get-it-on-google-play-trimmed.png` | 当前 UI 使用的 Google Play 裁剪徽标 | `runtime` |
| 3 | `assets/get-it-on-google-play.png` | 未裁剪的 Google Play 源图 | `source` |
| 4 | `assets/solvely-mobile-qr.svg` | App 下载通用二维码 | `runtime` |

### 4.2 `study.solver.parabola-intersection`

- 页面/模块：Study · Solver
- 场景：抛物线与直线交点的互动图形
- 代码入口：`capabilityData.solver.examples[0]`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 5 | `assets/solver-parabola-intersection-cover.png` | 示例卡片封面 | `runtime` |
| 6 | `assets/simulators/parabola-linear-intersection.html` | 本地互动详情页 | `runtime` |

### 4.3 `study.solver.parallelogram-step-solution`

- 页面/模块：Study · Solver
- 场景：平行四边形 LMNO 的逐步解题
- 代码入口：`capabilityData.solver.examples[1]`
- 当前实现：题目图与视频缩略图为本地运行时素材；答案、公式与交互为原生 HTML，无外部运行时依赖

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 7 | `assets/solver-parallelogram-question.png` | 示例卡片与答案详情使用的题目图 | `runtime` |
| 8 | `assets/solver-parallelogram-video.png` | 答案详情中的视频讲解缩略图 | `runtime` |
| 9 | `assets/solver-video-intersecting-circles.png` | 上一版相交圆卡片图，仅保留用于回滚 | `source` |

### 4.4 `study.solver.chemistry-structure`

- 页面/模块：Study · Solver
- 场景：化学结构可视化
- 代码入口：`capabilityData.solver.examples[2]`
- 外部依赖：`externalResources` 中的 3 张远程化学结构图

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 10 | `assets/solver-chemistry-structure-cover.png` | 化学结构示例卡片封面 | `runtime` |
| 11 | `assets/chemistry-structure.png` | 原始紧凑版化学结构参考图 | `source` |

### 4.5 `study.solver.financial-analysis`

- 页面/模块：Study · Solver
- 场景：Financial analysis — Vertical Analysis
- 代码入口：`capabilityData.solver.examples[3]` / `accountingPreview()`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 12 | `assets/solver-financial-analysis-cover.webp` | 财务分析示例卡片封面 | `runtime` |

### 4.6 `study.graph.reflection`

- 页面/模块：Study · Graph
- 场景：图形关于 y 轴的反射
- 代码入口：`capabilityData.graph.examples[0]`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 13 | `assets/graph-reflection-over-y-axis.png` | 示例卡片封面 | `runtime` |
| 14 | `assets/simulators/reflection-over-y-axis.html` | 本地互动详情页 | `runtime` |

### 4.7 `study.graph.negative-externality`

- 页面/模块：Study · Graph
- 场景：负外部性与庇古税图表
- 代码入口：`capabilityData.graph.examples[1]`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 15 | `assets/graph-negative-externality.png` | 示例卡片封面 | `runtime` |
| 16 | `assets/simulators/negative-externality-pigouvian-tax.html` | 本地互动详情页 | `runtime` |

### 4.8 `study.graph.limits-at-infinity`

- 页面/模块：Study · Graph
- 场景：无穷远处的极限
- 代码入口：`capabilityData.graph.examples[2]`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 17 | `assets/graph-limits-at-infinity.png` | 示例卡片封面 | `runtime` |
| 18 | `assets/simulators/limits-at-infinity.html` | 本地互动详情页 | `runtime` |

### 4.9 `study.video.examples`

- 页面/模块：Study · Video
- 场景：视频学习示例卡片
- 代码入口：`capabilityData.video` / `videoPreview()`
- 外部依赖：`externalResources` 中的 3 个 Solvely 远程 video-player HTML

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 19 | `assets/video-physics.png` | Velocity & Distance Analysis 预览图 | `runtime` |
| 20 | `assets/video-statistics.png` | Reading a BMI Dotplot 预览图 | `runtime` |
| 21 | `assets/video-geometry.png` | 3D Shapes & Nets 预览图 | `runtime` |

### 4.10 `study.flashcards.examples`

- 页面/模块：Study · Flashcards
- 场景：闪卡片示例牌组
- 代码入口：`capabilityData.flashcards`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 22 | `assets/flashcards/kidney-anatomy.webp` | Human Anatomy 卡片图片 | `runtime` |
| 23 | `assets/flashcards/radial-gravitational-field.webp` | Gravitational Field 卡片图片 | `runtime` |
| 24 | `assets/flashcards/biological-psychology-motor-hierarchy.webp` | Biological Psychology 卡片图片 | `runtime` |

### 4.11 `study.quiz.examples`

- 页面/模块：Study · Quiz
- 场景：Quiz 示例题目
- 代码入口：`capabilityData.quiz`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 25 | `assets/quizzes/blood-glucose-feedback.webp` | 血糖负反馈题目图 | `runtime` |
| 26 | `assets/quizzes/fish-apparent-depth.webp` | 折射与视深度题目图 | `runtime` |
| 27 | `assets/quizzes/ionic-crystal-lattice.webp` | 离子晶格题目图 | `runtime` |

### 4.12 `study.guide.mitochondrial-dna`

- 页面/模块：Study · Study Guide
- 场景：Mitochondrial DNA 学习笔记
- 代码入口：`capabilityData.guide.examples[0]` / `renderStudyGuideMarkdown()`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 28 | `assets/study-guides/mitochondrial-dna/study_guide.md` | 完整 Study Guide 正文 | `runtime` |
| 29 | `assets/study-guides/mitochondrial-dna/repeat-replication.webp` | Repeat replication 章节卡片图 | `runtime` |
| 30 | `assets/study-guides/mitochondrial-dna/imprinting-reset.webp` | Imprinting reset 章节卡片图 | `runtime` |
| 31 | `assets/study-guides/mitochondrial-dna/prader-willi-mechanisms.webp` | Prader–Willi mechanisms 章节卡片图 | `runtime` |
| 32 | `assets/study-guides/mitochondrial-dna/maternal-inheritance.svg` | Maternal inheritance 章节卡片图 | `runtime` |
| 33 | `assets/study-guides/mitochondrial-dna/images/image_01.webp` | Markdown 正文插图 01 | `runtime` |
| 34 | `assets/study-guides/mitochondrial-dna/images/image_02.webp` | Markdown 正文插图 02 | `runtime` |
| 35 | `assets/study-guides/mitochondrial-dna/images/image_03.webp` | Markdown 正文插图 03 | `runtime` |
| 36 | `assets/study-guides/mitochondrial-dna/images/image_04.webp` | Markdown 正文插图 04 | `runtime` |
| 37 | `assets/study-guides/mitochondrial-dna/images/image_05.webp` | Markdown 正文插图 05 | `runtime` |

### 4.13 `study.guide.prehistoric-art`

- 页面/模块：Study · Study Guide
- 场景：Unit 1 Prehistoric Art
- 代码入口：`capabilityData.guide.examples[1]` / `renderStudyGuideMarkdown()`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 38 | `assets/study-guides/prehistoric-art/study_guide.md` | 完整 Study Guide 正文 | `runtime` |
| 39 | `assets/study-guides/prehistoric-art/lascaux.webp` | Lascaux 章节卡片图 | `runtime` |
| 40 | `assets/study-guides/prehistoric-art/stonehenge.webp` | Stonehenge 章节卡片图 | `runtime` |
| 41 | `assets/study-guides/prehistoric-art/terra-cotta.webp` | Terra cotta 章节卡片图 | `runtime` |
| 42 | `assets/study-guides/prehistoric-art/images/image_01.webp` | Markdown 正文插图 01 | `runtime` |
| 43 | `assets/study-guides/prehistoric-art/images/image_02.webp` | Markdown 正文插图 02 | `runtime` |
| 44 | `assets/study-guides/prehistoric-art/images/image_03.webp` | Markdown 正文插图 03 | `runtime` |

### 4.14 `study.guide.law-crime`

- 页面/模块：Study · Study Guide
- 场景：犯罪定义与刑事责任
- 代码入口：`capabilityData.guide.examples[2]` / `renderStudyGuideMarkdown()`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 45 | `assets/study-guides/law-crime/study_guide.md` | 完整 Study Guide 正文 | `runtime` |
| 46 | `assets/study-guides/law-crime/image_01.webp` | Dark figure of crime 示意图 | `runtime` |
| 47 | `assets/study-guides/law-crime/image_02.webp` | Crime rates 图表 | `runtime` |

### 4.15 `study.podcast.shared`

- 页面/模块：Study · Podcast
- 场景：Podcast 播放器共享资源
- 代码入口：`assets/podcasts/transcripts.js` / podcast dialog

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 48 | `assets/podcasts/transcripts.js` | 运行时带时间戳字幕数据 | `runtime` |
| 49 | `assets/podcasts/hosts/lexie.webp` | 主持人 Lexie 头像 | `runtime` |
| 50 | `assets/podcasts/hosts/noah.webp` | 主持人 Noah 头像 | `runtime` |
| 51 | `assets/podcasts/hosts/cardi-c.webp` | 主持人 Cardi C 头像 | `runtime` |
| 52 | `assets/podcasts/hosts/david-duck.webp` | 主持人 David Duck 头像 | `runtime` |

### 4.16 `study.podcast.unit-rates`

- 页面/模块：Study · Podcast
- 场景：Defining and Calculating Unit Rates
- 代码入口：`capabilityData.podcast.examples[0]` · `transcriptKey=unitRates`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 53 | `assets/podcasts/01_defining_and_calculating_unit_rates.mp3` | Podcast 单集音频 | `runtime` |
| 54 | `assets/podcasts/01_defining_and_calculating_unit_rates.txt` | 可编辑的带时间戳字幕源文件 | `source` |

### 4.17 `study.podcast.photosynthesis`

- 页面/模块：Study · Podcast
- 场景：Photosynthesis: Crash Course Biology #8
- 代码入口：`capabilityData.podcast.examples[1]` · `transcriptKey=photosynthesis`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 55 | `assets/podcasts/02_photosynthesis_crash_course_biology_8.mp3` | Podcast 单集音频 | `runtime` |
| 56 | `assets/podcasts/02_photosynthesis_crash_course_biology_8.txt` | 可编辑的带时间戳字幕源文件 | `source` |

### 4.18 `study.podcast.civilization`

- 页面/模块：Study · Podcast
- 场景：Foundations of Early Human Civilization
- 代码入口：`capabilityData.podcast.examples[2]` · `transcriptKey=civilization`

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 57 | `assets/podcasts/03_foundations_of_early_human_civilization.mp3` | Podcast 单集音频 | `runtime` |
| 58 | `assets/podcasts/03_foundations_of_early_human_civilization.txt` | 可编辑的带时间戳字幕源文件 | `source` |

### 4.19 `phase-2.exam-progress`

- 页面/模块：Exam Prep / Diagnostic
- 场景：Exam 学习进度与结果拆解
- 代码入口：一期不接入，需先确认二期完整流程

| # | 索引文件 | 用途 | 状态 |
|---:|---|---|---|
| 59 | `assets/progress-tracking-exam-results-sample.png` | Exam 进度与结果页面源参考图 | `phase_2` |

## 5. 6 个外部运行时资源

| # | 分组 | 类型 | 用途 | URL |
|---:|---|---|---|---|
| E1 | `study.solver.chemistry-structure` | `remote_image` | (m)-Ethylaniline 实际结构图 | [Image](https://img.justsolvely.com/chemistry-pubchem/2026_07_15_bfcc7f6ceeaa64fe224a_1784127249983.png) |
| E2 | `study.solver.chemistry-structure` | `remote_image` | SF₄ Lewis structure实际结构图 | [Image](https://img.justsolvely.com/chemistry-pubchem/2026_07_14_5dafb19eb3243e0b8432_1784066879099.png) |
| E3 | `study.solver.chemistry-structure` | `remote_image` | 2-Isopropyloxolane 实际结构图 | [Image](https://img.justsolvely.com/chemistry-pubchem/2026_07_27_631128b862b4e2c5ac59_1785170849765.png) |
| E4 | `study.video.examples` | `remote_html` | Velocity & Distance Analysis 视频详情 | [HTML](https://img.justsolvely.com/solvely-solve/html/2025_07_14_fd4e936d9081a1ec45b9g_1768557153773.html) |
| E5 | `study.video.examples` | `remote_html` | Reading a BMI Dotplot 视频详情 | [HTML](https://img.justsolvely.com/solvely-solve/html/2026_01_10_dbd6a55ef31baa12ff35_1768795344086.html) |
| E6 | `study.video.examples` | `remote_html` | 3D Shapes & Nets 视频详情 | [HTML](https://img.justsolvely.com/solvely-solve/html/2026_01_11_bc9d48edb87b30c11777_1768810149374.html) |

## 6. 验收标准

- `assets/catalog.json` 中的 `groups` 数量必须为 19。
- 所有 `groups[].files[]` 去重后的文件数量必须为 59。
- 59 个索引路径都必须在仓库中存在，且必须被 Git 跟踪。
- 素材状态计数必须为 `runtime=52`、`source=6`、`phase_2=1`。
- 所有 `runtime` 文件必须存在代码或内容引用，不得出现孤立运行时文件。
- `externalResources` 必须包含 6 个唯一 HTTPS URL：`remote_html=3`、`remote_image=3`，且每个 `runtime` URL 必须被实现代码引用。
- 执行 `node scripts/check-assets.mjs` 必须输出 `Asset catalog is complete and all runtime references resolve.`

## 7. 依赖与风险

- 视频详情和部分化学结构图使用 `img.justsolvely.com` 远程资源，上线前需确认域名、访问权限、跨域策略和长期可用性。
- Graphing Calculator 使用 GeoGebra 外部脚本，需保留网络失败的降级提示。
- 公开 GitHub 仓库当前未声明 License；进入生产前需由项目所有者确认代码和素材授权范围。
- 本地文件口径为 59；6 个远程 URL 单独纳入 `externalResources`。两者合计为 65 个资源引用。
