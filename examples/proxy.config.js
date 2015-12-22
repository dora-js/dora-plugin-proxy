var Mock = require('mockjs');
var Qs = require('qs');

var movie = {
  'id|+1': 1,
  'name': '@Name',
};

var name = {
  'id|+1': 1,
  'first': '@FIRST',
  'last': '@LAST',
};


module.exports = {

  'GET /y.do': function (req, res) {
    res.status(200);
    res.jsonp(Mock.mock({'data': movie,'success': true}), 'cb');
  },

  'POST /z.do': function (req, res) {
    var postData = Qs.parse(req.body);
    var pageSize = postData.pageSize;
    var currentPage = postData.currentPage;
    name['id|+1'] = pageSize * (currentPage - 1);
    var tmpl = {};
    tmpl['dataList|'+pageSize] = [name];
    tmpl['success'] = true;
    tmpl['pageSize'] = pageSize;
    tmpl['currentPage'] = currentPage;
    res.json(Mock.mock(tmpl));
  },
  
  'GET /x.do': Mock.mock({'name': '@Name'})
};
