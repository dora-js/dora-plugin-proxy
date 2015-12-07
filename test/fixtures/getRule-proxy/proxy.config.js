
module.exports = {
  'GET /react/:id/*': 'https://a.alipayobjects.com/',
  'GET /style.css': 'http://spmjs.io/stylesheets/',
  'GET /func': function(req, callback) {
    callback(200, {}, '1');
  },
  'GET /local': './local',
};
