import { join } from 'path';
import { existsSync } from 'fs';

export default function getRule(args) {
  const { cwd, port, localIP: hostname } = args;

  const userRuleFile = join(cwd, 'rule.js');
  if (existsSync(userRuleFile)) {
    return require(userRuleFile);
  }

  const userProxyFile = join(cwd, 'proxy.config.js');
  let proxyConfig = {};
  if (existsSync(userProxyFile)) {
    proxyConfig = require(userProxyFile);
  }

  return require('./rule')({
    port,
    hostname,
    proxyConfig,
    cwd,
  });
}
