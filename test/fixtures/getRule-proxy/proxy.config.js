
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
  'POST /page.do': function(req, mock, callback){
    callback(200, {"content-type":"application/json"}, JSON.stringify(req.query));
  },
  'GET /birthday/:year/:month/:day': function(req, mock, callback){
    callback(200, {"content-type":"application/json"}, JSON.stringify(req.params));
  },
  'POST /birthday/:id': function(req, mock, callback){
    callback(200, {"content-type":"application/json"}, JSON.stringify(req.postData));
  },
  'GET /pigcan/:id': {
    'list|5': [{
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
