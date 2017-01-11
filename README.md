# dora-plugin-proxy

[![NPM version](https://img.shields.io/npm/v/dora-plugin-proxy.svg?style=flat)](https://npmjs.org/package/dora-plugin-proxy)
[![Build Status](https://img.shields.io/travis/dora-js/dora-plugin-proxy.svg?style=flat)](https://travis-ci.org/dora-js/dora-plugin-proxy)
[![Coverage Status](https://img.shields.io/coveralls/dora-js/dora-plugin-proxy.svg?style=flat)](https://coveralls.io/r/dora-js/dora-plugin-proxy)
[![NPM downloads](http://img.shields.io/npm/dm/dora-plugin-proxy.svg?style=flat)](https://npmjs.org/package/dora-plugin-proxy)

Proxy plugin for dora.

----

**📢 本库已久未维护。如遇 API mock 问题，建议考虑 [roadhog](https://github.com/sorrycc/roadhog)，支持类似的 [mock 方案](https://github.com/sorrycc/roadhog#mock)，更强大功能，更少 bug。**

----

## Usage

```bash
$ npm i dora dora-plugin-proxy -SD
$ ./node_modules/.bin/dora --plugins proxy
```

## Docs

- [使用入门](./docs/get-started.md)
- [在线调试](./docs/online-debug.md)

## 参数

### port

代理服务器端口号。

### watchDirs

定义哪些目录下的规则定义可以实时刷新。

### watchDelay

目录监听延迟，默认：300 毫秒。

## 规则定义

在项目目录新增 `proxy.config.js` 可定制 proxy 规则。

样例：

```javascript
module.exports = {
  // Forward 到另一个服务器
  'GET https://assets.daily/*': 'https://assets.online/',

  // Forward 到另一个服务器，并指定路径
  'GET https://assets.daily/*': 'https://assets.online/v2/',
  
  // Forward 到另一个服务器，不指定来源服务器
  'GET /assets/*': 'https://assets.online/',
  
  // Forward 到另一个服务器，并指定子路径
  // 请求 /someDir/0.0.50/index.css 会被代理到 https://g.alicdn.com/tb-page/taobao-home, 实际返回 https://g.alicdn.com/tb-page/taobao-home/0.0.50/index.css
  'GET /someDir/(.*)': 'https://g.alicdn.com/tb-page/taobao-home',

  // 本地文件替换
  'GET /local': './local.js',
  
  // Mock 数据返回
  'GET /users': [{name:'sorrycc'}, {name:'pigcan'}],
  'GET /users/1': {name:'jaredleechn'},
  
  // Mock 数据，基于 mockjs
  'GET /users': require('mockjs').mock({
    success: true,
    data: [{name:'@Name'}],
  }),
  
  // 通过自定义函数替换请求
  '/custom-func/:action': function(req, res) {
    // req 和 res 的设计类 express，http://expressjs.com/en/api.html
    //
    // req 能取到：
    //   1. params
    //   2. query
    //   3. body
    // 
    // res 有以下方法：
    //   1. set(object|key, value)
    //   2. type(json|html|text|png|...)
    //   3. status(200|404|304)
    //   4. json(jsonData)
    //   5. jsonp(jsonData[, callbackQueryName])
    //   6. end(string|object)
    //
    // 举例：
    res.json({
      action: req.params.action,
      query: req.query,
    });
  },
};
```

