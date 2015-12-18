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

  'GET /y.do': function (req, mock, callback) {
    if (req.query) {
      callback(200, {}, req.query.cb + '('+JSON.stringify(mock({'data': movie,'success': true}))+')');
    };    
  },

  'POST /z.do': function (req, mock, callback) {
    var pageSize = req.postData.pageSize;
    var currentPage = req.postData.currentPage;
    name['id|+1'] = pageSize * (currentPage - 1);
    var tmpl = {};
    tmpl['dataList|'+pageSize] = [name];
    tmpl['success'] = true;
    tmpl['pageSize'] = pageSize;
    tmpl['currentPage'] = currentPage;
    callback(200, {"content-type":"application/json"}, JSON.stringify(mock(tmpl)));
  },
  
  'GET /x.do': {'name': '@Name'}
};
