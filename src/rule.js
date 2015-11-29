import urlLib from 'url';
import { isRemote, isMatch } from './utils';
import { join } from 'path';

export default function(args) {

  const { proxyConfig } = args;

  return {
    summary: function() {
      return 'Anyproxy rule: dora-plugin-anyproxy';
    },

    shouldInterceptHttpsReq: function (req) {
      return true;
    },

    shouldUseLocalResponse: function (req, reqBody) {
      return false;
    },

    dealLocalResponse: function (req, reqBody, callback) {
      callback(statusCode, resHeader, responseData)
    },

    //=======================
    //when ready to send a request to server
    //向服务端发出请求之前
    //=======================

    replaceRequestProtocol: function (req, protocol) {
      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req.url, pattern) && val.indexOf('https://') === 0) {
          return 'https';
        }
      }
      return 'http';
    },

    replaceRequestOption: function (req, option) {
      let newOption = option;
      let isModified = false;
      const reqObj = urlLib.parse(req.url);

      function setOption(val) {
        const { hostname, port, path } = urlLib.parse(val);
        newOption.hostname = hostname;
        if (port) {
          newOption.port = port;
        }
        newOption.path = join(path, reqObj.path);
        delete newOption.headers.host;
      }

      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req.url, pattern) && isRemote(val)) {
          isModified = true;
          setOption(val);
          break;
        }
      }

      if (!isModified) {
        newOption.hostname = args.hostname;
        newOption.port = args.port;
      }

      return newOption;
    },

    replaceRequestData: function (req, data) {
      return data;
    },

    //=======================
    //when ready to send the response to user after receiving response from server
    //向用户返回服务端的响应之前
    //=======================

    replaceResponseStatusCode: function (req, res, statusCode) {
      return statusCode;
    },

    replaceResponseHeader: function (req, res, header) {
      var newHeader = header;
      newHeader['access-control-allow-origin'] = '*';
      return newHeader;
    },

    replaceServerResDataAsync: function (req, res, serverResData, callback) {
      callback(serverResData);
    },

    pauseBeforeSendingResponse: function (req, res) {
      return 1;
    },

  };

}
