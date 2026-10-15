# NeverWear

面向中文用户的本地时装购物体验。Next.js App Router、TypeScript、Tailwind CSS；移动端优先。

## 运行

需要 Node.js 20.9+。首次安装：

```sh
npm ci
npm run dev
```

打开 http://localhost:3002。以后在项目目录运行 `npm run dev` 即可。开发预览固定使用独立的 3002 端口；启动前请确认该端口空闲。

生产模式与 PWA：

```sh
npm run build
npm run start
```

Service Worker 仅在生产模式注册，缓存静态资源并提供离线提示页。开发模式不缓存页面，便于及时查看修改。

## 验证

```sh
npm run lint
npm test
npm run build
```

业务测试覆盖运费/HST、鞋码换算、小时内稳定的浏览人数、物流时间边界、Toronto 月份边界、搭配引用、存储异常和下单转入衣柜。

## 本地状态

购物车、心愿单、订单、衣柜、搭配、收货偏好与最近搜索保存在此设备的 localStorage。存储不可用时仍可浏览，并在当前会话中操作。没有账户、后端、支付接口或分析脚本。NeverPay 为内置付款方式，不收集银行卡资料、不扣款、不发货。

`/account` 的“清除所有数据”需要确认，仅清除 NeverWear 自己的存储键。真实收货信息无需填写。

## 摄影

Phase 1 共 76 张 WebP：34 件商品各两张首色照片、2 张首页大片、6 张分类封面；最长边 1200px，quality 82。Atelier 新增 20 张原创照片，并采用按鞋款场合搭配的全身造型。本轮内置 imagegen 直接生成 46 张，处理期间已写入的另外 10 张鞋履图经视觉核验后复用。未生成 Phase 2；其他颜色显示对应色剪影，避免照片颜色与选择不符。

完整提示词、路径和完成状态在 `data/image-manifest.json`。生成是可续跑的，已有文件不会覆盖：

```sh
node scripts/prepare-image-manifest.mjs
node scripts/save-generated-image.mjs /absolute/path/generated.png public/products/example/c0-1.webp
```

第二条命令只接受 manifest 内的目标路径，立即转换 WebP、更新图库顺序，并移除已迁入的生成源文件。所有消费图片均在 `public/products/` 与 `public/campaign/`，不依赖外部图片地址。

## 导出与参考

衣柜搭配导出 1080×1440 PNG；月度报告导出 1080×1920 PNG。导出只在浏览器内完成，文件保存至下载目录。

需求、设计、摄影说明与六份原始 mockup 保留在 `docs/`。验收记录见 `docs/QA.md`，页面截图在 `docs/qa/`。

本工程使用 Next.js 官方支持的 Webpack 模式，因为当前执行环境限制 Turbopack CSS 子进程的端口绑定。

手机预览：运行 `npm run dev` 后，手机与电脑连接同一 Wi-Fi，访问 `http://电脑局域网IP:3002`（本机当前为 `http://10.0.0.17:3002`）。开发服务绑定 IPv4 并使用独立的 3002 端口，避免与其他项目的 3000 端口冲突。Next.js 的开发资源只允许本机实际网卡地址，IP 变化后重启服务即可。手机端普通 HTTP 也支持模拟下单和保存搭配。
