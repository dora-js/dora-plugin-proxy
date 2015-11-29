module.exports = {
  replaceRequestProtocol: function() {
    return 'https';
  },

  replaceRequestOption: function(req, option) {
    var newOption = option;
    newOption.hostname = 'a.alipayobjects.com';
    console.log(newOption);
    return newOption;
  }
};
