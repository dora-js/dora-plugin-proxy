# dora-plugin-proxy 入门

dora-plugin-proxy 基于代理服务器实现，用于在线调试和数据 mock 。

原理见下图：

![](https://os.alipayobjects.com/rmsportal/jJhqZjCWATWjdvX.png)

使用仅需两步：

1. 让请求流向 proxy server
2. 让请求流出 proxy server (通过规则配置)

## 流向 proxy server

这个有多种方式，不同浏览器不同操作系统的配置方式都不一样。比如：

- Chrome 下通过插件 SwitchyOmega 实现，详见[在线调试](https://github.com/dora-js/dora-plugin-proxy/blob/master/docs/online-debug.md)
- iOS 下通过配系统代理
- Android 下通过 [ProxyDroid](https://play.google.com/store/apps/details?id=org.proxydroid) 实现

## 流出 proxy server

通过在项目目录新增 `proxy.config.js` 来实现。

比如上图中的规则配置要求如下：

- a.com -> d.com
- b.com/api/* -> 本地的 ./mock 目录
- b.com/assets/* -> dora server
- c.com/data -> 本地文件

那么 `proxy.config.js` 配置基本如下：

```javascript
module.exports = {
  'http://a.com/': 'http://d.com',
  'http://b.com/api/*': mapToMockFunc,
  'http://c.com/data': './data.json',
};

// http://b.com/assets/* 无需配置，默认会 fallback 到 dora 服务器
```

详见：[更多的规则示例](https://github.com/dora-js/dora-plugin-proxy#规则定义)。

## 场景分析

### 在线调 alipay.com

**场景：**

用户访问 http://alipay.com/index.htm, 页面加载了 https://a.alipayobjects.com/home/0.1.0/index.js, 然后这个 js 又访问了 http://alipay.com/api/users/1 接口。

**需求：**

本地调试 api 接口和 js 文件，实时生效。

- alipay.com/index.html 要求是线上的
- alipay.com/api/users/1 代理到本地 mock 目录
- a.alipayobject.com/home/0.1.0/index.js 代理到本地 dora server

**解决：**

配置 alipay.com 和 a.alipayobjects.com 到 Proxy Server，然后 `proxy.config.js` 文件如下：

```javascript
var mockjs = require('mockjs');
module.exports = {
  'http://alipay.com/index.html': 'http://alipay.com/',
  'GET api/users/:id': mockjs.mock({name: '@Name'}),
};

// home/0.1.0/index.js 无需配置，默认会 fallback 到 dora 服务器
```
