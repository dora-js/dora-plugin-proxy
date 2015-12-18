
var movie = {
  'id|+1': 1,
  'name': '@Name',
};
module.exports = {
  'GET /react/:id/*': 'https://a.alipayobjects.com/',
  'GET /style.css': 'http://spmjs.io/stylesheets/',
  'GET /func': function(req, mock, callback) {
    callback(200, {}, '1');
  },
  'GET /pigcan/:id': {
    'list|1-10': [{
      'id|+1': 1
    }]
  },
  'GET /movies': {
    'data|5': [movie],
    'success': true,
  },
  'GET /movie/:id': {
    'data': movie,
    'success': true,
  },
  'GET /local': './local'
};
