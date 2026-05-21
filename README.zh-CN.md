<p align="center">
  <img src="docs/icon.png" alt="EchoBird" width="140" />
</p>

<h1 align="center">EchoBird</h1>

<p align="center"><strong>AI 部署,不再是先有鸡还是先有蛋。</strong></p>

<p align="center">
  <a href="https://github.com/edison7009/EchoBird/releases">
    <img src="https://img.shields.io/github/v/release/edison7009/EchoBird?style=flat-square&color=D97757" alt="Release" />
  </a>
  <img src="https://img.shields.io/badge/%E5%B9%B3%E5%8F%B0-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square" alt="平台" />
  <img src="https://img.shields.io/badge/%E6%8A%80%E6%9C%AF-Tauri%20%2B%20Rust-orange?style=flat-square" alt="Tauri + Rust" />
  <img src="https://img.shields.io/github/license/edison7009/EchoBird?style=flat-square" alt="AGPL-3.0-or-later 许可" />
</p>

<p align="center">
  <a href="https://echobird.ai">官网</a> ·
  <a href="https://github.com/edison7009/EchoBird/releases/latest">下载</a> ·
  <a href="README.md">English README</a>
</p>

---

## 这是什么

很多朋友让我帮他们安装 **Claude Code**、**OpenClaw**、**Hermes Agent**……不但每个人的系统都不一样,甚至有些人还抠门到不愿花钱买大模型,安装和解释起来都特别费劲。于是我开发了这个叫「EchoBird」的 Agent —— 灵感来自《赛博朋克 2077》里那位聪慧过人、总能帮主角搞定一切技术难题的天才女助理 **Songbird**…

## 亮点

EchoBird 提供 **4 大场景**,共享一个 **模型数据中枢** —— **一处配置,四处生效**。

### 4 大场景

- **安装与修复** —— 让 AI 帮你安装与修复主流 AI 工具(Claude Code、OpenClaw、Hermes Agent 等);本地与远程都支持
- **一键本地大模型** —— 内置 vLLM / SGLang / llama.cpp 三引擎,选好量化版本按下 START 就能跑
- **我的 AI 项目** —— 你自己 Vibe Coding 的应用或游戏,在 EchoBird 里统一接入与管理
- **应用管理** —— 所有跟 AI / Agent 有关的应用或游戏一键启动与管理

### 共享地基

- **模型中心** —— 统一的模型数据中枢(OpenAI / Anthropic / 本地 LLM / API Router);一处配置好,4 大场景立即生效;附带一键测速,使用前看清真实延迟

**跨平台** —— Windows、macOS、Linux(x64 + arm64)

## 界面截图

### AI 资讯 & 明星项目 —— 每天的 AI 简报

> 白天和晚上,左右对照看一眼 —— 下面其他截图会跟着你 GitHub 的主题切换。

<table>
<tr>
  <td width="50%"><img src="docs/screenshots/news-cn-light.png" alt="AI 资讯(浅色)" /></td>
  <td width="50%"><img src="docs/screenshots/news-cn-dark.png" alt="AI 资讯(深色)" /></td>
</tr>
<tr>
  <td align="center"><sub>☀️ 浅色主题</sub></td>
  <td align="center"><sub>🌙 深色主题</sub></td>
</tr>
</table>

### 模型中心 —— 模型数据中枢,一处配置,四处生效

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/model-cn-dark.png">
  <img alt="模型中心" src="docs/screenshots/model-cn-light.png" width="100%">
</picture>

### 应用管理 —— 所有 AI / Agent 应用一键启动与管理

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/app-cn-dark.png">
  <img alt="应用管理" src="docs/screenshots/app-cn-light.png" width="100%">
</picture>

### 本地大模型 —— 在自己机器上跑

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/localllm-cn-dark.png">
  <img alt="本地大模型" src="docs/screenshots/localllm-cn-light.png" width="100%">
</picture>

### 安装与修复 —— 用对话搞定部署和排障

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/agent-cn-dark.png">
  <img alt="安装与修复" src="docs/screenshots/agent-cn-light.png" width="100%">
</picture>

## 安装

### 一行命令安装

**Windows**(PowerShell)

```powershell
irm https://echobird.ai/install.ps1 | iex
```

**macOS / Linux**

```sh
curl -fsSL https://echobird.ai/install.sh | sh
```

脚本会自动识别你的系统,下载对应的安装包,如果你已经是最新版会自动跳过。

### 或者下载安装包

最新版本 → <https://github.com/edison7009/EchoBird/releases/latest>

| 平台 | 安装包 |
|---|---|
| Windows x64 | `EchoBird_<ver>_Windows_x64-setup.exe` |
| macOS(Apple Silicon) | `EchoBird_<ver>_macOS_arm64.dmg` |
| Linux x64 · Debian/Ubuntu | `EchoBird_<ver>_Linux_x64.deb` |
| Linux arm64 · Debian/Ubuntu | `EchoBird_<ver>_Linux_arm64.deb` |
| Linux x64 · Fedora/RHEL | `EchoBird_<ver>_Linux_x64.rpm` |
| Linux arm64 · Fedora/RHEL | `EchoBird_<ver>_Linux_arm64.rpm` |

## 协议与商标

**代码** —— EchoBird 采用
[GNU Affero 通用公共许可证 v3 或更高版本 (AGPL-3.0-or-later)](LICENSE) 发布。
任何 fork、修改版本或基于本代码部署的托管服务,都必须同样以 AGPL-3.0 开源 ——
**SaaS 部署也不例外**。完整文本见 [LICENSE](LICENSE),署名要求见 [NOTICE](NOTICE)。

**品牌** —— *EchoBird* 与 *Model Nexus / 模型中心* 为 edison7009 的普通法商标。
**Fork 欢迎 —— 无需抹掉我们的名字和 Logo**。如果你的 fork 在 README / About 页面 /
产品页诚实标注 EchoBird 为上游,可以保留我们的身份可见(例:"EchoBird 社区版 by X");
如果你坚持完全重新品牌化也可以,改名 + 替换 Logo,但 NOTICE 中保留致谢。硬底线只有
两条:**未授权的商业 SaaS / 应用商店产品字面挂我们的商标**;以及**把代码当作你
从零写的原创发布**。Fork 之上你新增的原创代码归你,你想怎么命名都行。完整政策见
[TRADEMARKS.md](TRADEMARKS.md)。

---

<p align="center">
  Made with 💚 by EchoBird Team<br>
  <sub>⭐ <a href="https://github.com/edison7009/EchoBird">在 GitHub 上点个 Star</a> · <a href="README.md">English README</a></sub>
</p>
