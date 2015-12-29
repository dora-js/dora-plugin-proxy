var mockjs = require('mockjs');

var rules = {
  '/foo': function(req, res) {
    res.end(mockjs.mock({
      name: '@Name',
    }));
  },
};

require('fs').readdirSync(require('path').join(__dirname + '/mock'))
  .forEach((file) => {
    Object.assign(rules, require('./mock/' + file));
  });

require('./a.proxy.config')(rules);

module.exports = rules;
