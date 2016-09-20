
module.exports = {
  // Forward
  'GET /react/:id/*': 'https://a.alipayobjects.com/',

  // Forward with path
  'GET /card_min_9f4a07ca.css': 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/mancard/css/',

  // Forward with subPath
  // https://g.alicdn.com/tb-page/taobao-home/0.0.50/index.css
  'GET /someDir/(.*)': 'https://g.alicdn.com/tb-page/taobao-home/',

  // 本地文件
  'GET /test-local': './local',

  // 不解析 mockjs
  '/test-object': {
    name: '@Name',
    'id+1': 1,
    a: 2
  },

  '/test-array': [
    1, 2
  ],

  // 测试参数和 body
  '/test-func/:action/:id': function(req, res) {
    res.end({
      body: req.body,
      params: req.params,
      query: req.query,
    });
  },

};
