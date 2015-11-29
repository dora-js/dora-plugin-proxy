
module.exports = {
  '^/react/0.13.3/': 'https://a.alipayobjects.com/',
  '^/style.css': 'http://spmjs.io/stylesheets/',
  '.+?': 'http://dict.youdao.com/',
};

// curl http://localhost:8989/react/0.13.3/react.js -> https://a.alipayobjects.com/react/0.13.3/react.js
// curl http://localhost:8989/style.css -> http://spmjs.io/stylesheets/style.css
// curl http://localhost:8989/ -> http://dict.youdao.com/

