import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  generateRootCA,
} from 'dora-anyproxy';
import getRule from './getRule';

if (!isRootCAFileExists()) generateRootCA();

export default {
  'name': 'proxy',
  'server.before'() {
    this.set('__server_listen_log', false);
  },
  'server.after'() {
    const { log, query } = this;
    const port = query && query.port || 8989;
    const proxyServer = new ProxyServer({
      type: 'http',
      port,
      hostname: 'localhost',
      rule: getRule(this),
    });

    proxyServer.on('finish', (err) => {
      if (err) {
        log.error(err);
      } else {
        log.info(`listened on ${port}`);
      }
      this.callback();
    });
  },
};
