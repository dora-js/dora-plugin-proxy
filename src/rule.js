var urlLib = require('url');

module.exports = function(opt) {

  return {
    summary: function() {
      return 'Anyproxy rule: dora-plugin-anyproxy';
    },

    shouldInterceptHttpsReq: function (req) {
      return true;
    },

    //是否在本地直接发送响应（不再向服务器发出请求）
    //whether to intercept this request by local logic
    //if the return value is true, anyproxy will call dealLocalResponse to get response data and will not send request to remote server anymore
    //req is the user's request sent to the proxy server
    shouldUseLocalResponse: function (req, reqBody) {
      return false;
    },

    //如果shouldUseLocalResponse返回true，会调用这个函数来获取本地响应内容
    //you may deal the response locally instead of sending it to server
    //this function be called when shouldUseLocalResponse returns true
    //callback(statusCode,resHeader,responseData)
    //e.g. callback(200,{"content-type":"text/html"},"hello world")
    dealLocalResponse: function (req, reqBody, callback) {
      callback(statusCode, resHeader, responseData)
    },


    //=======================
    //when ready to send a request to server
    //向服务端发出请求之前
    //=======================

    //替换向服务器发出的请求协议（http和https的替换）
    //replace the request protocol when sending to the real server
    //protocol : "http" or "https"
    replaceRequestProtocol: function (req, protocol) {
      var newProtocol = 'http';
      return newProtocol;
    },

    //替换向服务器发出的请求参数（option)
    //option is the configuration of the http request sent to remote server. You may refers to http://nodejs.org/api/http.html#http_http_request_options_callback
    //you may return a customized option to replace the original one
    //you should not overwrite content-length header in options, since anyproxy will handle it for you
    replaceRequestOption: function (req, option) {
      var newOption = option;

      if (urlLib.parse(req.url).path.indexOf(opt.rootDir) === 0) {
        newOption.hostname = opt.hostname;
        newOption.port = opt.port;
      }
      return newOption;
    },

    //替换请求的body
    //replace the request body
    replaceRequestData: function (req, data) {
      return data;
    },

    //=======================
    //when ready to send the response to user after receiving response from server
    //向用户返回服务端的响应之前
    //=======================

    //替换服务器响应的http状态码
    //replace the statusCode before it's sent to the user
    replaceResponseStatusCode: function (req, res, statusCode) {
      var newStatusCode = statusCode;
      return newStatusCode;
    },

    //替换服务器响应的http头
    //replace the httpHeader before it's sent to the user
    //Here header == res.headers
    replaceResponseHeader: function (req, res, header) {
      var newHeader = header;
      newHeader['access-control-allow-origin'] = '*';
      return newHeader;
    },

    //替换服务器响应的数据
    //replace the response from the server before it's sent to the user
    //you may return either a Buffer or a string
    //serverResData is a Buffer, you may get its content by calling serverResData.toString()
    replaceServerResDataAsync: function (req, res, serverResData, callback) {
      callback(serverResData);
    },

    //Deprecated
    // replaceServerResData: function(req,res,serverResData){
    //     return serverResData;
    // },

    //在请求返回给用户前的延迟时间
    //add a pause before sending response to user
    pauseBeforeSendingResponse: function (req, res) {
      var timeInMS = 1; //delay all requests for 1ms
      return timeInMS;
    }

  };

};
