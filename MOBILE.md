# 写作日历 Android 1.0.0

本版已实现：手机/折叠屏响应式布局、免登录查看归档内容、内置离线数据、后台下载云端内容、本机自动保存草稿、同题多版本重写、计时/字数、错点自测、模板笔记、收藏、字号、JSON 导出导入、界面更新检查。

**尚未实现：GitHub 登录与自动续期、手机草稿自动上传、多端草稿同步。** 当前没有已部署的 OAuth 交换服务和这个应用的 GitHub Client Secret。GitHub 连接器授权不能作为 APK 的登录凭据。读取公开仓库无需登录，不能因此宣称云端写入已完成。

云端写入的后续接入：独立 GitHub App 授权端点 → 浏览器授权（PKCE + state）→ HTTPS 回调 → 应用；原生 Android Keystore 加密保存凭据；服务端交换并轮换 refresh token；并发刷新加锁；网络错误保留会话；401 先刷新后重试，403 单独报告权限；写每篇独立 JSON，使用 SHA 乐观锁，冲突保留版本。Client Secret 仅放服务器环境变量，不放 APK/公开仓库。完成部署和真机登录、过期续期测试前不开放虚假的“已同步”状态。

归档内容的来源仍为根 index.html。每次变更后运行 `node scripts/build-mobile.mjs`；工作流也会生成 mobile/data.json 和 version.json。APK 校验更新清单中的 SHA-256 后下载完整界面，在下次 Activity 创建时使用；写作期间不刷新。页面源使用固定 HTTPS origin，因此更新不会换本机存储空间。安装包升级保持 applicationId=com.butusun.writing 和原始签名，递增 versionCode。卸载或清除应用数据会删除本机草稿，请先导出备份。

Android 8+；不依赖 Google Play 服务。没有使用真实 Mate X6 或 Android 模拟器验证，安装、键盘、文件导入导出及网络可达性还需真机验收。编译及签名检查通过不代表真机测试通过。

构建方式：配置 android/build.sh 中要求的 SDK、ECJ、外部签名文件环境变量，从项目根目录运行 `bash android/build.sh`。签名密钥必须私人备份，不得加入此公开仓库。
