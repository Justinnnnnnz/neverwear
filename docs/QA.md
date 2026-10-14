# 核心站点验收

日期：2026-10-14，America/Toronto。

- `npm run lint`、`npm test`（8 项）、`npm run build` 均通过。
- 生产模式 Lighthouse accessibility：首页 100，商品详情页 100。
- 390px 与 1440px：实测首页 → 分类 → 筛选/排序 → PDP → 选色/选码 → 加购 → 结算 → 订单追踪 → 衣柜 → 报告。
- 两种宽度另检查 New In、Sale、心愿单、购物车空态、结算空态、订单列表、账户、尺码表和 404；所有页面 scrollWidth 不超过 clientWidth。360px 首页、分类和新品页也无横向溢出。
- 售罄尺码禁选；不同颜色不会复用首色图片；未选码会提示并聚焦尺码选择。
- 桌面购物车抽屉支持规格、数量编辑；手机筛选使用底部弹层。
- 心愿单移入购物车需先选有效规格；整页导航后状态保留。
- 两件商品达到 $300 赠品门槛。$189 商品标准配送总额 $213.57；Express 总额 $241.82，HST 包含运费。
- 下单后清空购物车，每件商品按数量加入衣柜；新订单不会破坏已保存的搭配引用。
- 实际导出并检查 PNG：完整搭配 1080×1440，月度报告 1080×1920。
- 最近搜索、鞋码单位偏好持久化；清除操作弹出确认，取消后订单保留。
- 最终浏览器流程未发现 console error。
- Phase 1 核心摄影 56/56，WebP quality 82，最长边 ≤1200px，总计约 3.54 MB；未生成 Phase 2。

页面截图：`qa/home-desktop.jpg`、`qa/home-mobile.jpg`、`qa/pdp-desktop.jpg`。

小灰字的原设计 token 保留为 `--faint`。白底说明文字采用稍深的 #75726D，以满足 AGENTS.md 的 4.5:1 对比度硬规则；黑底页脚仍使用原 token。

## Atelier 与 heels styling 验收

- 十件 Atelier 产品 p25–p34 与提供的数据一致；核心 p01–p24 数据与更新前逐项一致。
- `/atelier` 十款，`/c/heels` 十五款，首页专区按 p25、p26、p29、p31 排列；mules 为两款，p34 的 3cm 跟高归入低跟筛选。
- 实测 p25 选 US 8、加购、NeverPay 模拟结算，含 HST 总额 $1,237.35；订单进入追踪页并加入衣柜。
- 390px、1440px 检查两处列表，无横向滚动；十五张鞋履卡片均正确加载 c0-1，浏览器无 console error。
- 新增 Atelier 摄影 20/20，其中十张上身照首次生成即使用指定穿搭。另替换五张核心上身照和高跟鞋分类封面，共六张重生成；十张 Atelier 上身照无需重复生成，指定十六张全部符合新造型。
- 全部 c0-2 文件逐一与 Atelier 摄影提交进行二进制比较，保持不变。
- 76 张 Phase 1 图片总计约 4.26 MB，WebP q82，最长边 ≤1200px，无 EXIF；未生成 Phase 2。清除了 `.next/cache/images`。
- 最终提示词保存在 `data/image-manifest.json`，通过内置 imagegen 生成；所有最终资源位于 `public/products/` 与 `public/campaign/`。

截图：`qa/atelier-mobile.jpg`、`qa/atelier-desktop.jpg`。

## Desktop mega menu 修复验收

- 1440px / 1024px：Enter、Space、ArrowDown 可展开；ArrowDown 聚焦首项，Tab 顺序通过链接，Escape 关闭并返回原分类入口。
- 两种宽度实测子分类点击、查询参数导航、浏览器 back/forward 后菜单关闭；外部点击关闭，无 console error。
- 组件交互测试验证 hover 展开、移出后 150ms 延迟、移入面板取消定时器、移出入口与面板后关闭，以及 link/outside/pathname/searchParams 重置。该测试在临时 jsdom 环境中运行，未添加运行时依赖。
- 菜单和分类页导航均为三行纵向填充，第四项进入第二列；列距 48px、行距 12px。菜单为绝对定位覆盖层，展开前后页面内容坐标一致，205px 高度（3 × 44px 触摸目标 + 2 × 12px 行距 + 48px padding + 1px border）。
- 统一品类中文标签覆盖菜单、分类导航、过滤器、PDP 和面包屑；过滤值仍使用原 slug，未知 slug 在开发环境警告并回退。
- 截图：`qa/mega-menu-1440.jpg`、`qa/mega-menu-1024.jpg`。
