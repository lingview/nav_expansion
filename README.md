# 标签页助手 (nav_expansion)

一个 Chrome 浏览器扩展，允许用户自定义新标签页的跳转地址，提供流畅的页面加载体验。

## 功能特性

- **自定义跳转**：将新标签页重定向到任意指定 URL
- **背景色定制**：支持自定义加载背景色，减少页面切换时的视觉闪烁
- **预设配色**：内置 8 种常用背景色预设（白色、浅灰、深蓝黑、纯黑等）
- **平滑过渡**：iframe 加载完成后淡入显示，提升用户体验
- 

## 项目结构

```
├── manifest.json          # 扩展配置文件
├── background.js          # 后台服务脚本
├── newtab.html           # 新标签页入口
├── newtab.js             # 新标签页逻辑
├── theme.js              # 主题样式管理
├── options.html          # 设置页面
├── options.js            # 设置页面逻辑
└── icons/
    └── icon.png          # 扩展图标
```

## 安装
首先解压下载到的压缩包
![image.png](https://lingview.xyz/file/8a02cdf6c006432f9658ed8a5586cf58)

进入chrome的扩展管理，打开开发者模式，然后点击加载未打包的扩展程序，并且选择打包后的路径
![image.png](https://lingview.xyz/file/27f00e6f25ad44dc8c57f75582ff70bd)

![image.png](https://lingview.xyz/file/d640d77c5fc84c4392ce2e1c39656037)

然后就可以看到已经加载成功

![image.png](https://lingview.xyz/file/905f18fdebbe4b86a6dd094dc57f5ce4)


## 使用
先把扩展固定在快捷栏（推荐）然后点击扩展图标可以设置自定义页面的url，点击保存后自动生效

![image.png](https://lingview.xyz/file/feb63c5af07d476fb569f4fea4cc242c)

![image.png](https://lingview.xyz/file/224ce457fa3d4140aacc57a55e960696)

![image.png](https://lingview.xyz/file/d1de0a2d068f4dc4b2947775054c0980)

![image.png](https://lingview.xyz/file/45b201db986a4ad681f0ad285e75f94c)

## 原理解析

**工作流程：**
```
用户打开新标签页
  ↓
浏览器加载 newtab.html (通过 chrome_url_overrides)
  ↓
执行 theme.js (同步)
  读取 localStorage 中缓存的背景色
  覆盖 <style id="theme"> 设置背景色
  ↓
执行 newtab.js (异步)
  读取 chrome.storage.local 中的 redirectUrl 和 bgColor
  更新 localStorage 缓存供下次使用
  设置 iframe.src 开始加载目标页
  ↓
iframe 加载完成
  触发 load 事件
  iframe 淡入显示 (opacity: 0 → 1)
```

**关键代码：**

**newtab.js**
```js
const frame = document.getElementById('contentFrame');

chrome.storage.local.get(['redirectUrl', 'bgColor'], (result) => {
  const url = result.redirectUrl?.trim() || 'https://nav.lingview.xyz';
  const bg  = result.bgColor || '#ffffff';

  localStorage.setItem('bgColor', bg);

  frame.addEventListener('load', () => {
    frame.classList.add('loaded');
  }, { once: true });

  frame.src = url;
});
```
**background.js**
```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['bgColor'], (result) => {
    if (!result.bgColor) {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
});
```
