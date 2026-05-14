# 钉钉 AI 听记（静态站）

纯静态 HTML / CSS / JavaScript 项目，无 Vite、无 React、无打包步骤。适合直接上传到任意静态托管（OSS、Nginx、GitHub Pages 等）。

## 目录约定

```text
assets/images/   # 图片（含 Figma 导出 PNG、favicon）
assets/videos/   # 本地视频 MP4（推荐 H.264 + AAC）
assets/audios/   # 可选音频素材
css/style.css    # 主样式（@import 组件样式）
css/components/  # 按区块拆分的样式
js/main.js       # 入口脚本
js/modules/      # 导航、视频、滚动动效等模块
fonts/           # 自定义字体（woff2 等）
index.html       # 站点入口（当前为单页）
```

若以后需要「关于我们」等子页面，可自行新建 `pages/` 目录，在子页中用 `../css/style.css`、`../js/main.js` 引用根目录资源即可。

## 本地预览

需要 Node.js（仅用于本地静态服务，不参与构建）：

```bash
npm install
npm run dev
```

浏览器会打开根目录 `index.html`。若未自动打开，请访问终端里提示的地址（默认 `http://127.0.0.1:5173/`）。

## 视频说明（本地文件与加载策略）

首页 Hero 使用 `<video>`，当前仅引用 **`assets/videos/hero.mp4`**（仓库内已带好，可直接部署）。

- **`preload="none"`**：首屏不预拉视频数据，减少流量与阻塞；用户点击「播放」或原生控件后再加载（仍显示 `poster` 封面）。
- **`poster`**：使用产品图，弱网下先有视觉占位。

### 推荐编码（兼容性）

- 视频：**H.264（AVC）**，`yuv420p` 像素格式。
- 音频：**AAC**。
- 容器：MP4；发布前建议加 **`-movflags +faststart`**（或无损重封装 `ffmpeg -i 源.mp4 -c copy -movflags +faststart hero.mp4`），便于边下边播。

### 检查当前文件编码（可选）

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "assets/videos/hero.mp4"
```

若显示 `hevc` 等非 H.264 编码，务必转码后再上线，否则部分浏览器无法播放。

### 以后替换演示视频时（本机需 ffmpeg）

若新素材已是 H.264 + AAC，可只做 faststart 重封装：

```bash
ffmpeg -y -i "你的源.mp4" -c copy -movflags +faststart "assets/videos/hero.mp4"
```

若需统一为 Web 友好参数，可转码（示例：最大宽 1280、CRF 23、AAC 128k）：

```bash
ffmpeg -y -i "你的源.mp4" -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset medium -crf 23 -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "assets/videos/hero.mp4"
```

## 部署

将仓库根目录下除 `node_modules` 外的文件上传至静态服务器根路径即可；`npm run dev` 仅用于开发，部署不需要 Node。

## 无障碍与动效

- 支持 `prefers-reduced-motion: reduce`：滚动进场动效会关闭，区块直接显示。
- 顶栏移动端菜单可通过 **Esc** 关闭。
