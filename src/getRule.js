import { join } from 'path';
import { existsSync } from 'fs';

export default function getRule(args) {
  const { cwd, port, localIP: hostname, log } = args;

  const userRuleFile = join(cwd, 'rule.js');
  if (existsSync(userRuleFile)) {
    log && log.info('load rule with rule.js');
    return require(userRuleFile);
  }

  const userProxyFile = join(cwd, 'proxy.config.js');
  let proxyConfig = {};
  if (existsSync(userProxyFile)) {
    log && log.info('load rule with proxy.config.js');
    proxyConfig = require(userProxyFile);
  }

  return require('./rule')({
    port,
    hostname,
    proxyConfig,
    cwd,
  });
}
