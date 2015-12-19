import urlLib from 'url';
import { isRemote, isMatch, getParams } from './utils';
import { join } from 'path';
import { readFileSync } from 'fs';
import assign from 'object-assign';
import Mock from 'mockjs';
import { parse as parseUrl } from 'url';
import isPlainObject from 'is-plain-object';
import { parse as getQuery } from 'qs';

export default function(args) {
  const { cwd, proxyConfig, log } = args;

  return {
    summary() {
      return 'Anyproxy rule: dora-plugin-proxy';
    },

    shouldInterceptHttpsReq() {
      return true;
    },

    shouldUseLocalResponse(req) {
      for (const pattern in proxyConfig) {
        if (proxyConfig.hasOwnProperty(pattern)) {
          const val = proxyConfig[pattern];
          if (isMatch(req, pattern)) {
            if (typeof val === 'function') {
              return true;
            }
            if (typeof val === 'string' && !isRemote(val)) {
              return true;
            }
            if (isPlainObject(val)) {
              return true;
            }
          }
        }
      }
      return false;
    },

    dealLocalResponse(req, reqBody, callback) {
      for (const pattern in proxyConfig) {
        if (proxyConfig.hasOwnProperty(pattern)) {
          const val = proxyConfig[pattern];

          if (isMatch(req, pattern)) {
            const postDataString = reqBody.toString();
            if (postDataString) {
              req.postData = getQuery(postDataString);
            }

            const urlObj = parseUrl(req.url);
            if (urlObj.query) {
              req.query = getQuery(urlObj.query);
            }

            if (typeof val === 'function') {
              log.info(`${req.method} ${req.url} matches ${pattern}, respond with custom function`);
              req.params = getParams(req.url, pattern);
              return val(req, Mock.mock, callback);
            }
            if (typeof val === 'string' && !isRemote(val)) {
              log.info(`${req.method} ${req.url} matches ${pattern}, respond with local file`);
              callback(200, {}, readFileSync(join(cwd, val), 'utf-8'));
            }
            if (isPlainObject(val)) {
              getParams(req.url, pattern);
              return callback(200, {'content-type': 'application/json'}, JSON.stringify(Mock.mock(val)));
            }
          }
        }
      }
    },
    /**
    //=======================
    //when ready to send a request to server
    //向服务端发出请求之前
    //=======================
    */
    replaceRequestProtocol(req) {
      for (const pattern in proxyConfig) {
        if (proxyConfig.hasOwnProperty(pattern)) {
          const val = proxyConfig[pattern];
          if (isMatch(req, pattern) && val.indexOf('https://') === 0) {
            return 'https';
          }
        }
      }
      return 'http';
    },

    replaceRequestOption(req, option) {
      const newOption = option;
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

      for (const pattern in proxyConfig) {
        if (proxyConfig.hasOwnProperty(pattern)) {
          const val = proxyConfig[pattern];
          if (isMatch(req, pattern) && isRemote(val)) {
            log.info(`${req.method} ${req.url} matches ${pattern}, forward to ${val}`);
            isModified = true;
            setOption(val);
            break;
          }
        }
      }

      if (!isModified) {
        newOption.hostname = args.hostname;
        newOption.port = args.port;
        log.debug(`${req.method} ${req.url} don't match any rule, forward to ${args.hostname}:${args.port}`);
      }

      return newOption;
    },
    replaceRequestData(req, data) {
      return data;
    },
    /**
    //=======================
    //when ready to send the response to user after receiving response from server
    //向用户返回服务端的响应之前
    //=======================
    */
    replaceResponseStatusCode(req, res, statusCode) {
      return statusCode;
    },

    replaceResponseHeader(req, res, header) {
      return assign({}, header, {
        'access-control-allow-origin': '*',
      });
    },

    replaceServerResDataAsync(req, res, serverResData, callback) {
      callback(serverResData);
    },

    pauseBeforeSendingResponse() {
      return 1;
    },
  };
}
