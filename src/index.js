import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'dora-openproxy';
import getRule from './getRule';

if (!isRootCAFileExists()) generateRootCA();

export default {
  name: 'proxy',
  'server.before'() {
    this.set('__server_listen_log', false);
  },
  'middleware.before'() {
    return new Promise(resolve => {
      const { log, query } = this;
      log.debug(`query: ${JSON.stringify(query)}`);
      const port = query && query.port || 8989;
      const proxyServer = new ProxyServer({
        type: 'http',
        port,
        hostname: 'localhost',
        rule: getRule(this),
        autoTrust: true,
      });
      proxyServer.on('finish', (err) => {
        if (err) {
          log.error(err);
        } else {
          log.info(`listened on ${port}`);
        }
        resolve();
      });
    });
  },
};
