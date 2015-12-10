import urlLib from 'url';
import { isRemote, isMatch } from './utils';
import { join } from 'path';
import { readFileSync } from 'fs';
import assign from 'object-assign';

export default function(args) {
  const { cwd, proxyConfig } = args;

  return {
    summary: function() {
      return 'Anyproxy rule: dora-plugin-proxy';
    },

    shouldInterceptHttpsReq: function (req) {
      return true;
    },

    shouldUseLocalResponse: function (req, reqBody) {
      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req, pattern)) {
          if (typeof val === 'function') {
            return true;
          }
          if (typeof val === 'string' && !isRemote(val)) {
            return true;
          }
        }
      }
      return false;
    },

    dealLocalResponse: function (req, reqBody, callback) {
      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req, pattern)) {
          if (typeof val === 'function') {
            return val(req, callback);
          }
          if (typeof val === 'string' && !isRemote(val)) {
            callback(200, {}, readFileSync(join(cwd, val), 'utf-8'));
          }
        }
      }

      //callback(statusCode, resHeader, responseData)
    },

    //=======================
    //when ready to send a request to server
    //向服务端发出请求之前
    //=======================

    replaceRequestProtocol: function (req, protocol) {
      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req, pattern) && val.indexOf('https://') === 0) {
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

        // Fix anyproxy's problem
        delete newOption.headers.host;
      }

      for (var pattern in proxyConfig) {
        const val = proxyConfig[pattern];
        if (isMatch(req, pattern) && isRemote(val)) {
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
      return assign({}, header, {
        'access-control-allow-origin': '*'
      });
    },

    replaceServerResDataAsync: function (req, res, serverResData, callback) {
      callback(serverResData);
    },

    pauseBeforeSendingResponse: function (req, res) {
      return 1;
    },

  };

}
