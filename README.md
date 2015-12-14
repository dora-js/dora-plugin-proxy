# dora-plugin-proxy

Proxy plugin for dora.

----

## Usage

```bash
$ npm i dora dora-plugin-proxy -SD
$ ./node_modules/.bin/dora --plugins proxy
```

## Config

可通过在项目目录新增 `proxy.config.js` 来定制 proxy 规则。

样例：

```javascript
module.exports = {

  // 来自 assets.server 的请求会被 pass 到 https://a.alipayobjects.com/
  'GET https://assets.server/*': 'https://a.alipayobjects.com/',
  
  // /api/ 下的所有请求通过自定义的 mock 函数进行处理
  '/api/*': function(req, callback) {
    callback(200, {}, JSON.stringify({status:200}));
  },
  
  // 用本地文件替换某个请求
  'POST /assets/biz/0.1.0/index.js': './path/to/localFile',
};
```
