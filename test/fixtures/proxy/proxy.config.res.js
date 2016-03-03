module.exports = {
  '/test/res/json': function(req, res) {
    res.json({
      query: req.query,
    });
  },

  '/test/res/jsonp': function(req, res) {
    res.jsonp({
      query: req.query,
    });
  }
};
