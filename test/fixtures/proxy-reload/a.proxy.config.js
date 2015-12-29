
module.exports = function(rules) {
  rules['/bar'] = function(req, res) {
    res.end('bar');
  };
};
