import { join } from 'path';
import { existsSync } from 'fs';

export default function getRule(args) {
  const { cwd, port, localIP: hostname, log } = args;
  const { config } = args.query || {};

  const userRuleFile = join(cwd, 'rule.js');
  if (existsSync(userRuleFile)) {
    if (log) log.info('load rule from rule.js');
    return require(userRuleFile);
  }

  const configPath = config || 'proxy.config.js';
  const userProxyFile = join(cwd, configPath);
  let proxyConfig = {};
  if (existsSync(userProxyFile)) {
    if (log) log.info(`load rule from ${configPath}`);
    proxyConfig = require(userProxyFile);
  }

  return require('./rule')({
    port,
    hostname,
    proxyConfig,
    cwd,
    log,
  });
}
